const http2 = require('http2');
const fs = require('fs');
const { HTTP2_HEADER_PATH } = http2.constants;

const server = http2.createSecureServer({
  key: fs.readFileSync('localhost-privkey.pem'),
  cert: fs.readFileSync('localhost-cert.pem')
});
server.on('error', (err) => console.error(err));

server.on('stream', (stream, headers) => {
  const path = headers[':path'];
  if(path === '/') {
    stream.respond({
      'content-type': 'text/html; charset=utf-8',
      ':status': 200
    });


    // stream.pushStream({ [HTTP2_HEADER_PATH]: '/style.css' }, (err, pushStream, headers) => {
    //   if (err) throw err;
    //   const fd = fs.openSync('style.css', 'r');
    //   const stat = fs.fstatSync(fd);
    //   const header = {
    //     'content-length': stat.size,
    //     'last-modified': stat.mtime.toUTCString(),
    //     'content-type': 'text/css'
    //   };
    //   pushStream.respondWithFD(fd, header)
    // });

    stream.end(`
      <h1>Hello World</h1>
      <script>
        setTimeout(()=>{
          fetch('/style.css')
        },4000)
      </script>
   
    `);
  } else if(path === '/style.css'){

    const fd = fs.openSync('style.css', 'r');
    const stat = fs.fstatSync(fd);
    const headers = {
      'content-length': stat.size,
      'last-modified': stat.mtime.toUTCString(),
      'content-type': 'text/css'
    };
    stream.respondWithFD(fd, headers);
  }

});

server.listen(8442);