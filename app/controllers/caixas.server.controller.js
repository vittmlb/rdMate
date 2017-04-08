/**
 * Created by Vittorio on 22/03/2017.
 */
let mongoose = require('mongoose');
mongoose.Promise = global.Promise;
let Caixas = mongoose.model('Caixa');

let moment = require('moment');
moment.locale('pt-br');

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
    caixa.entradas = req.body.entradas;
    caixa.saidas = req.body.saidas;
    caixa.movimentacoes = req.body.movimentacoes;
    caixa.controles = req.body.controles;
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

exports.generateDashboard = function(req, res, next, params) {
    let param = JSON.parse(params);
    let rel = new Relatorios(req, res, next, param);
    rel.geral();
};

exports.generateDashboardOld = function(req, res, next, params) {
    let param = JSON.parse(params);
    let intervalo = buildQuery.intervalo(param.inicial, param.final);
    let obj = buildQuery.totais.cartoes();
    let promise = Caixas.aggregate([
        // {$match: {"saidas.despesas.turno": "Tarde"}}
        intervalo,
        // {$match: {"data_caixa": {"$gte": new Date(param.inicial), "$lte": new Date(param.final)}}},
        obj.unwind,
        obj.group,
        // {$group:
        //     {
        //         "_id": null,
        //         "lancamentos": {$push: "$$ROOT"},
        //         total_venda_manha: {"$sum": "$entradas.vendas.manha.valor"},
        //         total_venda_tarde: {"$sum": "$entradas.vendas.tarde.valor"},
        //         // total_venda_cartoes: {"$sum": "$saidas.cartoes.valor"}
        //     }
        // },

        // {$project: {
        //     total_venda_manha: 1,
        //     total_venda_tarde: 1,
        //     total_venda: {"$add": ["$total_venda_manha", "$total_venda_tarde"]},
        //     total_venda_cartoes: 1
        // }
        // }
        // {$unwind: "$entradas.vendas"}
        // {$unwind: "$movimentacoes"},
        // {$group:
        //     {
        //         "_id": null,
        //         "lancamentos": {$push: "$$ROOT"},
        //         total_movimentacao: {"$sum": "$movimentacoes.valor"},
        //         // total_tarde: {"$sum": "$tarde.valor"}
        //     },
        // }
    ]).exec();
    promise.then(function (caixa) {
        console.log(caixa);
        req.caixa_dashboard = caixa;
        next();
    });
    promise.catch(function (err) {
        return next(err);
    });
};

let Relatorios = function(req, res, next, param) {
    this.obj = {
        req: req,
        res: res,
        next: next
    };
    let parent = this;
    let promises = [];
    let intervalo = buildQuery.intervalo(param.inicial, param.final);
    req.relatorio = {
        cartoes: {},
        base: {}
    };

    this.geral = function() {
        promises.push(this.base());
        promises.push(this.cartoes());
        promises.push(this.despesas());

        let prom = Promise.all(promises);

        prom.then(function (values) {
            let o = {};
            if(Array.isArray(values)) {
                values.forEach(function (elem) {
                    if (Array.isArray(elem)) {
                        elem.map(function (e) {
                            let aux = (e._controle).toLowerCase();
                            o[aux] = e;
                        });
                    }
                });
            }
            parent.obj.req.relatorio = o;
            parent.obj.next();
        });
        prom.catch(function (err) {
            return parent.obj.next(err);
        });

    };

    this.base = function() {
        let query = buildQuery.totais.base();

        let promise = Caixas.aggregate([
            intervalo,
            query.group,
            query.project
        ]).exec();

        promise.then(function (base) {
            base[0]._controle = "base";
            return base;
        });

        promise.catch(function (err) {
            return err;
        });

        return promise;

    };

    this.cartoes = function() {

        let query = buildQuery.totais.cartoes();

        let promise = Caixas.aggregate([
            intervalo,
            query.unwind,
            query.group
        ]).exec();

        promise.then(function (cartoes) {
            cartoes[0]._controle = "cartoes";
            return cartoes;
        });

        promise.catch(function (err) {
            return err;
        });

        return promise;

    };

    this.despesas = function() {

        let query = buildQuery.totais.despesas();

        let promise = Caixas.aggregate([
            intervalo,
            query.unwind,
            query.group
        ]).exec();

        promise.then(function (cartoes) {
            cartoes[0]._controle = "despesas";
            return despesas;
        });

        promise.catch(function (err) {
            return err;
        });

        return promise;

    };



};

exports.newResults = function(req, res) {
    res.json(req.relatorio);
};

let buildQuery = {
    intervalo: function(data_inicial, data_final) {
        return {$match: {"data_caixa": {"$gte": new Date(data_inicial), "$lte": new Date(data_final)}}}
    },
    totais: {
        cartoes: function() {
            return {
                unwind: {"$unwind": "$saidas.cartoes"},
                group: {"$group": {"_id": null, "total": {"$sum": "$saidas.cartoes.valor"}, "elem": {"$push": "$$ROOT"}}}
            }
        },
        base: function() {
            return {
                group: {
                    "$group": {
                        "_id": null, "elem": {"$push": "$$ROOT"},
                        "total_venda_manha": {"$sum": "$entradas.vendas.manha.valor"},
                        "total_venda_tarde": {"$sum": "$entradas.vendas.tarde.valor"}
                    },
                },
                project: {
                    "$project": {
                        "total_venda_manha": 1,
                        "total_venda_tarde": 1,
                        "total": {"$add": ["$total_venda_manha", "$total_venda_tarde"]}
                    }
                }
            };
        },
        despesas: function() {
            return {
                unwind: {"$unwind": "$saidas.despesas"},
                group: {"$group": {"_id": null, "total": {"$sum": "$saidas.despesas.valor"}, "elem": {"$push": "$$ROOT"}}}
            }
        }
    }
};