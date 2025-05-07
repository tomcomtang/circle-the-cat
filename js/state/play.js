"use strict";
// Movement Direction Flag Variables
var MOVE_NO = -1, MOVE_L = 0, MOVE_LP = 1, MOVE_LD = 2, MOVE_R = 3, MOVE_RP = 4, MOVE_RD = 5;
window.sjm.state.play = {
	preload: function () {
		//console.log("loading play state");
	},

	create: function () {
		//console.log("starting play state");
		// Add Background
		mt.create('bg');
		// Add Click Area
		this.pots = mt.create('pots');
		this.potsList = this.pots.mt.children;
		this.createMap();
		// Add Crazy Cat
		this.resetPo = [27, 28, 35, 36];
		this.creazeCat = mt.create('crazeCat');
		// Randomly Set Cat's Position
		this.setCatPo();
		this.catAni = this.creazeCat.animations;
		this.catAni.add('live', [0, 1, 2], 5, true);
		this.catAni.add('dead', [3, 4, 5, 6], 5, true);
		this.catAni.play('live');

		// Add Sound
		this.step = this.game.add.sound('step');
		this.laugh = this.game.add.sound('laugh');
		this.crazy = this.game.add.sound('crazy');
		// Create Initial Variables
		this.stepCount = 0;
		this.name = ['Furong Sister Title', 'Crazy Person Title', 'Feng Brother-in-law Title', 'Feng Sister Title'];//随便定的4个等级
	},
	createMap: function () {
		for (var i = 0; i < 64; i++) {
			// Randomly Set Immovable Areas
			var postNow = this.potsList['pot' + i];
			postNow.index = i;
			// Randomly Generate Points Where Crazy Cat Cannot Move, Ensuring Some Random Positions Are Accessible
			if (Math.random() < 0.2 & i != 27 && i != 28 && i != 35 & i != 36) {
				postNow.frame = 1;
			}
			// Event Binding
			postNow.inputEnabled = true;
			postNow.events.onInputDown.add(this.changeStep, this);
		}
	},
	setCatPo: function () {
		var catIndex = this.resetPo[parseInt(Math.random() * 4)];
		this.creazeCat.index = catIndex;
		this.creazeCat.x = this.potsList['pot' + catIndex].x + 32;
		this.creazeCat.y = this.potsList['pot' + catIndex].y + 32;
		console.log(catIndex);
	},
	changeStep: function (e) {
		// Index of Currently Clicked Element Starts from 0
		var index = e.index;
		// If Current Point is Already Immovable, Return Directly
		if (e.frame == 1 || index == this.creazeCat.index) {
			return;
		}
		// Make Current Clicked Point Immovable for Crazy Cat
		e.frame = 1;
		this.stepMove();
	},
	getXY: function (num) {// Find Coordinates Based on Current Position
		var row = parseInt(num / 8);
		var col = num % 8;
		return {
			y: row,
			x: col
		};
	},
	getIndex: function (x, y) {// Find Position Based on Coordinates
		return y * 8 + x;
	},
	getPot: function (x, y) {// Get Element Based on Coordinates
		return this.potsList['pot' + this.getIndex(x, y)];
	},
	stepMove: function () {
		var dir = this.stepMoveDir();
		var y = this.catXY.y;
		var x = this.catXY.x;
		console.log(dir, x, y);
		var wPo = null;
		switch (dir) {
			case MOVE_L:
				console.log('MOVE_L', x - 1, y);
				wPo = this.getPot(x - 1, y);
				this.changeCatPo(wPo);
				break;
			case MOVE_LP:
				console.log('MOVE_LP', (y - 1) % 2 == 1 ? x - 1 : x, y - 1);
				wPo = this.getPot((y - 1) % 2 == 1 ? x - 1 : x, y - 1);
				this.changeCatPo(wPo);
				break;
			case MOVE_LD:
				console.log('MOVE_LD', (y + 1) % 2 == 1 ? x - 1 : x, y + 1);
				wPo = this.getPot((y + 1) % 2 == 1 ? x - 1 : x, y + 1);
				this.changeCatPo(wPo);
				break;
			case MOVE_R:
				console.log('MOVE_R', x + 1, y);
				wPo = this.getPot(x + 1, y);
				this.changeCatPo(wPo);
				break;
			case MOVE_RP:
				console.log('MOVE_RP', (y - 1) % 2 === 0 ? x + 1 : x, y - 1);
				wPo = this.getPot((y - 1) % 2 === 0 ? x + 1 : x, y - 1);
				this.changeCatPo(wPo);
				break;
			case MOVE_RD:
				console.log('MOVE_RD', (y + 1) % 2 === 0 ? x + 1 : x, y + 1);
				wPo = this.getPot((y + 1) % 2 === 0 ? x + 1 : x, y + 1);
				this.changeCatPo(wPo);
				break;
			default:// Cat has nowhere to go, caught
				this.crazy.play();
				this.creazeCat.animations.play('dead');
				this.gameOver(true);
				break;
		}
	},
	changeCatPo: function (obj) {// Set Cat's Position
		var pos = this.getXY(obj.index);
		this.creazeCat.x = obj.x + 32;
		this.creazeCat.y = obj.y + 32;
		this.creazeCat.index = obj.index;
		// If Cat Reaches Edge, Game Over - Cat Not Caught
		if (pos.x === 0 || pos.x == 7 || pos.y === 0 || pos.y === 7) {
			this.laugh.play();
			this.gameOver(false);
			return;
		}
		this.step.play();
		this.stepCount = this.stepCount + 1;
	},
	stepMoveDir: function () {// Get Current Direction Crazy Cat Should Move
		var posArr = [-1, -1, -1, -1, -1, -1];
		// Current Cat's Coordinates
		this.catXY = this.getXY(this.creazeCat.index);
		var row = this.catXY.y;
		var col = this.catXY.x;
		var y = row;
		var x = col;
		var nowPot = null;

		//left
		var can = true;
		for (x = col; x >= 0; x--) {
			nowPot = this.getPot(x, row);
			if (nowPot.frame == 1) {
				can = false;
				posArr[MOVE_L] = col - x - 1;
				break;
			}
		}
		if (can) {
			return MOVE_L;
		}
		//left-up
		can = true;
		x = col;
		y = row;
		while (true) {
			y--;
			if (y % 2 == 1) {
				x--;
			}
			nowPot = this.getPot(x, y);
			if (nowPot.frame == 1) {
				can = false;
				posArr[MOVE_LP] = row - y - 1;
				break;
			}
			if (x === 0 || y === 0) {
				break;
			}
		}
		if (can) {
			return MOVE_LP;
		}
		//left-down
		can = true;
		x = col;
		y = row;
		while (true) {
			y++;
			if (y % 2 == 1) {
				x--;
			}
			nowPot = this.getPot(x, y);
			if (nowPot.frame == 1) {
				can = false;
				posArr[MOVE_LD] = y - row - 1;
				break;
			}
			if (x === 0 || y == 7) {
				break;
			}
		}
		if (can) {
			return MOVE_LD;
		}
		//right
		can = true;
		for (x = col; x < 8; x++) {
			nowPot = this.getPot(x, row);
			if (nowPot.frame == 1) {
				can = false;
				posArr[MOVE_R] = x - col - 1;
				break;
			}
		}
		if (can) {
			return MOVE_R;
		}
		//right-up
		can = true;
		x = col;
		y = row;
		while (true) {
			y--;
			if (y % 2 === 0) {
				x++;
			}
			nowPot = this.getPot(x, y);
			if (nowPot.frame == 1) {
				can = false;
				posArr[MOVE_RP] = row - y - 1;
				break;
			}
			if (x == 7 || y === 0) {
				break;
			}
		}
		if (can) {
			return MOVE_RP;
		}
		//right-down
		can = true;
		x = col;
		y = row;
		while (true) {
			y++;
			if (y % 2 === 0) {
				x++;
			}
			nowPot = this.getPot(x, y);
			if (nowPot.frame == 1) {
				can = false;
				posArr[MOVE_RD] = y - row - 1;
				break;
			}
			if (x == 7 || y == 7) {
				break;
			}
		}
		if (can) {
			return MOVE_RD;
		}
		return MOVE_NO;
	},
	gameOver: function (win) {
		if (win) {
			// Cat caught
			this.game.state.start('menu');
		} else {
			// Cat escaped
			this.game.state.start('menu');
		}
	}
};