require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

const app = express()

morgan.token('body', (req, res) => JSON.stringify(req.body))

app.use(express.static('dist'))
app.use(cors())
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => response.json(persons))
})

app.get('/api/persons/:id', (request, response) => {
    Person.findById(request.params.id)
        .then(person => {
            if(person) {
                response.json(person)
            } else {
                response.status(404).end()
            }
        })
        .catch(error => {
            console.log(error.message)
            response.status(400).end()
        })
})

app.get('/info', (request, response) => {
    const currentDate = new Date();
    response.send(`
        <div>
            Phonebook has info for ${Person.length} people
            <p>${currentDate.toString()}</p>
        </div>`)
})

const getRandomId = () => {
    const newId = Math.floor(Math.random() * (Number.MAX_SAFE_INTEGER - 0) + 0)
    const isRepeated = persons.find(person => person.id === newId)

    if(isRepeated) return getRandomId()

    return newId
}

app.post('/api/persons', (request, response) => {
    const body = request.body   
    
    if(!body) {
        return response.status(400).json({
            error: 'content missinng'
        })
    }

    if(!body.name) {
        return response.status(400).json({
            error: 'name missinng'
        })
    }

    if(!body.number) {
        return response.status(400).json({
            error: 'number missinng'
        })
    }

    const isNameRepeated = persons.some(person => person.name === body.name)
    if(isNameRepeated) {
        return response.status(400).json({
            error: 'name must be unique'
        })
    }

    const person = {
        id: getRandomId(),
        name: body.name,
        number: body.number
    }

    persons = persons.concat(person)

    response.json(person)
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})

const PORT = process.env.PORT
app.listen(PORT)
console.log(`Server running on port ${PORT}`)