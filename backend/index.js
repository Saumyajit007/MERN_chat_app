import express from 'express'
import dotenv from 'dotenv'
import connectDB from './config/database.js'
import useRoute from './routes/userRoute.js'
import cookieParser from 'cookie-parser'
import useMessageRoute from './routes/messageRoute.js'
import cors from "cors"
import { app,server } from "./socket/socket.js";


// use of dotenv for the starting server
dotenv.config({})
const PORT=process.env.PORT||5000

// middlewares
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())

// for crossport data tranfer frontend on 3000 and backend on 8000/8080
const corsOption={
    origin:'http://localhost:3000',
    credentials:true
}
app.use(cors(corsOption))
// routes
app.use('/api/v1/user',useRoute)
app.use('/api/v1/message',useMessageRoute)


server.listen(PORT,()=>{
    connectDB()
    console.log(`server listen on port no ${PORT}`)
})