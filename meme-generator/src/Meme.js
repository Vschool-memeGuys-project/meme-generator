import React from "react"

function Meme(props) {
    console.log(`When meme loads: topX: ${props.topTextPositionX}, topY: ${props.topTextPositionY}, bottomX: ${props.bottomTextPositionX}, bottomY: ${props.bottomTextPositionY}`)

    return (
        <div id="memePlaceholder">
            <img src={props.src} alt="meme"></img>
            <h1 id="topText" style={{ color: props.topTextColor, bottom: props.topTextPositionY, left: props.topTextPositionX }}>{props.topText}</h1>
            <h1 id="bottomText" style={{ color: props.bottomTextColor, bottom: props.bottomTextPositionY, left: props.bottomTextPositionX }}>{props.bottomText}</h1>
        </div>
    )
}

export default Meme