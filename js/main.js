// main.js
import { keyPressed } from './input.js';
import { spawnCannons, checkCollision, fireCannon } from './cannonLogic.js';

const player = document.getElementById('player');
const playableArea = document.querySelector('.playableArea');


//variables
let topPosition = 50;
let leftPosition = 50;
var speed = 3;
var cannonAmount = 11;
let activeBullets = [];


//calculate player bounds
const maxX = playableArea.clientWidth - player.offsetWidth;
const maxY = playableArea.clientHeight - player.offsetHeight;

//initialize cannons
spawnCannons('cannonSidebarLeft', cannonAmount, false);
spawnCannons('cannonSidebarRight', cannonAmount, true);
spawnCannons('cannonSidebarTop', cannonAmount, true);
spawnCannons('cannonSidebarBottom', cannonAmount, true);



//testing shooting
for(let i = 0; i<cannonAmount; i++) {
    var tmp = 50;
    tmp+=50;
    fireCannon(i * 65 + 30, playableArea, activeBullets);
}


//function which updates each frame
function update() {
    if(keyPressed['w']) {
        topPosition -= speed;
    }
    if(keyPressed['s']) {
        topPosition += speed;
    }
    if(keyPressed['a']) {
        leftPosition -= speed;
    }
    if(keyPressed['d']) {
        leftPosition += speed;
    }

    //BORDER LOGIC
    //hit the bottom, then set position to bottom border so it cannot go past
    if(leftPosition < 0) {
        leftPosition = 0;
    }

    if(leftPosition > maxX) {
        leftPosition = maxX;
    }

    if(topPosition < 0) {
        topPosition = 0;
    }
    //if the bottom hits the right border set it to the border
    if(topPosition > maxY) {
        topPosition = maxY;
    }


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

    //udpate the actual div element
    player.style.top = `${topPosition}px`;
    player.style.left = `${leftPosition}px`;


    //check player collision logic
    // const currentSpikeLocation = spike.getBoundingClientRect();
    // const currentplayerLocation = player.getBoundingClientRect();

    // if (checkCollision(currentSpikeLocation, currentplayerLocation)) {
    //     console.log("hit");
    //     player.style.backgroundColor = 'white';
    // }

    //starts the loop
    requestAnimationFrame(update);
    
}


update();


