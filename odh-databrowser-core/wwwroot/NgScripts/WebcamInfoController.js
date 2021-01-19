var app = angular.module('webcam', ['ui.bootstrap', 'ngSanitize', 'appconfig', 'textAngular', 'appfactory', 'leaflet-directive']);

app.controller('webcamListController', [
    '$scope', '$http', '$modal', 'appconfig', 'leafletData', 'leafletmapsimple', 'languageFactory',
    function ($scope, $http, $modal, config, leafletData, leafletmapsimple, languageFactory) {

        $scope.basePath = config.basePath;
        $scope.lang = languageFactory.getLanguage();

        $scope.init = function () {
            $scope.changePage(0);
        };

        $scope.editwebcam = function (webcam) {

            if (webcam === 'new') {

                $scope.newwebcam = true;
                $scope.webcam = {
                    Id: '', Shortname: '', Source: 'Content', GpsInfo: { Gpstype : 'position' } };

                var modalInstance = $modal.open({
                    templateUrl: 'myWebcamModal.html',
                    controller: WebcamModalInstanceCtrl,
                    scope: $scope,
                    //size: 'lg',
                    windowClass: 'modal-wide',
                    backdrop: 'static'
                });
            }
            else {
                $scope.newwebcam = false;

                $scope.webcam = webcam;

                var modalInstance = $modal.open({
                    templateUrl: 'myWebcamModal.html',
                    controller: WebcamModalInstanceCtrl,
                    scope: $scope,
                    //size: 'lg',
                    windowClass: 'modal-wide',
                    backdrop: 'static'
                });
            }
            
        };

        $scope.deletewebcam = function (id) {

            var deleteconfirm = confirm('Are you absolutely sure you want to delete?');

            if (deleteconfirm) {
                $http.delete($scope.basePath + '/v1/WebcamInfo/' + id).success(function (result) {
                    alert("Webcam deleted!");

                    $scope.applyFilter($scope.page);
                });
            }
        };

        $scope.updatewebcam = function (id) {

            $scope.isloading = true;
            $http.get($scope.basePath + '/v1/WebcamInfo/' + id).success(function (result) {

                //noamol filter ausfiahrn
                $scope.applyFilter($scope.page);

            }).error(function (data) {
                alert("ERROR:" + data);
            });

        };

        $scope.page = 1;
        $scope.totalpages = 0;
        $scope.totalcount = 0;
        $scope.Seed = 'null';
        $scope.filtered = false;

        $scope.SelectedWebcamName = '';
        $scope.SelectedWebcamId = '';        

        $scope.webcamidfilter = 'null';        
        $scope.active = 'null';
        $scope.smgactive = 'null';
        $scope.source = 'null';

        //Filter anwenden
        $scope.applyFilter = function (page, withoutrefresh) {

            $scope.isloading = true;
            $scope.page = page;            
           
            if ($scope.SelectedWebcamId != '')
                $scope.webcamidfilter = $scope.SelectedWebcamId;
      
            $http.get($scope.basePath + '/v1/WebcamInfo?pagenumber=' + $scope.page + '&pagesize=20&source=' + $scope.source + '&idlist=' + $scope.webcamidfilter + '&active=' + $scope.active + '&odhactive=' + $scope.smgactive + '&seed=' + $scope.Seed).success(function (result) {
                $scope.webcams = result.Items;
                $scope.totalpages = result.TotalPages;
                $scope.totalcount = result.TotalResults;
                $scope.Seed = result.Seed;
                $scope.isloading = false;
                $scope.filtered = true;
            });

            if (withoutrefresh != true)
                $scope.$broadcast('LoadWebcamNamesList');
        }

        //Filter Löschen
        $scope.clearFilter = function () {
            $scope.SelectedWebcamName = '';
            $scope.SelectedWebcamId = '';

            $scope.webcamidfilter = 'null';
        
            $scope.active = 'null';
            $scope.smgactive = 'null';
            $scope.source = 'null';

          
            $scope.page = 1;
            $scope.filtered = false;
            $scope.changePage(0);
            
            $scope.$broadcast('LoadWebcamNamesList');
        }

        //Clear single Filters
        $scope.clearNameFilter = function () {
            $scope.SelectedWebcamName = '';
            $scope.SelectedWebcamId = '';
            $scope.webcamidfilter = 'null';
            $scope.page = 1;
            $scope.applyFilter(0);

            $scope.$broadcast('LoadWebcamNamesList');
        }
   
        $scope.clearActiveFilter = function () {

            $scope.smgactive = 'null';

            $scope.page = 1;
            $scope.changePage(0);

            $scope.$broadcast('LoadWebcamNamesList');
        }

        $scope.clearTICActiveFilter = function () {

            $scope.active = 'null';

            $scope.page = 1;
            $scope.changePage(0);

            $scope.$broadcast('LoadWebcamNamesList');
        }

        $scope.clearSourceFilter = function () {

            $scope.source = 'null';

            $scope.page = 1;
            $scope.changePage(0);

            $scope.$broadcast('LoadWebcamNamesList');
        }

        //Seite Wechseln
        $scope.changePage = function (pageskip) {

            $scope.page = $scope.page + pageskip;
            $scope.isloading = true;

            $scope.applyFilter($scope.page, true);           
        }        

        //Modal anzeigen
        $scope.showInfoModal = function (webcam) {            

            //Test nochmaliger Request auf Detail
            $http.get($scope.basePath + '/v1/WebcamInfo/' + webcam.Id).success(function (result) {
                $scope.webcam = result;
                $scope.isloading = false;

                var passedgps = [];

                if ($scope.webcam.GpsInfo && $scope.webcam.GpsInfo.Latitude && $scope.webcam.GpsInfo.Longitude) {

                    passedgps.push({ Gpstype: 'position', Latitude: $scope.webcam.GpsInfo.Latitude, Longitude: $scope.webcam.GpsInfo.Longitude });
                    leafletmapsimple.preparemap(passedgps, null, ['position'], 'webcamListController');
                }
                
                var slidemodalInstance = $modal.open({
                    templateUrl: 'myWebcamInfoModal.html',
                    controller: InfoModalInstanceCtrl,
                    scope: $scope,
                    size: 'lg'
                });
            });            
        };

        $scope.webcams = [];
    }]);

//Modal Controller
var WebcamModalInstanceCtrl = function ($scope, $modalInstance, $http) {

    $scope.ok = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.addwebcam = function (webcam, isvalid) {

        if (isvalid) {

            $http.post($scope.basePath + '/v1/WebcamInfo', webcam).success(function (result) {
                alert("Webcam added!");
                $scope.webcams.push(webcam);

                $modalInstance.close();
            });
        }
        else {
            alert("Invalid Data!");
        }
    };

    $scope.updatewebcam = function (webcam, isvalid) {

        if (isvalid) {
            $http.put($scope.basePath + '/v1/WebcamInfo/' + webcam.Id, webcam).success(function (result) {
                alert("Webcam updated!");
                $modalInstance.close();
            });
        }
        else {
            alert("Invalid Data!");
        }
    };
};

//Modal Slideshow Controller
var InfoModalInstanceCtrl = function ($scope, $modalInstance, $http) {
    $scope.ok = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.cancelmodal = function () {
        $modalInstance.dismiss('cancel');
    };
}

//TODO REWRITE!!!

var webcamtypeaheadcontroller = app.controller('WebcamTypeAheadController', function ($scope, $http) {

    $scope.webcamtypeaheadselected = false;

    $scope.getWebcamFilteredList = function (lang, active, smgactive, source) {
        
            $http({
                method: 'Get',
                url: $scope.basePath + '/v1/WebcamInfoReduced?language=' + lang + '&active=' + active + '&odhactive=' + smgactive + '&source=' + source
                //url: '/json/' + $scope.activitytype + 'Info.json'
            }).success(function (data) {
                $scope.items = data;
            });       
    }

    $scope.$on('LoadWebcamNamesList', function (e) {
        
        $scope.getWebcamFilteredList($scope.lang, $scope.active, $scope.smgactive, $scope.source);
    });   

    $scope.getWebcamFilteredList($scope.lang, $scope.active, $scope.smgactive, $scope.source);

    $scope.onItemSelected = function () {
        $scope.webcamtypeaheadselected = true;
    }
});

//Directive Typeahead
app.directive('typeaheadwebcam', function ($timeout) {
    return {
        restrict: 'AEC',
        scope: {
            items: '=',
            prompt: '@',
            title: '@',
            name: '@',
            model: '=',
            submodel: '=',
            idmodel: '=',
            onSelect: '&'
        },
        link: function (scope, elem, attrs) {
            scope.handleSelection = function (selectedItem, selectedId) {
                //alert(selectedItem + selectedTyp + selectedId);

                scope.model = selectedItem;                
                scope.idmodel = selectedId;
                scope.current = 0;
                scope.selected = true;
                $timeout(function () {
                    scope.onSelect();
                }, 200);
            };
            scope.current = 0;
            scope.selected = true;
            scope.isCurrent = function (index) {
                return scope.current == index;
            };
            scope.setCurrent = function (index) {
                scope.current = index;
            };
        },
        templateUrl: function (elem, attrs) {
            //alert(attrs.templateurl);
            return attrs.templateurl || 'default.html'
        }
        //templateUrl: 'HuetteTemplate2'
    }
});

app.filter('moment', function () {
    return function (dateString, format) {
        return moment(dateString).format(format);
    };
});