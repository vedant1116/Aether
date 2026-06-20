import {io} from "socket.io-client"

export const initializeSocketConnection = () => {
    const socket = io("https://aether-oeme.onrender.com",{
        withCredentials:true,
    })
    socket.on("connect",()=>{
        console.log("connected to Socket.IO server");
        
    })
}