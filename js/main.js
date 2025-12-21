// main.js
import { keyPressed } from './input.js';
import { spawnCannons, checkCollision } from './cannonLogic.js';

const playableArea = document.querySelector('.playableArea');

//variables
let yStartingPosition = playableArea.clientWidth/2;
let xStartingPosition = playableArea.clientHeight/2;
var startingSpeed = 3;
var cannonAmount = 11;
var cannonSize = 1;
let activeBullets = [];

class player {

    constructor(x, y, speed, playableArea) {
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.element = document.getElementById('player');
        this.playableArea = playableArea;
    }

     calculateBounds() {
        this.yConstraint = playableArea.clientWidth - this.element.offsetWidth;
        this.xConstraint = playableArea.clientHeight - this.element.offsetHeight;
        console.log(this.yConstraint, this.xConstraint);
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
     }

     
}
//initialize cannons
spawnCannons(cannonAmount, cannonSize, 'cannonSidebarLeft');
spawnCannons(cannonAmount, cannonSize, 'cannonSidebarRight');
spawnCannons(cannonAmount, cannonSize, 'cannonSidebarTop');
spawnCannons(cannonAmount, cannonSize, 'cannonSidebarBottom');


const myPlayer = new player(xStartingPosition, yStartingPosition, startingSpeed);
//function which updates each frame
function update() {
    myPlayer.handleInput(keyPressed);
    myPlayer.calculateBounds();
    myPlayer.draw();
    
    //bullet logic
    for (let i = activeBullets.length - 1; i>=0; i--) {
        let b = activeBullets[i];

        //moveBullet
        b.x += b.speed;
        b.element.style.left = `${b.x}px`;
        b.element.style.top = `${b.y}px`;

        //despawn logic
        if (b.x > playableArea.clientWidth) {
            b.element.remove();
            activeBullets.splice(i, 1);
        }
    }
    //starts the loop
    requestAnimationFrame(update);
    
}


update();


