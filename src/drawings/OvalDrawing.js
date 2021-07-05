import RectangleBasedShapeDrawing from "./RectangleBasedShapeDrawing";
import {getEdgeMidPoints} from "../rects";

export default class OvalDrawing extends RectangleBasedShapeDrawing {

    /**
     * @type {string}
     */
    #color = '#FF0000';

    /**
     * Render this particular drawing item.
     * @param {CanvasRenderingContext2D} ctx
     */
    render(ctx) {
        // Shadow
        ctx.shadowColor = '#000000';
        ctx.shadowOffsetX = this.lineWidth / 2;
        ctx.shadowOffsetY = this.lineWidth / 2;
        ctx.shadowBlur = 8;

        // Border
        ctx.strokeStyle = this.isActive() ? '#00FF00' : this.#color;
        ctx.lineWidth = this.lineWidth;

        ctx.beginPath();
        ctx.ellipse(
            this.rect.x + this.rect.width / 2,
            this.rect.y + this.rect.height / 2,
            this.rect.width / 2,
            this.rect.height / 2,
            0,
            0,
            Math.PI * 2
        );
        ctx.stroke();

        if (this.isActive()) {
            const handleSize = this.lineWidth * 1.2;
            for (const {x, y} of getEdgeMidPoints(this.rect)) {
                this.renderHandle(ctx, x, y, handleSize);
            }
        }

        ctx.shadowColor = null;
        ctx.shadowOffsetX = null;
        ctx.shadowOffsetY = null;
        ctx.shadowBlur = null;

        this.needsRender = false;
    }

    /**
     * Check if the given co-ordinate is located at the
     * location of the drawing.
     * @param {Number} x
     * @param {Number} y
     * @returns {boolean}
     */
    isPointAtDrawing(x, y) {
        const pointWithinOval = (offset) => {
            const rx = (this.rect.width / 2);
            const ry = (this.rect.height / 2);
            const cx = this.rect.x + rx;
            const cy = this.rect.y + ry;
            const left = Math.pow(x - cx, 2) / Math.pow(rx + offset, 2);
            const right = Math.pow(y - cy, 2) / Math.pow(ry + offset, 2);
            return left + right <= 1;
        }

        return pointWithinOval(this.lineWidth) && !pointWithinOval(-this.lineWidth);
    }
}
