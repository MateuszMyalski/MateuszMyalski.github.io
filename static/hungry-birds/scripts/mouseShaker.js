class MouseShaker {
    shakePoints = new Array();
    debug = false;
    deltaFrames = 60
    
    constructor(cursorImage) {
        const cursorSize = 100;
        this.cursorImage = cursorImage;
        this.cursorImage.resize(cursorSize, cursorSize);
    }

    update(x, y) {
        this.shakePoints.push({ x: x, y: y });
    }

    draw() {
        if (frameCount % this.deltaFrames) {
            return;
        }

        if (this.debug) {
            push();
            stroke("#00FF00");
            strokeWeight(5);
            this.shakePoints.forEach(pos => {
                point(pos.x, pos.y);

            });
            pop();
        }

        this.shakePoints = new Array();
    }

    drawCursor() {
        const mousePX = constrain(mouseX, 0, width);
        const mousePY = constrain(mouseY, 0, height);
        
        push();
        translate(this.x, this.y);
        imageMode(CENTER);
        image(this.cursorImage, mousePX, mousePY);
        pop();
    }
}