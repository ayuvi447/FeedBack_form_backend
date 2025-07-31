import express from "express";
import cors from 'cors'
import dotenv from 'dotenv'
import cookieParser from "cookie-parser";
import { connect_db } from './config/database.js'
import userRoutes from './routes/user.routes.js'

const app = express()
app.use(cors({
    origin:'http://localhost:5173',
    credentials: true
}))
app.use(express.json())
app.use(cookieParser())

dotenv.config()


const PORT = process.env.PORT || 5523

// app.use('/',(req, res)=>{
//     res.send("FeedBack Form.✅")
// })

app.use('/user', userRoutes)
app.use('/user', userRoutes)
 connect_db().then(()=>{
 app.listen(PORT, ()=>{
    console.log(`App is listing at ${PORT}.`);
 })
 })

