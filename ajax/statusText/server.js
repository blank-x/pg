const http2 = require('http2');
const fs = require('fs');
console.log()
const { HTTP2_HEADER_PATH } = http2.constants;

const server = http2.createSecureServer({
  key: fs.readFileSync('localhost-privkey.pem'),
  cert: fs.readFileSync('localhost-cert.pem')
});
server.on('error', (err) => console.error(err));

server.on('stream', (stream, headers) => {
  // stream is a Duplex
  const path = headers[':path'];

  if(path === '/ajax'){
    const headers = {
      'content-type': 'application/json'
    };
    stream.respond(headers);
    const data = { data: 'xxxx' };
    stream.end(JSON.stringify(data))

  } else if(path === '/') {
    stream.respond({
      'content-type': 'text/html; charset=utf-8',
      ':status': 200
    });

    stream.end(`
      <h1>Hello World</h1>
      <script>
        setTimeout(()=>{
          fetch('/ajax').then(res=>{
            console.log(res);
          })
          let xhr = new XMLHttpRequest()
          xhr.open('get', '/ajax', true)
          xhr.send(null);
          xhr.onreadystatechange =function () {
            /* 即使把下面的send注释掉，xhr.readyState也会出现1 */
            if(xhr.readyState === 4){
              console.log(xhr);
            }
          }
        },2000)
      </script>
   
    `);
  }

});

server.listen(8455);