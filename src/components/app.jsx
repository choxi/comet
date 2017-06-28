import React from 'react'
import WebView from 'react-electron-web-view'
import ReactDOM from 'react-dom'
import File from './file.jsx'
import { ipcRenderer } from 'electron'
import Path from 'path'
import fs from 'fs'

export default class App extends React.Component {
  constructor() {
    super()
    this.handleChange = this.handleChange.bind(this)
  }

  handleChange() {
    this.throttle(200, () => this.rendered.reload())
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

  directory() {
    return Path.resolve("user", this.props.name)
  }

  stagePath() {
    return Path.join(this.directory(), "stage.html")
  }

  failLoad(e) {
    console.log(e)
  }

  consoleMessage(e) {
    console.log(e.message)
  }

  render() {
    let fileDefaults = {
      component:  fs.readFileSync("./src/template/component.jsx"),
      stylesheet: fs.readFileSync("./src/template/component.css"),
      stage:      fs.readFileSync("./src/template/stage.html")
    }

    return <div>
      <div className="Editor">
        <File
          defaultValue={ fileDefaults.component }
          fileDir={ this.directory() }
          fileName={ this.props.name + ".jsx" }
          onChange={ this.handleChange }
        />
        <File
          defaultValue={ fileDefaults.stylesheet }
          fileDir={ this.directory() }
          fileName={ this.props.name + ".css" }
          onChange={ this.handleChange }
        />
        <File
          defaultValue={ fileDefaults.stage }
          fileDir={ this.directory() }
          fileName="stage.html"
          onChange={ this.handleChange }
        />
      </div>

      <div className="Browser">
        <WebView
          nodeintegration
          onDidFailLoad={ this.failLoad }
          onConsoleMessage={ this.consoleMessage }
          src={ this.stagePath() }
          ref={ (ref) => this.rendered = ref }
        />
      </div>
    </div>
  }
}
