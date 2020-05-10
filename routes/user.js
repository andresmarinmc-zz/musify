'use strict'

var express = require("express");
var UserController = require("../controllers/user");

var api = express.Router();
var middleware_authorization = require("../middlewares/authenticated");

var multiparty = require("connect-multiparty");
var middleware_upload = multiparty({ uploadDir: './uploads/users' });

api.get('/user/:id', middleware_authorization.ensureAuth, UserController.getUser);
api.post('/register', UserController.saveUser);
api.post('/login', UserController.loginUser);
api.put('/update-user/:id', middleware_authorization.ensureAuth, UserController.updateUser);
api.post('/upload-image-user/:id', [middleware_authorization.ensureAuth, middleware_upload], UserController.uploadImage);
api.get('/get-image-user/:imageFile', UserController.getImageFile);

module.exports = api;