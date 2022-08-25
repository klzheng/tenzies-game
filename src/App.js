import React from "react"
import Die from "./Die"
import { nanoid } from 'nanoid'
import Confetti from 'react-confetti'
import "./App.css"


function App() {
    const [dice, setDice] = React.useState(createNewDice())
    const [tenzie, setTenzie] = React.useState(false)
    const [highScore, setHighScore] = React.useState(0)
    const [isActive, setIsActive] = React.useState(true)
    const [isStopped, setIsStopped] = React.useState(true)
    const [seconds, setSeconds] = React.useState(0)

    if (!localStorage.getItem("highScore")) {
        localStorage.setItem("highScore", "0")
    }


    React.useEffect(() => {
        const firstValue = dice[0].value
        const allHold = dice.every(item => item.isHeld === true) 
        const sameValue = dice.every(item => item.value === firstValue)
        if (allHold && sameValue) {
            setTenzie(true)
        }  
    }, [dice])


    React.useEffect(() => {
        let int = null
        if (tenzie === false && isActive && isStopped === false) {
            int = setInterval(() => {
                setSeconds(prevTime => prevTime + 1)
            }, 1000)
        } else {
            clearInterval(int)
        }
        return () => clearInterval(int)
    }, [isActive, isStopped, tenzie])


    React.useEffect(() => {
        if (tenzie) {
            stopTimer()
            console.log(getHighScore())
            if (getHighScore() === "0") {
                saveNewScore()
            }
            else if (seconds < Number(getHighScore())) {
                saveNewScore()
            }
        } 
    }, [tenzie, highScore, seconds])


    function getHighScore() {
        return localStorage.getItem("highScore")
    }

    function saveNewScore() {
        localStorage.setItem("highScore", JSON.stringify(seconds))
        setHighScore(seconds)
    }

    function createNewDice() {
        const diceArray = []
        for (let i = 0; i < 10; i++) {
            diceArray.push(generateNewDice())
        }
        return diceArray
    }


    const diceElements = dice.map(item => {
        return (
            <Die 
                key = {item.id}
                value = {item.value} 
                isHeld = {item.isHeld}
                holdDice = {() => holdDice(item.id)}
                startTimer = {() => startTimer()}
            />
        )
    })


    function holdDice(id) {
        setDice(prevState => prevState.map(item => {
            return item.id === id ? 
                {...item, isHeld: !item.isHeld} :
                item
        }))
    }

    function rollDice() {
        if (tenzie) {
            setTenzie(false)
            setDice(createNewDice())
            resetTimer()
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

    function startTimer() {
        setIsActive(true)
        setIsStopped(false)
    }

    function stopTimer() {
        setIsStopped(!isStopped)
    }

    function resetTimer() {
        setIsActive(false)
        setSeconds(0)
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
            <div className="high-score">
                <p className="current-time">Current Time: {seconds} seconds</p>
                <p className="best-time">Best Time: {getHighScore()} seconds</p>
            </div>
            <div>
                <button onClick={rollDice}>
                        {tenzie ? "Next Game" : "Roll"}
                </button>
            </div>
        </div>
    )
};


export default App