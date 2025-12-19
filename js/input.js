//list which keeps track of current buttons pressed
export const keyPressed = {};
//if button is pressed down, add to pressed list
window.addEventListener('keydown', event => {
    keyPressed[event.key.toLowerCase()] = true;
})
//if button is released, remove from pressed list
window.addEventListener('keyup', event => {
    keyPressed[event.key.toLowerCase()] = false;
})

