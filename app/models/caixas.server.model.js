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
    funcionarios: {
        manha: {
            nome: {
                type: String,
                enum: ['a', 'b']
            }
        },
        tarde: {
            nome: {
                type: String,
                enum: ['a', 'b']
            }
        }
    },
    entradas: {
        abertura: {
            manha: {
                valor: {
                    type: Number,
                    required: `O campo CaixasSchema > 'entradas.abertura.manha.valor' é obrigatório`
                },
                obs: String,
                checked: {
                    type: Boolean,
                    default: false
                },
            },
            tarde: {
                valor: {
                    type: Number,
                    required: `O campo CaixasSchema > 'entradas.abertura.tarde.valor' é obrigatório`
                },
                obs: String,
                checked: {
                    type: Boolean,
                    default: false
                },
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
                },
                checked: {
                    type: Boolean,
                    default: false
                },
            },
            tarde: {
                valor: {
                    type: Number,
                    required: `O campo CaixasSchema > 'entradas.vendas.tarde.valor' é obrigatório`
                },
                obs: String,
                checked: {
                    type: Boolean,
                    default: false
                },
            }
        },
    },
    saidas: {
        transferencia: {
            manha: {
                valor: {
                    type: Number,
                    required: `O campo CaixasSchema > 'saidas.transferencia.manha.valor' é obrigatório`
                },
                obs: String,
                checked: {
                    type: Boolean,
                    default: false
                },
            },
            tarde: {
                valor: {
                    type: Number,
                    required: `O campo CaixasSchema > 'saidas.transferencia.tarde.valor' é obrigatório`
                },
                obs: String,
                checked: {
                    type: Boolean,
                    default: false
                },
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
            },
            checked: {
                type: Boolean,
                default: false
            },
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
            },
            checked: {
                type: Boolean,
                default: false
            },
        }],
        dinheiro: {
            manha: {
                valor: {
                    type: Number,
                    required: `O campo CaixasSchema > 'saidas.dinheiro.manha.valor' é obrigatório`
                },
                obs: String,
                checked: {
                    type: Boolean,
                    default: false
                },
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
        },
        checked: {
            type: Boolean,
            default: false
        },
    }],
    controles: {
        produtos: [{
            nome: {
                type: String,
                trim: true,
                enum: ["Folhado", "Pão de Queijo", "Salgado"]
            },
            venda: {
                valor: {
                    type: Number,
                    default: 0
                },
                label: {
                    type: String,
                    default: '' // todo: Colocar enum???
                }
            },
            perda: {
                valor: {
                    type: Number,
                    default: 0
                },
                label: {
                    type: String,
                    default: '' // todo: Colocar enum???
                }
            },
            uso: {
                valor: {
                    type: Number,
                    default: 0
                },
                label: {
                    type: String,
                    default: '' // todo: Colocar enum???
                }
            },
            categoria: [{
                type: String,
                default: ''
            }],
            tag: [{
                type: String,
                default: ''
            }],
            obs: {
                type: String
            },
            checked: {
                type: Boolean,
                default: false
            },
        }],
        consumo: [{
            nome: {
                type: String,
                trim: true,
                enum: ["Água", "Luz"]
            },
            inicial: {
                valor: {
                    type: Number,
                    default: 0
                },
                label: {
                    type: String,
                    default: '' // todo: Colocar enum???
                }
            },
            final: {
                valor: {
                    type: Number,
                    default: 0
                },
                label: {
                    type: String,
                    default: '' // todo: Colocar enum???
                }
            },
            tag: [{
                type: String,
                default: ''
            }],
            obs: {
                type: String
            },
            checked: {
                type: Boolean,
                default: false
            },
        }],
        leitura_z: {
            valor: {
                type: Number,
                default: 0
            },
            obs: String,
            checked: {
                type: Boolean,
                default: false
            },
        },
    },
    fechamento: {
        diferenca: {
            manha: {
                type: Number,
                default: 0
            },
            tarde: Number,
            total: Number
        },
        obs: {
            type: String,
            trim: true,
            default: ''
        },
        checked: {
            type: Boolean,
            default: false
        }
    },
    v: {
        widgets: {}
    },
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


CaixasSchema.virtual('v.entradas.vendas.manha').get(function () {
    return this.entradas.vendas.manha.valor;
});
CaixasSchema.virtual('v.entradas.vendas.tarde').get(function () {
    return this.entradas.vendas.tarde.valor;
});
CaixasSchema.virtual('v.entradas.vendas.total').get(function () {
    return this.entradas.vendas.manha.valor + this.entradas.vendas.tarde.valor;
});

CaixasSchema.virtual('v.entradas.abertura.manha').get(function () {
    return this.entradas.abertura.manha.valor;
});
CaixasSchema.virtual('v.entradas.abertura.tarde').get(function () {
    return this.entradas.abertura.tarde.valor;
});
CaixasSchema.virtual('v.entradas.abertura.total').get(function () {
    return this.entradas.abertura.manha.valor + this.entradas.abertura.tarde.valor;
});

CaixasSchema.virtual('v.entradas.total.manha').get(function () {
    return  this.entradas.abertura.manha.valor +
            this.entradas.vendas.manha.valor;
});
CaixasSchema.virtual('v.entradas.total.tarde').get(function () {
    return  this.entradas.abertura.tarde.valor +
            this.entradas.vendas.tarde.valor;
});
CaixasSchema.virtual('v.entradas.total.total').get(function () {
    return  this.v.entradas.total.manha + this.v.entradas.total.tarde;
});


CaixasSchema.virtual('v.saidas.transferencia.manha').get(function () {
    return this.saidas.transferencia.manha.valor;
});
CaixasSchema.virtual('v.saidas.transferencia.tarde').get(function () {
    return this.saidas.transferencia.tarde.valor;
});
CaixasSchema.virtual('v.saidas.transferencia.total').get(function () {
    return this.saidas.transferencia.manha.valor + this.saidas.transferencia.tarde.valor;
});

CaixasSchema.virtual('v.saidas.cartoes.manha').get(function () { // Schema 'saída' > dinheiro da venda não entra no caixa
    return this.saidas.cartoes.reduce(function(prevVal, elem) {
        return (elem.turno === 'Manhã') ? prevVal + elem.valor : prevVal;
    }, 0);
});
CaixasSchema.virtual('v.saidas.cartoes.tarde').get(function () { // Schema 'saída' > dinheiro da venda não entra no caixa
    return this.saidas.cartoes.reduce(function(prevVal, elem) {
        return (elem.turno === 'Tarde') ? prevVal + elem.valor : 0;
    }, 0);
});
CaixasSchema.virtual('v.saidas.cartoes.total').get(function () { // Schema 'saída' > dinheiro da venda não entra no caixa
    return this.v.saidas.cartoes.manha + this.v.saidas.cartoes.tarde;
});

CaixasSchema.virtual('v.saidas.despesas.manha').get(function () {
    return this.saidas.despesas.reduce(function(prevVal, elem) {
        return (elem.turno === 'Manhã') ? prevVal + elem.valor : prevVal;
    }, 0);
});
CaixasSchema.virtual('v.saidas.despesas.tarde').get(function () {
    return this.saidas.despesas.reduce(function(prevVal, elem) {
        return (elem.turno === 'Tarde') ? prevVal + elem.valor : 0;
    }, 0);
});
CaixasSchema.virtual('v.saidas.despesas.total').get(function () {
    return this.v.saidas.despesas.manha + this.v.saidas.despesas.tarde;
});

CaixasSchema.virtual('v.saidas.dinheiro.manha').get(function () {
    return this.saidas.dinheiro.manha.valor;
});
CaixasSchema.virtual('v.saidas.dinheiro.tarde').get(function () {
    return this.saidas.dinheiro.tarde.valor;
});
CaixasSchema.virtual('v.saidas.dinheiro.total').get(function () {
    return this.saidas.dinheiro.manha.valor + this.saidas.dinheiro.tarde.valor;
});

CaixasSchema.virtual('v.saidas.total.manha').get(function () {
    return  this.saidas.transferencia.manha.valor +
            this.v.saidas.cartoes.manha +
            this.v.saidas.despesas.manha +
            this.saidas.dinheiro.manha.valor;
});
CaixasSchema.virtual('v.saidas.total.tarde').get(function () {
    return  this.saidas.transferencia.tarde.valor +
            this.v.saidas.cartoes.tarde +
            this.v.saidas.despesas.tarde +
            this.saidas.dinheiro.tarde.valor;
});
CaixasSchema.virtual('v.saidas.total.total').get(function () {
    return this.v.saidas.total.manha + this.v.saidas.total.tarde;
});

CaixasSchema.virtual('v.diferenca.manha').get(function () {
    return this.v.saidas.total.manha - this.v.entradas.total.manha;
});
CaixasSchema.virtual('v.diferenca.tarde').get(function () {
    return this.v.saidas.total.tarde - this.v.entradas.total.tarde;
});
CaixasSchema.virtual('v.diferenca.total').get(function () {
    return this.v.diferenca.manha + this.v.diferenca.tarde
});

CaixasSchema.virtual('v.widgets.venda.total').get(function () {
    return this.v.entradas.vendas.total;
});
CaixasSchema.virtual('v.widgets.venda.cartao.valor').get(function () {
    return this.v.saidas.cartoes.total;
});
CaixasSchema.virtual('v.widgets.venda.cartao.percentual').get(function () {
    return this.v.saidas.cartoes.total / this.v.widgets.venda.total;
});
CaixasSchema.virtual('v.widgets.venda.dinheiro.valor').get(function () {
    return this.v.entradas.vendas.total - this.v.saidas.cartoes.total;
});
CaixasSchema.virtual('v.widgets.venda.dinheiro.percentual').get(function () {
    return this.v.widgets.venda.dinheiro.valor / this.v.entradas.vendas.total;
});

CaixasSchema.virtual('v.widgets.diferenca.manha').get(function () {
    return this.v.diferenca.manha;
});
CaixasSchema.virtual('v.widgets.diferenca.tarde').get(function () {
    return this.v.diferenca.tarde;
});
CaixasSchema.virtual('v.widgets.diferenca.total').get(function () {
    return this.v.diferenca.total;
});


CaixasSchema.virtual('v.controles.salgados.total').get(function () {
    return this.controles.produtos.reduce(function(prevVal, elem) {
        return (elem.nome === 'Salgado') ? prevVal + elem.valor : prevVal;
    }, 0);
});
CaixasSchema.virtual('v.controles.pao_de_queijo.total').get(function () {
    return this.controles.produtos.reduce(function(prevVal, elem) {
        return (elem.nome === 'Pão de Queijo') ? prevVal + elem.valor : prevVal;
    }, 0);
});
CaixasSchema.virtual('v.controles.salgados.total').get(function () {
    return this.controles.produtos.reduce(function(prevVal, elem) {
        return (elem.nome === 'Folhado') ? prevVal + elem.valor : prevVal;
    }, 0);
});

// Normatizações

CaixasSchema.set('toJSON', {
    getters: true,
    virtuals: true
});

mongoose.model('Caixa', CaixasSchema);