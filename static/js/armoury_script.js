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
	
	function reDraw(){
		background.draw(ctx);
        background.update();
		player.draw(ctx);
		player.update(input);
		
		
		requestAnimationFrame(reDraw);

	}
	
	////////////////////////////////////////////////////
	//  MAIN
	
	const input = new InputHandler();
    const player = new Player(canvas.width, canvas.height);
    const background = new Background(canvas.width, canvas.height);
	
	
	requestAnimationFrame(reDraw);
	
	//while(1) {
	//	if(input.keys.indexOf('ArrowRight') > -1) {
	//		player.update(input);
	//	}
		
		
		//reDraw();
	//}
	
	//requestAnimationFrame(reDraw);
    	
});