var connect = require('connect');

var connections = [];
// messages object (non foreach)
var messages = {};
var id = 0;

// looping on the server
setInterval(function(){
  var now = Date.now();
  messages[id] = 'id:' + id + '\nretry:10000\ntype:time\ndata: ' + now + '\n\n';

  connections.forEach(function(res) {
    // this will tell the frontend to retry if the connection is dropped
    res.write(messages[id]);
  });

  id++;

}, 1000);


var routes = function (app) {
  app.get('/mentions/:term', function(req, res, next) {
    var last_id = null;

    if (req.headers.accept == 'text/event-stream') {
      // cache and res and send initial connection

      res.writeHead(200, { 'content-type': 'text/event-stream', 'cache-control': 'nocache'});
      connections.push(res);
      // could write number of connections here?

/*
23: 14: undefined
23: 15: undefined
23: 16: undefined
23: 17: undefined
23: 18: undefined
23: 19: undefined
23: 20: undefined
23: 21: undefined
23: 22: undefined
23: 23: undefined
24: 14: undefined
24: 15: undefined
24: 16: undefined
24: 17: undefined
24: 18: undefined
24: 19: undefined
24: 20: undefined
24: 21: undefined
24: 22: undefined
24: 23: id:23
*/
      //console.log(req.headers);
      if(req.headers['last-event-id']){
        //console.log(req.headers['last-event-id']);
        last_id = req.headers['last-event-id'] * 1; // for number

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