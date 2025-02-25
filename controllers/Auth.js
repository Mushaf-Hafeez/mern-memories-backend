const User = require('../models/userSchema')
const bcrypt = require('bcrypt')
const JWT = require('jsonwebtoken')
require('dotenv').config()

// Sign-in handler
exports.signin = async (req, res) => {
    const { firstName, lastName, email, password, confirmPassword } = req.body;

    try {
        // Validate input
        if (!firstName || !lastName || !email || !password || !confirmPassword) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all the details.'
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User already exists with this email.'
            });
        }

        // Check password match
        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: 'Passwords do not match.'
            });
        }

        // Hash password
        const encryptedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = await User.create({
            name: `${firstName} ${lastName}`,
            email,
            password: encryptedPassword
        });

        return res.status(201).json({
            success: true,
            data: newUser,
            message: 'Sign-in successful.'
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Error while signing in: ${error.message}`
        });
    }
};


// Login handler
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Validate input
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email/password.'
            });
        }

        // Find user
        const user = await User.findOne({ email }).lean();
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Please sign up before logging in.'
            });
        }

        // Compare password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({
                success: false,
                message: 'Incorrect password.'
            });
        }

        // Generate JWT token
        const payload = { id: user._id, email: user.email };
        const token = JWT.sign(payload, process.env.JWT_SECRET, { expiresIn: "2d" });

        // Remove password from response
        delete user.password;
        user.token = token;

        return res.status(200).json({
            success: true,
            data: user,
            message: 'Login successful.'
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Error while logging in: ${error.message}`
        });
    }
};
