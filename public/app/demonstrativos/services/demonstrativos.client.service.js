/**
 * Created by Vittorio on 31/03/2017.
 */
angular.module('demonstrativos').factory('Demonstrativos', ['$resource', function ($resource) {
    return $resource('/api/demonstrativos/:demonstrativoId', {
        demonstrativoId: '@_id',
    }, {
        update: {
            method: 'PUT'
        }
    });
}]);
angular.module('demonstrativos').factory('DemonstrativosQueries', ['$resource', function ($resource) {
    return $resource('/api/demonstrativos/query/:params', {
        params: 'params'
    }, {
        query: {
            method: 'GET',
            // isArray: true,
            params: {tiposetId: this.tiposetId}
        },
        teste: {
            method: 'GET',
            params: 'params'
        }
    });
}]);