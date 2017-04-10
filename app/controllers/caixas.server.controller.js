/**
 * Created by Vittorio on 22/03/2017.
 */
let mongoose = require('mongoose');
mongoose.Promise = global.Promise;
let Caixas = mongoose.model('Caixa');

let moment = require('moment');
moment.locale('pt-br');

exports.create = function(req, res) {
    // A data que chega está no formato "YYYY-MM-DD" e deve ser convertida para "MM-DD-YYYY" para que ela seja corretamente armazenada
    req.body.data_caixa = moment(req.body.data_caixa).format('MM-DD-YYYY');
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

exports.results = function(req, res) {
    res.json(req.lancamentos);
};

exports.generateDashboard = function(req, res, next, params) {
    let param = JSON.parse(params);
    let rel = new Relatorios(req, res, next, param);
    rel.geral();
};


let Relatorios = function(req, res, next, param) {
    this.obj = {
        req: req,
        res: res,
        next: next
    };
    let datesInfo = {
        data_inicial: param.inicial,
        data_final: param.final,
        dias: calculaDias()
    };
    let parent = this;
    let promises = [];
    let intervalo = buildQuery.intervalo(param.inicial, param.final);


    function calculaDias() {
        let a = moment(param.inicial);
        let b = moment(param.final);
        return b.diff(a, 'days');
    }

    this.geral = function() {

        promises.push(this.base());
        promises.push(this.cartoes());
        promises.push(this.despesas());
        promises.push(this.produtos());

        calculaDias();

        let prom = Promise.all(promises);

        prom.then(function (values) {
            let o = {};
            if(Array.isArray(values)) {
                /**
                 * Promise.all retorna um array com o número de elementos correspondente ao número de promessas que recebeu.
                 * Aqui eu itero por esse array de valores para cair, em seguida, em um novo array, dessa vez retornado como
                 * resposta pelo mongoose Cada uma das funções (cartões, despesas, base e produtos) gera como retorno um array
                 * com uma posição que contém o objeto respostada query. Para cada uma das Promises.then eu acessei o objeto
                 * resposta dentro do array e inseri uma variável chamada _controle para que essa variável desse nome à
                 * propriedade do objeto que está sendo retornado por esse forEach abaixo.
                 * - ex: o[e._parent] vai corresponder à o.cartoes = objeto resultado da query por cartoes.
                 */
                values.forEach(function (elem) {
                    if (Array.isArray(elem)) {
                        elem.map(function (e) {
                            if(e._parent) {
                                e._intervalo = datesInfo; // coloca em todos os elementos a diferença
                                if(!o.hasOwnProperty(e._parent)) {
                                    o[e._parent] = [];
                                }
                                o[e._parent].push(e);
                            } else {
                                o[e._controle] = e;
                            }
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

        promise.then(function (despesas) {
            despesas[0]._controle = "despesas";
            return despesas;
        });

        promise.catch(function (err) {
            return err;
        });

        return promise;

    };

    this.produtos = function() {

        let query = buildQuery.totais.produtos();

        let promise = Caixas.aggregate([
            intervalo,
            query.unwind,
            query.group,
            query.project
        ]).exec();

        promise.then(function (produtos) {
            produtos.forEach(function (data) {
                data._parent = 'produtos';
                data._controle = data.nome.toLowerCase();
            });
            return produtos;
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
    // data_info: function(data_inicial, data_final) {
    //     return {$addFields: {"data_inicial": new Date(data_inicial), "data_final": new Date(data_final)}};
    // }, // todo: Atenção > $addFields é interessante. Não funcionou, mas é pra pesquisar mais.

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
        },
        produtos: function() {
            return {
                unwind: {"$unwind": "$controles.produtos"},
                group: {"$group": { "_id": "$controles.produtos.nome",
                                    venda_qtd: {"$sum": "$controles.produtos.venda.valor"},
                                    venda_media: {"$avg": "$controles.produtos.venda.valor"},
                                    perda_qtd: {"$sum": "$controles.produtos.perda.valor"},
                                    perda_media: {"$avg": "$controles.produtos.perda.valor"},
                                    uso_qtd: {"$sum": "$controles.produtos.uso.valor"},
                                    uso_media: {"$sum": "$controles.produtos.uso.valor"},
                                    dias: {"$sum": 1},
                                    elem: {"$push": "$$ROOT"}}},
                project: {
                    "$project": {
                        "nome": "$_id",
                        "venda": {"qtd": "$venda_qtd", "media": "$venda_media"},
                        "perda": {"qtd": "$perda_qtd", "media": "$perda_media"},
                        "uso": {"qtd": "$uso_qtd", "media": "$uso_media"},
                        "dias": 1,
                        "elem": 1,
                    }
                }
            }
        }
    }
};
