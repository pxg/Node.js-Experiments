var connect = require('connect');
var connections = [];
var messages = {};
var id = 0;

// looping on the server (never stops while server is running)
setInterval(function(){
  var now = Date.now();
  // id needed if we want last-event-id
  messages[id] = 'id:' + id + '\nretry:10000\ntype:time\ndata: ' + now + '\n\n';
  // write to all connections
  connections.forEach(function(res) {
    res.write(messages[id]);
  });
  // increment id
  id++;
}, 1000);

var routes = function (app) {
  app.get('/mentions/:term', function(req, res, next) {
    var last_id = null;

    // check the headers are for event stream
    if (req.headers.accept == 'text/event-stream') {
      // write header
      res.writeHead(200, { 'content-type': 'text/event-stream', 'cache-control': 'nocache'});
      // add this new connection to the others
      connections.push(res);
      console.log('Num of connections ' + Object.keys(connections).length);

      // if not the first message (last event id  provided)
      if(req.headers['last-event-id']){
        last_id = req.headers['last-event-id'] * 1; // cast to number
        // while not up to date on messages
        while(last_id < id){
          res.write(messages[last_id]);
          console.log(id + ': ' + last_id + ': ' + messages[last_id]);
          last_id++;
        }
      }

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