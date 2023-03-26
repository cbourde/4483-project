//Globals
//Main Canvas setting
const CANVAS_W = 1009;
const CANVAS_H = 482;

// image globals
const BG_IMG_W = 2009;
const BG_IMG_H = 482;
const MID_IMG_W = 2009;
const MID_IMG_H = 482;
const MID_SPEED = 2;
const PLAYER_SINGLE_W = 250;
const PLAYER_SINGLE_H = 200;
const PLAYER_POSX = 200;
const PLAYER_SPEED = 3;
const ENEMY_Y = 290;

// BATTLE CONSTS
// PLAYER
const PLAYER_HEALTH = 200;
const PLAYER_STRENGTH = 4;
const PLAYER_DEFENCE = 10;
const PLAYER_FSPEED = 3;
// ENEMY
const ENEMY_HEALTH = 150;
const ENEMY_STRENGTH = 3;
const ENEMY_DEFENCE = 15;
const ENEMY_FSPEED = 2;

window.addEventListener('load', function(){
   
    const canvas = document.getElementById('canvas1');
    const ctx = canvas.getContext('2d');
    canvas.width = CANVAS_W;
    canvas.height = CANVAS_H;
    let enemies = [];
    let fight = false;
    //let fightOver = false;
    const attackBtn = document.getElementById("attkBtn");
    attkBtn.style.display = 'none';
    attackBtn.innerHTML = '<img src="img/icon_attack.png" />';
    
    
    // Apply Event Listeners to keyboard events and stores active keys
    class InputHandler {
        
        constructor() {
            this.keys = [];
            window.addEventListener('keydown', msg => {
                if((msg.key === 'ArrowDown' || msg.key === 'ArrowUp' || msg.key === 'ArrowLeft' || msg.key === 'ArrowRight') && this.keys.indexOf(msg.key) === -1) {
                    this.keys.push(msg.key);
                }
                console.log(msg.key, this.keys); 
            });
            window.addEventListener('keyup', msg => {
                if(msg.key === 'ArrowDown' || msg.key === 'ArrowUp' || msg.key === 'ArrowLeft' || msg.key === 'ArrowRight') {
                    this.keys.splice(this.keys.indexOf(msg.key), 1);
                }
                //console.log(msg.key, this.keys); 
            });
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
            this.x = 0;
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
            
            // Player battle stats
            this.health = PLAYER_HEALTH;
            this.strength = PLAYER_STRENGTH;
            this.defence = PLAYER_DEFENCE;
            this.fightSpeed = PLAYER_FSPEED;
            
            
        }
        
        attack() {
            
            var damageDealt = this.strength * 10;
            let plusOrMinus = Math.random();
            if (plusOrMinus => 0.5) {
                damageDealt = damageDealt * 1.1;
            } else {
                damageDealt = damageDealt * 0.9;
            }
            return damageDealt;
        }
        
        hit(power) {
            var def = this.defence / 10;
            var damageDone = power - def;
            this.health = this.health - damageDone;
            if(this.health <= 0) {
                this.health = 0;
            }
        }
        
        draw(context) {
            //context.strokeStyle = 'white';
            //context.strokeRect(this.x, this.y, this.width, this.height);
            //context.fillStyle = 'white';
            //context.fillRect(this.x, this.y, this.width, this.height);
            context.drawImage(this.image, this.animStart, 0, this.width, this.height, PLAYER_POSX, this.y + 58, this.width, this.height);
        }
        
        update(input, enemies) {
            
            // collision dect
            enemies.forEach(enemy => {
                const dx = enemy.x - this.x;
                const dy = enemy.y - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if(distance < enemy.width/2 + this.width/2){
                    //window.location.href = "file://C:/Users/chris/Dropbox/UWO/4483/altSolo/battle.html";
                    fight = true;
                } 
            });
            
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
            if(this.x <0) {
                this.x = 0;
            }  else if (this.x > this.gameWidth - this.width) {
                this.x = this.gameWidth - this.width;
            }
            
        }
        
    }
    
    
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
            context.drawImage(this.image, this.x + this.width, this.y, this.width, this.height);
        }
        
        update() {
            this.x -= player.speed;
            if(player.speed < 0) {
                this.x=this.x;
                //this.speed=0;
            }
            if(this.x < 0 - this.width) {
                this.x = 0;
            } else if(this.x > 0) {
                this.x=0;
            }
        }
    }
    
    class playerText {
        constructor(gameWidth, gameHeight) {
            this.gameWidth = gameWidth;
            this.gameHeight = gameHeight;
            this.font = '35px Helvetica';
            this.fillStyle = 'red';
        }
    }
    
    // Class to Handle midground
    class Midground {
        
        constructor(gameWidth, gameHeight) {
            this.gameWidth = gameWidth;
            this.gameHeight = gameHeight;
            this.image = document.getElementById('midgroundImg');
            this.x = 0;
            this.y = -40;
            this.width = MID_IMG_W;
            this.height = MID_IMG_H;
            this.speed = MID_SPEED;
        }
        
        // tells which canvas the background should be drawn on
        draw(context) {
            context.drawImage(this.image, this.x, this.y, this.width, this.height);
            context.drawImage(this.image, this.x + this.width, this.y, this.width, this.height);
        }
        
        update() {
            this.x -= player.speed *2;
            if(player.speed < 0) {
                this.x=this.x;
                //this.speed=0;
            }
            if(this.x < 0 - this.width) {
                this.x = 0;
            } else if(this.x > 0) {
                this.x=0;
            }
        }
    }
    
    // Generates Enemies
    class Enemy {
        
        constructor(gameWidth, gameHeight){
            this.gameWidth = gameWidth;
            this.gameHeight = gameHeight;
            this.width = 195;
            this.height = 200;
            this.image = document.getElementById('enemyImg');
            this.x = this.gameWidth;
            this.y = this.gameHeight - this.height;
            this.frameX = 0;
            this.maxFrame = 5;
            this.fps = 20;
            this.speed = 7;
            
            // Enemy battle stats
            this.health = ENEMY_HEALTH;
            this.strength = ENEMY_STRENGTH;
            this.defence = ENEMY_DEFENCE;
            this.fightSpeed = ENEMY_FSPEED;
        }
        
        attack() {
            
            var damageDealt = this.strength * 10;
            let plusOrMinus = Math.random();
            if (plusOrMinus => 0.5) {
                damageDealt = damageDealt * 1.1;
            } else {
                damageDealt = damageDealt * 0.9;
            }
            return damageDealt;
        }
        
        hit(power) {
            var def = this.defence / 10;
            var damageDone = power - def;
            this.health = this.health - damageDone;
            if(this.health <= 0) {
                this.health = 0;
            }
        }
        
        draw(context){
            //context.strokeStyle = 'white';
            //context.strokeRect(this.x, this.y, this.width, this.height);
            context.drawImage(this.image, this.frameX *  this.width, 0, this.width, this.height, this.x, ENEMY_Y, this.width, this.height);
            
        }
        
        reDraw(context) {
            context.drawImage(this.image, 800, this.y, this.width, this.height);
        }
        
        update(deltaTime) {
            this.x -= this.speed;
        }
        
    }
    
    // function for generating enemies, adding, animating, removing ACTIVE enemies
    function handleEnemies(deltaTime) {
        if(enemyTimer > enemyInterval + randomEnemyInterval && !fight) {
            enemies.push(new Enemy(canvas.width, canvas.height));
            randomEnemyInterval = Math.random() * 10000 + 500;
            enemyTimer = 0;
        } else {
            enemyTimer += deltaTime;
        } 
        
        // Enemy hits and checks itself to remove and redraw itself in proper position
        if(fight) {
            // Empty the field of enemies
            enemies = [];
            //enemyParty = new Enemy (canvas.width, canvas.height);
            //enemyParty.reDraw(ctx); // FIGHT position
            //displayEnemyStatusText(context, enemyParty.health);
        }
    
        enemies.forEach(enemy => {
            enemy.draw(ctx);
            enemy.update(deltaTime);
        });
    }
    
    // function to handle player text
    function displayPlayerStatusText(context, playerHealth) {
        let playerHealthTxt = `Health: ${playerHealth}`;
        context.font = '40px Helvetica';
        context.fillStyle = 'red';
        context.fillText(playerHealthTxt, 20, 50);
    }
    // function to handle enemy text
    function displayEnemyStatusText(context, enemyHealth) {
        let enemyHealthTxt = `Health: ${enemyHealth}`;
        context.font = '40px Helvetica';
        context.fillStyle = 'red';
        context.fillText(enemyHealthTxt, 775, 50);
    }
    
    // function to display turn text
    function displayTurnText(context, turn) {
        let turnTxt = `${turn}`;
        context.font = '35px Helvetica';
        context.fillStyle = 'white';
        context.fillText(turnTxt, 400, 50);
    }
    
    // Process the user or enemy turn
    function processTurn(binput, player, enemyParty, playerTurnBool, enemyTurnBool) {
        var turnComplete = false;
        var pTurn = playerTurnBool;
        var eTurn = enemyTurnBool;
        //battleInput = input;
        console.log("processTurn");
        
        //Check first if player or enemy is dead before turn starts
        /*if(player.health <= 0) {
            console.log("player dead");
        } else if (enemyParty.health <= 0) {
            console.log("enemy dead");
        }*/
        
        
        if(pTurn === true && eTurn === false) {
                console.log("pTurn was true, button should be visible");
                attackBtn.style.display = 'block';

                /*
                if(binput.keys.indexOf('ArrowUp') > -1) {
                    console.log("RAN an arrowUp for the player");
                    var pAttack = player.attack();
                    enemyParty.hit(pAttack);
                    displayEnemyStatusText(ctx, enemyParty.health);
                    displayPlayerStatusText(ctx, player.health);
                    playerTurn = false;
                    enemyTurn = true;           

                } else if(binput.keys.indexOf('ArrowDown') > -1) {
                    player.health = player.health + 50;
                    displayPlayerStatusText(ctx, player.health);
                    displayEnemyStatusText(ctx, enemyParty.health);
                }*/
                attackBtn.addEventListener('click', () => {
                    console.log("RAN an attack button for the player");
                    var pAttack = player.attack();
                    enemyParty.hit(pAttack);
                    displayEnemyStatusText(ctx, enemyParty.health);
                    displayPlayerStatusText(ctx, player.health);
                    playerTurn = false;
                    enemyTurn = true;  
                    attackBtn.style.display = 'none';
                    turnComplete = true;
                    pTurn = false;
                    eTurn = true;
                })
            
        } 
        else if (eTurn === true && pTurn === false) {
            console.log("enemy attack took place");
            var eAttack = enemyParty.attack();
            player.hit(eAttack);
            displayPlayerStatusText(ctx, player.health);
            playerTurn = true;
            enemyTurn = false;
            turnComplete = true;
            pTurn = true;
            eTurn = false;
        }
        
    }
        
    const input = new InputHandler();
    const player = new Player(canvas.width, canvas.height);
    const enemyParty = new Enemy(canvas.width, canvas.height);
    const background = new Background(canvas.width, canvas.height);
    const midground = new Midground(canvas.width, canvas.height);
    let playerHealthTxt = document.getElementById("pHealth");
    let enemyHealthTxt = document.getElementById("eHealth");
    
    console.log("IN FIGHT:" + fight);
    background.draw(ctx);
    background.update();
    midground.draw(ctx);
    midground.update();
    player.draw(ctx);
    enemyParty.reDraw(ctx); // FIGHT position
    
    var pHealthVar = `Health: ${player.health}`;
    var eHealthVar = `Health: ${enemyParty.health}`;
    ctx.font = '40px Helvetica';
    ctx.fillStyle = 'red';
    ctx.fillText(pHealthVar, 20, 50);
    ctx.font = '40px Helvetica';
    ctx.fillStyle = 'red';
    ctx.fillText(eHealthVar, 775, 50);
    attackBtn.style.display = 'block';
    
    attackBtn.addEventListener('click', () => {
        console.log("RAN an attack button for the player");
        background.draw(ctx);
        background.update();
        midground.draw(ctx);
        midground.update();
        player.draw(ctx);
        enemyParty.reDraw(ctx);
        
        var pAttack = player.attack();
        enemyParty.hit(pAttack);
        console.log("enemy attack took place");
        var eAttack = enemyParty.attack();
        player.hit(eAttack);
        var pHealthVar = `Health: ${player.health}`;
        var eHealthVar = `Health: ${enemyParty.health}`;
        ctx.font = '40px Helvetica';
        ctx.fillStyle = 'red';
        ctx.fillText(pHealthVar, 20, 50);
        ctx.font = '40px Helvetica';
        ctx.fillStyle = 'red';
        ctx.fillText(eHealthVar, 775, 50);
        if(enemyParty.health <= 0) {
            window.location.href = "file://C:/Users/chris/Dropbox/UWO/4483/soloGame/index.html";
        } else if(player.health <= 0) {
            window.location.href = "file://C:/Users/chris/Dropbox/UWO/4483/soloGame/farm.html";
        }
    })    
    
});