
const imageCanvas = document.getElementById('image-canvas');
const drawingCanvas = document.getElementById('drawing-canvas');

const imageCtx = imageCanvas.getContext('2d');
const drawingCtx = drawingCanvas.getContext('2d');

function loadImageIntoCanvas(imageEl) {
    // Simple canvas fill
    // TODO - Fit or resize canvas
    imageCtx.drawImage(imageEl, 0, 0, imageCanvas.width, imageCanvas.height);
}

const sampleImage = document.getElementById('sample_image');
sampleImage.onload = function() {
    loadImageIntoCanvas(sampleImage);
}


const renderables = [];

function renderFrame() {

    drawingCtx.clearRect(0, 0, drawingCanvas.width, drawingCanvas.height);
    for (const renderable of renderables) {
        // if (renderable.needsRender) {
            renderable.render(drawingCtx);
        // }
    }

    requestAnimationFrame(renderFrame);
}

import globalState from "./state";

import RectangleDrawing from "./drawings/RectangleDrawing";
renderables.push(new RectangleDrawing(globalState, 100, 100, 100, 100, 5));
renderables.push(new RectangleDrawing(globalState, 200, 200, 100, 100, 5));
requestAnimationFrame(renderFrame);

function passThroughEventToRenderables(domEvent, methodName) {
    drawingCanvas.addEventListener(domEvent, event => {
        const drawingBounds = drawingCanvas.getBoundingClientRect();
        const x = event.clientX - drawingBounds.x;
        const y = event.clientY - drawingBounds.y;
        for (const renderable of renderables) {
            if (renderable.captureEvents || renderable.isActive() || renderable.isPointAtDrawing(x, y)) {
                const method = renderable[methodName].bind(renderable);
                method(x, y);
            }
        }
    });
}

passThroughEventToRenderables('mousedown', 'onMouseDown');
passThroughEventToRenderables('mouseup', 'onMouseUp');
passThroughEventToRenderables('mousemove', 'onMouseMove');