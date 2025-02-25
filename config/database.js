const mongoose = require('mongoose')
require('dotenv').config()

const connectDB = () => {
    mongoose.connect(process.env.DATABASE_URL)
    .then(() => console.log('database connected.'))
    .catch((error) => {
        console.log('database connection failed: ', error.message)
        process.exit(1)
    })
}

module.exports = connectDB