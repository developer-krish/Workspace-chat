const express = require("express")
const router = express.Router()
const messageController = require("../controllers/messageController")
const authMiddleware = require("../middleware/authMiddleware")
const { isChannelWorkspaceMember } = require("../middleware/workspaceMiddleware")
const validate = require("../middleware/validate")
const { createMessageSchema, getMessagesSchema, deleteMessageSchema } = require("../validation/schemas")

// --- GET ALL MESSAGES FOR A SPECIFIC CHANNEL ---
router.get(
    "/:channelId",
    authMiddleware,
    validate(getMessagesSchema),
    isChannelWorkspaceMember,
    messageController.getMessages,
)

// --- CREATE A NEW MESSAGE ---
router.post(
    "/",
    authMiddleware,
    validate(createMessageSchema),
    isChannelWorkspaceMember,
    messageController.createMessage,
)

// --- DELETE A MESSAGE ---
router.delete(
    "/:id",
    authMiddleware,
    validate(deleteMessageSchema),
    messageController.deleteMessage,
)

module.exports = router
