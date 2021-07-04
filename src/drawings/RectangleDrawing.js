import Drawing from "./Drawing";
import {checkRectEdgesAtPoint, pointOnRectEdge} from "../rects";

export default class RectangleDrawing extends Drawing {

    /**
     * @type {Rect}
     */
    #rect;

    /**
     * @type {number}
     */
    #lineWidth = 5;

    /**
     * @type {string}
     */
    #color = '#FF0000';

    /**
     * @type {null|{eventX: Number, eventY: Number, startRect: Rect}}
     */
    #lastMouseDown = null;

    constructor(state, rect, lineWidth = 5) {
        super(state);
        this.#rect = rect;
        this.#lineWidth = lineWidth;
    }

    /**
     * Render this particular drawing item.
     * @param {CanvasRenderingContext2D} ctx
     */
    render(ctx) {
        // Shadow
        ctx.shadowColor = '#000000';
        ctx.shadowOffsetX = this.#lineWidth / 2;
        ctx.shadowOffsetY = this.#lineWidth / 2;
        ctx.shadowBlur = 8;

        // Border
        ctx.strokeStyle = this.isActive() ? '#00FF00' : this.#color;
        ctx.lineWidth = this.#lineWidth;
        ctx.strokeRect(this.#rect.x, this.#rect.y, this.#rect.width, this.#rect.height);

        if (this.isActive()) {
            const handleSize = this.#lineWidth * 1.2;
            this.renderHandle(ctx, this.#rect.x + this.#rect.width / 2, this.#rect.y, handleSize);
            this.renderHandle(ctx, this.#rect.x + this.#rect.width / 2, this.#rect.y + this.#rect.height, handleSize);
            this.renderHandle(ctx, this.#rect.x, this.#rect.y + this.#rect.height / 2, handleSize);
            this.renderHandle(ctx, this.#rect.x + this.#rect.width, this.#rect.y + this.#rect.height / 2, handleSize);
        }

        this.needsRender = false;
    }

    /**
     * Check if the given co-ordinate is located at the
     * location of the drawing.
     * @param {Number} x
     * @param {Number} y
     * @returns {boolean}
     */
    isPointAtDrawing(x, y) {
        return pointOnRectEdge(this.#rect, x, y, this.#lineWidth * 1.2);
    }

    /**
     * Reset the internal state of this drawing.
     */
    resetState() {
        this.#lastMouseDown = null;
        this.captureEvents = false;
        this.needsRender = true;
        this.state.actions.deactivateDrawing(this);
    }

    onMouseDown(x, y) {
        if (this.isActive() && !this.isPointAtDrawing(x, y)) {
            return this.resetState();
        }

        this.#lastMouseDown = {eventX: x, eventY: y, startRect: Object.assign({}, this.#rect)};
        this.captureEvents = true;
    }

    onMouseUp(x, y) {
        this.captureEvents = false;
        this.#lastMouseDown = null;
        if (this.isPointAtDrawing(x, y)) {
            this.state.actions.makeDrawingActive(this);
        }
    }

    onMouseMove(x, y) {
        // Move mode
        if (this.#lastMouseDown && !this.isActive()) {
            this.moveDrawingUponMouseMove(x, y);
        }
        // Resize mode
        if (this.#lastMouseDown && this.isActive()) {
            this.resizeDrawingUponMouseMove(x, y);
        }
    }

    resizeDrawingUponMouseMove(eventX, eventY) {
        const xOffset = eventX - this.#lastMouseDown.eventX;
        const yOffset = eventY - this.#lastMouseDown.eventY;

        const edgesAtPoint = checkRectEdgesAtPoint(
            this.#lastMouseDown.startRect,
            this.#lastMouseDown.eventX,
            this.#lastMouseDown.eventY,
            this.#lineWidth * 1.2
        );

        if (edgesAtPoint.top) {
            this.#rect.y = this.#lastMouseDown.startRect.y + yOffset;
            this.#rect.height = this.#lastMouseDown.startRect.height - yOffset;
            this.needsRender = true;
        }
        if (edgesAtPoint.right) {
            this.#rect.width = this.#lastMouseDown.startRect.width + xOffset;
            this.needsRender = true;
        }
        if (edgesAtPoint.bottom) {
            this.#rect.height = this.#lastMouseDown.startRect.height + yOffset;
            this.needsRender = true;
        }
        if (edgesAtPoint.left) {
            this.#rect.x = this.#lastMouseDown.startRect.x + xOffset;
            this.#rect.width = this.#lastMouseDown.startRect.width - xOffset;
            this.needsRender = true;
        }
    }

    moveDrawingUponMouseMove(eventX, eventY) {
        const xOffset = eventX - this.#lastMouseDown.eventX;
        const yOffset = eventY - this.#lastMouseDown.eventY;
        this.#rect.x = this.#lastMouseDown.startRect.x + xOffset;
        this.#rect.y = this.#lastMouseDown.startRect.y + yOffset;
        this.needsRender = true;
    }

    /**
     *
     * @param {Function<{Rect}>} callback
     */
    modifyRect(callback) {
        callback(this.#rect);
        this.needsRender = true;
    }

}
