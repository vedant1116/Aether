import express from "express"
import authRouter from "./routes/auth.routes.js"
import chatRouter from "./routes/chat.routes.js"
import cookieParser from "cookie-parser"
import morgan from "morgan"
import cors from "cors"
const app=express()


app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())
app.use(morgan("dev"));
app.use(cors({
     origin:process.env.CLIENT_URL,
     credentials:true,
}))
app.use(express.static("./public/dist"))

app.get("/", (req, res) => {
    res.json({ message: "Server is running" });
});
app.use("/api/auth", authRouter)
app.use("/api/chats",chatRouter)

export default app;
