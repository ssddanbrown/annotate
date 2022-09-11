import IoManager from "./IoManager";
import PixelateDrawing from "./drawings/PixelateDrawing";
import {createRect} from "./rects";
import RectangleDrawing from "./drawings/RectangleDrawing";
import NumberedStepDrawing from "./drawings/NumberedStepDrawing";
import OvalDrawing from "./drawings/OvalDrawing";

/**
 * Load all actions using the given global state
 * @param {GlobalState} globalState
 */
export function setupActions(globalState) {
    // Start up our IO Manager
    const ioManager = new IoManager(globalState);

    // Handle action buttons that also have shortcuts
    const actionsByShortcut = {
        'd': () => ioManager.downloadImage(),
        'c': () => ioManager.copyToClipboard(),
        'q': () => {
            globalState.canvasContainer.scaleDownImageCanvasToWidth(800);
        },
    };
    document.getElementById('action-download').addEventListener('click', actionsByShortcut.d);
    document.getElementById('action-copy').addEventListener('click', actionsByShortcut.c);
    document.getElementById('action-quick-scale').addEventListener('click', actionsByShortcut.q);

    document.body.addEventListener('keydown', event => {
        if (typeof actionsByShortcut[event.key] !== 'undefined') {
            actionsByShortcut[event.key]();
        }
    });

    // Handle file select management
    const fileLoadHandler = createLoadImageFileHandler(ioManager);
    document.getElementById('action-load-image').addEventListener('click',  fileLoadHandler);
    document.getElementById('action-welcome-load-image').addEventListener('click',  fileLoadHandler);

    // Sample image on welcome button press
    document.getElementById('action-welcome-load-sample-image').addEventListener('click', () => {
        loadSampleImageForTesting(ioManager);
    });

    // Load sample image for testing
    if (globalState.testing) {
        loadSampleImageForTesting(ioManager);
        setTimeout(() => {
            drawTestDrawings(globalState);
        }, 100);
    }
}

/**
 * Create a new function that will show a file select dialog when ran and
 * load the selected image (If not cancelled).
 * @param {IoManager} ioManager
 * @returns {function(): void}
 */
function createLoadImageFileHandler(ioManager) {
    const fileSelect = document.getElementById('file-select');
    fileSelect.addEventListener('change', event => {
        if (fileSelect.files.length > 0) {
            ioManager.loadFileAsImage(fileSelect.files[0]);
        }
    });

    return () => fileSelect.click();
}

/**
 * Load a sample image into the view for testing use.
 * This waits for the image to be loaded, if not already, before loading
 * into the canvas.
 * @param {IoManager} ioManager
 */
function loadSampleImageForTesting(ioManager) {
    const sampleImage = document.getElementById('sample_image');
    if (sampleImage.complete) {
        ioManager.loadImage(sampleImage);
    } else {
        sampleImage.onload = function() {
            ioManager.loadImage(sampleImage);
        }
    }
}

/**
 * Add some drawings to the canvas for testing
 * @param {GlobalState} globalState
 */
function drawTestDrawings(globalState) {
    // Add some drawings to the canvas for testing
    globalState.actions.addDrawing(new PixelateDrawing(globalState, createRect(360, 60, 208, 100), 10));
    globalState.actions.addDrawing(new RectangleDrawing(globalState, createRect(100, 100, 100, 100), 5));
    globalState.actions.addDrawing(new RectangleDrawing(globalState, createRect(200, 200, 100, 100), 5));
    globalState.actions.addDrawing(new NumberedStepDrawing(globalState, createRect(320, 250, 50, 50), '1'));
    globalState.actions.addDrawing(new OvalDrawing(globalState, createRect(200, 450, 200, 100), 5));
}