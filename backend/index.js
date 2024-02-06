const express = require('express')
const { default: mongoose } = require('mongoose')
const app = express()
const dotenv = require('dotenv')
const cors=require('cors')
const path=require("path")
const cookieParser = require('cookie-parser')
const authRoute = require('./routes/auth')
const multer = require('multer')

const connectDB = async () => {
    try{
        await mongoose.connect(process.env.MONGO_URL)
        console.log("Database Connected Successfully")
    }
    catch(err){
        console.log(err)
    }
}

//Middelwares
dotenv.config()
app.use(express.json())
app.use(cookieParser())
app.use("/images",express.static(path.join(__dirname,"/images")))
app.use(cors({origin:"http://localhost:3000",credentials:true}))
app.use("/api/auth",authRoute)


app.listen(process.env.PORT,()=>{
    connectDB()
    console.log("App is running on Port 5000!")
})