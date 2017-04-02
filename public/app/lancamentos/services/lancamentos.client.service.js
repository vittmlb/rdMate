/**
 * Created by Vittorio on 30/03/2017.
 */
angular.module('lancamentos').factory('Lancamentos', ['$resource', function ($resource) {
    return $resource('/api/lancamentos/:lancamentoId', {
        lancamentoId: '@_id'
    }, {
        update: {
            method: 'PUT'
        }
    });
}]);
angular.module('lancamentos').factory('LancamentosQueries', ['$resource', function ($resource) {
    return $resource('/api/lancamentos/query/:parametros', {
        parametros: 'parametros'
    }, {
        geral: {
            method: 'GET',
            isArray: false,
            parametros: 'parametros'
        }
    });
}]);
