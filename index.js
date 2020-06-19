const express = require('express')

const app = express()
app.use(express.json())

let persons = [
    {
        name: "Ada Lovelace",
        number: "39-44-5323521",
        id: 2
    },
    {
        name: "Dan Abramov",
        number: "12-43-234345",
        id: 3
    },
    {
        name: "Mary Poppendieck",
        number: "39-23-6423122",
        id: 4
    }
]

app.get('/info', (req, res) => {
    res.send(`<p>Phonebook has info for ${persons.length} people </p>
              <p>${new Date()}\`</p>`)
})

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(note => note.id === id)
    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})

const generateId = () => {
    return Math.floor(Math.random() * 99999)
}

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

    const note = {
        name: body.name,
        number: body.number,
        date: new Date(),
        id: generateId(),
    }

    persons = persons.concat(note)

    response.json(note)
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})