import React, {Component} from 'react';
import './App.css';
import Note from "./components/note.js"
import API from "./services/api.js"

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      notes: [
        {
          id: 1,
          title: "First Task",
          description: "Pick Up Paycheck"
        }, {
          id: 2,
          title: "Second Task",
          description: "Cash Paycheck"
        }, {
          id: 3,
          title: "Third Task",
          description: "Get Some Milk"
        }
      ]
    }
  }

  // Regular CRUD Stuff
  findNote(id) {
    return this.state.notes.find((item) => {
      if (item.id === id) {
        return item
      }
    })
  }

  findIndex(note){
    return this.state.notes.indexOf(note)
  }

  updateNote(newNote) {
    var note = this.findNote(newNote.id)
    var index = this.findIndex(note)
    this.state.notes[index] = newNote
    this.setState({notes: this.state.notes})
  }

  deleteNote(id) {
    var note = this.findNote(id)
    var index = this.state.notes.indexOf(note)
    this.state.notes.splice(index, 1)
    this.setState({notes: this.state.notes})
  }

  createNote(e) {
    e.preventDefault()
    var note = {}
    var fields = this.refs
    for (var prop in fields) {
      note[prop] = fields[prop].value
    }
    var id = this.state.notes.length + 1
    note.id = id
    this.state.notes.push(note)
    this.setState({notes: this.state.notes})
  }

  renderNotes() {
    var noteComponents = []
    this.state.notes.map((note, i) => {
      noteComponents.push(<Note deleteNote={(id) => this.deleteNote(id)} updateNote={(note) => this.updateNote(note)} key={i} note={note}/>)
    })
    return noteComponents
  }

  execute(){
    var apiPromise = API.getAllDinosaurs()
    apiPromise.then((data) => {console.log('data', data)})
  }

  render() {
    var styling = {
      container: {
        marginTop: "100px"
      },
      heading: {
        marginBottom: "50px"
      }
    }


    return (
      <div style={styling.container} className="container">
    
        <h1>Create a new note</h1>
        <form>
          <input className="note-title form-control form-inline" ref="title" type="text"/>
          <textarea className="note-description form-control form-inline" ref="description"></textarea>
          <button type="submit" className="create-note" onClick={(e) => this.createNote(e)}>Create Note</button>
        </form>
        <div className="row">
          <h1 style={styling.heading} className="text-center">My Notes</h1>
          {this.renderNotes()}
        </div>
      </div>
    );
  }
}

export default App;
