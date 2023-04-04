// Stats display elements
let healthDisplay = document.getElementById("health-display");
let moneyDisplay = document.getElementById("money-display");
let meleeDisplay = document.getElementById("dropdown-entry-melee");
let defenseDisplay = document.getElementById("dropdown-entry-defense");
let speedDisplay = document.getElementById("dropdown-entry-speed");

function clearStorage(){
	try{
		window.localStorage.clear();
		let stats = {
			currentHealth: 100,
			maxHealth: 100,
			healthLevel: 0,
			strength: 5,
			strengthLevel: 0,
			defense: 10,
			defenseLevel: 0,
			dexterity: 3,
			dexLevel: 0,
			money: 0,
			inventory: {
				smallPotion: 0,
				bigPotion: 0,
				maxItems: 3,
				level: 0
			}
		}
		// If max health is not set then storage has not been initialized
		window.localStorage.setItem("stats", JSON.stringify(stats));
	}
	catch(err){
		// User doesn't have local storage enabled
		alert("Local storage permission must be enabled for this game to work properly. Enable, then refresh the page.");
		return;
	}
}

function initStorage(){
	if (window.localStorage.getItem("stats") === null){
		clearStorage();
	}
}

function updateStatDisplays(){
	let stats = JSON.parse(window.localStorage.getItem("stats"));

	healthDisplay.innerText = `Health: ${stats.currentHealth} / ${stats.maxHealth}`;
	moneyDisplay.innerText = `Money: ${stats.money}`;
	meleeDisplay.innerText = `Strength: ${stats.strength}`;
	defenseDisplay.innerText = `Defense: ${stats.defense}`;
	speedDisplay.innerText = `Dexterity: ${stats.dexterity}`;
}

initStorage();
updateStatDisplays();

function addMoney(amt){
	let stats = JSON.parse(window.localStorage.getItem("stats"));
	stats.money += amt;
	window.localStorage.setItem("stats", JSON.stringify(stats));
}

// Check player's money
function checkMoney(price){
	let money = parseInt(window.localStorage.getItem("money"));
	if (money < price){
		alert("Not enough money!");
		return false;
	}
	return true;
}

function getStorage(){
	return JSON.parse(window.localStorage.getItem("stats"));
}

function saveStats(stats){
	window.localStorage.setItem("stats", JSON.stringify(stats));
}

// Upgrade lookup tables
let meleeUpgradeTable = [
	{amount: 5, price: 100},
	{amount: 5, price: 200},
	{amount: 10, price: 500},
	{amount: 10, price: 1000},
	{amount: 10, price: 1500},
	{amount: 0, price: Infinity}
];
let defenseUpgradeTable = [
	{amount: 5, price: 100},
	{amount: 5, price: 200},
	{amount: 5, price: 500},
	{amount: 5, price: 1000},
	{amount: 10, price: 1500},
	{amount: 10, price: 2500},
	{amount: 0, price: Infinity}
];
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
let inventoryUpgradeTable = [
	{amount: 1, price: 500},
	{amount: 1, price: 750},
	{amount: 1, price: 1000},
	{amount: 1, price: 1250},
	{amount: 1, price: 1500},
	{amount: 1, price: 1750},
	{amount: 1, price: 200},
	{amount: 0, price: Infinity}
]