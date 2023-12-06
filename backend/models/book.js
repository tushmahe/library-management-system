const mongoose = require('mongoose')

const BookSchema = new mongoose.Schema({
    bookPhoto: {
        type: String,
        // required: true,      
    },
    bookName: {
        type: String,
        required: true,
    },
    publicationYear: {
        required: true,
        type: String,
    },
    author: {
        type: String,
        required: true,
    },
    bookDescription: {
        type: String,
        required: true,
    },
    availability: {
        type: Boolean,
        required: true,
    },
    category:{
        type: mongoose.Types.ObjectId,
        ref: 'Category'
    },
    availableCopies: {
        type: Number,
        required: true,
        default: 0,
    },
})

module.exports = mongoose.model('Book', BookSchema)