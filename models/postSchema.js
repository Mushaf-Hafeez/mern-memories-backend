const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    image: {
        type: String,
        required: true
    },
    image_id: {
        type: String,
        required: true
    },
    details: {
        type: String,
        trim: true,
        maxLength: 255,
        required: true
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Like'
    }],
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    }]
})

module.exports = mongoose.model('Post', postSchema)