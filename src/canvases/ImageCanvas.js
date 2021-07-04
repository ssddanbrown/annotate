
export default class ImageCanvas {

    /**
     * @type {HTMLCanvasElement}
     */
    #el;

    /**
     * @type {GlobalState}
     */
    #state;

    /**
     * @type {CanvasRenderingContext2D}
     */
    #ctx;

    constructor(el, state) {
        this.#el = el;
        this.#state = state;
        this.#ctx = el.getContext('2d');
    }

    loadImage(imageEl) {
        // Simple canvas fill
        // TODO - Fit or resize canvas
        this.#ctx.drawImage(imageEl, 0, 0, this.#el.width, this.#el.height);
    }

}