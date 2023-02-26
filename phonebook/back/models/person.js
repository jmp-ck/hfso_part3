const mongoose = require('mongoose')
mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI
console.log('connecting to', url)

mongoose.connect(url)
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

function validator (val) {
  return /^\d{2,3}-\d{5,9}$/.test(val)
}
const custom = [validator, 'Path {PATH} is not a valid phone number ! (ex: 09-1234556 or 040-22334455)']

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    unique: true,
    required: true
  },
  number: {
    type: String,
    minLength: 8,
    validate: custom,
    required: true
  },
  date: String
})
personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)
