import React from 'react'
import Path from 'path'
import fs from 'fs'

export default class File extends React.Component {
  constructor(props) {
    super(props)

    this.state = { body: "" }
    this.handleChange = this.handleChange.bind(this)

    if(!fs.existsSync(this.props.fileDir)) fs.mkdirSync(fileDir)
    if(fs.existsSync(this.path())) this.state.body = fs.readFileSync(this.path())
  }

  path() {
    return Path.join(this.props.fileDir, this.props.fileName)
  }

  handleChange(event) {
    this.setState({ body: event.target.value }, () => {
      fs.writeFileSync(this.path(), this.state.body)
      this.props.onChange(event)
    })
  }

  render() {
    return <textarea defaultValue={ this.state.body } onChange={ this.handleChange } />
  }
}
