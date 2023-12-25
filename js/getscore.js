const getscore=document.getElementById('getscore');
const b30=document.getElementById('b30');
const AIsauce=document.getElementById('AIsauce');
const GradeTable=document.getElementById('GradeTable');
const submit=document.getElementById('submitGrade');
const logout=document.getElementById('logout');
var account="";
var isUploaded=0;
var maxID=0;
var canUpload=0;
getscore.addEventListener('click',()=>{
    window.location.href="/getscore.html";
});
b30.addEventListener('click',()=>{
    window.location.href="/b30.html";
});
AIsauce.addEventListener('click',()=>{
    window.location.href="/AIsauce.html";
});
logout.addEventListener('click',async()=>{
    if(confirm("确认返回登录界面？")){
        await fetch("/logout",{
            method:'GET'
        })
        .then(response=>{
            if (!response.ok) {
                throw new Error(`Request failed with status: ${response.status}`);
            }
        })
        .catch(error => {
            console.error('Request error:', error);
        });
        window.location.href="/"
    }
});
submit.addEventListener('click',calculateB30);
async function getAccount(){
    try{
        const response=await fetch('/getAccount',{
            method:'POST',
            headers:{
                'Content-Type': 'application/json'
            }
        });
        const data=await response.json();
        account=data.account;
        if(account=="forbidden"){
            alert("请重新登录");
            window.location.href="/";
        }
    }catch(error){
        console.log(error);
        return null;
    }
}
async function getisUploaded(){
    try{
        const response=await fetch('/getisUploaded',{
            method:'POST',
            headers:{
                'Content-Type': 'application/json'
            },
            body:JSON.stringify({"account":account})
        })
        const data=await response.json();
        isUploaded=data.isUploaded;
    }catch(error){
        console.log(error);
        return null;
    }
}
async function calculateB30(){
    var B30=[];
    var data={};
    var playptt=-1;
    for(var index=0;index<maxID;index++){
        if(document.getElementById(`grade${index}`).value==NaN){
            data={
                "name":document.getElementById(`name${index}`).innerText,
                "class":document.getElementById(`class${index}`).innerText,
                "difficulty":parseFloat(document.getElementById(`difficulty${index}`).innerText),
                "score":0,
                "playptt":0
            }
        }else{
            if(parseFloat(document.getElementById(`grade${index}`).value)>=9_200_000 && parseFloat(document.getElementById(`grade${index}`).value)<=9_800_000){
                playptt=parseFloat(document.getElementById(`difficulty${index}`).innerText)+(parseFloat(document.getElementById(`grade${index}`).value)-9_500_000)/300_000
            }else if(parseFloat(document.getElementById(`grade${index}`).value)>9_800_000 && parseFloat(document.getElementById(`grade${index}`).value)<=10_000_000){
                playptt=parseFloat(document.getElementById(`difficulty${index}`).innerText)+1+(parseFloat(document.getElementById(`grade${index}`).value)-9_800_000)/200_000
            }else if(parseFloat(document.getElementById(`grade${index}`).value)>10_000_000){
                playptt=parseFloat(document.getElementById(`difficulty${index}`).innerText)+2;
            }else{
                playptt=0;
            }
            data={
                "name":document.getElementById(`name${index}`).innerText,
                "class":document.getElementById(`class${index}`).innerText,
                "difficulty":parseFloat(document.getElementById(`difficulty${index}`).innerText),
                "score":parseFloat(document.getElementById(`grade${index}`).value),
                "playptt":parseFloat(playptt.toFixed(3))
            }
        }
        B30.push(data);
    }
    console.log(B30);
    uploadGrade(B30);
}
async function uploadGrade(B30){
    if(canUpload){
        const response=await fetch('/uploadGrade',{
            method:'POST',
            body:JSON.stringify({
                "account":account,
                "b30":JSON.stringify(B30)
            })
        })
        const data=await response.json();
        if(data.status=="success"){
            alert("上传成功！");
        }
    }else{
        alert("加载成绩列表中，请稍后保存");
    }
}
async function getGradeTable_Initial(){
    GradeTable.innerHTML=`
        <tr>
            <th>歌曲名称</th>
            <th>难度</th>
            <th>定数</th>
            <th>得分</th>
        </tr>
    `;
    try{
        const response=await fetch('/getGradeTable',{
            method:'POST'
        });
        const data=await response.json();
        console.log(data);
        var i=0;
        var j=0;
        function displayGradeTable(){
            if(i<data.length){
                if(parseFloat(data[i].ftr)>=10.0){
                    GradeTable.innerHTML+=`
                    <tr>
                        <th id="name${j}">${data[i].name}</th>
                        <th id="class${j}">FTR</th>
                        <th id="difficulty${j}">${data[i].ftr}</th>
                        <th><input type="text" name="grade" id="grade${j}"></th>
                    </tr>
                    `;
                    j++;
                }
                if(data[i].byd!=""){
                    GradeTable.innerHTML+=`
                        <tr>
                            <th id="name${j}">${data[i].name}</th>
                            <th id="class${j}">BYD</th>
                            <th id="difficulty${j}">${data[i].byd}</th>
                            <th><input type="text" name="grade" id="grade${j}"></th>
                        </tr>
                    `;
                    j++;
                }
                i++;
                setTimeout(displayGradeTable, 10);
            }else{
                maxID=j;
                canUpload=1;
                document.getElementById('spinner').remove();
            }
        }
        displayGradeTable();
    }catch(error){
        console.log(error);
        return null;
    }
}
async function getGradeTable_Stored(){
    GradeTable.innerHTML=`
        <tr>
            <th>歌曲名称</th>
            <th>难度</th>
            <th>定数</th>
            <th>得分</th>
        </tr>
    `;
    try{
        //已保存的数据
        const response=await fetch('/getGradeTableStored',{
            method:'POST',
            body:JSON.stringify({
                "account":account
            })
        });
        var data=await response.json();
        data=await JSON.parse(data.GradeTable);
        console.log(data);
        const response_init=await fetch('/getGradeTable',{
            method:'POST'
        });
        const data_init=await response_init.json();
        var index=0;
        var i=0;
        var j=0;
        function displayGradeTable(){
            if(i<data_init.length){
                if(parseFloat(data_init[i].ftr)>=10.0){
                    var grade=0;
                    if(data[index].name==data_init[i].name){
                        grade=parseInt(data[index].score);
                        index++;
                        if(grade){
                            GradeTable.innerHTML+=`
                                <tr>
                                    <th id="name${j}">${data_init[i].name}</th>
                                    <th id="class${j}">FTR</th>
                                    <th id="difficulty${j}">${data_init[i].ftr}</th>
                                    <th><input type="text" name="grade" id="grade${j}" value=${grade}></th>
                                </tr>
                                `;
                        }else{
                            GradeTable.innerHTML+=`
                            <tr>
                                <th id="name${j}">${data_init[i].name}</th>
                                <th id="class${j}">FTR</th>
                                <th id="difficulty${j}">${data_init[i].ftr}</th>
                                <th><input type="text" name="grade" id="grade${j}"></th>
                            </tr>
                            `;
                        }
                    }else{
                        GradeTable.innerHTML+=`
                        <tr>
                            <th id="name${j}">${data_init[i].name}</th>
                            <th id="class${j}">FTR</th>
                            <th id="difficulty${j}">${data_init[i].ftr}</th>
                            <th><input type="text" name="grade" id="grade${j}"></th>
                        </tr>
                        `;
                    }
                    j++;
                }
                if(data_init[i].byd!=""){
                    var grade=0;
                    if(data[index].name==data_init[i].name){
                        grade=parseInt(data[index].score);
                        index++;
                        if(grade){
                            GradeTable.innerHTML+=`
                            <tr>
                                <th id="name${j}">${data_init[i].name}</th>
                                <th id="class${j}">BYD</th>
                                <th id="difficulty${j}">${data_init[i].byd}</th>
                                <th><input type="text" name="grade" id="grade${j}" value=${grade}></th>
                            </tr>
                            `;
                        }else{
                            GradeTable.innerHTML+=`
                            <tr>
                                <th id="name${j}">${data_init[i].name}</th>
                                <th id="class${j}">BYD</th>
                                <th id="difficulty${j}">${data_init[i].byd}</th>
                                <th><input type="text" name="grade" id="grade${j}"></th>
                            </tr>
                            `;
                        }
                    }else{
                        GradeTable.innerHTML+=`
                        <tr>
                            <th id="name${j}">${data_init[i].name}</th>
                            <th id="class${j}">BYD</th>
                            <th id="difficulty${j}">${data_init[i].byd}</th>
                            <th><input type="text" name="grade" id="grade${j}"></th>
                        </tr>
                    `;
                    }
                    j++;
                }
                i++;
                setTimeout(displayGradeTable, 10);
            }else{
                maxID=j;
                canUpload=1;
                document.getElementById('spinner').remove();
            }
        }
        displayGradeTable();
    }catch(error){
        console.log(error);
        return null;
    }
}
window.onload=async ()=>{
    await getAccount();
    await getisUploaded();
    if(isUploaded==0){
        getGradeTable_Initial();
    }else{
        getGradeTable_Stored();
    }
}