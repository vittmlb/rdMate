/**
 * Created by Vittorio on 27/03/2017.
 */
let Users = require('mongoose').model('User');
let passport = require('passport');

let getErrorMessage = function(err) {
    let message = '';
    if (err.code) {
        switch (err.code) {
            case 11000:
            case 11001:
                message = 'Username already exists';
                break;
            default:
                message = 'Something went wrong';
        }
    } else {
        for (let errName in err.errors) {
            if (err.errors[errName].message) message = err.errors[errName].
                message;
        }
    }
    return message;
};

exports.create = function(req, res) {
    let user = new Users(req.body);
    user.save(function (err) {
        if(err) {
            return res.status(400).send({
                message: err
            });
        } else {
            res.json(user);
        }
    });
};

exports.list = function(req, res) {
    Users.find().exec(function (err, users) {
        if(err) {
            return res.status(400).send({
                message: err
            });
        } else {
            res.json(users);
        }
    });
};

exports.read = function(req, res) {
    res.json(req.user);
};

exports.findById = function(req, res, next, id) {
    Users.findById(id).exec(function (err, user) {
        if(err) return next(err);
        if(!user) return next(new Error(`Failed to load user id: ${id}`));
        req.user = user;
        next();
    });
};

exports.update = function(req, res) {
    let user = req.user;
    user.nome = req.body.nome;
    user.email = req.body.email;
    user.senha = req.body.senha;
    user.save(function (err) {
        if(err) {
            return res.status(400).send({
                message: err
            });
        } else {
            res.json(user);
        }
    });
};

exports.delete = function(req, res) {
    let user = req.user;
    user.remove(function (err) {
        if(err) {
            return res.status(400).send({
                message: err
            });
        } else {
            res.json(user);
        }
    });
};
