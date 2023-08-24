import {reconstructionData} from './data.js'
const data = JSON.parse(JSON.stringify(reconstructionData));
let solve = window.location.href.split("/")[4];
let recon = data[solve].recon;
let reconLength = recon.length;


// Makes variables for all the DOM queries
const clockElement = document.querySelector("#clock");
const bigCircleAndDialElements = document.querySelectorAll(".bigCircle, .dial");
const circleElements = document.querySelectorAll(".circle");
const pinULElement = document.querySelector(".pin.ul");
const pinUElement = document.querySelector(".pin.u");
const pinLElement = document.querySelector(".pin.l");
const pinCElement = document.querySelector(".pin.c");
const dialElements = document.querySelectorAll(".dial");
const averageTimeBoxElements = document.querySelectorAll(".averageTimeBox");

let state = [0,0,0,0,0,0,0,0,0,0,0];
let pinColors = ['','','',''];
let turnDegrees;
let flipDegrees;
let previousSolveOfAverage = solve;
let solveOfAverage = solve;
let timeStamp = 0.01;
function animate() {
    timeStamp = getTime();
    for (let i=0; i<reconLength; i++){
        // moves that set the clock to a specific state
        if (recon[i][1] === "set" && timeStamp >= recon[i][0]) {
            // sets the dials
            for (let dial=0; dial<9; dial++){
                state[dial] = recon[i][2][dial]
            }
            // sets the orientation
            state[9] = recon[i][2][9];
            state[10] = recon[i][2][10];
            clockElement.style.transform = "";
            clockElement.style.transform = "rotate("+state[10]*90+"deg)";
            if (window.innerWidth < 430) {
                clockElement.style.transform += " scale(0.7) translate(-50px,0px)"
            }
            bigCircleAndDialElements.forEach(element => element.style.backgroundColor = (state[9] === 0 ? "white" : "black"));
            circleElements.forEach(element => element.style.backgroundColor = (state[9] === 0 ? "black" : "white "));
            // sets the pins
            pinColors[0] = recon[i][3][0] === 1 ? "yellow" : "gray";
            pinColors[1] = recon[i][3][1] === 1 ? "yellow" : "gray";
            pinColors[2] = recon[i][3][2] === 1 ? "yellow" : "gray";
            pinColors[3] = recon[i][3][3] === 1 ? "yellow" : "gray";

            // sets solve of average
            if (data[solve].average !== undefined) {
                solveOfAverage = recon[i][4];
            }
        }
        // flips
        else if (recon[i][2] === "flip" && timeStamp >= recon[i][0]) {
            flipDegrees = ((timeStamp-recon[i][0])/(recon[i][1]-recon[i][0]) > 1 ? 1 : (timeStamp-recon[i][0])/(recon[i][1]-recon[i][0])) * 180;
            if(recon[i][3]==="x2"){
                clockElement.style.transform = "";
                clockElement.style.transform = " rotateX("+(-flipDegrees)+"deg) rotate("+state[10]*90+"deg)";
            }
            else if(recon[i][3]==="y2"){
                clockElement.style.transform = "";
                clockElement.style.transform = " rotateY("+flipDegrees+"deg) rotate("+state[10]*90+"deg)";
            }
            else if(recon[i][3]==="x2z"){
                clockElement.style.transform = "";
                clockElement.style.transform = `rotateX(${flipDegrees}deg) rotate(${state[10]*90+(flipDegrees/(flipDegrees > 90 ? -2 : 2))}deg)`

            }
            else if(recon[i][3]==="x2z'"){
                clockElement.style.transform = "";
                clockElement.style.transform = `rotateX(${flipDegrees}deg) rotate(${state[10]*90+(flipDegrees/(flipDegrees > 90 ? 2 : -2))}deg)`

            }            
            if (flipDegrees>90){
                state[9] = recon[i][4][9];
                bigCircleAndDialElements.forEach(element => element.style.backgroundColor = (state[9] === 0 ? "white" : "black"));
                circleElements.forEach(element => element.style.backgroundColor = (state[9] === 0 ? "black" : "white "));
                for (let dial=0; dial<9; dial++){
                    state[dial] = recon[i][4][dial]
                }
            }
            if (window.innerWidth < 430) {
                clockElement.style.transform += " scale(0.7) translate(-50px,0px)"
            }
        }
        // moves that turn the dials
        else if (timeStamp > recon[i][0]) {
            // sets the pins
            if (recon[i][2].includes(4)) {
                pinColors[0] = recon[i][2].includes(0) ? "yellow" : "gray";
                pinColors[1] = recon[i][2].includes(2) ? "yellow" : "gray";
                pinColors[2] = recon[i][2].includes(6) ? "yellow" : "gray";
                pinColors[3] = recon[i][2].includes(8) ? "yellow" : "gray";
            }
            else {
                pinColors[0] = recon[i][2].includes(0) ? "gray" : "yellow"; 
                pinColors[1] = recon[i][2].includes(2) ? "gray" : "yellow"; 
                pinColors[2] = recon[i][2].includes(6) ? "gray" : "yellow"; 
                pinColors[3] = recon[i][2].includes(8) ? "gray" : "yellow";
            }
            turnDegrees = ((timeStamp-recon[i][0])/(recon[i][1]-recon[i][0]) > 1 ? 1 : (timeStamp-recon[i][0])/(recon[i][1]-recon[i][0])) * recon[i][3];
            for (let dial of recon[i][2]){
                state[dial] += turnDegrees;
            }
        }
    } 
    // sets the state of the dials and pins
    for (let dial=0; dial<9; dial++){
        dialElements[dial].style.transform = "translate(50px, 2px) rotate("+(state[dial]*30)+"deg)";
    }
    pinULElement.style.backgroundColor = pinColors[0];
    pinUElement.style.backgroundColor = pinColors[1];
    pinLElement.style.backgroundColor = pinColors[2];
    pinCElement.style.backgroundColor = pinColors[3];

    // updates the solve if in an average and the video is on a new solve (I have no clue if this code works for text reconstructions btw so I guess we'll see if an ao5 is made.)
    if (solveOfAverage != previousSolveOfAverage) {
        solve = solveOfAverage;
        for (let s = 0; s < averageTimeBoxElements.length; s++) {
            averageTimeBoxElements[s].classList.remove("selectedTime");
        }
        document.querySelector(`.s${solve}`).classList.add('selectedTime');
        document.querySelector("#title").innerHTML = `<a href="/persons/${data[solve].wcaid}">${data[solve].name}</a> ${data[solve].title}`;
        document.querySelector("#author").innerHTML = data[solve].author;
        document.title = data[solve].name + " " + data[solve].title + " - ClockDB";
        document.querySelector("#scramble").innerHTML = "Scramble: " + data[solve].scramble;
        document.querySelector("#solution").innerHTML = `Solution: ${data[solve].inspection} ${data[solve].solution}`;
        window.history.replaceState({ path: "/r/"+solve }, "", "/r/"+solve);
        recon = data[solve].recon;
        reconLength = recon.length;
        previousSolveOfAverage = solveOfAverage;
    }

    window.requestAnimationFrame(animate);
};


let startTime = 0;

document.querySelector("#textPlay").addEventListener("click", function() {
    startTime = Date.now();  
});
document.querySelector("#textReset").addEventListener("click", function() {
    startTime = 0;
});

function getTime() {
    if (startTime == 0) {
        return 0.01;
    }
    return (Date.now() - startTime) / 1000;
}


if (data[solve].average !== undefined) {
    document.querySelector(`.s${solve}`).classList.add('selectedTime');
    for (let s = 0; s < averageTimeBoxElements.length; s++) {
        averageTimeBoxElements[s].addEventListener("click", function(){
            player.seekTo(data[data[solve].average[s][0]].startTime, true);
        })        
    }
}

animate();