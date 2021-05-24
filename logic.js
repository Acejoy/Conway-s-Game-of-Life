const cellSize = 20;
const interval = 100;
var liveCells = new Array();
var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");

const canvasWidth = canvas.width;
const canvasHeight = canvas.height;

const numXCells = Math.floor(canvasWidth / cellSize);
const numYCells = Math.floor(canvasHeight / cellSize);

function getRecCordinates(x_coord, y_coord) {
    rec_x_coord = Math.floor(x_coord / cellSize);
    rec_y_coord = Math.floor(y_coord / cellSize);

    return [rec_x_coord, rec_y_coord];
};

function getCursorPosition(canvas, event, arr, canvasContext) {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    var rec_coord = getRecCordinates(x, y);

    if (isLive(arr, rec_coord)) {
        console.log('removed:'+rec_coord);
        arr = removeCoord(arr, rec_coord);
        drawRectangle(canvasContext, [rec_coord]);
    } else {
        arr.push(rec_coord);
        drawPixels(canvasContext, arr, "#a2a4a6");
    }

    return arr;
};

function drawPixels(canvasContext, arr, style) {

    canvasContext.fillStyle = style;

    for (ind = 0; ind < arr.length; ind++) {
        x_coord = arr[ind][0] * cellSize;
        y_coord = arr[ind][1] * cellSize;
        canvasContext.fillRect(x_coord, y_coord, cellSize, cellSize);
    }

};

function drawRectangle(canvasContext, arr) {
    canvasContext.strokeStyle = "#97999c";
    canvasContext.fillStyle = "#FFFFFF";

    for (ind = 0; ind < arr.length; ind++) {
        x_coord = arr[ind][0] * cellSize;
        y_coord = arr[ind][1] * cellSize;

        canvasContext.fillRect(x_coord, y_coord, cellSize, cellSize);

        canvasContext.moveTo(x, y);
        canvasContext.lineTo(x, y + cellSize);

        canvasContext.moveTo(x, y + cellSize);
        canvasContext.lineTo(x + cellSize, y + cellSize);

        canvasContext.moveTo(x + cellSize, y + cellSize);
        canvasContext.lineTo(x + cellSize, y);

        canvasContext.moveTo(x + cellSize, y);
        canvasContext.lineTo(x, y);        
    }

    context.stroke();
};


function removeCoord(arr, val) {

    var newArr = new Array();

    for (idx = 0; idx < arr.length; idx++) {
        if (arr[idx][0] != val[0] && arr[idx][1] != val[1]) {
            newArr.push([arr[idx][0], arr[idx][1]]);
        }
    }
    return newArr;
}


function isLive(liveArray, coords) {

    for (idx = 0; idx < liveArray.length; idx++) {
        if (coords[0] == liveArray[idx][0] && coords[1] == liveArray[idx][1]) {
            return true;
        }
    }

    return false;
};

function getNumLiveNeighbours(liveArray, curCoord) {
    var numNeighbors = 0;
    //cur coordinate -> (x,y)
    var x = curCoord[0];
    var y = curCoord[1];

    //check for (x+1, y)
    if (x != numXCells - 1 && isLive(liveArray, [curCoord[0] + 1, curCoord[1]])) {
        numNeighbors++;
    }

    //check for (x+1, y+1)
    if ((x != numXCells - 1 || y != numYCells - 1) && isLive(liveArray, [curCoord[0] + 1, curCoord[1] + 1])) {
        numNeighbors++;
    }

    //check for (x, y+1)
    if (y != numYCells - 1 && isLive(liveArray, [curCoord[0], curCoord[1] + 1])) {
        numNeighbors++;
    }

    //check for (x-1, y+1)
    if ((x == 0 || y != numYCells - 1) && isLive(liveArray, [curCoord[0] - 1, curCoord[1] + 1])) {
        numNeighbors++;
    }

    //check for (x-1, y)
    if ((x != 0) && isLive(liveArray, [curCoord[0] - 1, curCoord[1]])) {
        numNeighbors++;
    }

    //check for (x-1, y-1)
    if ((x != 0 || y != 0) && isLive(liveArray, [curCoord[0] - 1, curCoord[1] - 1])) {
        numNeighbors++;
    }

    //check for (x, y-1)
    if (y != 0 && isLive(liveArray, [curCoord[0], curCoord[1] - 1])) {
        numNeighbors++;
    }

    //check for (x+1, y-1)
    if ((x != numXCells - 1 && y != 0) && isLive(liveArray, [curCoord[0] + 1, curCoord[1] - 1])) {
        numNeighbors++;
    }

    return numNeighbors;
};

function updateLiveArray(liveArray) {

    var newArr = new Array();
    var neighbors = 0;
    for (ind_x = 0; ind_x < numXCells; ind_x++) {
        for (ind_y = 0; ind_y < numYCells; ind_y++) {
            neighbors = getNumLiveNeighbours(liveArray, [ind_x, ind_y]);

            if (isLive(liveArray, [ind_x, ind_y])) {
                if (neighbors == 2 || neighbors == 3) {
                    newArr.push([ind_x, ind_y]);
                }
            } else {
                if (neighbors == 3) {
                    newArr.push([ind_x, ind_y]);
                }
            }
        }
    }
    return newArr;
};

function updateCanvas(canvasCtx, liveArray) {

    drawRectangle(canvasCtx, liveArray)    
    liveArray = updateLiveArray(liveArray);
    drawPixels(canvasCtx, liveArray, "#a2a4a6");
    
    return liveArray;
};

function startGame() {
    // liveCells = updateCanvas(context, liveCells);
    // console.log(liveCells);
    document.getElementById("Start").disabled = true; 
    document.getElementById("Stop").disabled = false; 
    myTimer = setInterval(function () {
        liveCells = updateCanvas(context, liveCells)
    },
        interval);

}

function stopGame() {
    clearInterval(myTimer);
    document.getElementById("Start").disabled = false; 
    document.getElementById("Stop").disabled = true; 
}

for (x = 0.5; x < canvasWidth; x += cellSize) {
    context.moveTo(x, 0);
    context.lineTo(x, canvasHeight);
}

for (y = 0.5; y < canvasHeight; y += cellSize) {
    context.moveTo(0, y);
    context.lineTo(canvasWidth, y);
}


context.strokeStyle = "#97999c";
context.stroke();

canvas.addEventListener('mousedown', function (e) {
    liveCells = getCursorPosition(canvas, e, liveCells, context);
});

startBtn = document.getElementById("Start");
startBtn.addEventListener('click', startGame);

stopBtn = document.getElementById("Stop");
stopBtn.disabled = true; 
stopBtn.addEventListener('click', stopGame);

clearBtn = document.getElementById("Clear");
clearBtn.addEventListener('click', function(){

    for(idx=0; idx<liveCells.length; idx++){
        drawRectangle(context, [liveCells[idx]]);
    }

    liveCells = [];
});