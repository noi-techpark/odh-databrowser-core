var app = angular.module('licenseinfo', ['ui.bootstrap', 'appconfig', 'textAngular', 'pathconfig']);

app.controller('licenseInfoController', [
    '$scope', '$http', '$modal', 'appconfig', 'apipath',
    function ($scope, $http, $modal, config, apipath) {

        $scope.basePath = apipath;

        $scope.init = function () {
			$scope.getdata();
        };

		//Filter anwenden
        $scope.getdata = function () {

			$http.get($scope.basePath + '/v1/LicenseCount').success(function (result) {
				$scope.licenseinforesult = result;
				$scope.isloading = false;
			});
		}

		$scope.licenseinforesult = {};

	}]);

