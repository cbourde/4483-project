# CS4483 Game Demo
Farmed and Dangerous: You're a pig, your goal is to kill stuff and get stronger.  
GitHub: https://github.com/cbourde/4483-project  

## Developers
Cameron Bourdeau [251080553]  
Christopher Judkins [251094902]

## Running the game
This is a web-based game, so there's no single executable file to run. The game should should be available to play at:  https://cbourde.github.io/4483-project

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
	- Go to the Workshop to purchase items to use in battle.
	- Go to the Stable to check and upgrade your inventory.
- At the Watchtower, use the arrow keys to move left and right. Running into an enemy will initiate a battle.
	- On your turn, use either the Slash or Stab attack by clicking one of the buttons on the left.
	- If you have healing potions, you can use them with the small and large heart buttons.
	- After attacking, click the Enemy Turn button to see what the enemy does.
	- If you kill the enemy, you get some money. If you die, you return to the main screen and lose half of your money.
	- After (or during) a battle, you can use the navigation bar to go back to the hub or shops. If you want a harder challenge, limit yourself to only doing this during a battle.
		- Yeah it kind of takes away from the challenge, but even if the nav bar was disabled in battle you could just use the back button anyway.
- If you want to give yourself extra money to test the upgrade shops, open the console in your browser's developer tools and enter `addMoney(x)` where x is the amount of money you want.
- If you want to reset your progress, enter `clearStorage()` in the browser's console, or clear your cache/cookies for the site.
## Features
- Two levels: Farm (easy), Dungeon (harder)
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
	- Workshop: Buy potions to heal in battle
	- Stable: View and upgrade your inventory
- Persistent storage between screens - sounds lame but was actually pretty hard to get working in a multi-page browser-based game without needing a database
	- This is why our game needs a server instead of being able to just open an HTML file - local storage in the browser doesn't work when not accessing an actual website

## Misc
- All art was generated using Midjourney AI, modified in photoshop.
