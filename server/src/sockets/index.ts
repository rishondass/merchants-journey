import {type Socket} from 'socket.io';
import {io} from '../index';
import playerList from '../lib/playerList';
const connection = (socket: Socket) => {
	console.log(socket.id);

  socket.on('disconnect',()=>{
    console.log(`disconnecting ${socket.id}`)
    delete playerList[socket.data.user.id] //TODO: remove from disconnect and create a new event "logOff"
    console.log(playerList);
  })

  socket.emit("authToken", socket.data.user.token.id, socket.data.user.token.expires);
	
	
};




export default connection;

