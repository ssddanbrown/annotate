import RectangleBasedShapeDrawing from "./RectangleBasedShapeDrawing";
import {createRect, expandRect, getEdgeMidPoints, pointOnRectEdge, pointWithinRect} from "../rects";

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
        const sourceData = this.state.imageCanvas.ctx.getImageData(this.rect.x, this.rect.y, this.rect.width, this.rect.height);
        const widthBlocks = Math.ceil(this.rect.width / this.#strength);
        const heightBlocks = Math.ceil(this.rect.height / this.#strength);

        // Block level
        for (let bx = 0; bx < widthBlocks; bx++) {
            for (let by = 0; by < heightBlocks; by++) {
                const refPixel = (bx * this.#strength) + (by * this.#strength * this.rect.width);
                const refPixelStart = refPixel * 4;
                const r = sourceData.data[refPixelStart];
                const g = sourceData.data[refPixelStart + 1];
                const b = sourceData.data[refPixelStart + 2];
                // Pixel level
                for (let bix = 0; bix < this.#strength; bix++) {
                    for (let yix = 0; yix < this.#strength; yix++) {
                        const pixStart = (refPixel + bix + (yix * this.rect.width)) * 4;
                        sourceData.data[pixStart] = r;
                        sourceData.data[pixStart+1] = g;
                        sourceData.data[pixStart+2] = b;
                    }
                }
            }
        }
        ctx.putImageData(sourceData, this.rect.x, this.rect.y);


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
     * @inheritDoc
     */
    isPointAtDrawing(x, y) {
        return pointWithinRect(expandRect(this.rect, this.lineWidth), x, y);
    }
}
