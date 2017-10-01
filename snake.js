var nSnakes = 2;
var l = 5;
var nFood = 10;
var mWidth = 1280;
var mHeight = 720;
var nx = 128;
var ny = 72;
var frame_rate = 15;
var color_array = ["#ff0000", "#00ff00", "0000ff", "#4b0082", "#9400d3", "#ff7f00"];

var sound_intro;
var sound_background;
var sound_eatFood;
var sound_death;

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

var make = {
  make_body: function() {
    var a = getRandomInt(0,nx-1);
    var b = getRandomInt(0,ny-1);
    var body = [[a,b]];
    for (var i = 1; i < l; i++) {
      a = a+1;
      a = (a+nx)%nx;
      body = body.concat([[a, b]]);
    }
    return body;
  },
  make_body_array: function() {
    var body_array;
    for (var i = 0; i < nSnakes; i++) {
      if (i == 0) body_array = [this.make_body()];
      else body_array = body_array.concat([this.make_body()]);
    }
    return body_array;
  },

  make_velocity_array: function() {
    var velocity_array;
    for (var i = 0; i < nSnakes; i++) {
      if (i == 0) velocity_array = ["d"];
      else velocity_array = velocity_array.concat(["d"]);
    }
    return velocity_array;
  },
  
  make_point_array: function() {
    var point_array;
    for (var i = 0; i < nSnakes; i++) {
      if (i == 0) point_array = [0];
      else point_array = point_array.concat([0]);
    }
    return point_array;
  },

  make_isDead_array: function() {
    var isDead_array;
    for (var i = 0; i < nSnakes; i++) {
      if (i == 0) isDead_array = [false];
      else  isDead_array = isDead_array.concat([false]);
    }
    return isDead_array;
  },

  make_food_array: function() {
    var food_array;
    for (var i = 0; i < nFood; i++) {
      if (i == 0) food_array = [getRandomPosition()];
      else food_array = food_array.concat([getRandomPosition()]);
    }
    return food_array;
  },
}

function initializeSnake() {
  return {
    body: make.make_body_array(),
    velocity: make.make_velocity_array(),
    
    food : make.make_food_array(),

    point: make.make_point_array(),
 
    isRunning: 0,
    snake_finished: make.make_isDead_array(),
    game_finished: false,
  	
    show: function() {
  		clear();
  		background('#000000');

  		for(var i = 0; i < nSnakes; i++) {
        fill(color(color_array[i%6]));
  		  for (var j = 0; j < this.body[i].length; j++) {
  			 display_block(this.body[i][j]);
  		  }
      }

      for (var i = 0; i < nFood; i++) {
        fill(color(color_array[getRandomInt(0,5)]));
        display_block(this.food[i]);
      }
  	},

  	update: function() {
      if (this.isRunning % 2 == 1) {
        for (var i = 0; i < nSnakes; i++) {
          if (!this.snake_finished[i]) {
        		var curTail = this.body[i][0];
        		for(var j = 0; j < this.body[i].length-1; j++) {
        			this.body[i][j] = this.body[i][j+1];
        		}

        		var ohx = this.body[i][this.body[i].length-1][0];
        		var ohy = this.body[i][this.body[i].length-1][1];
        		var headx, heady;
            // check if the snake has eaten any food
            for (var f = 0; f < nFood; f++) {
          		if (this.food[f][0] == ohx && this.food[f][1] == ohy) {
          			this.body[i] = [curTail].concat(this.body[i]);
                sound_background.pause();
                sound_eatFood.play();

          			this.food[f] = getRandomPosition();

                this.point[i] = this.point[i] + 10;
                console.log(this.point);
              }
            // ensure that background music is running if nothing else is
              if (!sound_eatFood.isPlaying() && !sound_background.isPlaying()) {
                sound_background.play();
              }
            }
            var velocity = this.velocity[i];            
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
            headx = (headx + nx) % nx ;
            heady = (heady + ny) % ny ;
        		this.body[i][this.body[i].length-1] = [headx, heady];
            if (this.isDead(i)) {
              sound_background.stop();
              sound_death.play();
              this.snakeFinished[i] = true;
              this.body[i] = [[-1, -1]];
            }
          }
        }
        if (this.isRunning%2 == 1 && !this.game_finsihed) {
          var allDead = true;
          for (var i = 0; i < nSnakes; i++) {
            if (this.isDead(i) == false) allDead = false;
          }
          if (allDead == true) {
            this.game_finsihed = true;
          }
        }
      }
    },

  	updateVelocity: function(i, key) {
  		if (this.velocity[i] == 'w' || this.velocity[i] == "s") {
  			if (key=="a" || key=="d") {
  				this.velocity[i] = key;
  			}
  		}
  		if (this.velocity[i] == 'a' || this.velocity[i] == "d") {
  			if (key=="s" || key=="w") {
  				this.velocity[i] = key;
  			}
      }
  	},
    
    isDead: function(i) {
      var li = this.body[i].length;
      for (var j = 0; j < nSnakes; j++) {
        var lj = this.body[j].length;
        for (var k = 0; k < lj; k++) {
          if (this.body[i][li-1][0] == this.body[j][k][0] && this.body[i][li-1][1] == this.body[j][k][1]) {
            if (!(i == j && k == lj-1)) return true;
          }
        }
      }
      return false;
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
    },

    pauseOrResume: function() {
      this.isRunning += 1;
      if (this.isRunning % 2 == 0) sound_background.pause(); 
      else sound_background.play();
    },
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
}

function draw() {
	snake.show();
	snake.update();

  if (!sound_intro.isPlaying() && snake.isRunning == 0) {
      snake.startGame();
  }
}

function keyPressed() {
  if (keyCode == 32) {
    if (!snake.game_finsihed) {
      if (snake.isRunning == 0) {
        snake.startGame();
      }
      else {
        snake.pauseOrResume();
      }
    } else {
      snake = initializeSnake();
      snake.startGame();
    }
  }
 // Player 1, arrow_key controls
  if (keyCode == UP_ARROW) {
    // console.log("up");
    snake.updateVelocity(0, "w");
  } else if (keyCode == DOWN_ARROW) {
    // console.log("down");
    snake.updateVelocity(0, "s");
  } else if (keyCode == LEFT_ARROW) {
    // console.log("left");
    snake.updateVelocity(0, "a");
  } else if (keyCode == RIGHT_ARROW) {
    // console.log("right");
    snake.updateVelocity(0, "d");
  }
  // Player 2, WSAD controls
  if (keyCode == 87) {
    // console.log("up");
    snake.updateVelocity(1, "w");
  } else if (keyCode == 83) {
    // console.log("down");
    snake.updateVelocity(1, "s");
  } else if (keyCode == 65) {
    // console.log("left");
    snake.updateVelocity(1, "a");
  } else if (keyCode == 68) {
    // console.log("right");
    snake.updateVelocity(1, "d");
  }
  // Player 3, HJKL(Vim-style) controls
  if (keyCode == 75) {
    // console.log("up");
    snake.updateVelocity(2, "w");
  } else if (keyCode == 74) {
    // console.log("down");
    snake.updateVelocity(2, "s");
  } else if (keyCode == 72) {
    // console.log("left");
    snake.updateVelocity(2, "a");
  } else if (keyCode == 76) {
    // console.log("right");
    snake.updateVelocity(2, "d");
  }

  return false; // prevent default
}
