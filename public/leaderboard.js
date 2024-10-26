// leaderboard.js

class LeaderboardManager {
    constructor() {
        this.scores = [];
        this.maxScores = 10;
        this.cookieName = 'skiGameLeaderboard';
        this.leaderboardElement = null;
        
        this.initialize();
    }

    initialize() {
        // Load scores from cookie
        this.loadScores();
        
        // Create leaderboard UI
        this.createLeaderboardUI();
        
        // Initial display
        this.updateLeaderboard();
    }

    createLeaderboardUI() {
        // Create container
        this.leaderboardElement = document.createElement('div');
        this.leaderboardElement.style.cssText = `
            position: absolute;
            right: 20px;
            top: 20px;
            background: rgba(255, 255, 255, 0.9);
            padding: 15px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            color: #333;
            min-width: 200px;
        `;

        // Add title
        const title = document.createElement('h3');
        title.textContent = 'Top 10 Scores';
        title.style.margin = '0 0 10px 0';
        this.leaderboardElement.appendChild(title);

        // Add scores list
        const scoresList = document.createElement('ol');
        scoresList.style.cssText = `
            margin: 0;
            padding-left: 20px;
            font-family: monospace;
        `;
        this.leaderboardElement.appendChild(scoresList);

        // Add to document
        document.body.appendChild(this.leaderboardElement);
    }

    loadScores() {
        const cookie = this.getCookie(this.cookieName);
        if (cookie) {
            try {
                this.scores = JSON.parse(cookie);
            } catch (e) {
                console.error('Error parsing leaderboard cookie:', e);
                this.scores = [];
            }
        }
    }

    saveScores() {
        // Sort scores in descending order
        this.scores.sort((a, b) => b.score - a.score);
        
        // Keep only top scores
        this.scores = this.scores.slice(0, this.maxScores);
        
        // Save to cookie (expires in 1 year)
        const expires = new Date();
        expires.setFullYear(expires.getFullYear() + 1);
        
        document.cookie = `${this.cookieName}=${JSON.stringify(this.scores)};expires=${expires.toUTCString()};path=/;SameSite=Strict`;
    }

    addScore(score) {
        const date = new Date();
        const formattedDate = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
        
        this.scores.push({
            score: score,
            date: formattedDate,
            time: date.getTime()
        });

        this.saveScores();
        this.updateLeaderboard();

        // Return position (1-based) or null if not in top 10
        const position = this.scores.findIndex(s => s.time === date.getTime()) + 1;
        return position <= this.maxScores ? position : null;
    }

    updateLeaderboard() {
        const scoresList = this.leaderboardElement.querySelector('ol');
        scoresList.innerHTML = '';

        this.scores.slice(0, this.maxScores).forEach((score, index) => {
            const li = document.createElement('li');
            li.style.marginBottom = '5px';
            li.innerHTML = `
                <span style="font-weight: bold">${score.score}</span>
                <span style="color: #666; font-size: 0.9em"> - ${score.date}</span>
            `;
            scoresList.appendChild(li);
        });

        if (this.scores.length === 0) {
            const li = document.createElement('li');
            li.textContent = 'No scores yet!';
            li.style.color = '#666';
            scoresList.appendChild(li);
        }
    }

    getCookie(name) {
        const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
        return match ? match[2] : null;
    }

    clearScores() {
        this.scores = [];
        document.cookie = `${this.cookieName}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
        this.updateLeaderboard();
    }
}

export default LeaderboardManager;