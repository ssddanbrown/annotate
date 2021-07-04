
/**
 * @typedef CanvasEvent
 * @property {Number} x - Canvas relative x position of the event
 * @property {Number} y - Canvas relative y position of the event
 * @property {Event} originalEvent - The original native event
 */

export default class Canvas {

    /**
     * @type {HTMLCanvasElement}
     */
    el;

    /**
     * @type {GlobalState}
     */
    state;

    /**
     * @type {CanvasRenderingContext2D}
     */
    ctx;


    constructor(el, state) {
        this.el = el;
        this.state = state;
        this.ctx = el.getContext('2d');
    }

    /**
     * Get the canvas DOM Element this uses.
     * @returns {HTMLCanvasElement}
     */
    getCanvasElement() {
        return this.el;
    }
}

