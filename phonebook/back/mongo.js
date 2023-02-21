const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]
const url = `mongodb+srv://user:${password}@cluster0.zhoniwa.mongodb.net/phonebookApp?retryWrites=true&w=majority`

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
    date: String
  })
const Person = mongoose.model('Person', personSchema)

mongoose.set('strictQuery',false)
mongoose.connect(url)

if (process.argv.length>4) {
  const person = new Person({
    name: process.argv[3],
    number: process.argv[4],
    date: new Date().toISOString()
  })
  person.save().then(result => {
    console.log(`added ${person.name} number ${person.number} to phonebook`)
    mongoose.connection.close()
  })
} else {
  Person.find({}).then(result => {
    result.forEach(person => {
      console.log(person)
    })
    mongoose.connection.close()
  })
}
