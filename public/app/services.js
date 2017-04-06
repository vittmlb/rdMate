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
            remove: ngAudio.load('sounds/click_remove.wav')
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

// function MySweetAlert ($scope) {
//
//     let p = swal({
//         title: 'Are you sure?',
//         text: "You won't be able to revert this!",
//         type: 'warning',
//         showCancelButton: true,
//         confirmButtonColor: '#3085d6',
//         cancelButtonColor: '#d33',
//         confirmButtonText: 'Yes, delete it!'
//     });
//
//     return p;
//
//     // let p = swal({
//     //     title: 'Are you sure?',
//     //     text: "You won't be able to revert this!",
//     //     type: 'warning',
//     //     showCancelButton: true,
//     //     confirmButtonColor: '#3085d6',
//     //     cancelButtonColor: '#d33',
//     //     confirmButtonText: 'Yes, delete it!'
//     // }).then(function () {
//     //     caixa._id = '58e2b7f129b96efc39be6d7z';
//     //     let p = $scope.delete(caixa);
//     //     p.then(function(data) {
//     //         alert(data);
//     //     });
//     //     p.catch(function(errorResponse) {
//     //         $scope.popToaster(errorResponse);
//     //     });
//     //
//     // }).catch(function (alow) {
//     //     alert(alow);
//     // });
//
// }