'user strict'

var mongoose = require('mongoose');
var app = require('./app');
var port = process.env.port || 3977;

mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost:27017/cursomean2', { useNewUrlParser: true, useUnifiedTopology: true }, (err, res) => {
    if (err) {
        throw err;
    } else {
        console.log("La conexión con la base de datos esta funcionando correctamente!!");

        app.listen(port, function () {
            console.log("Servidor del API REST de Música escuchando en http://localhost:" + port);
        });
    }
});