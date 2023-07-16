// all the code in this file is a mess sorry

var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);


var player
document.querySelector("#submitVideo").addEventListener("click", function() {
    let vidId = document.querySelector("#videoLink").value.split("v=")[1]
    player = new YT.Player('player', {
        height: '390',
        width: '640',
        videoId: vidId,
        playerVars: {
            'playsinline': 1,
            'modestbranding':1,
        },
        events: {
            'onReady': onPlayerReady
        }
    });
    document.querySelector("#step1").style.display = "none";
    document.querySelector("#video").style.display = "block";
    document.querySelector("#step2").style.display = "block";
})

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

let recon = [];
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
    r.innerHTML = `<td>flip</td><td><input type='text' oninput='recon[${recon.length-1}][0]=parseFloat(this.value)'></td><td><input type='text' oninput='recon[${recon.length-1}][1]=parseFloat(this.value)'></td>`;    t.appendChild(r);
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
                clockElement.style.transform = "rotateX("+(-flipDegrees)+"deg) rotate("+state[10]*90+"deg)";
            }
            else if(recon[i][3]==="y2"){
                clockElement.style.transform = "rotateY("+flipDegrees+"deg) rotate("+state[10]*90+"deg)";
            }
            else if(recon[i][3]==="x2z"){
                clockElement.style.transform = `rotateX(${flipDegrees}deg) rotate(${state[10]*90+(flipDegrees/(flipDegrees > 90 ? -2 : 2))}deg)`
            }
            else if(recon[i][3]==="x2z'"){
                clockElement.style.transform = `rotateX(${flipDegrees}deg) rotate(${state[10]*90+(flipDegrees/(flipDegrees > 90 ? 2 : -2))}deg)`
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