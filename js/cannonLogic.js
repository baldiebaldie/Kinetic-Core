import { Cannon } from './cannon.js';


export let startingBulletSpeed = 1;
var startingSize = 1;
export var allCannons = [];


export function spawnCannons(count, size, sidebarId) {
    //calculate sizing based on cannon count
    const baseCannonSize = 75;
    const baseGap = 15;
    const playableAreaSize = 750;

    //use playable area as strict limit to prevent dangling cannons
    const availableSpace = playableAreaSize;

    //calculate total space needed with base values
    const totalSpaceNeeded = (count * baseCannonSize) + ((count - 1) * baseGap);

    //scale factor to fit cannons into available space
    const scaleFactor = Math.min(1, availableSpace / totalSpaceNeeded);

    //apply scale factor to both size and gap
    const cannonSize = Math.floor(baseCannonSize * scaleFactor);
    const gap = Math.floor(baseGap * scaleFactor);

    //apply the dynamic gap to the sidebar
    let sidebar = document.getElementById(sidebarId);
    sidebar.style.gap = `${gap}px`;

    for(let i = 0; i<count; i ++) {
        let c = new Cannon(sidebarId, i, size);
        switch (sidebarId) {
            case ('cannonSidebarLeft'):
                c.index = i;
                break;
            case ('cannonSidebarRight'):
                c.index = (i+count);
                break;
            case ('cannonSidebarTop'):
                c.index = (i+(2*count));
                break;
            case ('cannonSidebarBottom'):
                c.index = (i+(3*count));
                break;
        }
        sidebar.appendChild(c.element);
        allCannons.push(c);
        if(sidebarId == 'cannonSidebarRight') {
            c.element.classList.add('cannonFlipped');
        }
        else {
            c.element.classList.add('cannon');
        }

        // Apply dynamic size to each cannon
        c.element.style.width = `${cannonSize}px`;
        c.element.style.height = `${cannonSize}px`;

    }
    
    //variables to work with each side
    var leftCannons = allCannons.filter(c => c.side === 'cannonSidebarLeft');
    var rightCannons = allCannons.filter(c => c.side === 'cannonSidebarRight');
    var topCannons = allCannons.filter(c => c.side === 'cannonSidebarTop');
    var bottomCannons = allCannons.filter(c => c.side === 'cannonSidebarBottom');
}

export function randomPattern(frameCount, activeBullets, playableArea, myPlayer, fireRate = 100, bulletSpeed = 1, spawnsPerTick = 1) {
    //bullet logic (every x frames)
    if(frameCount % fireRate == 0) {
        //spawn multiple bullets based on spawnsPerTick
        //track which cannons have fired this tick to prevent overlapping bullets
        let firedCannonIndices = new Set();

        for(let i = 0; i < spawnsPerTick; i++) {
            //ensure we don't select the same cannon twice in one tick
            let randomCannonIndex;
            let attempts = 0;
            do {
                randomCannonIndex = Math.floor(Math.random() * allCannons.length);
                attempts++;
                //if we've tried too many times, break to avoid infinite loop
                if(attempts > allCannons.length * 2) break;
            } while(firedCannonIndices.has(randomCannonIndex));

            //mark this cannon as fired
            firedCannonIndices.add(randomCannonIndex);
            let randomCannon = allCannons[randomCannonIndex];

            randomCannon.fire(playableArea, activeBullets, bulletSpeed);
        }
        // console.log(randomCannon);
    }

    for (let i = activeBullets.length - 1; i>=0; i--) {
        let b = activeBullets[i];

        //moveBullet
        b.x += b.xVelocity;
        b.y += b.yVelocity;
        b.element.style.left = `${b.x}px`;
        b.element.style.top = `${b.y}px`;
        
        //get the actual "Hitbox" rectangles from the DOM elements
        let bulletRect = b.element.getBoundingClientRect()

        //check collision first
        const hit = myPlayer.hasCollided(bulletRect);
    
        const outOfBounds = checkDespawn(b, playableArea)
        //despawn logic
        if(hit || outOfBounds) {
            b.element.remove();
            activeBullets.splice(i, 1);
        }
        
    }
}

function checkDespawn(bullet, playableArea) {
    //if it leaves the right side
    if (bullet.x > playableArea.clientWidth || bullet.x < 0 || bullet.y > playableArea.clientHeight || bullet.y < 0) {
        return true;
    }
    return false;
}

function handleFire () {
    
}