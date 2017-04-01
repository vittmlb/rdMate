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
        default: moment().utc(Date.now)
    },
    dia: {
        type: Date,
        required: `O campo 'dia' é obrigatório`,
        set: formataData
    },
    periodo: {
        data: {
            type: Date,
            // required: `O campo 'data' é obrigatório`,
            set: function(valor) {
                this.data = moment().utc(valor);
            }
        },
        mes: {
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
        }
    },
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

function formataData(valor) {
    return moment().utc(valor);
}

mongoose.model('Demonstrativo', DemonstrativosSchema);