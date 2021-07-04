export default class IoManager {

    /**
     * @type {GlobalState}
     */
    #state;

    constructor(state) {
        this.#state = state;
    }


    loadImage(image) {
        const aspectRatio = image.height / image.width;
        const width = Math.min(800, image.width);
        const height = width * aspectRatio;
        this.#state.imageCanvas.setSize(width, height);
        this.#state.drawingCanvas.setSize(width, height);
        this.#state.imageCanvas.loadImage(image);
        const container = this.#state.imageCanvas.getCanvasElement().parentElement;
        container.style.width = `${width}px`;
        container.style.height = `${height}px`;
    }

    /**
     * Create a new virtual merged canvas element.
     * @returns {HTMLCanvasElement}
     */
    createMergedCanvas() {
        const drawingCanvasEl = this.#state.drawingCanvas.getCanvasElement();
        const canvas = document.createElement('canvas');
        canvas.width = drawingCanvasEl.width;
        canvas.height = drawingCanvasEl.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(this.#state.imageCanvas.getCanvasElement(), 0, 0);
        ctx.drawImage(drawingCanvasEl, 0, 0);
        return canvas;
    }

    /**
     * Download the current work as an image file.
     */
    downloadImage() {
        const link = document.createElement('a');
        link.download = 'image.png';
        const mergedCanvas = this.createMergedCanvas();
        link.href = mergedCanvas.toDataURL('image/png');
        link.click();
    }

    /**
     * Copy the current work to the user's clipboard.
     */
    copyToClipboard() {
        if (typeof window.ClipboardItem === 'undefined') {
            window.alert('Copy to clipboard not supported in this browser.');
            return;
        }

        const mergedCanvas = this.createMergedCanvas();
        mergedCanvas.toBlob(function (blob) {
            const data = [new ClipboardItem({[blob.type]: blob})];
            navigator.clipboard.write(data).then(
                () => {
                    window.alert('Image copied to clipboard!');
                }
            );
        });
    }
}