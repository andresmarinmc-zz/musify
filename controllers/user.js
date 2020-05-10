'use strict'

var fs = require("fs");
var path = require("path");
var bcrypt = require("bcrypt-nodejs");
var User = require("../modelos/user");
var jwt = require("../services/jwt");

function pruebas(request, response) {
    response.status(200).send({
        message: "Probando una accion del controlador del usuario del api rest con node y mongo www"
    });
}

function getUser(req, res) {
    var id = req.params.id;

    User.findById(id, { "_id": 0, "name": 1, "surname": 1 }, (err, datos) => {
        if (err) {
            res.status(500).send({ message: 'Error al obtener usuario' });

        } else {
            if (!datos) {
                res.status(404).send({ message: 'El usuario no existe' });

            } else {
                res.status(200).send({ datos });

            }

        }
    });

}

function saveUser(req, res) {

    //Instancia del modelo User
    var user = new User();

    var params = req.body;

    //console.log(params);

    //Recibir por POST los parámetros que llegan del formulario
    user.name = params.name;
    user.surname = params.surname;
    user.email = params.email;
    user.password = params.password;
    user.role = 'ROLE_USER';
    user.image = 'null';

    //Guardar los datos en la base de datos MongoDB
    if (params.password) {
        bcrypt.hash(params.password, null, null, function (err, hash) {
            user.password = hash;
            if (user.name != null && user.surname != null && user.email != null) {
                user.save((err, userStored) => {
                    if (err) {
                        res.status(500).send({ message: "Error al guardar usuario" });
                    } else {
                        if (!userStored) {
                            res.status(404).send({ message: "Error al guardar usuario" });

                        } else {
                            res.status(200).send({ user: userStored });

                        }
                    }
                });
            } else {
                res.status(200).send({ message: "Completa todos los campos del formulario" });
            }
        })
    } else {

    }

}

function loginUser(req, res) {

    var params = req.body;

    var email = params.email;
    var password = params.password;

    User.findOne({ email: email.toLowerCase() }, (err, user) => {
        if (err) {
            res.status(500).send({ message: "Error al realizar la verificación de credenciales" });
        } else {
            if (!user) {
                res.status(404).send({ message: "El usuario no existe" });

            } else {
                bcrypt.compare(password, user.password, function (err, check) {
                    if (check) {

                        //console.log(params.gethash);
                        if (params.gethash) {
                            res.status(200).send({
                                token: jwt.createToken(user)
                            });
                        } else {
                            res.status(200).send({ user: user });

                        }

                    } else {
                        res.status(404).send({ message: "La contraseña es incorrecta" });

                    }
                });
            }
        }
    })

}


function updateUser(req, res) {

    var id = req.params.id;
    var params = req.body;

    if (id != req.user.sub) {
        return res.status(500).send({ message: "No tienes permisos para actualizar este usuario" });
    }

    User.findByIdAndUpdate(id, params, (err, userUpdate) => {

        if (err) {
            res.status(500).send({ message: "Error al actualizar el usuario" });

        } else {
            if (!userUpdate) {
                res.status(404).send({ message: "No se ha podido actualizar el usuario" });

            } else {

                ObtenerUsuarioPorId(res, id);

            }
        }

    });

}

function ObtenerUsuarioPorId(res, id) {

    User.findById(id, (err, datos) => {
        if (err) {
            res.status(500).send({ message: 'Error al obtener usuario' });

        } else {
            if (!datos) {
                res.status(404).send({ message: 'El usuario no existe' });

            } else {
                res.status(200).send({ datos });

            }

        }
    });
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

        if (file_ext == 'jpg' || file_ext == 'png') {

            User.findByIdAndUpdate(id, { image: file_name }, (err, userUpdate) => {

                if (!userUpdate) {
                    res.status(404).send({ message: "No se ha podido actualizar el usuario" });

                } else {

                    res.status(200).send({ image: file_name, user: userUpdate });
                    //ObtenerUsuarioPorId(res, id);

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
    var path_file = './uploads/users/' + imageFile;

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
    pruebas,
    saveUser,
    loginUser,
    updateUser,
    uploadImage,
    getImageFile,
    getUser
};