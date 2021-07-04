

export default class Tool {

    /**
     * @type {HTMLButtonElement}
     */
    #buttonEl;

    /**
     * @type {GlobalState}
     */
    state;

    /**
     * @type {[{domEvent: String, listener: Function}]}
     */
    activeListeners = [];

    constructor(buttonEl, state) {
        this.#buttonEl = buttonEl;
        this.state = state;
        this.setupDefaultEventHandling();
    }

    setupDefaultEventHandling() {
        this.#buttonEl.addEventListener('click', () => this.state.actions.makeToolActive(this));
    }

    /**
     * Setup any canvas-level handling that needs to be done by this tool.
     * This will generally be ran when the tool becomes active.
     * @param {DrawingCanvas} drawingCanvas
     * @override
     */
    setupCanvasEventHandling(drawingCanvas) {
        //
    }

    /**
     * Tear down canvas-level handling performed by this tool.
     * Generally ran upon the tool being de-activated.
     * By default will remove all those defined in the activeListeners array.
     * @param {DrawingCanvas} drawingCanvas
     */
    tearDownCanvasEventHandling(drawingCanvas) {
        for (const {domEvent, listener} of this.activeListeners) {
            drawingCanvas.stopListeningToCanvasEvent(domEvent, listener);
        }
    }

    /**
     * Make this tool the active tool.
     * Should only be accessed be used by state to properly handle in the context of other tools.
     */
    activate() {
        this.#buttonEl.classList.add('active');
        this.setupCanvasEventHandling(this.state.drawingCanvas);
    }

    /**
     * De-activate this tool.
     * Should only be accessed be used by state to properly handle in the context of other tools.
     */
    deactivate() {
        this.#buttonEl.classList.remove('active');
        this.tearDownCanvasEventHandling(this.state.drawingCanvas);
    }
}