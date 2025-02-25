const User = require('../models/userSchema')
const Post = require('../models/postSchema')
const Like = require('../models/likeSchema')
const Comment = require('../models/commentSchema')
const mongoose = require('mongoose')

exports.postComment = async (req, res) => {

    const postId = req.params.postId
    const { id, text } = req.body

    try {

        if (!id || !postId || !text) {
            return res.status(401).json({
                success: false,
                message: "post id or comment text not found."
            })
        }

        if (!mongoose.Types.ObjectId.isValid(postId)) {
            return res.status(400).json({
                success: false,
                message: "post id is not valid."
            })
        }

        const commentDetails = await Comment.create({
            user: id,
            post: postId,
            text,
        })

        if (!commentDetails) {
            return res.status(500).json({
                success: false,
                message: "Error while posting comment."
            })
        }

        await Post.findByIdAndUpdate({_id: postId}, { $push: { comments: commentDetails._id } }).exec()

        return res.status(200).json({
            success: true,
            message: "Comment has been posted successsfully."
        })

    } catch (error) {
        console.log('Error in the comment handler function: ', error.message)
        return res.status(500).json({
            success: false,
            message: "Error in the comment handler function."
        })
    }
}