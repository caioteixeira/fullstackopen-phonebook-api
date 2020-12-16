require('dotenv').config()

const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const { response } = require('express')

const Person = require('./models/person')

const app = express()
morgan.token('body', function (req, res) { return JSON.stringify(req.body) })
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(cors())
app.use(express.static('build'))

app.use(express.json())

app.get('/info', (req, res) => {
    Person.find({}).then(persons => {
        res.send(`<p>Phonebook has info for ${persons.length} people </p>
              <p>${new Date()}\`</p>`)
    })
})

app.get('/api/persons', (req, res) => {
    Person.find({}).then(persons => {
        res.json(persons.map(person => person.toJSON()))
    })
})

app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id).then(person => {
        if(person)
        {
            response.json(person.toJSON())
        }
        else
        {
            response.status(404).end()
        }
    }).catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response) => {
    Person.findByIdAndDelete(request.params.id)
    .then(res => {
        response.status(204).end()
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body

    if (!body.name) {
        return response.status(400).json({
            error: 'name missing'
        })
    }

    if (!body.number) {
        return response.status(400).json({
            error: 'number missing'
        })
    }

    const person = {
        name: body.name,
        number: body.number
    }

    Person.findByIdAndUpdate(request.params.id, person, {new: true})
    .then(updated => {
        response.json(updated.toJSON())
    })
    .catch(error => next(error))
})

app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body.name) {
        return response.status(400).json({
            error: 'name missing'
        })
    }

    if (!body.number) {
        return response.status(400).json({
            error: 'number missing'
        })
    }

    const person = new Person({
        name: body.name,
        number: body.number,
        date: new Date(),
    })

    person.save().then(savedPerson => {
        response.json(savedPerson.toJSON())
    })
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
    console.error(error.message)
  
    if (error.name === 'CastError') {
      return response.status(400).send({ error: 'malformatted id' })
    } 
  
    next(error)
}
  
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})