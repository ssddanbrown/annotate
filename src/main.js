import globalState from "./state";
globalState.actions.setTestMode(false);

// Canvases & Services
import DrawingCanvas from "./canvases/DrawingCanvas";
import ImageCanvas from "./canvases/ImageCanvas";
import CanvasContainer from "./canvases/CanvasContainer";
import {loadTools} from "./tools";
import {setupActions} from "./actions";

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

// Setup any non-tool actions within the UI
setupActions(globalState)

// Create our available tools and make one active
const tools = loadTools(globalState);
globalState.actions.makeToolActive(tools.modifyTool);
