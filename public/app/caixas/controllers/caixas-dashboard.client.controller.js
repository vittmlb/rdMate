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

        $scope.loadPeriod = function(data_inicial, data_final) {
            let inicial = moment(data_inicial).utc().format();
            let final = moment(data_final).utc().format();
            let aux = JSON.stringify({"tipo_relatorio": "dashboard", "inicial": inicial, "final": final});
            let p = CaixasDashboard.comparacao({
                teste: aux
            }).$promise;

            p.then(function (data) {
                $scope.dashboard = data;
            });

            p.catch(function (errorData) {
                popToaster(errorData);
            });
        };

        $scope.loadCurrentMonth = function() {
            let inicial = moment('2017-03-01').utc().format();
            let final = moment('2017-03-30').utc().format();
            let aux = JSON.stringify({"tipo_relatorio": "dashboard", "inicial": inicial, "final" : final});
            let p = CaixasDashboard.comparacao({
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
        }();
    }
]);

angular.module('caixas').controller('GraficosController', ['$scope', 'CaixasDashboard', 'Caixas', 'moment', function ($scope, CaixasDashboard, Caixas, moment) {

    let graf1 = [];

    let data1 = [
        [gd(2012, 1, 1), 7000],
        [gd(2012, 1, 2), 6000],
        [gd(2012, 1, 3), 4000],
        [gd(2012, 1, 4), 8000],
        [gd(2012, 1, 5), 9000],
        [gd(2012, 1, 6), 7000],
        [gd(2012, 1, 7), 5000],
        [gd(2012, 1, 8), 4000],
        [gd(2012, 1, 9), 7000],
        [gd(2012, 1, 10), 8000],
        [gd(2012, 1, 11), 9000],
        [gd(2012, 1, 12), 6000],
        [gd(2012, 1, 13), 4000],
        [gd(2012, 1, 14), 5000],
        [gd(2012, 1, 15), 11000],
        [gd(2012, 1, 16), 8000],
        [gd(2012, 1, 17), 8000],
        [gd(2012, 1, 18), 11000],
    ];

    $scope.loadData = function() {
        let inicial = moment('2017-01-01').utc().format();
        let final = moment('2017-01-25').utc().format();
        let aux = JSON.stringify({tipo_relatorio: "comparacao", inicial: inicial, final: final});
        let p = CaixasDashboard.comparacao({
            teste: aux
        }).$promise;

        p.then(function (data) {
            criaGraficos(data.caixas);
        });

        p.catch(function (errorMessage) {
            popToaster(errorMessage);
        });
    }();

    function criaGraficos(data) {
        data.forEach(function (elem) {
            graf1.push([new Date(elem.data_caixa).getTime(), elem.entradas.vendas.total]);
        });
        graf1.sort();
        dataset[0].data = graf1;
    }


    let dataset = [
        {
            label: "Faturamento",
            grow:{stepMode:"linear"},
            data: '',
            color: "#1ab394",
            bars: {
                show: true,
                align: "center",
                barWidth: 24 * 60 * 60 * 600,
                lineWidth: 0
            }

        },
        {
            label: "Payments",
            grow:{stepMode:"linear"},
            data: '',
            yaxis: 2,
            color: "#1C84C6",
            lines: {
                lineWidth: 1,
                show: true,
                fill: true,
                fillColor: {
                    colors: [
                        {
                            opacity: 0.2
                        },
                        {
                            opacity: 0.2
                        }
                    ]
                }
            }
        }
    ];


    let options = {
        grid: {
            hoverable: true,
            clickable: true,
            tickColor: "#d5d5d5",
            borderWidth: 0,
            color: '#d5d5d5'
        },
        colors: ["#1ab394", "#464f88"],
        tooltip: true,
        xaxis: {
            mode: "time",
            tickSize: [1, "day"],
            tickLength: 0,
            axisLabel: "Date",
            axisLabelUseCanvas: true,
            axisLabelFontSizePixels: 12,
            axisLabelFontFamily: 'Arial',
            axisLabelPadding: 10,
            color: "#d5d5d5"
        },
        yaxes: [
            {
                position: "left",
                max: 3000,
                color: "#d5d5d5",
                axisLabelUseCanvas: true,
                axisLabelFontSizePixels: 12,
                axisLabelFontFamily: 'Arial',
                axisLabelPadding: 3
            },
            {
                position: "right",
                color: "#d5d5d5",
                axisLabelUseCanvas: true,
                axisLabelFontSizePixels: 12,
                axisLabelFontFamily: ' Arial',
                axisLabelPadding: 67
            }
        ],
        legend: {
            noColumns: 1,
            labelBoxBorderColor: "#d5d5d5",
            position: "nw"
        }

    };

    function gd(year, month, day) {
        return new Date(year, month - 1, day).getTime();
    }

    /**
     * Definition of letiables
     * Flot chart
     */
    this.flotData = dataset;
    this.flotOptions = options;


}]);