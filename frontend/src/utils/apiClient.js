import axios from "axios"
import { API_BASE } from "../config"

const apiClient = axios.create({
    baseURL: API_BASE,
})

// Request interceptor: automatically attach JWT token if it exists in localStorage
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token")
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    },
)

// Response interceptor: intercept auth errors and handle session expiration
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem("token")
            localStorage.removeItem("chat_username")
            // Optional: trigger page reload to reset state back to login screen
            window.location.href = "/"
        }
        return Promise.reject(error)
    },
)

export default apiClient
