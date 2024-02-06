const express = require('express')
const router = express.Router()
const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

//Register User

router.post("/register",async(req,res)=>{
    try {
        const {name,email,dob,password} = req.body
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hashSync(password,salt)
        const newUser = new User({name,email,dob,password:hashedPassword})
        const savedUser = await newUser.save()
        res.status(200).json(savedUser)    
    } 
    catch (error) {
        res.status(500).json(error)
    }    

})

//Login User

router.post("/login",async(req,res)=>{
    try{
        const user = await User.findOne({email:req.body.email})
        if(!user){
            return res.status(404).json("User not Found")
        }
        const passwordMatch = await bcrypt.compare(req.body.password,user.password)
        if(!passwordMatch){
            return res.status(401).json("Wrong Password")
        }
        const token = jwt.sign({_id:user._id,name:user.name,email:user.email},process.env.SECRET,{expiresIn:"3d"})
        const {password,...info}=user._doc
        res.cookie("token",token).status(200).json(info)
    }
    catch(err){
        res.status(500).json(err)
    }
})

//Log out

router.get("/logout",async(req,res)=>{
    try{
        res.clearCookie("token",{sameSite:"none",secure:true}).status(200).send("User Logged Out Successfully!")
    }
    catch(err){
        res.status(500).json(err)
    }
})

//Get All Users 

router.get("/homepage",async (req,res)=>{
    
    try{
        const users=await User.find()
        res.status(200).json(users)
    }
    catch(err){
        res.status(500).json(err)
    }
})

//REFETCH USER
router.get("/refetch", async(req,res)=>{
    const token=req.cookies.token
    jwt.verify(token,process.env.SECRET,{},async (err,data)=>{
        if(err){
            return res.status(404).json(err)
        }
        res.status(200).json(data)
    })
})

module.exports = router