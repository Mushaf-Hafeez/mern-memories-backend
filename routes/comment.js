const express = require('express')
const router = express.Router()

const { auth } = require("../middlewares/Auth")
const { postComment } = require('../controllers/Comment')

router.post('/comment/:postId', auth, postComment)

module.exports = router