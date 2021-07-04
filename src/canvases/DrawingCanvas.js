import globalState from "../state";

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
        this.setupEventHandling();
    }

    /**
     * Setup all DOM event handling for the canvas.
     */
    setupEventHandling() {
        this.passThroughEventToRenderables('mousedown', 'onMouseDown');
        this.passThroughEventToRenderables('mouseup', 'onMouseUp');
        this.passThroughEventToRenderables('mousemove', 'onMouseMove');
    }

    /**
     * On the given DOM event, pass is through to renderables on the canvas
     * via the given method name.
     * Events will be passed if the renderable has opted-in to capture events,
     * if the renderable is active or if the event location sits upon the renderable.
     * @param {String} domEvent
     * @param {String} methodName
     */
    passThroughEventToRenderables(domEvent, methodName) {
        this.#el.addEventListener(domEvent, event => {
            const drawingBounds = this.#el.getBoundingClientRect();
            const x = event.clientX - drawingBounds.x;
            const y = event.clientY - drawingBounds.y;
            for (const renderable of this.#state.renderables) {
                if (renderable.captureEvents || renderable.isActive() || renderable.isPointAtDrawing(x, y)) {
                    const method = renderable[methodName].bind(renderable);
                    method(x, y);
                }
            }
        });
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