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
const PLAYER_SPEED = 4;
const ENEMY_Y = 290;
const TURN_FROMTOP = 100;

// RESULT BOX
const RESULTBOX_Y_W = 1009;
const RESULTBOXW = CANVAS_W/2 - RESULTBOX_Y_W/2; 
const RESULTBOXH = 0;
const RESULTBOX_Y_H = 75;

// BATTLE CONSTS
// PLAYER
const PLAYER_HEALTH = 200;
const PLAYER_STRENGTH = 4;
const PLAYER_DEFENCE = 10;
const PLAYER_FSPEED = 3;
const PLAYER_DEX = 3;
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
    var critChecker = false;
    var dodgeChecker = false;
    var missChecker = false;
    //let fightOver = false;
    const stabBtn = document.getElementById("stabBtn");
    const enemyBtn = document.getElementById("enemyBtn");
    const attackBtn = document.getElementById("attkBtn");
    const roundLabel = document.getElementById("roundStats");
    attkBtn.style.display = 'none';
    attackBtn.innerHTML = '<img src="img/icon_attack.png" />';
    stabBtn.innerHTML = '<img src="img/icon_attack2.png" />';
    enemyBtn.innerHTML = '<img src="img/icon_enemy.png" />';
    
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
            this.width = 250;
            this.height = 200;
            
            // Where main player is drawn on screen
            this.x = 0;
            this.y = this.gameHeight - this.height;
            this.image = document.getElementById('swing');
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
            this.dex = PLAYER_DEX;
            
            
        }
        hideImage() {
            document.getElementById("swing").style.display = 'none';
            document.getElementById("pig_swing").style.display = 'none';
        }
        attack() {
            // Determine players max possible damage output
            var damageDealt = this.strength * 10;
            let plusOrMinus = Math.random();
            if (plusOrMinus >= 0.5) {
                damageDealt = damageDealt * 1.1;
            } else if (plusOrMinus < 0.5 && plusOrMinus > 0.3) {
                damageDealt = damageDealt * 0.9;
            } else if (plusOrMinus <= 0.1) {
                damageDealt = damageDealt * 2;
                critChecker = true;
            } else if (plusOrMinus > 0.1 && plusOrMinus <= 0.3) {
                damageDealt = 0;
                missChecker = true;
            }
            return damageDealt;
        
        }
        
        stab_attack() {
            // Determine players max possible damage output
            var damageDealt = this.dex * 10;
            let plusOrMinus = Math.random();
            if (plusOrMinus >= 0.5) {
                damageDealt = damageDealt * 1.1;
            } else if (plusOrMinus < 0.5 && plusOrMinus > 0.1) {
                damageDealt = damageDealt * 0.9;
            } else if (plusOrMinus <= 0.1) {
                damageDealt = damageDealt * 2;
                critChecker = true;
            } else if (plusOrMinus > 0.1 && plusOrMinus <= 0.2) {
                damageDealt = 0;
                missChecker = true;
            }
            return damageDealt;
            
        }
        hit(power) {
            // add dodge
            var def = this.defence / 10;
            var damageDone = power - def;
            let dodgeChance = Math.random();
            if(dodgeChance >= 0.8) {
                this.health = this.health;
                dodgeChecker = true;
            } else {
                this.health = this.health - damageDone;
            }
            
            if(this.health <= 0) {
                this.health = 0;
            }
        }
        
        draw(context) {
            this.image = document.getElementById("swing");
            context.drawImage(this.image, this.animStart, 0, this.width, this.height, PLAYER_POSX, this.y - 20, this.width, this.height);
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
        
        drawSwing(context) {
            this.image = document.getElementById("pig_swing");
            context.drawImage(this.image, 0, 0, this.width, this.height, PLAYER_POSX, this.y - 20, this.width, this.height);
        }
        drawStab(context) {
            this.image = document.getElementById("pig_stab");
            context.drawImage(this.image, 0, 0, this.width, this.height, PLAYER_POSX, this.y - 20, this.width, this.height);
        }
        drawDodge(context) {
            this.image = document.getElementById("pig_dodge");
            context.drawImage(this.image, 0, 0, this.width, this.height, PLAYER_POSX, this.y - 20, this.width, this.height);
        }
        drawDead(context) {
            this.image = document.getElementById("pig_dead");
            context.drawImage(this.image, 0, 0, this.width, this.height, PLAYER_POSX, this.y - 20, this.width, this.height);
        }
        
        swing() {
            this.image = document.getElementById('swing');
            // increment swing cycle
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
            this.image = document.getElementById('dungeonBackgroundImg');
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
        
    }
    
    class playerText {
        constructor(gameWidth, gameHeight) {
            this.gameWidth = gameWidth;
            this.gameHeight = gameHeight;
            this.font = '35px Luminari';
            this.fillStyle = 'red';
        }
    }
    
    class DeadEnemy {
        constructor(gameWidth, gameHeight) {
            this.gameWidth = gameWidth;
            this.gameHeight = gameHeight;
            this.width = 195;
            this.height = 200;
            this.image = document.getElementById('enemyDeadImg');
            this.x = this.gameWidth;
            this.y = this.gameHeight - this.height;
        }
        
        draw(context) {
            context.drawImage(this.image, 800, this.y - 20, this.width, this.height)
        }
    }
    
    class PTurn {
        constructor(gameWidth, gameHeight) {
            this.gameWidth = gameWidth;
            this.gameHeight = gameHeight;
            this.width = 285;
            this.height = 197;
            this.image = document.getElementById('pTurnImg');
            this.x = this.gameWidth;
            this.y = this.gameHeight - this.height;
        }
        
        draw(context) {
            context.drawImage(this.image, 200, TURN_FROMTOP, this.width, this.height)
        }
        
        redraw(context) {
            context.drawImage(this.image, 100000, 100000, this.width, this.height)
        }
        
    }
    
    class ETurn {
        constructor(gameWidth, gameHeight) {
            this.gameWidth = gameWidth;
            this.gameHeight = gameHeight;
            this.width = 285;
            this.height = 197;
            this.image = document.getElementById('eTurnImg');
            this.x = this.gameWidth;
            this.y = this.gameHeight - this.height;
        }
        
        draw(context) {
            context.drawImage(this.image, 750, TURN_FROMTOP, this.width, this.height)
        }
        
        redraw(context) {
            context.drawImage(this.image, 100000, 100000, this.width, this.height)
        }
    }
    
    class Win {
        constructor(gameWidth, gameHeight) {
            this.gameWidth = gameWidth;
            this.gameHeight = gameHeight;
            this.width = 350;
            this.height = 290;
            this.image = document.getElementById('winImg');
            this.x = this.gameWidth;
            this.y = this.gameHeight - this.height;
        }
        
        draw(context) {
            context.drawImage(this.image, 145, 10, 400, 370)
        }
    }
    
    class Lose {
        constructor(gameWidth, gameHeight) {
            this.gameWidth = gameWidth;
            this.gameHeight = gameHeight;
            this.width = 350;
            this.height = 290;
            this.image = document.getElementById('loseImg');
            this.x = this.gameWidth;
            this.y = this.gameHeight - this.height;
        }
        
        draw(context) {
            context.drawImage(this.image, 145, 10, 400, 370)
        }
    }
    
    class Fight {
        constructor(gameWidth, gameHeight) {
            this.gameWidth = gameWidth;
            this.gameHeight = gameHeight;
            this.width = 350;
            this.height = 201;
            this.image = document.getElementById('fight');
            this.x = this.gameWidth;
            this.y = this.gameHeight - this.height;
        }
        
        draw(context) {
            context.drawImage(this.image, 250, 20, this.width, this.height)
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
            this.speed = 4;
            
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
            context.drawImage(this.image, this.frameX *  this.width, 0, this.width, this.height, this.x, ENEMY_Y - 20, this.width, this.height);
            
        }
        // battle position drawn
        reDraw(context) {
            context.drawImage(this.image, 800, this.y - 20, this.width, this.height);
        }
        
        update(deltaTime) {
            this.x -= this.speed;
        }
        
    }
    
    
    function endGame1() {
        window.location.href = "dungeon.html";     
    }
    function endGame2() {
        window.location.href = "index.html";     
    }
        
    const input = new InputHandler();
    const player = new Player(canvas.width, canvas.height);
    const enemyParty = new Enemy(canvas.width, canvas.height);
    const background = new Background(canvas.width, canvas.height);
    let playerHealthTxt = document.getElementById("pHealth");
    let enemyHealthTxt = document.getElementById("eHealth");
    let roundText = document.getElementById("roundStats");
    let deadEnemy = new DeadEnemy(canvas.width, canvas.height);
    let win = new Win(canvas.width, canvas.height);
    let lose = new Lose(canvas.width, canvas.height);
    let playTurn = new PTurn(canvas.width, canvas.height);
    let enTurn = new ETurn(canvas.width, canvas.height);
    let fightImg = new Fight(canvas.width, canvas.height);
    
    console.log("IN FIGHT:" + fight);
    background.draw(ctx);
    player.draw(ctx);
    enemyParty.reDraw(ctx); // FIGHT position
    ctx.fillStyle = "black";
    ctx.fillRect(RESULTBOXW, RESULTBOXH, RESULTBOX_Y_W, RESULTBOX_Y_H);
    var pRound = Math.round(player.health);
    var eRound = Math.round(enemyParty.health);
    var pHealthVar = `Health: ${pRound}`;
    var eHealthVar = `Health: ${eRound}`;
    ctx.font = '40px Helvetica';
    ctx.fillStyle = 'red';
    ctx.fillText(pHealthVar, 20, 50);
    ctx.font = '40px Helvetica';
    ctx.fillStyle = 'red';
    ctx.fillText(eHealthVar, 755, 50);
    attackBtn.style.display = 'block';
    stabBtn.style.display = 'block';
    enemyBtn.style.display = 'none';
    fightImg.draw(ctx);
	var playerTurn = true;
    let timeout;
	
    attackBtn.addEventListener('click', () => {
        console.log("RAN an attack button for the player");
        ctx.clearRect(0,0,canvas.width, canvas.height);
        background.draw(ctx);
        enemyParty.reDraw(ctx);
        document.getElementById("swing").style.display = 'none';
        document.getElementById("pig_swing").style.display = 'none';
        document.getElementById("pig_stab").style.display = 'none';
		var pAttack = 0;
		var eAttack = 0;    
        player.drawSwing(ctx);
        pAttack = player.attack();
        enemyParty.hit(pAttack);
        console.log("player attack took place");
        playerTurn = false;
        attackBtn.style.display = 'none';
        stabBtn.style.display = 'none';
        enemyBtn.style.display = 'block';
        var pRound = Math.round(player.health);
        var eRound = Math.round(enemyParty.health);
        var pHealthVar = `Health: ${pRound}`;
        var eHealthVar = `Health: ${eRound}`;
        ctx.fillStyle = "black";
        ctx.fillRect(RESULTBOXW, RESULTBOXH, RESULTBOX_Y_W, RESULTBOX_Y_H);
        
        //Check if crit or miss occured
        if(critChecker) {
            roundLabel.innerHTML = `Pig performed a Crit Swing attack, <br>hitting the enemy for ${pAttack}`;
            critChecker = false;
        } else if (missChecker) {
            roundLabel.innerHTML = `Pig performed a Swing attack, <br>but missed dealing 0 damage!`;
            missChecker = false;
            
        } else{
            roundLabel.innerHTML = `Pig performed a Swing attack, <br>hitting the enemy for ${pAttack}`;
        }
        ctx.font = '40px Helvetica';
        ctx.fillStyle = 'red';
        ctx.fillText(pHealthVar, 20, 50);
        ctx.font = '40px Helvetica';
        ctx.fillStyle = 'red';
        ctx.fillText(eHealthVar, 775, 50);
        if(enemyParty.health <= 0) {
            deadEnemy.draw(ctx);
            attackBtn.style.display = 'none';
            stabBtn.style.display = 'none';
            enemyBtn.style.display = 'none';
            win.draw(ctx);
            //enTurn.redraw(ctx);
            document.getElementById("eTurnImg").style.display = 'none';
            playTurn.redraw(ctx);
            roundLabel.innerHTML = `Pig performed a Swing attack, <br>hitting the enemy for ${pAttack} SLAYING THEM.`;
            timeout = setTimeout(endGame1, 3000);
            
        } else if(player.health <= 0) {
            attackBtn.style.display = 'none';
            enemyBtn.style.display = 'none';
            stabBtn.style.display = 'none';
            player.drawDead(ctx);
            lose.draw(ctx);
            timeout = setTimeout(endGame2, 5000);
        } else {
            enTurn.draw(ctx);
        }
    })
    
    stabBtn.addEventListener('click', () => {
        console.log("RAN an attack button for the player");
        ctx.clearRect(0,0,canvas.width, canvas.height);
        background.draw(ctx);
        enemyParty.reDraw(ctx);
        document.getElementById("swing").style.display = 'none';
        document.getElementById("pig_swing").style.display = 'none';
        document.getElementById("pig_stab").style.display = 'none';
		var pAttack = 0;
		var eAttack = 0;   
        player.drawStab(ctx);
        pAttack = player.stab_attack();
        enemyParty.hit(pAttack);
        console.log("player attack took place");
        playerTurn = false;
        attackBtn.style.display = 'none';
        stabBtn.style.display = 'none';
        enemyBtn.style.display = 'block';
        var pRound = Math.round(player.health);
        var eRound = Math.round(enemyParty.health);
        var pHealthVar = `Health: ${pRound}`;
        var eHealthVar = `Health: ${eRound}`;
        ctx.fillStyle = "black";
        ctx.fillRect(RESULTBOXW, RESULTBOXH, RESULTBOX_Y_W, RESULTBOX_Y_H);
        //Check if crit or dodge occured
        if(critChecker) {
            roundLabel.innerHTML = `Pig performed a Crit Stab attack, <br>hitting the enemy for ${pAttack}`;
            critChecker = false;
        }else if (missChecker) {
            roundLabel.innerHTML = `Pig performed a Stab attack, <br>but missed dealing 0 damage!`;
            missChecker = false;
            
        } else{
            roundLabel.innerHTML = `Pig performed a Stab attack, <br>hitting the enemy for ${pAttack}`;
        }
        ctx.font = '40px Helvetica';
        ctx.fillStyle = 'red';
        ctx.fillText(pHealthVar, 20, 50);
        ctx.font = '40px Helvetica';
        ctx.fillStyle = 'red';
        ctx.fillText(eHealthVar, 775, 50);
        if(enemyParty.health <= 0) {
            deadEnemy.draw(ctx);
            attackBtn.style.display = 'none';
            stabBtn.style.display = 'none';
            enemyBtn.style.display = 'none';
            win.draw(ctx);
            //enTurn.redraw(ctx);
            document.getElementById("eTurnImg").style.display = 'none';
            playTurn.redraw(ctx);
            roundLabel.innerHTML = `Pig performed a Stab attack, <br>hitting the enemy for ${pAttack}, SLAYING THEM.`;
            timeout = setTimeout(endGame1, 3000);
            
        } else if(player.health <= 0) {
            attackBtn.style.display = 'none';
            enemyBtn.style.display = 'none';
            stabBtn.style.display = 'none';
            player.drawDead(ctx);
            lose.draw(ctx);
            timeout = setTimeout(endGame2, 5000);
        } else {
            enTurn.draw(ctx);
        }
        
    })
    
    enemyBtn.addEventListener('click', () => {
        console.log("RAN an attack button for the player");
        ctx.clearRect(0,0,canvas.width, canvas.height);
        background.draw(ctx);
        enemyParty.reDraw(ctx);
        document.getElementById("swing").style.display = 'none';
        document.getElementById("pig_swing").style.display = 'none';
        document.getElementById("pig_stab").style.display = 'none';
		var pAttack = 0;
		var eAttack = 0;
        playTurn.draw(ctx);
        eAttack = enemyParty.attack();
        player.hit(eAttack);
        playerTurn =  true;
        attackBtn.style.display = 'block';
        stabBtn.style.display = 'block';
        enemyBtn.style.display = 'none';
        enemyBtn.style.display = 'none';
        console.log("player attack took place");
        var pRound = Math.round(player.health);
        var eRound = Math.round(enemyParty.health);
        var pHealthVar = `Health: ${pRound}`;
        var eHealthVar = `Health: ${eRound}`;
        ctx.fillStyle = "black";
        ctx.fillRect(RESULTBOXW, RESULTBOXH, RESULTBOX_Y_W, RESULTBOX_Y_H);
        if(dodgeChecker) {
            roundLabel.innerHTML = `Enemy performed an attack, <br>but the Pig dodged it!`;
            //display dodge img
            player.drawDodge(ctx);
            dodgeChecker = false;
        } else {
            roundLabel.innerHTML = `Enemy performed an attack, <br>hitting the Pig for ${eAttack}`;
        }
        ctx.font = '40px Helvetica';
        ctx.fillStyle = 'red';
        ctx.fillText(pHealthVar, 20, 50);
        ctx.font = '40px Helvetica';
        ctx.fillStyle = 'red';
        ctx.fillText(eHealthVar, 775, 50);
        if(enemyParty.health <= 0) {
            deadEnemy.draw(ctx);
            attackBtn.style.display = 'none';
            win.draw(ctx);
            //enTurn.redraw(ctx);
            document.getElementById("eTurnImg").style.display = 'none';
            playTurn.redraw(ctx);
            timeout = setTimeout(endGame1, 3000);
            
        } else if(player.health <= 0) {
            attackBtn.style.display = 'none';
            enemyBtn.style.display = 'none';
            stabBtn.style.display = 'none';
            document.getElementById("eTurnImg").style.display = 'none';
            document.getElementById("pTurnImg").style.display = 'none';
            player.drawDead(ctx);
            lose.draw(ctx);
            timeout = setTimeout(endGame2, 5000);
        } else {
            if(!dodgeChecker) {
                player.draw(ctx);
                dodgeChecker = false;
            }
            playTurn.draw(ctx);
            player.draw(ctx);
        }
        
    })
    
});
