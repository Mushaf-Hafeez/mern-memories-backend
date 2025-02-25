const Post = require('../models/postSchema')
const Like = require('../models/likeSchema')
const Comment = require('../models/commentSchema')
const User = require('../models/userSchema')
const mongoose = require('mongoose')

exports.postLike = async (req, res) => {

    const postId = req.params.postId
    const id = req.body.id

    try {

        // validation
        if (!id || !postId) {
            return res.status(401).json({
                success: false,
                message: "id or post id not found."
            })
        }

        // validation on the post id
        if (!mongoose.Types.ObjectId.isValid(postId)) {
            return res.status(401).json({
                success: false,
                message: "Post id is not valid."
            })
        }

        // check if there is a document exists
        const doesExists = await Like.findOne({ user: id, post: postId })

        // if there is no like of that user on this post than like the post
        if (!doesExists) {

            const likeResponse = await Like.create({ user: id, post: postId })

            if (!likeResponse) {
                return res.status(500).json({
                    success: false,
                    message: "Could not like the post."
                })
            }

            await Post.findByIdAndUpdate({ _id: postId }, { $push: { likes: likeResponse._id } })

            return res.status(200).json({
                success: true,
                message: "Post has been liked."
            })

        }

        const unlikeResponse = await Like.findOneAndDelete({ user: id, post: postId })

        if (!unlikeResponse) {
            return res.status(500).json({
                success: false,
                message: "Error while unliking the post."
            })
        }

        await Post.findByIdAndUpdate({ _id: postId }, { $pull: { likes: doesExists._id } })

        return res.status(200).json({
            success: true,
            message: "Post has been unliked."
        })

    } catch (error) {
        console.log('Error in the like post controller: ', error.message)
        return res.status(500).json({
            success: true,
            message: 'Error in the like post controller.'
        })
    }
}