/**
 * The global state of the application.
 * Simple state properties are on the top-level.
 * Manipulations should not be done direct to these but instead
 * actions, within the 'actions' property, should be called.
 * @type {GlobalState}
 */
const globalState = {
    activeDrawing: null,
    actions: {
        makeDrawingActive(drawing) {
            globalState.activeDrawing = drawing;
        },
        deactivateDrawing(drawing) {
            if (globalState.activeDrawing === drawing) {
                globalState.activeDrawing = null;
            }
        }
    }
}

export default globalState;

/**
 * @typedef GlobalState
 * @property {Drawing|null} activeDrawing
 * @property {Object} actions
 */