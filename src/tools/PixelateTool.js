import Tool from "./Tool";
import RectangleDrawing from "../drawings/RectangleDrawing";
import {createRect} from "../rects";
import PixelateDrawing from "../drawings/PixelateDrawing";


export default class PixelateTool extends Tool {

    shortcutKey = 'p';

    /**
     * @type {null|{x: Number, y: Number}}
     */
    #lastMouseDownPosition = null;

    /**
     * @type {null|PixelateDrawing}
     */
    #activePixelation = null;

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
        if (this.#activePixelation) {
            this.#activePixelation.modifyRect(rect => {
                const width = x - this.#lastMouseDownPosition.x;
                const height = y - this.#lastMouseDownPosition.y;
                return createRect(this.#lastMouseDownPosition.x, this.#lastMouseDownPosition.y, width, height);
            });
        }

        // Check if we need to create a new rectangle
        if (!this.#activePixelation) {
            const createDistance = 10;
            const width = x - this.#lastMouseDownPosition.x;
            const height = y - this.#lastMouseDownPosition.y;
            const distance = Math.hypot(Math.abs(width), Math.abs(height));
            if (distance > createDistance) {
                this.#activePixelation = new PixelateDrawing(
                    this.state,
                    createRect(this.#lastMouseDownPosition.x, this.#lastMouseDownPosition.y, width, height)
                );
                this.state.actions.addDrawingToRenderStart(this.#activePixelation);
            }
        }
    }

    /**
     * @param {CanvasEvent} event
     */
    onMouseUp(event) {
        this.#activePixelation = null;
        this.#lastMouseDownPosition = null;
    }

}