import React from 'react';
import Meme from "./Meme"
const axios = require("axios")

class App extends React.Component {
  constructor() {
    super()
    this.state = {
        topText: "Top Text",
        topTextColor: "#ffffff",
        bottomText: "Bottom Text",
        bottomTextColor: "#ffffff",
        src: "",
        loading: false
    }
    /*
    localStorage.memeKey = 0;
    localStorage.memeList = JSON.stringify([]);
    */
    console.log(`before initialization: ${localStorage.memeList}`)
    console.log(`meme key: ${localStorage.memeKey}`)
    if (localStorage.memeKey === undefined || localStorage.memeKey === null || !isNaN(localStorage.memeKey)) {
        localStorage.memeKey = 0;
        console.log(`meme key initialization: ${localStorage.memeKey}`)
    }
    if (localStorage.memeList === undefined || localStorage.memeList === null) {
        localStorage.memeList = JSON.stringify([]);
        this.memeList = [];
        console.log(`memelist initializaiton: ${localStorage.memeList}`)
    }
    this.memeList = JSON.parse(localStorage.memeList)
    console.log(`this.memelist: ${this.memeList}`)
    
    

    this.handleChange = this.handleChange.bind(this)
    this.createMeme = this.createMeme.bind(this)
    this.getMeme = this.getMeme.bind(this)
  }

  //changes state whenever there is an update
  handleChange(event) {
    const {name, value} = event.target
    this.setState({
      [name]: value
    })
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
    
    localStorage.memeKey++
    this.memeList.push({ key: localStorage.memeKey, topText: this.state.topText, topTextColor: this.state.topTextColor, bottomText: this.state.bottomText, bottomTextColor: this.state.bottomTextColor, src: this.state.src })
    
    console.log(`this.memelist after creatememe runs: ${this.memeList}`)
    localStorage.memeList = JSON.stringify(this.memeList)
    console.log(`localstorage memelist after creatememe runs: ${localStorage.memeList}`)

    this.setState( {topText: "Top Text", topTextColor: "#ffffff", bottomText: "Bottom Text", bottomTextColor: "#ffffff" } )
    this.getMeme()
  }

  /*
  editMeme(index) {
    const meme = JSON.parse(localStorage.memeList)[index]
    this.setState({ topText: meme.topText, topTextColor: meme.topTextColor, bottomText: meme.bottomText, bottomTextColor: meme.bottomTextColor, src: meme.src })
  }
  */
  
  render () {
    const topTextStyles = { color: this.state.topTextColor }
    const bottomTextStyles = { color: this.state.bottomTextColor }
    const memes = this.memeList.map(meme => <div><Meme key={meme.key} topText={meme.topText} topTextColor={meme.topTextColor} bottomText={meme.bottomText} bottomTextColor={meme.bottomTextColor} src={meme.src} /><button /*id={meme.key} onClick={this.editMeme} */>Edit Meme</button></div>)

    if (!this.state.loading) {
      return (
        <div>
          <h1 id="pageHeader">Create a Meme</h1>
          <div id="formContainer">
            <div id="memePlaceholder">
              <img src={this.state.src} alt="meme"></img>
              <h1 id="topText" style={topTextStyles}>{this.state.topText}</h1>
              <h1 id="bottomText" style={bottomTextStyles}>{this.state.bottomText}</h1>
            </div>
            <form id="memeForm">
              <label>Top Text: <input type="text" name="topText" value={this.state.topText} placeholder="Top Text" onChange={this.handleChange}/></label>
              <label>Top Text Color: <input type="color" name="topTextColor" value={this.state.topTextColor} onChange={this.handleChange}/></label>
              <label>Bottom Text: <input type="text" name="bottomText" value={this.state.bottomText} placeholder="Bottom Text" onChange={this.handleChange}/></label>
              <label>Bottom Text Color: <input type="color" name="bottomTextColor" value={this.state.bottomTextColor} onChange={this.handleChange}/></label>
              <button onClick={this.createMeme}>Save Meme</button>
            </form>
            <button onClick={this.getMeme}>Refresh Image</button>
          </div>

          
          <br></br><br></br>
          <label> <h1 id="memeHeader">Saved Memes</h1>
            <ul>
              {memes}
            </ul>
          </label>
        </div>
        
      )
    }
    else {
      return (
        <div>
          <h1 id="pageHeader">Create a Meme</h1>
          <div id="formContainer">
            <h1 id="loadingHeader">Loading Image...</h1>
            <form id="memeForm">
              <label>Top Text: <input type="text" name="topText" value={this.state.topText} placeholder="Top Text" onChange={this.handleChange}/></label>
              <label>Top Text Color: <input type="color" name="topTextColor" value={this.state.topTextColor} onChange={this.handleChange}/></label>
              <label>Bottom Text: <input type="text" name="bottomText" value={this.state.bottomText} placeholder="Bottom Text" onChange={this.handleChange}/></label>
              <label>Bottom Text Color: <input type="color" name="bottomTextColor" value={this.state.bottomTextColor} onChange={this.handleChange}/></label>
              <button onClick={this.createMeme}>Save Meme</button>
            </form>
            <button onClick={this.getMeme}>Refresh Image</button>
          </div>

          
          <br></br><br></br>
          <label> <h1 id="memeHeader">Saved Memes</h1>
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