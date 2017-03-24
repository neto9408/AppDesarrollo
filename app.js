var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
//librerias de passport
var passport = require("passport");
var localStrategy = require("passport-local").Strategy;
var FacebookStrategy = require("passport-facebook").Strategy;
var session = require("body-parser");
var bcrypt = require("bcrypt-nodejs");
var UsuarioModel = require("./models/usuarios");

//mongoose
var mongoose = require("mongoose");
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://<prueba>:<prueba  >@ds141490.mlab.com:41490/usadb");



var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

app.use(session({ secret: "es una frae", cookie: { maxAge: 60000 }, resave: true, saveUninitialize: true }));
app.use(passport.initialize());
app.use(passport.session());

//configuracion passport
passport.use(new localStrategy(
  function (correo, clave, done) {
    new UsuarioModel.usuarios({ correo: correo }).fetch().then(
      function (info) {
        var usuarioInfo = info;
        if (usuarioInfo == null) {
          return done(null, false, { mensaje: "email no valido" });
        } else {
          usuarioInfo = usuarioInfo.toJSON();
          if (!bcrypt.compareSync(clave, usuarioInfo.clave)) {
            return done(null, false, { mensaje: "clave  no valido" });
          } else {
            return done(null, usuarioInfo);
          }
        }
      }
    );
  }
));

passport.use(
  new FacebookStrategy({
    clientID: '396811740700898',
    clientSecret: 'bb3fe1a6b86b0458654b4b29d6779e50',
    callbackURL: "http://localhost:3000/users/auth/facebook/callback"
  },

    function (res, refreshToken, profile, done) {
      console.log(profile);
    }
  )
);

passport.serializeUser(
  function (usuario, done) {
    done(null, usuario);
  }
);
passport.deserializeUser(
  function (id, done) {
    User.findeById(Id, function (err, user) {
      done(error, user);
    });
  },
  function (usuario, done) {
    new UsuarioModel.usuarios({ usuario: usuario }).fetch().then(
      function (usuario) {
        done(null, usuario);
      }
    );
  }
);



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
