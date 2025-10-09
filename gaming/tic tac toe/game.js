let boxes = document.querySelectorAll(".box");
let resetbtn = document.querySelector("#reset-btn");
let newbtn = document.querySelector("#newbtn");
let msg = document.querySelector("#msg");
let msgcontainer  = document.querySelector(".msg-container")
let turno = true;
let count = 0;

const winpatterns = [
    [0, 1, 2],
    [0, 3, 6],
    [0, 4, 8],
    [1, 4, 7],
    [2, 5, 8],
    [2, 4, 6],
    [3, 4, 5],
    [6, 7, 8]
];

const resetgame =() => {
    turno = true;
    count =0;
    enableboxes();
    msgcontainer.classList.add("hide");
};

boxes.forEach((box) => {
    box.addEventListener("click", () => {
        if(turno){
            box.innerText ="o";
            turno=false;
        }
        else{
            box.innerText ="x";
            turno=true;
        }
        box.disabled=true;
        count++;

        let iswinner = checkwinner();
        if(count ===9 && !iswinner){
            gamedraw();
        }
    });
});

const gamedraw = () => {
    msg.innerText = `Game was a Draw`;
    msgcontainer.classList.remove("hide");
    disablebox();
};

const disablebox = () => {
    for(let box of boxes){
        box.disabled = true;
    }
};

const enableboxes = () => {
    for(let box of boxes){
        box.disabled = false;
        box.innerText="";
    }
};

const showWinner =(_winner) => {
    msg.innerText = `Congratualation,Winner is ${_winner}`;
    msgcontainer.classList.remove("hide");
    disablebox();
};

const checkwinner = () => {
    for(let pattern of winpatterns){
        let pos1val= boxes[pattern[0]].innerText;
        let pos2val= boxes[pattern[1]].innerText;
        let pos3val= boxes[pattern[2]].innerText;

        if (pos1val !=""&&pos2val !=""&&pos3val !=""){
            if (pos1val===pos2val && pos2val===pos3val){
                showWinner(pos1val);
                return true;
            }
        }
    }
};

newbtn.addEventListener("click",resetgame);
resetbtn.addEventListener("click",resetgame);