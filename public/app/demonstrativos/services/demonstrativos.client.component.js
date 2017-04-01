/**
 * Created by Vittorio on 01/04/2017.
 */
let BuildAux = function() {
    let self = this;
    this.params = {
        categoria: function(data) {
            let aux = {
                data: data,
                criterio: '$categoria'
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
            // LancamentosQueries.teste({
            //     parametros: params
            // }).$promise.then(function (data) {
            //     return new Promise(data[0].root[0].root);
            // });
        }

        return {
            filter: function(params) {
                return onChange(params);
            }
        };

    }
]);