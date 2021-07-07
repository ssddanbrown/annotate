

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
     * Shortcut key to activate this tool.
     * @type {string}
     */
    shortcutKey = '--';

    constructor(buttonEl, state) {
        this.#buttonEl = buttonEl;
        this.state = state;
        this.setupDefaultEventHandling();
    }

    setupDefaultEventHandling() {
        this.setActiveIfShortcutPressed = this.setActiveIfShortcutPressed.bind(this);
        window.document.addEventListener('keydown', this.setActiveIfShortcutPressed);
        this.#buttonEl.addEventListener('click', () => this.state.actions.makeToolActive(this));
    }

    /**
     * Set this tool as active if the event received matches a press of this tool's shortcut.
     * @param {KeyboardEvent} event
     */
    setActiveIfShortcutPressed(event) {
        if (event.key === this.shortcutKey) {
            this.state.actions.makeToolActive(this);
        }
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
    }
}