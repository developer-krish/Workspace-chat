class AppError extends Error {
    constructor(message, statusCode) {
        super(message)
        this.statusCode = statusCode
        this.isOperational = true // Identifies it as a known API error rather than a system crash

        Error.captureStackTrace(this, this.constructor)
    }
}

module.exports = AppError
