// Stats display elements
let healthDisplay = document.getElementById("health-display");
let moneyDisplay = document.getElementById("money-display");
let meleeDisplay = document.getElementById("dropdown-entry-melee");
let defenseDisplay = document.getElementById("dropdown-entry-defense");
let speedDisplay = document.getElementById("dropdown-entry-speed");

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

function updateStatDisplays(){
	let health = parseInt(window.localStorage.getItem("currentHealth"));
	let maxHealth = parseInt(window.localStorage.getItem("maxHealth"));
	let money = parseInt(window.localStorage.getItem("money"));
	let meleeAttack = parseInt(window.localStorage.getItem("meleeAttack"));
	let defense = parseInt(window.localStorage.getItem("defense"));
	let speed = parseInt(window.localStorage.getItem("speed"));

	healthDisplay.innerText = `Health: ${health} / ${maxHealth}`;
	moneyDisplay.innerText = `Money: ${money}`;
	meleeDisplay.innerText = `Melee Attack: ${meleeAttack}`;
	defenseDisplay.innerText = `Defense: ${defense}`;
	speedDisplay.innerText = `Speed: ${speed}`;
}

initStorage();
updateStatDisplays();