/**
 * Module dependencies.
 */

 let app = require('../app');
 //let debug = require('debug')('auth-msrv:server');
 let http = require('http');
 //let logger = require('../helpers/logger');
 //let genlog = logger.getLogger("server-logs")
 /**
  * Get port from environment and store in Express.
  */
 
 let port = 3000
 app.set('port', port);
 
 /**
  * Create HTTP server.
  */
 
 let server = http.createServer(app);
 
 /**
  * Listen on provided port, on all network interfaces.
  */
 
 server.listen(port);
 //server.on('error', onError);
 //server.on('listening', onListening);
 //genlog.info("HealthServ auth REST Server started at port: " + port)
 console.log("user-msrv auth REST Server started at port: " + port);
 /**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
    let port = parseInt(val, 10);

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
