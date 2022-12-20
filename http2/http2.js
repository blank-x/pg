const http2 = require('http2');
const fs = require('fs');
const { HTTP2_HEADER_PATH } = http2.constants;

const server = http2.createSecureServer({
  key: fs.readFileSync('localhost-privkey.pem'),
  cert: fs.readFileSync('localhost-cert.pem')
});
server.on('error', (err) => console.error(err));

server.on('stream', (stream, headers) => {
  // stream is a Duplex
  const path = headers[':path'];
  if(path === '/img.png' || path === '/favicon.ico'){
    const fd = fs.openSync('img.png', 'r');
    const stat = fs.fstatSync(fd);
    const headers = {
      'content-length': stat.size,
      'last-modified': stat.mtime.toUTCString(),
      'content-type': 'image/png'
    };
    stream.respondWithFD(fd, headers);

  } else if(path === '/') {
    stream.respond({
      'content-type': 'text/html; charset=utf-8',
      ':status': 200
    });
    stream.end(`
      <h1>Hello World</h1>
      <script>
        for(var i=0;i<50;i++){
          fetch('/img.png')
        }
      </script>
   
    `);
  }

});

server.listen(8443);