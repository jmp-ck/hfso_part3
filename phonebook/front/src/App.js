import { useState, useEffect } from 'react'
import Persons from './components/Persons'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import personService from './services/persons'
import Notification from './components/Notification'

const App = () => {

  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newPhone, setNewPhone] = useState('')
  const [newFilter, setNewFilter] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [classMessage, setClassMessage] = useState('')


  const hook = () => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
      .catch(error => {
        handleMessages('error', error.response)
      })
  }
  useEffect(hook, [])

  const handleNameChange = (event) => setNewName(event.target.value)

  const handlePhoneChange = (event) => setNewPhone(event.target.value)

  const handleFilterChange = (event) => setNewFilter(event.target.value)
  const includesCaseInsensitive = (str, searchString) => new RegExp(searchString, 'i').test(str)
  const personsToShow = persons.filter(person => includesCaseInsensitive(person.name, newFilter))

  const addPerson = (event) => {
    event.preventDefault()
    if (!checkNameExist())
      addNewPerson()
    else
      updatePhone()
  }
  const addNewPerson = () => {
    const personObject = {
      name: newName,
      number: newPhone,
      date: new Date().toISOString(),
    }
    personService
      .create(personObject)
      .then(returnedPerson => {
        handleMessages('success', `Person '${newName}' was added`)
        setPersons(persons.concat(returnedPerson))
        setNewName('')
        setNewPhone('')
      })
      .catch(error => {
          handleMessages('error', `Person '${newName}' was not added`)
          //console.log(`${personObject.name} wasn't added`, error)
      })
  }
  const checkNameExist = () => {
    return persons.find((person) => { return person.name === newName ? true : false })
  }

  const updatePhone = () => {
    const person = persons.find(n => n.name === newName)
    if (window.confirm('User ' + person.name + ' already exists. Update phone number ?')) {
      const changedPerson = { ...person, number: newPhone }
      personService
        .update(person.id, changedPerson)
        .then(returnedPerson => {
          //console.log('number updated')
          handleMessages('success', `Person '${person.name}' number updated`)
          setPersons(persons.map(user => user.id !== person.id ? user : returnedPerson))
          setNewName('')
          setNewPhone('')
        })
        .catch(error => {
            handleMessages('error', `Person '${person.name}' was already removed from the server`)
          //console.log(`${person.name} number wasn't updated`, error)
        })
    }
  }

  const deletePerson = (id, name) => {
    if (window.confirm('Delete ' + name + ' ?')) {
      personService
        .deletePerson(id)
        .then(response => {
          handleMessages('success', `Person '${name}' was deleted`)
          setPersons(persons.filter((person) => person.id !== id))
          //console.log('person' + name +  ' deleted...')
        })
        .catch(error => {
            handleMessages('error', `Person '${name}' was already removed from the server`)
            //console.log(`${name} number wasn't deleted`, error)
        })
    }
  }

  const handleMessages = (classMsg, msg) => {
    setClassMessage(classMsg)
    setErrorMessage(msg)
    setTimeout(() => {
      setErrorMessage(null)
    }, 5000)
  }

  return (
    <div>
      <h2>Phonebook</h2>

      <Notification message={errorMessage} classMsg={classMessage} />

      <h3>Filter</h3>
      <Filter filter={newFilter} change={handleFilterChange} />

      <h3>Add New</h3>
      <PersonForm submit={addPerson} name={newName} changeName={handleNameChange} number={newPhone} changePhone={handlePhoneChange} />

      <h3>Numbers</h3>
      <Persons list={personsToShow} handleDelete={deletePerson} />
    </div>
  )
}

export default App
