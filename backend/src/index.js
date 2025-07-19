import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { app, server, io } from './lib/socket.js';
import { user_router } from './router/userhome.js';
import getMessageRouter from './router/message.js';

//during deployment//
import path from 'path';


dotenv.config();

//during deployment//
const __dirname = path.resolve();

//connection
mongoose.connect(process.env.mongo_url)
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