/**
 * Created by Vittorio on 10/03/2017.
 */
angular.module('ctnrs').controller('CtnrsController', ['$scope', '$stateParams', '$location', 'Ctnrs', 'toaster', 'SweetAlert',
    function($scope, $stateParams, $location, Ctnrs, toaster, SweetAlert) {
        let SweetAlertOptions = {
            removerCtnr: {
                title: "Deseja remover o Contato?",
                text: "Você não poderá mais recuperá-lo!",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",confirmButtonText: "Sim, remover!",
                cancelButtonText: "Não, cancelar!",
                closeOnConfirm: false,
                closeOnCancel: false }
        };

        $scope.create = function() {
            let ctnr = new Ctnrs({
                nome_ctnr: this.nome_ctnr,
                tipo_ctnr: this.tipo_ctnr,
                dimensoes: this.dimensoes,
                percentual_aproveitado: this.percentual_aproveitado
            });
            ctnr.$save(function (response) {
                $location.path('/ctnrs/' + response._id);
            }, function(errorResponse) {
                console.log(errorResponse);
                toaster.pop({
                    type: 'error',
                    title: 'Erro',
                    body: errorResponse.data,
                    timeout: 4000
                });
            });
        };

        $scope.find = function() {
            $scope.ctnrs = Ctnrs.query();
        };

        $scope.findone = function() {
            Ctnrs.get({
                ctnrId: $stateParams.ctnrId
            }).$promise.then(function(data) {
                $scope.ctnr = data;
            });
        };

        $scope.update = function() {
            $scope.ctnr.$update(function (response) {
                $location.path('/ctnrs/' + response._id);
            }, function(errorResponse) {
                toaster.pop({
                    type: 'error',
                    title: 'Erro',
                    body: errorResponse.data.message,
                    timeout: 4000
                });
            });
        };

        $scope.delete = function(ctnr) {
            if(ctnr) {
                ctnr.$remove(function () {
                    for(let i  in $scope.ctnrs) {
                        if($scope.ctnrs[i] === ctnr) {
                            $scope.ctnrs.splice(i, 1);
                        }
                    }
                }, function(errorResponse) {
                    toaster.pop({
                        type: 'error',
                        title: 'Erro',
                        body: errorResponse.data.message,
                        timeout: 4000
                    });
                });
            } else {
                $scope.ctnr.$remove(function () {
                    $location.path('/ctnrs');
                }, function(errorResponse) {
                    toaster.pop({
                        type: 'error',
                        title: 'Erro',
                        body: errorResponse.data.message,
                        timeout: 4000
                    });
                });
            }
        };

        $scope.deleteAlert = function(ctnr) {
            SweetAlert.swal(SweetAlertOptions.removerCtnr,
                function(isConfirm){
                    if (isConfirm) {
                        $scope.delete(ctnr);
                        SweetAlert.swal("Removido!", "O Contêiner foi removido.", "success");
                    } else {
                        SweetAlert.swal("Cancelado", "O Contêiner não foi removido :)", "error");
                    }
                });
        };

    }
]);