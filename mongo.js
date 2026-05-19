const mongoose = require('mongoose')

if(process.argv.length < 3) {
    console.log('please input the password')
    process.exit(1)
}

const password = process.argv[2]

const url = `mongodb://JCRD:${password}@ac-iovzuce-shard-00-00.zmhcbwe.mongodb.net:27017,ac-iovzuce-shard-00-01.zmhcbwe.mongodb.net:27017,ac-iovzuce-shard-00-02.zmhcbwe.mongodb.net:27017/phonebook?ssl=true&replicaSet=atlas-jbin4t-shard-0&authSource=admin&appName=Cluster0`

mongoose.set('strictQuery',false)

mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: String,
    number: String
})

const Person = mongoose.model('Person', personSchema)

if(process.argv.length === 3){
    Person.find({}).then(result => {
        result.forEach(person => console.log(`${person.name} ${person.number}`))
        mongoose.connection.close()
    })
}
else{
    const person = new Person({
    name: process.argv[3],
    number: process.argv[4]
})

person.save().then(result => {
    console.log(`added ${result.name} number ${result.number} to phonebook`)
    mongoose.connection.close()
})
}