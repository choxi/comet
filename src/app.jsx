import React from 'react'
import fs from 'fs'
import Path from 'path'
import WebView from 'react-electron-web-view'
import ReactDOM from 'react-dom'

const USER_DIRECTORY = "./user"

export default class App extends React.Component {
  constructor() {
    super()

    if(!fs.existsSync(USER_DIRECTORY)) fs.mkdirSync(USER_DIRECTORY)

    let file = "app.js"
    let filePath = Path.join(USER_DIRECTORY, file)

    if(fs.existsSync(filePath)) {
      let code    = fs.readFileSync(filePath)
      this.state  = { filePath: filePath, code: code }
    } else {
      this.state = { filePath: filePath, code: "" }
    }

    this.handleChange = this.handleChange.bind(this)
  }

  handleChange(event) {
    this.setState({ code: event.target.value }, () => {
      fs.writeFileSync(this.state.filePath, this.state.code)
      this.rendered.reload()
    })
  }

  failLoad(e) {
    console.log(e)
  }

  consoleMessage(e) {
    console.log(e.message)
  }

  render() {
    return <div>
      <textarea defaultValue={ this.state.code } onChange={ this.handleChange } />
      <WebView nodeintegration onDidFailLoad={ this.failLoad } onConsoleMessage={ this.consoleMessage } src="../user/index.html" ref={ (ref) => this.rendered = ref } />
    </div>
  }
}
