/**
 * Created by Vittorio on 03/04/2017.
 */
angular.module('caixas').filter('percent', ['$filter', function ($filter) {
    return function(input, decimals) {
        return $filter('number')(input * 100 , decimals) + '%';
    };
}]);