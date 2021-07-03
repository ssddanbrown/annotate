
export default class RectangleDrawing {

    needsRender = true;
    captureEvents = false;

    #width = 100;
    #height = 100;
    #x = 10;
    #y = 10;
    #lineWidth = 5;
    #color = '#FF0000';


    #mode = 'move';
    #lastMouseDown = null;

    constructor(x, y, width, height, lineWidth = 5) {
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
        ctx.strokeStyle = this.#color;
        ctx.lineWidth = this.#lineWidth;
        ctx.strokeRect(this.#x, this.#y, this.#width, this.#height);

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

    onMouseDown(x, y) {
        this.#lastMouseDown = {eventX: x, eventY: y, x: this.#x, y: this.#y, width: this.#width, height: this.#height};
        this.captureEvents = true;
       console.log('cat mouse down');
    }

    onMouseUp(x, y) {
        console.log('cat mouse up');
        this.captureEvents = false;
        this.#lastMouseDown = null;
        this.#mode = 'move';
    }

    onMouseMove(x, y) {
        if (this.#lastMouseDown) {
            const xOffset = x - this.#lastMouseDown.eventX;
            const yOffset = y - this.#lastMouseDown.eventY;
            this.#x = this.#lastMouseDown.x + xOffset;
            this.#y = this.#lastMouseDown.y + yOffset;
            this.needsRender = true;
        }
    }

}
