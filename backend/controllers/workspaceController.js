const Workspace = require("../models/Workspace")
const AppError = require("../utils/appError")
const asyncHandler = require("../middleware/asyncHandler")

// --- GET ALL WORKSPACES ---
exports.getWorkspaces = asyncHandler(async (req, res, next) => {
    const userId = req.user.userId || req.user._id

    // Fetch workspaces where user is a member and populate member usernames
    const workspaces = await Workspace.find({ members: userId }).populate(
        "members",
        "username email",
    )

    res.status(200).json(workspaces)
})

// --- CREATE A NEW WORKSPACE ---
exports.createWorkspace = asyncHandler(async (req, res, next) => {
    const { name } = req.body
    const userId = req.user.userId || req.user._id

    const newWorkspace = new Workspace({
        name,
        members: [userId], // Add the creator as the first member
    })

    await newWorkspace.save()
    res.status(201).json(newWorkspace)
})

// --- JOIN A WORKSPACE ---
exports.joinWorkspace = asyncHandler(async (req, res, next) => {
    const { workspaceId } = req.body
    const userId = req.user.userId || req.user._id

    const workspace = await Workspace.findById(workspaceId)
    if (!workspace) {
        return next(new AppError("Workspace not found. Check the ID.", 404))
    }

    // Check if user is already a member
    const isMember = workspace.members.some((memberId) => String(memberId) === String(userId))
    if (isMember) {
        return next(new AppError("You are already a member of this workspace.", 400))
    }

    // Add user to the workspace members array
    workspace.members.push(userId)
    await workspace.save()

    res.status(200).json(workspace)
})
