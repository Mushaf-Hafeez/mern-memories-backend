const User = require('../models/userSchema')
const Post = require('../models/postSchema')
const Like = require('../models/likeSchema')
const Comment = require('../models/commentSchema')

const mongoose = require('mongoose')

const cloudinary = require('cloudinary').v2
require('dotenv').config()

const isFileSupported = (type, types) => {
    return types.includes(type)
}

const uploadImage = async (image) => {
    const options = {
        folder: process.env.CLOUDINARY_FOLDER_NAME,
        resource_type: 'auto',
        quality: 50
    }

    return await cloudinary.uploader.upload(image, options)
}

const deleteImage = async (id) => {
    const options = {
        resource_type: 'image'
    }
    return await cloudinary.uploader.destroy(id, options)
}

// handler function for creating a post
exports.createPost = async (req, res) => {

    const { id, email, details } = req.body
    const image = req.files.image

    try {

        // validation
        if (!details || !image) {
            return res.status(404).json({
                success: false,
                message: "Please provide all the required data."
            })
        }

        // checking if the file type is supported or not
        const fileType = isFileSupported(image.name.split(".")[1], ['png', 'jpg', 'jpeg'])

        if (!fileType) {
            return res.status(401).json({
                success: false,
                message: "File type is not supported."
            })
        }

        // upload image to cloudinary
        const response = await uploadImage(image.tempFilePath)

        console.log('Cloudinary res: ', response)

        if (!response) {
            return res.status(500).json({
                success: false,
                message: 'Error while uploadig image to cloudinary.'
            })
        }

        const postDetails = await Post.create({
            user: id,
            image: response.secure_url,
            image_id: response.public_id,
            details,
        })

        if (postDetails) {
            await User.findByIdAndUpdate({ _id: id }, { $push: { posts: postDetails._id } })
        }

        return res.status(200).json({
            success: true,
            data: postDetails,
            message: 'Post has been created.'
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message,
            message: "Error in the create post controller."
        })
    }
}

// delete post handler function
exports.deletePost = async (req, res) => {

    const { id } = req.body
    const { postId } = req.params

    try {

        if (!postId) {
            return res.status(401).json({
                success: false,
                message: 'provide the id of the post to be deleted.'
            })
        }

        const postDetails = await Post.findById({ _id: postId })

        if (postDetails) {
            await deleteImage(postDetails.image_id)
        }

        const response = await Post.findByIdAndDelete(postId)

        if (!response) {
            return res.status(500).json({
                success: false,
                message: 'Error while deleting post.'
            })
        }

        await User.findByIdAndUpdate({ _id: id }, { $pull: { posts: postId } })

        return res.status(200).json({
            success: true,
            message: 'post has been deleted successfully.'
        })


    } catch (error) {
        return res.status(401).json({
            success: false,
            error: error.message,
            message: 'Error with delete post handler function'
        })
    }
}

// get post handler function
exports.getPost = async (req, res) => {

    const postId = req.params.id

    try {

        if (!postId) {
            return res.status(400).json({
                success: false,
                message: 'Post ID is missing.'
            })
        }

        // Validate postId as a valid MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(postId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid Post ID format.'
            });
        }

        const postDetails = await Post.findById(postId).populate('user').populate('likes').populate({ path: 'comments', populate: { path: 'user' } }).exec()

        if (!postDetails) {
            return res.status(404).json({
                success: false,
                message: 'Post not found or Invalid post ID.'
            })
        }


        return res.status(200).json({
            success: true,
            data: postDetails,
            message: 'Post fetched successfully.'
        })

    } catch (error) {
        console.log(error.message)
        return res.status(500).json({
            success: false,
            message: 'Error in get post handler function.'
        })
    }
}

// get all posts handler function
exports.posts = async (req, res) => {
    try {

        const response = await Post.find().populate("user").populate("likes").populate("comments").exec()


        if (!response) {
            return res.status(404).json({
                success: false,
                message: "Posts not found."
            })
        }

        return res.status(200).json({
            success: true,
            data: response,
            message: "Posts have been fetched successfully."
        })

    } catch (error) {
        console.log('Error in the posts handler function: ', error.message)
        return res.status(500).json({
            success: false,
            message: "Error in the posts handler function."
        })
    }
}

exports.getMyPosts = async (req, res) => {
    const id = req.body.id

    try {

        if (!id) {
            return res.status(401).json({
                success: false,
                message: "id not found."
            })
        }

        const userDetails = await Post.find({ user: id }).populate('user').populate('likes').populate('comments').exec()

        if (!userDetails) {
            return res.status(404).json({
                success: false,
                message: "posts not found."
            })
        }

        return res.status(200).json({
            success: true,
            data: userDetails,
            message: "posts has been fetched successfully."
        })

    } catch (error) {
        console.log('Error in the get all my posts handler function: ', error.message)
        return res.status(500).json({
            success: false,
            message: "Error in the get all my posts handler function."
        })
    }
}