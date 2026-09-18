const { Server } = require("socket.io")
const logger = require("./utils/logger")

const initSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: "*", // In production, this should be restricted to specific origins
            methods: ["GET", "POST"],
        },
    })

    // Map to track socket.id -> userId
    const onlineUsers = new Map()

    io.on("connection", (socket) => {
        logger.info(`User connected to WebSocket: ${socket.id}`)

        // 1. Join a specific channel room
        socket.on("join_channel", (channelId) => {
            socket.join(channelId)
            logger.info(`Socket ${socket.id} joined channel room: ${channelId}`)
        })

        // 2. Handle sending messages instantly
        socket.on("send_message", (data) => {
            if (data && data.channelId) {
                socket.to(data.channelId).emit("receive_message", data)
            }
        })

        // 3. Handle "Typing..." indicators
        socket.on("typing", (data) => {
            if (data && data.channelId && data.username) {
                socket.to(data.channelId).emit("user_typing", data.username)
            }
        })

        socket.on("stop_typing", (channelId) => {
            if (channelId) {
                socket.to(channelId).emit("user_stopped_typing")
            }
        })

        // 4. Handle "Green Dot" online status
        socket.on("register_user", (userId) => {
            if (userId) {
                onlineUsers.set(socket.id, userId)
                // Broadcast the unique list of online user IDs to everyone
                io.emit("online_users", Array.from(new Set(onlineUsers.values())))
                logger.info(`Registered user ${userId} on socket ${socket.id}`)
            }
        })

        // 5. Handle deleting messages instantly
        socket.on("delete_message", (data) => {
            if (data && data.channelId && data.messageId) {
                socket.to(data.channelId).emit("message_deleted", data.messageId)
            }
        })

        // 6. Handle user disconnecting
        socket.on("disconnect", () => {
            logger.info(`User disconnected from WebSocket: ${socket.id}`)
            onlineUsers.delete(socket.id)
            // Update everyone's screen to remove the green dot for this user
            io.emit("online_users", Array.from(new Set(onlineUsers.values())))
        })
    })

    return io
}

module.exports = initSocket
