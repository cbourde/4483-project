# CS4483 Game Demo
Farmed and Dangerous: You're a pig, your goal is to kill stuff and get stronger.
## Running the game
This is a web-based game, so there's no single executable file to run. The game should should be available to play at http://0042069.xyz.  
- If the site doesn't load, make sure you're using **HTTP and not HTTPS!** I didn't want to go through the hassle of setting up a certificate for a site that would be used for like a week lol

If the site is down, or if you just want to host it locally, the instructions for setting up the server are as follows:
1. Download and install Node.js (a JavaScript runtime environment) from https://nodejs.org/en. If you're on Linux you can likely also install it using your package manager.
2. Open a terminal or command prompt (Not PowerShell, sometimes that acts weird due to script permissions) in the same folder as this README.
3. Run `npm install` to install the necessary packages for the server to run.
4. Run `node server/server.js` to start the server.
5. Access the game at `http://localhost:5000`

If these instructions seem complicated for someone who just wants to play a game, it's because setting up the server is something that a regular player will never have to do.
## Playing the game
- Use the navigation bar at the top of the page to explore various areas:
	- Go to the Watchtower to fight enemies and earn money.
	- Go to the Armory and the Pig Pen to spend money to upgrade your abilities.
	- Go to the Grain Silo to heal after a fight.
	- [NYI] Go to the Workshop to purchase items to use in battle.
	- [NYI] Go to the Stable to check your inventory.
- At the Watchtower, use the arrow keys to move left and right. Running into an enemy will initiate a battle.
	- On your turn, use either the Slash or Stab attack by clicking one of the buttons on the left.
	- After attacking, click the Enemy Turn button to see what the enemy does.
	- If you kill the enemy, you get some money. If you die, you return to the main screen and lose half of your money.
## Features
- Upgradeable player stats - spend money to upgrade your strength, defense, dexterity, and max health
	- Strength affects slash attack damage
	- Dexterity affects stab attack damage, hit chance, and dodge chance
- Multiple attack types:
	- Slash: damage depends on strength, higher damage but more likely to miss
	- Stab: damage depends on dexterity, lower damage but better accuracy
- Multiple upgrade shops
	- Armory: upgrade strength and defense
	- Pig pen: upgrade health and dexterity
	- Grain silo: spend money to heal
- Persistent storage between screens - sounds lame but was actually pretty hard to get working in a multi-page browser-based game without needing a database
	- This is why our game needs a server instead of being able to just open an HTML file - local storage in the browser doesn't work when not accessing an actual website