import React from 'react';
import {shallow, mount} from 'enzyme';
import {expect} from 'chai';
const sinon = require("sinon")

import App from '../src/App';
import Note from '../src/components/note.js';
import API from "../src/services/api.js"

// GENERAL TESTING PATTERN
// - setup > action > verify action got desired result
// Why should you test? -> When refactoring/extending a big application, you might break certain features. When
// you've tested your code, you'll know which features break + the location they break at in the code.

// What should be tested? -> Depends on the type of test. Unit tests test one function which takes an input and verify they got
// valid output (most useful for complex algorithms). Integration tests test a feature/user story and ensure it works.

// CHEAT SHEET
// component.node = this
// component.instance() = this
// component.state() = state
// component.find('.panel-title').node.value

// .to.not.be.null;
// .to.equal()
// .to.be.true

// var toggleState = sinon.spy(Note.prototype, "toggleState"); // Spy on method toggleState BEFORE component is mounted
// component = mount(<Note note={note}/>); // mount it
// component.find('.edit-button').simulate('click'); // Simulate a click event on the edit button
// expect(toggleState).to.have.property('callCount', 1); // toggleState should have been called
// expect(component.state().isEditing).to.be.true; // isEditing should have been set to true in the state


// mock = empty object that returns predefined behavior
// stub = data

describe('(Component) App', () => {
  it('should initialize', () => {
    const component = mount(<App/>);
    expect(component.prototype).to.not.be.null;
  });
});

describe('Note', () => {
  let note,
    component, notes
  beforeEach(() => {
    // Set starting global variables
    note = {
      id: 2,
      title: 'test note',
      description: "blabla"
    };
    notes = [
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
    ];
  });

  // Integration Tests
  it('UI should change to edit mode when edit mode is changed', () => {
    // When user clicks on editing button, UI changes to edit mode
    component = mount(<Note note={note}/>);
    component.setState({isEditing: true});

    //verify: a form has replaced the title and description with default value
    expect(component.find('.panel-title input')).to.not.be.null;
    expect(component.find('.panel-title input').node.value).to.equal(note.title);
    expect(component.find('.panel-body textarea').node.value).to.equal(note.description);
  })

  it('Should trigger toggleState when edit button is clicked & change state accordingly', () => {
    const toggleState = sinon.spy(Note.prototype, "toggleState"); // Spy on method toggleState BEFORE component is mounted
    component = mount(<Note note={note}/>); // mount it
    component.find('.edit-button').simulate('click'); // Simulate a click event on the edit button
    expect(toggleState).to.have.property('callCount', 1); // toggleState should have been called
    expect(component.state().isEditing).to.be.true; // isEditing should have been set to true in the state
  })

  it('Should create correctly in the state & show correctly on UI', () => {
    const component = mount(<App/>);
    // const initialUiLength = component.find('.panel-title').length;
    const initialStateLength = component.state().notes.length;

    let titleInput = component.find('.note-title');
    let descriptionInput = component.find('.note-description');
    titleInput.node.value = "My new note title!"; // Update value
    descriptionInput.node.value = "My new note description!"; // Update value
    titleInput.simulate("change"); // Update it in the DOM
    descriptionInput.simulate("change"); // Update it in the DOM
    component.find('.create-note').first().simulate('click'); // Click on "create note"

    // expect(component.find('.panel-title').length).to.equal(initialUiLength + 1); // Check if UI gets updated correctly
    expect(component.state().notes.length).to.equal(initialStateLength + 1); // Check if state gets updated correctly
  })

  it('Should update correctly in the state & show correctly on UI', () => {
    const component = mount(<App/>);
    component.find('.edit-button').first().simulate('click'); // Simulate a click event
    let title = component.find('.panel-title input')
    title.node.value = "Changing the note!" // Simulate edit
    title.simulate("change") // Update it in the DOM
    component.find('.save-button').first().simulate('click'); // Simulate a click event on the save button

    expect(component.find('.panel-title').first().text()).to.equal("Changing the note!") // Check if text is set right on UI
    expect(component.state().notes[0].title).to.equal("Changing the note!") // Check if text is set right in state
    expect(component.find('.save-button').length).to.equal(0) // Save buttons should be gone
  })

  it('Should delete correctly in the state & show correctly on UI', () => {
    const component = mount(<App/>);
    const initialUiLength = component.find('.panel-title').length;
    const initialStateLength = component.state().notes.length;
    component.find('.delete-button').first().simulate('click'); // Simulate a click event
    expect(component.find('.panel-title').length).to.equal(initialUiLength - 1); // Check if UI gets updated correctly
    expect(component.state().notes.length).to.equal(initialStateLength - 1); // Check if state gets updated correctly
  })

  // "Unit" Tests
  it('App should render correctly', () => {
    component = mount(<Note note={note}/>);
    //verify: rendered DOM values are what we expect (treated like plain html)
    expect(component).to.be.ok; // Component gets rendered w/o errors
    expect(component.hasClass("panel-body")); // Check for classes inside html
    expect(component.find('.panel-title').text()).to.equal(note.title); // Check if text is set right
  })

  it('function findNote(id) should find the right note when given an id', () => {
    const component = mount(<App/>);
    component.setState({notes: notes});
    expect(component.node.findNote(1)).to.equal(notes[0]);
  })

  it('function findIndex(note) should retrieve the right index in the state', () => {
    const component = mount(<App/>);
    component.setState({notes: notes});
    expect(component.node.findIndex(component.state().notes[2])).to.equal(2);
  })

  it('function updateNote(newNote) should update the note correctly', () => {
    const component = mount(<App/>);
    component.setState({notes: notes});
    component.node.updateNote(note); // Pass in a new note with id of 2 with updated title & description
    var index = component.node.findIndex(note); // Get the index in the state
    expect(component.state().notes[index]).to.equal(note); // Make sure the element at index is the new note
  })
});

// TESTING API
// Return a value based on input condition: it is relatively easy to test, as input can be defined and results can be authenticated
// Does not return anything: When there is no return value, behavior of API on the system to be checked
// Trigger some other API/event/interrupt: If output of an API triggers some event or interrupt, then those events and interrupt listeners should be tracked
// Update data structure: Updating data structure will have some outcome or effect on the system, and that should be authenticated
// Modify certain resources
// describe('API', () => {
//   it('Should get all dinosaurs correctly', () => {
//     var apiPromise = API.getAllDinosaurs('https://dinosaur-api.herokuapp.com/dinosaurs.json')
//     apiPromise.then((data) => {
//       debugger
//     })
//   });
// });
