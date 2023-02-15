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

    $scope.mappingproperty = {};

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
      
    $scope.addpublishedonchannel = function (publishchannel) {

        if (publishchannel != "" && publishchannel != undefined) {

            var addToArray = true;

            if ($scope.common.PublishedOn != null) {

                $.each($scope.common.PublishedOn, function (i) {

                    if ($scope.common.PublishedOn[i] === publishchannel) {

                        alert('Already present!');
                        addToArray = false;

                        return false;
                    }
                });
            }
            else {
                $scope.common.PublishedOn = [];
            }


            if (addToArray) {

                $scope.common.PublishedOn.push(publishchannel);
            }
        }
        else {
            alert('Invalid publishchannel!');
        }
    }

    //Remove SMG Tagging
    $scope.deletepublishedonchannel = function (publishchannel) {
        //alert(tag);
        $.each($scope.common.PublishedOn, function (i) {
            if ($scope.common.PublishedOn[i] === publishchannel) {
                $scope.common.PublishedOn.splice(i, 1);
                return false;
            }
        });
    }

    //Add Mapping Manually
    $scope.addmapping = function () {

        if ($scope.mappingproperty.Name != '' && $scope.mappingproperty.Value != '' && $scope.mappingproperty.Mappingkey != '') {
            var addToArray = true;

            var provider = $scope.mappingproperty.Mappingkey;

            if ($scope.common.Mapping == null || $scope.common.Mapping == undefined) {
                $scope.common.Mapping = {};
            }

            if ($scope.common.Mapping[provider] == null || $scope.common.Mapping[provider] == undefined) {

                $scope.common.Mapping[provider] = {};
            }

            if ($scope.common.Mapping[provider] != null) {

                //If value is present it will be overwritten....
                Object.keys($scope.common.Mapping[provider]).forEach(function (key) {

                    console.log(key, $scope.common.Mapping[provider][key]);
                });
            }


            if (addToArray) {
                //var property = { Name: $scope.mappingproperty.Name, Value: $scope.mappingproperty.Value };

                //$scope.common.Mapping[provider].push(property);

                var dicttoadd = {};

                if ($scope.common.Mapping[provider] != null && $scope.common.Mapping[provider] != undefined)
                    dicttoadd = $scope.common.Mapping[provider];

                dicttoadd[$scope.mappingproperty.Name] = $scope.mappingproperty.Value;

                $scope.common.Mapping[provider] = dicttoadd;

                console.log($scope.common.Mapping);

                $scope.mappingproperty.Name = '';
                $scope.mappingproperty.Value = '';
            }
        }
    }

    //Remove Maping
    $scope.deletemapping = function (mapping, provider) {

        if (mapping == 'all') {

            var deleteconfirm = confirm('Are you sure you want to delete all keys from ' + provider);

            if (deleteconfirm) {

                delete $scope.common.Mapping[provider];
            }
        }
        else {

            delete $scope.common.Mapping[provider][mapping];

            //$.each($scope.common.Mapping[provider], function (i) {
            //    if ($scope.common.Mapping[provider][i].Name === mapping) {
            //        $scope.common.Mapping[provider].splice(i, 1);
            //        return false;
            //    }
            //});
        }
    }
   
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