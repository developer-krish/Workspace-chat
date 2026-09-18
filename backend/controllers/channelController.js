const Channel = require("../models/Channel")
const asyncHandler = require("../middleware/asyncHandler")

// --- CREATE A CHANNEL IN A WORKSPACE ---
exports.createChannel = asyncHandler(async (req, res, next) => {
    const { name } = req.body
    const { workspaceId } = req.params

    const newChannel = new Channel({
        name: name,
        workspace: workspaceId,
    })

    await newChannel.save()
    res.status(201).json(newChannel)
})

// --- GET ALL CHANNELS FOR A WORKSPACE ---
exports.getChannels = asyncHandler(async (req, res, next) => {
    const { workspaceId } = req.params

    // Find all channels that belong to this specific workspace ID
    const channels = await Channel.find({ workspace: workspaceId })
    res.status(200).json(channels)
})
