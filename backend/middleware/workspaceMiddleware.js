const Workspace = require("../models/Workspace")
const Channel = require("../models/Channel")
const AppError = require("../utils/appError")
const asyncHandler = require("./asyncHandler")

/**
 * Checks if the logged-in user is a member of the specified workspace.
 * Looks for workspaceId in req.params, req.body, or req.query.
 */
const isWorkspaceMember = asyncHandler(async (req, res, next) => {
    const userId = req.user.userId || req.user._id
    const workspaceId = req.params.workspaceId || req.body.workspaceId || req.query.workspaceId

    if (!workspaceId) {
        return next(new AppError("Workspace ID is required", 400))
    }

    const workspace = await Workspace.findById(workspaceId)
    if (!workspace) {
        return next(new AppError("Workspace not found", 404))
    }

    const isMember = workspace.members.some((memberId) => String(memberId) === String(userId))
    if (!isMember) {
        return next(new AppError("Access denied: You are not a member of this workspace", 403))
    }

    req.workspace = workspace
    next()
})

/**
 * Checks if the logged-in user is a member of the workspace containing the specified channel.
 * Looks for channelId in req.params, req.body, or req.query.
 */
const isChannelWorkspaceMember = asyncHandler(async (req, res, next) => {
    const userId = req.user.userId || req.user._id
    const channelId = req.params.channelId || req.body.channelId || req.query.channelId

    if (!channelId) {
        return next(new AppError("Channel ID is required", 400))
    }

    const channel = await Channel.findById(channelId)
    if (!channel) {
        return next(new AppError("Channel not found", 404))
    }

    const workspace = await Workspace.findById(channel.workspace)
    if (!workspace) {
        return next(new AppError("Parent workspace for channel not found", 404))
    }

    const isMember = workspace.members.some((memberId) => String(memberId) === String(userId))
    if (!isMember) {
        return next(new AppError("Access denied: You are not a member of this workspace", 403))
    }

    req.channel = channel
    req.workspace = workspace
    next()
})

module.exports = {
    isWorkspaceMember,
    isChannelWorkspaceMember,
}
