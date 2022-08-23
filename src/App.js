import React from "react"
import "./App.css"
import "./Die"

function App() {

    const [dice, setDice] = React.useState(createNewDie())

    function createNewDie() {
        const diceArray = []
        for (let i=0; i<10; i++) {
            const randomNum = Math.ceil(Math.random()*6)
            diceArray.push({value: randomNum, onHold: false})
        }
        return diceArray
    }
    console.log(dice)

    return(
        <div className="main-container">
            <h1>Tenzies</h1>
            <p>
                Roll until all dice are the same. Click each die to freeze
                it at its current value between rolls.
            </p>
            <div className="dice-container">
                <div className="dice">1</div>
                <div className="dice">1</div>
                <div className="dice">1</div>
                <div className="dice">1</div>
                <div className="dice">1</div>
                <div className="dice">1</div>
                <div className="dice">1</div>
                <div className="dice">1</div>
                <div className="dice">1</div>
                <div className="dice">1</div>
            </div>
            <button>Roll</button>
        </div>
    )
};

export default App