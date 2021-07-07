/**
 * Create a new rect instance.
 * @param {Number} x
 * @param {Number} y
 * @param {Number} width
 * @param {Number} height
 * @returns {Rect}
 */
export function createRect(x = 0, y = 0, width = 100, height = 100) {
    return {
        x, y, width, height,
    };
}

/**
 * Adjust the given rect positions to remove negative widths or heights
 * so that the shape is always drawn "front-facing"
 * @param {Rect} rect
 * @returns {Rect}
 */
export function absoluteRect(rect) {
    return {
        width: Math.abs(rect.width),
        height: Math.abs(rect.height),
        x: rect.x + (rect.width < 0 ? rect.width : 0),
        y: rect.y + (rect.height < 0 ? rect.height : 0),
    }
}

/**
 * Check which edges of the given rect fall on the given x,y point.
 * The tolerance given is effectively the edge "width".
 * @param {Rect} rect
 * @param {Number} x
 * @param {Number} y
 * @param {Number} tolerance
 * @returns {{top: boolean, left: boolean, bottom: boolean, right: boolean}}
 */
export function checkRectEdgesAtPoint(rect, x, y, tolerance = 1) {
    const withinXBounds = x > (rect.x - tolerance) && x < (rect.x + rect.width + tolerance);
    const withinYBounds = y > (rect.y - tolerance) && y < (rect.y + rect.height + tolerance);
    return {
        top: withinXBounds && y > (rect.y - tolerance) && y < rect.y + tolerance,
        left: withinYBounds && x > (rect.x - tolerance) && x < rect.x + tolerance,
        bottom: withinXBounds && y > (rect.y + rect.height - tolerance) && y < rect.y + rect.height + tolerance,
        right: withinYBounds && x > (rect.x + rect.width - tolerance) && x < rect.x + rect.width + tolerance,
    }
}

/**
 * Check if the given x,y point sits on the edge of the given rect.
 * Tolerance is effectively the edge "width".
 * @param {Rect} rect
 * @param {Number} x
 * @param {Number} y
 * @param {Number} tolerance
 * @returns {boolean}
 */
export function pointOnRectEdge(rect, x, y, tolerance = 1) {
    const withinOuter = pointWithinRect(expandRect(rect, tolerance), x, y);
    const withinInner = pointWithinRect(expandRect(rect, -tolerance), x, y);
    return withinOuter && !withinInner;
}

/**
 * Check if the given x,y point sits within the given rect.
 * @param {Rect} rect
 * @param {Number} x
 * @param {Number} y
 * @returns {boolean}
 */
export function pointWithinRect(rect, x, y) {
    return x > rect.x &&
        x < rect.x + rect.width &&
        y > rect.y &&
        y < rect.y + rect.height;
}

/**
 * Expand the given rect in both x and y directions by the given amount.
 * @param {Rect} rect
 * @param {Number} amount
 * @returns {Rect}
 */
export function expandRect(rect, amount) {
    const adjust = Math.ceil(amount / 2);
    return createRect(
        rect.x - adjust,
        rect.y - adjust,
        rect.width + amount,
        rect.height + amount,
    );
}

/**
 * Get the center points of each of the edges of the given rect.
 * @param {Rect} rect
 * @returns {[{x: *, y}, {x: *, y: *}, {x, y: *}, {x: *, y: *}]}
 */
export function getEdgeMidPoints(rect) {
    return [
        {x: rect.x + rect.width / 2, y: rect.y},
        {x: rect.x + rect.width / 2, y: rect.y + rect.height},
        {x: rect.x, y: rect.y + rect.height / 2},
        {x: rect.x + rect.width, y: rect.y + rect.height / 2},
    ];
}

/**
 * @typedef Rect
 * @property {Number} x
 * @property {Number} y
 * @property {Number} width
 * @property {Number} height
 */