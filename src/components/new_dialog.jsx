import React from 'react'
import { ipcRenderer } from 'electron'

export default class NewDialog extends React.Component {
  createComponent() {
    let name = this.nameInput.value

    ipcRenderer.send("open-component", { 
      name: name
    })

    this.nameInput.value = ""
  }

  render() {
    let components = JSON.parse(localStorage.components || "[]")
    let componentsPartial = components.map((component) => {
      return <li>{ component.name }</li>
    })

    return <div className="NewDialog">
      <h1>New Component</h1>
      <input type="text" ref={ (node) => this.nameInput = node } />
      <button onClick={ () => this.createComponent() }>Create</button>

      <h1>Recently Opened</h1>
      <ul>
        { componentsPartial }
      </ul>
    </div>
  }
}
