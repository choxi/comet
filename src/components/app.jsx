import React from 'react'
import WebView from 'react-electron-web-view'
import ReactDOM from 'react-dom'
import File from './file.jsx'
import { ipcRenderer } from 'electron'
import Path from 'path'
import fs from 'fs'
import Handlebars from 'handlebars'

Handlebars.registerHelper('capitalize', (text) => {
  return text.charAt(0).toUpperCase() + text.slice(1) 
})

export default class App extends React.Component {
  constructor() {
    super()
    this.handleChange = this.handleChange.bind(this)
    this.throttles    = {}
  }

  handleChange() {
    this.throttle(2000, () => {
      console.log("reload")
      this.rendered.reload()
    })
  }

  throttle(interval, fn) {
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

  toggleDevTools() {
    if(this.rendered.isDevToolsOpened())
      this.rendered.closeDevTools()
    else
      this.rendered.openDevTools()
  }

  render() {
    let templates = { 
      component:  fs.readFileSync("./src/template/component.jsx"),
      stylesheet: fs.readFileSync("./src/template/component.css"),
      stage:      fs.readFileSync("./src/template/stage.html")
    }

    let context = { name: this.props.name }
    for(let name in templates) {
      let template = templates[name]
      templates[name] = Handlebars.compile(template.toString())(context)
    }

    return <div>
      <div className="Editor">
        <File
          defaultValue={ templates.component }
          fileDir={ this.directory() }
          fileName={ this.props.name + ".jsx" }
          onChange={ this.handleChange }
        />
        <File
          defaultValue={ templates.stylesheet }
          fileDir={ this.directory() }
          fileName={ this.props.name + ".css" }
          onChange={ this.handleChange }
        />
        <File
          defaultValue={ templates.stage }
          fileDir={ this.directory() }
          fileName="stage.html"
          onChange={ this.handleChange }
        />
      </div>

      <div className="Browser">
        <a onClick={ () => this.toggleDevTools() }>Inspector</a>
        <WebView
          nodeintegration
          onDidFailLoad={ this.failLoad }
          onConsoleMessage={ this.consoleMessage }
          onCrashed={ event => console.log(event) }
          src={ this.stagePath() }
          ref={ (ref) => this.rendered = ref }
        />
      </div>
    </div>
  }
}
