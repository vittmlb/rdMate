/**
 * Created by Vittorio on 30/03/2017.
 */
let Lancamentos = require('mongoose').model('Lancamento');

exports.create = function(req, res) {
    let lancamento = new Lancamentos(req.body);
    lancamento.save(function (err) {
        if(err) {
            return res.status(400).send({
                message: err
            });
        } else {
            res.json(lancamento);
        }
    });
};

exports.list = function(req, res) {
    Lancamentos.find().exec(function (err, lancamentos) {
        if(err) {
            return res.status(400).send({
                message: err
            });
        } else {
            res.json(lancamentos);
        }
    });
};

exports.read = function(req, res) {
    res.json(req.lancamento);
};

exports.findById = function(req, res, next, id) {
    Lancamentos.findById(id).exec(function (err, lancamento) {
        if(err) return next(err);
        if(!lancamento) return next(new Error(`Não foi possível carregar o lançamento de id: ${id}`));
        req.lancamento = lancamento;
        next();
    });
};

exports.update = function(req, res) {
    let lancamento = req.lancamento;
    lancamento.data = req.body.data;
    lancamento.categoria = req.body.categoria;
    lancamento.subcategoria = req.body.subcategoria;
    lancamento.nome = req.body.nome;
    lancamento.descricao = req.body.descricao;
    lancamento.observacao = req.body.observacao;
    lancamento.valor = req.body.valor;
    lancamento.save(function (err) {
        if(err) {
            return res.status(400).send({
                message: err
            });
        } else {
            res.json(lancamento);
        }
    });
};

exports.delete = function(req, res) {
    let lancamento = req.lancamento;
    lancamento.remove(function (err) {
        if(err) {
            return res.status(400).send({
                message: err
            });
        } else {
            res.json(lancamento);
        }
    });
};