const mongoose = require('mongoose')
const Schema = mongoose.Schema
let userSchema = new Schema({
        id: {type: Number, required: true},
        first: {type: String, required: true},
        last: {type: String, required: true},
        email: {type: String, required: true},
        phone: {type: String, required: true},
        location: {type: String, required: true},
        hobby: {type: String, required: true},
        added: {type: Date, default: Date.now}

    },
    {
        collection: 'user'
    })

const User = mongoose.model('User', userSchema)

module.exports = User
