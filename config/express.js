/**
 * Created by Vittorio on 30/05/2016.
 */

let config = require('./config');
let express = require('express');
let methodOverride = require('method-override');
let cors = require('cors');
let flash = require('connect-flash');
let path = require('path');
let morgan = require('morgan');
let compress = require('compression');
let bodyParser = require('body-parser');
let session = require('express-session');
let passport = require('passport');

module.exports = function() {

    let app = express();

    if(process.env.NODE_ENV === 'development') {
        app.use(morgan('dev'));
    } else if(process.env.NODE_ENV === 'production') {
        app.use(compress());
    }

    app.use(methodOverride());
    app.use(cors());
    app.use(flash());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(session({
        saveUninitialized: true,
        resave: true,
        secret: config.sessionSecret
    }));

    app.use(passport.initialize());
    app.use(passport.session());

    app.use(express.static('./public'));
    app.use(express.static('./app')); // Abriga as imagens upadas para o servidor.

    require('../app/routes/users.server.routes')(app);
    require('../app/routes/caixas.server.routes')(app);
    require('../app/routes/lancamentos.server.routes')(app);
    require('../app/routes/demonstrativos.server.routes')(app);

    return app;

};