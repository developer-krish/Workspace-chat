const validate = (schema) => (req, res, next) => {
    try {
        schema.parse({
            body: req.body,
            query: req.query,
            params: req.params,
        })
        next()
    } catch (error) {
        if (error.errors) {
            const formattedErrors = error.errors.map((err) => ({
                field: err.path.join(".").replace(/^(body|query|params)\./, ""),
                message: err.message,
            }))

            return res.status(400).json({
                message: formattedErrors.map(e => `${e.field}: ${e.message}`).join(", "),
                errors: formattedErrors,
            })
        }
        next(error)
    }
}

module.exports = validate
