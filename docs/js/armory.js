//Globals
//Main Canvas setting
const CANVAS_W = 1200;
const CANVAS_H = 482;

// image globals
const BG_IMG_W = 1200;
const BG_IMG_H = 482;
const MID_IMG_W = 2009;
const MID_IMG_H = 482;
const MID_SPEED = 2;
const PLAYER_SINGLE_W = 250;
const PLAYER_SINGLE_H = 200;
const PLAYER_POSX_START = 200;
const PLAYER_SPEED = 3;
const ENEMY_Y = 290;

// BATTLE CONSTS
// PLAYER
const PLAYER_HEALTH = 200;
const PLAYER_STRENGTH = 10;
const PLAYER_DEFENCE = 10;
const PLAYER_FSPEED = 3;
// ENEMY
const ENEMY_HEALTH = 150;
const ENEMY_STRENGTH = 6;
const ENEMY_DEFENCE = 15;
const ENEMY_FSPEED = 2;

let buttons = [];

// Define a shape path without drawing it (for mouse-over detection)
function definePath(rect, ctx){
	ctx.beginPath();
	ctx.moveTo(rect.points[0].x, rect.points[0].y);
	for (let i = 1; i < rect.points.length; i++){
		ctx.lineTo(rect.points[i].x, rect.points[i].y);
	}
	ctx.closePath();
}

function handleClick(e, ctx){
	// Get mouse position relative to canvas
	let mouseX, mouseY;
	if (e.offsetX){
		mouseX = e.offsetX;
		mouseY = e.offsetY;
	}
	else if(e.layerX) {
		mouseX = e.layerX;
		mouseY = e.layerY;
	}

	// Check whether the mouse is over a button
	for (let button of buttons){
		definePath(button.rect, ctx);
		if (ctx.isPointInPath(mouseX, mouseY)){
			// If the mouse is on a button, do its callback function
			button.callback();
		}
	}
}

// =================================================
// -------------- Button functions -----------------
// =================================================

// Upgrade defense
function upgradeDefense(){
	let stats = JSON.parse(window.localStorage.getItem("stats"));
	let upgrade = defenseUpgradeTable[stats.defenseLevel];

	if (checkMoney(upgrade.price)){
		stats.money -= upgrade.price;
		let oldDefense = stats.defense;
		stats.defense += upgrade.amount;

		console.log(`Defense upgraded from ${oldDefense} to ${stats.defense}`);

		stats.defenseLevel += 1;

		window.localStorage.setItem("stats", JSON.stringify(stats));

		let next = defenseUpgradeTable[stats.defenseLevel]
		if (next.price == Infinity){
			this.text = "Upgrade Defense - Max level";
		}
		else{
			this.text = `${this.textBase} +${next.amount} - ${next.price} G`;
		}
	}
}

// Text formatting functions
function formatDefense(base){
	let stats = JSON.parse(window.localStorage.getItem("stats"));
	return `${base} +${defenseUpgradeTable[stats.defenseLevel].amount} - ${defenseUpgradeTable[stats.defenseLevel].price} G`;
}

// Upgrade melee attack by a given amount
function upgradeMelee(){
	let stats = JSON.parse(window.localStorage.getItem("stats"));
	let upgrade = meleeUpgradeTable[stats.strengthLevel];

	if (checkMoney(upgrade.price)){
		stats.money -= upgrade.price;
		let oldDStrength = stats.strength;
		stats.strength += upgrade.amount;

		console.log(`Strength upgraded from ${oldStrength} to ${stats.strength}`);

		stats.defenseLevel += 1;

		window.localStorage.setItem("stats", JSON.stringify(stats));

		let next = meleeUpgradeTable[stats.strengthLevel]
		if (next.price == Infinity){
			this.text = "Upgrade Strength - Max level";
		}
		else{
			this.text = `${this.textBase} +${next.amount} - ${next.price} G`;
		}
	}
}

// Text formatting functions
function formatMelee(base){
	let stats = JSON.parse(window.localStorage.getItem("stats"));
	return `${base} +${meleeUpgradeTable[stats.strengthLevel].amount} - ${meleeUpgradeTable[stats.strengthLevel].price} G`;
}

window.addEventListener('load', function(){
	
	console.log("Started");
	const canvas = document.getElementById('canvas1');
	const ctx = canvas.getContext('2d');
	canvas.width = CANVAS_W;
	canvas.height = CANVAS_H;
	

	// Class to Handle background
	class Background {
		
		constructor(gameWidth, gameHeight) {
			this.gameWidth = gameWidth;
			this.gameHeight = gameHeight;
			this.image = document.getElementById('backgroundImg');
			this.x = 0;
			this.y = 0;
			this.width = BG_IMG_W;
			this.height = BG_IMG_H;
			this.speed = 0;
		}
		
		// tells which canvas the background should be drawn on
		draw(context) {
			context.drawImage(this.image, this.x, this.y, this.width, this.height);
			//context.drawImage(this.image, this.x + this.width, this.y, this.width, this.height);
		}
		
		update() {

		}
	}
	
	 // Class to react to active keys
	class Player {
		
		//define player to draw and animate
		constructor(gameWidth, gameHeight){
			this.gameWidth = gameWidth;
			this.gameHeight = gameHeight;
			this.width = 200;
			this.height = 250;
			
			// Where main player is drawn on screen
			this.x = PLAYER_POSX_START;
			this.y = this.gameHeight - this.height;
			this.image = document.getElementById('playerImg');
			this.speed = PLAYER_SPEED;
			
			//Optional parameters for drawImage() to cut out spreadsheet image. Change to move cut out, and add to drawImage.
			this.frameX = 0;
			this.frameY = 0;
			
			// Player animation walk cycle, starts at 0
			this.currCycleNum = 0;
			this.numCycleAnim = 4;
			this.animStart = 0;
		   
			
		}
		

		draw(context) {

			context.drawImage(this.image, this.animStart, 0, this.width, this.height, this.x, this.y + 58, this.width, this.height);
		}
		
		update(input) {
			
			// increment walk cycle
			if(this.currCycleNum >= this.numCycleAnim) {
				this.currCycleNum = 0;
			}
			
			const xStart = [0, 250, 500, 750];
			this.animStart = xStart[this.currCycleNum];
			
			//horizontal moves
			//THis will move character around screen: this.x += this.speed;
			if(input.keys.indexOf('ArrowRight') > -1) {
				this.speed = PLAYER_SPEED;
				this.currCycleNum += 1;
				
			} else if(input.keys.indexOf('ArrowLeft') > -1) {
				this.speed = -PLAYER_SPEED;
			} else if(input.keys.indexOf('ArrowUp') > -1) {
				window.location.href = "index.html";
			} else {
				this.speed = 0;
			}
			
			this.x += this.speed;
			
			if(this.x <0) {
				this.x = 0;
			}  else if (this.x > this.gameWidth - this.width) {
				this.x = this.gameWidth - this.width;
			}
			
			
		}
		
	}
	
	 // Apply Event Listeners to keyboard events and stores active keys
	class InputHandler {
		
		constructor() {
			this.keys = [];
			window.addEventListener('keydown', msg => {
				if((msg.key === 'ArrowDown' || msg.key === 'ArrowUp' || msg.key === 'ArrowLeft' || msg.key === 'ArrowRight') && this.keys.indexOf(msg.key) === -1) {
					this.keys.push(msg.key);
				}
				
			});
			window.addEventListener('keyup', msg => {
				if(msg.key === 'ArrowDown' || msg.key === 'ArrowUp' || msg.key === 'ArrowLeft' || msg.key === 'ArrowRight') {
					this.keys.splice(this.keys.indexOf(msg.key), 1);
				}
				//console.log(msg.key, this.keys); 
			});
		}
	}

	class ClickableButton {
		/**
		 * A button that calls a function when clicked
		 * @param {number} x X position of top left corner
		 * @param {number} y Y position of top left corner
		 * @param {number} w Width
		 * @param {number} h Height
		 * @param {string} text Text string
		 * @param {number} textSize Text size in em
		 * @param {(string) => string} formatText Function to format button text for use in constructor
		 * @param {() => void} callback Function to call when clicked
		 */
		constructor(x, y, w, h, text, textSize, formatText, callback){
			this.x = x;
			this.y = y;
			this.w = w;
			this.h = h;
			this.textSize = textSize;
			this.textBase = text;
			this.callback = callback;
			this.callback.bind(this);
			this.rect = {
				points: [
					{x: x, y: y},
					{x: x + w, y: y},
					{x: x + w, y: y + h},
					{x: x, y: y + h}
				]
			};

			this.text = formatText(text);
		}

		/**
		 * Draws the button to a canvas
		 * @param {CanvasRenderingContext2D} ctx Canvas context to draw to
		 */
		draw(ctx){
			ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
			ctx.strokeStyle = "#fed88d";
			ctx.lineWidth = 5;
			// Rect
			ctx.beginPath();
			ctx.moveTo(this.rect.points[0].x, this.rect.points[0].y);
			for (let i = 1; i < this.rect.points.length; i++){
				ctx.lineTo(this.rect.points[i].x, this.rect.points[i].y);
			}
			ctx.closePath();
			ctx.fill();
			ctx.stroke();
			// Text
			ctx.fillStyle = "#fed88d";
			ctx.font = `${this.textSize}em sans-serif`
			ctx.textAlign = "center";
			ctx.textBaseline = "middle";
			ctx.fillText(this.text, this.x + (this.w / 2), this.y + (this.h / 2));
		}
	}
	
	function reDraw(){
		background.draw(ctx);
		background.update();
		player.draw(ctx);
		player.update(input);
		for (let button of buttons){
			button.draw(ctx);
		}
		updateStatDisplays();
		
		requestAnimationFrame(reDraw);

	}

	function buttonClicked(e){
		handleClick(e, ctx);
	}
	
	////////////////////////////////////////////////////
	//  MAIN

	initStorage();
	updateStatDisplays();
	canvas.addEventListener("click", buttonClicked);
	
	const input = new InputHandler();
	const player = new Player(canvas.width, canvas.height);
	const background = new Background(canvas.width, canvas.height);

	// Buttons

	buttons.push(new ClickableButton(400, 100, 600, 60, `Upgrade Strength`, 2, formatMelee, upgradeMelee));
	buttons.push(new ClickableButton(400, 200, 600, 60, "Upgrade Defense", 2, formatDefense, upgradeDefense));
	
	
	requestAnimationFrame(reDraw);
	
	//while(1) {
	//	if(input.keys.indexOf('ArrowRight') > -1) {
	//		player.update(input);
	//	}
		
		
		//reDraw();
	//}
	
	//requestAnimationFrame(reDraw);
		
});