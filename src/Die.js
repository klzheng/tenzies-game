import { getQueriesForElement } from "@testing-library/react"
import React from "react"

function Die(props) {


    const styles = {
        backgroundColor: props.isHeld ? "#59E391" : "white"
    }


    return (
        <div style={styles} className="dice" onClick={props.holdDice}>
            <p>{props.value}</p>
        </div>
    )
}

export default Die