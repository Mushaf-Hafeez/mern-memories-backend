const express = require('express')
const router = express.Router()

const { auth } = require('../middlewares/Auth')
const { postLike } = require('../controllers/Like')

router.put('/like/:postId', auth, postLike)

module.exports = router