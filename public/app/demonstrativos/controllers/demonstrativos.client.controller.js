/**
 * Created by Vittorio on 31/03/2017.
 */
angular.module('demonstrativos').controller('DemonstrativosController', ['$scope', '$stateParams', '$location', 'Demonstrativos', 'CompDemonstrativos', 'toaster', 'SweetAlert',
    function($scope, $stateParams, $location, Demonstrativos, CompDemonstrativos, toaster, SweetAlert) {
        let SweetAlertOptions = {
            removerDemonstrativo: {
                title: "Deseja remover este Demonstrativo?",
                text: "Você não poderá mais recuperá-lo!",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",confirmButtonText: "Sim, remover!",
                cancelButtonText: "Não, cancelar!",
                closeOnConfirm: false,
                closeOnCancel: false }
        };

        function errorPop(errorResponse) {
            console.log(errorResponse);
            toaster.pop({
                type: 'error',
                title: 'Erro',
                body: errorResponse.data,
                timeout: 4000
            });
        }

        $scope.lancamentos = {
            fornecedores: {
                total: 0
            }
        };

        // $scope.data = new Date();

        $scope.create = function() {
            let demonstrativo = new Demonstrativos({
                dia: this.dia,
                receitas: this.receitas
            });
            demonstrativo.$save(function (response) {
                $location.path('/demonstrativos/' + response._id);
            }, function(errorResponse) {
                errorPop(errorResponse);
            });
        };
        $scope.find = function() {
            Demonstrativos.query().$promise.then(function (data) {
                $scope.demonstrativos = data;
            });
        };
        $scope.findOne = function() {
            Demonstrativos.get({
                demonstrativoId: $stateParams.demonstrativoId
            }).$promise.then(function (data) {
                $scope.demonstrativo = data;
            });
        };
        $scope.update = function() {
            $scope.demonstrativo.$update(function (response) {
                $location.path('/demonstrativos/' + response._id);
            }, function(errorResponse) {
                errorPop(errorResponse);
            });
        };

        $scope.initData = function() {

        };

        $scope.delete = function(demonstrativo) {
            if(demonstrativo) {
                demonstrativo.$remove(function () {
                    for(let i in $scope.demonstrativos) {
                        if($scope.demonstrativos[i] === demonstrativo) {
                            $scope.demonstrativos.splice(i, 1);
                        }
                    }
                }, function(errorResponse) {
                    console.log(errorResponse);
                    toaster.pop({
                        type: 'error',
                        title: 'Erro',
                        body: errorResponse.data,
                        timeout: 4000
                    });
                });
            } else {
                $scope.demonstrativo.$remove(function () {
                    $location.path('/demonstrativos');
                }, function(errorResponse) {
                    console.log(errorResponse);
                    toaster.pop({
                        type: 'error',
                        title: 'Erro',
                        body: errorResponse.data,
                        timeout: 4000
                    });
                });
            }
        };

        $scope.deleteAlert = function(demonstrativo) {
            SweetAlert.swal(SweetAlertOptions.removerCaixa,
                function(isConfirm){
                    if (isConfirm) {
                        $scope.delete(demonstrativo);
                        SweetAlert.swal("Removido!", "O Demonstrativo foi removido.", "success");
                    } else {
                        SweetAlert.swal("Cancelado", "O Demonstrativo não foi removido :)", "error");
                    }
                });
        };

        $scope.onChangeDate = function() {
            CompDemonstrativos.filter(this.data).$promise.then(function (data) {
                $scope.lancamentos = data;
            });
        };
    }
]);