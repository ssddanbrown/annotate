import ModifyTool from "./ModifyTool";
import RectangleTool from "./RectangleTool";
import OvalTool from "./OvalTool";
import NumberedStepTool from "./NumberedStepTool";
import PixelateTool from "./PixelateTool";
import PanZoomTool from "./PanZoomTool";

/**
 * Load all tools attached to the given global state.
 * @param {GlobalState} globalState
 */
export function loadTools(globalState) {
    return {
        modifyTool: new ModifyTool(document.getElementById('tool-modify'), globalState),
        rectangleTool: new RectangleTool(document.getElementById('tool-rectangle'), globalState),
        ovalTool: new OvalTool(document.getElementById('tool-oval'), globalState),
        numberedStepTool: new NumberedStepTool(document.getElementById('tool-numbered-step'), globalState),
        pixelateTool: new PixelateTool(document.getElementById('tool-pixelate'), globalState),
        panZoomTool: new PanZoomTool(document.getElementById('tool-pan-zoom'), globalState),
    };
}