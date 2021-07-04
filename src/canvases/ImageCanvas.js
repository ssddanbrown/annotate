import Canvas from "./Canvas";

export default class ImageCanvas extends Canvas {

    loadImage(imageEl) {
        // Simple canvas fill
        // TODO - Fit or resize canvas
        this.ctx.drawImage(imageEl, 0, 0, this.el.width, this.el.height);
    }

}