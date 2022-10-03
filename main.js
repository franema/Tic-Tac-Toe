const playerFactory = (selector) => {
    const getSelector = () => selector
    return { getSelector }
}

const manageGame = (() => {

    const player1 = playerFactory("X")
    const player2 = playerFactory("O")
    let player = player1
    const $gameboardBoxes = document.querySelectorAll(".board-box")
    const $restartButton = document.querySelector(".restart-button")

    //bind events
    $gameboardBoxes.forEach((box) => {
        box.addEventListener("click", showInput)
    })
    $restartButton.addEventListener("click", start)

    function showInput(e) {
        if (!e.target.classList.value.includes("disabled")) {
            e.target.textContent = player.getSelector()
            e.target.classList.add("disabled")
            player = player === player1 ? player2 : player1
        }
    }

    function start() {
        $gameboardBoxes.forEach((box) => {
            box.textContent = ""
            box.classList.remove("disabled")
        })
    }


})()

const manageDisplay = (() => {

})()




