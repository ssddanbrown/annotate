import globalState from "./state";
import {createRect} from "./rects";

// Tools
import RectangleTool from "./tools/RectangleTool";
import ModifyTool from "./tools/ModifyTool";
import OvalTool from "./tools/OvalTool";
import NumberedStepTool from "./tools/NumberedStepTool";
import PixelateTool from "./tools/PixelateTool";
import PanZoomTool from "./tools/PanZoomTool";

// Drawings
import RectangleDrawing from "./drawings/RectangleDrawing";
import OvalDrawing from "./drawings/OvalDrawing";
import NumberedStepDrawing from "./drawings/NumberedStepDrawing";
import PixelateDrawing from "./drawings/PixelateDrawing";

// Canvases & Services
import DrawingCanvas from "./canvases/DrawingCanvas";
import ImageCanvas from "./canvases/ImageCanvas";
import CanvasContainer from "./canvases/CanvasContainer";
import IoManager from "./IoManager";

// Create our canvases and ready them into globalState
const imageCanvasEl = document.getElementById('canvas-image');
const drawingCanvasEl = document.getElementById('canvas-drawing');
const imageCanvas = new ImageCanvas(imageCanvasEl, globalState);
const drawingCanvas = new DrawingCanvas(drawingCanvasEl, globalState);
const canvasContainer = new CanvasContainer(imageCanvasEl.parentElement, globalState);
globalState.actions.setCanvasContainer(canvasContainer);
globalState.actions.setDrawingCanvas(drawingCanvas);
globalState.actions.setImageCanvas(imageCanvas);

// Start rendering on our drawing canvas
drawingCanvas.startRenderLoop();

// Start up our IO Manager
const ioManager = new IoManager(globalState);

// Handle action buttons
const actionsByShortcut = {
    'd': () => ioManager.downloadImage(),
    'c': () => ioManager.copyToClipboard(),
};
document.getElementById('action-download').addEventListener('click', actionsByShortcut.d);
document.getElementById('action-copy').addEventListener('click', actionsByShortcut.c);
document.body.addEventListener('keydown', event => {
    if (typeof actionsByShortcut[event.key] !== 'undefined') {
        actionsByShortcut[event.key]();
    }
});

// Create our available tools and make one active
const modifyTool = new ModifyTool(document.getElementById('tool-modify'), globalState);
const rectangleTool = new RectangleTool(document.getElementById('tool-rectangle'), globalState);
const ovalTool = new OvalTool(document.getElementById('tool-oval'), globalState);
const numberedStepTool = new NumberedStepTool(document.getElementById('tool-numbered-step'), globalState);
const pixelateTool = new PixelateTool(document.getElementById('tool-pixelate'), globalState);
const panZoomTool = new PanZoomTool(document.getElementById('tool-pan-zoom'), globalState);
globalState.actions.makeToolActive(panZoomTool);

// Add some drawings to the canvas for testing
globalState.actions.addDrawing(new RectangleDrawing(globalState, createRect(100, 100, 100, 100), 5));
globalState.actions.addDrawing(new RectangleDrawing(globalState, createRect(200, 200, 100, 100), 5));
globalState.actions.addDrawing(new NumberedStepDrawing(globalState, createRect(320, 250, 50, 50), '1'));
globalState.actions.addDrawing(new OvalDrawing(globalState, createRect(200, 450, 200, 100), 5));
globalState.actions.addDrawing(new PixelateDrawing(globalState, createRect(360, 60, 208, 100), 10));

// Load sample image for testing
const sampleImage = document.getElementById('sample_image');
if (sampleImage.complete) {
    ioManager.loadImage(sampleImage);
} else {
    sampleImage.onload = function() {
        ioManager.loadImage(sampleImage);
    }
}