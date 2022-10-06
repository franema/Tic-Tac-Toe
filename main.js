const playerFactory = (selector, name) => {
    const getName = () => name
    const getSelector = () => selector
    return { getSelector, getName }
}

const gameboard = (() => {
    const $gameboardBoxes = document.querySelectorAll(".board-box")
    const selectedBoxes = []
    return { $gameboardBoxes, selectedBoxes }
})()

const manageGame = (() => {

    const $switch = document.querySelector(".switch-input")
    let humanPlayer
    let AIPlayer
    setSelector()
    let player = setFirstPlayer()

    const getAIPlayer = () => AIPlayer
    const getHumanPlayer = () => humanPlayer 
    const getPlayer = () => player

    const $restartButton = document.querySelector(".restart-button")
    //bind events
    $restartButton.addEventListener("click", start)
    $switch.addEventListener("change", start)

    function setSelector() {
        if ($switch.checked) {
            humanPlayer = playerFactory("O", "Human Player")
            AIPlayer = playerFactory("X", "AI player")
            player = setFirstPlayer()
            setNextPlay()
        } else {
            humanPlayer = playerFactory("X", "Human Player")
            AIPlayer = playerFactory("O", "AI player")
        }
    }

    function setFirstPlayer() {

        if (humanPlayer.getSelector() === "X") {
            return humanPlayer
        } else {
            return AIPlayer
        }
    }


    function start() {
        gameboard.$gameboardBoxes.forEach((box) => {
            box.textContent = ""
            box.classList.remove("disabled")
            box.style.color = "rgb(32, 22, 49)"
        })
        gameboard.selectedBoxes = []
        setSelector()
        player = setFirstPlayer()
        manageDisplay.showPlayersTurn()
    }

    function threeInRow(selected) {
        const row1 = selected.filter((box) => (box.id === "b1" || box.id === "b2" || box.id === "b3"))
        const row2 = selected.filter((box) => (box.id === "b4" || box.id === "b5" || box.id === "b6"))
        const row3 = selected.filter((box) => (box.id === "b7" || box.id === "b8" || box.id === "b9"))
        return row1.length === 3 || row2.length === 3 || row3.length === 3
    }

    function threeInColumn(selected) {
        const column1 = selected.filter((box) => (box.id === "b1" || box.id === "b4" || box.id === "b7"))
        const column2 = selected.filter((box) => (box.id === "b2" || box.id === "b5" || box.id === "b8"))
        const column3 = selected.filter((box) => (box.id === "b3" || box.id === "b6" || box.id === "b9"))
        return column1.length === 3 || column2.length === 3 || column3.length === 3
    }

    function threeInDiagonal(selected) {
        const diagonal1 = selected.filter((box) => (box.id === "b1" || box.id === "b5" || box.id === "b9"))
        const diagonal2 = selected.filter((box) => (box.id === "b3" || box.id === "b5" || box.id === "b7"))
        return diagonal1.length === 3 || diagonal2.length === 3
    }

    function checkIfWin() {
        const selected = gameboard.selectedBoxes.filter(box => box.textContent === player.getSelector())
        if (threeInRow(selected) || threeInColumn(selected) || threeInDiagonal(selected)) {
            gameboard.$gameboardBoxes.forEach((box) => {
                box.classList.add("disabled")
            })
            manageDisplay.showWinner()
        } else if (gameboard.selectedBoxes.length === 9) {
            manageDisplay.showDraw()
        } else {
            player = player === humanPlayer ? AIPlayer : humanPlayer
            manageDisplay.showPlayersTurn()
            setNextPlay()
        }

    }

    function setNextPlay() {
        if (player === AIPlayer) {
            const play = AIPlay.setPlay()
            setTimeout(() => {
                play.click()
            }, 1000)
        }
    }

    return { getPlayer, getAIPlayer, getHumanPlayer,checkIfWin }
})()



const manageDisplay = (() => {
    const $displayPlayer = document.querySelector(".player")

    //bind events
    gameboard.$gameboardBoxes.forEach((box) => {
        box.addEventListener("click", showInput)
    })

    function showInput(e) {
        if (!e.target.classList.value.includes("disabled")) {
            e.target.textContent = manageGame.getPlayer().getSelector()
            e.target.style.color = "rgb(147, 201, 171)"
            e.target.classList.add("disabled")
            gameboard.selectedBoxes.push(e.target)
            manageGame.checkIfWin()
        }

    }

    function showPlayersTurn() {
        $displayPlayer.textContent = `${manageGame.getPlayer().getName()} turn`
    }

    function showWinner() {
        $displayPlayer.textContent = `${manageGame.getPlayer().getName()} wins!!`
    }

    function showDraw() {
        $displayPlayer.textContent = `It's a draw!!`
    }

    showPlayersTurn()

    return { showPlayersTurn, showWinner, showDraw }
})()

const AIPlay = (() => {

    let board = [
        ['', '', ''],
        ['', '', ''],
        ['', '', '']
    ];


    function generateBoard() {
        counter = 0
        for (let i = 0; i < 3; i++) {
            board[i][0] = gameboard.$gameboardBoxes[counter].textContent
            board[i][1] = gameboard.$gameboardBoxes[counter + 1].textContent
            board[i][2] = gameboard.$gameboardBoxes[counter + 2].textContent
            counter += 3
        }
        return board
    }

    function setPlay() {
        board = generateBoard()
        bestMove = getBestMove(board)
        if (bestMove.i === 0) {
            return gameboard.$gameboardBoxes[bestMove.j]
        } else if (bestMove.i === 1) {
            return gameboard.$gameboardBoxes[bestMove.j + 3]
        } else {
            return gameboard.$gameboardBoxes[bestMove.j + 6]
        }

    }

    function getBestMove(board) {
        let bestScore = -1000
        let bestMove

        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (board[i][j] === "") {
                    board[i][j] = manageGame.getAIPlayer().getSelector()
                    let score = minimax(board, 0, false)
                    board[i][j] = ""
                    if (score > bestScore) {
                        bestScore = score
                        bestMove = { i, j }
                    }
                }
            }
        }
        return bestMove
    }

    function minimax(board, depth, isMaximizing) {

        let winner = checkMinimaxEnd(board)
        if (winner == manageGame.getHumanPlayer().getSelector()) {
            return -10
        } else if (winner == manageGame.getAIPlayer().getSelector()) {
            return 10
        } else if (winner == "tie") {
            return 0
        }

        if (isMaximizing) {
            let bestScore = -Infinity
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    if (board[i][j] == '') {
                        board[i][j] = manageGame.getAIPlayer().getSelector()
                        let score = minimax(board, depth + 1, false)
                        board[i][j] = ''
                        bestScore = Math.max(score, bestScore)
                    }
                }
            }
            return bestScore;
        } else {
            let bestScore = Infinity;
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    if (board[i][j] == '') {
                        board[i][j] = manageGame.getHumanPlayer().getSelector();
                        let score = minimax(board, depth + 1, true)
                        board[i][j] = ''
                        bestScore = Math.min(score, bestScore)
                    }
                }
            }
            return bestScore
        }
    }

    function checkMinimaxEnd(board) {
        let winner = null;

        // Horizontal
        for (let i = 0; i < 3; i++) {
            if (board[i][0] === board[i][1] && board[i][1] === board[i][2]) {
                winner = board[i][0]
            }
        }

        // Vertical
        for (let i = 0; i < 3; i++) {
            if (board[0][i] === board[1][i] && board[1][i] === board[2][i]) {
                winner = board[0][i]
            }
        }

        // Diagonal
        if (board[0][0] === board[1][1]  && board[1][1] === board[2][2]) {
            winner = board[0][0];
        }
        if (board[2][0] === board[1][1] && board[1][1] === board[0][2]) {
            winner = board[2][0];
        }

        let openSpots = 0;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (board[i][j] == '') {
                    openSpots++;
                }
            }
        }

        if (winner == null && openSpots == 0) {
            return 'tie';
        } else {
            return winner;
        }
    }
    return { setPlay }
})()


