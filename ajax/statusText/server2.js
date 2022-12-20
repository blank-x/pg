const http = require('http');

const server = http.createServer(function(req,res){
  const path = req.url;
  if(path === '/ajax'){
    res.writeHead(200,{'Content-type':'application/json'})
    const data = { data: 'xxxx' };
    res.end(JSON.stringify(data))
  } else {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(`
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


server.listen(8456);