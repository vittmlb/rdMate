/**
 * Created by Vittorio on 22/03/2017.
 */
angular.module('caixas').factory('Caixas', ['$resource', function ($resource) {
    return $resource('/api/caixas/:caixaId', {
        caixaId: '@_id'
    }, {
        update: {
            method: 'PUT'
        },
        dashboard: {
            method: 'GET',
            isArray: false,
            teste_param: 'teste_param'
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
angular.module('caixas').factory('CaixasDashboard', ['$resource', function ($resource) {
    return $resource('/api/caixas/dashboard/:teste:caralho', {
        teste: 'teste'
    }, {
        update: {
            method: 'PUT'
        },
        dashboard: {
            method: 'GET',
            isArray: false,
            teste: 'teste',
        },
        comparacao: {
            method: 'GET',
            isArray: true,
            zzz: ''
        }
    });
}]);