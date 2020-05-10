'use strict'

var path = require('path');
var fs = require('fs');
var mongoosePaginate = require('mongoose-pagination');
var Artist = require('../modelos/artist');
var Album = require('../modelos/album');
var Song = require('../modelos/song');

function getArtist(req, res) {
    var artistId = req.params.id;

    Artist.findById(artistId, (err, artist) => {
        if (err) {
            res.status(500).send({ message: 'Error al obtener artista' });

        } else {
            if (!artist) {
                res.status(404).send({ message: 'El artista no existe' });

            } else {
                res.status(200).send({ artist });

            }

        }
    });

}

function getArtists(req, res) {
    var page = (req.params.page) ? req.params.page : 1;
    var itemsPerPage = 3;

    Artist.find().sort("id").paginate(page, itemsPerPage, function (err, artists, total) {
        if (err) {
            res.status(500).send({ message: 'Error al obtener artistas' });

        } else {
            if (!artists) {
                res.status(404).send({ message: 'No hay artistas !!' });

            } else {
                return res.status(200).send({
                    total_items_page: 4,
                    total_items: total,
                    artists: artists
                });
            }
        }
    });

}


function saveArtist(req, res) {

    var artist = new Artist();

    var params = req.body;
    artist.name = params.name;
    artist.description = params.description;
    artist.image = 'null';

    artist.save((err, artistStored) => {
        if (err) {
            res.status(500).send({ message: 'Error al guardar el artista' });

        } else {
            if (!artistStored) {
                res.status(404).send({ message: 'El artista no ha sido guardado' });

            } else {
                res.status(200).send({ artist: artistStored });

            }
        }
    });

}

function updateArtist(req, res) {

    var id = req.params.id;
    var params = req.body;

    Artist.findByIdAndUpdate(id, params, (err, Update) => {

        if (err) {
            res.status(500).send({ message: "Error al actualizar el artista" });

        } else {
            if (!Update) {
                res.status(404).send({ message: "El artista no se ha actualizado" });

            } else {
                res.status(200).send({ user: Update });

            }
        }

    });

}


function deleteArtist(req, res) {

    var id = req.params.id;

    Artist.findByIdAndRemove(id, (err, artistRemoved) => {
        if (err) {
            res.status(500).send({ message: "Error al eliminar el artista" });

        } else {
            if (!artistRemoved) {
                res.status(500).send({ message: "El artista no ha sido eliminado" });

            } else {

                Album.find({ artist: artistRemoved._id }).remove((err, albumRemoved) => {
                    if (err) {
                        res.status(500).send({ message: "Error al eliminar el álbum" });

                    } else {
                        if (!albumRemoved) {
                            res.status(500).send({ message: "El álbum no ha sido eliminado" });

                        } else {

                            Song.find({ artist: albumRemoved._id }).remove((err, songRemoved) => {
                                if (err) {
                                    res.status(500).send({ message: "Error al eliminar la canción" });

                                } else {
                                    if (!songRemoved) {
                                        res.status(500).send({ message: "La canción no ha sido eliminada" });

                                    } else {
                                        res.status(200).send({ artistRemoved });

                                    }
                                }
                            })//Eliminar Canción

                        }
                    }
                })//Eliminar Album
            }
        }
    })//Eliminar Artista

}

function uploadImage(req, res) {

    var id = req.params.id;
    var file_name = 'No subido...';

    if (req.files) {
        var file_path = req.files.image.path;
        var file_split = file_path.split("/");
        var file_name = file_split[2];

        var ext_split = file_name.split(".");
        var file_ext = ext_split[1];

        if (file_ext == 'jpeg' || file_ext == 'jpg' || file_ext == 'png' || file_ext == 'gif') {

            Artist.findByIdAndUpdate(id, { image: file_name }, (err, artistUpdate) => {

                if (!artistUpdate) {
                    res.status(404).send({ message: "No se ha podido actualizar la imagen del artista" });

                } else {
                    res.status(200).send({ artist: artistUpdate });

                }

            });

        } else {
            res.status(404).send({ message: "Tipo de extensión de imagen no permitida" });
        }

    } else {
        res.status(404).send({ message: "No se ha subido ninguna imagen" });
    }

}

function getImageFile(req, res) {
    var imageFile = req.params.imageFile;
    var path_file = './uploads/artists/' + imageFile;

    //fs es de la libreria file system
    fs.exists(path_file, function (exists) {
        if (exists) {
            //Responder con envio de fichero al usuario resolvendo la ruta del archivo
            res.sendFile(path.resolve(path_file));
        } else {
            res.status(200).send({ message: 'No existe la imagen...' });
        }
    });
}

module.exports = {
    getArtist,
    saveArtist,
    getArtists,
    updateArtist,
    deleteArtist,
    uploadImage,
    getImageFile
}