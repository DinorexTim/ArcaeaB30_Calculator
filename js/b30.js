const getscore=document.getElementById('getscore');
const b30=document.getElementById('B30');
const AIsauce=document.getElementById('AIsauce');
const logout=document.getElementById('logout');
const B30Grid=document.getElementById('grid');
const PlayerInfo=document.getElementById('info-bar');
const avatarselection=document.getElementById('avatar-selection');

var account="";
var best30=0;
var maxr10=0;
var isshow=0;
var num_of_avatar=77;
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
document.addEventListener("keydown",calculateR10);

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
async function loadB30(){
    try{
        const response=await fetch('/getGradeTableStored',{
            method:'POST',
            body:JSON.stringify({
                "account":account
            })
        });
        var data=await response.json();
        data=await JSON.parse(data.GradeTable);
        if(data!=0){
            data.sort((a,b)=>{
                return b.playptt-a.playptt;
            })
            var index=0;
            function displayB30(){
                if(index<30){
                    var imagename="";
                    if(data[index].name.indexOf('#')!=-1){
                        imagename=data[index].name.replace('#',"");
                    }else{
                        imagename=data[index].name;
                    }
                    if(data[index].score==null||data[index].score==NaN){
                        B30Grid.innerHTML+=`
                            <div class="grid-item" style="background-color:#1f1e33;">
                            <div class="song-name">
                                <b>#616 </b>
                                <div class="difficulty" style="background-color:#1f1e33;">Lr</div>
                                <div class="songname">Guy-RESURRECTION</div>
                            </div>
                            <div class="song-info">
                                <div class="song-cover"><img src="/images/guy/guyb30.jpg" alt=""></div>
                                <div class="player-score">
                                    <p class="datascore">1919810</p>
                                    <div class="play-ptt" style="background-color:#1f1e33;">114→514</div>
                                </div>
                            </div>
                        </div>
                        `;
                    }else{
                        best30+=data[index].playptt;
                        if(index<10){
                            maxr10+=data[index].playptt;
                        }
                        let style="";
                        let diff="";
                        let style_info=""
                        let placeholder="";
                        if(data[index].class=="FTR"){
                            diff="FTR";
                            style_info="background-color:#b231b2;"
                            style="background: linear-gradient(to top right,#b231b2,transparent);";
                        }else if(data[index].class=="BYD"){
                            diff="BYD";      
                            style_info="background-color:#c71111;"                      
                            style="background: linear-gradient(to top right, #ff0000, transparent);";
                        }
                        {
                            if(data[index].score>=9900_000){
                                grade="EX+";
                            }else if(data[index].score>=9800_000){
                                grade="EX";
                            }else if(data[index].score>=9500_000){
                                grade="AA";
                            }else if(data[index].score>=9200_000){
                                grade="A";
                            }else if(data[index].score>=8900_000){
                                grade="B";
                            }else if(data[index].score>=8600_000){
                                grade="C";
                            }else{
                                grade="D";
                            }
                        }
                        for(var i=0;i<8-data[index].score.toString().length;i++){
                            placeholder+="&nbsp";
                        }
                        B30Grid.innerHTML+=`
                            <div class="grid-item" style="${style}">
                            <div class="song-name">
                                <b>#${index+1} </b>
                                <div class="difficulty" style=${style_info}>${diff}</div>
                                <div class="songname">${data[index].name.slice(0,18)}</div>
                            </div>
                            <div class="song-info">
                                <div class="song-cover"><img src="/images/Songcovers/${imagename}.jpg" alt=""></div>
                                <div class="player-score">
                                    <p class="datascore">${data[index].score}</p>
                                    <div class="play-ptt" style="${style_info}">${data[index].difficulty}→${data[index].playptt}</div>
                                </div>
                            </div>
                        </div>
                        `;
                    }
                    index++;
                    setTimeout(displayB30, 15);
                }else{
                    document.getElementById('spinner').remove();
                    best30/=30;
                    maxr10/=10;
                    document.getElementById('b30').innerText="B30 "+best30.toFixed(3);
                    if(document.getElementById('ptt').innerText!=""&&document.getElementById('ptt').innerText!="00.00"){
                        var r10=0;
                        r10=(4*parseFloat(document.getElementById('ptt').innerText)-3*parseFloat(best30)).toFixed(3);
                        document.getElementById('b30').innerText="B30 "+best30.toFixed(3);
                        document.getElementById('r10').innerText="R10 "+r10.toString();
                        document.getElementById('maxptt').innerText="MaxPtt "+(3*parseFloat(best30)/4+maxr10/4).toFixed(3).toString()
                    }
                    document.getElementById('btn-container').style.filter="blur(0px)";
                    document.getElementById('capture').style.filter="blur(0px)";
                }
            }
            displayB30();
        }else{
            var index=0;
            function displayB30(){
                if(index<30){
                    B30Grid.innerHTML+=`
                        <div class="grid-item" style="background-color:#1f1e33;">
                        <div class="song-name">
                            <b>#616 </b>
                            <div class="difficulty" style="background-color:#1f1e33;">Lr</div>
                            <div class="songname">Guy-RESURRECTION</div>
                        </div>
                        <div class="song-info">
                            <div class="song-cover"><img src="/images/guy/guyb30.jpg" alt=""></div>
                            <div class="player-score">
                                <p class="datascore">1919810</p>
                                <div class="play-ptt" style="background-color:#1f1e33;">114→514</div>
                            </div>
                        </div>
                    </div>
                    `;
                    index++;
                    setTimeout(displayB30, 15);
                }else{
                    document.getElementById('btn-container').style.filter="blur(0px)";
                    document.getElementById('capture').style.filter="blur(0px)";
                }
            }
            displayB30();
            document.getElementById('spinner').remove();
        }
    }catch(error){
        console.log(error);
        return null;
    }
}
function calculateR10(){
    if(event.code=='Enter'){
        event.preventDefault();
        ptt.blur();
        if(parseFloat(document.getElementById('ptt').innerText)<=0.00||parseFloat(document.getElementById('ptt').innerText)>13.11){
            if(!localStorage.getItem("ptt")||localStorage.getItem("ptt")==""){
                document.getElementById('ptt').innerText="00.00";
            }else{
                document.getElementById('ptt').innerText=parseFloat(localStorage.getItem("ptt")).toFixed(2).toString();
            }
            alert("下个游戏不要钱的");
            return;
        }
        document.getElementById('ptt').innerText=parseFloat(document.getElementById('ptt').innerText).toFixed(2).toString();
        localStorage.setItem("ptt",document.getElementById('ptt').innerText);
        var r10=0;
        if(parseFloat(document.getElementById('ptt').innerText)>=13.00){
            document.getElementById('rank').src="/images/rank/4.png";
        }else if(parseFloat(document.getElementById('ptt').innerText)>=12.50){
            document.getElementById('rank').src="/images/rank/3.png";
        }else if(parseFloat(document.getElementById('ptt').innerText)>=12.00){
            document.getElementById('rank').src="/images/rank/2.png";
        }else{
            document.getElementById('rank').src="/images/rank/1.png";
        }
        localStorage.setItem("rank",document.getElementById('rank').src);
        r10=(4*parseFloat(document.getElementById('ptt').innerText)-3*parseFloat(best30)).toFixed(3);
        localStorage.setItem("r10",r10);
        document.getElementById('b30').innerText="B30 "+best30.toFixed(3).toString();
        document.getElementById('r10').innerText="R10 "+r10.toString();
    }
}
async function selectavatar(){
    for(var index=1;index<=num_of_avatar;index++){
        (function (currentIndex) {
            var img = document.createElement('img');
            img.src = `/images/avatar/${currentIndex}.png`;
            img.alt = '';
            img.addEventListener('click', function () {
                avatarselection.style.display="none";
                isshow=1-isshow;
                document.getElementById('avatar').src = `/images/avatar/${currentIndex}.png`;
                localStorage.setItem("avatar_src",document.getElementById('avatar').src);
            });
            avatarselection.appendChild(img);
        })(index);
    }
}
function checkScreenWidth() {
    const screenWidth = window.innerWidth;
    if(screenWidth >= 1280){
        B30Grid.classList.remove('grid-narrow');
        B30Grid.classList.remove('grid-very-narrow');
        B30Grid.classList.remove('grid-wide');
        B30Grid.classList.add('grid-very-wide');
    }else if(screenWidth >= 880){ 
        B30Grid.classList.remove('grid-very-wide');
        B30Grid.classList.remove('grid-narrow');
        B30Grid.classList.remove('grid-very-narrow');
        B30Grid.classList.add('grid-wide');
    }else if(screenWidth >= 577){ 
        B30Grid.classList.remove('grid-very-wide');
        B30Grid.classList.remove('grid-wide');
        B30Grid.classList.remove('grid-very-narrow');
        B30Grid.classList.add('grid-narrow');
    }else{
        B30Grid.classList.remove('grid-very-wide');
        B30Grid.classList.remove('grid-wide');
        B30Grid.classList.remove('grid-narrow');
        B30Grid.classList.add('grid-very-narrow');
    }
}

document.getElementById('avatar').addEventListener('click',()=>{
    if(isshow){
        avatarselection.style.display="none";
        isshow=1-isshow;
    }else{
        avatarselection.style.display="block";
        isshow=1-isshow;
    }
});

document.getElementById('export').addEventListener('click',exportAsJPG);
selectavatar();

//导出为jpg
async function exportAsJPG() {
    alert("正在导出中，可能需要一些时间...");
    var elementToCapture = document.getElementById('capture');
    html2canvas(elementToCapture).then(function(canvas) {
        var jpgDataUrl = canvas.toDataURL('image/jpeg');
        var downloadLink = document.createElement('a');
        downloadLink.href = jpgDataUrl;
        downloadLink.download = `B30_${account}.jpg`; 
        downloadLink.click();
        alert("B30导出成功！");
    })
}
window.addEventListener('resize', checkScreenWidth);
document.getElementById('capture').addEventListener('click',(event)=>{
    if(isshow&&event.target!=document.getElementById('avatar')){
        isshow=1-isshow;
        avatarselection.style.display="none";
    }
});
document.getElementById('btn-container').addEventListener('click',(event)=>{
    if(isshow&&event.target!=document.getElementById('avatar')){
        isshow=1-isshow;
        avatarselection.style.display="none";
    }
});
document.getElementById('avatar').addEventListener('mouseover',()=>{
    document.getElementById('avatar').classList.toggle('enlarged');
});
document.getElementById('avatar').addEventListener('mouseleave',()=>{
    document.getElementById('avatar').classList.toggle('enlarged');
});
window.onload=async ()=>{ 
    if(!localStorage.getItem("r10")||localStorage.getItem("r10")=="NaN"){
        document.getElementById('r10').innerText="R10";
    }else{
        document.getElementById('r10').innerText=localStorage.getItem("r10");
    }
    if(!localStorage.getItem("ptt")||localStorage.getItem("ptt")==""){
        document.getElementById('ptt').innerText="00.00";
    }else{
        document.getElementById('ptt').innerText=localStorage.getItem("ptt");
    }
    if(!localStorage.getItem("avatar_src")){
        document.getElementById('avatar').src="/images/avatar/1.png"
    }else{
        document.getElementById('avatar').src=localStorage.getItem("avatar_src");
    }
    if(!localStorage.getItem("rank")){
        document.getElementById('rank').src="/images/rank/1.png";
    }else{
        document.getElementById('rank').src=localStorage.getItem("rank");
    }
    setTimeout(async() => {
        await getAccount();
        document.getElementById('username').innerText=account;
        checkScreenWidth();
        loadB30(); 
    }, 100);
}