export function spawnCannons(sidebarId, count, isFlipped){
    
    const cannonArea = document.getElementById(sidebarId);
    
    for(var i = 0; i<count; i++){
        const cannon = document.createElement('div');
            cannon.classList.add('cannon');
        
            if(isFlipped) {
                cannon.classList.add('cannonFlipped')
            }
            /*this switch case is meant to give each cannon a unique id
            which is later used for shooting patters. 
            */
            // switch(sidebarId){
            //     case ('cannonSidebarLeft'):
            //         cannon.dataset.index = i;
            //         break;
            //     case ('cannonSidebarRight'):
            //         cannon.dataset.index = (i+count);
            //         break;
            //     case ('cannonSidebarTop'):
            //         cannon.dataset.index = (i+(2*count));
            //         break;
            //     case ('cannonSidebarBottom'):
            //         cannon.dataset.index = (i+(3*count));
            //         break;

            // }
            cannonArea.appendChild(cannon);
    }
}


export function fireCannon(offset, playableArea, activeBullets) {
    const bullet = document.createElement('div');
    bullet.classList.add('bullet');
    
    playableArea.appendChild(bullet);
    bullet.style.position = 'absolute'; //ensures it can move

    const bulletData = {
        element: bullet,
        x: 0,
        y: offset,
        speed: 2
    }
    
    activeBullets.push(bulletData);
    
}

export function checkCollision (obj1, obj2){
    return (
        obj1.left < obj2.right && 
        obj1.right > obj2.left &&
        obj1.top < obj2.bottom &&
        obj1.bottom > obj2.top
    );
}