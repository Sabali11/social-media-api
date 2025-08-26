import express, { urlencoded } from "express"
import dotenv from "dotenv"
import cors from "cors"

import authRoute from "./routes/authRoutes.js"
import userRoute from "./routes/userRoutes.js"
import postRoute from "./routes/postRoutes.js"
import commentRoute from "./routes/commentRoutes.js"
import errorHandler from "./middleware/errorMiddleware.js"
import connectDB from "./config/db.js";

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000
connectDB()

app.use(cors())
app.use(express.json())
app.use(urlencoded({extended : true}))


app.use("/api/auth", authRoute)
app.use("/api/user", userRoute)
app.use("/api/posts", postRoute)
app.use("/api/comment", commentRoute)

app.get("/", (req, res) => {
  res.send("API is running");
});

app.use(errorHandler)

app.listen(PORT, () => {
    console.log(`app started on ${PORT}`)
})
