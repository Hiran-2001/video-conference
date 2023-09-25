const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const server = http.createServer(app);
app.use(cors())
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection",(socket)=>{
    console.log(`user connected ${socket.id}`);

    socket.emit("me",socket.id)

    socket.on("join-chat",(data)=>{
        socket.join(data)
        console.log("user join",data);
    })

    socket.on("send-message",(data)=>{
        console.log("send message", data);
        socket.to(data.room).emit("receive-message",data)
    
    })


    // video call socket server 


    socket.on("call-user",(data)=>{
      io.to(data.userToCall).emit("call-user",{signal:data.signalData, from:data.from, name:data.name })
    })

    socket.on("answer-call",(data)=>{
      io.to(data.to).emit("call-accepted"),data.signal
    })

    socket.on("disconnected",()=>{
      socket.broadcast.emit("call-ended")
        console.log(`user disconnected ${socket.id}`);
    })
})

server.listen(3001, () => {
  console.log(`Socket Server running at port: ${3001}`);
});
