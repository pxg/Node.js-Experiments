var connect = require('connect');

var routes = function (app) {
  app.get("/", function (req, res) {
    //count++;
    //res.end(req.count.toString());
    res.end('blah');
  });
}

var server = connect.createServer(
  connect.logger(),
  connect.router(routes)
  /*
  connect.basicAuth('pete', '123456'),
  connect.directory(__dirname + '/public'),
  connect.static(__dirname + '/public')
  */
);
server.listen(8000);

/*
var connect = require(‘connect’);
function routes(app) {
  app.get(‘/mentions/:term’, function(req, res, next) {
    if (req.headers.accept == ‘text/event-stream’) {
      // cache res and send initial connection
    } else {
      res.writeHead(404);
      res.send(‘No direct access allowed’);
} });
}
connect.createServer(
  connect.static(__dirname),
  connect.router(routes)
).listen(8000);

res.writeHead(200, {
  ‘content-type’: ‘text/event-stream’,
  ‘cache-control’: ‘no-cache’
});
connections.push(res);
sendSSE(res);


req.on(‘close’, function () {
  var i = connections.indexOf(res);
  if (i !== -1) {
    connections.splice(i, 1);
  }
});
*/