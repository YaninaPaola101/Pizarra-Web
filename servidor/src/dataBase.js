const mongoose = require('mongoose');

// Establecemos la conexión a la base de datos
mongoose.connect('mongodb://localhost:27017/canvas', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(db=>(console.log('conectadoa basse de datos'))).catch(err=>(console.log('error')));

module.exports = mongoose;
