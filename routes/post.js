const express = require('express')
const router = express.Router()

// middleware handler funtion
const { auth } = require('../middlewares/Auth') 
const { createPost, getPost, deletePost, posts, getMyPosts } = require('../controllers/Post')


router.post('/create', auth, createPost)
router.get('/post/:id',  getPost)
router.get('/posts',  posts)
router.delete('/delete/:postId', auth, deletePost)
router.get('/myPosts', auth, getMyPosts)

module.exports = router