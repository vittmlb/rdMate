/**
 * Created by Vittorio on 04/04/2017.
 */
angular.module('admin_panel').factory('MySweetAlert', [function () {
    function MySweetAlert ($scope) {

        let p = swal({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        });

        return p;

        // let p = swal({
        //     title: 'Are you sure?',
        //     text: "You won't be able to revert this!",
        //     type: 'warning',
        //     showCancelButton: true,
        //     confirmButtonColor: '#3085d6',
        //     cancelButtonColor: '#d33',
        //     confirmButtonText: 'Yes, delete it!'
        // }).then(function () {
        //     caixa._id = '58e2b7f129b96efc39be6d7z';
        //     let p = $scope.delete(caixa);
        //     p.then(function(data) {
        //         alert(data);
        //     });
        //     p.catch(function(errorResponse) {
        //         $scope.popToaster(errorResponse);
        //     });
        //
        // }).catch(function (alow) {
        //     alert(alow);
        // });

    }

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