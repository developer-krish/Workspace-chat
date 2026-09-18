const { z } = require("zod")

const objectIdRegex = /^[0-9a-fA-F]{24}$/

const objectIdSchema = z.string().regex(objectIdRegex, {
    message: "Must be a valid 24-character hexadecimal MongoDB ObjectId",
})

const registerSchema = z.object({
    body: z.object({
        username: z.string().min(3, "Username must be at least 3 characters").max(30, "Username must not exceed 30 characters").trim(),
        email: z.string().email("Invalid email format").trim().toLowerCase(),
        password: z.string().min(6, "Password must be at least 6 characters"),
    }),
})

const loginSchema = z.object({
    body: z.object({
        email: z.string().email("Invalid email format").trim().toLowerCase(),
        password: z.string().min(1, "Password is required"),
    }),
})

const createWorkspaceSchema = z.object({
    body: z.object({
        name: z.string().min(1, "Workspace name is required").max(50, "Workspace name must not exceed 50 characters").trim(),
    }),
})

const joinWorkspaceSchema = z.object({
    body: z.object({
        workspaceId: objectIdSchema,
    }),
})

const createChannelSchema = z.object({
    body: z.object({
        name: z.string().min(1, "Channel name is required").max(50, "Channel name must not exceed 50 characters").trim(),
    }),
    params: z.object({
        workspaceId: objectIdSchema,
    }),
})

const getChannelsSchema = z.object({
    params: z.object({
        workspaceId: objectIdSchema,
    }),
})

const createMessageSchema = z.object({
    body: z.object({
        content: z.string().min(1, "Message content cannot be empty"),
        channelId: objectIdSchema,
    }),
})

const getMessagesSchema = z.object({
    params: z.object({
        channelId: objectIdSchema,
    }),
})

const deleteMessageSchema = z.object({
    params: z.object({
        id: objectIdSchema,
    }),
})

module.exports = {
    registerSchema,
    loginSchema,
    createWorkspaceSchema,
    joinWorkspaceSchema,
    createChannelSchema,
    getChannelsSchema,
    createMessageSchema,
    getMessagesSchema,
    deleteMessageSchema,
}
