import jwt from 'jsonwebtoken';
import { User } from '../models/user.js';

const protectRouter=async(req,res,next)=>{
    try{
    const token= req.cookies.jwt;
    if(!token){
        return res.status(400).json({message:"unathories no token provided"})
    }

    const decoded=jwt.verify(token, process.env.jwt_key)
    if(!decoded){
        return res.status(400).json({message:"unathories no token provided"})
    }

    const user=await User.findById(decoded.userId).select("-password")
    req.user=user
    next()
    }catch(error){
        console.log(error.message,"error in protectRouter")
        return res.status(500).json({message:"server error"})
    }
}

export { protectRouter };