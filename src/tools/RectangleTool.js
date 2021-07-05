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
        if (this.#activeRectangle) {
            this.#activeRectangle.modifyRect(rect => {
                const width = x - this.#lastMouseDownPosition.x;
                const height = y - this.#lastMouseDownPosition.y;
                return createRect(this.#lastMouseDownPosition.x, this.#lastMouseDownPosition.y, width, height);
            });
        }

        // Check if we need to create a new rectangle
        if (!this.#activeRectangle) {
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

    /**
     * @param {CanvasEvent} event
     */
    onMouseUp(event) {
        this.#activeRectangle = null;
        this.#lastMouseDownPosition = null;
    }

}