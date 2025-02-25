const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post"
    },
    text: {
        type: String,
        required: true,
        trim: true,
        maxLength: 50
    }

})

module.exports = mongoose.model('Comment', commentSchema)