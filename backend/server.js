const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const dotenv = require("dotenv")
const http = require("http")
const initSocket = require("./socket")
const logger = require("./utils/logger")
const errorHandler = require("./middleware/errorMiddleware")
const AppError = require("./utils/appError")

// Load environment variables from .env file
dotenv.config()

// --- ENVIRONMENT VARIABLE VALIDATION (FAIL-FAST) ---
const requiredEnvVars = ["MONGO_URI", "JWT_SECRET"]
const missingEnvVars = requiredEnvVars.filter((varName) => !process.env[varName])

if (missingEnvVars.length > 0) {
    logger.error("================================================================================")
    logger.error("CRITICAL STARTUP ERROR: Missing required environment configuration.")
    logger.error(`The following environment variables are missing: ${missingEnvVars.join(", ")}`)
    logger.error("================================================================================")
    logger.error("HOW TO RESOLVE:")
    logger.error("1. Create a '.env' file in the 'backend' folder.")
    logger.error("2. Add the missing environment variables as defined in the README.md file:")
    logger.error("   MONGO_URI=mongodb+srv://<username>:<password>@cluster...")
    logger.error("   JWT_SECRET=your_long_random_jwt_signing_key_here")
    logger.error("================================================================================")
    process.exit(1)
}

const app = express()
const server = http.createServer(app)

// --- MIDDLEWARE ---
app.use(
    cors({
        origin: "*", // In production, this should be restricted to specific allowed domains
        methods: ["GET", "POST", "PUT", "DELETE"],
    }),
)
app.use(express.json())

// --- MONGODB CONNECTION & RESILIENCE ---
const mongoURI = process.env.MONGO_URI

mongoose.connection.on("connected", () => {
    logger.info("✅ Connected to MongoDB Atlas successfully!")
})

mongoose.connection.on("error", (err) => {
    logger.error("❌ MongoDB connection error event:", err)
})

mongoose.connection.on("disconnected", () => {
    logger.warn("⚠️ MongoDB connection disconnected. Attempting automatic reconnection...")
})

// Mongoose automatically handles connection retry logic, but logging helps operators monitor it
mongoose.connect(mongoURI).catch((err) => {
    logger.error("❌ Initial MongoDB connection failure:", err)
})

// --- API ROUTES ---
app.use("/api/auth", require("./routes/auth"))
app.use("/api/workspaces", require("./routes/workspace"))
app.use("/api/channels", require("./routes/channel"))
app.use("/api/messages", require("./routes/message"))

// Unmatched routes fallback
app.use((req, res, next) => {
    next(new AppError(`Route ${req.method} ${req.originalUrl} not found on this server`, 404))
})

// --- GLOBAL ERROR HANDLING MIDDLEWARE ---
// Handles all synchronous/asynchronous errors caught by Express or our asyncHandler wrapper
app.use(errorHandler)

// --- SOCKET.IO SETUP ---
initSocket(server)

// --- START SERVER ---
const PORT = process.env.PORT || 10000 // Render prefers 10000, fallback to 5000 is typical but 10000 is used here
server.listen(PORT, () => {
    logger.info(`🚀 Server is running on port ${PORT}`)
})
