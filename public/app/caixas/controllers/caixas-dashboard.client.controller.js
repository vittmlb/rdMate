/**
 * Created by Vittorio on 07/04/2017.
 */
angular.module('caixas').controller('DashboardsController', ['$scope', '$stateParams', '$location', 'CaixasDashboard', 'toaster',
                                    '$http', '$timeout', 'MySweetAlert', 'MyDefineClass', 'ngAudio', 'MyAudio', '$modal', 'moment', 'MyFlot',
    function($scope, $stateParams, $location, CaixasDashboard, toaster, $http, $timeout, MySweetAlert, MyDefineClass, ngAudio, MyAudio, $modal, moment, MyFlot) {
        let datas = {
            inicial: '',
            final: ''
        };


        function popToaster(errorResponse) {
            console.log(errorResponse);
            let msgObj = {
                type: 'error',
                title: 'Erro',
                body: errorResponse.data,
                timeout: 4000
            };
            if(typeof errorResponse === 'string') {
                msgObj.body = errorResponse;
            }
            toaster.pop(msgObj);
        }

        $scope.sounds = MyAudio;

        $scope.comparacao = function() {
            let inicial = moment('2017-03-01').utc().format();
            let final = moment('2017-03-03').utc().format();
            let aux = JSON.stringify({tipo_relatorio: "comparacao", inicial: inicial, final: final});
            let p = CaixasDashboard.comparacao({
                teste: aux
            });

            p.then(function (data) {
                $scope.comparacao = data;
            });

            p.then(function (errorMessage) {
                popToaster(errorMessage);
            });

        };

        $scope.findNew = function() {
            let inicial = moment('2017-02-01').utc().format();
            let final = moment('2017-03-30').utc().format();
            let aux = JSON.stringify({"tipo_relatorio": "dashboard", "inicial": inicial, "final" : final});
            let p = CaixasDashboard.dashboard({
                teste: aux
            }).$promise;

            p.then(function (data) {
                $scope.dashboard = data;
            });

            p.catch(function (errorData) {
                popToaster(errorData);
            });

        };


        $scope.load = function() {
            $scope.flot = {
                dataset: MyFlot.flotData(),
                options: MyFlot.flotOptions()
            };
            let b = 10;
        }();


    }
]);