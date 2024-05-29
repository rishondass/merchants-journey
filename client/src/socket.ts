import { io, type Socket } from "socket.io-client";

const URL = "http://10.0.0.96:4000";

const socket = io(URL,{
	autoConnect: false,
	transports:["websocket","polling"]
})

export default socket;

// interface ISocketConn{
// 	socket: Socket;
// 	connect: ()=>void;
// 	getSocket: ()=> Socket;
// 	printSocket:()=> void;
// }

// class SocketConn implements ISocketConn {
// 	public socket: Socket;

// 	constructor(){
// 		this.socket = io(URL,{autoConnect:false});
// 	}

// 	printSocket=()=>{
// 		console.log(this.socket.connected);
// 	}

// 	connect = ()=>{
// 		this.socket.connect();
// 	}

// 	getSocket = ():Socket=>{
// 		return this.socket;
// 	}
// }

// export default SocketConn;


