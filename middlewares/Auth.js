const JWT = require('jsonwebtoken')
require('dotenv').config()

exports.auth = async (req, res, next) => {
    try {

        const token = req.header("Authorization").replace("Bearer ", "")

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Token is missing.'
            })
        }

        const decodedData = JWT.verify(token, process.env.JWT_SECRET)

        if (!decodedData) {
            return res.status(401).json({
                success: false,
                message: 'Unauhtorized user.'
            })
        } else {
            req.body.id = decodedData.id
            req.body.email = decodedData.email
            next()
        }

    } catch (error) {
        console.log('Error in the auth middleware: ', error.message)
        return res.status(401).json({
            success: false,
            message: 'Invalid token.'
        })
    }
}
