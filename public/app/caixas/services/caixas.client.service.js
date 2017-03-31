/**
 * Created by Vittorio on 22/03/2017.
 */
angular.module('caixas').factory('Caixas', ['$resource', function ($resource) {
    return $resource('/api/caixas/:caixaId', {
        caixaId: '@_id'
    }, {
        update: {
            method: 'PUT'
        }
    });
}]);

let ModuloCaixa = function() {
    let parent = this;
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

angular.module('caixas').factory('CompCaixa', ['Caixas', function (Caixas) {

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