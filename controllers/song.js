'use strict'

var path = require('path');
var fs = require('fs');

var Song = require('../modelos/song');

function getSong(req, res) {
    var id = req.params.id;

    Song.findById(id).populate({ path: 'album' }).exec((err, song) => {
        if (err) {
            res.status(500).send({ message: 'Error en el servidor al obtener canción' });

        } else {
            if (!song) {
                res.status(404).send({ message: 'La canción no existe' });

            } else {
                res.status(200).send({ song });

            }
        }
    });

}

function saveSong(req, res) {
    var song = new Song();

    var params = req.body;
    song.number = params.number;
    song.name = params.name;
    song.duration = params.duration;
    song.file = 'null';
    song.album = params.album;

    song.save((err, SongStored) => {
        if (err) {
            res.status(500).send({ message: 'Error en el servidor al guardar la canción' });

        } else {
            if (!SongStored) {
                res.status(404).send({ message: 'La canción no ha sido guardada' });

            } else {
                res.status(200).send({ song: SongStored });

            }
        }
    });

}

function getSongs(req, res) {
    var albumId = req.params.album;

    if (!albumId) {
        var find = Song.find({}).sort("number");

    } else {
        var find = Song.find({ album: albumId }).sort("number");

    }

    find.populate({
        path: 'album',
        populate: {
            path: 'artist',
            model: 'Artist'
        }
    }).exec((err, songs) => {
        if (err) {
            res.status(500).send({ message: 'Error en el servidor al obtener canciones' });
        } else {
            if (!songs) {
                res.status(404).send({ message: 'No hay canciones' });

            } else {
                res.status(200).send({ songs });

            }

        }
    });


}

function updateSong(req, res) {

    var id = req.params.id;
    var params = req.body;

    Song.findByIdAndUpdate(id, params, (err, Update) => {

        if (err) {
            res.status(500).send({ message: "Error al actualizar la canción" });

        } else {
            if (!Update) {
                res.status(404).send({ message: "La canción no se ha actualizado" });

            } else {
                res.status(200).send({ song: Update });

            }
        }

    });

}

function deleteSong(req, res) {

    var id = req.params.id;

    Song.findByIdAndRemove(id, (err, songRemoved) => {
        if (err) {
            res.status(500).send({ message: "Error al eliminar la canción" });

        } else {
            if (!songRemoved) {
                res.status(500).send({ message: "La canción no ha sido eliminada" });

            } else {
                res.status(200).send({ songRemoved });

            }
        }
    })

}

function uploadAudio(req, res) {

    var id = req.params.id;
    var file_name = 'No subido...';

    if (req.files) {
        var file_path = req.files.audio.path;
        var file_split = file_path.split("/");
        var file_name = file_split[2];

        var ext_split = file_name.split(".");
        var file_ext = ext_split[1];

        if (file_ext == 'mp3' || file_ext == 'mp4' || file_ext == 'wav') {

            Song.findByIdAndUpdate(id, { file: file_name }, (err, update) => {

                if (!update) {
                    res.status(404).send({ message: "No se ha podido actualizar el audio de la canción" });

                } else {
                    res.status(200).send({ song: update });

                }

            });

        } else {
            res.status(404).send({ message: "Tipo de extensión de audio no permitido" });
        }

    } else {
        res.status(404).send({ message: "No se ha subido ningún audio" });
    }

}

function getAudioFile(req, res) {
    var songFile = req.params.audioFile;
    var path_file = './uploads/songs/' + songFile;

    fs.exists(path_file, function (exists) {
        if (exists) {
            res.sendFile(path.resolve(path_file));
        } else {
            res.status(200).send({ message: 'No existe el audio...' });
        }
    });
}

module.exports = {
    getSong,
    saveSong,
    getSongs,
    updateSong,
    deleteSong,
    uploadAudio,
    getAudioFile
}