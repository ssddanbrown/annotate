import Drawing from "./Drawing";

export default class RectangleDrawing extends Drawing {

    #width = 100;
    #height = 100;
    #x = 10;
    #y = 10;
    #lineWidth = 5;
    #color = '#FF0000';

    #lastMouseDown = null;

    constructor(state, x, y, width, height, lineWidth = 5) {
        super(state);
        this.#width = width;
        this.#height = height;
        this.#x = x;
        this.#y = y;
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
        ctx.strokeRect(this.#x, this.#y, this.#width, this.#height);

        if (this.isActive()) {
            const handleSize = this.#lineWidth * 1.2;
            this.renderHandle(ctx, this.#x + this.#width / 2, this.#y, handleSize);
            this.renderHandle(ctx, this.#x + this.#width / 2, this.#y + this.#height, handleSize);
            this.renderHandle(ctx, this.#x, this.#y + this.#height / 2, handleSize);
            this.renderHandle(ctx, this.#x + this.#width, this.#y + this.#height / 2, handleSize);
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
        const withinSquare = (
            x > this.#x - this.#lineWidth &&
            x < this.#x + this.#width + this.#lineWidth &&
            y > this.#y - this.#lineWidth &&
            y < this.#y + this.#height + this.#lineWidth
        );

        const withinInner = (
            x > this.#x + this.#lineWidth &&
            x < this.#x + this.#width - this.#lineWidth &&
            y > this.#y + this.#lineWidth &&
            y < this.#y + this.#height - this.#lineWidth
        );

        return withinSquare && !withinInner;
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

        this.#lastMouseDown = {eventX: x, eventY: y, x: this.#x, y: this.#y, width: this.#width, height: this.#height};
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


        // TODO - Below needs to calculate relative to the original mouse down location
        const edgesAtPoint = this.calculateEdgesAtPoint(eventX, eventY);
        if (edgesAtPoint.top) {

        }
    }


    moveDrawingUponMouseMove(eventX, eventY) {
        const xOffset = eventX - this.#lastMouseDown.eventX;
        const yOffset = eventY - this.#lastMouseDown.eventY;
        this.#x = this.#lastMouseDown.x + xOffset;
        this.#y = this.#lastMouseDown.y + yOffset;
        this.needsRender = true;
    }

    /**
     * Calculate the edges of the drawing that may be at the given point.
     * @param {Number} x
     * @param {Number} y
     * @returns {{top: Boolean, left: Boolean, bottom: Boolean, right: Boolean}}
     */
    calculateEdgesAtPoint(x, y) {
        const withinXBounds = x > (this.#x - this.#lineWidth) && x < (this.#x + this.#width + this.#lineWidth);
        const withinYBounds = y > (this.#y - this.#lineWidth) && y < (this.#y + this.#height + this.#lineWidth)
        return {
            top: withinXBounds && y > (this.#y - this.#lineWidth) && y < this.#y + this.#lineWidth,
            left: withinYBounds && x > (this.#x - this.#lineWidth) && x < this.#x + this.#lineWidth,
            bottom: withinXBounds && y > (this.#y + this.#height - this.#lineWidth) && y < this.#y + this.#height + this.#lineWidth,
            right: withinYBounds && x > (this.#x + this.#height - this.#lineWidth) && x < this.#x + this.#height + this.#lineWidth,
        }
    }

}
