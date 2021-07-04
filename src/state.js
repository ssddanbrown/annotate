/**
 * The global shared state of the application.
 * Simple state properties are on the top-level.
 * Manipulations should not be done direct to these but instead
 * actions, within the 'actions' property, should be called.
 * @type {GlobalState}
 */
const globalState = {
    activeDrawing: null,
    activeTool: null,
    renderables: [],
    actions: {
        addDrawing(drawing) {
            globalState.renderables.push(drawing);
        },
        makeToolActive(tool) {
            globalState.activeTool = tool;
        },
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
 * @property {Tool|null} activeTool
 * @property {Object} actions
 * @property {Array<Drawing>} renderables
 */