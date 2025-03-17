const cells = document.querySelectorAll('.cell')
const titleHeader = document.querySelector('#titleHeader')
const xPlayerDisplay = document.querySelector('#xPlayerDisplay')
const oPlayerDisplay = document.querySelector('#oPlayerDisplay')
const restartBtn = document.querySelector('#restartBtn')

// Initialize variables for the game
let player = 'X'
let isPauseGame = false //Used to pause the game when a player wins or the game is reset.
let isGameStart = false //Indicates whether the game has started or not (can be useful for tracking game state)

// Array of win conditions
//Represents the Tic-Tac-Toe board as an array of 9 empty strings ('')
//Each index corresponds to a cell in the grid (0-8)
//When a player makes a move, their symbol ('X' or 'O') is placed in the corresponding index
const inputCells = ['', '', '',
                    '', '', '',
                    '', '', '']

// Array of win conditions
//Defines all possible ways to win in Tic-Tac-Toe.
// Example: If inputCells[0], inputCells[1], and inputCells[2] all contain 'X', player X wins.
const winConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6] // Diagonals
]

// Add click event listeners to each cell
cells.forEach((cell, index) => {
    cell.addEventListener('click', () => tapCell(cell, index))
})

function tapCell(cell, index) {
    // Ensure cell is empty and game isn't paused
    if (cell.textContent == '' && !isPauseGame ) {
        isGameStart = true  // Mark that the game has started
        updateCell(cell, index)// Update the board with player's move

        // Do a random pick if there are no results
        if (!checkWinner()) {
            changePlayer() // Change from 'X' to 'O' or vice versa
            randomPick() // Let the computer pick a move
        }
    }
}

function updateCell(cell, index) {
    cell.textContent = player
    inputCells[index] = player
    cell.style.color = (player == 'X') ? '#1892EA' : '#A737FF'
}

function changePlayer() {
    player = (player == 'X') ? 'O' : 'X' // Simply toggles the player between 'X' and 'O'.
}

function randomPick() {
    // Pause the game to allow Computer to pick
    isPauseGame = true

    setTimeout(() => {
        let randomIndex
        do {
            // Pick a random index
            randomIndex = Math.floor(Math.random() * inputCells.length)
        } while (
            // Ensure the chosen cell is empty
            inputCells[randomIndex] != ''
        )

        // Update the cell with Computer move
        updateCell(cells[randomIndex], randomIndex, player)
        // Check if Computer not won
        if (!checkWinner()) {
            changePlayer()
            // Swith back to Human player
            isPauseGame = false
            return
        }
        player = (player == 'X') ? 'O' : 'X'
    }, 1000) // Delay Computer move by 1 second
}

function checkWinner() {
    for (const [a, b, c] of winConditions) {
        // Check each winning condition
        // Loops through all possible winning combinations
        if (inputCells[a] == player &&
            inputCells[b] == player &&
            inputCells[c] == player
        ) {
            // If three matching cells belong to the same player (X or O
            declareWinner([a, b, c])
            return true
        }
    }
    
    //If all cells are filled but no winner
    // Check for a draw (if all cells are filled)
    if (inputCells.every(cell => cell != '')) {
        declareDraw()
        return true
    }
}

function declareWinner(winningIndices) {
    titleHeader.textContent = `${player} Win`
    isPauseGame = true

    // Highlight winning cells
    winningIndices.forEach((index) =>
        cells[index].style.background = '#2A2343'
    )

    restartBtn.style.visibility = 'visible'
}

function declareDraw() {
    titleHeader.textContent = 'Draw!'
    isPauseGame = true
    restartBtn.style.visibility = 'visible'
}

function choosePlayer(selectedPlayer) {
    // Ensure the game hasn't started
    if (!isGameStart) {
        // Override the selected player value
        player = selectedPlayer
        if (player == 'X') {
            // Hightlight X display
            xPlayerDisplay.classList.add('player-active')
            oPlayerDisplay.classList.remove('player-active')
        } else {
            // Hightlight O display
            xPlayerDisplay.classList.remove('player-active')
            oPlayerDisplay.classList.add('player-active')
        }
    }
}

restartBtn.addEventListener('click', () => {
    restartBtn.style.visibility = 'hidden'
    inputCells.fill('')
    cells.forEach(cell => {
        cell.textContent = ''
        cell.style.background = ''
    })
    isPauseGame = false
    isGameStart = false
    titleHeader.textContent = 'Choose'
})
