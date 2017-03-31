/**
 * Created by Vittorio on 27/03/2017.
 */
angular.module('users').controller('UsersController', ['$scope', '$stateParams', '$location', 'Users', 'toaster', 'SweetAlert', '$http',
    function($scope, $stateParams, $location, Users, toaster, SweetAlert, $http) {
        let SweetAlertOptions = {
            removerUser: {
                title: "Deseja remover este Usuário",
                text: "Você não poderá mais recuperá-lo!",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",confirmButtonText: "Sim, remover!",
                cancelButtonText: "Não, cancelar!",
                closeOnConfirm: false,
                closeOnCancel: false }
        };

        $scope.create = function() {
            let user = new Users({
                nome: this.nome,
                email: this.email,
                senha: this.senha
            });
            user.$save(function (response) {
                $location.path('/users/' + response._id);
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
            $scope.users = Users.query();
        };
        $scope.findOne = function() {
            Users.get({
                userId: $stateParams.userId
            }).$promise.then(function (data) {
                $scope.user = data;
            });
        };
        $scope.update = function() {
            $scope.user.$update(function (response) {
                $location.path('/users/' + response._id);
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

        $scope.delete = function(user) {
            if(user) {
                user.$remove(function () {
                    for(let i in $scope.users) {
                        if($scope.users[i] === user) {
                            $scope.users.splice(i, 1);
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
                $scope.user.$remove(function () {
                    $location.path('/users');
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
        $scope.deleteAlert = function(user) {
            SweetAlert.swal(SweetAlertOptions.removerUser,
                function(isConfirm){
                    if (isConfirm) {
                        $scope.delete(user);
                        SweetAlert.swal("Removido!", "O Usuário foi removido.", "success");
                    } else {
                        SweetAlert.swal("Cancelado", "O Usuário não foi removido :)", "error");
                    }
                });
        };

        $scope.login = function(user) {
            $http.post('/login', user)
                .success(function(response) {
                    $rootScope.currentUser = response;
                    $location.url("#!/caixassssss");
                });
        };

    }
]);
