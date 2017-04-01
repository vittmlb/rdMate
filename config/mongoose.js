/**
 * Created by Vittorio on 30/05/2016.
 */
let mongoose = require('mongoose');
let config = require('./config');

module.exports = function() {
    let db = mongoose.connect(config.db);

    mongoose.connection.on('connected', function () {
        console.log(`Mongoose connected at ${config.db}`);
    });

    mongoose.connection.on('err', function () {
        console.log(`Mongoose connection error: ${err}`);
    });

    mongoose.connection.on('disconnected', function () {
        console.log('Mongoose disconnected');
    });

    process.on('SIGINT', function () {
        mongoose.connection.close(function () {
            console.log(`Mongoose disconnected througth app termination`);
            process.exit(0);
        });
    });

    require('../app/models/users.server.model');
    require('../app/models/caixas.server.model');
    require('../app/models/lancamentos.server.model');
    require('../app/models/demonstrativos.server.model');

    return db;
};
