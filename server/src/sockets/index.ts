import {type Socket} from 'socket.io';
import { GameDao, PlayerDao } from "../dao";
import {getPlayer,getAllPlayers,removePlayer, addGame} from '../lib/playerList';
import {addGame as addGameObj, getGames} from "../lib/gameList";
import {io} from "../index"
const connection = (socket: Socket) => {
	//console.log(socket.data.user);
  //console.log(playerList)
  socket.on('disconnect',()=>{
  })

  socket.on('logOff', ()=>{
    removePlayer(socket.data.user.id);
  })

  if(socket.data.user)
    socket.emit("authToken", socket.data.user.auth.token, socket.data.user.auth.expires);
	
  /**
   * Games Sockets
   */

  socket.on('createGame',(game)=>{
    const gameObj = new GameDao(game.players,game.time);
    gameObj.addPlayer(new PlayerDao(socket.data.user.id,socket.data.user.auth.username,['Y','Y','Y','','','','','','','']));
    addGame(socket.data.user.id, gameObj.gameID);
    socket.data.user.gameID = gameObj.gameID;
    addGameObj(gameObj);
    console.log(getGames());
    io.emit('updateLobby', gameObj);
  })

  socket.on('getGames',(cb)=>{
    const games = getGames();
    cb(games);
  })

  /**
   * End Games Sockets
   */
	
};




export default connection;

