/**
 * Created by Vittorio on 30/03/2017.
 */
let mongoose = require('mongoose');
mongoose.Promise = global.Promise;
let Lancamentos = mongoose.model('Lancamento');

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

exports.findCustoms = function(req, res, next, data) {
    let obj = {
        req: req,
        res: res,
        next: next
    };
    let aux = JSON.parse(data);
    let a = Lancamentos.aggregate([
        {$match: {"data": {"$gte": new Date(aux.data)}}},
        {$group: {
            "_id": {
                titulo: aux.criterio,
            },
            "lancamentos": {$push: "$$ROOT"},
            total: {"$sum": "$valor"}
        }},
        {$project: {
            _id: 0,
            categoria: "$_id.titulo",
            lancamentos: '$lancamentos',
            total: 1
        }}
    ]).exec();
    a.then(function (lancamentos) {
        obj.req.lancamentos = lancamentos;
        obj.next();
    });
    a.catch(function (err, next) {
        return next(err);
    });


};

exports.results = function(req, res) {
    res.json(req.lancamentos);
};






exports.findCustomsOld = function(req, res, next, data) {
    console.log(data);
    Lancamentos.aggregate([
        {$match: {"data": {"$gte": new Date(data)}}},
        {$group: {"_id": "$categoria",
            "root": {$push: "$$ROOT"},
            "total": {"$sum": "$valor"},
            "subcategoria": "$subcategoria"
        }},
        {$group: {"_id": "$subcategoria",
            "root": {$push: "$$ROOT"},
            "total": {"$sum": "$total"}
        }}
        // {$group: {"_id": '$root.categoria',
        //     "root": {$push: "$$ROOT"},
        //     "total": {"$sum": "$total"}
        // }}
    ]).exec(function (err, lancamentos) {
        if(err) return next(err);
        if(!lancamentos) return next(new Error(`Failed to load lancamentos id: ${id}`));
        req.lancamentos = lancamentos;
        next();
    });
};