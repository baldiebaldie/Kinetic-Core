/**
 * @type 
 */

const player = document.getElementById('player');
const spike = document.getElementById('spike');
const cannons = [

];

let topPosition = 50;
let leftPosition = 50;
var speed = 1;
var cannonAmount = 11;


//list which keeps track of current buttons pressed
const keyPressed = {};
//if button is pressed down, add to pressed list
window.addEventListener('keydown', event => {
    keyPressed[event.key.toLowerCase()] = true;
})
//if button is released, remove from pressed list
window.addEventListener('keyup', event => {
    keyPressed[event.key.toLowerCase()] = false;
})

function spawnCannons(sidebarId, count, isFlipped){
    
    const cannonArea = document.getElementById(sidebarId);
    
    for(var i = 0; i<count; i++){
        const cannon = document.createElement('div');
            cannon.classList.add('cannon');
        
            if(isFlipped) {
                cannon.classList.add('cannonFlipped')
            }
            cannonArea.appendChild(cannon);
    }
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



    //udpate the actual div element
    player.style.top = `${topPosition}px`;
    player.style.left = `${leftPosition}px`;


    //check player collision logic
    const currentSpikeLocation = spike.getBoundingClientRect();
    const currentplayerLocation = player.getBoundingClientRect();
    if (checkCollision(currentSpikeLocation, currentplayerLocation)) {
        console.log("hit");
        player.style.backgroundColor = 'white';
    }

    //starts the loop
    requestAnimationFrame(update);
    // console.log("hello");
    
}

function checkCollision (obj1, obj2){
    return (
        obj1.left < obj2.right && 
        obj1.right > obj2.left &&
        obj1.top < obj2.bottom &&
        obj1.bottom > obj2.top
    );
}

update();
spawnCannons('cannonSidebarLeft', cannonAmount, false);
spawnCannons('cannonSidebarRight', cannonAmount, true);
spawnCannons('cannonSidebarTop', cannonAmount, true);
spawnCannons('cannonSidebarBottom', cannonAmount, true);
