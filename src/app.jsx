import React from 'react'
import WebView from 'react-electron-web-view'
import ReactDOM from 'react-dom'
import File from './file.jsx'

const USER_DIRECTORY = "./user"

export default class App extends React.Component {
  constructor() {
    super()
    this.handleChange = this.handleChange.bind(this)
  }

  handleChange() {
    this.throttle(1000, () => this.rendered.reload())
  }

  throttle(interval, fn) {
    this.throttles = this.throttles || {}
    let throttled  = (this.throttles[fn] || false)
  
    if(!throttled) {
      this.throttles[fn] = true
      setTimeout(() => {
        fn()
        this.throttles[fn] = false
      }, interval)
    }
  }

  failLoad(e) {
    console.log(e)
  }

  consoleMessage(e) {
    console.log(e.message)
  }

  render() {
    return <div>
      <div className="Editor">
        <File fileDir={ USER_DIRECTORY } fileName="stage.html" onChange={ this.handleChange } />
        <File fileDir={ USER_DIRECTORY } fileName="app.css" onChange={ this.handleChange } />
        <File fileDir={ USER_DIRECTORY } fileName="app.jsx" onChange={ this.handleChange } />
      </div>

      <div className="Browser">
        <WebView nodeintegration onDidFailLoad={ this.failLoad } onConsoleMessage={ this.consoleMessage } src="../user/stage.html" ref={ (ref) => this.rendered = ref } />
      </div>
    </div>
  }
}
