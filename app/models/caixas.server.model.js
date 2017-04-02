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
        },
        total: function() {
            return this.manha + this.tarde;
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
                // tipo_operacao: {
                //     type: String,
                //     enum: ['credito', 'debito']
                // }
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

CaixasSchema.virtual('totais').get(function () {
    let soma = 0;
    this.lancamentos.despesas.manha.forEach(function (data) {
        soma += data.valor;
    });
    return soma;
});

CaixasSchema.set('toJSON', {
    getters: true,
    virtuals: true
});

mongoose.model('Caixa', CaixasSchema);