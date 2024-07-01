document.addEventListener('DOMContentLoaded', () => {
    const board = document.getElementById('board');
    const statusDisplay = document.getElementById('status');
    const restartButton = document.getElementById('restartButton');
    const backButton = document.getElementById('back');
    let gameState = ["", "", "", "", "", "", "", "", ""];
    let currentPlayer = "X";
    let isGameActive = true;
    let scoreX = 0;
    let scoreO = 0;

    // Get score elements
    const scoreXElement = document.getElementById('scoreX');
    const scoreOElement = document.getElementById('scoreO');

    // Winning combinations
    const winningConditions = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    // Handle cell click
    function handleCellClick(event) {
        const clickedCell = event.target;
        const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));

        if (gameState[clickedCellIndex] !== "" || !isGameActive) {
            return;
        }

        gameState[clickedCellIndex] = currentPlayer;
        clickedCell.textContent = currentPlayer;
        clickedCell.classList.add(currentPlayer);

        checkForWinner();

        if (isGameActive) {
            currentPlayer = currentPlayer === "X" ? "O" : "X";
            statusDisplay.textContent = `It's ${currentPlayer}'s turn`;

            if (currentPlayer === 'O') {
                setTimeout(makeAIMove, 500); // Delay for better user experience
            }
        }
    }

    // Check for winner
    function checkForWinner() {
        let roundWon = false;
        for (let i = 0; i < winningConditions.length; i++) {
            const [a, b, c] = winningConditions[i];
            if (gameState[a] === "" || gameState[b] === "" || gameState[c] === "") {
                continue;
            }
            if (gameState[a] === gameState[b] && gameState[b] === gameState[c]) {
                roundWon = true;
                break;
            }
        }

        if (roundWon) {
            statusDisplay.textContent = `Player ${currentPlayer} wins!`;
            isGameActive = false;
            if (currentPlayer === 'X') {
                scoreX++;
                scoreXElement.textContent = scoreX;
            } else {
                scoreO++;
                scoreOElement.textContent = scoreO;
            }


            return;
        }

        if (!gameState.includes("")) {
            statusDisplay.textContent = "It's a draw!";
            isGameActive = false;
            return;
        }
    }

    // Restart game
    function restartGame() {
        gameState = ["", "", "", "", "", "", "", "", ""];
        isGameActive = true;
        currentPlayer = "X";
        statusDisplay.textContent = `It's ${currentPlayer}'s turn`;

        document.querySelectorAll('.cell').forEach(cell => {
            cell.textContent = "";
            cell.classList.remove('X', 'O');
        });

        if (currentPlayer === 'O') {
            setTimeout(makeAIMove, 500); // Delay for better user experience
        }
    }

    // Handle back button click
    backButton.addEventListener('click', () => {
        scoreX = 0;
        scoreO = 0;
        scoreXElement.textContent = scoreX;
        scoreOElement.textContent = scoreO;
        history.back();
    });

    // AI opponent (basic random move)
    function makeAIMove() {
        // Check if computer can win in the next move
        for (let i = 0; i < gameState.length; i++) {
            if (gameState[i] === "") {
                gameState[i] = currentPlayer;
                if (isWinningMove(gameState, currentPlayer)) {
                    const cell = document.querySelector(`.cell[data-index='${i}']`);
                    cell.textContent = currentPlayer;
                    cell.classList.add(currentPlayer);
                    checkForWinner();
                    if (!isGameActive) return; // Check again after setting isGameActive to false
                    currentPlayer = currentPlayer === "X" ? "O" : "X"; // Switch currentPlayer
                    statusDisplay.textContent = `It's ${currentPlayer}'s turn`;
                    return;
                }
                gameState[i] = "";
            }
        }

        // Check if player can win in the next move and block
        const opponent = currentPlayer === "X" ? "O" : "X";
        for (let i = 0; i < gameState.length; i++) {
            if (gameState[i] === "") {
                gameState[i] = opponent;
                if (isWinningMove(gameState, opponent)) {
                    gameState[i] = currentPlayer;
                    const cell = document.querySelector(`.cell[data-index='${i}']`);
                    cell.textContent = currentPlayer;
                    cell.classList.add(currentPlayer);
                    checkForWinner();
                    if (!isGameActive) return; // Check again after setting isGameActive to false
                    currentPlayer = currentPlayer === "X" ? "O" : "X"; // Switch currentPlayer
                    statusDisplay.textContent = `It's ${currentPlayer}'s turn`;
                    return;
                }
                gameState[i] = "";
            }
        }

        // Otherwise, make a random move
        let availableCells = gameState
            .map((cell, index) => (cell === "" ? index : null))
            .filter(index => index !== null);

        if (availableCells.length === 0 || !isGameActive) return;

        const randomIndex = Math.floor(Math.random() * availableCells.length);
        const cellIndex = availableCells[randomIndex];
        gameState[cellIndex] = currentPlayer;
        const cell = document.querySelector(`.cell[data-index='${cellIndex}']`);
        cell.textContent = currentPlayer;
        cell.classList.add(currentPlayer);

        checkForWinner();
        if (!isGameActive) return; // Check again after setting isGameActive to false
        currentPlayer = currentPlayer === "X" ? "O" : "X"; // Switch currentPlayer
        statusDisplay.textContent = `It's ${currentPlayer}'s turn`;
    }

    // Function to check if a player has won
    function isWinningMove(currentGameState, player) {
        for (let i = 0; i < winningConditions.length; i++) {
            const [a, b, c] = winningConditions[i];
            if (currentGameState[a] === player && currentGameState[b] === player && currentGameState[c] === player) {
                return true;
            }
        }
        return false;
    }

    // Event listeners
    document.querySelectorAll('.cell').forEach(cell => cell.addEventListener('click', handleCellClick));
    restartButton.addEventListener('click', restartGame);

    // Initial status
    statusDisplay.textContent = `It's ${currentPlayer}'s turn`;
});
