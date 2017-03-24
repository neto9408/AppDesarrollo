var express = require('express');
var router = express.Router();

var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
var session = require("express-session");
var bcrypt = require("bcrypt-nodejs");
var UsuarioModel = require("../models/usuarios");
var bodyParse = require("body-parser");
var urlencodedParse = bodyParse.urlencoded({ extend: false });

router.post("/iniciarSesion", urlencodedParse, function (req, res, next) {
  passport.authenticate('local',
    {
      sucessRedirect: "/bienvenido",
      failureRedirect: "/login"
    },
    function (err, usuario, info) {
      if (err) {
        return res.render("login", { title: "Express", error: err.message })
      }
      if (!usuario) {
        return res.render("login", { title: "Express", error: info.message })
      }
      return req.login(usuario, function (err) {
        if (err) {
          return res.render("login", { title: "Express", error: err.message })
        } else {
          res.render('bienvenido', { title: 'Bienvenido', usuario: usuario });
        }
      });
    }
  )(req, res, next);
});

router.post("/singup", function (req, res) {
  var usuario = req.body;
  var usuarioPromise = new UsuarioModel.usuarios({ correo: usuario.correo }).fetch();
  return usuarioPromise.then(
    function (modelo) {
      if (modelo) {
        res.render("index", { tittle: "Registrar usuario", error: "El usuario exisite" });
      } else {
        usuario.clave = bcrypt.hashSync(usuario.clave);
        var modeloUsuario = new UsuarioModel.usuarios(
          {
            nombre: usuario.nombre,
            apellido: usuario.apellido,
            correo: usuario.correo,
            clave: usuario.clave
          }
        );
        modeloUsuario.save().then(function (modelo) {
          res.render("index", { tittle: "Registrar usuario", error: "El usuario fue creado" });
        });
      }
    }
  );
});

router.post("/cerrarSesion", function (req, res) {
  if (!req.isAuthenticated()) {
    request.logout();
    res.redirect("/");
  }
});

router.get('/auth/facebook',
  passport.authenticate('facebook')
);

router.get('/auth/facebook/callback',
  passport.authenticate('facebook', {failureRedirect:'login'}),
    function(req, res){
      res.redirect("/bienvenido");
    }
  );

module.exports = router;
