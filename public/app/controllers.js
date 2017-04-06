/**
 * Created by Vittorio on 16/08/2016.
 */



function ModalInstanceCtrl ($scope, $modalInstance) {

    $scope.ok = function () {
        $modalInstance.close();
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

}


angular
    .module('admin_panel')
    .controller('ModalInstanceCtrl', ModalInstanceCtrl);