import express from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"
import cors from "cors"
import recordRoutes from "./routes/records.js"

dotenv.config()
const app = express()

app.use(express.json())
app.use("/api/records", recordRoutes)
app.use(cors())

const connectDB = ()=> {
try {
       mongoose.connect(process.env.MONGO_URI)
       console.log("Database Connected Successfully")
} catch (error) {
    console.log(error.message)
}
}

connectDB()

const port = process.env.PORT || 8000

if (process.env.NODE_ENV !== 'production') {
    const port = process.env.PORT || 8000;
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}

export default app;