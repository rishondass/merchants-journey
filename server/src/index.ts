
import app from './app';
import debug from 'debug';
import './loadEnv';
import {createServer         } from 'http';
import {Server, type Socket} from 'socket.io';
import connection from './sockets/index';
import {validateUser} from './sockets/middleware';
/**
 * Get port from environment and store in Express.
 */

const port = normalizePort(process.env.PORT ?? '3000');
app.set('port', port);

/**
 * Create HTTP server.
 */

const server = createServer(app);
export const io = new Server(server, {
	transports:[ 'websocket', 'polling' ],
  connectionStateRecovery: {
    // the backup duration of the sessions and the packets
    maxDisconnectionDuration: 2 * 60 * 1000,
    // whether to skip middlewares upon successful recovery
    skipMiddlewares: false,
  }
});

io.use(validateUser);

io.on('connection', (socket: Socket)=>{
  if(socket.recovered){
    console.log('recovered socket');
  }else{
    connection(socket);
  }
	
});


/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val: string) {
	const port = parseInt(val, 10);

	if (isNaN(port)) {
		// named pipe
		return val;
	}


	if (port >= 0) {
		// port number
		return port;
	}

	return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error: Error) {
	// if (error.stack !== 'listen') {
	//   throw error;
	// }
	// const bind = typeof port === 'string'
	//   ? 'Pipe ' + port
	//   : 'Port ' + port;

	// // handle specific listen errors with friendly messages
	// switch (error.code) {
	//   case 'EACCES':
	//     console.error(bind + ' requires elevated privileges');
	//     process.exit(1);
	//     break;
	//   case 'EADDRINUSE':
	//     console.error(bind + ' is already in use');
	//     process.exit(1);
	//     break;
	//   default:
	//     throw error;
	// }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
	const addr = server.address();
	const bind = typeof addr === 'string'
		? 'pipe ' + addr
		: 'port ' + addr?.port;
	debug('Listening on ' + bind);
	console.log('Listening on ' + bind);
}

export default server;
