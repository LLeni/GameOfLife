const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const canvasX =  canvas.getBoundingClientRect().left;
let clickX = 0;

const canvasY =  canvas.getBoundingClientRect().top;
let clickY = 0;

const lengthCellsSlider = document.getElementById("lengthCellsSlider");
let lengthCell = 0;

const speedSlider = document.getElementById("speedSlider");
let speedDay = 0;

canvas.addEventListener('click', handlerClickCanvas);

let currentGeneration = new Array();

let timerId;

$('#lengthCellsSlider').on('input', function() {
   initGrid();
});

$('#speedSlider').on('input', function() {
    speedDay = parseInt(speedSlider.value * 10);
    console.log("speedY");
 });



function handlerClickCanvas(e) {
    clickX = e.clientX;
    clickY = e.clientY;
    
    ctx.rect(parseInt(Math.trunc((clickX-canvasX)/lengthCell))*lengthCell  , parseInt(Math.trunc((clickY-canvasY)/lengthCell))*lengthCell, lengthCell, lengthCell);
    ctx.fill();

    currentGeneration[parseInt(Math.trunc((clickY-canvasY)/lengthCell))][parseInt(Math.trunc((clickX-canvasX)/lengthCell))] = 1;

  }

function initGrid(){
    lengthCell = parseInt(lengthCellsSlider.value);
    currentGeneration = new Array();
    for(let i = 0; i <= (canvas.width/lengthCell); i++){
        currentGeneration.push(new Array());
        for(let j = 0; j <= (canvas.height/lengthCell); j++){
            currentGeneration[i].push(0);
        }
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGrid();
}

function drawGrid(){
    for(let currentPosVertLine = 0; currentPosVertLine <= (canvas.width/lengthCell); currentPosVertLine++  ){
        ctx.beginPath();
        ctx.moveTo(lengthCell * currentPosVertLine, 0);
        ctx.lineTo(lengthCell * currentPosVertLine, canvas.height);
        ctx.stroke();
    }
    for(let currentPosHorLine = 0; currentPosHorLine < (canvas.height/lengthCell); currentPosHorLine++  ){
        ctx.beginPath();
        ctx.moveTo(0, lengthCell * currentPosHorLine);
        ctx.lineTo(canvas.width, lengthCell * currentPosHorLine);
        ctx.stroke();
    }
}

function live(){

    timerId = setInterval(liveOneDay, speedDay);
}

function liveOneDay(){
    var countLives;
//    var nextCells = cells;
    let nextGeneration = new Array();
    for(let i = 0; i < currentGeneration.length; i++){
        nextGeneration.push(new Array());
        for(let j = 0; j < currentGeneration[i].length; j++){
            nextGeneration[i].push(0);
        }
    }

    for(let line = 0; line < currentGeneration.length; line++){
        for(let column = 0; column < currentGeneration[line].length; column++){
            countLives = 0;
            if((line > 0 && column > 0)  && (line < currentGeneration.length-1 && column < currentGeneration[line].length-1)){
                if(currentGeneration[line-1][column-1] == 1) countLives ++; // NorthWest
                if(currentGeneration[line][column-1] == 1) countLives ++; // West
                if(currentGeneration[line+1][column-1] == 1) countLives ++; // SouthWest
                if(currentGeneration[line-1][column] == 1) countLives ++; // North
                if(currentGeneration[line+1][column] == 1) countLives ++; // South
                if(currentGeneration[line-1][column+1] == 1) countLives ++; // NorthEast
                if(currentGeneration[line][column+1] == 1) countLives ++; // East
                if(currentGeneration[line+1][column+1] == 1) countLives ++; // SouthEast
            } else if (line == 0 && column == 0){
                if(currentGeneration[line][column+1] == 1) countLives ++; // East
                if(currentGeneration[line+1][column] == 1) countLives ++; // South
                if(currentGeneration[line+1][column+1] == 1) countLives ++; // SouthEast
            } else if (line == currentGeneration.length-1 && column == currentGeneration[line].length-1){
                if(currentGeneration[line-1][column-1] == 1) countLives ++; // NorthWest
                if(currentGeneration[line-1][column] == 1) countLives ++; // North
                if(currentGeneration[line][column-1] == 1) countLives ++; // West
            } else if (line > 0 && column == 0 && line < currentGeneration.length-1 ){
                if(currentGeneration[line-1][column] == 1) countLives ++; // North
                if(currentGeneration[line-1][column-1] == 1) countLives ++; // NorthWest
                if(currentGeneration[line][column+1] == 1) countLives ++; // East
                if(currentGeneration[line+1][column] == 1) countLives ++; // South
                if(currentGeneration[line+1][column+1] == 1) countLives ++; // SouthEast
            } else if (line == 0 && column > 0  && column < currentGeneration[line].length-1 ){
                if(currentGeneration[line][column-1] == 1) countLives ++; // West
                if(currentGeneration[line+1][column-1] == 1) countLives ++; // SouthWest
                if(currentGeneration[line+1][column] == 1) countLives ++; // South
                if(currentGeneration[line+1][column+1] == 1) countLives ++; // SouthEast
                if(currentGeneration[line][column+1] == 1) countLives ++; // East
            } else if (line == currentGeneration.length-1 && column > 0 && column < currentGeneration[line].length-1 ){
                if(currentGeneration[line-1][column-1] == 1) countLives ++; // NorthWest
                if(currentGeneration[line-1][column] == 1) countLives ++; // North
                if(currentGeneration[line-1][column+1] == 1) countLives ++; // NorthEast
                if(currentGeneration[line][column+1] == 1) countLives ++; // East
                if(currentGeneration[line][column-1] == 1) countLives ++; // West
            } else if (line > 0 &&  column == currentGeneration[line].length-1 && line < currentGeneration.length-1 ){
                if(currentGeneration[line-1][column-1] == 1) countLives ++; // NorthWest
                if(currentGeneration[line-1][column] == 1) countLives ++; // North
                if(currentGeneration[line][column+1] == 1) countLives ++; // East
                if(currentGeneration[line+1][column-1] == 1) countLives ++; // SouthWest
                if(currentGeneration[line+1][column] == 1) countLives ++; // South
            }

            console.log(countLives);
            if(currentGeneration[line][column] == 1){
                if(countLives == 2 || countLives == 3){
                    nextGeneration[line][column] = 1
                } else {
                    nextGeneration[line][column] = 0;
                }
            } else{

                if(countLives == 3){
                    nextGeneration[line][column] = 1;
                } else {
                    nextGeneration[line][column] = 0;
                }
            }
        }
    }

    currentGeneration = nextGeneration;
    redraw();
}

function redraw(){
    for(let line = 0; line < currentGeneration.length; line++){
        for(let column = 0; column < currentGeneration[line].length; column++){
            if(currentGeneration[line][column] == 0){
                ctx.clearRect(column * lengthCell, line * lengthCell,lengthCell,lengthCell);
            } else {
                ctx.fillRect(column * lengthCell, line * lengthCell,lengthCell,lengthCell);
            }
        }
    }
    drawGrid(); // Потому что clearRect задевает сетку
}

function stop(){
    clearInterval(timerId);
}