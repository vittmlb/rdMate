/**
 * Created by Vittorio on 31/03/2017.
 */
let Demonstrativos = require('mongoose').model('Demonstrativo');
let moment = require('moment');
moment.locale('pt-br');

exports.create = function(req, res) {
    let demonstrativo = new Demonstrativos(req.body);
    demonstrativo.save(function (err) {
        if(err) {
            return res.status(400).send({
                message: err
            });
        } else {
            res.json(demonstrativo);
        }
    });
};

exports.list = function(req, res) {
    Demonstrativos.find().exec(function (err, demonstrativos) {
        if(err) {
            return res.status(400).send({
                message: err
            });
        } else {
            res.json(demonstrativos);
        }
    });
};

exports.read = function(req, res) {
    res.json(req.demonstrativo);
};

exports.findById = function(req, res, next, id) {
    Demonstrativos.findById(id).exec(function (err, demonstrativo) {
        if(err) return next(err);
        if(!demonstrativo) return next(new Error(`Falha ao carregar o demonstrativo de id: ${id}`));
        req.demonstrativo = demonstrativo
    });
};

exports.update = function(req, res) {
    let demonstrativo = req.demonstrativo;
    demonstrativo.periodo = req.body.periodo;
    demonstrativo.receitas = req.body.receitas;
    demonstrativo.save(function (err) {
        if(err) {
            return res.status(400).send({
                message: err
            });
        } else {
            res.json(demonstrativo);
        }
    });
};

exports.delete = function(req, res) {
    let demonstrativo = req.demonstrativo;
    demonstrativo.remove(function (err) {
        if(err) {
            return res.status(400).send({
                message: err
            });
        } else {
            res.json(demonstrativo);
        }
    });
};

exports.findCustom = function(req, res, next, data) {
    filterDate(req, res, data)
};

function filterDate(req, res, data) {
    let teste = new Date();
    let z = moment().format('MMMM Do YYYY, h:mm:ss a');
    console.log(z);
    Demonstrativos.aggregate([
        {$match: {"created": {"$lt": teste}}},
        // {$match: {"teste": "aloha"}},
    ]).exec(function (err, demonstrativos) {
        if(err) return next(err);
        if(!demonstrativos) return next(new Error(`Failed to load demonstrativos id: ${id}`));
        req.demonstrativos = demonstrativos;
        next();
    });
}

function teste() {
    Demonstrativos.aggregate([
        {$group: {_id: "$tipo_set", tipos: {$push: "$$ROOT"}}}
    ]).exec(function (err, amazonRule) {
        if(err) return next(err);
        if(!amazonRule) return next(new Error(`Failed to Group By TipoSet: ${tipo_set}`)); // todo: Usar uma mensagem de erro decente.
        req.amazonRule = auxGroupByTipoSet(amazonRule);
        next();
    });
}