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
    // Initializes highScore if necessary
    if (!localStorage.getItem("highScore")) {
        localStorage.setItem("highScore", "0")
    }


    // Sets the win condition, only if all the dice values are the same and if all dice are held
    React.useEffect(() => {
        const firstValue = dice[0].value
        const allHold = dice.every(item => item.isHeld === true) 
        const sameValue = dice.every(item => item.value === firstValue)
        if (allHold && sameValue) {
            setTenzie(true)
        }  
    }, [dice])


    // Runs timer while game is not won
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


    //  When game is over, saves player score to high score if applicable
    React.useEffect(() => {
        if (tenzie) {
            stopTimer()
            saveNewScore()
        } 
    }, [tenzie])


    // Retrieves high score from localStorage
    function getHighScore() {
        return localStorage.getItem("highScore")
    }


    // Saves new score as high score if score is lower than high score
    function saveNewScore() {
        if (getHighScore() === "0") {
            localStorage.setItem("highScore", JSON.stringify(seconds))
            setHighScore(seconds)
        }
        else if (seconds < Number(getHighScore())) {
            localStorage.setItem("highScore", JSON.stringify(seconds))
            setHighScore(seconds)
        }
    }

    // Creates new array containing die objects
    function createNewDice() {
        const diceArray = []
        for (let i = 0; i < 10; i++) {
            diceArray.push(generateNewDice())
        }
        return diceArray
    }


    // Changes die 'isHeld' value if die id matches the argument id
    function holdDice(id) {
        setDice(prevState => prevState.map(item => {
            return item.id === id ? 
                {...item, isHeld: !item.isHeld} :
                item
        }))
    }


    // Rolls dice. If game is over -> resets game 
    function rollDice() {
        if (tenzie) {
            setTenzie(false)
            setDice(createNewDice())
            resetTimer()
        } else {
            startTimer()
            setDice(prevState => prevState.map(item => {
                return item.isHeld ?
                    item :
                    generateNewDice()
            })) 
        }
    } 


    // Creates a new singular die
    function generateNewDice() {
        const randomNum = Math.ceil(Math.random()*6)
        return ({
            value: randomNum, 
            isHeld: false, 
            id: nanoid()
        })
    }


    // Starts timer
    function startTimer() {
        setIsActive(true)
        setIsStopped(false)
    }


    // Stops timer
    function stopTimer() {
        setIsStopped(!isStopped)
    }


    // Resets timer
    function resetTimer() {
        setIsActive(false)
        setSeconds(0)
    }


    // Generates <Die> components with props 
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


    // JSX
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