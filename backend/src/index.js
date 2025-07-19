const express = require('express')
const mongodb= require('mongoose')
const dotenv= require('dotenv')
const cookieParser= require('cookie-parser')
const cors =require('cors')
const {app, server, io}=require('./lib/socket')

//during deployment//
import path from "path";


const { user_router}=require('./router/userhome')
const  getMessageRouter = require('./router/message')

dotenv.config();

//during deployment//
const __dirname = path.resolve();

//connection
mongodb.connect(process.env.mongo_url)
.then(()=>{
    console.log('mongodb is connected')
})
.catch(error=>{
         console.log("error:",error)
})




const port= process.env.port;
//middleware
app.use(express.json({ limit: '20mb' })); // increase limit from default 100kb
app.use(express.urlencoded({ extended: true, limit: '20mb' }));
app.use(cookieParser());


app.use(cors({
       origin:"http://localhost:5173",
       credentials: true
}))



app.use('/api/user', user_router)
app.use('/api/chat',getMessageRouter(io) )


//during deployment//
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}


server.listen(port, ()=>{
    console.log('server has been started on port:'+port)
})