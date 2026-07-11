const express = require("express")
const router = express.Router()
const channelController = require("../controllers/channelController")
const authMiddleware = require("../middleware/authMiddleware")
const { isWorkspaceMember } = require("../middleware/workspaceMiddleware")
const validate = require("../middleware/validate")
const { createChannelSchema, getChannelsSchema } = require("../validation/schemas")

// --- 1. CREATE A CHANNEL IN A WORKSPACE ---
// POST /api/channels/:workspaceId
router.post(
    "/:workspaceId",
    authMiddleware,
    validate(createChannelSchema),
    isWorkspaceMember,
    channelController.createChannel,
)

// --- 2. GET ALL CHANNELS FOR A WORKSPACE ---
// GET /api/channels/:workspaceId
router.get(
    "/:workspaceId",
    authMiddleware,
    validate(getChannelsSchema),
    isWorkspaceMember,
    channelController.getChannels,
)

module.exports = router
