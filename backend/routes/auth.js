const express = require("express")
const router = express.Router()
const authController = require("../controllers/authController")
const validate = require("../middleware/validate")
const { registerSchema, loginSchema } = require("../validation/schemas")

// --- REGISTER A NEW USER ---
router.post("/register", validate(registerSchema), authController.register)

// --- LOGIN AN EXISTING USER ---
router.post("/login", validate(loginSchema), authController.login)

module.exports = router
