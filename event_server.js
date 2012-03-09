var connect = require('connect');

var routes = function (app) {
  app.get('/mentions/:term', function(req, res, next) {
    if (req.headers.accept == 'text/event-stream') {
      // cache and res and send initial connection
      res.writeHead(200, { 'content-type': 'text/event-stream', 'cache-control': 'nocache'});

      setInterval(function(){
        res.write('id:0\ndata: hello world\n\n');
      }, 1000);
      //res.end();
    } else {
      res.writeHead(404);
      res.end('No direct access allowed');
    }
  });
}

connect.createServer(
  connect.static(__dirname + '/public'),
  connect.router(routes)
).listen(8000);