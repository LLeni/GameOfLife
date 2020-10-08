//TODO: При нажатии на play кнопка меняет цвет на зеленный, при повторном нажатии кнопка возвращает свой первоначальный вид
//TODO: При спуске страницы неправильно заселяются жители
//TODO: На границах матрицы не учитываются возможные пустые клетки, которые могли бы быть за ее пределами, т.е надо нашу матрицу окружать стенами (5x5 в 6x6) 

const MESSENGE_NOT_SET_LENGTH_CELL = "Вы еще не задали размер сетки";

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const numberGenerationB = document.getElementById("numberGenerationB");
let numberGeneration = 0;

//const numberLiveB = document.getElementById("numberLiveB");
//let numberLive = 0;

//const numberDeadB = document.getElementById("numberDeadB");
//let numberDead = 0;

const canvasX =  canvas.getBoundingClientRect().left;
let clickX = 0;

const canvasY =  canvas.getBoundingClientRect().top;
let clickY = 0;

const lengthCellsSlider = document.getElementById("lengthCellsSlider");
const valueLengthCellsSlider = document.getElementById("valueLengthCellsSlider");
let lengthCell = 0;

const speedSlider = document.getElementById("speedSlider");
const valueSpeedSlider = document.getElementById("valueSpeedSlider");
let speedDay = 0;

const colorPicker = document.getElementById("colorPicker");

const playButton = document.getElementById("playButton");

canvas.addEventListener('click', handlerClickCanvas);

let currentGeneration = new Array();
let timerId;
let isLiveDays = false;
let style = document.createElement('style');

$(document).ready(init());

function init(){
    //initGrid(); //TODO: По какой-то необъяснимой причине после загрузки страницы нельзя сразу же инициализировать сетку, т.к пропадают кнопки
    initSpeed();
}


$('#lengthCellsSlider').on('input', function() {
   initGrid();
   clearInterval(timerId);
});

$('#speedSlider').on('input', function() {
    initSpeed();
 });

function initSpeed(){
    speedDay = parseInt(speedSlider.value * 10);
    valueSpeedSlider.innerHTML = (speedDay/1000) + "sec";
    if(isLiveDays){
        clearInterval(timerId);
        timerId = setInterval(liveOneDay, speedDay);
    }
}

function handlerClickCanvas(e) {
    clickX = e.clientX;
    clickY = e.clientY;
    
    ctx.fillStyle = colorPicker.value;
    ctx.fillRect(parseInt(Math.trunc((clickX-canvasX)/lengthCell))*lengthCell + 1, parseInt(Math.trunc((clickY-canvasY)/lengthCell))*lengthCell + 1, lengthCell - 2, lengthCell - 2);

   // ctx.fill();
   // ctx.fillRect(column * lengthCell, line * lengthCell,lengthCell,lengthCell);
    currentGeneration[parseInt(Math.trunc((clickY-canvasY)/lengthCell))][parseInt(Math.trunc((clickX-canvasX)/lengthCell))] = 1;

    console.log((clickX-canvasX) + " " + (clickY-canvasY));
  }

function initGrid(){
    numberGeneration = 0;
    numberGenerationB.innerHTML = numberGeneration;
    stop();
    lengthCell = parseInt(lengthCellsSlider.value);
    valueLengthCellsSlider.innerHTML = lengthCell + "px";
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
        ctx.strokeStyle = "#FFFFFF";
        ctx.stroke();
    }
    for(let currentPosHorLine = 0; currentPosHorLine < (canvas.height/lengthCell); currentPosHorLine++  ){
        ctx.beginPath();
        ctx.moveTo(0, lengthCell * currentPosHorLine);
        ctx.lineTo(canvas.width, lengthCell * currentPosHorLine);
        ctx.strokeStyle = "#FFFFFF";
        ctx.stroke();
    }
}

function live(){

    if(lengthCell == 0){
        alert(MESSENGE_NOT_SET_LENGTH_CELL);
    } else {
        if(isLiveDays == false){
            timerId = setInterval(liveOneDay, speedDay);
            isLiveDays = true;
            playButton.style.backgroundColor = '#e5e5e5';
        } else {
            clearInterval(timerId);
            isLiveDays = false;
        }
    }
}

function next(){
    clearInterval(timerId);
    isLiveDays = false;

    liveOneDay();
}

function liveOneDay(){
    
    var countLives;
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
    numberGeneration++;
    numberGenerationB.innerHTML = numberGeneration;
    redraw();
}


function redraw(){
    for(let line = 0; line < currentGeneration.length; line++){
        for(let column = 0; column < currentGeneration[line].length; column++){
            if(currentGeneration[line][column] == 0){
                ctx.clearRect(column * lengthCell + 1, line * lengthCell + 1, lengthCell - 2, lengthCell - 2);
            } else {
                ctx.fillRect(column * lengthCell + 1, line * lengthCell + 1, lengthCell - 2, lengthCell - 2);
            }
        }
    }
    //  drawGrid(); // Потому что clearRect задевает сетку
}

function clearGrid(){
    if(lengthCell == 0){
        alert(MESSENGE_NOT_SET_LENGTH_CELL);
    } else {
        numberGeneration = 0;
        numberGenerationB.innerHTML = numberGeneration;
        stop();
        for(let i = 0; i < currentGeneration.length; i++){
            for(let j = 0; j < currentGeneration[i].length; j++){
                currentGeneration[i][j] = 0;
            }
        }
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawGrid();
    }
}