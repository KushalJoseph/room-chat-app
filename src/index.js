const path=require('path');
const http=require('http');
const express=require('express');
const socketio=require('socket.io');

const app=express();
const server=http.createServer(app);
const io=socketio(server);

const {generateMessage}=require('./messages');

const {addUser,getUser,getUsersFromRoom,removeUser,users}=require('./users');

const pathToPublic=path.join(__dirname,"../public");
app.use(express.static(pathToPublic));

let count=0;
io.on('connection',(socket)=>{
        console.log("New connection!");
        /*
        //"Socket" contains info about the new connection (that particular one)
        socket.emit('countUpdated',count);
        //Socket.emit()--> Only for this particular connection
        //io.emit()-->Across all connections.
        socket.on('increment',()=>{
            count++;
            io.emit('countUpdated',count);
        });
        */
    let username_here,room_here;
    socket.on('join',({username,room},callback)=>{
            try{
                addUser({id:socket.id,username,room});
            }catch(e){
                return callback(e.toString());
            }
            username_here=username;
            room_here=room;
            socket.join(room_here);
            socket.emit("message",generateMessage("Welcome","Server"));
            socket.broadcast.to(room_here).emit("message",generateMessage(`A new user has joined: ${username}`,"Info"));
            io.to(room_here).emit('roomDetails',{
                room:room_here,
                users:getUsersFromRoom(room_here)
            });
            callback();
    });
    socket.on('messageSent',(message,callback)=>{
        io.to(room_here).emit('message',generateMessage(message,username_here));
        callback("Server: Has seen it!");
    });
    socket.on('locationSent',(message,callback)=>{
        io.to(room_here).emit('location',generateMessage(message,username_here));
        callback("Received location!");
    });

    socket.on('disconnect',()=>{
        let user;
        try{
            user=removeUser(socket.id);
        }catch(e){
            user={username:"Some user"};
        }
        io.to(room_here).emit('roomDetails',{
            room:room_here,
            users:getUsersFromRoom(room_here)
        });
        io.to(room_here).emit("message",generateMessage(`${user.username} has left`),"Info");
    });
});

//SERVER.listen(). Because socket io is connected to this server
server.listen(3000,()=>{
    console.log("Server up and running!");
})