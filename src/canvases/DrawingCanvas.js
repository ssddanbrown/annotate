import Canvas from "./Canvas";

export default class DrawingCanvas extends  Canvas {

    /**
     * @type {boolean}
     */
    #rendering = false;

    /**
     * @type {[{domEvent: String, listener: Function<Event>}]}
     */
    #activeCanvasListeners = [];

    /**
     * Listen for a DOM event on the canvas
     * @param {String} domEvent
     * @param {Function<CanvasEvent>} listener
     */
    listenToCanvasEvent(domEvent, listener) {
        const wrappedListener = this.wrapListenerForCustomEvents(listener);
        this.el.addEventListener(domEvent, wrappedListener);
        this.#activeCanvasListeners.push({domEvent, listener: wrappedListener});
    }

    /**
     * Wrap a normal event listener so that the event returned is a custom
     * Canvas event which contains some calculated canvas specific details.
     * @param {Function<CanvasEvent>} listener
     * @returns {Function<Event>}
     */
    wrapListenerForCustomEvents(listener) {
        return (event) => {
            const {x, y} = this.offsetClientPosition(event.clientX || 0, event.clientY || 0);
            const canvasEvent = {originalEvent: event, x, y};
            listener(canvasEvent);
        }
    }

    /**
     * Remove all added event listeners.
     */
    removeAddedCanvasEventListeners() {
        for (const {domEvent, listener} of  this.#activeCanvasListeners) {
            this.el.removeEventListener(domEvent, listener);
        }
        this.#activeCanvasListeners.splice(0, this.#activeCanvasListeners.length);
    }

    /**
     * Offset the given client position coordinates to be relative to the canvas.
     * @param {Number} x
     * @param {Number} y
     * @returns {{x: Number, y: Number}}
     */
    offsetClientPosition(x, y) {
        const drawingBounds = this.el.getBoundingClientRect();
        const imageRatio =  this.el.width / drawingBounds.width;
        return {
            x: Math.floor((x - drawingBounds.x) * imageRatio),
            y: Math.floor((y - drawingBounds.y) * imageRatio),
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
        this.ctx.clearRect(0, 0, this.el.width, this.el.height);
        for (const renderable of this.state.renderables) {
            // if (renderable.needsRender) {
            renderable.render(this.ctx);
            // }
        }

        if (this.#rendering) {
            requestAnimationFrame(this.renderFrame.bind(this));
        }
    }

    /**
     * Set the size of this canvas.
     * @param {Number} width
     * @param {Number} height
     */
    setSize(width, height) {
        const xFactor = width / this.el.width;
        const yFactor = height / this.el.height;

        for (const renderable of this.state.renderables) {
            renderable.onCanvasScale(xFactor, yFactor);
        }

        super.setSize(width, height);
    }
}