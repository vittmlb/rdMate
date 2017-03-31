/**
 * Created by Vittorio on 10/03/2017.
 */
angular.module('ctnrs').config(['$stateProvider', function ($stateProvider) {
    $stateProvider
        .state('ctnr_create', {
            url: '/ctnrs/create',
            templateUrl: 'app/ctnrs/views/create-ctnr.client.view.html',
            controller: 'CtnrsController'
        })
        .state('ctnr_list', {
            url: '/ctnrs',
            templateUrl: 'app/ctnrs/views/list-ctnrs.client.view.html',
            controller: 'CtnrsController'
        })
        .state('ctnr_view', {
            url: '/ctnrs/:ctnrId',
            templateUrl: 'app/ctnrs/views/view-ctnr.client.view.html',
            controller: 'CtnrsController',
        })
        .state('ctnr_edit', {
            url: '/ctnrs/:ctnrId/edit',
            templateUrl: 'app/ctnrs/views/edit-ctnr.client.view.html',
            controller: 'CtnrsController'
        });
}]);