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

    return { getPlayer, checkIfWin, threeInColumn, threeInDiagonal, threeInRow }
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

    let depth = -2

    function searchAvailableBoxes(gameboardBoxes) {
        return gameboardBoxes.filter(box => !Array.from(gameboard.selectedBoxes).includes(box))
    }

    function setPlay() {
        depth = -2
        const gameboardBoxes = Array.from(gameboard.$gameboardBoxes)
        const availableBoxes = searchAvailableBoxes(gameboardBoxes)
        const randomBox = Math.floor(Math.random() * availableBoxes.length)

        return getBestMove(availableBoxes) || availableBoxes[randomBox]
    }

    function getBestMove(availableBoxes) {
        let bestMove
        for (let i = 0; i < availableBoxes.length; i++) {
            bestMove = checkAIPlay(availableBoxes[i])
            if (bestMove) {
                return bestMove
            } else {
                // emulateNextPlay(availableBoxes)
            }
        }
    }

    function checkAIPlay(selection) {
        const AIPlayerSelected = gameboard.selectedBoxes.filter(box => box.textContent === manageGame.getPlayer().getSelector())
        AIPlayerSelected.push(selection)
        if(checkWin(AIPlayerSelected)) {
            return selection
        }
    }

    function checkWin (selection) {
        return (manageGame.threeInColumn(selection) || manageGame.threeInRow(selection) || manageGame.threeInDiagonal(selection))   
    }

    function emulateNextPlay (availableBoxes) {
        const selectedBoxes = gameboard.selectedBoxes
        const randomBox = Math.floor(Math.random() * availableBoxes.length)
        selectedBoxes.push(availableBoxes[randomBox])
        availableBoxes.splice(randomBox, 1)
        

    }
    return { setPlay }
})()


