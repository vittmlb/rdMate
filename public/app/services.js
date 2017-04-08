/**
 * Created by Vittorio on 04/04/2017.
 */
angular.module('admin_panel').factory('MySweetAlert', [function () {

    let def = {
        title: 'Tem certeza?',
        text: "Essa operação não poderá ser desfeita!",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        cancelButtonText: 'Cancelar',
        confirmButtonText: 'Sim!'
    };

    let params = {};

    return {
        set: {
            title: function(title) {
                def.title = title;
            },
            text: function(text) {
                def.text = text;
            },
            type: function(type) {
                def.type = type;
            },
            confirmButtonText: function(confirmButtonText) {
                def.confirmButtonText = confirmButtonText;
            },
            cancelButtonText: function(cancelButtonText) {
                def.cancelButtonText = cancelButtonText;
            }
        },
        config: function(config) {
            if(!config) {
                params = def;
            } else {
                params = config;
            }
        },
        deleteAlert: function() {
            if(!Object.keys(params).length) {
                params = def;
            }
            return swal(params);
        }
    }

}]);
angular.module('admin_panel').factory('MyDefineClass', [function () {

    function diferenca(item) {
        if(item >= 0) {
            if(item === 0) return 'text-success';
            return 'text-warning';
        } else {
            return 'text-danger';
        }
    }

    function turnoIcon(item) {
        if(item === 'Manhã') return 'fa fa-coffee';
        return 'fa fa-sun-o';
    }

    function bandeiraIcon(item) {
        if(item === 'Visa') return 'fa fa-cc-visa';
        return 'fa fa-cc-mastercard';
    }

    function origemIcon(item) {
        if(item === 'Cofre') return 'fa fa-lock';
        return 'fa fa-unlock';
    }

    function strikeThrough(condition) {
        return condition ? 'text-strikethrough': ''
    }





    return {
        diferenca: function(item) {
            return diferenca(item);
        },
        strikeThrough: function(condition) {
            return strikeThrough(condition);
        },
        turnoIcon: function(turno) {
            return turnoIcon(turno);
        },
        bandeiraIcon: function(bandeira) {
            return bandeiraIcon(bandeira);
        },
        origemIcon: function(origem) {
            return origemIcon(origem);
        }
    }

}]);
angular.module('admin_panel').factory('MyAudio', ['ngAudio', function (ngAudio) {

    let sounds = {
        click: {
            add: ngAudio.load('sounds/click_add.mp3'),
            remove: ngAudio.load('sounds/click_remove.mp3'),
            check: ngAudio.load('sounds/click_check.mp3'),
        }
    };

    let teste = ngAudio.load('sounds/click_add.mp3');

    return {
        play: function(tipo) {
            switch (tipo) {
                case 'add':
                    sounds.click.add.play();
                    break;
                case 'remove':
                    sounds.click.remove.play();
                    break;
                case 'check':
                    sounds.click.check.play();
            }
        },
        add: function() {
            sounds.click.add.play();
        },
        remove: function() {
            sounds.click.remove.play();
        }
    }
}]);

angular.module('admin_panel').factory('MyFlot', [function () {

    let data1 = [
        [gd(2012, 1, 1), 7],
        [gd(2012, 1, 2), 6],
        [gd(2012, 1, 3), 4],
        [gd(2012, 1, 4), 8],
        [gd(2012, 1, 5), 9],
        [gd(2012, 1, 6), 7],
        [gd(2012, 1, 7), 5],
        [gd(2012, 1, 8), 4],
        [gd(2012, 1, 9), 7],
        [gd(2012, 1, 10), 8],
        [gd(2012, 1, 11), 9],
        [gd(2012, 1, 12), 6],
        [gd(2012, 1, 13), 4],
        [gd(2012, 1, 14), 5],
        [gd(2012, 1, 15), 11],
        [gd(2012, 1, 16), 8],
        [gd(2012, 1, 17), 8],
        [gd(2012, 1, 18), 11],
        [gd(2012, 1, 19), 11],
        [gd(2012, 1, 20), 6],
        [gd(2012, 1, 21), 6],
        [gd(2012, 1, 22), 8],
        [gd(2012, 1, 23), 11],
        [gd(2012, 1, 24), 13],
        [gd(2012, 1, 25), 7],
        [gd(2012, 1, 26), 9],
        [gd(2012, 1, 27), 9],
        [gd(2012, 1, 28), 8],
        [gd(2012, 1, 29), 5],
        [gd(2012, 1, 30), 8],
        [gd(2012, 1, 31), 25]
    ];

    function dataSet() {
        return [
            {
                label: "Number of orders",
                grow:{stepMode:"linear"},
                data: data2,
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
                data: data1,
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
    }
    function dataOptions() {
        return  {
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
                tickSize: [3, "day"],
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
                    max: 1070,
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
    }

    let data2 = [
        [gd(2012, 1, 1), 800],
        [gd(2012, 1, 2), 500],
        [gd(2012, 1, 3), 600],
        [gd(2012, 1, 4), 700],
        [gd(2012, 1, 5), 500],
        [gd(2012, 1, 6), 456],
        [gd(2012, 1, 7), 800],
        [gd(2012, 1, 8), 589],
        [gd(2012, 1, 9), 467],
        [gd(2012, 1, 10), 876],
        [gd(2012, 1, 11), 689],
        [gd(2012, 1, 12), 700],
        [gd(2012, 1, 13), 500],
        [gd(2012, 1, 14), 600],
        [gd(2012, 1, 15), 700],
        [gd(2012, 1, 16), 786],
        [gd(2012, 1, 17), 345],
        [gd(2012, 1, 18), 888],
        [gd(2012, 1, 19), 888],
        [gd(2012, 1, 20), 888],
        [gd(2012, 1, 21), 987],
        [gd(2012, 1, 22), 444],
        [gd(2012, 1, 23), 999],
        [gd(2012, 1, 24), 567],
        [gd(2012, 1, 25), 786],
        [gd(2012, 1, 26), 666],
        [gd(2012, 1, 27), 888],
        [gd(2012, 1, 28), 900],
        [gd(2012, 1, 29), 178],
        [gd(2012, 1, 30), 555],
        [gd(2012, 1, 31), 993]
    ];


    let dataset = [
        {
            label: "Number of orders",
            grow:{stepMode:"linear"},
            data: data2,
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
            data: data1,
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
            tickSize: [3, "day"],
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
                max: 1070,
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
    // this.flotData = dataset;
    // this.flotOptions = options;

    return {
        flotData: function() {
            return dataSet();
        },
        flotOptions: function() {
            return dataOptions();
        }
    }

}]);