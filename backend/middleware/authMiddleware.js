const jwt = require("jsonwebtoken")

module.exports = function (req, res, next) {
    const authHeader = req.header("Authorization")

    // Tokens must be sent in the format: "Bearer eyJhbGci..."
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res
            .status(401)
            .json({ message: "No token or invalid format, authorization denied" })
    }

    try {
        const token = authHeader.split(" ")[1]

        // Verify the token using our secret key
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        // Attach the decoded user data (like userId) to the request
        req.user = decoded

        next()
    } catch (err) {
        res.status(401).json({ message: "Token is not valid" })
    }
}
