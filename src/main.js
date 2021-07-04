import globalState from "./state";
import {createRect} from "./rects";

import DrawingCanvas from "./canvases/DrawingCanvas";

const imageCanvasEl = document.getElementById('image-canvas');
const drawingCanvasEl = document.getElementById('drawing-canvas');

const imageCtx = imageCanvasEl.getContext('2d');

function loadImageIntoCanvas(imageEl) {
    // Simple canvas fill
    // TODO - Fit or resize canvas
    imageCtx.drawImage(imageEl, 0, 0, imageCanvasEl.width, imageCanvasEl.height);
}

const sampleImage = document.getElementById('sample_image');
sampleImage.onload = function() {
    loadImageIntoCanvas(sampleImage);
}

const drawingCanvas = new DrawingCanvas(drawingCanvasEl, globalState);
drawingCanvas.startRenderLoop();

import RectangleDrawing from "./drawings/RectangleDrawing";
globalState.actions.addDrawing(new RectangleDrawing(globalState, createRect(100, 100, 100, 100), 5));
globalState.actions.addDrawing(new RectangleDrawing(globalState, createRect(200, 200, 100, 100), 5));