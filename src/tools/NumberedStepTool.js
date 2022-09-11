import Tool from "./Tool";
import {createRect} from "../rects";
import NumberedStepDrawing from "../drawings/NumberedStepDrawing";

export default class NumberedStepTool extends Tool {

    shortcutKey = 's';

    /**
     * @type {null|NumberedStepDrawing}
     */
    #activeStep = null;

    /**
     * @type {number}
     */
    #defaultRadius = 14;

    /**
     * The current count of the steps we've added.
     * @type {number}
     */
    #stepCount = 1;

    setupCanvasEventHandling(drawingCanvas) {
        drawingCanvas.listenToCanvasEvent('mousedown', this.onMouseDown.bind(this));
        drawingCanvas.listenToCanvasEvent('mouseup', this.onMouseUp.bind(this));
        drawingCanvas.listenToCanvasEvent('mousemove', this.onMouseMove.bind(this));
    }

    /**
     * @param {CanvasEvent} event
     */
    onMouseDown(event) {
        this.addNewDrawingAtCenter(event.x, event.y);
    }

    /**
     * @param {CanvasEvent} event
     */
    onMouseMove(event) {
        if (!this.#activeStep) {
            return;
        }
        const {x, y} = event;

        // Adjust position on move after create
        this.#activeStep.modifyRect(rect => {
            rect.x = x - rect.width / 2;
            rect.y = y - rect.height / 2;
            return rect;
        });
    }

    /**
     * Get the rect for the drawing position that sits
     * around the given centre point sized by the given
     * radial point.
     * @param {Number} cx
     * @param {Number} cy
     * @param {Number} rx
     * @param {Number} ry
     * @returns {Rect}
     */
    getRectBetweenCenterAndRadialPoints(cx, cy, rx, ry) {
        const radius = Math.max(Math.abs(rx - cx), Math.abs(ry - cy));
        return createRect(cx - radius, cy - radius, radius * 2, radius * 2);
    }

    /**
     * Add a new numbered step drawing to the canvas.
     * @param {Number} cx
     * @param {Number} cy
     */
    addNewDrawingAtCenter(cx, cy) {
        const radius = this.#getDrawingRelativeRadius();
        const rect = this.getRectBetweenCenterAndRadialPoints(cx, cy, cx + radius, cy + radius);
        this.#activeStep = new NumberedStepDrawing(this.state, rect, String(this.#stepCount));
        this.#stepCount++;
        this.state.actions.addDrawing(this.#activeStep);
    }

    #getDrawingRelativeRadius() {
        const canvasWidth = this.state.drawingCanvas.getSize().width;
        const factor = (canvasWidth / 800);
        return Math.floor(factor * this.#defaultRadius);
    }

    /**
     * @param {CanvasEvent} event
     */
    onMouseUp(event) {
        this.#activeStep = null;
    }

}