const cellSize = 20;
var liveCells = new Array();
var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");

const canvasWidth = canvas.width;
const canvasHeight = canvas.height;

const numXCells = Math.floor(canvasWidth/cellSize);
const numYCells = Math.floor(canvasHeight/cellSize);

function getRecCordinates(x_coord, y_coord) {
    rec_x_coord = Math.floor(x_coord/cellSize);
    rec_y_coord = Math.floor(y_coord/cellSize);

    return [rec_x_coord, rec_y_coord];
};

function getCursorPosition(canvas, event, arr, canvasContext) {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    arr.push(getRecCordinates(x, y));
    drawPixel(canvasContext, arr);
    console.log("x: " + x + " y: " + y);
};

function drawPixels(canvasContext, arr) {
    for(ind=0; ind<arr.length; ind++) {
        x_coord = arr[ind][0]*cellSize;
        y_coord = arr[ind][1]*cellSize;
        canvasContext.fillRect(x_coord, y_coord, cellSize, cellSize);
    }
};

function isLive(liveArray, coords){
    
    for(idx=0; idx<liveArray.length; idx++){
        if(JSON.stringify(coords)==JSON.stringify(liveArray[idx])){
            return true;
        }
    }

    return false;
};

function getNumLiveNeighbours(liveArray, curCoord) {
    let numNeighbors = 0;
    //cur coordinate -> (x,y)
    var x = curCoord[0];
    var y = curCoord[1];

    //check for (x+1, y)
    if(x!=numXCells-1 && isLive(liveArray, [curCoord[0]+1, curCoord[1]])){
        numNeighbors++;
    }

    //check for (x+1, y+1)
    if((x!=numXCells-1 || y!=numYCells-1) && isLive(liveArray, [curCoord[0]+1, curCoord[1]+1])){
        numNeighbors++;
    }

    //check for (x, y+1)
    if(y!=numYCells-1 && isLive(liveArray, [curCoord[0], curCoord[1]+1])){
        numNeighbors++;
    }

    //check for (x-1, y+1)
    if((x==0 || y!=numYCells-1) && isLive(liveArray, [curCoord[0]-1, curCoord[1]+1])){
        numNeighbors++;
    }

    //check for (x-1, y)
    if((x!=0) && isLive(liveArray, [curCoord[0]-1, curCoord[1]])){
        numNeighbors++;
    }

    //check for (x-1, y-1)
    if((x!=0 || y!=0) && isLive(liveArray, [curCoord[0]-1, curCoord[1]-1])){
        numNeighbors++;
    }

    //check for (x, y-1)
    if(y!=0 && isLive(liveArray, [curCoord[0], curCoord[1]-1])){
        numNeighbors++;
    }

    //check for (x+1, y-1)
    if((x!=numXCells-1 && y!=0) && isLive(liveArray, [curCoord[0]+1, curCoord[1]-1])){
        numNeighbors++;
    }

    return numNeighbors;
};

function updateLiveArray(canvas,liveArray){

    var newArr = new Array();
    var neighbors = 0;
    for(ind_x=0; ind_x<numXCells; ind_x++){
        for(ind_y=0; ind_y<numYCells; ind_y++){
            neighbors = getNumLiveNeighbours(liveArray, [ind_x, ind_y]);

            if(isLive(liveArray, [ind_x, ind_y])){
                
                if(neighbors==2 || neighbors==3){
                    newArr.push([ind_x, ind_y]);
                }
            } else{
                if(neighbors==3){
                    newArr.push([ind_x, ind_y]);
                }
            }
        }
    }

    return newArr;
}

for (x = 0.5; x < canvasWidth; x += cellSize) {
    context.moveTo(x, 0);
    context.lineTo(x, canvasHeight);
}

for (y = 0.5; y < canvasHeight; y += cellSize) {
    context.moveTo(0, y);
    context.lineTo(canvasWidth, y);
}


context.strokeStyle = "#515357";
context.stroke();

canvas.addEventListener('mousedown', function (e) {
    getCursorPosition(canvas, e, liveCells, context);
});


