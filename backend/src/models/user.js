import mongoose from 'mongoose';

const userSchema= new mongoose.Schema({
    name:{
        type: String,
        required:true
    },
    email:{
          type: String,
          required:true,
          unique:true
    },
    password:{
        type:String,
        required:true
    },
    profile:{
        type: String,
        default:''
    },
    role: {
    type: String,
    enum: ['User', 'Admin'],
    default: 'User'
  }

},{timestamps:true})

const User= mongoose.model("User", userSchema)

export { User}