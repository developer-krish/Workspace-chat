const mongoose = require("mongoose")

const channelSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        // Every channel must belong to a specific Workspace
        workspace: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Workspace",
            required: true,
        },
    },
    { timestamps: true },
)

channelSchema.index({ workspace: 1 })

module.exports = mongoose.model("Channel", channelSchema)
