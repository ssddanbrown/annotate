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
    const withinOuter = (
        x > rect.x - tolerance &&
        x < rect.x + rect.width + tolerance &&
        y > rect.y - tolerance &&
        y < rect.y + rect.height + tolerance
    );

    const withinInner = (
        x > rect.x + tolerance &&
        x < rect.x + rect.width - tolerance &&
        y > rect.y + tolerance &&
        y < rect.y + rect.height - tolerance
    );

    return withinOuter && !withinInner;
}


/**
 * @typedef Rect
 * @property {Number} x
 * @property {Number} y
 * @property {Number} width
 * @property {Number} height
 */