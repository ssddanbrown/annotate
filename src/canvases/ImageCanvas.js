import Canvas from "./Canvas";

export default class ImageCanvas extends Canvas {

    loadImage(imageEl) {
        // Simple canvas fill
        this.ctx.clearRect(0, 0, this.el.width, this.el.height);
        this.ctx.drawImage(imageEl, 0, 0, this.el.width, this.el.height);
    }

}