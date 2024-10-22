// gameMusic.js

class GameMusicManager {
    constructor() {
        this.backgroundMusic = null;
        this.isMusicPlaying = false;
        this.musicButton = null;
        
        this.initialize();
    }

    initialize() {
        // Create the music toggle button
        this.createMusicButton();
        
        // Initialize the audio
        this.backgroundMusic = new Audio();
        this.backgroundMusic.src = './assets/music/music.mp3'; // Replace with your music file
        this.backgroundMusic.loop = true;
        this.backgroundMusic.volume = 0.5;
    }

    createMusicButton() {
        this.musicButton = document.createElement('button');
        this.musicButton.textContent = '🔊 Toggle Music';
        this.musicButton.style.margin = '10px';
        this.musicButton.addEventListener('click', () => this.toggleMusic());
        
        // Insert button before the canvas
        const canvas = document.getElementById('skiGame');
        document.body.insertBefore(this.musicButton, canvas);
    }

    toggleMusic() {
        if (!this.isMusicPlaying) {
            this.playMusic();
        } else {
            this.pauseMusic();
        }
    }

    playMusic() {
        this.backgroundMusic.play().catch(error => {
            console.log("Audio play failed:", error);
        });
        this.isMusicPlaying = true;
        this.musicButton.textContent = '🔊 Toggle Music';
    }

    pauseMusic() {
        this.backgroundMusic.pause();
        this.isMusicPlaying = false;
        this.musicButton.textContent = '🔈 Toggle Music';
    }

    startGameMusic() {
        if (!this.isMusicPlaying) {
            this.playMusic();
        }
    }

    stopGameMusic() {
        if (this.isMusicPlaying) {
            this.pauseMusic();
        }
    }

    setVolume(volume) {
        if (volume >= 0 && volume <= 1) {
            this.backgroundMusic.volume = volume;
        }
    }

    // Clean up resources
    dispose() {
        if (this.backgroundMusic) {
            this.backgroundMusic.pause();
            this.backgroundMusic.src = '';
            this.backgroundMusic = null;
        }
        if (this.musicButton) {
            this.musicButton.remove();
        }
    }
}

// Export the class
export default GameMusicManager;