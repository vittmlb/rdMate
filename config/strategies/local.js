/**
 * Created by Vittorio on 27/03/2017.
 */
let passport = require('passport');
let LocalStrategy = require('passport-local').Strategy;
let User = require('mongoose').model('User');

module.exports = function() {
    passport.use(new LocalStrategy(function (email, senha, done) {
        User.findOne({
            email: email
        }, function (err, user) {
            if(err) return done(err);
            if(!user) return done(null, false, {
                message: 'Senha incorreta'
            });
            return done(null, user);
        });
    }));
};