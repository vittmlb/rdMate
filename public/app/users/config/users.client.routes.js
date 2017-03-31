/**
 * Created by Vittorio on 27/03/2017.
 */
angular.module('users').config(['$stateProvider', function ($stateProvider) {
    $stateProvider
        .state('user_create', {
            url: '/users/create',
            templateUrl: 'app/users/views/create-user.client.view.html',
            controller: 'UsersController'
        })
        .state('users_list', {
            url: '/users',
            templateUrl: 'app/users/views/list-users.client.view.html',
            controller: 'UsersController'
        })
        .state('user_view', {
            url: '/users/:userId',
            templateUrl: 'app/users/views/view-user.client.view.html',
            controller: 'UsersController'
        })
        .state('user_edit', {
            url: '/users/:userId/edit',
            templateUrl: 'app/users/views/edit-user.client.view.html',
            controller: 'UsersController'
        })
}]);