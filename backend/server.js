import dotenv from "dotenv"
dotenv.config()
import app from "./src/app.js"
import connectToDb from "./src/config/database.js"
// import { testAi } from "./src/services/ai.service.js"
import http from "http"
import { initSocket } from "./src/sockets/server.socket.js"

const httpServer = http.createServer(app)

initSocket(httpServer)

const PORT = process.env.PORT || 3000

httpServer.on('error', (err) => {
    if (err && err.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use. Make sure no other process is using the port, or set PORT in your environment.`)
        process.exit(1)
    }
    console.error('Server error:', err)
    process.exit(1)
})

httpServer.listen(PORT, () => {
    console.log(`server started running on port ${PORT}`)
})

connectToDb()

// testAi()