var app = angular.module('weathersiag', ['ui.bootstrap', 'appconfig', 'appfactory']);

app.controller('weathersiagListController', [
    '$scope', '$http', '$modal', 'appconfig', 'languageFactory',
    function ($scope, $http, $modal, config, languageFactory) {

        $scope.basePath = config.basePath;
        $scope.lang = languageFactory.getLanguage();                
        $scope.weather = [];
        $scope.districtweather = [];
        $scope.realtimeweather = [];
        var allowedlanguages = ['de', 'it', 'en'];        

        $scope.init = function (type) {
            //This function is sort of private constructor for controller            
            //$scope.elementstotake = elementstotake;            
            $scope.type = type;

            //fallback if language is not available here set it back to browserlanguage
            if (!allowedlanguages.includes($scope.lang)) {
                $scope.lang = 'en';
            }

            if (type == 'weather')
                $scope.getWeather();
            if (type == 'districtweather')
                $scope.getDistrictWeather();
            if (type == 'realtimeweather')
                $scope.getRealtimeWeather();
        };
        
        //Get WEATHER
        $scope.getWeather = function () {
            $scope.isloading = true;

            $http.get($scope.basePath + '/api/Weather?language=' + $scope.lang).success(function (result) {

                $scope.weather = result;
                $scope.isloading = false;
            });
        }

        //Get WEATHER DISTRICT
        $scope.getDistrictWeather = function () {
            $scope.isloading = true;
            $scope.districtweather = [];

            for (i = 1; i < 8; i++) {
                $http.get($scope.basePath + '/api/Weather/District?language=' + $scope.lang + '&locfilter=' + i).success(function (result) {

                    $scope.districtweather.push(result);
                    
                    $scope.isloading = false;
                    
                });
            }            
        }

        //Get WEATHER DISTRICT
        $scope.getRealtimeWeather = function () {
            $scope.isloading = true;
            $scope.realtimeweather = [];

            
            $http.get($scope.basePath + '/api/Weather/WeatherRealtime/' + $scope.lang).success(function (result) {

                $scope.realtimeweather = result;
                $scope.isloading = false;

                });
        }

        $scope.changeLanguage = function () {

            languageFactory.setLanguage($scope.lang);
            console.log(languageFactory.getLanguage());

            if ($scope.type == 'weather')
                $scope.getWeather();
            if ($scope.type == 'districtweather')
                $scope.getDistrictWeather();
            if ($scope.type == 'realtimeweather')
                $scope.getRealtimeWeather();
        };

        //Modal mit DetailInfo anzeigen
        $scope.showInfoModal = function (districtforecast) {

            $scope.districtforecast = districtforecast;

            var InfoModalInstance = $modal.open({
                templateUrl: 'WeatherInfoModal.html',
                controller: InfoModalInstanceCtrl,
                scope: $scope,
                size: 'lg'
            });
        };
    }]);

//Modal Slideshow Controller
var InfoModalInstanceCtrl = function ($scope, $modalInstance, $http) {

    $scope.cancelInfoModal = function () {
        $modalInstance.dismiss('cancel');
    };
}

app.filter('moment', function () {
    return function (dateString, format) {
        return moment(dateString).format(format);
    };
});