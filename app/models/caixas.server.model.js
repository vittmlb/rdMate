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
                valor: Number,
                default: 0
            },
            tarde: {
                valor: Number,
                default: 0
            }
        },
        vendas: {
            manha: {
                valor: Number,
                default: 0
            },
            tarde: {
                valor: Number,
                default: 0
            }
        },
    },
    saidas: {
        transferencia: {
            manha: {
                valor: Number,
                default: 0
            },
            tarde: {
                valor: Number,
                default: 0
            }
        },
        cartoes: {
            manha: {
                valor: Number,
                default: 0
            },
            tarde: {
                valor: Number,
                default: 0
            }
        },
        despesas: [{
            descricao: {
                type: String,
                trim: true
            },
            valor: Number,
            turno: String,
            tag: String,
            fornecedor: String,
            obs: String
        }],
        dinheiro: {
            manha: {
                valor: Number,
                default: 0
                // tipo_operacao: {
                //     type: String,
                //     enum: ['credito', 'debito']
                // },
                // turno: {
                //     type: String,
                //     enum: ['manha', 'tarde']
                // }
            },
            tarde: {
                valor: Number,
                default: 0
                // tipo_operacao: {
                //     type: String,
                //     enum: ['credito', 'debito']
                // },
                // turno: {
                //     type: String,
                //     enum: ['manha', 'tarde']
                // }
            }
        }
    },
    movimentacao: {
        total: Number,
        cofre: [{
            descricao: {
                type: String,
                trim: true
            },
            valor: {
                type: Number,
                default: 0
            }
            // tipo_operacao: {
            //     type: String,
            //     enum: ['credito', 'debito']
            // }
        }],
        geral: [{
            descricao: {
                type: String,
                trim: true
            },
            valor: {
                type: Number,
                default: 0
            },
            // tipo_operacao: {
            //     type: String,
            //     enum: ['credito', 'debito']
            // }
        }]
    },
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


CaixasSchema.virtual('mod_virtual.saidas.transferencias.manha').get(function () {
    return this.saidas.transferencia.manha.valor;
});
CaixasSchema.virtual('mod_virtual.saidas.transferencias.tarde').get(function () {
    return this.saidas.transferencia.tarde.valor;
});
CaixasSchema.virtual('mod_virtual.saidas.transferencias.total').get(function () {
    return this.saidas.transferencia.manha.valor + this.saidas.transferencia.tarde.valor;
});

CaixasSchema.virtual('mod_virtual.saidas.cartoes.manha').get(function () { // Schema 'saída' > dinheiro da venda não entra no caixa
    return this.saidas.cartoes.manha.valor;
});
CaixasSchema.virtual('mod_virtual.saidas.cartoes.tarde').get(function () { // Schema 'saída' > dinheiro da venda não entra no caixa
    return this.saidas.cartoes.tarde.valor;
});
CaixasSchema.virtual('mod_virtual.saidas.cartoes.total').get(function () { // Schema 'saída' > dinheiro da venda não entra no caixa
    return this.saidas.cartoes.manha.valor + this.saidas.cartoes.tarde.valor;
});

CaixasSchema.virtual('mod_virtual.saidas.despesas.manha').get(function () {
    let soma = 0;
    this.saidas.despesas.manha.forEach(function (data) {
        soma += data.valor;
    });
    return soma;
});
CaixasSchema.virtual('mod_virtual.saidas.despesas.tarde').get(function () {
    let soma = 0;
    this.saidas.despesas.tarde.forEach(function (data) {
        soma += data.valor;
    });
    return soma;
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
            this.saidas.cartoes.manha.valor +
            this.mod_virtual.saidas.despesas.manha +
            this.saidas.dinheiro.manha.valor;
});
CaixasSchema.virtual('mod_virtual.saidas.total.tarde').get(function () {
    return  this.saidas.transferencia.tarde.valor +
            this.saidas.cartoes.tarde.valor +
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
    return this.mod_virtual.diferenca.manha - this.mod_virtual.diferenca.tarde
});

CaixasSchema.set('toJSON', {
    getters: true,
    virtuals: true
});

mongoose.model('Caixa', CaixasSchema);