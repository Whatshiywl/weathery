const express = require('express');
const app = express();
const path = require('path');
const proxy = require('http-proxy-middleware');
const cors = require('cors');
const citydb = require('./citydb.js');
// Run the app by serving the static files
// in the dist directory
const folder = '/dist/weathery';
const api = '/data/2.5';

const openweatherapi = proxy({
  target: 'https://api.openweathermap.org',
  changeOrigin: true,
  pathRewrite: path => {
    path = `${path.replace('/api', api)}&appid=${process.env.OWA_KEY}`;
    return path;
  }
});

app.use(cors());

app.use(express.static(__dirname + folder));
app.use('/api', openweatherapi);

app.get('/find', (req, res) => {
  const name = req.query.name || '';
  const country = req.query.country || '';
  const top = Number(req.query.top);

  const results = citydb.find(name, country, top);
  const status = results.length ? 200 : 204;

  res.status(status).send({
    size: results.length,
    results
  });
});
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname + folder + '/index.html'));
});

//////////////////////////////////

var http = require('http');

/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || '9400');
app.set('port', port);

/**
 * Create HTTP server.
 */

var server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

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

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  console.log('Listening on ' + bind);
}
