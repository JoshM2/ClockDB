// all the code in this file is a mess sorry.



// code for frame skipping buttons
var player;
var currentFrame = 0;
function onPlayerReady(event) {
    player.setPlaybackRate(1);
    var frameRate = 30; // Assuming 30 frames per second

    setInterval(function() {
        currentFrame = Math.floor(player.getCurrentTime() * frameRate);
    }, 1000 / frameRate);

    window.skipFrames = function(frames) {
        var newFrame = currentFrame + frames;

        newFrame = Math.max(newFrame, 0);
        newFrame = Math.min(newFrame, player.getDuration() * frameRate);

        var newTime = newFrame / frameRate;
        player.seekTo(newTime, true);
    };
}


const clockElement = document.querySelector("#clock");

var t;
async function submitOrientation() {
    recon.push(['',"set",[0,0,0,0,0,0,0,0,0,parseInt(document.querySelector("#sideFacing").value),parseInt(document.querySelector("#twelveFacing").value)]])
    document.querySelector("#step2").style.display = "none";
    document.querySelector("#step3").style.display = "block";
    for (let i=0; i<9; i++) {
        document.querySelector("#position").value="";
        document.querySelectorAll(".circle")[i].style.outline = '10px solid green';
        const value = await waitForButtonPress();
        document.querySelectorAll(".circle")[i].style.outline = '';
        recon[recon.length-1][2][i] = parseInt(value) || 0;
    }
    document.querySelector("#step3").style.display = "none";
    document.querySelector("#step4").style.display = "block";
    //document.querySelector("#submitRecon").style.display = "block";

    t = document.querySelector('#table');
    var r = document.createElement('tr');
    r.innerHTML = `<td>set</td><td><input type='text' oninput='recon[${recon.length-1}][0]=parseFloat(this.value)'></td><td>N/A</td>`;
    t.appendChild(r);
}

async function addFlip() {
    let temp = recon;
    recon = [[0,0,"flip",document.querySelector("#flipType").value,[0,0,0,0,0,0,0,0,0,parseInt(document.querySelector("#color").value)]]]
    document.querySelector("#flipType").value = ""
    document.querySelector("#color").value = ""
    document.querySelector("#step6").style.display = "none";
    document.querySelector("#step3").style.display = "block";
    for (let i=0; i<9; i++) {
        document.querySelector("#position").value="";
        document.querySelectorAll(".circle")[i].style.outline = '10px solid green';
        const value = await waitForButtonPress();
        document.querySelectorAll(".circle")[i].style.outline = '';
        recon[recon.length-1][4][i] = parseInt(value) || 0;
    }
    document.querySelector("#step3").style.display = "none";
    document.querySelector("#step4").style.display = "block";
    temp.push(recon[0]);
    recon = temp;
    t = document.querySelector('#table');
    var r = document.createElement('tr');
    r.innerHTML = `<td>flip</td><td><input type='text' oninput='recon[${recon.length-1}][0]=parseFloat(this.value)'></td><td><input type='text' oninput='recon[${recon.length-1}][1]=parseFloat(this.value)'></td>`;
    t.appendChild(r);
}


let go;
function addMove() {
    go=true
    document.querySelector("#step4").style.display = "none";
    document.querySelector("#step5").style.display = "block";
}
function submitTurns() {
    recon.push(['','',selectedIndexes.sort(),parseInt(document.querySelector("#turnAmount").value)])
    t = document.querySelector('#table');
    var r = document.createElement('tr');
    r.innerHTML = `<td>move</td><td><input type='text' oninput='recon[${recon.length-1}][0]=parseFloat(this.value)'></td><td><input type='text' oninput='recon[${recon.length-1}][1]=parseFloat
    (this.value)'></td>`;
    t.appendChild(r);

    document.querySelector("#turnAmount").value = "";
    items.forEach(function(item) {
        item.classList.remove('selected');
    });
    selectedIndexes = []
    document.querySelector("#step4").style.display = "block";
    document.querySelector("#step5").style.display = "none";
}


let state = [0,0,0,0,0,0,0,0,0,0,0]
setInterval(function() {
    let timeStamp;
    try{
        timeStamp = player.getCurrentTime();
    } catch(error) {return;}
    // loop through each move
    for (let i=0; i<recon.length; i++){

        // moves that set the clock to a specific state
        if (timeStamp >= recon[i][0] && recon[i][1] == "set") {
            for (let dial=0; dial<9; dial++){
                document.querySelectorAll(".dial")[dial].style.transform = "translate(50px, 2px) rotate("+recon[i][2][dial]*30+"deg)";
                state[dial] = recon[i][2][dial]
            }
            state[9] = recon[i][2][9];
            state[10] = recon[i][2][10];
            document.querySelector("#clock").style.transform = "";
            document.querySelector("#clock").style.transform = "rotate("+state[10]*90+"deg)";
            document.querySelectorAll(".bigCircle,.dial").forEach(element => element.style.backgroundColor = (state[9] == 0 ? "white" : "black"));
            document.querySelectorAll(".circle").forEach(element => element.style.backgroundColor = (state[9] == 0 ? "black" : "white "));
        }
        // flips
        else if (timeStamp >= recon[i][0] && recon[i][2] == "flip") {
            flipDegrees = ((timeStamp-recon[i][0])/(recon[i][1]-recon[i][0]) > 1 ? 1 : (timeStamp-recon[i][0])/(recon[i][1]-recon[i][0])) * 180;
            if(recon[i][3]==="x2"){
                clockElement.style.transform = "";
                clockElement.style.transform = " rotateX("+(-flipDegrees)+"deg) rotate("+state[10]*90+"deg)";
                state[10] = [2,1,0,3][state[10]];
            }
            else if(recon[i][3]==="y2"){
                clockElement.style.transform = "";
                clockElement.style.transform = " rotateY("+flipDegrees+"deg) rotate("+state[10]*90+"deg)";
                state[10] = [0,3,2,1][state[10]];
            }
            else if(recon[i][3]==="x2z"){
                clockElement.style.transform = "";
                clockElement.style.transform = `rotateX(${flipDegrees}deg) rotate(${state[10]*90+(flipDegrees/(flipDegrees > 90 ? -2 : 2))}deg)`
                state[10] = [3,2,1,0][state[10]];
            }
            else if(recon[i][3]==="x2z'"){
                clockElement.style.transform = "";
                clockElement.style.transform = `rotateX(${flipDegrees}deg) rotate(${state[10]*90+(flipDegrees/(flipDegrees > 90 ? 2 : -2))}deg)`
                state[10] = [1,0,3,2][state[10]];
            }
            if (flipDegrees>90){
                state[9] = recon[i][4][9];
                document.querySelectorAll(".bigCircle,.dial").forEach(element => element.style.backgroundColor = (state[9] == 0 ? "white" : "black"));
                document.querySelectorAll(".circle").forEach(element => element.style.backgroundColor = (state[9] == 0 ? "black" : "white "));
                for (let dial=0; dial<9; dial++){
                    document.querySelectorAll(".dial")[dial].style.transform = "translate(50px, 2px) rotate("+recon[i][4][dial]*30+"deg)";
                    state[dial] = recon[i][4][dial]
                }
            }
        }
        // moves that turn the dials
        else if (timeStamp > recon[i][0]) {
            turnDegrees = ((timeStamp-recon[i][0])/(recon[i][1]-recon[i][0]) > 1 ? 1 : (timeStamp-recon[i][0])/(recon[i][1]-recon[i][0])) * recon[i][3]*30;
            for (dial of recon[i][2]){
                document.querySelectorAll(".dial")[dial].style.transform = "translate(50px, 2px) rotate("+(state[dial]*30+turnDegrees)%360+"deg)";
            }
            if (timeStamp >= recon[i][1]) {
                for (dial of recon[i][2]) {
                    state[dial] += recon[i][3];
                }
            }
        }
    }
    document.querySelector("#time").innerHTML = "time: "+timeStamp.toFixed(2);
    document.querySelector("#recon").innerHTML = JSON.stringify(recon);;
}, 10);


//restricts input from 1-12 when typing dial positions
function restrictInput(inputElement) {
    let value = inputElement.value;
    value = value.replace(/\D/g, "");
    if (value === "") {
      return;
    }
    if (value < 1) {
      value = 1;
    } else if (value > 12) {
      value = 12;
    }
    inputElement.value = value;
  }

function waitForButtonPress() {
    return new Promise(resolve => {
        const button = document.getElementById('enterPosition');
        button.addEventListener('click', () => {
            const input = document.getElementById('position');
            resolve(input.value);
        });
    });
}

let items = document.querySelectorAll(".circle")
var selectedIndexes = [];
items.forEach(function(item, index) {
    item.addEventListener('click', function() {
        if (go == true){
            item.classList.toggle('selected');
            if (item.classList.contains('selected')) {
                selectedIndexes.push(index);
            } else {
                var selectedIndex = selectedIndexes.indexOf(index);
                selectedIndexes.splice(selectedIndex, 1);
            }
        }
    });
});

function copyToClipboard() {
    var copyText = document.querySelector("#recon").innerHTML;
    navigator.clipboard.writeText(copyText).then(() => {
        alert("Copied to clipboard");
    });
}


function submitRecon() {
    document.getElementById('submitStatus').textContent = "submitting reconstruction... (if this message  doesn't disappear, ensure that all information is complete and resubmit)";

    let solverName = document.getElementById("solverName").value;
    let solveTime = document.getElementById("solveTime").value;
    let solverWCAID = document.getElementById("solverWCAID").value;
    let solveScramble = document.getElementById("solveScramble").value;
    let timerStart = document.getElementById("timerStart").value;
    let solveDate = document.getElementById("solveDate").value;
    let officialStatus = document.getElementById("official").checked ? "Official" : "Unofficial";
    let compName = document.getElementById("compName").value;
    let compLink = document.getElementById("compLink").value;
    let methodUsed = document.querySelector('input[name="methodRadio"]:checked').value;

    // Create the submissionData object
    let submissionData = {
        solverName: solverName,
        solveTime: solveTime,
        solverWCAID: solverWCAID,
        solveScramble: solveScramble,
        timerStart: timerStart,
        solveDate: solveDate,
        officialStatus: officialStatus,
        vidId: vidId,
        compName: compName,
        compLink: compLink,
        recon: recon,
        methodUsed: methodUsed,
    };
    //).bind(
        //numValue, nameValue, titleValue, wcaidValue, idValue, reconValue, startTimeValue, endTimeValue,
        //solveStartValue, tagsValue, scrambleValue, inspectionValue, solutionValue, dateValue,
        //competitionNameValue, competitionLinkValue, authorValue, authorIdValue, averageValue
    //);
    document.cookie = `reconData=${JSON.stringify(submissionData)}; Max-Age=40000000; path=/; domain=clockdb.net; secure; SameSite=Strict`
    fetch("/reconstruct/submit")
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(data => {
            document.getElementById('submitStatus').textContent = data;
        })
        .catch(error => {
            document.getElementById('submitStatus').textContent = "Error. Please ensure all information in complete and try again. Contact me if this continues. Leave this tab open.";
        });
}



function saveRecon() {
    document.getElementById('saveStatus').textContent = "saving reconstruction... (if this message doesn't disappear, something went wrong please contact me so I can fix it)";

    let solverName = document.getElementById("solverName").value;
    let solveTime = document.getElementById("solveTime").value;
    let solverWCAID = document.getElementById("solverWCAID").value;
    let solveScramble = document.getElementById("solveScramble").value;
    let timerStart = document.getElementById("timerStart").value;
    let solveDate = document.getElementById("solveDate").value;
    let officialStatus = document.getElementById("official").checked ? "Official" : "Unofficial";
    let compName = document.getElementById("compName").value;
    let compLink = document.getElementById("compLink").value;
    let methodUsed = document.querySelector('input[name="methodRadio"]:checked')?.value || "";

    // Create the submissionData object
    let submissionData = {
        solverName: solverName,
        solveTime: solveTime,
        solverWCAID: solverWCAID,
        solveScramble: solveScramble,
        timerStart: timerStart,
        solveDate: solveDate,
        officialStatus: officialStatus,
        vidId: vidId,
        compName: compName,
        compLink: compLink,
        recon: recon,
        methodUsed: methodUsed,
    };
    //).bind(
        //numValue, nameValue, titleValue, wcaidValue, idValue, reconValue, startTimeValue, endTimeValue,
        //solveStartValue, tagsValue, scrambleValue, inspectionValue, solutionValue, dateValue,
        //competitionNameValue, competitionLinkValue, authorValue, authorIdValue, averageValue
    //);
    document.cookie = `reconData=${JSON.stringify(submissionData)}; Max-Age=40000000; path=/; domain=clockdb.net; secure; SameSite=Strict`
    fetch("/reconstruct/save")
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(data => {
            document.getElementById('saveStatus').textContent = data;
        })
        .catch(error => {
            document.getElementById('saveStatus').textContent = "Error. Contact me if this continues. Leave this tab open because nothing was saved.";
        });
}


window.addEventListener('beforeunload', function (event) {
    // Custom message is not displayed in modern browsers, but you can set a returnValue
    event.preventDefault(); // Prevent the default action
    event.returnValue = ''; // Chrome requires returnValue to be set
});


