import Tool from "./Tool";


export default class ModifyTool extends Tool {

    shortcutKey = 'm';

    setupCanvasEventHandling(drawingCanvas) {
        this.passThroughEventToRenderables(drawingCanvas, 'mousedown', 'onMouseDown');
        this.passThroughEventToRenderables(drawingCanvas, 'mouseup', 'onMouseUp');
        this.passThroughEventToRenderables(drawingCanvas, 'mousemove', 'onMouseMove');
        drawingCanvas.listenToCanvasEvent('keydown', this.onKeyDown.bind(this));
    }

    /**
     * On key down press of the canvas.
     * @param {CanvasEvent} event
     */
    onKeyDown(event) {
        const key = event.originalEvent.key;
        if (key === 'Delete' && this.state.activeDrawing) {
            this.state.actions.removeDrawing(this.state.activeDrawing);
        }
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
            const {x, y} = event;
            for (const renderable of this.state.renderables) {
                if (renderable.captureEvents || renderable.isActive() || renderable.isPointAtDrawing(x, y)) {
                    const method = renderable[methodName].bind(renderable);
                    method(x, y);
                }
            }
        };
        drawingCanvas.listenToCanvasEvent(domEvent, listener);
    }

    deactivate() {
        if (this.state.activeDrawing) {
            this.state.actions.deactivateDrawing(this.state.activeDrawing);
        }
        super.deactivate();
    }

}