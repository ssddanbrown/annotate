import Tool from "./Tool";
import OvalDrawing from "../drawings/OvalDrawing";
import {createRect} from "../rects";


export default class OvalTool extends Tool {

    /**
     * @type {null|{x: Number, y: Number}}
     */
    #lastMouseDownPosition = null;

    /**
     * @type {null|OvalDrawing}
     */
    #activeOval = null;

    setupCanvasEventHandling(drawingCanvas) {
        drawingCanvas.listenToCanvasEvent('mousedown', this.onMouseDown.bind(this));
        drawingCanvas.listenToCanvasEvent('mouseup', this.onMouseUp.bind(this));
        drawingCanvas.listenToCanvasEvent('mousemove', this.onMouseMove.bind(this));
    }

    /**
     * @param {CanvasEvent} event
     */
    onMouseDown(event) {
        this.#lastMouseDownPosition = {x: event.x, y: event.y};
    }

    /**
     * @param {CanvasEvent} event
     */
    onMouseMove(event) {
        if (!this.#lastMouseDownPosition) {
            return;
        }

        const {x, y} = event;

        // Updated rectangle size
        if (this.#activeOval) {
            this.#activeOval.modifyRect(rect => {
                rect.width = x - this.#lastMouseDownPosition.x;
                rect.height = y - this.#lastMouseDownPosition.y;
            });
        }

        // Check if we need to create a new rectangle
        if (!this.#activeOval) {
            const createDistance = 10;
            const width = x - this.#lastMouseDownPosition.x;
            const height = y - this.#lastMouseDownPosition.y;
            const distance = Math.hypot(Math.abs(width), Math.abs(height));
            if (distance > createDistance) {
                this.#activeOval = new OvalDrawing(
                    this.state,
                    createRect(this.#lastMouseDownPosition.x, this.#lastMouseDownPosition.y, width, height)
                );
                this.state.actions.addDrawing(this.#activeOval);
            }
        }
    }

    /**
     * @param {CanvasEvent} event
     */
    onMouseUp(event) {
        this.#activeOval = null;
        this.#lastMouseDownPosition = null;
    }

}