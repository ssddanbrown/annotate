/**
 * The global shared state of the application.
 * Simple state properties are on the top-level.
 * Manipulations should not be done direct to these but instead
 * actions, within the 'actions' property, should be called.
 * @type {GlobalState}
 */
const globalState = {
    testing: true,
    activeDrawing: null,
    activeTool: null,
    renderables: [],
    drawingCanvas: null,
    imageCanvas: null,
    canvasContainer: null,
    actions: {
        setTestMode(active = false) {
            globalState.testing = active;
        },
        setImageCanvas(canvas) {
            globalState.imageCanvas = canvas;
        },
        setDrawingCanvas(canvas) {
            globalState.drawingCanvas = canvas;
        },
        setCanvasContainer(canvasContainer) {
            globalState.canvasContainer = canvasContainer;
        },
        addDrawing(drawing) {
            globalState.renderables.push(drawing);
        },
        addDrawingToRenderStart(drawing) {
            globalState.renderables.splice(0, 0, drawing);
        },
        removeDrawing(drawing) {
            if (globalState.activeDrawing === drawing) {
                globalState.actions.deactivateDrawing(drawing);
            }
            const drawingIndex = globalState.renderables.indexOf(drawing);
            globalState.renderables.splice(drawingIndex, 1);
        },
        makeToolActive(tool) {
            if (globalState.activeTool) {
                globalState.activeTool.deactivate();
                globalState.drawingCanvas.removeAddedCanvasEventListeners();
            }
            globalState.activeTool = tool;
            tool.activate()
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
 * @property {Boolean} testing
 * @property {Drawing|null} activeDrawing
 * @property {Tool|null} activeTool
 * @property {Object} actions
 * @property {Array<Drawing>} renderables
 * @property {DrawingCanvas|null} drawingCanvas
 * @property {ImageCanvas|null} imageCanvas
 * @property {CanvasContainer|null} canvasContainer
 */