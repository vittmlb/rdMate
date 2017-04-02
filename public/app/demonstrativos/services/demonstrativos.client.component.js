/**
 * Created by Vittorio on 01/04/2017.
 */
let BuildAux = function() {
    let self = this;
    this.params = {
        categoria: function(data) {
            let aux = {
                data: data,
                criterios: ['categoria', 'subcategoria', 'nome']
            };
            return JSON.stringify(aux);
        }
    };
};

angular.module('demonstrativos').factory('CompDemonstrativos', ['Demonstrativos', 'LancamentosQueries',
    function(Demonstrativos, LancamentosQueries) {
        let build = new BuildAux();

        function onChange(params) {
            return LancamentosQueries.teste({
                parametros: build.params.categoria(params)
            });
        }

        return {
            filter: function(params) {
                return onChange(params);
            }
        };

    }
]);