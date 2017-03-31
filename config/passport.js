/**
 * Created by Vittorio on 27/03/2017.
 */
let passport = require('passport');
let mongoose = require('mongoose');

module.exports = function() {
    let User = mongoose.model('User');

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });
    passport.deserializeUser(function(id, done) {
        User.findOne({
            _id: id
        }, '-senha -salt', function(err, user) {
            done(err, user);
        });
    });
    require('./strategies/local')();
};
