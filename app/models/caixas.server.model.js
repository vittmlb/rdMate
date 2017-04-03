/**
 * Created by Vittorio on 22/03/2017.
 */
let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let CaixasSchema = new Schema({
    data_caixa: {
        type: Date,
        required: `O campo 'data_do_caixa' é obrigatório.`
    },
    entradas: {
        abertura: {
            manha: {
                valor: {
                    type: Number,
                    required: `O campo CaixasSchema > 'entradas.abertura.manha.valor' é obrigatório`
                },
                obs: String,
            },
            tarde: {
                valor: {
                    type: Number,
                    required: `O campo CaixasSchema > 'entradas.abertura.tarde.valor' é obrigatório`
                },
                obs: String
            }
        },
        vendas: {
            manha: {
                valor: {
                    type: Number,
                    required: `O campo CaixasSchema > 'entradas.vendas.manha.valor' é obrigatório`
                },
                obs: {
                    type: String
                }
            },
            tarde: {
                valor: {
                    type: Number,
                    required: `O campo CaixasSchema > 'entradas.vendas.tarde.valor' é obrigatório`
                },
                obs: 0
            }
        },
    },
    saidas: {
        transferencia: {
            manha: {
                valor: {
                    type: Number,
                    required: `O campo CaixasSchema > 'saidas.transferencia.manha.valor' é obrigatório`
                }
            },
            tarde: {
                valor: {
                    type: Number,
                    required: `O campo CaixasSchema > 'saidas.transferencia.tarde.valor' é obrigatório`
                },
                obs: String
            }
        },
        cartoes: [{
            bandeira: {
                type: String,
                trim: true,
                enum: ["Visa", "Master"]
            },
            natureza: {
                type: String,
                default: 'Débito'
            },
            valor: {
                type: Number,
                required: `O campo CaixasSchema > 'saidas.cartoes.valor' é obrigatório`
            },
            turno: {
                type: String,
                required: `O campo CaixasSchema > 'saidas.cartoes.turno' é obrigatório`,
                enum: ["Manhã", "Tarde"]
            },
            tags: [{
                type: String
            }],
            obs: {
                type: String,
                trim: true
            }
        }],
        despesas: [{
            descricao: {
                type: String,
                trim: true,
                required: `O campo CaixasSchema > 'saidas.despesas.descricao' é obrigatório`
            },
            valor: {
                type: Number,
                required: `O campo CaixasSchema > 'saidas.despesas.valor' é obrigatório`
            },
            turno: {
                type: String,
                required: `O campo CaixasSchema > 'saidas.despesas.turno' é obrigatório`,
                enum: ["Manhã", "Tarde"]
            },
            tags: [{
                type: String
            }],
            fornecedor: {
                type: String
            },
            obs: {
                type: String,
                trim: true
            }
        }],
        dinheiro: {
            manha: {
                valor: {
                    type: Number,
                    required: `O campo CaixasSchema > 'saidas.dinheiro.manha.valor' é obrigatório`
                },
                obs: String
            },
            tarde: {
                valor: {
                    type: Number,
                    required: `O campo CaixasSchema > 'saidas.dinheiro.tarde.valor' é obrigatório`
                },
                obs: String
            }
        }
    },
    movimentacoes: [{
        descricao: {
            type: String,
            trim: true,
            required: `O campo CaixasSchema > 'movimentacoes.descricao' é obrigatório`
        },
        valor: {
            type: Number,
            required: `O campo CaixasSchema > 'movimentacoes.valor' é obrigatório`
        },
        origem: {
            type: String,
            enum: ["Geral", "Cofre"], // todo: Puxar essa informação de algum lugar central para não fazer confusão.
            required: `O campo CaixasSchema > 'movimentacoes.origem' é obrigatório`
        },
        tag: [{
            type: String
        }],
        fornecedor: {
            type: String,
            trim: true
        },
        obs: {
            type: String
        }
    }],
    controles: {
        salgados: {
            folhados: {
                type: Number,
                default: 0
            },
            outros: {
                type: Number,
                default: 0
            },
            pao_de_queijo: {
                type: Number,
                default: 0
            }
        },
        leitura_z: {
            type: Number,
            default: 0
        },
        agua: {
            abertura: Number,
            fechamento: Number
        },
        luz: {
            abertura: Number,
            fechamento: Number
        }
    },
    mod_virtual: {},
    conferencias: {
        geral: {
            manha: {
                abertura_venda: Number,
                entradas: Number,
                diferenca: Number,
                conferido: Boolean
            },
            tarde: {
                abertura_venda: Number,
                entradas: Number,
                diferenca: Number,
                conferido: Boolean
            }
        }
    }
});


CaixasSchema.virtual('mod_virtual.entradas.vendas.manha').get(function () {
    return this.entradas.vendas.manha.valor;
});
CaixasSchema.virtual('mod_virtual.entradas.vendas.tarde').get(function () {
    return this.entradas.vendas.tarde.valor;
});
CaixasSchema.virtual('mod_virtual.entradas.vendas.total').get(function () {
    return this.entradas.vendas.manha.valor + this.entradas.vendas.tarde.valor;
});

CaixasSchema.virtual('mod_virtual.entradas.abertura.manha').get(function () {
    return this.entradas.abertura.manha.valor;
});
CaixasSchema.virtual('mod_virtual.entradas.abertura.tarde').get(function () {
    return this.entradas.abertura.tarde.valor;
});
CaixasSchema.virtual('mod_virtual.entradas.abertura.total').get(function () {
    return this.entradas.abertura.manha.valor + this.entradas.abertura.tarde.valor;
});

CaixasSchema.virtual('mod_virtual.entradas.total.manha').get(function () {
    return  this.entradas.abertura.manha.valor +
            this.entradas.vendas.manha.valor;
});
CaixasSchema.virtual('mod_virtual.entradas.total.tarde').get(function () {
    return  this.entradas.abertura.tarde.valor +
            this.entradas.vendas.tarde.valor;
});
CaixasSchema.virtual('mod_virtual.entradas.total.total').get(function () {
    return  this.mod_virtual.entradas.total.manha + this.mod_virtual.entradas.total.tarde;
});


CaixasSchema.virtual('mod_virtual.saidas.transferencia.manha').get(function () {
    return this.saidas.transferencia.manha.valor;
});
CaixasSchema.virtual('mod_virtual.saidas.transferencia.tarde').get(function () {
    return this.saidas.transferencia.tarde.valor;
});
CaixasSchema.virtual('mod_virtual.saidas.transferencia.total').get(function () {
    return this.saidas.transferencia.manha.valor + this.saidas.transferencia.tarde.valor;
});

CaixasSchema.virtual('mod_virtual.saidas.cartoes.manha').get(function () { // Schema 'saída' > dinheiro da venda não entra no caixa
    return this.saidas.cartoes.reduce(function(prevVal, elem) {
        return (elem.turno === 'Manhã') ? prevVal + elem.valor : prevVal;
    }, 0);
});
CaixasSchema.virtual('mod_virtual.saidas.cartoes.tarde').get(function () { // Schema 'saída' > dinheiro da venda não entra no caixa
    return this.saidas.cartoes.reduce(function(prevVal, elem) {
        return (elem.turno === 'Tarde') ? prevVal + elem.valor : 0;
    }, 0);
});
CaixasSchema.virtual('mod_virtual.saidas.cartoes.total').get(function () { // Schema 'saída' > dinheiro da venda não entra no caixa
    return this.mod_virtual.saidas.cartoes.manha + this.mod_virtual.saidas.cartoes.tarde;
});

CaixasSchema.virtual('mod_virtual.saidas.despesas.manha').get(function () {
    return this.saidas.despesas.reduce(function(prevVal, elem) {
        return (elem.turno === 'Manhã') ? prevVal + elem.valor : prevVal;
    }, 0);
});
CaixasSchema.virtual('mod_virtual.saidas.despesas.tarde').get(function () {
    return this.saidas.despesas.reduce(function(prevVal, elem) {
        return (elem.turno === 'Tarde') ? prevVal + elem.valor : 0;
    }, 0);
});
CaixasSchema.virtual('mod_virtual.saidas.despesas.total').get(function () {
    return this.mod_virtual.saidas.despesas.manha + this.mod_virtual.saidas.despesas.tarde;
});

CaixasSchema.virtual('mod_virtual.saidas.dinheiro.manha').get(function () {
    return this.saidas.dinheiro.manha.valor;
});
CaixasSchema.virtual('mod_virtual.saidas.dinheiro.tarde').get(function () {
    return this.saidas.dinheiro.tarde.valor;
});
CaixasSchema.virtual('mod_virtual.saidas.dinheiro.total').get(function () {
    return this.saidas.dinheiro.manha.valor + this.saidas.dinheiro.tarde.valor;
});

CaixasSchema.virtual('mod_virtual.saidas.total.manha').get(function () {
    return  this.saidas.transferencia.manha.valor +
            this.mod_virtual.saidas.cartoes.manha +
            this.mod_virtual.saidas.despesas.manha +
            this.saidas.dinheiro.manha.valor;
});
CaixasSchema.virtual('mod_virtual.saidas.total.tarde').get(function () {
    return  this.saidas.transferencia.tarde.valor +
            this.mod_virtual.saidas.cartoes.tarde +
            this.mod_virtual.saidas.despesas.tarde +
            this.saidas.dinheiro.tarde.valor;
});
CaixasSchema.virtual('mod_virtual.saidas.total.total').get(function () {
    return this.mod_virtual.saidas.total.manha + this.mod_virtual.saidas.total.tarde;
});

CaixasSchema.virtual('mod_virtual.diferenca.manha').get(function () {
    return this.mod_virtual.saidas.total.manha - this.mod_virtual.entradas.total.manha;
});
CaixasSchema.virtual('mod_virtual.diferenca.tarde').get(function () {
    return this.mod_virtual.saidas.total.tarde - this.mod_virtual.entradas.total.tarde;
});
CaixasSchema.virtual('mod_virtual.diferenca.total').get(function () {
    return this.mod_virtual.diferenca.manha + this.mod_virtual.diferenca.tarde
});

CaixasSchema.virtual('mod_virtual.controles.salgados.total').get(function () {
    return this.controles.salgados.folhados + this.controles.salgados.outros;
});

CaixasSchema.set('toJSON', {
    getters: true,
    virtuals: true
});

mongoose.model('Caixa', CaixasSchema);