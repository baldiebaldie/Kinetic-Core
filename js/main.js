/**
 * Kinetic Core
 * Author: Bryan Baldie.
 * Version: 1.0.0
 */

//main.js

import { keyPressed } from './input.js';
import { spawnCannons, randomPattern, allCannons} from './cannonLogic.js';
import { initializeControlPanel } from './controlPanel.js';
import { player } from './player.js';

//signiture

console.log(
  "%c Kinetic Core %c Built by Bryan Baldie %c",
  "background: #222; color: #bada55; padding: 5px; font-weight: bold;",
  "background: #333; color: #fff; padding: 5px;",
  "background: transparent;"
);

const playableArea = document.querySelector('.playableArea');
const heartsContainer = document.getElementById('heartsContainer');
const gameOverDisplay = document.getElementById('gameOverDisplay');
const backgroundMusic = document.getElementById('backgroundMusic');

//localStorage functions for high score persistence
function saveHighScore(score) {
    localStorage.setItem('bulletHellHighScore', score.toString());
}

function loadHighScore() {
    const saved = localStorage.getItem('bulletHellHighScore');
    return saved ? parseInt(saved, 10) : 0;
}

function clearHighScore() {
    const confirmed = confirm('Are you sure you want to clear your high score? This cannot be undone.');
    if (confirmed) {
        localStorage.removeItem('bulletHellHighScore');
        highScore = 0;
        updateHighScoreDisplay();
        alert('High score cleared!');
    }
}

//variables
var frameCount = 0;
var cannonSize = 1;
let activeBullets = [];
let maxLives = 3; //adjust this value to change starting lives
let lives = maxLives;
let gameOver = false;
let score = 0;
let highScore = loadHighScore();

const gameConfig = {
    playerSpeed: 3,
    bulletSpeed: 1,
    fireRate: 100,
    cannonCount: 9,
    spawnsPerTick: 1,
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

    //higher spawns per tick = higher multiplier
    const spawnsPerTickFactor = gameConfig.spawnsPerTick;

    //combine all factors with weights
    const multiplier = (
        playerSpeedFactor * 0.25 +
        bulletSpeedFactor * 0.15 +
        fireRateFactor * 0.2 +
        cannonCountFactor * 0.2 +
        spawnsPerTickFactor * 0.2
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

//update high score display
function updateHighScoreDisplay() {
    const highScoreDisplay = document.getElementById('highScoreDisplay');
    if (highScoreDisplay) {
        highScoreDisplay.textContent = `High Score: ${Math.floor(highScore)}`;
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
        //update high score if current score is higher
        if (score > highScore) {
            highScore = score;
            saveHighScore(highScore);
            updateHighScoreDisplay();
        }
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

// console.log(allCannons);

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

//initialize high score display
updateHighScoreDisplay();

//setup background music
if (backgroundMusic) {
    backgroundMusic.volume = 0.5; // Set to half volume

    // Start at a random position in the song
    backgroundMusic.addEventListener('loadedmetadata', () => {
        const randomStart = Math.random() * backgroundMusic.duration;
        backgroundMusic.currentTime = randomStart;
    });

    backgroundMusic.play().catch(error => {
        console.log('Background music autoplay prevented:', error);
        // Music will start on first user interaction
        document.addEventListener('click', () => {
            backgroundMusic.play();
        }, { once: true });
    });
}

//setup play again button
const playAgainButton = document.getElementById('playAgainButton');
if (playAgainButton) {
    playAgainButton.addEventListener('click', resetGame);
}

//setup clear high score button
const clearHighScoreButton = document.getElementById('clearHighScoreButton');
if (clearHighScoreButton) {
    clearHighScoreButton.addEventListener('click', clearHighScore);
}

//function which updates each frame
function update() {
    myPlayer.speed = gameConfig.playerSpeed;
    myPlayer.handleInput(keyPressed);
    myPlayer.calculateBounds();
    if(!gameOver) {
        myPlayer.draw();
        randomPattern(frameCount, activeBullets, playableArea, myPlayer, gameConfig.fireRate, gameConfig.bulletSpeed, gameConfig.spawnsPerTick);

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
    //clear bullets
    activeBullets.forEach(bullet => {
        if (bullet.element && bullet.element.parentNode) {
            bullet.element.parentNode.removeChild(bullet.element);
        }
    });
    activeBullets.length = 0;
}

function resetGame() {
    //reset game state
    gameOver = false;
    lives = maxLives;
    score = 0;
    frameCount = 0;

    //clear screen
    clearScreen();

    //reset player position
    myPlayer.reset();

    //update displays
    updateLivesDisplay();
    updateScoreDisplay();
    updateHighScoreDisplay();

    //hide game over display
    gameOverDisplay.style.display = 'none';
}

function handleLives() {
    lives -= 1;
    // console.log(`Lives remaining: ${lives}`);
    updateLivesDisplay();
}

update();


