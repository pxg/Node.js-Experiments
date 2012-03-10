// chat.js
var connect = require('connect'),
ws = require('websocket.io'); // just websockets
var connections = []; // array?


var broadcast = function (sock, msg) {
  console.log('broadcasting');
  
  // could check here to not send the user their own message
  connections.forEach(function(conn) {
    // TODO: add a regex string to look for different message types
    conn.send(msg);

    // TODO: add a robot. Regex for 'robot'
    //var re = new RegExp(document.demoMatch.regex.value);
    //if (document.demoMatch.subject.value.match(re)) {
    if(msg == "ROBOT"){
      conn.send('i am selling robot insurance');
    } else {
      conn.send(msg);
    }
  });
  
}


var app = connect.createServer(
  connect.static(__dirname)
).listen(process.env.PORT || 8000);

ws.attach(app).on('connection',function(sock){
  connections.push(sock);
  console.log('Num of connections ' + Object.keys(connections).length);

  sock.on('message', function (msg) {
    // new message in from socket
    //console.log('messsage! ' + msg);
    broadcast(sock, msg);

  }).on('close', function () {
      // now clean up disconnect here
      var i = connections.indexOf(sock);
      if (i !== -1) {
        connections.splice(i, 1);
      }
  });
});

// 3. support message types
// 4. add a robot to run special commands