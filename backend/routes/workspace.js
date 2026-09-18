const express = require("express")
const router = express.Router()
const workspaceController = require("../controllers/workspaceController")
const authMiddleware = require("../middleware/authMiddleware")
const validate = require("../middleware/validate")
const { createWorkspaceSchema, joinWorkspaceSchema } = require("../validation/schemas")

// --- GET ALL WORKSPACES ---
router.get("/", authMiddleware, workspaceController.getWorkspaces)

// --- CREATE A NEW WORKSPACE ---
router.post("/", authMiddleware, validate(createWorkspaceSchema), workspaceController.createWorkspace)

// --- JOIN A WORKSPACE ---
router.post("/join", authMiddleware, validate(joinWorkspaceSchema), workspaceController.joinWorkspace)

module.exports = router
