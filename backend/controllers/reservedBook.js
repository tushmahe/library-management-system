const mongoose = require('mongoose')
const User = require('../models/user.js')
const ReservedBook = require('../models/reservedBooks.js')
const Book = require('../models/book.js')

exports.reserveBook = async (req, res) => {
    try {
        const { id } = req.params;
        const { noOfCopies } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);

        if (!noOfCopies) {
            return res.status(403).json({
                message: "Didn\'t specified number of copies",
                success: false
            })
        }

        const bookDetails = await Book.findById(id);
        if (!bookDetails) {
            return res.status(400).json({
                message: "Didn\'t find the book details with the given id",
                success: false
            })
        }

        const { _id } = req.user;

        const user = await User.findById(_id);
        if (!user) {
            return res.status(400).json({
                message: 'User not found with given id',
                success: false
            })
        }

        const reservedBook = await ReservedBook.create({
            book: bookDetails.bookName,
            noOfCopies
        })

        const updatedUser = await User.findByIdAndUpdate({ _id: _id }, {
            $push: {
                reservedBooks: reservedBook._id
            }
        }, { new: true })

        return res.status(200).json({
            message: 'Updated user reserved books successfully',
            success: true,
            updatedUser
        })

    } catch (error) {
        console.log('/reserveBook', error)
        return res.status(500).json({
            message: 'Something went wrong while reserving book'
        })
    }
}

exports.editBook = async (req, res) => {
    try {
        const { id } = req.params;
        const {noOfCopies} = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);

        const reservedBook = await ReservedBook.findById(id);
        if (!reservedBook) {
            return res.status(404).json({
                message: 'Reserved Book not found',
                success: false
            })
        }

        if(!noOfCopies){
            return res.status(404).json({
                message: 'Number of Copies not specified',
                success: false
            })
        }

        const updatedBook = await ReservedBook.findByIdAndUpdate({_id: id},{noOfCopies: noOfCopies},{new: true})

        return res.status(200).json({
            message: 'Updated book details successfully',
            success: true,
            book: updatedBook
        })
    } catch (error) {
        console.log('/editBook', error);
        return res.status(500).json({
            message: 'Something went wrong while editing book details',
            success: false
        })
    }
}

exports.deleteBook = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);

        const bookDetails = await ReservedBook.findById(id);
        if (!bookDetails) {
            return res.status(404).json({
                message: 'Book Details not found',
                success: false
            })
        }

        const { _id } = req.user;
        const userDetails = await User.findById(_id);

        await User.findByIdAndUpdate({ _id: _id }, {
            $pull: {
                reservedBooks: bookDetails._id
            }
        }, { new: true })

        await Book.findByIdAndRemove(id);

        return res.status(200).json({
            message: 'Successfully Removed book from Reserved Books',
            success: false,
            user: userDetails
        })

    } catch (error) {
        console.log('/deleteReservedBook')
    }
}