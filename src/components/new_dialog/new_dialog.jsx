import React from 'react'
import { ipcRenderer } from 'electron'
import fs from 'fs'
import path from 'path'

function getDirectories(srcpath) {
  return fs.readdirSync(srcpath)
    .filter(file => fs.lstatSync(path.join(srcpath, file)).isDirectory())
}

export default class NewDialog extends React.Component {
  createComponent() {
    let name = this.nameInput.value

    ipcRenderer.send("open-component", { name: name })
    this.nameInput.value = ""
  }

  openComponent(name) {
    ipcRenderer.send("open-component", { name: name })
  }

  render() {
    let components = getDirectories("./user") || JSON.parse(localStorage.components || "[]")
    let componentsPartial = components.map((name) => {
      return <li onClick={ () => this.openComponent(name) } >{ name }</li>
    })

    return <div className="NewDialog">
      <h1>Comet</h1>
      <h2>New Component</h2>
      <input type="text" ref={ (node) => this.nameInput = node } />
      <button onClick={ () => this.createComponent() }>Create</button>

      <h2>Recently Opened</h2>
      <ul>
        { componentsPartial }
      </ul>
    </div>
  }
}
