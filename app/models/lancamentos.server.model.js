/**
 * Created by Vittorio on 29/03/2017.
 */
let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let enum_categorias = ['Entrada', 'Custo Variável', 'Despesa Operacional', 'Investimento', 'Outras Saídas'];
let enum_subcategorias = ['Venda', 'Receita', 'Fornecedores', 'Imposto', 'Frete', 'Franquia', 'Imóvel', 'Consumo', 'Taxa', 'Pessoal', 'Operacional', 'Operador', 'Financeiro'];

let LancamentosSchema = new Schema({
    created: {
        type: Date,
        default: Date.now
    },
    data: {
        type: String,
        required: `O campo 'data' é obrigatório`
    },
    categoria: {
        type: String,
        enum: enum_categorias
    },
    subcategoria: {
        type: String,
        enum: enum_subcategorias
    },
    nome: {
        type: String,
        required: `O campo 'nome' é obrigatório`
    },
    descricao: {
        type: String,
        trim: true,
        default: ''
    },
    observacao: {
        type: String,
        trim: true,
        default: ''
    },
    valor: {
        type: Number,
        required: `O campo 'valor' é obrigatório`
    }
});

LancamentosSchema.set('toJSON', {
    getters: true,
    virtuals: true
});

mongoose.model('Lancamento', LancamentosSchema);