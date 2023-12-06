const mongoose = require('mongoose')

const reservedBookSchema = new mongoose.Schema({
    book: {
        type: mongoose.Types.ObjectId,
        ref:'Book'
    },
    reservedDate: {
        type: Date,
        default: Date.now()
    },
    noOfCopies: {
        type: Number,
    }
}, {
    timestamps: true
})


module.exports = mongoose.model('ReservedBook', reservedBookSchema)