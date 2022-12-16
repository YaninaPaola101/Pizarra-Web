module.exports = io => {
  const mongoose = require('./database');
  const connections = {};

  const jsonSchema = new mongoose.Schema({
    sala: String,
    lienzo: String,
  });
  const JsonModel = mongoose.model('Json', jsonSchema);

  io.on('connection', socket => {
    console.log("nuevo cliente =",socket.id);
    socket.on('join room', (roomId) => {
      connections[socket.id] = roomId;
      console.log(socket.id+ 'se unio a sala '+roomId);
      socket.join(roomId);
    });

    socket.on('terminado', data=>{
      const roomId = connections[socket.id];
      io.to(roomId).emit('terminado', { lienzoActual: data.lienzoActual });

      const jsonData = new JsonModel({
        sala: roomId,
        lienzo: data.lienzoActual
      });

      MyModel.updateOne({sala: roomId}, {sala: roomId, lienzo:data.lienzoActual}, {upsert: true}, function(error) {
        if (error) {
          // maneja el error
        } else {
          console.log('Documento guardado con éxito');
        }
      });    
    })

    socket.on('guardar', data => {
      const roomId = connections[socket.id];
      const jsonData = new JsonModel({
        sala: roomId,
        lienzo: data.lienzoActual
      });
      jsonData.save((error) => {
        if (error) {
          console.log(error);
        } else {
          console.log('Documento guardado con éxito');
        }
      });
    });
  });

};
