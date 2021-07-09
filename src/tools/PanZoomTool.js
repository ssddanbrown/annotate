import Tool from "./Tool";

export default class PanZoomTool extends Tool {

    shortcutKey = 'p';

    /**
     * @type {null|{eventX: Number, eventY: Number, canvasRect: Rect}}
     */
    #moveStartLocation = null;

    /**
     * @type {HTMLDivElement}
     */
    #canvasWrapper;

    constructor(buttonEl, state) {
        super(buttonEl, state);
    }

    setupCanvasEventHandling(drawingCanvas) {
        this.#canvasWrapper = drawingCanvas.getCanvasElement().parentElement;
        drawingCanvas.listenToCanvasEvent('mousedown', this.onMouseDown.bind(this));
        drawingCanvas.listenToCanvasEvent('mousemove', this.onMouseMove.bind(this));
        drawingCanvas.listenToCanvasEvent('mouseup', this.onMouseUp.bind(this));
        drawingCanvas.listenToCanvasEvent('wheel', this.onWheel.bind(this));
    }

    /**
     * @param {CanvasEvent} event
     */
    onWheel(event) {
        event.originalEvent.preventDefault();
        const deltaY = event.originalEvent.deltaY;
        const depth = deltaY > 0 ? 20 : -20;
        this.state.canvasContainer.changeWidth(depth);
    }

    /**
     * @param {CanvasEvent} event
     */
    onMouseDown(event) {
        this.#moveStartLocation = {
            eventX: event.originalEvent.clientX,
            eventY: event.originalEvent.clientY,
            canvasRect: this.state.canvasContainer.getCurrentRect(),
        };
    }

    /**
     * @param {CanvasEvent} event
     */
    onMouseMove(event) {
        // If we're in a move operation
        if (this.#moveStartLocation) {
            const xDiff = event.originalEvent.clientX - this.#moveStartLocation.eventX;
            const yDiff = event.originalEvent.clientY - this.#moveStartLocation.eventY;
            const newX = this.#moveStartLocation.canvasRect.x + xDiff;
            const newY = this.#moveStartLocation.canvasRect.y + yDiff;
            this.state.canvasContainer.updatePosition(newX, newY);
        }
    }

    /**
     * @param {CanvasEvent} event
     */
    onMouseUp(event) {
        this.#moveStartLocation = null;
    }

}