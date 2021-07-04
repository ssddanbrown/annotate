import Tool from "./Tool";


export default class ModifyTool extends Tool {

    setupCanvasEventHandling(drawingCanvas) {
        this.passThroughEventToRenderables(drawingCanvas, 'mousedown', 'onMouseDown');
        this.passThroughEventToRenderables(drawingCanvas, 'mouseup', 'onMouseUp');
        this.passThroughEventToRenderables(drawingCanvas, 'mousemove', 'onMouseMove');
    }

    /**
     * On the given DOM event, pass is through to renderables on the canvas
     * via the given method name.
     * Events will be passed if the renderable has opted-in to capture events,
     * if the renderable is active or if the event location sits upon the renderable.
     * @param {DrawingCanvas} drawingCanvas
     * @param {String} domEvent
     * @param {String} methodName
     */
    passThroughEventToRenderables(drawingCanvas, domEvent, methodName) {
        const listener = event => {
            const {x, y} = drawingCanvas.offsetClientPosition(event.clientX, event.clientY);
            for (const renderable of this.state.renderables) {
                if (renderable.captureEvents || renderable.isActive() || renderable.isPointAtDrawing(x, y)) {
                    const method = renderable[methodName].bind(renderable);
                    method(x, y);
                }
            }
        };
        drawingCanvas.listenToCanvasEvent(domEvent, listener);
        this.activeListeners.push({domEvent, listener});
    }

}