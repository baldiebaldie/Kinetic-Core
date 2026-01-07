import { Bullet } from './bullet.js';

export class Cannon {
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

    fire(playableArea, activeBullets, externalBulletSpeed = null) {
        const bulletSpeed = externalBulletSpeed !== null ? externalBulletSpeed : startingBulletSpeed;
        let cannonPosition = this.element.getBoundingClientRect();
        let areaRect = playableArea.getBoundingClientRect();


        // console.log(cannonPosition.top , this.side);

        var xVelocity;
        var yVelocity;
        var bulletColor;
        var spawnPositionX;
        var spawnPositionY;

        // Bullet size from CSS (30px)
        const bulletSize = 30;
        const bulletHalfSize = bulletSize / 2;

        //handle inital direction
        switch(this.side) {
            case ('cannonSidebarLeft'):
                xVelocity = 1 * bulletSpeed;
                yVelocity = 0;
                spawnPositionX = cannonPosition.right - areaRect.left;
                spawnPositionY = cannonPosition.top - areaRect.top + (cannonPosition.height / 2) - bulletHalfSize;
                // console.log(spawnPositionX, spawnPositionY, this.side);
                // bulletColor = 'red';
                break;
            case ('cannonSidebarRight'):
                xVelocity = -1 * bulletSpeed;
                yVelocity = 0;
                spawnPositionX = cannonPosition.left - areaRect.left - bulletSize;
                spawnPositionY = cannonPosition.top - areaRect.top + (cannonPosition.height / 2) - bulletHalfSize;
                // console.log(spawnPositionX, spawnPositionY, this.side);
                // bulletColor = 'blue';
                break;
            case ('cannonSidebarTop'):
                xVelocity = 0;
                yVelocity = 1 * bulletSpeed;
                spawnPositionX = cannonPosition.left - areaRect.left + (cannonPosition.width / 2) - bulletHalfSize;
                spawnPositionY = cannonPosition.bottom - areaRect.top;
                // console.log(spawnPositionX, spawnPositionY, this.side);
                // bulletColor = 'green';
                break;
            case ('cannonSidebarBottom'):
                xVelocity = 0;
                yVelocity = -1 * bulletSpeed;
                spawnPositionX = cannonPosition.left - areaRect.left + (cannonPosition.width / 2) - bulletHalfSize;
                spawnPositionY = cannonPosition.top - areaRect.top - bulletSize;
                // console.log(spawnPositionX, spawnPositionY, this.side);
                // bulletColor = 'purple';
                break;
        }
        
        const startingSize = 1;
        let myBullet = new Bullet(bulletSpeed, startingSize, xVelocity, yVelocity, spawnPositionX, spawnPositionY, bulletColor);

        //create the HTML element for it
        myBullet.element.classList.add('bullet');
        myBullet.element.style.position = 'absolute';
        myBullet.element.style.backgroundColor = bulletColor;

        playableArea.appendChild(myBullet.element);
        activeBullets.push(myBullet);
    }

}

