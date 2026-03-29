let parrot = [];
let parrotsAmmount = 50;
let hideSpots = [];
let crambs = [];
let frames;


function mouseClicked() {
	mousePX = constrain(mouseX, 0, width);
	mousePY = constrain(mouseY, 0, height);
	crambs.push(new cramb(mousePX, mousePY));
}

function showFPS() {
	push();
	textSize(15);
	textStyle(BOLD);
	if (frameCount % 5 == 0)
		frames = frameRate();
	text("FeedTheBirds Made with ❤ by Mateusz Myalski FPS:" +round(frames), 20, height-10);
	pop();
}

function generateHideSpots() {
		randomSeed(millis());
	for (let i = 0; i < parrot.length; i++) {
		hideSpots[i] = ["X"];
		hideSpots[i] = ["Y"];
		hideSpots[i]["X"] = random(-1, 1) > 0 ? random(-width, -500) : random(width + 50, width + 500);
		hideSpots[i]["Y"] = random(-1, 1) < 0 ? random(-height, -500) : random(height + 50, height + 500);
	}

}

function setup() {
	createCanvas(windowWidth, windowHeight);

	//Init
	for (let i = 0; i < parrotsAmmount; i++)
		parrot[i] = new bird(
			random(0, width), //x
			random(0, height), //y
			random(0, 2 * PI), //rotate
			random(150, 255), //color
			floor(random(2, 20)), //fly state
			random(20, 40) //size
		);

	generateHideSpots();

}

function draw() {
	background(220);
	showFPS();


	if (crambs.length != 0) {
		let recordTable = [];

		//Check for nearest crumb
		for (let i = 0; i < parrot.length; i++) {
			for(let n = 0; n < crambs.length; n++){
				recordTable[n] = floor(dist(parrot[i].birdPX,parrot[i].birdPY,crambs[n].crambPX, crambs[n].crambPY));
			}

		//Search for index of the nearest crumb
			for(let n = 0; n < crambs.length; n++){
				if(recordTable[n] == min(recordTable)){
					if (parrot[i].moveTo(crambs[n].crambPX, crambs[n].crambPY)) {
						parrot[i].eat(crambs[n].crambPX, crambs[n].crambPY, n);
						break;
					}
				}
			}
		}
		generateHideSpots();
	} else {
		for (let i = 0; i < parrot.length; i++) {
			parrot[i].moveTo(hideSpots[i]["X"], hideSpots[i]["Y"]);
		}
	}


	for (let i = 0; i < crambs.length; i++)
		crambs[i].updateCramb();

	for (let i = 0; i < parrot.length; i++)
		parrot[i].updateBird();
}

class bird {
	constructor(x, y, angle, color, FlyState, size) {
		this.birdPX = x;
		this.birdPY = y;
		this.points = 0;

		this.birdSize = size;
		this.birdAngle = angle;

		this.birdColor = color;

		this.birdFlyState = FlyState;
		this.birdFlyUp = false;
	}

	animateBird() {
		if (this.birdFlyState >= 1 && !this.birdFlyUp) {
			this.birdFlyState -= 1;
			if (this.birdFlyState == 1)
				this.birdFlyUp = true;
		}
		if (this.birdFlyState <= round(this.birdSize) && this.birdFlyUp) {
			this.birdFlyState += 1;
			if (this.birdFlyState == round(this.birdSize))
				this.birdFlyUp = false;
		}

	}

	updateBird() {
		this.animateBird();
		push();
		fill(this.birdColor);
		strokeWeight(1);
		translate(this.birdPX, this.birdPY);
		rotate(this.birdAngle);
		triangle(0, 0, this.birdSize, 0, this.birdSize, this.birdFlyState / 100 * this.birdSize);
		triangle(0, 0, this.birdSize, 0, this.birdSize, -this.birdFlyState / 100 * this.birdSize);
		pop();


	}

	moveTo(x, y) {
		let distance = int(dist(x, y, this.birdPX, this.birdPY));
		if (distance > 1) {
			// push();
			// strokeWeight(1);
			// line(x, y, this.birdPX, this.birdPY);
			// pop();
			if (x > this.birdPX)
				this.birdPX += random(0.1, 5);
			if (x <= this.birdPX)
				this.birdPX -= random(0.1, 5);
			if (y > this.birdPY)
				this.birdPY += random(0.1, 5);
			if (y <= this.birdPY)
				this.birdPY -= random(0.1, 5);

			let tailPX = floor(this.birdPX + cos(this.birdAngle) * this.birdSize);
			let tailPY = floor(this.birdPY + sin(this.birdAngle) * this.birdSize);
			let perfectAngle = atan2(tailPY - y, tailPX - x);
			if (this.birdAngle > perfectAngle)
				this.birdAngle -= 0.1;
			if (this.birdAngle < perfectAngle)
				this.birdAngle += 0.1;
		} else {
			return true;
		}
		this.updateBird();
	}

	eat(x, y, i) {
		if (crambs.splice(i, 1)) {
			this.points += 1;
			this.birdSize += this.points / 10;
		}
	}
}


function cramb(x, y) {

	this.crambPX = x;
	this.crambPY = y;

	this.updateCramb = function() {
		push();
		strokeWeight(5);
		point(this.crambPX, this.crambPY);
		pop();
	}

}
