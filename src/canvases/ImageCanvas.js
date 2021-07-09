import Canvas from "./Canvas";

export default class ImageCanvas extends Canvas {

    loadImage(imageEl) {
        // Simple canvas fill
        this.ctx.clearRect(0, 0, this.el.width, this.el.height);
        this.ctx.drawImage(imageEl, 0, 0, this.el.width, this.el.height);
    }

    scaleImage(newWidth) {
        const newHeight = (newWidth * (this.el.height / this.el.width));
        this.ctx.drawImage(this.el, 0, 0, newWidth, newHeight);
        const imageData = this.ctx.getImageData(0, 0, newWidth, newHeight);
        this.setSize(newWidth, newHeight);
        this.ctx.putImageData(imageData, 0, 0);
    }
}