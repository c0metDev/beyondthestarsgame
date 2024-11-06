class SpaceSnakesLadders {
    constructor() {
        this.BOARD_SIZE = 100;
        this.PORTALS = {
            // Wormholes (move forward)
            4: 14, 9: 31, 20: 38, 28: 44, 40: 59, 51: 67, 63: 81, 71: 91,
            // Black holes (move backward)
            17: 7, 54: 34, 62: 19, 64: 60, 87: 24, 93: 73, 95: 75, 99: 78
        };
        
        this.currentPlayer = 'player';
        this.positions = { player: 0, computer: 0 };
        this.gameOver = false;
        
        this.initializeDOM();
        this.setupEventListeners();
        this.createBoard();
        this.updateBoard();
    }

    initializeDOM() {
        this.boardElement = document.getElementById('board');
        this.messageElement = document.getElementById('message');
        this.currentPlayerElement = document.getElementById('currentPlayer');
        this.diceValueElement = document.getElementById('diceValue');
        this.rollButton = document.getElementById('rollButton');
        this.resetButton = document.getElementById('resetButton');
    }

    setupEventListeners() {
        this.rollButton.addEventListener('click', () => this.playerTurn());
        this.resetButton.addEventListener('click', () => this.resetGame());
    }

    createBoard() {
        this.boardElement.innerHTML = '';
        for (let i = this.BOARD_SIZE - 1; i >= 0; i--) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            
            const number = document.createElement('span');
            number.className = 'cell-number';
            number.textContent = i + 1;
            cell.appendChild(number);
            
            if (this.PORTALS[i + 1]) {
                cell.classList.add(this.PORTALS[i + 1] > i + 1 ? 'wormhole' : 'blackhole');
            }
            
            this.boardElement.appendChild(cell);
        }
    }

    updateBoard() {
        const existingTokens = document.querySelectorAll('.player-token');
        existingTokens.forEach(token => token.remove());
        
        Object.entries(this.positions).forEach(([player, position]) => {
            if (position >= 0 && position < this.BOARD_SIZE) {
                const cell = this.boardElement.children[this.BOARD_SIZE - 1 - position];
                const token = document.createElement('div');
                token.className = `player-token ${player}`;
                cell.appendChild(token);
            }
        });
    }

    async rollDice() {
        // Animate dice roll
        for (let i = 0; i < 10; i++) {
            this.diceValueElement.textContent = Math.floor(Math.random() * 6) + 1;
            await new Promise(resolve => setTimeout(resolve, 50));
        }
        
        const roll = Math.floor(Math.random() * 6) + 1;
        this.diceValueElement.textContent = roll;
        return roll;
    }

    async playerTurn() {
        if (this.gameOver) return;
        
        this.rollButton.disabled = true;
        const roll = await this.rollDice();
        await this.movePlayer('player', roll);
        
        if (!this.gameOver) {
            await new Promise(resolve => setTimeout(resolve, 1000));
            await this.computerTurn();
        }
        
        this.rollButton.disabled = false;
    }

    async computerTurn() {
        this.currentPlayerElement.textContent = "Computer's Turn";
        const roll = await this.rollDice();
        await this.movePlayer('computer', roll);
        
        if (!this.gameOver) {
            this.currentPlayerElement.textContent = "Your Turn";
        }
    }

    async movePlayer(player, spaces) {
        let newPosition = this.positions[player] + spaces;
        const playerName = player === 'player' ? 'You' : 'Computer';
        
        this.showMessage(`${playerName} rolled a ${spaces}`);
        
        if (newPosition >= this.BOARD_SIZE - 1) {
            this.gameOver = true;
            this.positions[player] = this.BOARD_SIZE - 1;
            this.updateBoard();
            this.showMessage(`${playerName} win! 🎉`);
            return;
        }
        
        if (this.PORTALS[newPosition + 1]) {
            this.positions[player] = newPosition;
            this.updateBoard();
            
            const isWormhole = this.PORTALS[newPosition + 1] > newPosition + 1;
            await new Promise(resolve => setTimeout(resolve, 500));
            
            this.showMessage(isWormhole ? 
                `${playerName} found a wormhole! Jumping ahead! 🌀` : 
                `Oh no! ${playerName} got pulled into a black hole! ⚫`
            );
            
            await new Promise(resolve => setTimeout(resolve, 1000));
            newPosition = this.PORTALS[newPosition + 1] - 1;
        }
        
        this.positions[player] = newPosition;
        this.updateBoard();
    }

    showMessage(text) {
        this.messageElement.textContent = text;
        this.messageElement.classList.add('shake');
        setTimeout(() => this.messageElement.classList.remove('shake'), 500);
    }

    resetGame() {
        this.currentPlayer = 'player';
        this.positions = { player: 0, computer: 0 };
        this.gameOver = false;
        this.diceValueElement.textContent = '🎲';
        this.currentPlayerElement.textContent = "Your Turn";
        this.messageElement.textContent = '';
        this.rollButton.disabled = false;
        this.updateBoard();
    }
}

const game = new SpaceSnakesLadders();
