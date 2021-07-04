
export default class DrawingCanvas {

    /**
     * @type {HTMLCanvasElement}
     */
    #el;

    /**
     * @type {GlobalState}
     */
    #state;

    /**
     * @type {boolean}
     */
    #rendering = false;

    /**
     * @type {CanvasRenderingContext2D}
     */
    #ctx;

    constructor(el, state) {
        this.#el = el;
        this.#state = state;
        this.#ctx = el.getContext('2d');
    }

    /**
     * Listen for a DOM event on the canvas
     * @param {String} domEvent
     * @param {Function} listener
     */
    listenToCanvasEvent(domEvent, listener) {
        this.#el.addEventListener(domEvent, listener);
    }

    /**
     * Stop listening to a DOM event on the canvas
     * @param {String} domEvent
     * @param {Function} listener
     */
    stopListeningToCanvasEvent(domEvent, listener) {
        this.#el.removeEventListener(domEvent, listener);
    }

    /**
     * Offset the given client position coordinates to be relative to the canvas.
     * @param {Number} x
     * @param {Number} y
     * @returns {{x: Number, y: Number}}
     */
    offsetClientPosition(x, y) {
        const drawingBounds = this.#el.getBoundingClientRect();
        return {
            x: x - drawingBounds.x,
            y: y - drawingBounds.y,
        }
    }

    /**
     * Start the continuous rendering of the canvas.
     */
    startRenderLoop() {
        this.#rendering = true;
        this.renderFrame();
    }

    /**
     * Stop the continuous rendering of the canvas.
     */
    stopRenderLoop() {
        this.#rendering = false;
    }

    /**
     * Render a single frame of the canvas, Will queue
     * up the next frame once complete.
     */
    renderFrame() {
        this.#ctx.clearRect(0, 0, this.#el.width, this.#el.height);
        for (const renderable of this.#state.renderables) {
            // if (renderable.needsRender) {
            renderable.render(this.#ctx);
            // }
        }

        if (this.#rendering) {
            requestAnimationFrame(this.renderFrame.bind(this));
        }
    }
}