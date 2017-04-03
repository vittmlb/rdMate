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
angular.module('caixas').factory('Qcaixas', ['$resource', function ($resource) {
    return $resource('/api/caixas/query/:caixaId', {
        caixaId: '@_id'
    }, {
        update: {
            method: 'PUT'
        },
        conferencia: {
            method: 'GET',
            isArray: false,
            parametros: parametros
        }
    });
}]);