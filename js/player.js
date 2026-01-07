const playableArea = document.querySelector('.playableArea');



export class Player {

    constructor(speed, playableArea, onHit) {

        this.speed = speed;
        this.element = document.createElement('div');
        this.playableArea = playableArea;

        //this is a callback method
        this.onHit = onHit;

        //hit detection properties
        this.isHit = false;
        this.isInvincible = false;
        this.hitTimer = 0;
        this.invincibilityDuration = 500; // 1 second of invincibility
        this.flashDuration = 75; // 100ms red flash

        //rotation properties
        this.rotation = 0; // current rotation in degrees

        //trail properties
        this.trailParticles = [];
        this.trailSpawnRate = 2; // spawn a particle every N frames
        this.frameCounter = 0;
        this.isFocusMode = false;

        this.reset();
        this.create();
    }

    create() {
        this.element.classList.add('player');
        playableArea.appendChild(this.element);
    }

    reset() {
        this.x = this.playableArea.clientWidth/2;
        this.y = this.playableArea.clientWidth/2;
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

        //handle half speed and track focus mode
        this.isFocusMode = (key['Shift'] || key['shift']);
        const currentSpeed = this.isFocusMode ? this.speed / 2 : this.speed;
        // console.log(currentSpeed);

        //track movement direction
        let moveX = 0;
        let moveY = 0;

        if(key['w'] || key['ArrowUp']) {
            this.y -= currentSpeed;
            moveY = -1;
        }
        if(key['s'] || key['ArrowDown']) {
            this.y += currentSpeed;
            moveY = 1;
        }
        if(key['a'] || key['ArrowLeft']) {
            this.x -= currentSpeed;
            moveX = -1;
        }
        if(key['d'] || key['ArrowRight']) {
            this.x += currentSpeed;
            moveX = 1;
        }

        //update rotation based on movement direction
        if(moveX !== 0 || moveY !== 0) {
            //calculate angle in degrees (0 = right, 90 = down, 180 = left, 270 = up)
            //we need to adjust to make 0 = up
            const angleRad = Math.atan2(moveY, moveX);
            const angleDeg = angleRad * (180 / Math.PI);
            //rotate 90 degrees so up (moveY = -1, moveX = 0) is 0 degrees
            this.rotation = angleDeg + 90;
        }
    }
     
    spawnTrailParticle() {
        const particle = document.createElement('div');
        particle.classList.add('trailParticle');
        particle.style.left = `${this.x + this.element.offsetWidth / 2}px`;
        particle.style.top = `${this.y + this.element.offsetHeight / 2}px`;
        playableArea.appendChild(particle);

        const particleData = {
            element: particle,
            lifetime: 0,
            maxLifetime: 30 // frames
        };

        this.trailParticles.push(particleData);
    }

    updateTrail() {
        //update existing particles
        for (let i = this.trailParticles.length - 1; i >= 0; i--) {
            const particle = this.trailParticles[i];
            particle.lifetime++;

            //calculate fade based on lifetime
            const opacity = 1 - (particle.lifetime / particle.maxLifetime);
            particle.element.style.opacity = opacity;

            //remove particle if expired
            if (particle.lifetime >= particle.maxLifetime) {
                particle.element.remove();
                this.trailParticles.splice(i, 1);
            }
        }

        //spawn new particles when not in focus mode
        if (!this.isFocusMode) {
            this.frameCounter++;
            if (this.frameCounter >= this.trailSpawnRate) {
                this.spawnTrailParticle();
                this.frameCounter = 0;
            }
        } else {
            this.frameCounter = 0;
        }
    }

    draw () {
        this.element.style.top = `${this.y}px`;
        this.element.style.left = `${this.x}px`;
        this.element.style.transform = `rotate(${this.rotation}deg)`;

        //update trail particles
        this.updateTrail();

        //handle hit visual feedback
        if (this.isHit) {
            const timeSinceHit = Date.now() - this.hitTimer;

            if (timeSinceHit < this.flashDuration) {
                // Flash red during flash duration
                this.element.style.filter = 'brightness(2) saturate(2) hue-rotate(300deg)';
            } else if (timeSinceHit < this.invincibilityDuration) {
                // Still invincible but not flashing - return to normal
                this.element.style.filter = 'none';
            } else {
                // Invincibility expired - reset state
                this.isHit = false;
                this.isInvincible = false;
                this.element.style.filter = 'none';
            }
        }
    }

    hasCollided (bullet) {
        const playerHitbox = this.element.getBoundingClientRect();
        const hit = playerHitbox.left < bullet.right && 
            playerHitbox.right > bullet.left &&
            playerHitbox.top < bullet.bottom &&
            playerHitbox.bottom > bullet.top &&
            !this.isInvincible;

        if(hit) {
            this.onHit();
            this.isHit = true;
            this.isInvincible = true;
            
            //play damage effect
            const hitSound = new Audio('./assets/Damaged.mp3');
            hitSound.volume = 0.1;

            hitSound.play();
            
            this.hitTimer = Date.now();
        }


        return hit;
    }
}