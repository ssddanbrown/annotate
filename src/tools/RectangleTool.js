import Tool from "./Tool";
import RectangleDrawing from "../drawings/RectangleDrawing";
import {createRect} from "../rects";


export default class RectangleTool extends Tool {

    /**
     * @type {null|{x: Number, y: Number}}
     */
    #lastMouseDownPosition = null;

    /**
     * @type {null|RectangleDrawing}
     */
    #activeRectangle = null;

    setupCanvasEventHandling(drawingCanvas) {
        const listeners = [
            {domEvent: 'mousedown', listener: this.onMouseDown.bind(this)},
            {domEvent: 'mouseup', listener: this.onMouseUp.bind(this)},
            {domEvent: 'mousemove', listener: this.onMouseMove.bind(this)},
        ];
        for (const listener of listeners) {
            this.activeListeners.push(listener);
            drawingCanvas.listenToCanvasEvent(listener.domEvent, listener.listener);
        }
    }

    onMouseDown(event) {
        this.#lastMouseDownPosition = this.state.drawingCanvas.offsetClientPosition(event.clientX, event.clientY);
    }

    onMouseMove(event) {
        if (!this.#lastMouseDownPosition) {
            return;
        }

        const {x, y} = this.state.drawingCanvas.offsetClientPosition(event.clientX, event.clientY);

        // Updated rectangle size
        if (this.#activeRectangle) {
            this.#activeRectangle.modifyRect(rect => {
                rect.width = x - this.#lastMouseDownPosition.x;
                rect.height = y - this.#lastMouseDownPosition.y;
            });
        }

        // Check if we need to create a new rectangle
        if (!this.#activeRectangle) {
            console.log('here');
            const createDistance = 10;
            const width = x - this.#lastMouseDownPosition.x;
            const height = y - this.#lastMouseDownPosition.y;
            const distance = Math.hypot(Math.abs(width), Math.abs(height));
            if (distance > createDistance) {
                this.#activeRectangle = new RectangleDrawing(
                    this.state,
                    createRect(this.#lastMouseDownPosition.x, this.#lastMouseDownPosition.y, width, height)
                );
                this.state.actions.addDrawing(this.#activeRectangle);
            }
        }
    }

    onMouseUp() {
        this.#activeRectangle = null;
        this.#lastMouseDownPosition = null;
    }

}