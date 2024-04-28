// socketMiddleware.ts

import {type Socket} from 'socket.io';
import {type ExtendedError} from 'socket.io/dist/namespace';
import {addPlayer,getAllPlayers,getPlayer} from '../lib/playerList';
import { playerAuth } from '../lib/types';
import {v4 as uuid} from "uuid";
import { encrypt, decrypt } from '../lib/encrypt';
// Define the middleware function to validate user
export function validateUser(socket: Socket, next: (err?: ExtendedError) => void) { 
    const id = socket.handshake.auth?.id;
    if(id){
      //TODO: add expiration check
      const decrypted = decrypt(id);
      const player = getPlayer(decrypted)
      if(player){
        socket.data.user= {...player};
        next();
      }
      
    }else{
      const id = uuid();
      const username = socket.handshake.auth?.username as string;
      const encrypted = encrypt(id);
      const expires = (30*86400000) +(new Date().getTime());

      const player = addPlayer(id,username,encrypted,expires);

      socket.data.user = {...player}
      
      next();
    }
    
}
