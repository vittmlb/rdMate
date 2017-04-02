/**
 * Created by Vittorio on 31/03/2017.
 */
let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let moment = require('moment');
moment.locale('pt-br');

let DemonstrativosSchema = new Schema({
    created: {
        type: Date,
        default: Date.now
    },
    dia: {
        type: Date,
        required: `O campo 'dia' é obrigatório`
    },
    periodo: {
        data: {
            type: Date,
            // required: `O campo 'dia' é obrigatório`,
            // set: formataData
        },
        comp: {
            type: Number,
        },
        ano: {
            type: Number
        }
    },
    receitas: {
        vendas: {
            dinheiro: {
                total: Number,
                _lancamentosId: [{
                    type: mongoose.Schema.Types.ObjectId, ref: 'Lancamento'
                }]
            },
            cartoes: {
                total: Number,
                _lancamentosId: [{
                    type: mongoose.Schema.Types.ObjectId, ref: 'Lancamento'
                }]
            },
            total: Number
        },
        outras_receitas: {
            total: Number,
            _lancamentosId: [{
                type: mongoose.Schema.Types.ObjectId, ref: 'Lancamento'
            }]
        },
        venda_liquida: {
            type: Number
        }
    },
    custo_variavel: {
        fornecedores: {
            total: Number,
            _lancamentosId: [{
                type: mongoose.Schema.Types.ObjectId, ref: 'Lancamento'
            }]
        },
        frete: {
            total: Number,
            _lancamentosId: [{
                type: mongoose.Schema.Types.ObjectId, ref: 'Lancamento'
            }]
        },
        impostos: {
            total: Number,
            _lancamentosId: [{
                type: mongoose.Schema.Types.ObjectId, ref: 'Lancamento'
            }]
        },
        royalties: {
            total: Number,
            _lancamentosId: [{
                type: mongoose.Schema.Types.ObjectId, ref: 'Lancamento'
            }]
        },
        fundo_promocao: {
            total: Number,
            _lancamentosId: [{
                type: mongoose.Schema.Types.ObjectId, ref: 'Lancamento'
            }]
        },
    },
    custo_operacional: {},

    teste: {
        type: String,
        default: 'aloha'
    }
});

DemonstrativosSchema.set('toJSON', {
    getters: true,
    virtuals: true,
    setters: true
});

function formataData() {
    return moment(this.dia).toISOString()
}

mongoose.model('Demonstrativo', DemonstrativosSchema);