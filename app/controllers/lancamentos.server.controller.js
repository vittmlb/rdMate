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

exports.findCustoms = function(req, res, next, params) {
    let obj = {
        req: req,
        res: res,
        next: next
    };
    let aux = JSON.parse(params);
    let promises = [];

    aux.criterios.forEach(function (data) {
        promises.push(queryDems({"intervalo": aux.intervalo, "criterio": data}));
    });

    let prom = Promise.all(promises);

    prom.then(function (values) {
        let o = {};
        if(Array.isArray(values)) {
            values.forEach(function (elem) {
                if (Array.isArray(elem)) {
                    elem.map(function (e) {
                        let aux = (e.categoria).toLowerCase();
                        o[aux] = e;
                    });
                }
            });
        }
        obj.req.lancamentos = o;
        obj.next();
    });

};

function queryDems(params) {
    let promise = Lancamentos.aggregate([
        {$match: {"data": {"$gte": new Date(params.intervalo.ini), "$lte": new Date(params.intervalo.fim)}}},
        {$group: {
            "_id": {
                titulo: "$" + params.criterio,
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
    promise.then(function (lancamentos) {
        return lancamentos;
    });
    promise.catch(function (err) {
        return err;
    });
    return promise;
}

exports.results = function(req, res) {
    res.json(req.lancamentos);
};


function testQueries(params) {
    let teste = "2017-04-01T03:00:00.000Z";
    let nd = new Date(teste);
    let promise = Lancamentos.aggregate([
        {$match: {"data": {"$gte": params.intervalo.ini, "$lte": nd }}},
        {$group: {
            "_id": {
                titulo: "$" + params.criterio,
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
    promise.then(function (lancamentos) {
        return lancamentos;
    });
    promise.catch(function (err) {
        return err;
    });
    return promise;
}






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
exports.findCustomsOldB = function(req, res, next, data) {
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
        return lancamentos;
    });
    a.catch(function (err) {
        return err;
    });
    let b = Lancamentos.aggregate([
        {$match: {"data": {"$gte": new Date(aux.data)}}},
        {$group: {
            "_id": {
                titulo: "$subcategoria",
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
    b.then(function (lancamentos) {
        return lancamentos;
    });
    b.catch(function (err) {
        return err;
    });

    let prom = Promise.all([a, b]);

    prom.then(function (values) {
        obj.req.lancamentos_a = values[0];
        obj.req.lancamentos_b = values[1];
        obj.next();
    });

};