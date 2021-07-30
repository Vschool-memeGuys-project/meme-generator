import React from "react"

function Meme(props) {
    return (
        <div id="memePlaceholder">
            <img src={props.src} alt="meme"></img>
            <h1 id="topText" style={{ color: props.topTextColor }}>{props.topText}</h1>
            <h1 id="bottomText" style={{ color: props.bottomTextColor }}>{props.bottomText}</h1>
        </div>
    )
}

export default Meme