let canvas, ctx, restartBtn, playBtn;
let skier, rocks, gameSpeed, gravity, score, gameOver, gameStarted = false;
let backgroundImg, skierImg, rockImg;

// Add this to your skiGame.js file to create a simple favicon programmatically
const link = document.createElement('link');
link.rel = 'icon';
link.type = 'image/x-icon';
link.href = 'data:image/x-icon;base64,AAABAAEAEBAAAAEAIABoBAAAFgAAACgAAAAQAAAAIAAAAAEAIAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA';
document.head.appendChild(link);

import GameMusicManager from './gameMusic.js';

// Create music manager instance
const musicManager = new GameMusicManager();

// Load images
function loadImages() {
    backgroundImg = new Image();
    backgroundImg.src = './assets/images/background.png'; // Your background image

    skierImg = new Image();
    skierImg.src = './assets/images/skier.png'; // Your skier image

    rockImg = new Image();
    rockImg.src = './assets/images/rock.png'; // Your rock image
}

// Initialize Game Variables
function initGame() {
    
    canvas = document.getElementById('skiGame');
    ctx = canvas.getContext('2d');
    restartBtn = document.getElementById('restartGame');
    playBtn = document.getElementById('playGame');

    skier = { x: 50, y: 350, width: 50, height: 50, isJumping: false, jumpHeight: 0, jumpVelocity: 12 };
    rocks = [];
    gameSpeed = 4;
    gravity = 0.5;
    score = 0;
    gameOver = false;

    restartBtn.style.display = 'none'; // Hide restart button initially
    musicManager.startGameMusic();
    updateGame(); // Start game loop
}

// Function to draw the background
function drawBackground() {
    ctx.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);
}

// Function to draw the skier
function drawSkier() {
    ctx.drawImage(skierImg, skier.x, skier.y - skier.jumpHeight, skier.width, skier.height);
}

// Function to draw rocks
function drawRocks() {
    for (let i = 0; i < rocks.length; i++) {
        ctx.drawImage(rockImg, rocks[i].x, rocks[i].y, rocks[i].width, rocks[i].height);
        rocks[i].x -= gameSpeed;
    }
}

// Jump function
function jump() {
    if (!skier.isJumping) {
        skier.isJumping = true;
        skier.jumpVelocity = 12; // Reduced jump velocity for a shorter jump
    }
}

// Update game state
function updateGame() {
    if (!gameStarted || gameOver) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background
    drawBackground();

    // Draw skier
    drawSkier();

    // Draw and move rocks
    drawRocks();

    // Skier jump logic
    if (skier.isJumping) {
        skier.jumpHeight += skier.jumpVelocity;
        skier.jumpVelocity -= gravity;

        if (skier.jumpHeight <= 0) {
            skier.jumpHeight = 0;
            skier.isJumping = false;
        }
    }

    // Spawn rocks less frequently
    if (Math.random() < 0.005) {
        rocks.push({ x: canvas.width, y: 350, width: 30, height: 30 }); // Smaller rocks
    }

    // Check collision with rocks
    for (let i = 0; i < rocks.length; i++) {
        if (
            rocks[i].x < skier.x + skier.width &&
            rocks[i].x + rocks[i].width > skier.x &&
            rocks[i].y < skier.y + skier.height - skier.jumpHeight &&
            rocks[i].y + rocks[i].height > skier.y - skier.jumpHeight
        ) {
            gameOver = true;
            alert('Game Over! You hit a rock.');
            restartBtn.style.display = 'block';
            musicManager.stopGameMusic();
            return;
        }

        // Remove rocks that move off screen
        if (rocks[i].x + rocks[i].width < 0) {
            rocks.splice(i, 1);
            score++;
        }
    }

    // Display score
    ctx.font = '20px Arial';
    ctx.fillStyle = 'black';
    ctx.fillText('Score: ' + score, 10, 30);

    // Continue game loop
    requestAnimationFrame(updateGame);
}

// Event listener for jump
document.addEventListener('keydown', function (event) {
    if (event.code === 'Space' && gameStarted && !gameOver) {
        jump();
    }
});

// Start Game when "Play Game" button is clicked
document.getElementById('playGame').addEventListener('click', function() {
    gameStarted = true;
    loadImages(); // Load images when the game starts
    initGame();
    this.style.display = 'none';
});

// Restart Game when "Restart Game" button is clicked
document.getElementById('restartGame').addEventListener('click', function() {
    gameStarted = true;
    initGame();
});