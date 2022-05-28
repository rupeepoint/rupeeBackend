import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import cors from 'cors'
import connectDb from './config/conectdb.js'
import userRoutes from './routes/userRoutes.js'
import multer from 'multer'
import bodyParser from 'body-parser'




const app = express()
const port = process.env.PORT || 8000
const DATABASE_URL = process.env.DATABASE_URL


//Cors Policy
app.use(cors())

//Database Connection
connectDb(DATABASE_URL)

//JSON Connection
app.use(express.json())
app.use(express.urlencoded())



//Load routes
app.use("/api/user", userRoutes)

app.listen(port, function () {
    console.log(`listening on port at https://localhost:${port}`)
})