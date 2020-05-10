'use strict'

var express = require("express");
var SongController = require("../controllers/song");
var api = express.Router();
var middleware_authorization = require("../middlewares/authenticated");

var multiparty = require("connect-multiparty");
var middleware_upload = multiparty({ uploadDir: './uploads/songs' });

api.post('/song', middleware_authorization.ensureAuth, SongController.saveSong);
api.get('/song/:id', middleware_authorization.ensureAuth, SongController.getSong);
api.get('/songs/:album?', middleware_authorization.ensureAuth, SongController.getSongs);
api.put('/song/:id', middleware_authorization.ensureAuth, SongController.updateSong);
api.delete('/song/:id', middleware_authorization.ensureAuth, SongController.deleteSong);
api.post('/upload-audio-song/:id', [middleware_authorization.ensureAuth, middleware_upload], SongController.uploadAudio);
api.get('/get-audio-song/:audioFile', SongController.getAudioFile);

module.exports = api;