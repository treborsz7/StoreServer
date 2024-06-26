const mongoose = require('mongoose')


if (process.argv.length < 3) {
    console.log('Please provide the password as an argument: node mongo.js <password>')
    process.exit(1)
}

const password = process.argv[2]


mongoose.connect(url)

const noteSchema = new mongoose.Schema({
    description: String,
    position: Number,
    enabled: Boolean,
    tipe: String,
    items: Array
})

const Section = mongoose.model('Section', noteSchema)

const section = new Section({
    description: 'Ofertas',
    position: 0,
    enabled: true,
    tipe: "items",
    items: []
})

section.save().then(result => {
    console.log('section saved!')
    mongoose.connection.close()
})
