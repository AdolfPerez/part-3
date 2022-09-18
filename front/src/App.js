import React, { useState, useEffect } from 'react'
import Notification from './components/Notification'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import personsService from './services/persons'

const App = () => {
  const [ persons, setPersons ] = useState([])
  const [ show, setShow ] = useState([])
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')
  const [ message, setMessage ] = useState(null)
  const [ color, setColor ] = useState('')

  const showMassageCleanInputsAndGetCurrentData = (msg='', color='green') => {
    setColor(color)
    setMessage(msg)
    if (color === 'green') {
      setNewName('')
      setNewNumber('')
    }
    personsService
    .getAll()
    .then(returnedPersons => {
      setPersons(returnedPersons)
      setShow(returnedPersons)})
    setTimeout(() => setMessage(null), 3000)
  }

  useEffect(() => { showMassageCleanInputsAndGetCurrentData() }, [])

  const addPerson = event => {
    event.preventDefault()
    if (!newName && !newNumber) return alert(`add a name and a number`)
    if (!newName) return alert(`add a name`)
    if (!newNumber) return alert (`add a number`)
    const exist = persons.filter(person => newName === person.name)[0]
    if (exist) {
      if (window.confirm(`${newName} is already addedd to phonebook, replace the old number with a new one?`))
        personsService
        .update(exist.id, { ...exist, number: newNumber })
        .then(response => showMassageCleanInputsAndGetCurrentData(`Updated ${newName}`))
        .catch(error => showMassageCleanInputsAndGetCurrentData(`${error.response.data.error}`, `red`))
    } else {
      const personObject = { name: newName, number: newNumber }
      personsService
      .create(personObject)
      .then(response => showMassageCleanInputsAndGetCurrentData(`Added ${newName}`))
      .catch(error => showMassageCleanInputsAndGetCurrentData(`${error.response.data.error}`, `red`))
    }
  }

  const handlePersonNameChange = event => setNewName(event.target.value)

  const handlePersonNumberChange = event => setNewNumber(event.target.value)

  const filter = event => setShow(persons.filter(person => person.name.toLowerCase().slice(0, event.target.value.length) === event.target.value.toLowerCase()))

  const deleteOne = person => (window.confirm(`Delete ${person.name}?`)) ?
      personsService
      .deleteOne(person.id)
      .then(response => showMassageCleanInputsAndGetCurrentData())
      : false

  return <div>
    <h2>Phonebook</h2>
    <Notification message={message} color={color} />
    <Filter filter={filter} />
    <h2>add a new</h2>
    <PersonForm
    addPerson={addPerson}
    newName={newName}
    handlePersonNameChange={handlePersonNameChange}
    newNumber={newNumber}
    handlePersonNumberChange={handlePersonNumberChange}
    />
    <h2>Numbers</h2>
    <Persons show={show} deleteOne={deleteOne} />
  </div>
}

export default App;
