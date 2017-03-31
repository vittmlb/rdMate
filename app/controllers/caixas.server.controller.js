/**
 * Created by Vittorio on 22/03/2017.
 */
let mongoose = require('mongoose');
let Caixas = mongoose.model('Caixa');

exports.create = function(req, res) {
    let caixa = new Caixas(req.body);
    caixa.save(function (err) {
        if(err) {
            return res.status(400).send({
                message: err
            });
        } else {
            res.json(caixa);
        }
    });
};

exports.list = function(req, res) {
    Caixas.find().exec(function (err, caixas) {
        if(err) {
            return res.status(400).send({
                message: err
            });
        } else {
            res.json(caixas);
        }
    });
};

exports.read = function(req, res) {
    res.json(req.caixa);
};

exports.findById = function(req, res, next, id) {
    Caixas.findById(id).exec(function (err, caixa) {
        if(err) return next(err);
        if(!caixa) return next(new Error(`Failed to load caixa id: ${id}`));
        req.caixa = caixa;
        next();
    });
};

exports.findByIdAggregate = function(req, res, next, id) {
    Caixas.aggregate([
        {$match: {_id: mongoose.Types.ObjectId(id)}},
        {$unwind: "$lancamentos.despesas.manha"},
        {
            $group: {
                _id: {
                    title: '$data_caixa',
                    abertura: '$abertura'
                },
                totalEnergySaving: { $sum: '$lancamentos.despesas.manha.valor' },
            }
        },
        {$unwind: "$lancamentos.despesas.tarde"},
        {
            $group: {
                tarde: { $sum: '$lancamentos.despesas.tarde.valor' },
            }
        },
        {
            $project: {
                _id: 0,
                teste: '$$ROOT',
                abertura: '$_id.abertura',
                vendas: '$vendas',
                lancamentos: '$lancamentos',
                movimentacao: '$movimentacao',
                acompanhamentos: '$acompanhamentos',
                conferencias: '$conferencias',
                title: '$_id.title',
                totalEnergySaving: 1,
                tarde: 1
            }
        }
        // {$group: {"_id": "$lancamentos", "total": {$sum: "$lancamentos.despesas.manha.valor"}}}
        // {$group: {_id: {total_despesas_manha: '$lancamentos.despesas.manha.valor'}}}
    ]).exec(function (err, caixa) {
        if(err) return next(err);
        if(!caixa) return next(new Error(`Failed to load caixa id: ${id}`));
        req.caixa = caixa;
        next();
    });
};

exports.findByIdMap = function(req, res, next, id) {
    let o = {};
    o.map = function() {
        emit(this.data_caixa, {
            'total': 10
        });
    };
    o.reduce = function(k, vals) {
        return vals;
    };
    Caixas.mapReduce(o, function (err, results) {
        if(err) {
            console.log(err);
        } else {
            console.log(results);
        }
    }).exec(function(err, cx) {
        if(err) {
            res.status(400).send({
                message: err
            });
        } else {
            res.json(cx);
        }
    });
};

exports.update = function(req, res) {
    let caixa = req.caixa;
    caixa.data_caixa = req.body.data_caixa;
    caixa.abertura = req.body.abertura;
    caixa.lancamentos = req.body.lancamentos;
    caixa.movimentacao = req.body.movimentacao;
    caixa.save(function (err) {
        if(err) {
            return res.status(400).send({
                message: err
            });
        } else {
            res.json(caixa);
        }
    });
};

exports.delete = function(req, res) {
    let caixa = req.caixa;
    caixa.remove(function (err) {
        if(err) {
            return res.status(400).send({
                message: err
            });
        } else {
            res.json(caixa);
        }
    });
};