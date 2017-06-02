/* TODO
Sounds
Points
press this button to start
game over
diamond food
*/



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

function initializeSnake() {
  return {
  	body: [[1,1], [2,1], [3,1], [4,1], [5,1], [6,1], [7,1], [8,1], [9,1]],
  	velocity: "d",
  	body_color: "#000000",
  	food_color: "#000000",
  	food : getRandomPosition(),
    isRunning: 0,
    game_finsihed: false,
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
          sound_background.pause();
          sound_eatFood.play();
    			this.food = getRandomPosition();
          // console.log("Length After : " + this.body.length);
        }
        // ensure that background music is running if nothing else is
        if (!sound_eatFood.isPlaying() && !sound_background.isPlaying()) {
          sound_background.play();
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
      if (this.isRunning%2 == 1 && this.isDead() == true && !this.game_finsihed) {
        console.log("dead!");
        console.log(this.isRunning);
        sound_background.stop();
        sound_death.play();
        // this.isRunning += 1;
        // this.isRunning = 0;
        this.game_finsihed = true;
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
    },
    startGame: function() {
      this.isRunning += 1;
      if(sound_intro.isPlaying()) {
        sound_intro.stop();
      }
      if (sound_death.isPlaying()) {
        sound_death.stop();
      }
      sound_background.loop();
      // sound_background.setVolume();
    },
    pauseOrResume: function() {
      this.isRunning += 1;
      if (this.isRunning % 2 == 0) {
        sound_background.pause();
      } else {
        sound_background.play();
      }
    }
  }
}
var snake = initializeSnake();

function preload() {
  sound_intro = loadSound("sounds/pacman_beginning.mp3");
  sound_background = loadSound("sounds/pacman_intermission.wav");
  sound_eatFood = loadSound("sounds/pacman_eatghost.wav");
  sound_death = loadSound("sounds/pacman_death.mp3");
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

  if (!sound_intro.isPlaying() && snake.isRunning == 0) {
      snake.startGame();
  }
}

file:///home/nk7/snake/snake.js
function keyPressed() {
  if (keyCode == 32) {
    // console.log("start")
    // snake.isRunning += 1;
    if (!snake.game_finsihed) {
      if (snake.isRunning == 0) {
        snake.startGame();
      }
      else {
        // snake.isRunning += 1;
        snake.pauseOrResume();
      }
    } else {
      snake = initializeSnake();
      // sound_intro.play();
      snake.startGame();
    }
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
