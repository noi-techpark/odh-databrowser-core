var app = angular.module('smgtagging', ['ui.bootstrap', 'appconfig', 'pathconfig']);

app.controller('smgtagListController', [
    '$scope', '$http', '$modal', 'appconfig', 'apipath',
    function ($scope, $http, $modal, appconfig, apipath) {

        $scope.basePath = apipath;

        $scope.lang = 'de';       
        $scope.smgtags = [];

        //$scope.checkEntityModel = {
        //    Gastronomy: false,
        //    Activity: false,
        //    Poi: false,
        //    Accommodation: false,
        //    Event: false,
        //    Article: false           
        //};

        $scope.editsmgtag = function (smgtag) {

            if (smgtag === 'new') {

                $scope.newsmgtag = true;
                $scope.smgtag = { Id: '', Shortname: '', _Meta: { Id: '', Type: 'odhtag', Source: 'noi' } };
            }
            else {
                $scope.newsmgtag = false;
                $scope.smgtag = smgtag;
            }

            var modalInstance = $modal.open({
                templateUrl: 'mySmgTagModal.html',
                controller: SmgTagModalInstanceCtrl,
                scope: $scope,
                size: 'md',
                backdrop: 'static'
            });
        };

        $scope.deletesmgtag = function (id) {

            var deleteconfirm = confirm('Are you absolutely sure you want to delete?');

            if (deleteconfirm) {

                $http.delete($scope.basePath + '/v1/SmgTag/' + id).success(function (result) {
                    alert("SmgTag deleted!");

                    $.each($scope.smgtags, function (i) {
                        if ($scope.smgtags[i].Id === id) {
                            $scope.smgtags.splice(i, 1);
                            return false;
                        }
                    });
                }).error(function (data) {
                    alert("ERROR:" + data);
                });
            }
        };
              
        //Initial Get
        $scope.loadData = function () {

            $scope.isloading = true;

            $http.get($scope.basePath + '/v1/SmgTag').success(function (result) {
               
                $scope.smgtags = result;
                $scope.isloading = false;
            });
        };

        //Modal anzeigen
        $scope.showInfoModal = function (smgtag) {

            $scope.smgtag = smgtag;

            var slidemodalInstance = $modal.open({
                templateUrl: 'mySmgTagInfoModal.html',
                controller: InfoModalInstanceCtrl,
                scope: $scope,
                size: 'lg'
            });
        };
        
        $scope.loadData();
    }]);

//Modal Controller
var SmgTagModalInstanceCtrl = function ($scope, $modalInstance, $http) {

    $scope.ok = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.addsmgtag = function (smgtag, isvalid) {

        if (isvalid) {

            $http.post($scope.basePath + '/v1/SmgTag', smgtag).success(function (result) {
                alert("SmgTag added!");
                $scope.smgtags.push(smgtag);

                $modalInstance.close();
            });
        }
        //else {
        //    alert("Invalid Data!");
        //}
    };

    $scope.updatesmgtag = function (smgtag, isvalid) {

        if (isvalid) {
            $http.put($scope.basePath + '/v1/SmgTag/' + smgtag.Id, smgtag).success(function (result) {
                alert("SmgTag updated!");
                $modalInstance.close();
            });
        }
        //else {
        //    alert("Invalid Data!");
        //}
    };    

    $scope.addentity = function (entityname) {

       

        if (entityname != undefined && entityname != '') {
            if ($scope.smgtag.ValidForEntity == null) {
                $scope.smgtag.ValidForEntity = [];
            }

            var addtoentitylist = true;

            $.each($scope.smgtag.ValidForEntity, function (i) {
                if ($scope.smgtag.ValidForEntity[i] === entityname) {
                    addtoentitylist = false;
                    alert('Entity already assigned');
                }
            });

            if (addtoentitylist)
                $scope.smgtag.ValidForEntity.push(entityname);
        }
    };

    $scope.removeentity = function (entityname) {

        //alert(entityname);

        $.each($scope.smgtag.ValidForEntity, function (i) {
            if ($scope.smgtag.ValidForEntity[i] === entityname) {
                $scope.smgtag.ValidForEntity.splice(i, 1);
                return false;
            }
        });
    };

};

//Modal Slideshow Controller
var InfoModalInstanceCtrl = function ($scope, $modalInstance, $http) {

    $scope.cancelslidemodal = function () {        
        $modalInstance.dismiss('cancel');
    };   
}

