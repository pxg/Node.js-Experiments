var connect = require('connect');

var connections = [];
setInterval(function(){

  //res.write('id:0\ndata: hello world\n\n');
  var now = Date.now();
  connections.forEach(function(res) {
    // this will tell the frontend to retry if the connection is dropped
    res.write('id:0\nretry:10000\ntype:time\ndata: ' + now + '\n\n');
  });
}, 1000);


var routes = function (app) {
  app.get('/mentions/:term', function(req, res, next) {
    if (req.headers.accept == 'text/event-stream') {
      // cache and res and send initial connection
      res.writeHead(200, { 'content-type': 'text/event-stream', 'cache-control': 'nocache'});
      connections.push(res);
      // could write number of connections here?

      setTimeout(function(){
        res.end();
        req.emit('close');
      }, 5 * 1000);

    req.on('close', function () {
      var i = connections.indexOf(res);
      if (i !== -1) {
        connections.splice(i, 1);
      }
    });
      
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

/*
function sendSSE(res, id, event, message) {
  var data = '';
  if (event) {
    data += 'event:' + event + '\n';
  }

  // blank id resets the id counter
  if (id) {
    data += 'id:' + id + '\n';
  } else {
    data += 'id\n';
  }

  if (message) {
    data += 'data:' + message.split(/\n/).join('\ndata:') + '\n';
  //   data.split('\n').forEach(function (line) {
  //     res.write('data: ' + line + '\n');
  //   });
  }
  data += '\n'; // final part of message

  res.write(data);
  console.log('sent: ' + data);
}
*/