import globalState from "./state";
import {createRect} from "./rects";

import DrawingCanvas from "./canvases/DrawingCanvas";
import RectangleTool from "./tools/RectangleTool";
import ModifyTool from "./tools/ModifyTool";
import RectangleDrawing from "./drawings/RectangleDrawing";
import OvalDrawing from "./drawings/OvalDrawing";
import OvalTool from "./tools/OvalTool";
import ImageCanvas from "./canvases/ImageCanvas";

// Create our canvases and ready them into globalState
const imageCanvasEl = document.getElementById('canvas-image');
const drawingCanvasEl = document.getElementById('canvas-drawing');
const imageCanvas = new ImageCanvas(imageCanvasEl, globalState);
const drawingCanvas = new DrawingCanvas(drawingCanvasEl, globalState);
globalState.actions.setDrawingCanvas(drawingCanvas);
globalState.actions.setImageCanvas(imageCanvas);

// Start rendering on our drawing canvas
drawingCanvas.startRenderLoop();

// Create our available tools and make one active
const modifyTool = new ModifyTool(document.getElementById('tool-modify'), globalState);
const rectangleTool = new RectangleTool(document.getElementById('tool-rectangle'), globalState);
const ovalTool = new OvalTool(document.getElementById('tool-oval'), globalState);
globalState.actions.makeToolActive(modifyTool);

// Add some drawings to the canvas for testing
globalState.actions.addDrawing(new RectangleDrawing(globalState, createRect(100, 100, 100, 100), 5));
globalState.actions.addDrawing(new RectangleDrawing(globalState, createRect(200, 200, 100, 100), 5));
globalState.actions.addDrawing(new OvalDrawing(globalState, createRect(200, 500, 200, 100), 5));

// Load sample image for testing
const sampleImage = document.getElementById('sample_image');
if (sampleImage.complete) {
    imageCanvas.loadImage(sampleImage);
} else {
    sampleImage.onload = function() {
        imageCanvas.loadImage(sampleImage);
    }
}