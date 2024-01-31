const getscore=document.getElementById('getscore');
const b30=document.getElementById('b30');
const AIsauce=document.getElementById('AIsauce');
const randomsong=document.getElementById('randomsong');
const suggestion=document.getElementById('suggestion');
const bible=document.getElementById('bible');
const interaction=document.getElementById('interaction');
const clearchat=document.getElementById('clearchat');
var dialogueID=0;
var canclick=1;
var account="";
var countdown=10;
var currentColor = 51;
var currentColor_=currentColor;
getscore.addEventListener('click',()=>{
    window.location.href="/getscore.html";
});
b30.addEventListener('click',()=>{
    window.location.href="/b30.html";
});
AIsauce.addEventListener('click',()=>{
    window.location.href="/AIsauce.html";
});
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
clearchat.addEventListener('click',()=>{
    if(canclick){
        dialogueID=0;
        document.getElementById(`interaction`).style.backgroundColor=`background-color: rgba(46, 53, 85, 0.7);`;
        interaction.innerHTML=`
        <div class="avatar" id="egg${dialogueID}">
            <img src="/images/AIsauce/AIsauce.jpg" alt="">
        </div>
        <div class="replycontent" id="reply${dialogueID}">
            
        </div>
        `;
        canclick=0;
        var index=0;
        var text="你好！我是AI酱，有什么问题都可以问我哦！";
        var temp="";
        function showText(){
            if(index<text.length){
                temp+=text.charAt(index);
                document.getElementById(`reply${dialogueID}`).innerHTML=temp;
                index++;
                setTimeout(showText,20);
            }else{
                document.getElementById(`egg${dialogueID}`).addEventListener('click',Egg);
                dialogueID++;
                canclick=1;
            }
        }
        showText();
    }
});
randomsong.addEventListener('click',async()=>{
    if(canclick){
        interaction.innerHTML+=`
        <div class="usercontent">
            推荐一首歌曲
        </div>
        `;
        interaction.scrollTop=interaction.scrollHeight;
        canclick=0;
        try{
            const response=await fetch('/getrandomsong',{
                method:'POST'
            });
            const data=await response.json();
            interaction.innerHTML+=`
            <div class="avatar" id="egg${dialogueID}">
                <img src="/images/AIsauce/AIsauce.jpg" alt="">
            </div>
            <div class="replycontent" id="reply${dialogueID}">
                
            </div>
            `;
            var index=0;
            var text=`${data.content}`;
            var temp="";
            function showText(){
                if(index<text.length){
                    temp+=text.charAt(index);
                    document.getElementById(`reply${dialogueID}`).innerHTML=temp;
                    interaction.scrollTop=interaction.scrollHeight;
                    index++;
                    setTimeout(showText,10);
                }else{
                    document.getElementById(`egg${dialogueID}`).addEventListener('click',Egg);
                    dialogueID++;
                    canclick=1;
                }
            }
            showText();
        }catch(error){
            console.log(error);
            return null;
        }
    }
});
suggestion.addEventListener('click',async()=>{
    if(canclick){
        interaction.innerHTML+=`
        <div class="usercontent">
            来点推分建议
        </div>
        `;
        interaction.scrollTop=interaction.scrollHeight;
        canclick=0;
        try{
            const response=await fetch('/getGradeTableStored',{
                method:'POST',
                body:JSON.stringify({
                    "account":account
                })
            });
            var data=await response.json();
            data=await JSON.parse(data.GradeTable);
            data.sort((a,b)=>{
                return b.playptt-a.playptt;
            })
            function getRandomInteger(min, max) {
                return Math.floor(Math.random() * (max - min + 1)) + min;
            }
            let size_temp=0;
            while(data[size_temp].playptt!=0){
                size_temp++;
            }
            if(size_temp>=35){
                reply=[
                    "似乎是个不错的选择，但不要推分过度，小心腱鞘炎哦！",
                    "或许能够帮助你提升潜力值，快去试试吧！",
                    "是不是放置很久了？快去尝试吧，说不定会飞升哦？",
                    "的配置对现在的你来说或许能更加从容应对了，快去试试看吧！",
                    "看起来十分困难，但似乎稍微研究研究就能从容应对！快去试试看！"
                ]
                var ranpos=getRandomInteger(31,35);
                var ranreply=getRandomInteger(0,reply.length-1);
                interaction.innerHTML+=`
                <div class="avatar" id="egg${dialogueID}">
                    <img src="/images/AIsauce/AIsauce.jpg" alt="">
                </div>
                <div class="replycontent" id="reply${dialogueID}">
                    
                </div>
                `;
                var index=0;
                var text=`想要推分吗？在你的OverFlow区段，${data[ranpos].name}${reply[ranreply]}`;
                var temp="";
                function showText(){
                    if(index<text.length){
                        temp+=text.charAt(index);
                        document.getElementById(`reply${dialogueID}`).innerHTML=temp;
                        interaction.scrollTop=interaction.scrollHeight;
                        index++;
                        setTimeout(showText,20);
                    }else{
                        document.getElementById(`egg${dialogueID}`).addEventListener('click',Egg);
                        dialogueID++;
                        canclick=1;
                    }
                }
                showText();
            }else{
                interaction.innerHTML+=`
                <div class="avatar" id="egg${dialogueID}">
                    <img src="/images/AIsauce/AIsauce.jpg" alt="">
                </div>
                <div class="replycontent" id=reply${dialogueID}>

                </div>
                `;
                var index=0;
                var text="你似乎没怎么打过歌啊，前面的区域以后再来探索吧！";
                var temp="";
                function showText(){
                    if(index<text.length){
                        temp+=text.charAt(index);
                        document.getElementById(`reply${dialogueID}`).innerHTML=temp;
                        interaction.scrollTop=interaction.scrollHeight;
                        index++;
                        setTimeout(showText,10);
                    }else{
                        document.getElementById(`egg${dialogueID}`).addEventListener('click',Egg);
                        dialogueID++;
                        canclick=1;
                    }
                }
                showText();
            }
        }catch(error){
            console.log(error);
            return null;
        }
    }
});
bible.addEventListener('click',async()=>{
    if(canclick){
        interaction.innerHTML+=`
        <div class="usercontent">
            爆句典
        </div>
        `;
        interaction.scrollTop=interaction.scrollHeight;
        canclick=0;
        try{
            const response=await fetch('/getbible',{
                method:'POST'
            });
            const data=await response.json();
            interaction.innerHTML+=`
            <div class="avatar" id="egg${dialogueID}">
                <img src="/images/AIsauce/AIsauce.jpg" alt="">
            </div>
            <div class="replycontent" id="reply${dialogueID}">
                
            </div>
            `;
            var index=0;
            var text=`${data.content}`;
            var temp="";
            function showText(){
                if(index<text.length){
                    temp+=text.charAt(index);
                    document.getElementById(`reply${dialogueID}`).innerHTML=temp;
                    interaction.scrollTop=interaction.scrollHeight;
                    index++;
                    setTimeout(showText,10);
                }else{
                    document.getElementById(`egg${dialogueID}`).addEventListener('click',Egg);
                    dialogueID++;
                    canclick=1;
                }
            }
            showText();
        }catch(error){
            console.log(error);
            return null;
        }
    }
});
async function loadDialogue(){
    if(canclick){
        canclick=0;
        interaction.innerHTML=`
        <div class="avatar" id="egg${dialogueID}">
            <img src="/images/AIsauce/AIsauce.jpg" alt="">
        </div>
        <div class="replycontent" id="reply${dialogueID}">
            
        </div>
        `;
        var index=0;
        var text="你好！我是AI酱，有什么问题都可以问我哦！";
        var temp="";
        function showText(){
            if(index<text.length){
                temp+=text.charAt(index);
                document.getElementById(`reply${dialogueID}`).innerHTML=temp;
                index++;
                setTimeout(showText,10);
            }else{
                document.getElementById(`egg${dialogueID}`).addEventListener('click',Egg);
                dialogueID++;
                canclick=1;
            }
        }
        showText();
    }
}
function Egg(){
    if(canclick){
        if(countdown<=-30){
            canclick=0;
            window.location.href='/comment.html';
        }
        interaction.innerHTML+=`
        <div class="avatar" id="egg${dialogueID}">
            <img src="/images/AIsauce/AIsauce.jpg" alt="">
        </div>
        <div class="replycontent" id="reply${dialogueID}" style="display: inline-block;">
            你好！我是AI酱，有什么问题都可以问我哦！
        </div>
        <div style="font-size: small;display: inline-block;padding: 3px; border-radius: 20px;">
            可用次数：${countdown}
        </div>
        `;
        if(countdown<0){
            if (currentColor < 255) {
                currentColor += 5; 
                currentColor_=currentColor-3;
            }
            document.getElementById(`reply${dialogueID}`).style.backgroundColor=`rgb(${currentColor}, 51, 51)`;
            document.getElementById(`interaction`).style.backgroundColor=`rgb(${currentColor_}, 51, 51)`; 
        }
        interaction.scrollTop=interaction.scrollHeight;
        document.getElementById(`egg${dialogueID}`).addEventListener('click',Egg);
        dialogueID++;
        countdown--;
    }
}
window.onload=async ()=>{
    await getAccount();
    await loadDialogue();
}