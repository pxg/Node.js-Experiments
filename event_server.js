var connect = require('connect');

var routes = function (app) {
  app.get('/mentions/:term', function(req, res, next) {
    if (req.headers.accept == 'text/event-stream') {
      // cache and res and send initial connection
    } else {
      res.writeHead(404);
      res.end('No direct access allowed');
    }
  });
}

/*
var server = connect.createServer(
  connect.logger(),
  connect.router(routes)
);
server.listen(8000);
*/
connect.createServer(
  connect.static(__dirname + '/public'),
  connect.router(routes)
).listen(8000);