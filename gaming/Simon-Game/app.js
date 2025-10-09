let gameSeq=[];
let userSeq=[];
let started = false;
let level = 0;

let btns = ["yellow","red","purple","green"];
let h2 = document.querySelector("h2");

let c = 0;
document.addEventListener("click",function () {
   if(started == false)
   {
    started = true;
   }
   
   if(c==0){
      levelUp();
   }
   c++;
   
})

function gameFlash(btn) {
    btn.classList.add("flash");
    setTimeout(function () {
      btn.classList.remove("flash");
    },1000);
 }

 function userFlash(btn) {
    btn.classList.add("userflash");
    setTimeout(function () {
      btn.classList.remove("userflash");
    },100);
 }

function levelUp() {
    userSeq = [];
    level++;
    h2.innerText =`Level ${level}`;
    
    let randIdx = Math.floor(Math.random() *4);
    let randColor = btns[randIdx];
    let randbtn = document.querySelector(`.${randColor}`);
    gameSeq.push(randColor);
    gameFlash(randbtn);
}

function checkAns(idx) {

 if(userSeq[idx] == gameSeq[idx])
 {
    if(userSeq.length == gameSeq.length){
        setTimeout(levelUp,1000);
    }
 }else{
    h2.innerHTML=`Game Over! Your score was <b>${level}<b><br>refresh this page to start new game`;
    document.querySelector("body").style.backgroundColor = "red";
    setTimeout( function() {
        document.querySelector("body").style.backgroundColor = "bisque";
    },150 );
    reset();
 }
}

function btnPress() {
   let btn = this;
   userFlash(btn)

   userColor = btn.getAttribute("id");
   userSeq.push(userColor);

   checkAns(userSeq.length-1);
}

let allBtns = document.querySelectorAll(".btn");
for(btn of allBtns){
 btn.addEventListener("click", btnPress);
}

function reset() {
     gameSeq=[];
     userSeq=[];
     started = false;
     level = 0;
     
}
