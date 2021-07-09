export default class IoManager {

    /**
     * @type {GlobalState}
     */
    #state;

    constructor(state) {
        this.#state = state;
        this.setupFileDropHandling();
    }

    setupFileDropHandling() {
        const body = window.document.body;

        body.addEventListener('dragenter', event => {
            event.preventDefault();
        });
        body.addEventListener('dragover', event => {
            event.preventDefault();
        });

        body.addEventListener('drop', event => {
            event.preventDefault();
            this.loadImageFromDataTransferItemList(event.dataTransfer.items);
        });

        body.addEventListener('paste', event => {
            this.loadImageFromDataTransferItemList(event.clipboardData.items);
        })
    }

    /**
     * Load image, if existing, in the given data transfer item list.
     * Searches through for the first relevant image file.
     * @param {DataTransferItemList} list
     */
    loadImageFromDataTransferItemList(list) {
        for (const item of list) {
            if (item.type.startsWith('image/')) {
                const file = item.getAsFile();
                this.loadFileAsImage(file);
                return;
            }
        }
    }

    /**
     * Load a File object as the image for the current scene.
     * @param {File} file
     */
    loadFileAsImage(file) {
        const reader = new FileReader();
        const image = new Image();
        reader.readAsDataURL(file);
        reader.onload =  (event) => {
            if (event.target.readyState === FileReader.DONE) {
                image.src = event.target.result;
                image.onload = () => {
                    this.loadImage(image);
                }
            }
        }
    }

    /**
     * Load a new image into the scene to be drawn upon.
     * @param {Image} image
     */
    loadImage(image) {
        const aspectRatio = image.height / image.width;
        const width = Math.min(800, image.width);
        const height = width * aspectRatio;
        this.#state.imageCanvas.setSize(width, height);
        this.#state.drawingCanvas.setSize(width, height);
        this.#state.canvasContainer.centerToNewDimensions(width, height);
        this.#state.imageCanvas.loadImage(image);
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