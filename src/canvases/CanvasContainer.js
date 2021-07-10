import {createRect} from "../rects";
import globalState from "../state";


export default class CanvasContainer {

    /**
     * @type {HTMLDivElement}
     */
    #el;

    /**
     * @type {GlobalState}
     */
    #state;

    /**
     * @type {Rect}
     */
    #rect;

    constructor(el, state) {
        this.#el = el;
        this.#state = state;
    }

    updateUsingRect() {
        this.#el.style.top = `${this.#rect.y}px`;
        this.#el.style.left = `${this.#rect.x}px`;
        this.#el.style.width = `${this.#rect.width}px`;
        this.#el.style.height = `${this.#rect.height}px`;
    }

    centerToNewDimensions(width, height) {
        this.#rect = createRect(0, 0, width, height);
        this.centerWithinWindow();
    }

    centerWithinWindow() {
        this.#rect.x = (window.innerWidth / 2) - (this.#rect.width / 2);
        this.#rect.y = (window.innerHeight / 2) - (this.#rect.height / 2);
        this.updateUsingRect();
    }

    /**
     * Gets a copy of the current rect of this container.
     * @returns {Rect}
     */
    getCurrentRect() {
        return Object.assign({}, this.#rect);
    }

    /**
     * Change the width of the container by the given amount.
     * Can be negative to reduce the size.
     * Keeps the position locked to the center point.
     * @param {Number} amount
     */
    changeWidth(amount) {
        const aspectRatio = this.#rect.height / this.#rect.width;
        const newWidth = Math.max(10, this.#rect.width + amount);
        const newHeight = newWidth * aspectRatio;
        this.#rect.x -= (newWidth - this.#rect.width) / 2;
        this.#rect.y -= (newHeight - this.#rect.height) / 2;
        this.#rect.width = newWidth;
        this.#rect.height = newHeight;
        this.updateUsingRect();
    }

    /**
     * Change the position of the container within the page.
     * @param {Number} x
     * @param {Number} y
     */
    updatePosition(x, y) {
        this.#rect.x = x;
        this.#rect.y = y;
        this.updateUsingRect();
    }

    /**
     * Set the dimensions of the inner canvases.
     * @param {Number} width
     * @param {Number} height
     */
    setCanvasDimensions(width, height) {
        this.#state.imageCanvas.setSize(width, height);
        this.#state.drawingCanvas.setSize(width, height);
    }

    /**
     * Scale down the image canvas to the given width.
     * Will only scale down, not up.
     * @param {Number} width
     */
    scaleDownImageCanvasToWidth(width) {
        const currentCanvasEl = this.#state.imageCanvas.getCanvasElement();
        const ratio = currentCanvasEl.height / currentCanvasEl.width;
        const newWidth = Math.min(currentCanvasEl.width, width);
        this.#state.imageCanvas.scaleImage(newWidth);
        this.#state.drawingCanvas.setSize(newWidth, newWidth * ratio);
        this.centerWithinWindow();
    }

    /**
     * Show the canvas container.
     */
    show() {
        document.getElementById('welcome-area').style.display = 'none';
        this.#el.style.display = null;
    }

    /**
     * Hide the canvas container.
     */
    hide() {
        document.getElementById('welcome-area').style.display = null;
        this.#el.style.display = 'none';
    }
}