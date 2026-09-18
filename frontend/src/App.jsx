import { useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import { Navigate, Route, Routes, useLocation } from "react-router-dom"
import Auth from "./Auth"
import Chat from "./Chat"
import About from "./pages/About"
import ChatMessagesView from "./pages/ChatMessagesView"
import Team from "./pages/Team"
import { screenTransition } from "./motionVariants"

function App() {
    const [token, setToken] = useState(localStorage.getItem("token") || "")
    const [storedUsername, setStoredUsername] = useState(
        () => localStorage.getItem("chat_username") || "",
    )
    const location = useLocation()

    const handleLogin = (newToken, username) => {
        localStorage.setItem("token", newToken)
        if (username) {
            localStorage.setItem("chat_username", username)
            setStoredUsername(username)
        } else {
            setStoredUsername(localStorage.getItem("chat_username") || "")
        }
        setToken(newToken)
    }

    const handleLogout = () => {
        localStorage.removeItem("token")
        localStorage.removeItem("chat_username")
        setStoredUsername("")
        setToken("")
    }

    return (
        <div className="h-full min-h-0">
            <AnimatePresence mode="wait">
                <Routes location={location} key={token ? "chat-routes" : "auth-routes"}>
                    {token ? (
                        <Route
                            element={
                                <motion.div
                                    className="h-full min-h-0"
                                    variants={screenTransition}
                                    initial="initial"
                                    animate="animate"
                                    exit="exit"
                                >
                                    <Chat
                                        token={token}
                                        onLogout={handleLogout}
                                        storedUsername={storedUsername}
                                    />
                                </motion.div>
                            }
                        >
                            <Route path="/" element={<Navigate to="/chat" replace />} />
                            <Route path="/chat" element={<ChatMessagesView />} />
                            <Route path="/about" element={<About />} />
                            <Route path="/team" element={<Team />} />
                            <Route path="*" element={<Navigate to="/chat" replace />} />
                        </Route>
                    ) : (
                        <Route
                            path="*"
                            element={
                                <motion.div
                                    className="h-full min-h-0"
                                    variants={screenTransition}
                                    initial="initial"
                                    animate="animate"
                                    exit="exit"
                                >
                                    <Auth onLogin={handleLogin} />
                                </motion.div>
                            }
                        />
                    )}
                </Routes>
            </AnimatePresence>
        </div>
    )
}

export default App
