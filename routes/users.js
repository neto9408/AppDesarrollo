var express = require('express');
var router = express.Router();
var passport = require("passport");
var localStrategy = require("passport-local").Strategy;
var session = require("body-parser");
var bcrypt = require("bcrypt-nodejs");
var UsuarioModel = require("../models/usuarios");
var bodyParse = require("body-parser");
var urlencodedParse = bodyParse.urlencoded({extended: false});
 
router.post("/cerrarSesion", urlencodedParse, function(req,res,next){
 

});


router.post("/IniciarSesion", urlencodedParse, function(req,res,next){
    passport.authenticate(
      'local',
      {
        successRedirect: "/bienvenido",
        failureRedirect: "/login"
      },
      function(err, usuario, info){
          if(err){
            return res.render("login", {title:"Express",error:err.message});
          }
          if (!usuario){
            return res.render("login", {title: "Express", error:"Usario no valido"});
          }
          return req.logIn(usuario, function(err){
                if(err){
                    return res.render("login", {title:"Express",error:err.message});
                }else{
                  res.render("bienvenido", {title:'bienvenido',usuario:usuario});
                }
          });
      })(req,res,next);

});
router.post("/signUp", function(req, res){
  var usuario= req.body;
  console.log(usuario);
  var usuarioPromise = new UsuarioModel.usuarios({"correo": usuario.correo}).fetch();
  return usuarioPromise.then(
      function(modelo){
        if(modelo){
          res.render("index", {title:"REgistrar Usuario",error:"el usuario existe"});
        }else{
          usuario.clave = bcrypt.hashSync(usuario.clave);
          var modelUsuarios = new  UsuarioModel.usuarios({
            nombre : usuario.nombre,
            apellido: usuario.apellido,
            correo: usuario.correo,
            clave: usuario.clave

          });
          modelUsuarios.save().then(function(modelo){
            res.render("index", {title:"REgistrar Usuario",error:"el usuario fue creado"});
          }); 
        }
      }
  );
});

router.get('/auth/facebook',passport.authenticate('facebook'));


router.get('/auth/facebook/callback',
  passport.authenticate('facebook',{failureRedirect:'signUp'},
  function(req,res){
    res.redirect("/bienvenido");}
  ));

module.exports = router;
