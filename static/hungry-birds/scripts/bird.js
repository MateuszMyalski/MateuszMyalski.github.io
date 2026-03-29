class Bird {
    debug = false;
    constructor(startX, startY, color, size) {
        this.birdX = startX;
        this.birdY = startY;
        this.birdDirection = 0;

        this.targetX = startX;
        this.targetY = startY;

        this.birdSize = size;
        this.birdSizeScalar = 1;
        this.birdColor = color;

        this.wingsLength = 0;

        this.wingsLengthStep = 1;
        this.wingsMaxLength = 50;

        this.isBirdFlying = true;

        this.takeOffDelay = 30;
        this.takeOffValue = 0;
    }

    #moveWings() {
        if (this.wingsLength >= this.wingsMaxLength || this.wingsLength < 0) {
            this.wingsLengthStep *= -1;
        }

        this.wingsLength += this.wingsLengthStep;
    }

    #rotateBird() {
        const birdDirectionMargin = 0.1;
        const birdDirectionStep = 0.05;

        const angleDiff = atan2(this.birdX - this.targetX, this.birdY - this.targetY);
        let targetDirection = -angleDiff + 1 / 2 * PI;

        // Ensure targetDirection is within [0, 2 * PI) range
        targetDirection = (targetDirection + 2 * PI) % (2 * PI);


        const targetDiff = abs(this.birdDirection - targetDirection);

        if (targetDiff <= birdDirectionMargin) {
            return;
        }


        // In case we are at the end of circle 0 == 2PI set the target right away
        // to not oscillate left->right
        if (targetDirection < 0.5 || targetDirection > 2 * PI - 0.5) {
            this.birdDirection = targetDirection;
            return;
        }

        // Determine the shortest path to the target direction
        if (this.birdDirection > targetDirection) {
            this.birdDirection -= birdDirectionStep;
        } else {
            this.birdDirection += birdDirectionStep;
        }

        // Ensure the birdDirection stays within [0, 2 * PI) range
        this.birdDirection = (this.birdDirection + 2 * PI) % (2 * PI);


    }

    #moveBird() {
        const birdSpeed = 2;

        this.birdX += -cos(this.birdDirection) * birdSpeed;
        this.birdY += -sin(this.birdDirection) * birdSpeed;
    }

    #makeBirdLand(distance) {
        const scalarChangeStep = 0.01;

        if (distance < this.birdSize * 2) {
            if (this.birdSizeScalar > 0.4) {
                this.birdSizeScalar -= scalarChangeStep;
            }
        }

    }

    #makeBirdTakeOff(distance) {
        const scalarChangeStep = 0.01;

        if (distance > this.birdSize * 2) {
            if (this.birdSizeScalar < 1) {
                this.birdSizeScalar += scalarChangeStep;
            }
        }
    }

    isNear(x, y, radius) {
        const distance = Math.sqrt((x - this.birdX) ** 2 + (y - this.birdY) ** 2);
        const isInRange = distance < radius;

        if (this.debug) {
            push()
            if (isInRange)
                stroke("#00FF00");
            else
                stroke("#FF0000");
            noFill();
            ellipse(x, y, radius);
            pop()
        }
        return isInRange


    }

    update() {
        const birdLocationMargin = 10;

        this.#moveWings();

        const distance = int(dist(this.birdX, this.birdY, this.targetX, this.targetY));
        if (distance <= birdLocationMargin) {
            this.isBirdFlying = false;
            this.takeOffValue = this.takeOffDelay;
            return;
        }

        if (this.takeOffValue != 0) {
            this.takeOffValue -= 1;
            return;
        }

        this.isBirdFlying = true;
        this.#makeBirdLand(distance);
        this.#makeBirdTakeOff(distance);

        this.#moveBird();
        this.#rotateBird();

    }

    draw() {
        push();
        fill(this.birdColor);
        strokeWeight(1);
        translate(this.birdX, this.birdY);
        rotate(this.birdDirection);
        const calcBirdSize = this.birdSize * this.birdSizeScalar;
        let scaledWingsLength = this.wingsLength / 100 * calcBirdSize;
        triangle(0, 0, calcBirdSize, 0, calcBirdSize, scaledWingsLength);
        triangle(0, 0, calcBirdSize, 0, calcBirdSize, -scaledWingsLength);
        pop();

        if (this.debug) {
            push()
            if (this.isBirdFlying)
                stroke("#FF0000");
            else
                stroke("#00FF00");
            drawingContext.setLineDash([3, 3]);
            line(this.birdX, this.birdY, this.targetX, this.targetY);

            strokeWeight(5);
            point(this.birdX, this.birdY);

            strokeWeight(0);
            text(Math.floor(this.birdDirection * 100) / 100, this.birdX, this.birdY);

            stroke("#0000FF");
            strokeWeight(1);
            line(this.birdX,
                this.birdY,
                this.birdX - cos(this.birdDirection) * 50,
                this.birdY - sin(this.birdDirection) * 50);
            pop()
        }
    }

    flyTo(newX, newY) {
        this.targetX = newX;
        this.targetY = newY;
    }
}