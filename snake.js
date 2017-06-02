var mWidth = 480;
var mHeight = 360;
var nx = 40;
var ny = 30;
var frame_rate = 10;

function display_block(p) {
	var i = p[0];
	var j = p[1];

	rect(i*mWidth/nx, j*mHeight/ny, mWidth/nx, mHeight/ny);
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomPosition() {
	return [getRandomInt(0, nx-1), getRandomInt(0,ny-1)];
}
var sound_intro;
var sound_background;
var sound_eatFood;
var sound_death;

var snake = {
	body: [[1,1], [2,1], [3,1]],
	velocity: "d",
	body_color: "#000000",
	food_color: "#000000",
	food : getRandomPosition(),
  isRunning: 0,
	show: function() {
		clear();
		background('#e0e0e0');
		fill(color(this.food_color));
		display_block(this.food);

		fill(color(this.body_color));
		for (var i = 0; i<this.body.length; i++) {
			display_block(this.body[i]);
		}
	},
	update: function() {
    if (this.isRunning%2 == 1 && this.isDead() == false) {
  		//move snake ahead
  		var curTail = this.body[0];
  		for(var i=0; i<this.body.length-1; i++) {
  			this.body[i] = this.body[i+1];
  		}

  		var ohx = this.body[this.body.length-1][0];
  		var ohy = this.body[this.body.length-1][1];
  		var headx, heady;
  		var velocity = this.velocity;
  		if (this.food[0] == ohx && this.food[1] == ohy) {
  			// console.log("Length before : " + this.body.length);
  			this.body = [curTail].concat(this.body);
        sound_eatFood.play();
  			this.food = getRandomPosition();
        // console.log("Length After : " + this.body.length);
      }
      if (velocity == "w") {
  			headx = ohx;
  			heady = ohy - 1;
  		} else if (velocity == "a") {
  			headx = ohx - 1;
  			heady = ohy;
  		} else if (velocity == "s") {
  			headx = ohx;
  			heady = ohy + 1;
  		} else if (velocity == "d") {
  			headx = ohx + 1;
  			heady = ohy;
  		}
  		headx = ((headx % nx) + nx) % nx ;
  		heady = ((heady % ny) + ny) % ny ;
  		this.body[this.body.length-1] = [headx, heady];
  	}
    if (this.isRunning%2 == 1 && this.isDead() == true) {
      sound_death.play();
      this.isRunning += 1;
    }
  },

	updateVelocity: function(key) {
		// console.log("updating velocity : " + key);
		if (this.velocity == 'w' || this.velocity == "s") {
			if (key=="a" || key=="d") {
				this.velocity = key;
			}
		}
		if (this.velocity == 'a' || this.velocity == "d") {
			if (key=="s" || key=="w") {
				this.velocity = key;
			}
		}
		// console.log(this.velocity);
	},
  isDead: function() {
    var l = this.body.length;
    for(var i=0; i<l-1; i++) {
      if (this.body[l-1][0] == this.body[i][0] && this.body[l-1][1] == this.body[i][1] ) {
        // console.log("Dead");
        return true;
      }
      if (i == l-2) {
        // console.log("Alive");
        return false;
      }
    }
  }
}

function preload() {
  sound_intro = loadSound("pacman_beginning.mp3");
  sound_background = loadSound("pacman_chomp.mp3");
  sound_eatFood = loadSound("pacman_eatfruit.mp3");
  sound_death = loadSound("pacman_death.mp3");
}
function setup() {
	// console.log(frame_rates);
	createCanvas(mWidth, mHeight);
	frameRate(frame_rate);
  sound_intro.play();
  // snake.isRunning = 1;
}

function draw() {
	snake.show();
	snake.update();
}

file:///home/nk7/snake/snake.js
function keyPressed() {
  if (keyCode == 32) {
    // console.log("start")
    snake.isRunning += 1;
  }
  if (keyCode == UP_ARROW) {
    // console.log("up");
    snake.updateVelocity("w");
  } else if (keyCode == DOWN_ARROW) {
    // console.log("down");
    snake.updateVelocity("s");
  } else if (keyCode == LEFT_ARROW) {
    // console.log("left");
    snake.updateVelocity("a");
  } else if (keyCode == RIGHT_ARROW) {
    // console.log("right");
    snake.updateVelocity("d");
  }
  return false; // prevent default
}
