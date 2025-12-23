// main.js
import { keyPressed } from './input.js';
import { spawnCannons, randomPattern} from './cannonLogic.js';


const playableArea = document.querySelector('.playableArea');

//variables
var frameCount = 0;
let yStartingPosition = playableArea.clientWidth/2;
let xStartingPosition = playableArea.clientHeight/2;
var startingSpeed = 3;
var cannonAmount = 9;
var cannonSize = 1;
let activeBullets = [];
let lives = 3;

class player {

    constructor(x, y, speed, playableArea) {
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.element = document.createElement('div');
        this.playableArea = playableArea;

        //hit detection properties
        this.isHit = false;
        this.isInvincible = false;
        this.hitTimer = 0;
        this.invincibilityDuration = 1000; // 1 second of invincibility
        this.flashDuration = 150; // 150ms red flash

        this.createPlayer();
    }

    createPlayer() {
        this.element.classList.add('player');
        playableArea.appendChild(this.element);
    }

    calculateBounds() {
        this.yConstraint = playableArea.clientWidth - this.element.offsetWidth;
        this.xConstraint = playableArea.clientHeight - this.element.offsetHeight;
        // console.log(this.yConstraint, this.xConstraint);
        if(this.x > this.xConstraint) {
            this.x = this.xConstraint
        }

        //Validation check seeing that if player leaves bounds, it sets the position to that of the bound
        if(this.y > this.yConstraint) {
            this.y = this.yConstraint
        }

        if(this.x < 0) {
            this.x = 0;
        }

        if(this.y < 0) {
            this.y = 0;
        }
    }

    //handle the players inputs
    handleInput(key) {
        if(key['w']) {
            this.y -= this.speed;
        }
        if(key['s']) {
            this.y += this.speed;
        }
        if(key['a']) {
            this.x -= this.speed;
        }
        if(key['d']) {
            this.x += this.speed;
        }
    }
     
     draw () {
        this.element.style.top = `${this.y}px`;
        this.element.style.left = `${this.x}px`;

        //handle hit visual feedback
        if (this.isHit) {
            const timeSinceHit = Date.now() - this.hitTimer;

            if (timeSinceHit < this.flashDuration) {
                // Flash red during flash duration
                this.element.style.backgroundColor = 'red';
            } else if (timeSinceHit < this.invincibilityDuration) {
                // Still invincible but not flashing - return to black
                this.element.style.backgroundColor = 'black';
            } else {
                // Invincibility expired - reset state
                this.isHit = false;
                this.isInvincible = false;
                this.element.style.backgroundColor = 'black';
            }
        }
     }

     onHit() {
        if (!this.isInvincible) {
            this.isHit = true;
            this.isInvincible = true;
            this.hitTimer = Date.now();
            lives -= 1;
            console.log(`Lives remaining: ${lives}`);
        }
     }


}
//initialize cannons
spawnCannons(cannonAmount, cannonSize, 'cannonSidebarLeft');
spawnCannons(cannonAmount, cannonSize, 'cannonSidebarRight');
spawnCannons(cannonAmount, cannonSize, 'cannonSidebarTop');
spawnCannons(cannonAmount, cannonSize, 'cannonSidebarBottom');

//create the player
const myPlayer = new player(xStartingPosition, yStartingPosition, startingSpeed, playableArea);

//function which updates each frame
function update() {
    myPlayer.handleInput(keyPressed);
    myPlayer.calculateBounds();
    myPlayer.draw();
    
    //random cannon shooting pattern
    randomPattern(frameCount, activeBullets, playableArea, myPlayer);
    frameCount++;

    //starts the loop
    requestAnimationFrame(update);
    
}


update();


