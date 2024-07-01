document.addEventListener('DOMContentLoaded', () => {
    const board = document.getElementById('board');
    const statusDisplay = document.getElementById('status');
    const restartButton = document.getElementById('restartButton');
    const backButton = document.getElementById('back');
    let gameState = ["", "", "", "", "", "", "", "", ""];
    let currentPlayer = "X";
    let isGameActive = true;

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
    }

    // Handle back button click
    backButton.addEventListener('click', () => {
        history.back();
    });

    // Event listeners
    document.querySelectorAll('.cell').forEach(cell => cell.addEventListener('click', handleCellClick));
    restartButton.addEventListener('click', restartGame);

    // Initial status
    statusDisplay.textContent = `It's ${currentPlayer}'s turn`;
});
