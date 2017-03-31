/**
 * Created by Vittorio on 27/03/2017.
 */
angular.module('users').factory('Users', ['$resource', function ($resource) {
    return $resource('/api/users/:userId', {
        userId: '@_id'
    }, {
        update: {
            method: 'PUT'
        }
    })
}]);