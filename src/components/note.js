import React, {Component} from "react";

class Note extends Component {
  constructor(props) {
    super(props)
    this.state = {
      note: {
        id: this.props.note.id,
        title: "",
        description: ""
      },
      isEditing: false
    }
  }

  updateNote(){
    var fields = this.refs
    for(var prop in fields){
      this.state.note[prop] = fields[prop].value
    }
    this.props.updateNote(this.state.note)
    this.toggleState()
  }

  deleteNote(){
    this.props.deleteNote(this.state.note.id)
  }

  toggleState(){
    this.setState({isEditing: !this.state.isEditing})
  }

  renderContent() {
    if (this.state.isEditing) {
      return (
        <div className="panel panel-default">
          <div className="panel-heading">
            <h3 className="panel-title">
              <input ref="title" type="text" defaultValue={this.props.note.title}/>
            </h3>
          </div>
          <div className="panel-body">
            <textarea ref="description" defaultValue={this.props.note.description}></textarea>
          </div>
          <button onClick={() => this.updateNote()} className="btn btn-primary save-button">Save Note</button>
          <button onClick={() => this.toggleState()} className="btn btn-primary cancel-button">Cancel</button>
        </div>
      )
    } else {
      return (
        <div className="panel panel-default">
          <div className="panel-heading">
            <h3 className="panel-title">{this.props.note.title}</h3>
          </div>
          <div className="panel-body">
            {this.props.note.description}
          </div>
          <button onClick={() => this.toggleState()} className="btn btn-primary edit-button">Edit Note</button>
          <button onClick={() => this.deleteNote()} className="btn btn-primary delete-button">Delete Note</button>

        </div>
      )
    }
  }

  render() {
    return (
      <div className="col-md-4">
        {this.renderContent()}
      </div>
    )
  }
}

export default Note
