const cellSize = 20;
var liveCells = new Array();
var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");

const canvasWidth = canvas.width;
const canvasHeight = canvas.height;

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
    drawCanvas(canvasContext, arr);
    console.log("x: " + x + " y: " + y);
};

function drawCanvas(canvasContext, arr) {
    for(ind=0; ind<arr.length; ind++) {
        x_coord = arr[ind][0]*cellSize;
        y_coord = arr[ind][1]*cellSize;
        canvasContext.fillRect(x_coord, y_coord, cellSize, cellSize);
    }
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


