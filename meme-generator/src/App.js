import React from 'react';
import Meme from "./Meme"
import Draggable from "react-draggable"
const axios = require("axios")

class App extends React.Component {
  constructor() {
    super()
    this.state = {
        key: 0,
        topText: "Top Text",
        topTextColor: "#ffffff",
        topTextPositionY: 550,
        topTextPositionX: 0,
        topTextDeltaX: 0,
        topTextDeltaY: 0,
        bottomText: "Bottom Text",
        bottomTextColor: "#ffffff",
        bottomTextPositionY: 150,
        bottomTextPositionX: 0,
        bottomTextDeltaX: 0,
        bottomTextDeltaY: 0,
        src: "",
        editing: false,
        loading: false
    }
    /*
    localStorage.memeKey = 0;
    localStorage.memeList = JSON.stringify([]);
    */
    
    //localStorage.clear()

    if (localStorage.memeKey === undefined || localStorage.memeKey === null || !isNaN(localStorage.memeKey)) {
        localStorage.memeKey = 0;
    }
    if (localStorage.memeList === undefined || localStorage.memeList === null) {
        localStorage.memeList = JSON.stringify([]);
    }
    this.memeList = JSON.parse(localStorage.memeList)

    this.handleChange = this.handleChange.bind(this)
    this.createMeme = this.createMeme.bind(this)
    this.getMeme = this.getMeme.bind(this)
    this.editMeme = this.editMeme.bind(this)
    this.handleDragTop = this.handleDragTop.bind(this)
    this.handleDragBottom = this.handleDragBottom.bind(this)
  }

  //changes state whenever there is an update
  handleChange(event) {
    const {name, value} = event.target
    this.setState({
      [name]: value
    })
  }

  handleDragTop(event, drag) {
    console.log(event, drag)
    console.log(`topTextDeltaX: ${this.state.topTextDeltaX}, topTextDeltaY: ${this.state.topTextDeltaY}`)
    this.setState(prevState => { return {
      topTextPositionX: prevState.topTextPositionX,
      topTextDeltaX: prevState.topTextDeltaX + drag.deltaX,
      topTextPositionY: prevState.topTextPositionY,
      topTextDeltaY: prevState.topTextDeltaY + -(drag.deltaY)
    }})
  }

  handleDragBottom(event, drag) {
    console.log(event, drag)
    console.log(`bottomTextPosX: ${this.state.bottomTextPositionX}, bottomTextPosY: ${this.state.bottomTextPositionY}`)
    this.setState(prevState => { return {
      bottomTextPositionX: prevState.bottomTextPositionX,
      bottomTextDeltaX: prevState.bottomTextDeltaX + drag.deltaX,
      bottomTextPositionY: prevState.bottomTextPositionY,
      bottomTextDeltaY: prevState.bottomTextDeltaY + -(drag.deltaY)
    }})
  }
  
  //performs axios request to get an image url and sets the state
  getMeme() {
    this.setState({ loading: true })
    var randomNum = Math.floor(Math.random() * 101)
    
    axios.get("https://api.imgflip.com/get_memes")
      .then(data => {
        this.setState({ loading: false, src: data.data.data.memes[randomNum].url })
      })
      .catch(err => console.log(err))
  }

  //loads an image when the component mounts
  componentDidMount(){
    this.getMeme()
  }

  //saves meme as component and adds it to local storage for "permanent" storage
  createMeme(event) {
    event.preventDefault();
    
    if (this.state.editing) {
      const index = this.memeList.findIndex(meme => meme.key === this.state.key)
      this.memeList.splice(index, 1, { 
        key: this.state.key, 
        topText: this.state.topText, 
        topTextColor: this.state.topTextColor,
        topTextPositionX: this.state.topTextPositionX + this.state.topTextDeltaX,
        topTextPositionY: this.state.topTextPositionY + this.state.topTextDeltaY,
        bottomText: this.state.bottomText, 
        bottomTextColor: this.state.bottomTextColor,
        bottomTextPositionX: this.state.bottomTextPositionX + this.state.bottomTextDeltaX,
        bottomTextPositionY: this.state.bottomTextPositionY + this.state.bottomTextDeltaY,
        src: this.state.src 
      })
      console.log(`topTextPosX: ${this.state.topTextPositionX}, topTextPosY: ${this.state.topTextPositionY}, bottomTextPosX: ${this.state.bottomTextPositionX}, bottomTextPosY: ${this.state.bottomTextPositionY}`)
      this.setState({ editing: false })
    }
    else {
      if (this.memeList.length > 0) {
        localStorage.memeKey = this.memeList[this.memeList.length - 1].key
      }

      localStorage.memeKey++
      this.memeList.push({ 
        key: localStorage.memeKey, 
        topText: this.state.topText, 
        topTextColor: this.state.topTextColor, 
        topTextPositionX: this.state.topTextPositionX + this.state.topTextDeltaX,
        topTextPositionY: this.state.topTextPositionY + this.state.topTextDeltaY,
        bottomText: this.state.bottomText, 
        bottomTextColor: this.state.bottomTextColor, 
        bottomTextPositionX: this.state.bottomTextPositionX + this.state.bottomTextDeltaX,
        bottomTextPositionY: this.state.bottomTextPositionY + this.state.bottomTextDeltaY,
        src: this.state.src 
      })
    }
    
    localStorage.memeList = JSON.stringify(this.memeList)

    this.setState( {
      topText: "Top Text", 
      topTextColor: "#ffffff", 
      bottomText: "Bottom Text", 
      bottomTextColor: "#ffffff",
      topTextPositionX: 0,
      topTextPositionY: 550,
      topTextDeltaX: 0,
      topTextDeltaY: 0,
      bottomTextPositionX: 0,
      bottomTextPositionY: 150,
      bottomTextDeltaX: 0,
      bottomTextDeltaY: 0
    } )

    this.getMeme()
  }

  deleteMeme(memeKey) {
    const index = this.memeList.findIndex(meme => meme.key === memeKey)
    this.memeList.splice(index, 1)
    localStorage.memeList = JSON.stringify(this.memeList)
    this.forceUpdate()
  }
  
  editMeme(memeKey) {
    const index = this.memeList.findIndex(meme => meme.key === memeKey)
    const meme = this.memeList[index]
    console.log(`edit topTextPosX: ${meme.topTextPositionX}, edit topTextPosY: ${meme.topTextPositionY}, edit bottomTextPosX: ${meme.bottomTextPositionX}, edit bottomTextPosY: ${meme.bottomTextPositionY}`)
    this.setState({ key: meme.key, topText: meme.topText, topTextColor: meme.topTextColor, topTextPositionX: meme.topTextPositionX, topTextPositionY: meme.topTextPositionY, bottomText: meme.bottomText, bottomTextColor: meme.bottomTextColor, bottomTextPositionX: meme.bottomTextPositionX, bottomTextPositionY: meme.bottomTextPositionY, src: meme.src, editing: true })
    window.scrollTo(0, 0)
  }
  
  render () {
    const topTextStyles = { color: this.state.topTextColor, bottom: this.state.topTextPositionY, left: this.state.topTextPositionX }
    const bottomTextStyles = { color: this.state.bottomTextColor, bottom: this.state.bottomTextPositionY, left: this.state.bottomTextPositionX }
    const memes = this.memeList.map(meme => 
      <div>
        <Meme 
          key={meme.key}
          topText={meme.topText}
          topTextColor={meme.topTextColor}
          topTextPositionX={meme.topTextPositionX}
          topTextPositionY={meme.topTextPositionY}
          bottomText={meme.bottomText}
          bottomTextColor={meme.bottomTextColor}
          bottomTextPositionX={meme.bottomTextPositionX}
          bottomTextPositionY={meme.bottomTextPositionY}
          src={meme.src}
        />
        <div >
          <button className="savedButton" onClick={() => this.editMeme(meme.key)} >Edit Meme</button>
          <button className="savedButton" onClick={() => this.deleteMeme(meme.key)} >Delete Meme</button>
        </div>
      </div>
    )

    if (!this.state.loading) {
      return (
        <div id="mainContainer">
          <div id='navBar'>
            <h1 id="pageHeader">The Meme <br></br> Machine</h1>
          </div>

          <div id="creatorContainer">
            <div id="memePlaceholder">
              <img src={this.state.src} alt="meme"></img>
              <Draggable axis="both" onDrag={this.handleDragTop}><h2 id="topText" style={topTextStyles}>{this.state.topText}{'\u00A0'}</h2></Draggable>
              <Draggable axis="both" onDrag={this.handleDragBottom}><h2 id="bottomText" style={bottomTextStyles}>{this.state.bottomText}{'\u00A0'}</h2></Draggable>
              <button id="changeMemeButton" className='button' onClick={this.getMeme}>Change Image</button>
            </div>

            <form id="memeForm">
              <div>
              <label> 
                <input 
                  type="text" 
                  name="topText"
                  className='inputBox'
                  value={this.state.topText} 
                  placeholder="Top Text" 
                  onChange={this.handleChange}

                />
              </label>

              <label className='colorInput'>Top Color{' '}
                <input 
                  type="color" 
                  name="topTextColor" 
                  value={this.state.topTextColor} 
                  onChange={this.handleChange}
                />
              </label>
              </div>

              <div>
              <label>
                <input 
                  type="text" 
                  name="bottomText"
                  className='inputBox'
                  value={this.state.bottomText} 
                  placeholder="Bottom Text" 
                  onChange={this.handleChange}
                />
              </label>

              <label className='colorInput'>Bottom Color{' '}
                <input 
                  type="color" 
                  name="bottomTextColor"
                  value={this.state.bottomTextColor} 
                  onChange={this.handleChange}
                />
              </label>
              </div>
              <div id="saveMemeButton">
                <button className='button' onClick={this.createMeme}>Save Meme</button>
              </div>
            </form>
            
          </div>

          
          <br></br>
          <div id="savedMemeContainer">
            <h1 id="memeHeader">Saved Memes</h1>
            <ul>
              {memes}
            </ul>
            </div> 
        </div>
        
      )
    }
    else {
      return (
        <div>
          <div id='navBar'>
            <h1 id="pageHeader">The Meme <br></br> Machine</h1>
          </div>
          <div id="creatorContainer">
            <div id="memePlaceholder">
              <h1>Loading...</h1>
            </div>

            <form id="memeForm">
              <div>
              <label> 
                <input 
                  type="text" 
                  name="topText"
                  className='inputBox'
                  value={this.state.topText} 
                  placeholder="Top Text" 
                  onChange={this.handleChange}

                />
              </label>

              <label className='colorInput'>Top Color{' '}
                <input 
                  type="color" 
                  name="topTextColor" 
                  value={this.state.topTextColor} 
                  onChange={this.handleChange}
                />
              </label>
              </div>

              <div>
              <label>
                <input 
                  type="text" 
                  name="bottomText"
                  className='inputBox'
                  value={this.state.bottomText} 
                  placeholder="Bottom Text" 
                  onChange={this.handleChange}
                />
              </label>

              <label className='colorInput'>Bottom Color{' '}
                <input 
                  type="color" 
                  name="bottomTextColor"
                  value={this.state.bottomTextColor} 
                  onChange={this.handleChange}
                />
              </label>
              </div>

              <button className='button' onClick={this.createMeme}>Save Meme</button>
            </form>
            
          </div>

          <br></br>

          <label> 
            <h1 id="memeHeader">Saved Memes</h1>
            <ul>
              {memes}
            </ul>
          </label>
        </div>
      )
    }
  }
}

export default App;