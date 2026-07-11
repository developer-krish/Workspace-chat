const Message = require("../models/Message")
const AppError = require("../utils/appError")
const asyncHandler = require("../middleware/asyncHandler")

// --- GET ALL MESSAGES FOR A SPECIFIC CHANNEL ---
exports.getMessages = asyncHandler(async (req, res, next) => {
    const { channelId } = req.params

    const messages = await Message.find({ channel: channelId })
        .populate("sender", "username email")
        .sort({ createdAt: 1 }) // Sorted chronologically for chat view

    res.status(200).json(messages)
})

// --- CREATE A NEW MESSAGE ---
exports.createMessage = asyncHandler(async (req, res, next) => {
    const { content, channelId } = req.body
    const senderId = req.user.userId || req.user._id

    const newMessage = await Message.create({
        content: content,
        sender: senderId,
        channel: channelId,
    })

    // Populate sender details for React frontend
    await newMessage.populate("sender", "username email")

    res.status(201).json(newMessage)
})

// --- DELETE A MESSAGE ---
exports.deleteMessage = asyncHandler(async (req, res, next) => {
    const { id } = req.params
    const userId = req.user.userId || req.user._id

    const message = await Message.findById(id)
    if (!message) {
        return next(new AppError("Message not found", 404))
    }

    // SECURITY CHECK: Only the sender of the message is authorized to delete it
    if (String(message.sender) !== String(userId)) {
        return next(new AppError("Access denied: You can only delete your own messages", 403))
    }

    await Message.findByIdAndDelete(id)
    res.status(200).json({ message: "Message deleted successfully" })
})
