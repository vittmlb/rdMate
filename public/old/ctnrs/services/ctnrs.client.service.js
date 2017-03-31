/**
 * Created by Vittorio on 10/03/2017.
 */
angular.module('ctnrs').factory('Ctnrs', ['$resource', function ($resource) {
    return $resource('/api/ctnrs/:ctnrId', {
        ctnrId: '@_id'
    }, {
        update: {
            method: 'PUT'
        }
    });
}]);