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

// Stats display elements
let healthDisplay = document.getElementById("health-display");
let moneyDisplay = document.getElementById("money-display");
let meleeDisplay = document.getElementById("dropdown-entry-melee");
let defenseDisplay = document.getElementById("dropdown-entry-defense");
let speedDisplay = document.getElementById("dropdown-entry-speed");

let buttons = [];
let healthUpgradeTable = [
	{amount: 25, price: 100},
	{amount: 25, price: 200},
	{amount: 50, price: 500},
	{amount: 50, price: 1000},
	{amount: 50, price: 1500},
	{amount: 0, price: Infinity}
];
let speedUpgradeTable = [
	{amount: 1, price: 100},
	{amount: 1, price: 200},
	{amount: 1, price: 500},
	{amount: 1, price: 1000},
	{amount: 1, price: 1500},
	{amount: 1, price: 2500},
	{amount: 0, price: Infinity}
];

function clearStorage(){
	try{
		// If max health is not set then storage has not been initialized
		window.localStorage.setItem("maxHealth", "100");
		window.localStorage.setItem("healthLevel", "0");
		window.localStorage.setItem("currentHealth", "100");
		window.localStorage.setItem("meleeAttack", "5");
		window.localStorage.setItem("meleeLevel", "0");
		window.localStorage.setItem("defense", "10");
		window.localStorage.setItem("defenseLevel", "0");
		window.localStorage.setItem("speed", "3");
		window.localStorage.setItem("speedLevel", "0");
		window.localStorage.setItem("money", "0");
	}
	catch(err){
		// User doesn't have local storage enabled
		alert("Local storage permission must be enabled for this game to work properly. Enable, then refresh the page.");
		return;
	}
}

function initStorage(){
	if (window.localStorage.getItem("maxHealth") === null){
		clearStorage();
	}
	// If max health is already set then storage has been initialized somewhere else already
}

function addMoney(amt){
	let money = parseInt(window.localStorage.getItem("money"));
	money += amt;
	window.localStorage.setItem("money", money);
}

function updateStatDisplays(){
	let health = parseInt(window.localStorage.getItem("currentHealth"));
	let maxHealth = parseInt(window.localStorage.getItem("maxHealth"));
	let money = parseInt(window.localStorage.getItem("money"));
	let meleeAttack = parseInt(window.localStorage.getItem("meleeAttack"));
	let defense = parseInt(window.localStorage.getItem("defense"));
	let speed = parseInt(window.localStorage.getItem("speed"));

	healthDisplay.innerText = `Health: ${health} / ${maxHealth}`;
	moneyDisplay.innerText = `Money: ${money}`;
	meleeDisplay.innerText = `Strength: ${meleeAttack}`;
	defenseDisplay.innerText = `Defense: ${defense}`;
	speedDisplay.innerText = `Dexterity: ${speed}`;
}

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

// Check player's money
function checkMoney(price){
	let money = parseInt(window.localStorage.getItem("money"));
	if (money < price){
		alert("Not enough money!");
		return false;
	}
	return true;
}

// Upgrade health
function upgradeHealth(){
	let healthLevel = parseInt(window.localStorage.getItem("healthLevel"));
	let upgrade = healthUpgradeTable[healthLevel];

	if (checkMoney(upgrade.price)){
		let money = parseInt(window.localStorage.getItem("money"));
		money -= upgrade.price;
		window.localStorage.setItem("money", money);

		let health = parseInt(window.localStorage.getItem("maxHealth"));
		let oldHealth = health;
		health += upgrade.amount;
		window.localStorage.setItem("maxHealth", health);

		console.log(`max health upgraded from ${oldHealth} to ${health}`);

		healthLevel += 1;
		window.localStorage.setItem("healthLevel", healthLevel);

		let next = healthUpgradeTable[healthLevel]
		if (next.price == Infinity){
			this.text = "Upgrade Max Health - Max level";
		}
		else{
			this.text = `${this.textBase} +${next.amount} - ${next.price} G`;
		}
	}
}

// Text formatting functions
function formatHealth(base){
	let healthLevel = parseInt(window.localStorage.getItem("defenseLevel"));
	let healthStats = healthUpgradeTable[healthLevel];
	return `${base} +${healthStats.amount} - ${healthStats.price} G`;
}

// Upgrade speed/dexterity
function upgradeSpeed(){
	let speedLevel = parseInt(window.localStorage.getItem("speedLevel"));
	let upgrade = speedUpgradeTable[speedLevel];

	if (checkMoney(upgrade.price)){
		let money = parseInt(window.localStorage.getItem("money"));
		money -= upgrade.price;
		window.localStorage.setItem("money", money);

		let speed = parseInt(window.localStorage.getItem("speed"));
		let oldSpeed = speed;
		speed += upgrade.amount;
		window.localStorage.setItem("speed", speed);

		console.log(`Dexterity upgraded from ${oldSpeed} to ${speed}`);

		speedLevel += 1;
		window.localStorage.setItem("speedLevel", speedLevel);

		let next = speedUpgradeTable[speedLevel]
		if (next.price == Infinity){
			this.text = "Upgrade Dexterity - Max level";
		}
		else{
			this.text = `${this.textBase} +${next.amount} - ${next.price} G`;
		}
	}
}

// Text formatting functions
function formatSpeed(base){
	let speedLevel = parseInt(window.localStorage.getItem("speedLevel"));
	let speedStats = speedUpgradeTable[speedLevel];
	return `${base} +${speedStats.amount} - ${speedStats.price} G`;
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

	buttons.push(new ClickableButton(400, 100, 600, 60, `Upgrade Dexterity`, 2, formatSpeed, upgradeSpeed));
	buttons.push(new ClickableButton(400, 200, 600, 60, "Upgrade Health", 2, formatHealth, upgradeHealth));
	
	
	requestAnimationFrame(reDraw);
	
	//while(1) {
	//	if(input.keys.indexOf('ArrowRight') > -1) {
	//		player.update(input);
	//	}
		
		
		//reDraw();
	//}
	
	//requestAnimationFrame(reDraw);
		
});