import RectangleBasedShapeDrawing from "./RectangleBasedShapeDrawing";
import {expandRect, getEdgeMidPoints, pointWithinRect} from "../rects";

export default class PixelateDrawing extends RectangleBasedShapeDrawing {

    /**
     * Pixelation Strength
     * @type {number}
     */
    #strength;

    constructor(state, rect, strength = 10) {
        super(state, rect, 5);
        this.#strength = strength;
    }

    /**
     * Render this particular drawing item.
     * @param {CanvasRenderingContext2D} ctx
     */
    render(ctx) {
        // Pixelate from same location of source image
        if (this.rect.width > 0) {
            const sourceData = this.state.imageCanvas.ctx.getImageData(this.rect.x, this.rect.y, this.rect.width, this.rect.height);
            this.pixelateImageData(sourceData);
            ctx.putImageData(sourceData, this.rect.x, this.rect.y);
        }


        if (this.isActive()) {
            // Active border
            ctx.strokeStyle = '#00FF00';
            ctx.lineWidth = this.lineWidth;
            ctx.strokeRect(this.rect.x, this.rect.y, this.rect.width, this.rect.height);

            // Active handles
            const handleSize = this.lineWidth * 1.2;
            for (const {x, y} of getEdgeMidPoints(this.rect)) {
                this.renderHandle(ctx, x, y, handleSize);
            }
        }

        this.needsRender = false;
    }

    /**
     * Pixelate by modifying the given image data.
     * @param {ImageData} imageData
     */
    pixelateImageData(imageData) {
        const widthBlocks = Math.ceil(this.rect.width / this.#strength);
        const heightBlocks = Math.ceil(this.rect.height / this.#strength);

        // Block level
        for (let bx = 0; bx < widthBlocks; bx++) {
            for (let by = 0; by < heightBlocks; by++) {
                const leftX = bx * this.#strength;
                const refPixel = leftX + (by * this.#strength * this.rect.width);
                const refPixelStart = refPixel * 4;
                const r = imageData.data[refPixelStart];
                const g = imageData.data[refPixelStart + 1];
                const b = imageData.data[refPixelStart + 2];

                // Pixel level
                const rightX = Math.min(leftX + this.#strength, this.rect.width);
                const width = rightX - leftX;
                for (let bix = 0; bix < width; bix++) {
                    for (let biy = 0; biy < this.#strength; biy++) {
                        const pixStart = (refPixel + bix + (biy * this.rect.width)) * 4;
                        imageData.data[pixStart] = r;
                        imageData.data[pixStart+1] = g;
                        imageData.data[pixStart+2] = b;
                    }
                }
            }
        }
    }

    /**
     * @inheritDoc
     */
    isPointAtDrawing(x, y) {
        return pointWithinRect(expandRect(this.rect, this.lineWidth), x, y);
    }
}
