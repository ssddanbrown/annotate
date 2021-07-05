import RectangleBasedShapeDrawing from "./RectangleBasedShapeDrawing";
import {getEdgeMidPoints} from "../rects";

export default class RectangleDrawing extends RectangleBasedShapeDrawing {

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
        ctx.strokeRect(this.rect.x, this.rect.y, this.rect.width, this.rect.height);

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
}
