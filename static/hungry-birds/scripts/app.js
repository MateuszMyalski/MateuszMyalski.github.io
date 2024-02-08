
function displayFPS() {
    push();
    textSize(15);
    textStyle(BOLD);
    frames = frameRate();
    text("FPS:" + round(frames), 20, height - 10);
    pop();
}

const nBirds = 30;
let hungryBirds = new Array();
let eatenFragments = new Object();
let mouseShake;

function mouseClicked() {
    mousePX = constrain(mouseX, 0, width);
    mousePY = constrain(mouseY, 0, height);

    for (let i = 0; i < nBirds; i++)
        hungryBirds[i].flyTo(mousePX, mousePY);
}

let canvas;
let layer;
let holeImg;
let handImg;

function preload() {
    holeImg = loadImage('hole_small.png');
    handImg = loadImage('hand.png');
}


function mouseMoved() {
    if (frameCount % 3 == 0) {
        mouseShake.update(mouseX, mouseY);
    }
}

function keyPressed() {
    canvas.style("pointer-events", "auto");
}

function keyReleased() {
    canvas.style("pointer-events", "none");
}

function setup() {
    canvas = createCanvas(windowWidth, windowHeight);

    layer = createGraphics(windowWidth, windowHeight);

    for (let i = 0; i < nBirds; i++) {
        const margin = 30;
        hungryBirds[i] = new Bird(
            random(-1, 1) > 0 ? random(-margin, 0) : random(width, width + margin),
            random(-1, 1) > 0 ? random(-margin, 0) : random(height, height + margin),
            random(150, 255),
            random(30, 60)
        );
    }

    mouseShake = new MouseShaker(handImg);

    window.alert('Press alt and move the mouse to get rid of the birds!');
}

function draw() {
    clear();
    image(layer, 0, 0);

    displayFPS();

    for (let i = 0; i < nBirds; i++) {
        const flyToMargin = 30;

        hungryBirds[i].update();
        let key = (hungryBirds[i].birdX, hungryBirds[i].birdY)
        if (!hungryBirds[i].isBirdFlying && eatenFragments[key] === undefined) {
            eatenFragments[key] = new Hole(holeImg, hungryBirds[i].birdX, hungryBirds[i].birdY);
            hungryBirds[i].flyTo(random(flyToMargin, width - flyToMargin), random(flyToMargin, height - flyToMargin));
            eatenFragments[key].drawOnLayer(layer);
        }

        for (const mousePos of mouseShake.shakePoints) {
            const spread = 30;
            const handSpread = 80;
            if (hungryBirds[i].isNear(mousePos.x, mousePos.y, handSpread)) {
                hungryBirds[i].targetX -= random(2 * -spread, -spread);
                hungryBirds[i].targetY -= random(2 * -spread, -spread);
                break;
            }
        }

        if (hungryBirds[i].targetX > width ||
            hungryBirds[i].targetX < 0 ||
            hungryBirds[i].targetY > height ||
            hungryBirds[i].targetY < 0) {
            hungryBirds[i].flyTo(random(flyToMargin, width - flyToMargin), random(flyToMargin, height - flyToMargin));
        }


    }

    mouseShake.draw();

    if (keyIsPressed) {
        mouseShake.drawCursor();
    }

    for (let i = 0; i < nBirds; i++) {
        hungryBirds[i].draw();
    }
}