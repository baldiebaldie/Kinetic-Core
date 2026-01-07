//main.js
import { keyPressed } from './input.js';
import { spawnCannons, randomPattern, allCannons} from './cannonLogic.js';
import { initializeControlPanel } from './controlPanel.js';
import { player } from './player.js';


const playableArea = document.querySelector('.playableArea');
const heartsContainer = document.getElementById('heartsContainer');
const gameOverDisplay = document.getElementById('gameOverDisplay');

//variables
var frameCount = 0;
var cannonSize = 1;
let activeBullets = [];
let maxLives = 3; //adjust this value to change starting lives
let lives = maxLives;
let gameOver = false;
let score = 0;

const gameConfig = {
    playerSpeed: 3,
    bulletSpeed: 1,
    fireRate: 100,
    cannonCount: 15,
    onCannonCountChange: null
};

//scoring system
const basePointsPerFrame = 1;

//calculate difficulty multiplier based on game settings
function calculateDifficultyMultiplier() {
    //lower player speed = higher multiplier
    const playerSpeedFactor = 10 / gameConfig.playerSpeed;

    //higher bullet speed = higher multiplier
    const bulletSpeedFactor = gameConfig.bulletSpeed;

    //higher fire rate = higher multiplier 
    const fireRateFactor = 150 / gameConfig.fireRate;

    //higher cannon count = higher multiplier
    const cannonCountFactor = gameConfig.cannonCount / 10;

    //combine all factors with weights
    const multiplier = (
        playerSpeedFactor * 0.3 +
        bulletSpeedFactor * 0.2 +
        fireRateFactor * 0.25 +
        cannonCountFactor * 0.25
    );

    return multiplier;
}

//calculate points to award this frame
function calculatePointsThisFrame() {
    const difficultyMultiplier = calculateDifficultyMultiplier();
    return basePointsPerFrame * difficultyMultiplier;
}

//update score display
function updateScoreDisplay() {
    const scoreDisplay = document.getElementById('scoreDisplay');
    if (scoreDisplay) {
        scoreDisplay.textContent = `Score: ${Math.floor(score)}`;
    }
}

//initialize hearts display
function initializeLivesDisplay() {
    for (let i = 0; i < maxLives; i++) {
        const heart = document.createElement('img');
        heart.src = 'assets/heart.png';
        heart.classList.add('heart');
        heartsContainer.appendChild(heart);
    }
}

//update lives display
function updateLivesDisplay() {
    const hearts = heartsContainer.querySelectorAll('.heart');
    hearts.forEach((heart, index) => {
        heart.classList.toggle('hidden', index >= lives);
    });

    if (lives <= 0 && !gameOver) {
        gameOver = true;
        gameOverDisplay.style.display = 'flex';
        myPlayer.reset();
        // clearScreen();
    }
}



//initialize cannons
spawnCannons(gameConfig.cannonCount, cannonSize, 'cannonSidebarLeft');
spawnCannons(gameConfig.cannonCount, cannonSize, 'cannonSidebarRight');
spawnCannons(gameConfig.cannonCount, cannonSize, 'cannonSidebarTop');
spawnCannons(gameConfig.cannonCount, cannonSize, 'cannonSidebarBottom');

console.log(allCannons);

//initialize control panel
const controlPanel = initializeControlPanel(gameConfig);

//setup cannon respawn callback
gameConfig.onCannonCountChange = (newCount) => {
    respawnCannons(newCount, cannonSize);
};

//cannon respawn function
function respawnCannons(newCount, size) {
    const sidebars = ['cannonSidebarLeft', 'cannonSidebarRight', 'cannonSidebarTop', 'cannonSidebarBottom'];

    //clear existing cannons
    sidebars.forEach(sidebarId => {
        const sidebar = document.getElementById(sidebarId);
        sidebar.innerHTML = '';
    });
    allCannons.length = 0;

    //respawn with new count
    sidebars.forEach(sidebarId => {
        spawnCannons(newCount, size, sidebarId);
    });
}

//create the player
const myPlayer = new player(gameConfig.playerSpeed, playableArea, handleLives);

//initialize lives display
initializeLivesDisplay();

//function which updates each frame
function update() {
    myPlayer.speed = gameConfig.playerSpeed;
    myPlayer.handleInput(keyPressed);
    myPlayer.calculateBounds();
    if(!gameOver) {
        myPlayer.draw();
        randomPattern(frameCount, activeBullets, playableArea, myPlayer, gameConfig.fireRate, gameConfig.bulletSpeed);

        //add points based on difficulty
        score += calculatePointsThisFrame();
        updateScoreDisplay();
    }

    //random cannon shooting pattern
    frameCount++;

    //starts the loop
    requestAnimationFrame(update);

    // console.log(myPlayer.x , myPlayer.y);
}



function clearScreen() {
    score = 0;
    updateScoreDisplay();
}

function handleLives() {
    lives -= 1;
    console.log(`Lives remaining: ${lives}`);
    updateLivesDisplay();
}

update();


