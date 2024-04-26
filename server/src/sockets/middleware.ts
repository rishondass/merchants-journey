// socketMiddleware.ts

import {type Socket} from 'socket.io';
import {type ExtendedError} from 'socket.io/dist/namespace';
import playerList from '../lib/playerList';
import {AES} from 'crypto-js';
import {v4 as uuid} from "uuid";
import { encrypt, decrypt } from '../lib/encrypt';
// Define the middleware function to validate user
export function validateUser(socket: Socket, next: (err?: ExtendedError) => void) { 
    console.log(socket.handshake.auth)
    const id = socket.handshake.auth?.id;
    if(id){
      const decrypted = decrypt(id);
      //console.log(decrypted_id);
      console.log('id is here')
    }else{
      console.log('creating id')
      const id = uuid();
      const username = socket.handshake.auth?.username as string;
      const encrypted = encrypt(id);
      const expires = (30*86400000) +(new Date().getTime());

      playerList[id] = {username,expires};

      socket.data.user = {id: id, token:{id:encrypted, expires: expires} }

      console.log(playerList);
      next();
    }
    
    // if (playerList[id]) {
    //     // Pass an ExtendedError to indicate an authentication error
    //     next(new Error('player already exists') as ExtendedError);
    // } else {
      
    // }
}
