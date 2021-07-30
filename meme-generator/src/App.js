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
    this.badgeKey = 0
    this.badges = []

    this.handleChange = this.handleChange.bind(this)
    this.createMeme = this.createMeme.bind(this)
    this.getMeme = this.getMeme.bind(this)
  }

  handleChange(event) {
    const {name, value} = event.target
    this.setState({
      [name]: value
    })
  }

  getMeme() {
    //event.preventDefault()
    var randomNum = Math.floor(Math.random() * 101)
    console.log(`Index of image: ${randomNum}`)
    
    axios.get("https://api.imgflip.com/get_memes")
      .then(data => {
        console.log(data.data.data.memes[randomNum].url)
        this.setState({ src: data.data.data.memes[randomNum].url })
      })
      .catch(err => console.log(err))
  }

  componentDidMount(){
    this.getMeme()
  }

  createMeme(event) {
    event.preventDefault();
    var uncompletedAreas = [];

    if (uncompletedAreas.length > 0) {
      alert("Each input requires at least 3 characters.\nYou need to complete these areas before creating your badge: " + uncompletedAreas)
    }
    else {
      this.badgeKey++
      this.badges.push(<Meme key={this.badgeKey} topText={this.state.topText} topTextColor={this.state.topTextColor} bottomText={this.state.bottomText} bottomTextColor={this.state.bottomTextColor} src={this.state.src}/>)
      this.setState( {topText: "", topTextColor: "", bottomText: "", bottomTextColor: "", src: "" } )
    }
  }
  
  render () {
    const topTextStyles = { color: this.state.topTextColor }
    const bottomTextStyles = { color: this.state.bottomTextColor }
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
            {this.badges}
          </ul>
        </label>
      </div>
      
    )
  }
}

export default App;