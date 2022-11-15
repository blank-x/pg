const httpServer = require('http-server');

const server = httpServer.createServer({
  cors: true,
  gzip: true,
}).listen(8888)

var a = server;

const b = []