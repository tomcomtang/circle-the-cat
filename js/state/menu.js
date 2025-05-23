"use strict";
window.sjm.state.menu = {
	preload: function () {

	},

	create: function () {
		// you can create menu group in map editor and load it like this:
		// mt.create("menu");
		// Background
		mt.create('bg');
		// Game Start Button
		this.startBtn = mt.create('btnStart');
		this.startBtn.inputEnabled = true;
		this.startBtn.events.onInputDown.add(this.play, this);
	},

	update: function () {

	},
	play: function () {
		this.game.state.start('play');
	}
};