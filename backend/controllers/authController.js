const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const User = require("../models/User")
const AppError = require("../utils/appError")
const asyncHandler = require("../middleware/asyncHandler")

// --- REGISTER A NEW USER ---
exports.register = asyncHandler(async (req, res, next) => {
    const { username, email, password } = req.body

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
        return next(new AppError("User already exists", 400))
    }

    // Scramble (hash) the password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // Create the new user in the database
    const newUser = new User({
        username,
        email,
        password: hashedPassword,
    })

    await newUser.save()
    res.status(201).json({ message: "User registered successfully" })
})

// --- LOGIN AN EXISTING USER ---
exports.login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body

    // Find the user by email
    const user = await User.findOne({ email })
    if (!user) {
        return next(new AppError("Invalid credentials", 400))
    }

    // Compare the typed password with the hashed password in the DB
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
        return next(new AppError("Invalid credentials", 400))
    }

    // Create the JWT
    const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET,
        { expiresIn: "7d" },
    )

    res.status(200).json({
        message: "Login successful",
        token: token,
        user: { id: user._id, username: user.username, email: user.email },
    })
})
