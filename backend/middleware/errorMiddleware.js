const logger = require("../utils/logger")

const errorHandler = (err, req, res, next) => {
    // Log the error stack internally
    logger.error(err.stack || err.message || err)

    const statusCode = err.statusCode || 500
    const message = err.message || "Internal Server Error"

    // In production, do not leak raw programming or database errors to the client
    const isProduction = process.env.NODE_ENV === "production"
    
    res.status(statusCode).json({
        message: statusCode === 500 && isProduction
            ? "An unexpected database or server error occurred"
            : message
    })
}

module.exports = errorHandler
