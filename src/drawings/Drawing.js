/**
 * Base drawing class.
 * Defines the base methods and properties expected to be
 * available within a drawing.
 */
export default class Drawing {

    /**
     * Indicator if this drawing needs is awaiting a render cycle.
     * @type {boolean}
     */
    needsRender = true;

    /**
     * Should this drawing capture additional interaction events,
     * event when not active and the event did not occur within bounds?
     * @type {boolean}
     */
    captureEvents = false;

    /**
     * A reference to the applications global state.
     * @type {GlobalState}
     */
    state;

    /**
     * Initiate the drawing with the global state.
     * @param state
     */
    constructor(state) {
        this.state = state;
    }

    /**
     * Render this particular drawing item.
     * @param {CanvasRenderingContext2D} ctx
     */
    render(ctx) {
        //
    }

    /**
     * Render an interaction handle at the given center position.
     * @param {CanvasRenderingContext2D} ctx
     * @param {Number} x
     * @param {Number} y
     * @param {Number} size
     */
    renderHandle(ctx, x, y, size = 10) {
        ctx.beginPath();
        ctx.fillStyle = '#FFF'
        ctx.strokeStyle = '#000';
        ctx.arc(x, y, size, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.fill();
    }

    /**
     * Check if the given co-ordinate is located at the
     * location of the drawing.
     * @param {Number} x
     * @param {Number} y
     * @returns {boolean}
     */
    isPointAtDrawing(x, y) {
        //
    }

    /**
     * Check if the current drawing is active.
     * @returns {boolean}
     */
    isActive() {
        return this === this.state.activeDrawing;
    }


    /**
     * Action to run upon mouse down of the canvas.
     * @param {Number} x x-position of event.
     * @param {Number} y y-position of event.
     */
    onMouseDown(x, y) {
        //
    }

    /**
     * Action to run upon mouse up of the canvas.
     * @param {Number} x x-position of event.
     * @param {Number} y y-position of event.
     */
    onMouseUp(x, y) {
        //
    }

    /**
     * Action to run upon mouse move of the canvas.
     * @param {Number} x x-position of event.
     * @param {Number} y y-position of event.
     */
    onMouseMove(x, y) {
        //
    }

}
