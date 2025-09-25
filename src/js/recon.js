// I don't actually know for sure if this file is used at all but I am guessing no. I think it is from when I had a different plan for the reconstruction tool but for now I will leave it and figure out what to do with it later.
var radios = document.getElementsByName('officialRadio');

for(var i = 0; i < radios.length; i++) {
    radios[i].addEventListener('change', function() {
        var currentDiv = this.id+"Div";
        document.getElementById("officialDiv").style.display = 'none';
        document.getElementById("unofficialDiv").style.display = 'none';
        document.getElementById(currentDiv).style.display = 'block';
    });
}





let zRotation = 0;
let intermediateState // unique to textrecon.js

// the state is always stored with the front being the side facing you with 12 facing upwards, regardless of what the z rotation is.
let state = {
  'f': [0,0,0,0,0], // front edges
  'b': [0,0,0,0,0], // back edges
  'c': [0,0,0,0], // corners
}

function flip() { //flips the clock
  let temp = state['f'];
  [state['f'],state['b']] = [state['b'],state['f']] // swap front and back dials
  state['c'] = state['c'].map(num => (12 - num)%12); // set each corner dial dial to 12-dial
  state['c'] = [state['c'][1],state['c'][0],state['c'][3],state['c'][2]] // swaps the corner dials around

}


function move(m,a) { //move, amount
  if (m == 'UL') {
    [0,1,2].map(i => state['f'][i] += a);
    state['c'][0] += a;
  }
  if (m == 'UR') {
    [0,2,3].map(i => state['f'][i] += a);
    state['c'][1] += a;
  }
  if (m == 'DL') {
    [1,2,4].map(i => state['f'][i] += a);
    state['c'][2] += a;
  }
  if (m == 'DR') {
    [2,3,4].map(i => state['f'][i] += a);
    state['c'][3] += a;
  }
  if (m == 'U') {
    [0,1,2,3].map(i => state['f'][i] += a);
    state['c'][0] += a;
    state['c'][1] += a;
  }
  if (m == 'R') {
    [0,2,3,4].map(i => state['f'][i] += a);
    state['c'][1] += a;
    state['c'][3] += a;
  }
  if (m == 'D') {
    [1,2,3,4].map(i => state['f'][i] += a);
    state['c'][2] += a;
    state['c'][3] += a;
  }
  if (m == 'L') {
    [0,1,2,4].map(i => state['f'][i] += a);
    state['c'][0] += a;
    state['c'][2] += a;
  }
  if (m == '/') {
    [0,1,2,3,4].map(i => state['f'][i] += a);
    state['c'][1] += a;
    state['c'][2] += a;
  }
  if (m == '\\') {
    [0,1,2,3,4].map(i => state['f'][i] += a);
    state['c'][0] += a;
    state['c'][3] += a;
  }
  if (m == 'ul') {
    [0,1,2,3,4].map(i => state['f'][i] += a);
    state['c'][1] += a;
    state['c'][2] += a;
    state['c'][3] += a;
  }
  if (m == 'ur') {
    [0,1,2,3,4].map(i => state['f'][i] += a);
    state['c'][0] += a;
    state['c'][2] += a;
    state['c'][3] += a;
  }
  if (m == 'dl') {
    [0,1,2,3,4].map(i => state['f'][i] += a);
    state['c'][0] += a;
    state['c'][1] += a;
    state['c'][3] += a;
  }
  if (m == 'dr') {
    [0,1,2,3,4].map(i => state['f'][i] += a);
    state['c'][0] += a;
    state['c'][1] += a;
    state['c'][2] += a;
  }
  if (m == 'ALL') {
    [0,1,2,3,4].map(i => state['f'][i] += a);
    state['c'][0] += a;
    state['c'][1] += a;
    state['c'][2] += a;
    state['c'][3] += a;
  }
  
}


function moveRotator(m) { //gets the move's letter, and adjusts it using the z rotation
  let moveRotations = {
    "UL": ["UL", "UR", "DR", "DL"],
    "UR": ["UR", "DR", "DL", "UL"],
    "DR": ["DR", "DL", "UL", "UR"],
    "DL": ["DL", "UL", "UR", "DR"],
    "U": ["U", "R", "D", "L"],
    "R": ["R", "D", "L", "U"],
    "D": ["D", "L", "U", "R"],
    "L": ["L", "U", "R", "D"],
    "ul": ["ul", "ur", "dr", "dl"],
    "ur": ["ur", "dr", "dl", "ul"],
    "dr": ["dr", "dl", "ul", "ur"],
    "dl": ["dl", "ul", "ur", "dr"],
    "/": ["/", "\\", "/", "\\"],
    "\\": ["\\", "/", "\\", "/"],
    "ALL": ["ALL", "ALL", "ALL", "ALL"]
  }
  try {
    let p1 = m.slice(0,-2)
    return moveRotations[p1][zRotation]
  }
  catch {}
}
function basicMoveRotator(m) { //gets the move's letter, and adjusts it using the z rotation
  let moveRotations = {
    "UL": ["UL", "UR", "DR", "DL"],
    "UR": ["UR", "DR", "DL", "UL"],
    "DR": ["DR", "DL", "UL", "UR"],
    "DL": ["DL", "UL", "UR", "DR"],
    "U": ["U", "R", "D", "L"],
    "R": ["R", "D", "L", "U"],
    "D": ["D", "L", "U", "R"],
    "L": ["L", "U", "R", "D"],
    "ul": ["ul", "ur", "dr", "dl"],
    "ur": ["ur", "dr", "dl", "ul"],
    "dr": ["dr", "dl", "ul", "ur"],
    "dl": ["dl", "ul", "ur", "dr"],
    "/": ["/", "\\", "/", "\\"],
    "\\": ["\\", "/", "\\", "/"],
    "ALL": ["ALL", "ALL", "ALL", "ALL"]
  }
  try {
    return moveRotations[m][zRotation]
  }
  catch {}
}
function moveReader(m) {
  let p1 = m.slice(0,-2)
  let p2 = m.slice(-2)
  if (p2.endsWith("-")) {
    return Number("-"+p2.slice(0,-1))
  }
  else if (p2.endsWith("+")) {
    return Number(p2.slice(0,-1))
  } // gets the move's amount, properly converted
}
function basicMoveReader(m) {
  if (m.endsWith("-")) {
    return Number("-"+m.slice(0,-1))
  }
  else if (m.endsWith("+")) {
    return Number(m.slice(0,-1))
  }
}

function goThrough(listOfMoves) {
  let moves = listOfMoves.split(" ");

  for (let i=0; i<moves.length; i++){

    // does flips
    if (moves[i] == "y2"){
      flip()
      zRotation = [0,3,2,1][zRotation]
    }
    else if (moves[i] == "x2") {
      flip()
      zRotation = [2,1,0,3][zRotation]
    }
    else if (moves[i] == "x2z") {
      flip()
      zRotation = [1,0,3,2][zRotation]
    }
    else if (moves[i] == "x2z'") {
      flip()
      zRotation = [3,2,1,0][zRotation]
    }
    else if (moves[i] == "z") {
      zRotation = (zRotation+3)%4
    }
    else if (moves[i] == "z2") {
      zRotation = (zRotation+2)%4
    }
    else if (moves[i] == "z'") {
      zRotation = (zRotation+1)%4
    }

    // does simul moves
    else if (moves[i].includes("(")) {
      let y2Moves = { //used for simul move back turns
        "UL": "ur",
        "UR": "ul",
        "DR": "dl",
        "DL": "dr",
        "U": "D",
        "R": "R",
        "D": "U",
        "L": "L",
        "ul": "UR",
        "ur": "UL",
        "dr": "DL",
        "dl": "DR",
        "/": "/",
        "\\": "\\",
        "ALL": "all not yet added to moves"
      }
      let baseMove = moves[i].split("(")[0]
      if (["UL","DL","L","dr","ur","\\"].includes(baseMove)) {
        // left hand move (up pins)
        let cm1 = basicMoveRotator(baseMove)
        let cm2 = basicMoveReader(moves[i].split('(')[1].split(',')[0])
        move(cm1,cm2)
        beautify()
        intermediateState = modifiedState() 
        // right hand move (down pins)
        flip()
        zRotation = [0,3,2,1][zRotation] //this line is needed because we are doing a yrotation, which isn't always the same as a flip
        cm1 = basicMoveRotator(y2Moves[baseMove])
        cm2 = 0-basicMoveReader(moves[i].split(',')[1].split(")")[0])
        move(cm1,cm2)
        flip()
        zRotation = [0,3,2,1][zRotation]
      }

      else if (["UR","DR","R","dl","ul","/"].includes(baseMove)) {
        // left hand move (down pins)
        flip()
        zRotation = [0,3,2,1][zRotation]
        let cm1 = basicMoveRotator(y2Moves[baseMove])
        let cm2 = 0-basicMoveReader(moves[i].split('(')[1].split(',')[0])
        move(cm1,cm2)
        flip()
        zRotation = [0,3,2,1][zRotation]
        beautify()
        intermediateState = modifiedState()//state//is this supposed to be b4 the flip?
        // right hand move (up pins)
        cm1 = basicMoveRotator(baseMove)
        cm2 = basicMoveReader(moves[i].split(',')[1].split(")")[0])
        move(cm1,cm2)
      }
    }
    // does normal moves
    else {
      let cm1 = moveRotator(moves[i]) // gets the move's letter
      let cm2 = moveReader(moves[i]) // gets the move's amount, properly converted
      move(cm1,cm2)
    }
  }
}


function beautify() {
  state['f'] = state['f'].map(num => (num+144)%12)
  state['b'] = state['b'].map(num => (num+144)%12)
  state['c'] = state['c'].map(num => (num+144)%12)
}

// goThrough(scramble)
// beautify()
// console.log(state)


// reconstruction part of the tool begins here. (everything above was just for simulating the state of the clock) ----------------------------------------------------------
function modifiedState() {
  return [state['c'][0],state['f'][0],state['c'][1],state['f'][1],state['f'][2],state['f'][3],state['c'][2],state['f'][4],state['c'][3]]
}
//function modifiedIntermediateState() { //needed cause of simul moves and poor planning
//  return [intermediateState['c'][0],intermediateState['f'][0],intermediateState['c'][1],intermediateState['f'][1],intermediateState['f'][2],intermediateState['f'][3],intermediateState['c'][2],intermediateState['f'][4],intermediateState['c'][3]]
//}
  
function findDifferences(list1, list2) {
  let result = [];
    for (let i = 0; i < 9; i++){
      if (list1[i] !== list2[i]) {
        result.push(i);
      }
    }
    return result;
}
  
// this is how stuff works on clockdb after flips
function flipAdjust(s) {
  return([12-s[2],12-s[1],12-s[0],12-s[5],12-s[4],12-s[3],12-s[8],12-s[7],12-s[6]])
}
  

function generateRecon(scramble,inspection,solution,time,frontColor) {
  flipped=false
  flippedPlaces = [2,1,0,5,4,3,8,7,6]
  
  let recon = '[[0.01,"set",'
  
  zRotation = 0 
  state = {
    'f': [0,0,0,0,0], // front edges
    'b': [0,0,0,0,0], // back edges
    'c': [0,0,0,0], // corners
  }
  // set step
  goThrough(scramble)
  goThrough(inspection)
  beautify()
  recon+=`[${state['c'][0]},${state['f'][0]},${state['c'][1]},${state['f'][1]},${state['f'][2]},${state['f'][3]},${state['c'][2]},${state['f'][4]},${state['c'][3]},${frontColor},${(4-zRotation)%4}]`

  // set pins
  let scrambleSteps = scramble.split(" ");
  let pins = [0, 0, 0, 0];
  for (let i = 15; i < scrambleSteps.length; i++) {
    if (scrambleSteps[i] === "UL") {
      pins[0] = 1;
    }
    if (scrambleSteps[i] === "UR") {
      pins[1] = 1;
    }
    if (scrambleSteps[i] === "DL") {
      pins[2] = 1;
    }
    if (scrambleSteps[i] === "DR") {
      pins[3] = 1;
    }
  }
  if (inspection.includes("x2") || inspection.includes("y2")) {
    for (let x = 0; x < 4; x++) {
      pins[x] = (pins[x] + 1) % 2;
    }
    let temp = pins[0];
    pins[0] = pins[1];
    pins[1] = temp;
    temp = pins[2];
    pins[2] = pins[3];
    pins[3] = temp;
  }
  recon+=`,[${pins}]]` 
    
  // go through steps
  solutionSteps = solution.split(" ")
  timeSteps = (time / solutionSteps.length).toFixed(5)
  console.log(timeSteps)
  console.log(solutionSteps)
  for (let i=0; i<solutionSteps.length; i++){
    // flips
    if (['x2','y2','z','z2',"z'","x2z","x2z'"].includes(solutionSteps[i])){
      goThrough(solutionSteps[i])
      flipped = !flipped
      frontColor = (frontColor+1)%2
      recon+=`,[${(timeSteps*i).toFixed(2)},${(timeSteps*(i+1)).toFixed(2)},"flip","${solutionSteps[i]}",[${flipAdjust(modifiedState())},${frontColor}]]`
    }
    // simul moves
    else if (solutionSteps[i].includes("(")) {
      let baseMove = solutionSteps[i].split("(")[0]
      if (["UL","DL","L","dr","ur","\\"].includes(baseMove)) {
        var moveAmount = basicMoveReader(solutionSteps[i].split('(')[1].split(',')[0])
        var secondMoveAmount = basicMoveReader(solutionSteps[i].split(',')[1].split(")")[0])
  
      }
      else if (["UR","DR","R","dl","ul","/"].includes(baseMove)) {
        var moveAmount = basicMoveReader(solutionSteps[i].split('(')[1].split(',')[0])
        var secondMoveAmount = basicMoveReader(solutionSteps[i].split(',')[1].split(")")[0])
      }
      console.log(moveAmount,secondMoveAmount)
      beautify()
      let priorState=modifiedState()
      goThrough(solutionSteps[i])
      beautify()
      let postState = modifiedState()
      let iState = intermediateState//modifiedIntermediateState()
      //console.log('a',priorState,iState,postState)
      // move 1
      let movingPieces = findDifferences(priorState,iState)
      if (flipped==true) {
        moveAmount = 0-moveAmount
        movingPieces = movingPieces.map(num => flippedPlaces[num]).sort()
      }
      if (movingPieces.length > 0) {
        recon+=`,[${(timeSteps*i).toFixed(2)},${(timeSteps*(i+1)).toFixed(2)},[${movingPieces}],${moveAmount}]`
      }
      // move two
      movingPieces = findDifferences(iState,postState)
      if (flipped==true) {
        secondMoveAmount = 0-secondMoveAmount
        movingPieces = movingPieces.map(num => flippedPlaces[num]).sort()
      }
      if (movingPieces.length > 0) {
	recon+=`,[${(timeSteps*i).toFixed(2)},${(timeSteps*(i+1)).toFixed(2)},[${movingPieces}],${secondMoveAmount}]`
      }
    }
    // normal moves
    else {
      beautify()
      let priorState=modifiedState()
      goThrough(solutionSteps[i])
      beautify()
      let postState = modifiedState()
      // console.log(findDifferences(priorState,postState))
      let moveAmount = moveReader(solutionSteps[i])
      let movingPieces = findDifferences(priorState,postState)
      if (flipped==true) {
        moveAmount = 0-moveAmount
        movingPieces = movingPieces.map(num => flippedPlaces[num]).sort()
      }
      recon+=`,[${(timeSteps*i).toFixed(2)},${(timeSteps*(i+1)).toFixed(2)},[${movingPieces}],${moveAmount}]`
    }
  }
  beautify()
  console.log(state)
  recon+=']'
  return recon
}

/////////////////////////////////

let recon;
let reconLength;
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

let state2 = [0,0,0,0,0,0,0,0,0,0,0];
let pinColors = ['','','',''];
let turnDegrees;
let flipDegrees;
//let previousSolveOfAverage = solve;
//let solveOfAverage = solve;
let timeStamp = 0.01;
function animate() {
    timeStamp = getTime();
    for (let i=0; i<reconLength; i++){
        // moves that set the clock to a specific state2
        if (recon[i][1] === "set" && timeStamp >= recon[i][0]) {
            // sets the dials
            for (let dial=0; dial<9; dial++){
                state2[dial] = recon[i][2][dial]
            }
            // sets the orientation
            state2[9] = recon[i][2][9];
            state2[10] = recon[i][2][10];
            clockElement.style.transform = "";
            clockElement.style.transform = "rotate("+state2[10]*90+"deg)";
            if (window.innerWidth < 430) {
                clockElement.style.transform += " scale(0.7) translate(-50px,0px)"
            }
            bigCircleAndDialElements.forEach(element => element.style.backgroundColor = (state2[9] === 0 ? "white" : "black"));
            circleElements.forEach(element => element.style.backgroundColor = (state2[9] === 0 ? "black" : "white "));
            // sets the pins
            pinColors[0] = recon[i][3][0] === 1 ? "yellow" : "gray";
            pinColors[1] = recon[i][3][1] === 1 ? "yellow" : "gray";
            pinColors[2] = recon[i][3][2] === 1 ? "yellow" : "gray";
            pinColors[3] = recon[i][3][3] === 1 ? "yellow" : "gray";

            // sets solve of average
            //if (data[solve].average !== null) {
                //solveOfAverage = recon[i][4];
            //}
        }
        // flips
        else if (recon[i][2] === "flip" && timeStamp >= recon[i][0]) {
            flipDegrees = ((timeStamp-recon[i][0])/(recon[i][1]-recon[i][0]) > 1 ? 1 : (timeStamp-recon[i][0])/(recon[i][1]-recon[i][0])) * 180;
            if(recon[i][3]==="x2"){
                clockElement.style.transform = "";
                clockElement.style.transform = " rotateX("+(-flipDegrees)+"deg) rotate("+state2[10]*90+"deg)";
            }
            else if(recon[i][3]==="y2"){
                clockElement.style.transform = "";
                clockElement.style.transform = " rotateY("+flipDegrees+"deg) rotate("+state2[10]*90+"deg)";
            }
            else if(recon[i][3]==="x2z"){
                clockElement.style.transform = "";
                clockElement.style.transform = `rotateX(${flipDegrees}deg) rotate(${state2[10]*90+(flipDegrees/(flipDegrees > 90 ? -2 : 2))}deg)`

            }
            else if(recon[i][3]==="x2z'"){
                clockElement.style.transform = "";
                clockElement.style.transform = `rotateX(${flipDegrees}deg) rotate(${state2[10]*90+(flipDegrees/(flipDegrees > 90 ? 2 : -2))}deg)`

            }            
            if (flipDegrees>90){
                state2[9] = recon[i][4][9];
                bigCircleAndDialElements.forEach(element => element.style.backgroundColor = (state2[9] === 0 ? "white" : "black"));
                circleElements.forEach(element => element.style.backgroundColor = (state2[9] === 0 ? "black" : "white "));
                for (let dial=0; dial<9; dial++){
                    state2[dial] = recon[i][4][dial]
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
                state2[dial] += turnDegrees;
            }
        }
    } 
    // sets the state2 of the dials and pins
    for (let dial=0; dial<9; dial++){
        dialElements[dial].style.transform = "translate(50px, 2px) rotate("+(state2[dial]*30)+"deg)";
    }
    pinULElement.style.backgroundColor = pinColors[0];
    pinUElement.style.backgroundColor = pinColors[1];
    pinLElement.style.backgroundColor = pinColors[2];
    pinCElement.style.backgroundColor = pinColors[3];

    // updates the solve if in an average and the video is on a new solve (I have no clue if this code works for text reconstructions btw so I guess we'll see if an ao5 is made.)
    //if (solveOfAverage != previousSolveOfAverage) {
        //solve = solveOfAverage;
        //for (let s = 0; s < averageTimeBoxElements.length; s++) {
            //averageTimeBoxElements[s].classList.remove("selectedTime");
        //}
        //document.querySelector(`.s${solve}`).classList.add('selectedTime');
        //document.querySelector("#title").innerHTML = `<a href="/persons/${data[solve].wcaid}">${data[solve].name}</a> ${data[solve].title}`;
        //document.querySelector("#author").innerHTML = data[solve].author;
        //document.title = data[solve].name + " " + data[solve].title + " - ClockDB";
        //document.querySelector("#scramble").innerHTML = "Scramble: " + data[solve].scramble;
        //document.querySelector("#solution").innerHTML = `Solution: ${data[solve].inspection} ${data[solve].solution}`;
        //window.history.replaceState({ path: "/r/"+solve }, "", "/r/"+solve);
        //recon = JSON.parse(data[solve].recon);
        //reconLength = recon.length;
        //previousSolveOfAverage = solveOfAverage;
    //}

    window.requestAnimationFrame(animate);
};


animate();