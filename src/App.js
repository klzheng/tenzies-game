import React from "react"
import Die from "./Die"
import { nanoid } from 'nanoid'
import Confetti from 'react-confetti'
import "./App.css"


function App() {


    const [dice, setDice] = React.useState(createNewDie())
    const [tenzie, setTenzie] = React.useState(false)


    React.useEffect(() => {
        const firstValue = dice[0].value
        const allHold = dice.every(item => item.isHeld === true) 
        const sameValue = dice.every(item => item.value === firstValue)
        if (allHold && sameValue) {
            setTenzie(true)
        }  
    }, [dice])


    function createNewDie() {
        const diceArray = []
        for (let i=0; i<10; i++) {
            diceArray.push(generateNewDice())
        }
        return diceArray
    }


    const diceElements = dice.map(item => {
        return (
            <Die 
                key={item.id}
                value={item.value} 
                isHeld={item.isHeld}
                holdDice={() => holdDice(item.id)}
            />
        )
    })


    function holdDice(id) {
        setDice(prevState => prevState.map(item => {
            return (
                item.id === id ? 
                {...item, isHeld: !item.isHeld} :
                item
            )
        }))
    }

    function rollDice() {
        if (tenzie) {
            gameOver()
        } else {
            setDice(prevState => prevState.map(item => {
                return item.isHeld ?
                    item :
                    generateNewDice()
            })) 
        }
    } 


    function generateNewDice() {
        const randomNum = Math.ceil(Math.random()*6)
        return ({
            value: randomNum, 
            isHeld: false, 
            id: nanoid()
        })
    }


    function gameOver() {
        setTenzie(false)
        setDice(createNewDie())
    }


    return(
        <div className="main-container">
            {tenzie && <Confetti />}
            <h1>Tenzies</h1>
            <p>
                Roll until all dice are the same. Click each die to freeze
                it at its current value between rolls.
            </p>
            <div className="dice-container">
                {diceElements}
            </div>
            <button onClick={rollDice}>{tenzie ? "Next Game" : "Roll"}</button>
        </div>
    )
};


export default App