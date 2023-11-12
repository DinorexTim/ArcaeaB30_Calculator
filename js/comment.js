const getscore=document.getElementById('getscore');
const b30=document.getElementById('b30');
const AIsauce=document.getElementById('AIsauce');
const reload=document.getElementById('reload');
const send=document.getElementById('send');
const interaction=document.getElementById('interaction');
const comment=document.getElementById('comment');
var issender=0;
var account="";
var id=0;
var lasttimesend=0;

let socket = new WebSocket(`wss://${window.location.host}`);
socket.onopen = (event) => {
    console.log("WebSocket连接已打开");
};

socket.onclose = (event) => {
    console.log("WebSocket连接已关闭");
};

socket.onerror = (event) => {
    console.error("WebSocket错误：", event);
};
      
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
getscore.addEventListener('click',()=>{
    window.location.href="/getscore.html";
});
b30.addEventListener('click',()=>{
    window.location.href="/b30.html";
});
AIsauce.addEventListener('click',()=>{
    window.location.href="/AIsauce.html";
});
reload.addEventListener('click',async()=>{
    document.getElementById('indicator').style.display="none";
    location.reload();
});
send.addEventListener('click',async()=>{
    let currenttime=Date.now();
    if(currenttime-lasttimesend<10000){
        alert("发言频率过快，请稍后再试");
        return;
    }
    issender=1;
    const currentDate = new Date();
    const formattedDate = currentDate.toString().replace(/GMT\+\d{4} \(.+?\)/, '');
    if(comment.value!=""){
        try{
            const response=await fetch('/getDialogueID',{
                method:'POST',
            })
            const data=await response.json();
            id=parseInt(data.id)+1;
            interaction.innerHTML+=`
            <div id="time${id}" class="time">${formattedDate}</div>
            <h3>${account}</h3>
            <div class="replycontent" id=comment${id}" style="display: inline-block;">
                ${comment.value}
            </div>
            <div style="font-size: small;display: inline-block;padding: 3px; border-radius: 5px;border: solid 1px #979797;">
                <div id="like${id}" class="likefun">👍🏻:<b id="likevalue${id}">0</b></div>
                <div id="fun${id}" class="likefun">🤣:<b id="funvalue${id}">0</b></div>
            </div>
            `;
            interaction.scrollTop=interaction.scrollHeight;
            socket.send(comment.value.toString());
            (function(index) {
                document.getElementById(`like${index}`).addEventListener('click', function() {
                    document.getElementById(`likevalue${index}`).innerText=`${parseInt(document.getElementById(`likevalue${index}`).innerText)+1}`;
                    updatefunlike("like",index,parseInt(document.getElementById(`likevalue${index}`).innerText));
                });
                document.getElementById(`fun${index}`).addEventListener('click', function() {
                    document.getElementById(`funvalue${index}`).innerText=`${parseInt(document.getElementById(`funvalue${index}`).innerText)+1}`;
                    updatefunlike("fun",index,parseInt(document.getElementById(`funvalue${index}`).innerText));
                });
            })(id);
            var text=comment.value;
            comment.value="";
        }catch(error){
            console.log(error);
            return null;
        }
        try{
            const response=await fetch('/saveDialogue',{
                method:'POST',
                body:JSON.stringify({
                    "id":id,
                    "account":account,
                    "comment":text,
                    "like":0,
                    "fun":0,
                    "time":formattedDate
                })
            })
        }catch(error){
            console.log(error);
            return null;
        }
    }
    lasttimesend=currenttime;
})

async function load(){
    try{
        const response=await fetch('/getDialogueID',{
            method:'POST',
        })
        const data=await response.json();
        id=parseInt(data.id)+1;
    }catch(error){
        console.log(error);
        return null;
    }
    try{
        const response=await fetch('/getDialogue',{
            method:'POST'
        });
        var data=await response.json();
        data=data.Res;
        let index=0;
        function showDialogue(){
            if(index<id){
                interaction.innerHTML+=`
                <div id="time${index}" class="time">${data[index].time}</div>
                <h3>${data[index].account}</h3>
                <div class="replycontent" id="comment${index}" style="display: inline-block;">
                    ${data[index].comment}
                </div>
                <div style="font-size: small;display: inline-block;padding: 3px; border-radius: 5px;border: solid 1px #979797;">
                    <div id="like${index}" class="likefun">👍🏻:<b id="likevalue${index}">${data[index].like}</b></div>
                    <div id="fun${index}" class="likefun">🤣:<b id="funvalue${index}">${data[index].fun}</b></div>
                </div>
                `;
                interaction.scrollTop=interaction.scrollHeight;
                index++;
                setTimeout(showDialogue,20);
            }else{
                for(var i=0;i<id;i++){
                    (function(index) {
                        document.getElementById(`like${index}`).addEventListener('click', function() {
                            document.getElementById(`likevalue${index}`).innerText=`${parseInt(document.getElementById(`likevalue${index}`).innerText)+1}`;
                            updatefunlike("like",index,parseInt(document.getElementById(`likevalue${index}`).innerText));
                        });
                        document.getElementById(`fun${index}`).addEventListener('click', function() {
                            document.getElementById(`funvalue${index}`).innerText=`${parseInt(document.getElementById(`funvalue${index}`).innerText)+1}`;
                            updatefunlike("fun",index,parseInt(document.getElementById(`funvalue${index}`).innerText));
                        });
                    })(i);
                }
                document.getElementById('spinner').remove();
            }
        }
        showDialogue();
    }catch(error){
        console.log(error);
        return null;
    }
}
async function updatefunlike(judge,ID,num){
    try{
        const response=await fetch('/update',{
            method:'POST',
            body:JSON.stringify({
                "tochange":judge,
                "num":num,
                "id":ID
            })
        })
        const data=await response.json();
        if(data.status=="fail"){
            alert("发生错误，请刷新页面");
        }
    }catch(error){
        console.log(error);
        return null;
    }
}
socket.onmessage = (event) => {
    console.log("收到消息：", event.data);
    document.getElementById('indicator').style.display="block";
    if(issender){
        document.getElementById('indicator').style.display="none";
        issender=0;
    }else{
        // alert('你有一条新消息');
    }
};
window.onload=async ()=>{
    await getAccount();
    await load();
}




