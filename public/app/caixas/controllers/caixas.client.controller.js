/**
 * Created by Vittorio on 22/03/2017.
 */
angular.module('caixas').controller('CaixasController', ['$scope', '$stateParams', '$location', 'Caixas', 'CompCaixa', 'toaster',
                                    '$http', '$timeout', 'MySweetAlert', 'MyDefineClass', 'ngAudio', 'MyAudio', '$modal',
    function($scope, $stateParams, $location, Caixas, CompCaixa, toaster, $http, $timeout, MySweetAlert, MyDefineClass, ngAudio, MyAudio, $modal) {
        let SweetAlertOptions = {
            removerCaixa: {
                title: "Deseja remover este Caixa?",
                text: "Você não poderá mais recuperá-lo!",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",confirmButtonText: "Sim, remover!",
                cancelButtonText: "Não, cancelar!",
                closeOnConfirm: false,
                closeOnCancel: false }
        };

        $scope.teste = function(obj) {
            $scope.currentObj = obj;
            let modalInstance = $modal.open({
                templateUrl: 'app/caixas/views/modals/teste.html',
                controller: ModalInstanceCtrl,
                scope: $scope,
                windowClass: 'animated flipInY'
            });
        }; // todo Mudar o nome da função

        $scope.sounds = MyAudio;

        $scope.defC = MyDefineClass;

        $scope.enums = {
            turnos: {
                manha: 'Manhã',
                tarde: 'Tarde'
            },
            tipos: {
                desp: 'Despesa',
                mov:  'Movimentação',
            },
            origens: {
                cofre: 'Cofre',
                geral: 'Geral'
            },
            tiposAux: {
                desp: 'Despesa',
                mov:  'Movimentação',
                prod: 'Produto',
                consumo: 'Consumo',
                cartao: 'Cartão'
            }
        };

        MySweetAlert.set.text = `Tem certeza de que deseja remover este Caixa?`;

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

        $scope.lista = {
            tiposRegistro: {},
            turnos: {},
            bandeiras: {},
            produtos: {},
            consumos: {}
        };


        $http.get('/app/caixas/data/enum_caixas.json').success(function (data) {
            $scope.lista.tiposRegistro = data.tiposRegistro;
            $scope.lista.turnos = data.turnos;
            $scope.lista.origens = data.origens;
            $scope.lista.bandeiras = data.bandeiras;
            $scope.lista.produtos = data.controles.produtos;
            $scope.lista.consumos = data.controles.consumos;
        });

        $scope.entradas = {};
        $scope.saidas = {
            despesas: [],
            cartoes: []
        };
        $scope.controles = {
            produtos: [],
            consumo: []
        };
        $scope.movimentacoes = [];

        $scope.objRegistro = {
            descricao: '',
            valor: 0,
            turno: '',
            tipo: '',
            tag: '',
            fornecedor: '',
            obs: '',
            obj: {}
        };

        $scope.obj = {
            produto: {
                nome: '',
                venda: {
                    valor: ''
                },
                perda: {
                    valor: ''
                },
                uso: {
                    valor: ''
                },
                tipoAux: $scope.enums.tiposAux.prod
            },
            consumo: {
                nome: '',
                inicial: {
                    valor: ''
                },
                final: {
                    valor: ''
                },
                tipoAux: $scope.enums.tiposAux.consumo
            },
            cartao: {
                bandeira: '',
                valor: '',
                turno: '',
                tipo: '', // usado apenas para passar pelo switch da função
                obs: '',
                tipoAux: $scope.enums.tiposAux.cartao
            },
            despesa: {
                descricao: '',
                valor: '',
                turno: '',
                tag: '',
                fornecedor: '',
                obs: '',
                tipoAux: $scope.enums.tiposAux.desp
            },
            movimentacao: {
                descricao: '',
                valor: '',
                tag: '',
                obs: '',
                tipoAux: $scope.enums.tiposAux.mov
            },
            unset: function(tipo) {
                let tp = $scope.enums.tiposAux;
                switch (tipo) {
                    case tp.prod:
                        this.produto = {};
                        this.produto = {
                            nome: '',
                            venda: {
                                valor: ''
                            },
                            perda: {
                                valor: ''
                            },
                            uso: {
                                valor: ''
                            },
                            tipoAux: $scope.enums.tiposAux.prod
                        };
                        break;
                    case tp.consumo:
                        this.consumo = {};
                        this.consumo = {
                            nome: '',
                            inicial: {
                                valor: ''
                            },
                            final: {
                                valor: ''
                            },
                            tipoAux: $scope.enums.tiposAux.consumo
                        };
                        break;
                    case tp.cartao:
                        this.cartao = {};
                        this.cartao = {
                            bandeira: '',
                            valor: '',
                            turno: '',
                            tipo: '', // usado apenas para passar pelo switch da função
                            obs: '',
                            tipoAux: $scope.enums.tiposAux.cartao
                        };
                        break;
                    case tp.desp:
                        this.despesa = {};
                        this.despesa = {
                            descricao: '',
                                valor: '',
                                turno: '',
                                tag: '',
                                fornecedor: '',
                                obs: '',
                                tipoAux: $scope.enums.tiposAux.desp
                        };
                        break;
                    case tp.mov:
                        this.movimentacao = {};
                        this.movimentacao = {
                        descricao: '',
                            valor: '',
                            tag: '',
                            obs: '',
                            tipoAux: $scope.enums.tiposAux.mov
                    };
                        break;
                }
            },
        };


        $scope.create = function() {
            let caixa = new Caixas({
                data_caixa: this.data_caixa,
                entradas: this.entradas,
                saidas: this.saidas,
                movimentacoes: this.movimentacoes,
                controles: this.controles
            });
            caixa.$save(function (response) {
                $location.path('/caixas/' + response._id);
            }, function(errorResponse) {
                popToaster(errorResponse);
            });
        };
        $scope.find = function() {
            let p = Caixas.query().$promise;

            p.then(function (data) {
                $scope.caixas = data;
                $timeout(function () {
                    $('.table').trigger('footable_redraw');
                }, 100);
            });

            p.catch(function (errorResponse) {
                popToaster(errorResponse);
            });

        };
        $scope.findOne = function() {
            let p = Caixas.get({ caixaId: $stateParams.caixaId}).$promise;

            p.then(function (data) {
                $scope.caixa = data;
                $scope.caixa.data_caixa = new Date(data.data_caixa);
                $timeout(function () {
                    $('.table').trigger('footable_redraw');
                }, 100);
                // $scope.caixa.conferencias = CompCaixa.teste($scope.caixa);
            });

            p.catch(function (errorResponse) {
                popToaster(errorResponse);
            });
        };
        $scope.update = function() {
            $scope.caixa.$update(function (response) {
                $location.path('/caixas/' + response._id);
            }, function(errorResponse) {
                popToaster(errorResponse);
            });
        };

        $scope.delete = function(caixa) {
            if(caixa) {
                return caixa.$remove(function () {
                    for(let i in $scope.caixas) {
                        if($scope.caixas[i] === caixa) {
                            $scope.caixas.splice(i, 1);
                        }
                    }
                }, function(errorResponse) {
                    return errorResponse;
                });
            } else {
                return $scope.caixa.$remove(function () {
                    $location.path('/caixas');
                }, function(errorResponse) {
                    return errorResponse;
                });
            }
        };

        $scope.deleteAlert = function(caixa) {
            let p = MySweetAlert.deleteAlert();
            p.then(function () {
                let pp = $scope.delete(caixa);
                pp.then(function(data) {
                    swal("Removido!", "O Caixa foi removido.", "success"); // todo: Melhorar essa resposta.
                });
                pp.catch(function(errorResponse) {
                    popToaster(errorResponse);
                });

            }).catch(swal.noop);
        };


        $scope.defineClass = function(item) {
            if(item >= 0) {
                if(item === 0) return 'text-success';
                return 'text-warning';
            } else {
                return 'text-danger';
            }
        };

        $scope.defClass = {
            diferenca: function(item) {
                if(item >= 0) {
                    if(item === 0) return 'text-success';
                    return 'text-warning';
                } else {
                    return 'text-danger';
                }
            }
        };

        $scope.addReg = function(registro) {
            let parent = $scope.caixa ? $scope.caixa : $scope;
            switch (registro.tipoAux) {
                case $scope.enums.tiposAux.prod:
                    parent.controles.produtos.push(registro);
                    break;
                case $scope.enums.tiposAux.cartao:
                    parent.saidas.cartoes.push(registro);
                    break;
                case $scope.enums.tiposAux.consumo:
                    parent.controles.consumo.push(registro);
                    break;
                case $scope.enums.tiposAux.desp:
                    parent.saidas.despesas.push(registro);
                    break;
                case $scope.enums.tiposAux.mov:
                    parent.movimentacoes.push(registro);
                    break;
            }
            $scope.obj.unset(registro.tipoAux);
        };

        $scope.removeReg = function(registro, tipo) {
            let tp = $scope.enums.tiposAux;
            let parent = $scope;

            if($scope.caixa) {
                parent = $scope.caixa;
                registro.tipoAux = tipo ? tipo : '';
            }

            switch (registro.tipoAux) {
                case tp.prod:
                    parent.controles.produtos = parent.controles.produtos.filter(function (elem) { return elem !== registro; });
                    break;
                case tp.cartao:
                    parent.saidas.cartoes = parent.saidas.cartoes.filter(function (elem) { return elem !== registro; });
                    break;
                case tp.consumo:
                    parent.controles.consumo = parent.controles.consumo.filter(function (elem) {return elem !== registro;});
                    break;
                case tp.desp:
                    parent.saidas.despesas = parent.saidas.despesas.filter(function (elem) { return elem !== registro; });
                    break;
                case tp.mov:
                    parent.movimentacoes = parent.movimentacoes.filter(function (elem) { return elem !== registro; });
                    break;
            }
        };

        $scope.addRegistro = function(registro) {
            let parent = $scope.caixa ? $scope.caixa: $scope;

            // if(!validateObjRegistro()) {
            //     $scope.objRegistro = {};
            //     return;
            // }

            switch (registro.tipo) {
                case $scope.enums.tipos.desp:
                    parent.saidas.despesas.push(registro);
                    break;
                case $scope.enums.tipos.mov:
                    parent.movimentacoes.push(registro);
                    break;
            }

            $scope.objRegistro = {};
        };



        function validateObjRegistro() {

            let reg = $scope.objRegistro;

            if(!Object.keys(reg).length) {
                popToaster(`O objeto objRegistro está vazio`);
                return false;
            }

            if(typeof reg.tipo === 'undefined') {
                popToaster(`O campo 'Tipo' do objRegistro não foi definido`);
                return false;
            }

            if(typeof reg.descricao === 'undefined' || reg.descricao === '') {
                popToaster(`O campo 'descrição é obrigatório`);
                return false;
            }

            if(typeof reg.valor !== 'number' ||  reg.valor === 0) {
                popToaster(`O campo 'valor' não foi preenchido ou é igual a 0`);
                return false;
            }

            //todo: Melhorar esses critérios depois.
            // if(!(reg.tipo === $scope.enums.tipos.desp && (reg.turno === $scope.enums.turnos.manha || reg.turno === $scope.enums.turnos.tarde))) {
            //     popToaster(`Erro com o campo de 'Turno'`);
            //     return false;
            // }
            //
            // if(!(reg.tipo === $scope.enums.tipos.mov && (reg.mov === $scope.enums.origens.manha || reg.mov === $scope.enums.origens.tarde))) {
            //     popToaster(`Erro com o campo de 'Movimentação'`);
            //     return false;
            // }

            return true;
        }

        $scope.showTab = {
            valor: 'Despesas',
            set: function(value) {
                this.valor = value;
            }
        }

    }
]);