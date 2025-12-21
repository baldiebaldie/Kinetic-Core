var startingSpeed = 1;
var startingSize = 1;
var allCannons = [];

class cannon {
    constructor (side, index) {
        this.side = side;
        this.index = index;
        this.element = document.createElement('div');
        if(side == 'right' || side == 'bottom') {
            this.isFlipped = true;
        }
        this.isFlipped = false;
        
    }

    fire(playableArea) {
        myBullet = new bullet(startingSize, startingSpeed);
        myBullet.classList.add('bullet');
        playableArea.appendChild(myBullet);
        myBullet.element.style.position = 'absolute';
        activeBullets.push(myBullet);
    }

}

class bullet {
    constructor (speed, size) {
        this.speed = speed;
        this.size = size;
        this.element = document.createElement('div');
    }
}

export function spawnCannons(count, size, sidebarId) {
    for(let i = 0; i<count; i ++) {
        let c = new cannon(sidebarId, i)
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
}


export function checkCollision (obj1, obj2){
    return (
        obj1.left < obj2.right && 
        obj1.right > obj2.left &&
        obj1.top < obj2.bottom &&
        obj1.bottom > obj2.top
    );
}