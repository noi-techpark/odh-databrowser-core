var app = angular.module('weather', ['ui.bootstrap', 'appconfig', 'appfactory', 'leaflet-directive', 'pathconfig']);

app.controller('weatherListController', [
    '$scope', '$http', '$modal', 'appconfig', 'leafletData', 'leafletmapsimple', 'languageFactory', 'apipath',
    function ($scope, $http, $modal, appconfig, leafletData, leafletmapsimple, languageFactory, apipath) {

        $scope.basePath = apipath;
        $scope.lang = languageFactory.getLanguage(); 
        $scope.commontype = '';
        $scope.elementstotake = '';
        $scope.commons = [];

        var allowedlanguages = ['de', 'it', 'en'];

        $scope.init = function (commontype, elementstotake) {
            //This function is sort of private constructor for controller            
            $scope.elementstotake = elementstotake;
            $scope.commontype = commontype;

            //fallback if language is not available here set it back to browserlanguage
            if (!allowedlanguages.includes($scope.lang)) {
                $scope.lang = 'en';
            }

            $scope.getCommons();
        };

        $scope.changeLanguage = function () {

            languageFactory.setLanguage($scope.lang);            
        };

        $scope.editCommon = function (common) {

            if (common === 'new') {

                $scope.newcommon = true;
                $scope.common = { Id: '', Shortname: '' };
            }
            else {
                $scope.newcommon = false;
                $scope.common = common;
            }

            var modalInstance = $modal.open({
                templateUrl: 'CommonCrudModal.html',
                controller: CrudModalInstanceCtrl,
                scope: $scope,
                size: 'lg',
                backdrop: 'static'
            });
        };

        $scope.deleteCommon = function (id) {

            var deleteconfirm = confirm('Are you absolutely sure you want to delete?');

            if (deleteconfirm) {
                $http.delete($scope.basePath + '/v1/' + commontype + '/' + id).success(function (result) {
                    alert(commontype + " deleted!");

                    $.each($scope.commons, function (i) {
                        if ($scope.commons[i].Id === id) {
                            $scope.commons.splice(i, 1);
                            return false;
                        }
                    });
                }).error(function (data) {
                    alert("ERROR:" + data);
                });
            }           
        };       

        //Get Request
        $scope.getCommons = function () {
            $scope.isloading = true;

            $http.get($scope.basePath + '/v1/Weather/Measuringpoint').success(function (result) {

                $scope.commons = result;

                $scope.isloading = false;
            });
        }
               
        //Modal mit DetailInfo anzeigen
        $scope.showInfoModal = function (common) {

            $scope.common = common;

            var passedgps = [];
            passedgps.push({ Gpstype: 'position', Latitude: $scope.common.Latitude, Longitude: $scope.common.Longitude });

            leafletmapsimple.preparemap(passedgps, null, ['position'], 'weatherListController');


            var InfoModalInstance = $modal.open({
                templateUrl: 'CommonInfoModal.html',
                controller: InfoModalInstanceCtrl,
                scope: $scope,
                size: 'lg'
            });
        };       
    }]);

//Modal Edit & New controller
var CrudModalInstanceCtrl = function ($scope, $modalInstance, $http) {

    $scope.ok = function () {
        //SAVEN
    };

    $scope.cancelCrudModal = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.addCrud = function (common, isvalid) {
        if (isvalid) {

            $http.post($scope.basePath + '/v1/Common/' + $scope.commontype, common).success(function (result) {
                alert($scope.commontype + " added!");
                $scope.activities.push(activity);

                $modalInstance.close();
            });
        }
        else {
            alert("Invalid Data!");
        }
    };

    $scope.updateCrud = function (common, isvalid) {
        if (isvalid) {
            $http.put($scope.basePath + '/v1/Common/' + $scope.commontype + '/' + common.Id, common).success(function (result) {
                alert($scope.commontype + " updated!");
                $modalInstance.close();
            });
        }
        else {
            alert("Invalid Data!");
        }
    };
      

   
}

//Modal Slideshow Controller
var InfoModalInstanceCtrl = function ($scope, $modalInstance, $http) {

    $scope.cancelInfoModal = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.myInterval = 5000;
    $scope.slides = $scope.common.ImageGallery;
}

app.filter('moment', function () {
    return function (dateString, format) {
        return moment(dateString).format(format);
    };
});