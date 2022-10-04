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
    let player = humanPlayer

    const getPlayer = () => player

    const $restartButton = document.querySelector(".restart-button")
    //bind events
    $restartButton.addEventListener("click", start)
    $switch.addEventListener("change", start)

    function setSelector () {
        if($switch.checked) {
            humanPlayer = playerFactory("O", "Human Player")
            AIPlayer = playerFactory("X", "AI player")
        } else {
            humanPlayer = playerFactory("X", "Human Player")
            AIPlayer = playerFactory("O", "AI player")
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
        player = humanPlayer
        manageDisplay.showPlayersTurn()
    }

    function threeInRow(selected) {
        const row1 = selected.filter((box) => (box.id === "1" || box.id === "2" || box.id === "3"))
        const row2 = selected.filter((box) => (box.id === "4" || box.id === "5" || box.id === "6"))
        const row3 = selected.filter((box) => (box.id === "7" || box.id === "8" || box.id === "9"))
        return row1.length === 3 || row2.length === 3 || row3.length === 3
    }

    function threeInColumn(selected) {
        const column1 = selected.filter((box) => (box.id === "1" || box.id === "4" || box.id === "7"))
        const column2 = selected.filter((box) => (box.id === "2" || box.id === "5" || box.id === "8"))
        const column3 = selected.filter((box) => (box.id === "3" || box.id === "6" || box.id === "9"))
        return column1.length === 3 || column2.length === 3 || column3.length === 3
    }

    function threeInDiagonal(selected) {
        const diagonal1 = selected.filter((box) => (box.id === "1" || box.id === "5" || box.id === "9"))
        const diagonal2 = selected.filter((box) => (box.id === "3" || box.id === "5" || box.id === "7"))
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
        }

    }

    return { getPlayer, checkIfWin }
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




