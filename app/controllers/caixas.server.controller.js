/**
 * Created by Vittorio on 22/03/2017.
 */
let mongoose = require('mongoose');
mongoose.Promise = global.Promise;
let Caixas = mongoose.model('Caixa');

let relatorios = require('../modules/caixas-relatorios.server.module');

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

exports.results = function(req, res) {
    res.json(req.lancamentos);
};

exports.generateRelatorio = function(req, res, next, params) {
    let param = JSON.parse(params);
    switch (param.tipo_relatorio) {
        case 'dashboard':
            generateRelatorioDashboard(req, res, next, param);
            break;
        case 'comparacao':
            generateRelatorioDashboard(req, res, next, param);
            // generateRelatorioComparacaoFind(req, res, next, param);
            // generateRelatorioComparacaoFind(req, res, next, param);
            break;
        case 'comparacaosssssssssss':
            generateRelatorioComparacao(req, res, next, param);
            break;
    }
};

function generateRelatorioDashboardOld(req, res, next, param) {
    let rel = new Relatorios(req, res, next, param);
    rel.geral();
}

function generateRelatorioComparacao(req, res, next, param) {
    let obj = {
        req: req,
        res: res,
        next: next
    };
    let promises = [];
    let param_a = {inicial: param.inicial, final: param.inicial};
    let param_b = {inicial: param.final, final: param.final};

    let rel_a = new Relatorios(req, res, next, param_a);
    let rel_b = new Relatorios(req, res, next, param_b);

    promises.push(rel_a.comparacao());
    promises.push(rel_b.comparacao());

    let prom = Promise.all(promises);

    prom.then(function (data) {
        obj.req.comparacao = relatorios.comparacao(data);
        next();
    });

    prom.catch(function (err) {
        obj.next(err);
    });


}

/**
 * Gera relatório consolidando os dados de um determinado intervalo entre duas datas.
 * @param req
 * @param res
 * @param next
 * @param param
 */
function generateRelatorioDashboard(req, res, next, param) {

    let obj = {
        req: req,
        res: res,
        next: next
    };

    let p = Caixas.aggregate(
        {$match: {data_caixa: {$gte: new Date(param.inicial), $lte: new Date(param.final)}}},
        {$project: {
            "data_caixa": 1,
            "entradas.abertura": 1,
            "entradas.vendas.manha": 1,
            "entradas.vendas.tarde": 1,
            "entradas.vendas.total": {$add: ['$entradas.vendas.manha.valor', '$entradas.vendas.tarde.valor']},
            "entradas.total.manha": {$add: ['$entradas.abertura.manha.valor', '$entradas.vendas.manha.valor']},
            "entradas.total.tarde": {$add: ['$entradas.abertura.tarde.valor', '$entradas.vendas.tarde.valor']},
            "saidas.transferencia": 1,
            "saidas.dinheiro": 1,
            "saidas.despesas": {$cond: [{$eq: ["$saidas.despesas", []]}, [{value: 0}], "$saidas.despesas"]},
            "saidas.cartoes": {$cond: [{$eq: ["$saidas.cartoes", []]}, [{value: 0}], "$saidas.cartoes"]},
            "saidas.subtotal.manha": {$add: ['$saidas.transferencia.manha.valor', '$saidas.dinheiro.manha.valor']},
            "saidas.subtotal.tarde": {$add: ['$saidas.transferencia.tarde.valor', '$saidas.dinheiro.tarde.valor']},
            "movimentacoes": {$cond: [{$eq: ["$movimentacoes", []]}, [{value: 0}], "$movimentacoes"]},
            "controles": 1,
            "aux.saidas.despesas": '',
            "aux.saidas.cartoes": ''
        }},
        {$sort: {"data_caixa": -1}},
        {$unwind: "$movimentacoes"},
        {$group: {
            _id: "$_id",
            data_caixa: {$first: '$data_caixa'},
            entradas: {$first: '$entradas'},
            saidas: {$first: '$saidas'},
            movimentacoes: {$addToSet: '$movimentacoes'},
            controles: {$first: '$controles'},
            aux: {$first: '$aux'},
            total_mov: {$sum: '$movimentacoes.valor'}
        }},
        {$unwind: "$saidas.despesas"},
        {$group: {
            _id: "$_id",
            data_caixa: {$first: '$data_caixa'},
            entradas: {$first: '$entradas'},
            saidas: {$first: '$saidas'},
            aux_despesas: {$addToSet: '$saidas.despesas'},
            movimentacoes: {$first: '$movimentacoes'},
            controles: {$first: '$controles'},
            aux: {$first: '$aux'},
            total_mov: {$first: '$total_mov'},
            total_desp: {$sum: '$saidas.despesas.valor'}
        }},
        {$unwind: "$saidas.cartoes"},
        {$group: {
            _id: "$_id",
            data_caixa: {$first: '$data_caixa'},
            entradas: {$first: '$entradas'},
            saidas: {$first: '$saidas'},
            aux_despesas: {$first: '$aux_despesas'},
            movimentacoes: {$first: '$movimentacoes'},
            controles: {$first: '$controles'},
            total_mov: {$first: '$total_mov'},
            total_desp: {$first: '$total_desp'},
            total_card: {$sum: '$saidas.cartoes.valor'},
            aux_cartoes: {$addToSet: '$saidas.cartoes'}
        }},
        {$unwind: "$controles.produtos"},
        {$group: {
            _id: "$_id",
            data_caixa: {$first: '$data_caixa'},
            entradas: {$first: '$entradas'},
            saidas: {$first: '$saidas'},
            aux_despesas: {$first: '$aux_despesas'},
            movimentacoes: {$first: '$movimentacoes'},
            controles: {$first: '$controles'},
            total_mov: {$first: '$total_mov'},
            total_desp: {$first: '$total_desp'},
            total_card: {$sum: '$saidas.cartoes.valor'},
            aux_cartoes: {$addToSet: '$saidas.cartoes'},
            aux_produtos: {$addToSet: '$controles.produtos'},
        }},
        {$group: {
            _id: null,
            caixas: {$addToSet: '$$ROOT'},
            total_mov: {$sum: "$total_mov"},
            total_desp: {$sum: "$total_desp"},
            total_card: {$sum: "$total_card"},
            total_vendas: {$sum: "$entradas.vendas.total"},
            total_produtos: {$sum: "$controles.produtos.venda.valor"},
            total_perdas: {$sum: "$controles.produtos.perda.valor"},
            total_uso: {$sum: "$controles.produtos.uso.valor"},
            total_leitura_z: {$sum: "$controles.fiscal.leitura_z.valor"}
        }},
        {$project: {
            "nome": {$literal: "dashboard"},
            "caixas": 1,
            "totais.vendas": "$total_vendas",
            "totais.cartoes": "$total_card",
            "totais.despesas": "$total_desp",
            "totais.produtos.vendas": "$total_produtos",
            "totais.produtos.perdas": "$total_perdas",
            "totais.produtos.uso": "$total_uso",
            "totais.leitura_z": "$total_leitura_z"
        }}
    ).exec();

    p.then(function (data) {
        obj.req.relatorio = data[0];
        obj.next();
    });

    p.catch(function (err) {
        obj.next(err);
    });

}

let newRelatorios = function(req, res, next, param) {
    this.obj = {
        req: req,
        res: res,
        next: next
    };
    let promises = [];

    this.geral = function() {

        promises.push(this.datas()); // todo: Confirmar se isso tem mesmo que ficar aqui.
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

    this.dashboard = function() {

        let p = Caixas.aggregate(
            {$match: {data_caixa: {$gte: new Date(param.inicial), $lte: new Date(param.final)}}},
            {$project: {
                "data_caixa": 1,
                "entradas.abertura": 1,
                "entradas.vendas.manha": 1,
                "entradas.vendas.tarde": 1,
                "entradas.vendas.total": {$add: ['$entradas.vendas.manha.valor', '$entradas.vendas.tarde.valor']},
                "entradas.total.manha": {$add: ['$entradas.abertura.manha.valor', '$entradas.vendas.manha.valor']},
                "entradas.total.tarde": {$add: ['$entradas.abertura.tarde.valor', '$entradas.vendas.tarde.valor']},
                "saidas.transferencia": 1,
                "saidas.dinheiro": 1,
                "saidas.despesas": {$cond: [{$eq: ["$saidas.despesas", []]}, [{value: 0}], "$saidas.despesas"]},
                "saidas.cartoes": {$cond: [{$eq: ["$saidas.cartoes", []]}, [{value: 0}], "$saidas.cartoes"]},
                "saidas.subtotal.manha": {$add: ['$saidas.transferencia.manha.valor', '$saidas.dinheiro.manha.valor']},
                "saidas.subtotal.tarde": {$add: ['$saidas.transferencia.tarde.valor', '$saidas.dinheiro.tarde.valor']},
                "movimentacoes": {$cond: [{$eq: ["$movimentacoes", []]}, [{value: 0}], "$movimentacoes"]},
                "controles": 1,
                "aux.saidas.despesas": '',
                "aux.saidas.cartoes": ''
            }},
            {$unwind: "$movimentacoes"},
            {$group: {
                _id: "$_id",
                data_caixa: {$first: '$data_caixa'},
                entradas: {$first: '$entradas'},
                saidas: {$first: '$saidas'},
                movimentacoes: {$addToSet: '$movimentacoes'},
                controles: {$first: '$controles'},
                aux: {$first: '$aux'},
                total_mov: {$sum: '$movimentacoes.valor'}
            }},
            {$unwind: "$saidas.despesas"},
            {$group: {
                _id: "$_id",
                data_caixa: {$first: '$data_caixa'},
                entradas: {$first: '$entradas'},
                saidas: {$first: '$saidas'},
                aux_despesas: {$addToSet: '$saidas.despesas'},
                movimentacoes: {$first: '$movimentacoes'},
                controles: {$first: '$controles'},
                aux: {$first: '$aux'},
                total_mov: {$first: '$total_mov'},
                total_desp: {$sum: '$saidas.despesas.valor'}
            }},
            {$unwind: "$saidas.cartoes"},
            {$group: {
                _id: "$_id",
                data_caixa: {$first: '$data_caixa'},
                entradas: {$first: '$entradas'},
                saidas: {$first: '$saidas'},
                aux_despesas: {$first: '$aux_despesas'},
                movimentacoes: {$first: '$movimentacoes'},
                controles: {$first: '$controles'},
                total_mov: {$first: '$total_mov'},
                total_desp: {$first: '$total_desp'},
                total_card: {$sum: '$saidas.cartoes.valor'},
                aux_cartoes: {$addToSet: '$saidas.cartoes'}
            }},
            {$sort: {data_caixa: 1}}
        ).exec();

        p.then(function (caixas) {
            return caixas;
        });

        p.catch(function (err) {
            return err;
        });

        return p;

    }

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

        promises.push(this.datas()); // todo: Confirmar se isso tem mesmo que ficar aqui.
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

    this.comparacao = function() {

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
            return o;
        });

        prom.catch(function (err) {
            return err;
        });

        return prom;

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

    this.datas = function() {
        let query = buildQuery.totais.datas();

        let promise = Caixas.aggregate([
            intervalo,
            query.group
        ]).exec();

        promise.then(function (datas) {
            datas[0]._controle = "datas";
            return base;
        });

        promise.catch(function (err) {
            return err;
        });

        return promise;

    };

    this.individual = function() {
        let query = buildQuery.totais.individual();

        let promise = Caixas.aggregate([
            intervalo,
            query.group,
            query.project
        ]).exec();

        promise.then(function (datas) {
            datas[0]._controle = "datas";
            return base;
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
        individual: function() {
            return {
                group: {
                    $group: {
                        _id: "$_id",
                        movimentacoes: {$push: "$movimentacoes"},
                        root: {$push: "$$ROOT"}
                    }
                },
                project: {
                    $project: {
                        data_caixa: "$root.data_caixa",
                        entrada_abertura_total: {$add: ["$root[0].entradas.abertura.manha.valor", "$root[0]entradas.abertura.tarde.valor"]},
                        entradas: "$root.entradas",
                        movimentacoes: "$movimentacoes",
                        controles: "$root.controles",
                        saidas:  "$root.saidas",
                    }
                }
            }
        },
        cartoes: function () {
            return {
                unwind: {"$unwind": "$saidas.cartoes"},
                group: {
                    "$group": {
                        "_id": null,
                        "total": {"$sum": "$saidas.cartoes.valor"},
                        "elem": {"$push": "$$ROOT"}
                    }
                }
            }
        },
        base: function () {
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
        despesas: function () {
            return {
                unwind: {"$unwind": "$saidas.despesas"},
                group: {
                    "$group": {
                        "_id": null,
                        "total": {"$sum": "$saidas.despesas.valor"},
                        "elem": {"$push": "$$ROOT"}
                    }
                }
            }
        },
        produtos: function () {
            return {
                unwind: {"$unwind": "$controles.produtos"},
                group: {
                    "$group": {
                        "_id": "$controles.produtos.nome",
                        venda_qtd: {"$sum": "$controles.produtos.venda.valor"},
                        venda_media: {"$avg": "$controles.produtos.venda.valor"},
                        perda_qtd: {"$sum": "$controles.produtos.perda.valor"},
                        perda_media: {"$avg": "$controles.produtos.perda.valor"},
                        uso_qtd: {"$sum": "$controles.produtos.uso.valor"},
                        uso_media: {"$sum": "$controles.produtos.uso.valor"},
                        dias: {"$sum": 1},
                        elem: {"$push": "$$ROOT"}
                    }
                },
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
        },
        datas: function() {
            return {
                group: {
                    $group: {"_id": "$data_caixa",
                        elem: {"$push": "$$ROOT"}
                    }
                },
                project: {
                    $project: {

                    }
                }
            }
        }
    }
};
