'use strict'

var express = require("express");
var AlbumController = require("../controllers/album");
var api = express.Router();
var middleware_authorization = require("../middlewares/authenticated");
var multiparty = require("connect-multiparty");
var middleware_upload = multiparty({ uploadDir: './uploads/album' });

api.get('/album/:id', middleware_authorization.ensureAuth, AlbumController.getAlbum);
api.post('/album', middleware_authorization.ensureAuth, AlbumController.saveAlbum);
api.get('/albums/:artist?', middleware_authorization.ensureAuth, AlbumController.getAlbums);
api.put('/album/:id', middleware_authorization.ensureAuth, AlbumController.updateAlbum);
api.delete('/album/:id', middleware_authorization.ensureAuth, AlbumController.deleteAlbum);
api.post('/upload-image-album/:id', [middleware_authorization.ensureAuth, middleware_upload], AlbumController.uploadImage);
api.get('/get-image-album/:imageFile', AlbumController.getImageFile);

module.exports = api;