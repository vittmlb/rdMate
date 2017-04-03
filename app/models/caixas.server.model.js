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
    abertura: {
        manha: {
            valor: Number,
            default: 0
            // tipo_operacao: {
            //     type: String,
            //     enum: ['credito', 'debito']
            // }
        },
        tarde: {
            valor: Number,
            default: 0
            // tipo_operacao: {
            //     type: String,
            //     enum: ['credito', 'debito']
            // }
        }
    },
    vendas: {
        vales: {
            tickets: {
                manha: {
                    valor: Number,
                    default: 0
                    // tipo_operacao: {
                    //     type: String,
                    //     enum: ['credito', 'debito']
                    // },
                },
                tarde: {
                    valor: Number,
                    default: 0
                    // tipo_operacao: {
                    //     type: String,
                    //     enum: ['credito', 'debito']
                    // },
                }
            },
            visa_vale: {
                manha: {
                    valor: Number,
                    default: 0
                    // tipo_operacao: {
                    //     type: String,
                    //     enum: ['credito', 'debito']
                    // },
                },
                tarde: {
                    valor: Number,
                    default: 0
                    // tipo_operacao: {
                    //     type: String,
                    //     enum: ['credito', 'debito']
                    // },
                }
            }
        },
        cartoes: {
            master: {
                manha: {
                    valor: Number,
                    default: 0
                    // tipo_operacao: {
                    //     type: String,
                    //     enum: ['credito', 'debito']
                    // },
                },
                tarde: {
                    valor: Number,
                    default: 0
                    // tipo_operacao: {
                    //     type: String,
                    //     enum: ['credito', 'debito']
                    // },
                }
            },
            visa: {
                manha: {
                    valor: Number,
                    default: 0
                    // tipo_operacao: {
                    //     type: String,
                    //     enum: ['credito', 'debito']
                    // },
                },
                tarde: {
                    valor: Number,
                    default: 0
                    // tipo_operacao: {
                    //     type: String,
                    //     enum: ['credito', 'debito']
                    // },
                }
            }
        },
        manha: {
            valor: Number,
            default: 0
            // tipo_operacao: {
            //     type: String,
            //     enum: ['credito', 'debito']
            // }
        },
        tarde: {
            valor: Number,
            default: 0
            // tipo_operacao: {
            //     type: String,
            //     enum: ['credito', 'debito']
            // }
        }
    },
    lancamentos: {
        transferencia: {
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
        },
        despesas: {
            total: Number,
            manha: [{
                descricao: {
                    type: String,
                    trim: true
                },
                valor: Number,
                default: 0

            }],
            tarde: [{
                descricao: {
                    type: String,
                    trim: true
                },
                valor: Number,
                default: 0
                // tipo_operacao: {
                //     type: String,
                //     enum: ['credito', 'debito']
                // }
            }]
        },
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
    acompanhamentos: {
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


CaixasSchema.virtual('virt.caixa.entradas.vendas.manha').get(function () {
    return this.vendas.manha.valor;
});
CaixasSchema.virtual('virt.caixa.entradas.vendas.tarde').get(function () {
    return this.vendas.tarde.valor;
});
CaixasSchema.virtual('virt.caixa.entradas.vendas.total').get(function () {
    return this.vendas.manha.valor + this.vendas.tarde.valor;
});

CaixasSchema.virtual('virt.caixa.entradas.abertura.manha').get(function () {
    return this.abertura.manha.valor;
});
CaixasSchema.virtual('virt.caixa.entradas.abertura.tarde').get(function () {
    return this.abertura.tarde.valor;
});
CaixasSchema.virtual('virt.caixa.entradas.abertura.total').get(function () {
    return this.abertura.manha.valor + this.abertura.tarde.valor;
});

CaixasSchema.virtual('virt.caixa.entradas.total.manha').get(function () {
    return  this.abertura.manha.valor +
            this.vendas.manha.valor;
});
CaixasSchema.virtual('virt.caixa.entradas.total.tarde').get(function () {
    return  this.abertura.tarde.valor +
             this.vendas.tarde.valor;
});
CaixasSchema.virtual('virt.caixa.entradas.total.total').get(function () {
    return  this.virt.caixa.entradas.total.manha + this.virt.caixa.entradas.total.tarde;
});


CaixasSchema.virtual('virt.caixa.saidas.transferencias.manha').get(function () {
    return this.lancamentos.transferencia.manha.valor;
});
CaixasSchema.virtual('virt.caixa.saidas.transferencias.tarde').get(function () {
    return this.lancamentos.transferencia.tarde.valor;
});
CaixasSchema.virtual('virt.caixa.saidas.transferencias.total').get(function () {
    return this.lancamentos.transferencia.manha.valor + this.lancamentos.transferencia.tarde.valor;
});

CaixasSchema.virtual('virt.caixa.saidas.visa.manha').get(function () { // Schema 'saída' > dinheiro da venda não entra no caixa
    return this.vendas.cartoes.visa.manha.valor;
});
CaixasSchema.virtual('virt.caixa.saidas.visa.tarde').get(function () { // Schema 'saída' > dinheiro da venda não entra no caixa
    return this.vendas.cartoes.visa.tarde.valor;
});
CaixasSchema.virtual('virt.caixa.saidas.visa.total').get(function () { // Schema 'saída' > dinheiro da venda não entra no caixa
    return this.vendas.cartoes.visa.manha.valor + this.vendas.cartoes.visa.tarde.valor;
});

CaixasSchema.virtual('virt.caixa.saidas.despesas.manha').get(function () {
    let soma = 0;
    this.lancamentos.despesas.manha.forEach(function (data) {
        soma += data.valor;
    });
    return soma;
});
CaixasSchema.virtual('virt.caixa.saidas.despesas.tarde').get(function () {
    let soma = 0;
    this.lancamentos.despesas.tarde.forEach(function (data) {
        soma += data.valor;
    });
    return soma;
});
CaixasSchema.virtual('virt.caixa.saidas.despesas.total').get(function () {
    return this.virt.caixa.saidas.despesas.manha + this.virt.caixa.saidas.despesas.tarde;
});

CaixasSchema.virtual('virt.caixa.saidas.dinheiro.manha').get(function () {
    return this.lancamentos.dinheiro.manha.valor;
});
CaixasSchema.virtual('virt.caixa.saidas.dinheiro.tarde').get(function () {
    return this.lancamentos.dinheiro.tarde.valor;
});
CaixasSchema.virtual('virt.caixa.saidas.dinheiro.total').get(function () {
    return this.lancamentos.dinheiro.manha.valor + this.lancamentos.dinheiro.tarde.valor;
});

CaixasSchema.virtual('virt.caixa.saidas.total.manha').get(function () {
    return  this.lancamentos.transferencia.manha.valor +
            this.vendas.cartoes.visa.manha.valor +
            this.virt.caixa.saidas.despesas.manha +
            this.lancamentos.dinheiro.manha.valor;
});
CaixasSchema.virtual('virt.caixa.saidas.total.tarde').get(function () {
    return  this.lancamentos.transferencia.tarde.valor +
            this.vendas.cartoes.visa.tarde.valor +
            this.virt.caixa.saidas.despesas.tarde +
            this.lancamentos.dinheiro.tarde.valor;
});
CaixasSchema.virtual('virt.caixa.saidas.total.total').get(function () {
    return this.virt.caixa.saidas.total.manha + this.virt.caixa.saidas.total.tarde;
});


CaixasSchema.virtual('virt.caixa.diferenca.manha').get(function () {
    return this.virt.caixa.saidas.total.manha - this.virt.caixa.entradas.total.manha;
});
CaixasSchema.virtual('virt.caixa.diferenca.tarde').get(function () {
    return this.virt.caixa.saidas.total.tarde - this.virt.caixa.entradas.total.tarde;
});
CaixasSchema.virtual('virt.caixa.diferenca.total').get(function () {
    return this.virt.caixa.diferenca.manha - this.virt.caixa.diferenca.tarde
});

CaixasSchema.set('toJSON', {
    getters: true,
    virtuals: true
});

mongoose.model('Caixa', CaixasSchema);