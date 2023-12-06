const express = require('express')
const router = express.Router()

const { auth, isUser } = require('../middleware/auth.js')
const { reserveBook, deleteBook, editBook } = require('../controllers/reservedBook.js')

router.put('/dd', auth, isUser, reserveBook)
router.delete('/deleteReserveBook/:id', auth, isUser, deleteBook)
router.put('/editBook/:id',auth,isUser,editBook)

module.exports = router;
