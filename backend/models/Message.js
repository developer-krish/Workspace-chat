const mongoose = require("mongoose")

const messageSchema = new mongoose.Schema(
    {
        content: {
            type: String,
            required: true,
        },
        // Who sent the message? Links to a User ID
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        // Which chat room is this in? Links to a Channel ID
        channel: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Channel",
            required: true,
        },
    },
    { timestamps: true },
)

messageSchema.index({ channel: 1, createdAt: -1 })

module.exports = mongoose.model("Message", messageSchema)
