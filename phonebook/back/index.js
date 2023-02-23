require('dotenv').config()
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const Person = require('./models/person')
const app = express()
app.use(express.static('build'))
app.use(express.json())
app.use(cors())
morgan.token('rbody', function (req) {
  return `${JSON.stringify(req.body)}`
})
app.use(morgan(':method --- :url --- :status --- :response-time ms --- :req[header] --- :rbody'))

// let persons = [
//     {
//       "id": 1,
//       "name": "Arto Hellas",
//       "number": "040-123456"
//     },
//     {
//       "id": 2,
//       "name": "Ada Lovelace",
//       "number": "39-44-5323523"
//     },
//     {
//       "id": 3,
//       "name": "Dan Abramov",
//       "number": "12-43-234345"
//     },
//     {
//       "id": 4,
//       "name": "Mary Poppendieck",
//       "number": "39-23-6423122"
//     }
// ]


app.get('/info', (request, response) => {
  Person.find({}).count().then(persons => {
    // console.log('Peoplz',persons)
    response.send('<p>Phonebook has info for ' + persons + ' people</p><p>' + new Date(Date.now()).toUTCString() + '</p>')
  })
})

// app.get('/api/persons', (request, response) => {
//   response.json(persons)
// })
app.get('/api/persons', (request, response) => {
  Person.find({})
    .then(persons => {
      // console.log('persons', persons)
      response.json(persons)
    })
})

// app.get('/api/persons/:id', (request, response) => {
//   const id = Number(request.params.id)
//   const person = persons.find(person => person.id === id)
//   // console.log(person)
//   if (person) {
//     response.json(person)
//   } else {
//     response.status(404).end()
//   }
// })
app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person)
        response.json(person)
      else {
        response.status(400).json({ error: 'person not found' })
      }
    })
    .catch(error => next(error))
})

// app.delete('/api/persons/:id', (request, response) => {
//   const id = Number(request.params.id)
//   persons = persons.filter(person => person.id !== id)
//   response.status(204).end()
// })
app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

// const generateRandomId = (max) => Math.floor(Math.random() * max)
// app.post('/api/persons', (request, response) => {
//   // console.log('header', request.headers)
//   const body = request.body
//   // console.log(body)
//   if (!body.name) {
//     return response.status(400).json({
//       error: 'name is missing'
//     })
//   }
//   if (!body.number) {
//     return response.status(400).json({
//       error: 'number is missing'
//     })
//   }
//   const nameExists = persons.find(person => person.name === body.name)
//   if (nameExists) {
//     return response.status(400).json({
//       error: 'name must be unique'
//     })
//   }
//   const person = {
//     id: generateRandomId(10000),
//     name: body.name,
//     number: body.number
//   }
//   persons = persons.concat(person)
//   response.json(person)
// })
app.post('/api/persons', (request, response) => {
  const body = request.body
  if (!body.name) {
    return response.status(400).json({
      error: 'name is missing'
    })
  }
  if (!body.number) {
    return response.status(400).json({
      error: 'number is missing'
    })
  }

  Person.findOne({ name: body.name })
    .then(person => {
      // console.log('Who's there ?', person)
      if (person)
        return response.status(400).json({
          error: 'name must be unique'
        })
    })

  const person = new Person({
    name: body.name,
    number: body.number
  })
  person.save()
    .then(savedPerson => {
      response.json(savedPerson)
    })
})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body
  const person = {
    name: body.name,
    number: body.number
  }
  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})

const errorHandler = (error, request, response, next) => {
  console.error(error.message)
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }
  next(error)
}
// must be last loaded middleware
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
