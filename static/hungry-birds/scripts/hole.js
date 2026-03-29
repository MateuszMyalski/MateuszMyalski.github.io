class Hole {
    debug = false;
    constructor(img, x, y) {
        this.x = x;
        this.y = y;
        this.size = random(30, 50);
        this.rotation = random(0, PI);
        this.img = img;
        // this.img.resize(this.size, this.size);
    }

    draw() {
        push()
        imageMode(CENTER);
        translate(this.x, this.y);
        rotate(this.rotation);
        image(this.img, 0, 0);
        if (this.debug) {
            push();
            stroke("#FF0000");
            noFill();
            rect(-this.size / 2, -this.size /2 , this.size, this.size);
            pop();
        }
        pop()

    }

    drawOnLayer(layer) {
        layer.push()
        layer.imageMode(CENTER);
        layer.translate(this.x, this.y);
        layer.rotate(this.rotation);
        layer.image(this.img, 0, 0);
        if (this.debug) {
            layer.push();
            layer.stroke("#FF0000");
            layer.noFill();
            layer.rect(-this.size / 2, -this.size /2 , this.size, this.size);
            layer.pop();
        }
        layer.pop()

    }

}