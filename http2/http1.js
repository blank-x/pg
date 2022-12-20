const http = require('http');
const fs = require('fs');

const server = http.createServer(function(req,res){
  const path = req.url;
  if(path === '/img.png' || path === '/favicon.ico'){
    res.writeHead(200,{'Content-type':'image/png'})
    var stream = fs.createReadStream('img.png')
    stream.pipe(res)
  } else {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(`
      <h1>Hello World</h1>
      <script>
        for(var i=0;i<50;i++){
          fetch('/img.png')
        }
      </script>
    `);
  }
});


server.listen(8444);