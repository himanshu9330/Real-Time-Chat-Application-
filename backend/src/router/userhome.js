const express=require('express')
const bcrypt= require('bcryptjs')
const {User}=require('../models/user');
const { generatetoken } = require('../lib/auth');
const user_router=express.Router();
const {protectRouter}=require('../middleware/protect')
const {cloudinary}=require('../lib/cloudinary')


//sign up or new user create
user_router.post('/signup', async(req, res)=>{
    const {name, email, password}=req.body
    try{
          if(!name || !email || !password){
            return res.status(400).json({message:"All fields are required"})
          }
          if(password.length<6){
            return res.status(400).json({message:"password must be at least 6 characters"})
          }

          const user= await User.findOne({email})
          if(user){
            return res.status(400).json({message:"Email Id already exsit"})
          }
          
          const salt= await bcrypt.genSalt(10)
          const hashpassword= await bcrypt.hash(password, salt)

          const newuser= await User.create({
            name,
            email,
            password: hashpassword
          })

          if(newuser){
            //generate token
            generatetoken(newuser._id, res)
            await newuser.save();

            return res.status(200).json({
                _id: newuser._id,
                name: newuser.name,
                email: newuser.email,
                profile: newuser.profile
            })

          }else{
            return res.status(400).json({message:"Invalid user data"})
          }


    } catch(error){
           console.log("error in signup", error.message)
           return res.status(500).json({message:"internal server error"})
    }
})


//signin
user_router.post('/signin', async(req, res)=>{
               try{
                   const {email, password}=req.body
                    const user= await User.findOne({email})   
                       if(!user){
                        return res.status(400).json({message:"User not found"})
                       }
                       const ispasswoadcorrect= await bcrypt.compare(password, user.password)
                       if(!ispasswoadcorrect){
                        return res.status(400).json({message:"incorrect passwoad"})
                       }
                        //token genarate
                        generatetoken(user._id, res)

                       return  res.status(200).json({
                        name:user.name,
                        email:user.email,
                        password:user.password,
                        profile:user.profile
                       })

               }catch(error){
                          console.log("error in signin:",message.error)
                          return res.status(500).json({message:"Internal server error"})
               }
})


//logout
user_router.post('/logout', async(req, res)=>{
         try{
                 res.cookie("jwt", "",{maxAge:0})
          return res.status(200).json({message:"Logout successfully"})
         }catch(error){
             console.log(message.error,"error in logout")
             return res.status(500).json({message:"Internal server error"})
         }
})

//update your profile and upload profile
user_router.put('/update', protectRouter, async(req, res)=>{
                try {
                  const{profile}=req.body
                  const userId=req.user._id  ///possible because of protectRouter
                  if(!profile){
                    return res.status(400).json({message:"no profile is provided"})
                  }

                 const uploadResponse= await cloudinary.uploader.upload(profile)
                 const user=await User.findByIdAndUpdate(userId,{profile:uploadResponse.secure_url}, {new:true})

                 return res.status(200).json({
                  message:"profile uploaded successfully",
                    profile:user.profile
                 })

                } catch (error) {
                  console.log("error in update:",message.error)
                  return res.status(500).json({message:"Internal server error"})
                }
})


//check user is authenthicated or not
user_router.get('/check', protectRouter, (req,res)=>{
            try {
              console.log("Cookie received:", req.cookies);
              return res.status(200).json(req.user)
            } catch (error) {
               console.log("error in checkAuth:",error.message)
                return res.status(500).json({message:"Internal server error"})
            }
})


module.exports={
    user_router
}

