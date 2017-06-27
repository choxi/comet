import React from 'react'
import Path from 'path'
import fs from 'fs'

import AceEditor from 'react-ace'
import brace from 'brace'
import 'brace/mode/javascript'
import 'brace/mode/html'
import 'brace/mode/css'
import 'brace/mode/jsx'
import 'brace/theme/textmate'
import 'brace/theme/monokai'

export default class File extends React.Component {
  constructor(props) {
    super(props)

    let mode = Path.extname(this.props.fileName).split(".")[1]
    this.state = { body: "", mode: mode }
    this.handleChange = this.handleChange.bind(this)

    if(!fs.existsSync(this.props.fileDir)) fs.mkdirSync(fileDir)
    if(fs.existsSync(this.path())) this.state.body = fs.readFileSync(this.path())
  }

  path() {
    return Path.join(this.props.fileDir, this.props.fileName)
  }

  handleChange(newValue) {
    this.setState({ body: newValue }, () => {
      fs.writeFileSync(this.path(), this.state.body)
      this.props.onChange()
    })
  }

  render() {
    return <div className="File">
      <div className="File__name">{ this.props.fileName }</div>
      <AceEditor
        mode={ this.state.mode }
        theme="monokai"
        editorProps={{$blockScrolling: true}}
        showPrintMargin={ false }
        showGutter={ true }
        value={ this.state.body.toString() }
        onChange={ this.handleChange }
        minLines={ 20 }
        maxLines={ 60 }
      />
    </div>
  }
}
