const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
var cors = require('cors');
const mongoose = require('./database');

const app = express();
const server = http.createServer(app);
const io = socketIO(server,{ 
  cors: {
    origin: 'http://localhost:3000'
  }
});


app.set('port', process.env.PORT || 5000);


require('./sockets')(io);

app.use(cors());
server.listen(app.get('port'), () => {
  console.log('Server on port', app.get('port'));
});
