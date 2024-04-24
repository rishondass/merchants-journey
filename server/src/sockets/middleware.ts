// socketMiddleware.ts

import {type Socket} from 'socket.io';
import {type ExtendedError} from 'socket.io/dist/namespace';
import playerList from '../lib/playerList';

// Define the middleware function to validate user
export function validateUser(socket: Socket, next: (err?: ExtendedError) => void) {
	
    const username = socket.handshake.auth?.username as string;
    if (playerList[username]) {
        // Pass an ExtendedError to indicate an authentication error
        next(new Error('Invalid username') as ExtendedError);
    } else {
		playerList[username] = username;
        console.log(`Valid username: ${username}`);
		console.log(playerList);
        // Call next() without arguments to proceed to the next middleware or socket event
        next();
    }
}
