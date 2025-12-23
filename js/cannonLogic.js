var startingBulletSpeed = 5;
var startingSize = 1;
export var allCannons = [];

class cannon {
    constructor (side, index, size) {
        this.side = side;
        this.index = index;
        this.element = document.createElement('div');
        this.size = size;
        if(side == 'right' || side == 'bottom') {
            this.isFlipped = true;
        }
        else {
            this.isFlipped = false;
        }
        
    }

    fire(playableArea, activeBullets) {
        let cannonPosition = this.element.getBoundingClientRect();
        let areaRect = playableArea.getBoundingClientRect();

        let spawnPositionX = cannonPosition.left - areaRect.left;
        let spawnPositionY = cannonPosition.top - areaRect.top;


        var xVelocity;
        var yVelocity;


        //handle inital direction
        switch(this.side) {
            case ('cannonSidebarLeft'):
                xVelocity = 1 * startingBulletSpeed;
                yVelocity = 0;
                break;
            case ('cannonSidebarRight'):
                xVelocity = -1 * startingBulletSpeed;
                yVelocity = 0;
                break;
            case ('cannonSidebarTop'):
                xVelocity = 0;
                yVelocity = 1 * startingBulletSpeed;
                break;
            case ('cannonSidebarBottom'):
                xVelocity = 0;
                yVelocity = -1 * startingBulletSpeed;
                break;
        }

        let myBullet = new bullet(startingBulletSpeed, startingSize, xVelocity, yVelocity, spawnPositionX, spawnPositionY);

        //create the HTML element for it
        myBullet.element.classList.add('bullet');
        myBullet.element.style.position = 'absolute';

        //draw bullet
        myBullet.element.style.left = `${spawnPositionX}px`;
        myBullet.element.style.top = `${spawnPositionY}px`;

        playableArea.appendChild(myBullet.element);
        activeBullets.push(myBullet);
    }

}

class bullet {
    constructor (speed, size, xVelocity, yVelocity, startingX, startingY) {
        this.speed = speed;
        this.size = size;
        this.element = document.createElement('div');
        this.xVelocity = xVelocity;
        this.yVelocity = yVelocity;
        this.x = startingX;
        this.y = startingY;
        this.startingX = startingX;
        this.startingY = startingY;
    }

}

export function spawnCannons(count, size, sidebarId) {
    for(let i = 0; i<count; i ++) {
        let c = new cannon(sidebarId, i, size);
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
        let sidebar = document.getElementById(sidebarId);
        sidebar.appendChild(c.element);
        allCannons.push(c);
        if(sidebarId == 'cannonSidebarRight') {
            c.element.classList.add('cannonFlipped');
        }
        else {
            c.element.classList.add('cannon');
        }

    }
    
    //variables to work with each side
    var leftCannons = allCannons.filter(c => c.side === 'cannonSidebarLeft');
    var rightCannons = allCannons.filter(c => c.side === 'cannonSidebarRight');
    var topCannons = allCannons.filter(c => c.side === 'cannonSidebarTop');
    var bottomCannons = allCannons.filter(c => c.side === 'cannonSidebarBottom');
}

export function randomPattern(frameCount, activeBullets, playableArea, myPlayer) {
    //bullet logic (every 5 frames)
    if(frameCount % 5 == 0) {
        let randomCannonIndex = Math.floor(Math.random() * allCannons.length)
        let randomCannon = allCannons[randomCannonIndex];

        randomCannon.fire(playableArea, activeBullets);
    }

    for (let i = activeBullets.length - 1; i>=0; i--) {
        let b = activeBullets[i];

        //get the actual "Hitbox" rectangles from the DOM elements
        let playerRect = myPlayer.element.getBoundingClientRect()
        let bulletRect = b.element.getBoundingClientRect()


        //moveBullet
        b.x += b.xVelocity;
        b.y += b.yVelocity;
        b.element.style.left = `${b.x}px`;
        b.element.style.top = `${b.y}px`;

        //check collision first
        if(checkCollision(playerRect, bulletRect)) {
            myPlayer.onHit();
            // Remove bullet on collision
            b.element.remove();
            activeBullets.splice(i, 1);
            continue; // Skip despawn check since bullet is already removed
        }

        //despawn logic
        if(checkDespawn(b, playableArea, activeBullets)) {
            b.element.remove();
            activeBullets.splice(i, 1);
        }
    }


}

function checkDespawn(bullet, playableArea, activeBullets) {
    //if it leaves the right side
    if (bullet.x > playableArea.clientWidth || bullet.x < 0 || bullet.y > playableArea.clientHeight || bullet.y < 0) {
        return true;
    }
    return false;
}

export function checkCollision (obj1, obj2){
    return (
        obj1.left < obj2.right && 
        obj1.right > obj2.left &&
        obj1.top < obj2.bottom &&
        obj1.bottom > obj2.top
    );
}
