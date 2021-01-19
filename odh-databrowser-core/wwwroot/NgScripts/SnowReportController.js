var app = angular.module('snowreport', ['ui.bootstrap', 'appconfig', 'appfactory', 'leaflet-directive']);

app.controller('SnowreportListController', [
    '$scope', '$http', '$modal', 'appconfig', 'leafletData', 'leafletmapsimple', 'languageFactory',
    function ($scope, $http, $modal, config, leafletData, leafletmapsimple, languageFactory) {

        $scope.basePath = config.basePath;

        $scope.lang = languageFactory.getLanguage();        
        $scope.elementstotake = '';
        $scope.commons = [];

        var allowedlanguages = ['de', 'it', 'en'];


        $scope.init = function (elementstotake) {
            //This function is sort of private constructor for controller            
            $scope.elementstotake = elementstotake;

            //fallback if language is not available here set it back to browserlanguage
            if (!allowedlanguages.includes($scope.lang)) {
                $scope.lang = 'en';
            }

            $scope.getCommons();
        };
      
        //Get Request
        $scope.getCommons = function () {
            $scope.isloading = true;

            $http.get($scope.basePath + '/v1/Skiarea').success(function (result) {

                $scope.commons = result;
                $scope.isloading = false;
            });
        }
               
        //Modal mit DetailInfo anzeigen
        $scope.showInfoModal = function (common) {

            $scope.isloading = true;
            $scope.common = common;

            var passedgps = [];
            passedgps.push({ Gpstype: 'position', Latitude: $scope.common.Latitude, Longitude: $scope.common.Longitude });

            leafletmapsimple.preparemap(passedgps, null, ['position'], 'SnowreportListController');


            //Pisten laden, Lifte Laden, Skitracks laden, Slides Laden, Measuringpoints laden
            $http.get($scope.basePath + '/v1/Activity?pagenumber=1&pagesize=500&activitytype=512&areafilter=ska' + common.Id).success(function (result) {

                $scope.lifts = result.Items;
                $scope.loadedlift = true;
            });

            //Pisten laden, Lifte Laden, Skitracks laden, Slides Laden, Measuringpoints laden
            $http.get($scope.basePath + '/v1/Activity?pagenumber=1&pagesize=500&activitytype=256&areafilter=ska' + common.Id).success(function (result) {

                $scope.slopes = result.Items;
                $scope.loadedslope = true;
            });

            //Pisten laden, Lifte Laden, Skitracks laden, Slides Laden, Measuringpoints laden
            $http.get($scope.basePath + '/v1/Activity?pagenumber=1&pagesize=500&activitytype=128&areafilter=ska' + common.Id).success(function (result) {

                $scope.sledges = result.Items;
                $scope.loadedslide = true;
            });

            //Pisten laden, Lifte Laden, Skitracks laden, Slides Laden, Measuringpoints laden
            $http.get($scope.basePath + '/v1/Activity?pagenumber=1&pagesize=500&activitytype=64&areafilter=ska' + common.Id).success(function (result) {

                $scope.skitracks = result.Items;
                $scope.loadedskitrack = true;
            });


            //Measuringpoints laden

            $http.get($scope.basePath + '/v1/Weather/Measuringpoint?skiareafilter=' + common.Id).success(function (result) {

                $scope.measuringpoints = result;
                $scope.loadedmeasuringpoints = true;
            });

            //if ($scope.loadedlift && $scope.loadedslope && $scope.loadedslide && $scope.loadedskitrack)
            //{
            //    $scope.isloading = false;
            //}

            $scope.isloading = false;

            var InfoModalInstance = $modal.open({
                templateUrl: 'CommonInfoModal.html',
                controller: InfoModalInstanceCtrl,
                scope: $scope,
                size: 'lg'
            });
                        
        };

        $scope.showSkiMapModal = function (skimapurl) {
           
            $scope.skimapurl = skimapurl;

            //var InfoModalInstance = $modal.open({
            //    templateUrl: 'SkiMapModal.html',
            //    controller: SkiMapModalInstanceCtrl,
            //    scope: $scope,
            //    size: 'lg'
            //});

        };

        $scope.changeLanguage = function () {

            languageFactory.setLanguage($scope.lang);
            console.log(languageFactory.getLanguage());            
        };

    }]);


//Modal Slideshow Controller
var InfoModalInstanceCtrl = function ($scope, $modalInstance, $http) {

    $scope.cancelInfoModal = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.myInterval = 5000;
    $scope.slides = $scope.common.ImageGallery;    
}

//Modal Skimap Controller
var SkiMapModalInstanceCtrl = function ($scope, $modalInstance, $http) {

    $scope.cancelInfoModal = function () {
        $modalInstance.dismiss('cancel');
    };   
}

app.filter('moment', function () {
    return function (dateString, format) {
        return moment(dateString).format(format);
    };
});

app.filter('momenttime', function () {
    return function (timeString, length) {

        //alert(timeString);

        return timeString.substring(0, length);
    };
});