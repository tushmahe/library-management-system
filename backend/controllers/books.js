const mongoose = require('mongoose')
const Book = require('../models/book.js')
const Category = require('../models/category.js')

// User routes

exports.getBook = async (req, res) => {
    try {

        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                message: "Please provide id",
                success: false
            })
        }

        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);

        const book = await Book.findById(id);

        if (!book) {
            return res.status(404).json({
                message: "Couldn't find required book by given id",
                success: false
            })
        }

        return res.status(200).json({
            message: "Book fetched Successfully",
            success: true
        })

    } catch (error) {
        console.log('/getBook', error)
        return res.status(500).json({
            message: 'Something went wrong while finding book details',
            success: false
        })
    }
}

exports.showAllBooks = async (req, res) => {
    try {
        const books = Book.find({}, {
            bookName: true,
            bookDescription: true,
            publicationYear: true,
            author: true,
            availability: true,
            availableCopies: true,
        }).populate('category').exec();

        if (!books) {
            return res.status(400).json({
                message: 'No books found',
                success: true,
            })
        }

        return res.status(200).json({
            message: 'Books fetched Successfully',
            success: true,
            books
        })
    } catch (error) {
        console.log('/getAllBooks', error);
        return res.status(500).json({
            message: 'Something went wrong while finding all the books',
            success: false
        })
    }
}

//Admin routes

exports.createBook = async (req, res) => {
    try {
        const { bookName, bookDescription, publicationYear, author, availability, availableCopies, categoryId } = req.body;

        if (!bookName || !bookDescription || !publicationYear || !author || !availability || !availableCopies || !categoryId) {
            return res.status(400).json({
                message: "Please provide required details to create book",
                success: false,
            })
        }

        const category = await Category.findById(categoryId);

        if (!category) {
            return res.status(403).json({
                message: "Category not found",
                success: false
            })
        }

        const bookDetails = await Book.create({
            bookName, bookDescription, publicationYear, author, availability, availableCopies, categoryId
        })

        await Category.findByIdAndUpdate({ _id: categoryId }, {
            $push: {
                books: bookDetails._id
            }
        }, {
            new: true,
        })

        return res.status(201).json({
            success: true,
            message: "Book created Successfully",
            bookDetails
        })

    } catch (error) {
        console.log('createBook route', error)
        return res.status(500).json({
            message: 'Couldn\'t create book ',
            success: false
        })
    }
}

exports.editBookDetails = async (req, res) => {
    try {
        const { id } = req.params;

        const { bookName, bookDescription, publicationYear, author, availability, availableCopies, categoryId } = req.body;

        if (!id) {
            return res.status(404).json({
                message: "Please provide required details",
                success: false
            })
        }

        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);
        if (!mongoose.Types.ObjectId.isValid(categoryId)) return res.status(404).send(`No post with id: ${categoryId}`);

        const book = await Book.findById(id);
        if (!book) {
            return res.status(404).json({
                message: 'Couldn\'t find the book for the given id',
                success: false
            })
        }

        const updatedBookDetails = { bookName, bookDescription, publicationYear, author, availability, availableCopies, categoryId }

        const updatedBook = await Book.findByIdAndUpdate(id, updatedBookDetails, { new: true });

        return res.status(200).json({
            message: 'Updated Book Details Successfully',
            success: true,
            book: updatedBook
        })

    } catch (error) {
        console.log('/editBook', error)
        return res.status(500).json({
            message: "Something went wrong while editing book details",
            success: false,
        })
    }
}


exports.deleteBook = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);

        const bookDetails = Book.findById(id);
        if (!bookDetails) {
            return res.status(404).json({
                message: "No book details found by given id",
                success: false,
            })
        }

        const updateCategory = await Category.findByIdAndUpdate({ _id: bookDetails.category }, {
            $pull: { books: mongoose.Types.ObjectId(id) }
        },)

        if (!updateCategory) {
            return res.status(403).json({
                message: 'Couldn\'t update the category',
                success: false
            })
        }

        await Book.findByIdAndRemove(id);

        return res.status(200).json({
            message: 'Deleted Book Successfully',
            success: true,
        })

    } catch (error) {
        console.log('/deletePost', error)
        return res.status(500).json({
            message: 'Something went wrong while deleting details of book',
            success: false
        })
    }
}