/**
 * Created by Vittorio on 27/03/2017.
 */
let users = require('../controllers/users.server.controller');
let passport = require('passport');

module.exports = function(app) {

    app.route('/api/users')
        .get(users.list)
        .post(users.create);

    app.route('/api/users/:userId')
        .get(users.read)
        .put(users.update)
        .delete(users.delete);

    app.route('/login')
        .post(passport.authenticate('local', {
            successRedirect: '/',
            failureRedirect: '/caixas',
            failureFlash: true
        }));

    app.param('userId', users.findById);

};