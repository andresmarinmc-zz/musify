'use strict'

var express = require("express");
var ArtistController = require("../controllers/artist");
var api = express.Router();
var middleware_authorization = require("../middlewares/authenticated");
var multiparty = require("connect-multiparty");
var middleware_upload = multiparty({ uploadDir: './uploads/artists' });

api.get('/artist/:id', middleware_authorization.ensureAuth, ArtistController.getArtist);
api.post('/artist', middleware_authorization.ensureAuth, ArtistController.saveArtist);
api.get('/artists/:page?', middleware_authorization.ensureAuth, ArtistController.getArtists);
api.put('/artist/:id', middleware_authorization.ensureAuth, ArtistController.updateArtist);
api.delete('/artist/:id', middleware_authorization.ensureAuth, ArtistController.deleteArtist);
api.post('/upload-image-artist/:id', [middleware_authorization.ensureAuth, middleware_upload], ArtistController.uploadImage);
api.get('/get-image-artist/:imageFile', ArtistController.getImageFile);

module.exports = api;