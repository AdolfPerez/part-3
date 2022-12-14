require('dotenv').config()
const express = require('express')
const app = express()
const Person = require('./models/person')
const morgan = require('morgan')
const cors = require('cors')

app.use(cors())
app.use(express.static('build'))
app.use(express.json())
app.use(
  morgan((tokens, req, res) =>
      [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, 'content-length'),
        '-',
        tokens['response-time'](req, res),
        'ms',
        JSON.stringify(req.body)
      ].join(' ')))

app.get('/info', (request, response) => Person.find({}).then(persons => response.send(`<p>Phonebook has info for ${persons.length} people</p><p>${new Date().toString()}</p>`)))

app.get('/api/persons', (request, response) => Person.find({}).then(persons => response.json(persons)))

app.get('/api/persons/:id', (request, response, next) => 
  Person.findById(request.params.id)
    .then(person => person ? response.json(person) : response.status(404).end())
    .catch(error => next(error)))

app.delete('/api/persons/:id', (request, response, next) =>
  Person.findByIdAndRemove(request.params.id)
    .then(result => response.status(204).end())
    .catch(error => next(error)))

app.post('/api/persons', (request, response, next) => {
  const body = request.body
  const person = new Person({
    name: body.name,
    number: body.number
  })
  person.save()
    .then(savedPerson => response.json(savedPerson.toJSON()))
    .catch(error => next(error))})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body
  const person = {
    name: body.name,
    number: body.number
  }
  Person.findByIdAndUpdate(request.params.id, person, { new: true, runValidators: true })
    .then(updatedPerson => updatedPerson ? response.json(updatedPerson): response.status(404).send({ error: `Information of ${person.name} has already been removed from server` }))
    .catch(error => next(error))})

const unknownEndpoint = (request, response) => response.status(404).send({ error: 'unknown endpoint' })
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  next(error)
}
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))