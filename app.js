'use strict'

var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');

var app = express();

//Cargar Rutas
var user_routes = require("./routes/user");
var artist_routes = require("./routes/artist");
var album_routes = require("./routes/album");
var song_routes = require("./routes/song");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Configurar Cabeceras HTTP
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');

    next();
});


//Rutas Base
/* ESTO ES SOLO PARA PRODUCCION */ app.use('/', express.static('client', {redirect: false}));
app.use("/api", user_routes);
app.use("/api", artist_routes);
app.use("/api", album_routes);
app.use("/api", song_routes);

/* ESTO ES SOLO PARA PRODUCCION */ app.get('*', function (req, res, next) {
    res.sendFile(path.resolve('client/index.html'));
});

/*
app.get("/pruebas", function(request, response) {
    response.status(200).send({message: 'Bienvenido al Curso de victor robles'});
});
*/

module.exports = app;