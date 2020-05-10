'use strict'

var path = require('path');
var fs = require('fs');

var Album = require('../modelos/album');
var Song = require('../modelos/song');

function getAlbum(req, res) {
    var id = req.params.id;

    Album.findById(id).populate({ path: 'artist' }).exec((err, album) => {
        if (err) {
            res.status(500).send({ message: 'Error en el servidor al obtener el album' });

        } else {
            if (!album) {
                res.status(404).send({ message: 'El album no existe' });

            } else {
                res.status(200).send({ album });

            }
        }
    });

}

function saveAlbum(req, res) {
    var album = new Album();

    var params = req.body;
    album.title = params.title;
    album.description = params.description;
    album.year = params.year;
    album.image = 'null';
    album.artist = params.artist;

    album.save((err, albumStored) => {
        if (err) {
            res.status(500).send({ message: 'Error en el servidor al guardar el album' });

        } else {
            if (!albumStored) {
                res.status(404).send({ message: 'El album no ha sido guardado' });

            } else {
                res.status(200).send({ album: albumStored });

            }
        }
    });

}

function getAlbums(req, res) {
    var artistId = req.params.artist;

    if (!artistId) {
        var find = Album.find({}).sort("title");

    } else {
        var find = Album.find({ artist: artistId }).sort("year");

    }

    find.populate({ path: 'artist' }).exec((err, albums) => {
        if (err) {
            res.status(500).send({ message: 'Error en el servidor al obtener albums' });
        } else {
            if (!albums) {
                res.status(404).send({ message: 'No hay albums' });

            } else {
                res.status(200).send({ albums });

            }

        }
    });


}

function updateAlbum(req, res) {

    var id = req.params.id;
    var params = req.body;

    Album.findByIdAndUpdate(id, params, (err, Update) => {

        if (err) {
            res.status(500).send({ message: "Error al actualizar el álbum" });

        } else {
            if (!Update) {
                res.status(404).send({ message: "El álbum no se ha actualizado" });

            } else {
                res.status(200).send({ album: Update });

            }
        }

    });

}

function deleteAlbum(req, res) {

    var id = req.params.id;

    Album.findByIdAndRemove(id, (err, albumRemoved) => {
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
                            res.status(200).send({ albumRemoved });

                        }
                    }
                })//Eliminar Canción

            }
        }
    })//Eliminar Album

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

        if (file_ext == 'jpg' || file_ext == 'png' || file_ext == 'gif') {

            Album.findByIdAndUpdate(id, { image: file_name }, (err, update) => {

                if (!update) {
                    res.status(404).send({ message: "No se ha podido actualizar la imagen del álbum" });

                } else {
                    res.status(200).send({ album: update });

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
    var path_file = './uploads/album/' + imageFile;

    fs.exists(path_file, function (exists) {
        if (exists) {
            res.sendFile(path.resolve(path_file));
        } else {
            res.status(200).send({ message: 'No existe la imagen...' });
        }
    });
}

module.exports = {
    getAlbum,
    saveAlbum,
    getAlbums,
    updateAlbum,
    deleteAlbum,
    uploadImage,
    getImageFile
}