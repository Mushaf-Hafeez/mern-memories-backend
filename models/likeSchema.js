const mongoose = require('mongoose')

const likeSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post"
    },
})

module.exports = mongoose.model('Like', likeSchema)