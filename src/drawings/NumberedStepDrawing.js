import RectangleBasedShapeDrawing from "./RectangleBasedShapeDrawing";
import {absoluteRect, checkRectEdgesAtPoint, getEdgeMidPoints} from "../rects";

export default class NumberedStepDrawing extends RectangleBasedShapeDrawing {

    /**
     * @type {string}
     */
    #color = '#FF0000';

    #content = '';

    constructor(state, rect, content) {
        super(state, rect, 5);
        this.#content = content;
    }

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
        ctx.fillStyle = this.isActive() ? '#00FF00' : this.#color;
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
        ctx.fill();

        ctx.shadowColor = null;
        ctx.shadowOffsetX = null;
        ctx.shadowOffsetY = null;
        ctx.shadowBlur = null;

        // Draw text
        const fontSize = this.rect.width * 0.7;
        ctx.fillStyle = '#FFFFFF';
        ctx.font = `bold ${fontSize}px "Rubik", sans`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';
        ctx.fillText(
            this.#content,
            this.rect.x + this.rect.width / 2,
            this.rect.y + this.rect.height * 0.9,
            this.rect.width,
        );

        if (this.isActive()) {
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
        const radius = (this.rect.width / 2);
        const cx = this.rect.x + radius;
        const cy = this.rect.y + radius;
        return Math.hypot(cx - x, cy - y) < radius + this.lineWidth;
    }

    /**
     * @inheritDoc
     */
    resizeDrawingUponMouseMove(eventX, eventY) {
        const edgesAtPoint = checkRectEdgesAtPoint(
            this.lastMouseDown.startRect,
            this.lastMouseDown.eventX,
            this.lastMouseDown.eventY,
            this.lineWidth * 1.2
        );

        let offset = null;
        if (edgesAtPoint.left || edgesAtPoint.right) {
            offset = eventX - this.lastMouseDown.eventX;
        } else if (edgesAtPoint.top || edgesAtPoint.bottom) {
            offset = eventY - this.lastMouseDown.eventY;
        }

        if (offset === null) {
            return;
        } else if (edgesAtPoint.top || edgesAtPoint.left) {
            offset = 0 - offset;
        }

        const newRect = Object.assign({}, this.lastMouseDown.startRect);
        newRect.width += offset * 2;
        newRect.height += offset * 2;
        newRect.x -= offset;
        newRect.y -= offset;

        this.rect = absoluteRect(newRect);
        this.needsRender = true;
    }
}
