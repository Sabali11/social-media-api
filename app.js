import express, { urlencoded } from "express"
import authRoute from "./routes/authRoutes.js"
import userRoute from "./routes/userRoutes.js"
import postRoute from "./routes/postRoutes.js"
import commentRoute from "./routes/commentRoutes.js"
import errorHandler from "./middleware/errorMiddleware.js"
import dotenv from "dotenv"
import connectDB from "./config/db.js";
import cors from "cors"

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())
app.use(errorHandler)
app.use(urlencoded({extended : true}))


app.use("/api/auth", authRoute)
app.use("/api/user", userRoute)
app.use("/api/posts", postRoute)
app.use("/api/comment", commentRoute)

app.listen(PORT, () => {
    connectDB()
    console.log(`app started on ${PORT}`)
})