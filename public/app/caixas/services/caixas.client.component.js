/**
 * Created by Vittorio on 02/04/2017.
 */
let ModuloCaixa = function(obj_moment) {
    let parent = this;
    let moment = obj_moment;
    this.modulo = {
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
    };
    this.confereCaixa = function() {
        let despesasManha = 0;
        parent.caixa.lancamentos.despesas.manha.forEach(function (data) {
            despesasManha += data.valor;
        });
        this.modulo.geral.manha.abertura_venda = parent.caixa.abertura.manha.valor + parent.caixa.vendas.manha.valor;
        this.modulo.geral.manha.entradas = parent.caixa.lancamentos.transferencia.manha.valor + despesasManha;
        this.modulo.geral.manha.diferenca = this.modulo.geral.manha.abertura_venda - this.modulo.geral.manha.entradas;
    };
    this.caixa = {};
    this.set = {
        caixa: function(objCaixa) {
            parent.caixa = objCaixa;
        }
    };
};

angular.module('caixas').factory('CompCaixa', ['Caixas', 'moment', function (Caixas, moment) {

    let modCaixa = new ModuloCaixa(moment);

    function confereCaixa(caixa) {
        let modCx = new ModuloCaixa();
        modCx.set.caixa(caixa);
        modCx.confereCaixa();
        return modCx.modulo;
    }

    return {
        teste: function(caixa) {
            return confereCaixa(caixa);
        }
    };

}]);