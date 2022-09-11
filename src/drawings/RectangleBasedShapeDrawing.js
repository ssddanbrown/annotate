import {absoluteRect, checkRectEdgesAtPoint, getCorners, getEdgeMidPoints, pointOnRectEdge} from "../rects";
import Drawing from "./Drawing";

export default class RectangleBasedShapeDrawing extends Drawing {

    /**
     * @type {Rect}
     */
    rect;

    /**
     * @type {number}
     */
    lineWidth = 5;

    /**
     * @type {null|{eventX: Number, eventY: Number, startRect: Rect}}
     */
    lastMouseDown = null;

    /**
     * @type {boolean}
     */
    lastMouseDownOnHandle = false;

    constructor(state, rect, lineWidth = 5) {
        super(state);
        this.rect = absoluteRect(rect);
        this.lineWidth = lineWidth;
    }

    /**
     * Check if the given co-ordinate is located at the
     * location of the drawing.
     * @param {Number} x
     * @param {Number} y
     * @returns {boolean}
     */
    isPointAtDrawing(x, y) {
        const tolerance = this.lineWidth * (this.isActive() ? 1.6 : 1.2);
        return pointOnRectEdge(this.rect, x, y, tolerance);
    }

    /**
     * Check if the given co-ordinate is located on a resize handle.
     * @param {Number} x
     * @param {Number} y
     * @returns {boolean}
     */
    isPointOnHandle(x, y) {
        for (const handle of this.getHandleLocations()) {
            const distance = Math.hypot(handle.x - x, handle.y - y);
            if (distance <= this.lineWidth * 1.2) {
                return true;
            }
        }

        return false;
    }

    /**
     * Reset the internal state of this drawing.
     */
    resetState() {
        this.lastMouseDown = null;
        this.captureEvents = false;
        this.needsRender = true;
        this.state.actions.deactivateDrawing(this);
    }

    onMouseDown(x, y) {
        if (this.isActive() && !this.isPointAtDrawing(x, y)) {
            return this.resetState();
        }

        this.lastMouseDown = {eventX: x, eventY: y, startRect: Object.assign({}, this.rect)};
        this.lastMouseDownOnHandle = this.isPointOnHandle(x, y);
        this.captureEvents = true;
    }

    onMouseUp(x, y) {
        this.captureEvents = false;
        this.lastMouseDown = null;
        if (this.isPointAtDrawing(x, y)) {
            this.state.actions.makeDrawingActive(this);
        }
    }

    onMouseMove(x, y) {
        const resizeMode = this.lastMouseDownOnHandle && this.isActive();

        // Move mode
        if (this.lastMouseDown && !resizeMode) {
            this.moveDrawingUponMouseMove(x, y);
        }
        // Resize mode
        if (this.lastMouseDown && resizeMode) {
            this.resizeDrawingUponMouseMove(x, y);
        }
    }

    /**
     * Resize the drawing upon a mouse move event where
     * the mouse is at the given event coordinates.
     * @param {Number} eventX
     * @param {Number} eventY
     */
    resizeDrawingUponMouseMove(eventX, eventY) {
        const xOffset = eventX - this.lastMouseDown.eventX;
        const yOffset = eventY - this.lastMouseDown.eventY;
        const startRect = this.lastMouseDown.startRect;

        const edgesAtPoint = checkRectEdgesAtPoint(
            startRect,
            this.lastMouseDown.eventX,
            this.lastMouseDown.eventY,
            this.lineWidth * 1.2
        );

        const newRect = Object.assign({}, this.lastMouseDown.startRect);
        if (edgesAtPoint.top) {
            newRect.y = startRect.y + yOffset;
            newRect.height = startRect.height - yOffset;
            this.needsRender = true;
        }
        if (edgesAtPoint.right) {
            newRect.width = startRect.width + xOffset;
            this.needsRender = true;
        }
        if (edgesAtPoint.bottom) {
            newRect.height = startRect.height + yOffset;
            this.needsRender = true;
        }
        if (edgesAtPoint.left) {
            newRect.x = startRect.x + xOffset;
            newRect.width = startRect.width - xOffset;
            this.needsRender = true;
        }

        if (this.needsRender) {
            this.rect = absoluteRect(newRect);
        }
    }

    moveDrawingUponMouseMove(eventX, eventY) {
        const xOffset = eventX - this.lastMouseDown.eventX;
        const yOffset = eventY - this.lastMouseDown.eventY;
        this.rect.x = this.lastMouseDown.startRect.x + xOffset;
        this.rect.y = this.lastMouseDown.startRect.y + yOffset;
        this.needsRender = true;
    }

    /**
     * @param {Function<{Rect}>} callback
     */
    modifyRect(callback) {
        const newRect = callback(Object.assign({}, this.rect));
        this.rect = absoluteRect(newRect);
        this.needsRender = true;
    }

    /**
     * Action to run upon scaling of the underlying drawing canvas.
     * @param {Number} xFactor x-axis size change relative to current size
     * @param {Number} yFactor y-axis size change relative to current size
     */
    onCanvasScale(xFactor, yFactor) {
        this.modifyPosition(xFactor, yFactor);
        this.modifySize(xFactor, yFactor);
    }

    /**
     * Modify the position of the drawing to the given x and y factors
     * relative to the current position of the drawing.
     * @param {Number} xFactor x-axis position change relative to current position
     * @param {Number} yFactor y-axis position change relative to current position
     */
    modifyPosition(xFactor, yFactor) {
        this.modifyRect((rect) => {
            rect.x = Math.floor(rect.x * xFactor);
            rect.y = Math.floor(rect.y * yFactor);
            return rect;
        });
    }

    /**
     * Modify the size of the drawing to the given x and y factors
     * relative to the current size of the drawing.
     * @param {Number} xFactor x-axis size change relative to current size
     * @param {Number} yFactor y-axis size change relative to current size
     */
    modifySize(xFactor, yFactor) {
        this.modifyRect((rect) => {
            rect.width = Math.floor(rect.width * xFactor);
            rect.height = Math.floor(rect.height * yFactor);
            return rect;
        });
    }

    /**
     * Get the locations of resize handles.
     * @returns {{x: Number, y: Number}[]}
     */
    getHandleLocations() {
        return [...getEdgeMidPoints(this.rect), ...getCorners(this.rect)];
    }
}