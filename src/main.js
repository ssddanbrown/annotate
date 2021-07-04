import globalState from "./state";
import {createRect} from "./rects";

import DrawingCanvas from "./canvases/DrawingCanvas";
import RectangleTool from "./tools/RectangleTool";
import ModifyTool from "./tools/ModifyTool";
import RectangleDrawing from "./drawings/RectangleDrawing";
import OvalDrawing from "./drawings/OvalDrawing";
import OvalTool from "./tools/OvalTool";

const imageCanvasEl = document.getElementById('canvas-image');
const drawingCanvasEl = document.getElementById('canvas-drawing');

const imageCtx = imageCanvasEl.getContext('2d');

function loadImageIntoCanvas(imageEl) {
    // Simple canvas fill
    // TODO - Fit or resize canvas
    imageCtx.drawImage(imageEl, 0, 0, imageCanvasEl.width, imageCanvasEl.height);
}

const sampleImage = document.getElementById('sample_image');
if (sampleImage.complete) {
    loadImageIntoCanvas(sampleImage);
} else {
    sampleImage.onload = function() {
        loadImageIntoCanvas(sampleImage);
    }
}

const drawingCanvas = new DrawingCanvas(drawingCanvasEl, globalState);
globalState.actions.setDrawingCanvas(drawingCanvas);
drawingCanvas.startRenderLoop();

const modifyTool = new ModifyTool(document.getElementById('tool-modify'), globalState);
const rectangleTool = new RectangleTool(document.getElementById('tool-rectangle'), globalState);
const ovalTool = new OvalTool(document.getElementById('tool-oval'), globalState);

globalState.actions.makeToolActive(modifyTool);
globalState.actions.addDrawing(new RectangleDrawing(globalState, createRect(100, 100, 100, 100), 5));
globalState.actions.addDrawing(new RectangleDrawing(globalState, createRect(200, 200, 100, 100), 5));
globalState.actions.addDrawing(new OvalDrawing(globalState, createRect(200, 500, 200, 100), 5));