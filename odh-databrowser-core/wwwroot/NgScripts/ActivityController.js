var app = angular.module('activity', ['ui.bootstrap', 'ui-rangeSlider', 'ngSanitize', 'angularFileUpload', 'appconfig', 'appfactory', 'leaflet-directive']);

app.controller('activityListController', [
    '$scope', '$http', '$modal', 'appconfig', 'leafletData', 'leafletmapsimple', 'languageFactory', 'apipath',
    function ($scope, $http, $modal, config, leafletData, leafletmapsimple, languageFactory, apipath) {

        $scope.basePath = apipath;

        $scope.lang = languageFactory.getLanguage();             

        var allowedlanguages = ['de', 'it', 'en'];

        $scope.globallocfilter = '';
        $scope.globallocfilterName = '';
        $scope.globallocfilterId = '';
        $scope.globallocfilterType = '';

        $scope.init = function (activitytype, locfilter, locfiltertype) {
            //This function is sort of private constructor for controller            
            $scope.activitytype = activitytype;

            //fallback if language is not available here set it back to browserlanguage
            if (!allowedlanguages.includes($scope.lang)) {
                $scope.lang = 'en';
            }

            if (locfiltertype != "" && locfiltertype != undefined) {
                //$scope.hasfilteredlocations = true;
                //Des muassi no setzen
                //$scope.SelectedLocationName = 'Filtered';
                $scope.SelectedLocationTyp = locfiltertype;
                $scope.SelectedLocationId = locfilter;


                $scope.globallocfilterId = locfilter;
                $scope.globallocfilterType = locfiltertype;

                $scope.globallocfilter = locfiltertype + locfilter;
            }

            $scope.changePage(0);                                                          
        };

        $scope.changeLanguage = function () {

            languageFactory.setLanguage($scope.lang);
            console.log(languageFactory.getLanguage());

            //Reload Entire PAge (Hack)
            location.reload();    
        };

        $scope.editactivity = function (activity) {

            if (activity === 'new') {

                $scope.newactivity = true;
                $scope.activity = { Id: '', Shortname: '' };

                var modalInstance = $modal.open({
                    templateUrl: 'myActivityModal.html',
                    controller: ActivityModalInstanceCtrl,
                    scope: $scope,
                    //size: 'modal-wide',
                    windowClass: 'modal-wide',
                    backdrop: 'static'
                });
            }
            else {
                $scope.newactivity = false;

                $scope.activity = activity;

                var modalInstance = $modal.open({
                            templateUrl: 'myActivityModal.html',
                            controller: ActivityModalInstanceCtrl,
                            scope: $scope,
                    //size: 'lg',
                            windowClass: 'modal-wide',
                            backdrop: 'static'
                        });

                //Test nochmaliger Request auf Detail
                //$http.get($scope.basePath + '/v1/Activity/' + activity.Id).success(function (result) {
                //    $scope.activity = result;                    
                //    $scope.isloading = false;

                //    var modalInstance = $modal.open({
                //        templateUrl: 'myActivityModal.html',
                //        controller: ActivityModalInstanceCtrl,
                //        scope: $scope,
                //        size: 'lg',
                //        backdrop: 'static'
                //    });
                //});
            }            
        };       

        $scope.deleteactivity = function (id) {

            var deleteconfirm = confirm('Are you absolutely sure you want to delete?');

            if (deleteconfirm) {

                $http.delete($scope.basePath + '/v1/Activity/' + id).success(function (result) {
                    alert("Activity deleted!");

                    $.each($scope.activities, function (i) {
                        if ($scope.activities[i].Id === id) {
                            $scope.activities.splice(i, 1);
                            return false;
                        }
                    });
                }).error(function (data) {
                    alert("ERROR:" + data);
                });
            }
        };

        $scope.updateactivity = function (id) {

            $scope.isloading = true;
            $http.get($scope.basePath + '/v1/Update/Activity/' + $scope.activitytype + '/' + id).success(function (result) {

                console.log(result);
                $scope.isloading = false;
                alert(result);

                //noamol filter ausfiahrn
                $scope.applyFilter($scope.page);

            }).error(function (data) {
                alert("ERROR:" + data);
            });

        };

        //$scope.updateDatainList = function (activity) {

        //    $.each($scope.activities, function (i) {
        //        if ($scope.activities[i].Id === activity.Id) {
        //            $scope.activities[i] = activity;
        //            //alert("upgedated");
        //            return false;
        //        }
        //    });
        //}

        $scope.opentypeselectormodal = function (activity) {
            
            //alert($scope.basePath);

            //Test nochmaliger Request auf Detail
            $http.get($scope.basePath + '../api/SuedtirolType/GetMatchedSuedtirolType/ActivityData/' + activity.Type + '/' + activity.SubType + '/null').success(function (result) {
                $scope.matchingsuedtiroltype = result;
                $scope.isloading = false;

               
                $scope.typeselector.ActivityID = activity.Id;
                $scope.typeselector.Type = $scope.matchingsuedtiroltype[0];
                $scope.typeselector.SubType = $scope.matchingsuedtiroltype[1];
                $scope.typeselector.PoiType = $scope.matchingsuedtiroltype[2];

                $scope.typeselector.MatchedDistrict = '';

                //Wenn GPS Info vorhanden ist
                if (activity.GpsInfo != null) {
                    $.each(activity.GpsInfo, function (i) {
                        if (activity.GpsInfo[i].Gpstype == 'Standpunkt' || activity.GpsInfo[i].Gpstype == 'Startpunkt' || activity.GpsInfo[i].Gpstype == 'Start und Ziel') {
                            //alert('gpsinfo do');

                            $http.get($scope.basePath + '/v1/Common/GetNearestDistrict/' + activity.GpsInfo[i].Latitude + '/' + activity.GpsInfo[i].Longitude + '/10000').success(function (result) {

                                if (result != null) {
                                    //alert('district gfunden nome:' + result.Id);

                                    $scope.typeselector.MatchedDistrict = result.Id;
                                }

                            });
                        }
                    });

                }

                var modalInstance = $modal.open({
                    templateUrl: 'mySuedtirolTypeSelectorModal.html',
                    controller: SuedtirolTypeSelectorModalInstanceCtrl,
                    scope: $scope,
                    size: 'md',
                    backdrop: 'static'
                });
            });
            
        };

        $scope.typeselector = [];        

        $scope.page = 1;
        $scope.totalpages = 0;
        $scope.totalcount = 0;
        $scope.seed = 'null';
        $scope.filtered = false;               

        $scope.SelectedActivityName = '';
        $scope.SelectedActivityId = '';
        $scope.SelectedLocationName = '';
        $scope.SelectedLocationTyp = '';
        $scope.SelectedLocationId = '';
        //Nur für Skiarea
        $scope.SelectedSkiAreaName = '';
        $scope.SelectedSkiAreaTyp = '';
        $scope.SelectedSkiAreaIds = '';
                
        //SMG Tags
        $scope.SelectedSmgTagName = '';
        $scope.SelectedSmgTagId = '';
        $scope.smgtagfilter = 'null';

        $scope.activityidfilter = 'null';
        $scope.subtypefilter = 'null';
        $scope.difficultyfilter = 'null';
        $scope.locationfilter = 'null';
        $scope.areafilter = 'null';
        $scope.highlightfilter = 'null';

        $scope.highlight = false;

        $scope.active = 'null';
        $scope.smgactive = 'null';

        $scope.distancerangefilter = 'null';
        $scope.altituderangefilter = 'null';
        $scope.durationrangefilter = 'null';

        $scope.distancerange = { min: 0, max: 30 };
        $scope.altituderange = { min: 0, max: 3000 };
        $scope.durationrange = { min: 0, max: 10 };

        setSubTypeModel();

        //Filter anwenden
        $scope.applyFilter = function (page, withoutrefresh) {

            $scope.isloading = true;            
            $scope.page = page;
            
            setSubFilter();
                      
            if ($scope.SelectedActivityId != '')
                $scope.activityidfilter = $scope.SelectedActivityId;

            if ($scope.SelectedLocationId != '')
                $scope.locationfilter = $scope.SelectedLocationTyp + $scope.SelectedLocationId;

            if ($scope.SelectedSkiAreaIds != '')
                $scope.areafilter = $scope.SelectedSkiAreaTyp + $scope.SelectedSkiAreaIds

            //alert('/api/Activity/Filtered/' + $scope.page + '/20/' + $scope.activitytype + '/' + $scope.subtypefilter + '/' + myactivitynameIdfilter + '/' + $scope.locationfilter + '/' + $scope.seed);
            //alert($scope.arefilter);

            //console.log($scope.basePath + '/v1/Activity/Filtered/' + $scope.page + '/20/' + $scope.activitytype + '/' + $scope.subtypefilter + '/' + $scope.activityidfilter + '/' + $scope.locationfilter + '/' + $scope.areafilter + '/' + $scope.distancerangefilter + '/' + $scope.altituderangefilter + '/' + $scope.durationrangefilter + '/' + $scope.difficultyfilter + '/' + $scope.active + '/' + $scope.smgactive + '/' + $scope.smgtagfilter + '/' + $scope.seed);

            $http.get($scope.basePath + '/v1/Activity?pagenumber=' + $scope.page + '&pagesize=20&activitytype=' + $scope.activitytype + '&subtype=' + $scope.subtypefilter + '&idlist=' + $scope.activityidfilter + '&locfilter=' + $scope.locationfilter + '&areafilter=' + $scope.areafilter + '&distancefilter=' + $scope.distancerangefilter + '&altitudefilter=' + $scope.altituderangefilter + '&durationfilter=' + $scope.durationrangefilter + '&highlight=' + $scope.highlightfilter + '&difficultyfilter=' + $scope.difficultyfilter + '&active=' + $scope.active + '&odhactive=' + $scope.smgactive + '&odhtagfilter=' + $scope.smgtagfilter + '&seed=' + $scope.seed).success(function (result) {
                $scope.activities = result.Items;
                $scope.totalpages = result.TotalPages;
                $scope.totalcount = result.TotalResults;
                $scope.isloading = false;
                $scope.seed = result.Seed;
                $scope.filtered = true;
            });

            if (withoutrefresh != true)
                $scope.$broadcast('LoadPoiNamesList');
        }

        //Filter Löschen
        $scope.clearFilter = function () {
            $scope.SelectedActivityName = '';
            $scope.SelectedActivityId = '';

            if ($scope.globallocfilter == '') {
                $scope.SelectedLocationName = '';
                $scope.SelectedLocationTyp = '';
                $scope.SelectedLocationId = '';
                $scope.locationfilter = 'null';
            }
            else {
                $scope.SelectedLocationName = $scope.globallocfilterName;
                $scope.SelectedLocationTyp = $scope.globallocfilterType;
                $scope.SelectedLocationId = $scope.globallocfilterId;

                $scope.locationfilter = $scope.globallocfilter;
            }

            if (!isNaN($scope.activitytype))
                $scope.activitytype = '1023';


            $scope.SelectedSkiAreaName = '';
            $scope.SelectedSkiAreaTyp = '';
            $scope.SelectedSkiAreaIds = '';
            $scope.subtypefilter = 'null';
            //$scope.locationfilter = 'null';
            $scope.areafilter = 'null';
            $scope.activityidfilter = 'null';
            $scope.SelectedSmgTagName = '';
            $scope.SelectedSmgTagId = '';
            $scope.smgtagfilter = 'null';
            $scope.difficultyfilter = 'null';
            $scope.highlightfilter = 'null';
            $scope.highlight = false;

            $scope.active = 'null';
            $scope.smgactive = 'null';

            $scope.distancerange = { min: 0, max: 30 };
            $scope.altituderange = { min: 0, max: 10000 };
            $scope.durationrange = { min: 0, max: 10 };


            $.each($scope.checkDifficultyModel, function (i) {
                $scope.checkDifficultyModel[i] = false;
            });

            $.each($scope.checkSubTypeModel, function (i) {
                $scope.checkSubTypeModel[i] = false;
            });

            $scope.filtered = false;
            $scope.page = 1;
            $scope.changePage(0);
            //$scope.$broadcast('LoadPoiNamesList');
        }

        //Clear single Filters
        $scope.clearNameFilter = function () {
            $scope.SelectedActivityName = '';
            $scope.SelectedActivityId = '';
            $scope.activityidfilter = 'null';
            $scope.page = 1;
            $scope.changePage(0);

            //$scope.$broadcast('LoadPoiNamesList');
        }

        $scope.clearSkiAreaFilter = function () {
            $scope.SelectedSkiAreaName = '';
            $scope.SelectedSkiAreaTyp = '';
            $scope.SelectedSkiAreaIds = '';
            $scope.areafilter = 'null';
            $scope.page = 1;
            $scope.changePage(0);

            //$scope.$broadcast('LoadPoiNamesList');
        }

        $scope.clearLocationFilter = function () {

            $scope.SelectedLocationName = '';
            $scope.SelectedLocationTyp = '';
            $scope.SelectedLocationId = '';
            $scope.locationfilter = 'null';

            $scope.page = 1;
            $scope.changePage(0);

            //$scope.$broadcast('LoadPoiNamesList');
        }

        $scope.clearTagFilter = function () {
            $scope.SelectedSmgTagName = '';
            $scope.SelectedSmgTagId = '';
            $scope.smgtagfilter = 'null';
            $scope.page = 1;
            $scope.changePage(0);

            //$scope.$broadcast('LoadPoiNamesList');
        }

        $scope.clearHighlightFilter = function () {

            $scope.highlightfilter = 'null';

            $scope.page = 1;
            $scope.changePage(0);

            $scope.$broadcast('LoadPoiNamesList');
        }

        $scope.clearActiveFilter = function () {

            $scope.smgactive = 'null';

            $scope.page = 1;
            $scope.changePage(0);

            //$scope.$broadcast('LoadPoiNamesList');
        }

        $scope.clearTICActiveFilter = function () {

            $scope.active = 'null';

            $scope.page = 1;
            $scope.changePage(0);

            //$scope.$broadcast('LoadPoiNamesList');
        }

        $scope.clearTypeFilter = function () {

            $.each($scope.checkSubTypeModel, function (i) {
                $scope.checkSubTypeModel[i] = false;
            });

            //$scope.activitytype = '1023';

            $scope.page = 1;
            $scope.changePage(0);

            //$scope.$broadcast('LoadPoiNamesList');
        }

        $scope.clearMainTypeFilter = function () {

            $.each($scope.checkSubTypeModel, function (i) {
                $scope.checkSubTypeModel[i] = false;
            });

            $scope.activitytype = '1023';

            $scope.page = 1;
            $scope.changePage(0);

            //$scope.$broadcast('LoadPoiNamesList');
        }

        $scope.clearDifficultyFilter = function () {

            $.each($scope.checkDifficultyModel, function (i) {
                $scope.checkDifficultyModel[i] = false;
            });

            $scope.difficultyfilter = 'null';

            $scope.page = 1;
            $scope.changePage(0);

            //$scope.$broadcast('LoadPoiNamesList');
        }

        $scope.clearDistanceFilter = function () {

            $scope.distancerange = { min: 0, max: 30 };

            $scope.page = 1;
            $scope.changePage(0);

            //$scope.$broadcast('LoadPoiNamesList');
        }

        $scope.clearAltitudeFilter = function () {

            $scope.altituderange = { min: 0, max: 10000 };

            $scope.page = 1;
            $scope.changePage(0);

            //$scope.$broadcast('LoadPoiNamesList');
        }

        $scope.clearDurationFilter = function () {

            $scope.durationrange = { min: 0, max: 10 };

            $scope.page = 1;
            $scope.changePage(0);

            //$scope.$broadcast('LoadPoiNamesList');
        }

        //Seite Wechseln
        $scope.changePage = function (pageskip, withoutrefresh) {

            $scope.page = $scope.page + pageskip;
            $scope.isloading = true; 
            $scope.applyFilter($scope.page, withoutrefresh);                       
        }        

        //Modal anzeigen
        $scope.showInfoModal = function (activity) {

            //$scope.activity = activity;

            //Test nochmaliger Request auf Detail
            $http.get($scope.basePath + '/v1/Activity/' + activity.Id).success(function (result) {
                $scope.activity = result;
                $scope.isloading = false;

                leafletmapsimple.preparemap($scope.activity.GpsInfo, $scope.activity.GpsTrack, ['Startpunkt', 'Start und Ziel', 'Standpunkt', 'Endpunkt', 'Talstation', 'Bergstation', 'Mittelstation'], 'activityListController');

                var slidemodalInstance = $modal.open({
                    templateUrl: 'myActivityInfoModal.html',
                    controller: InfoModalInstanceCtrl,
                    scope: $scope,
                    size: 'lg'
                });
            });            
        };

        $scope.updateSmgActive = function (ActivityID) {
          
            $.each($scope.activities, function (i) {

                //console.log($scope.activities[i].Id);

                if ($scope.activities[i].Id.toLowerCase() === ActivityID.toLowerCase()) {
                    $scope.activities[i].SmgActive = true;
                    
                    return false;
                }
            });

        }

        function setSubTypeModel() {
            //Subtype CheckboxFilter
            $scope.checkSubTypeModel = {
                1: false,
                2: false,
                3: false,
                4: false,
                5: false,
                6: false,
                7: false,
                8: false,
                9: false,
                10: false,
                11: false,
                12: false,
                13: false,
                14: false,
                15: false,
                16: false,
                17: false,
                18: false,
                19: false,
                20: false
            };

            $scope.checkDifficultyModel = {
                1: false,
                2: false,
                3: false,
                4: false,
                5: false,
                6: false               
            };
        }

        function setSubFilter() {
            //Regions Filter
            //$scope.subtypefilter = "";

            //if ($scope.checkSubTypeModel.one && $scope.checkSubTypeModel.two && $scope.checkSubTypeModel.three && $scope.checkSubTypeModel.four && $scope.checkSubTypeModel.five && $scope.checkSubTypeModel.six && $scope.checkSubTypeModel.seven && $scope.checkSubTypeModel.eight && $scope.checkSubTypeModel.nine && $scope.checkSubTypeModel.ten && $scope.checkSubTypeModel.eleven && $scope.checkSubTypeModel.twelve && $scope.checkSubTypeModel.thirtheen && $scope.checkSubTypeModel.fourteen && $scope.checkSubTypeModel.fiftheen && $scope.checkSubTypeModel.sixteen && $scope.checkSubTypeModel.seventeen && $scope.checkSubTypeModel.eighteen && $scope.checkSubTypeModel.nineteen && $scope.checkSubTypeModel.twenty) {
            //    $scope.subtypefilter = "";
            //}
            //else if (!$scope.checkSubTypeModel.one && !$scope.checkSubTypeModel.two && !$scope.checkSubTypeModel.three && !$scope.checkSubTypeModel.four && !$scope.checkSubTypeModel.five && !$scope.checkSubTypeModel.six && !$scope.checkSubTypeModel.seven && !$scope.checkSubTypeModel.eight && !$scope.checkSubTypeModel.nine && !$scope.checkSubTypeModel.ten && !$scope.checkSubTypeModel.eleven && !$scope.checkSubTypeModel.twelve && !$scope.checkSubTypeModel.thirtheen && !$scope.checkSubTypeModel.fourteen && !$scope.checkSubTypeModel.fiftheen && !$scope.checkSubTypeModel.sixteen && !$scope.checkSubTypeModel.seventeen && !$scope.checkSubTypeModel.eighteen && !$scope.checkSubTypeModel.nineteen && !$scope.checkSubTypeModel.twenty) {
            //    $scope.subtypefilter = "";
            //}
            //else {

            //    if ($scope.checkSubTypeModel.one) {
            //        $scope.subtypefilter = $scope.subtypefilter + "one,";
            //    }
            //    if ($scope.checkSubTypeModel.two) {
            //        $scope.subtypefilter = $scope.subtypefilter + "two,";
            //    }
            //    if ($scope.checkSubTypeModel.three) {
            //        $scope.subtypefilter = $scope.subtypefilter + "three,";
            //    }
            //    if ($scope.checkSubTypeModel.four) {
            //        $scope.subtypefilter = $scope.subtypefilter + "four,";
            //    }
            //    if ($scope.checkSubTypeModel.five) {
            //        $scope.subtypefilter = $scope.subtypefilter + "five,";
            //    }
            //    if ($scope.checkSubTypeModel.six) {
            //        $scope.subtypefilter = $scope.subtypefilter + "six,";
            //    }
            //    if ($scope.checkSubTypeModel.seven) {
            //        $scope.subtypefilter = $scope.subtypefilter + "seven,";
            //    }
            //    if ($scope.checkSubTypeModel.eight) {
            //        $scope.subtypefilter = $scope.subtypefilter + "eight,";
            //    }
            //    if ($scope.checkSubTypeModel.nine) {
            //        $scope.subtypefilter = $scope.subtypefilter + "nine,";
            //    }
            //    if ($scope.checkSubTypeModel.ten) {
            //        $scope.subtypefilter = $scope.subtypefilter + "ten,";
            //    }
            //    if ($scope.checkSubTypeModel.eleven) {
            //        $scope.subtypefilter = $scope.subtypefilter + "eleven,";
            //    }
            //    if ($scope.checkSubTypeModel.twelve) {
            //        $scope.subtypefilter = $scope.subtypefilter + "twelve,";
            //    }
            //    if ($scope.checkSubTypeModel.thirtheen) {
            //        $scope.subtypefilter = $scope.subtypefilter + "thirtheen,";
            //    }
            //    if ($scope.checkSubTypeModel.fourteen) {
            //        $scope.subtypefilter = $scope.subtypefilter + "fourteen,";
            //    }
            //    if ($scope.checkSubTypeModel.fiftheen) {
            //        $scope.subtypefilter = $scope.subtypefilter + "fiftheen,";
            //    }
            //    if ($scope.checkSubTypeModel.sixteen) {
            //        $scope.subtypefilter = $scope.subtypefilter + "sixteen,";
            //    }
            //    if ($scope.checkSubTypeModel.seventeen) {
            //        $scope.subtypefilter = $scope.subtypefilter + "seventeen,";
            //    }
            //    if ($scope.checkSubTypeModel.eighteen) {
            //        $scope.subtypefilter = $scope.subtypefilter + "eighteen,";
            //    }
            //    if ($scope.checkSubTypeModel.nineteen) {
            //        $scope.subtypefilter = $scope.subtypefilter + "nineteen,";
            //    }
            //    if ($scope.checkSubTypeModel.twenty) {
            //        $scope.subtypefilter = $scope.subtypefilter + "twenty,";
            //    }           
            //}
            //if ($scope.subtypefilter == "")
            //    $scope.subtypefilter = "null";


            $scope.subtypefilter = "null";

            var subtypeflagcounter = 0;

            $.each($scope.checkSubTypeModel, function (i) {

                if ($scope.checkSubTypeModel[i] == true) {

                    //var shifted2 = lshift(1, i - 1);
                    var shifted1 = 1 << (i - 1);
                    subtypeflagcounter = subtypeflagcounter + shifted1;                    
                }
            });

            if (subtypeflagcounter > 0) {
                $scope.subtypefilter = subtypeflagcounter;
            }


            if ($scope.SelectedSmgTagName != '')
                $scope.smgtagfilter = $scope.SelectedSmgTagId;

            if ($scope.distancerange.min > 0 || $scope.distancerange.max < 30)
                $scope.distancerangefilter = $scope.distancerange.min + ',' + $scope.distancerange.max;
            else
                $scope.distancerangefilter = 'null';

            if ($scope.altituderange.min > 0 || $scope.altituderange.max < 3000)
                $scope.altituderangefilter = $scope.altituderange.min + ',' + $scope.altituderange.max;
            else
                $scope.altituderangefilter = 'null';

            if ($scope.durationrange.min > 0 || $scope.durationrange.max < 10)
                $scope.durationrangefilter = $scope.durationrange.min + ',' + $scope.durationrange.max;
            else
                $scope.durationrangefilter = 'null';

            if ($scope.highlight)
                $scope.highlightfilter = 'true';
            else
                $scope.highlightfilter = 'null';


            //$scope.difficultyfilter = "";

            //if ($scope.checkDifficultyModel.one && $scope.checkDifficultyModel.two && $scope.checkDifficultyModel.three && $scope.checkDifficultyModel.four && $scope.checkDifficultyModel.five) {
            //    $scope.difficultyfilter = "";
            //}
            //else if (!$scope.checkDifficultyModel.one && !$scope.checkDifficultyModel.two && !$scope.checkDifficultyModel.three && !$scope.checkDifficultyModel.four && !$scope.checkDifficultyModel.five) {
            //    $scope.difficultyfilter = "";
            //}
            //else {

            //    if ($scope.checkDifficultyModel.one) {
            //        $scope.difficultyfilter = $scope.difficultyfilter + "one,";
            //    }
            //    if ($scope.checkDifficultyModel.two) {
            //        $scope.difficultyfilter = $scope.difficultyfilter + "two,";
            //    }
            //    if ($scope.checkDifficultyModel.three) {
            //        $scope.difficultyfilter = $scope.difficultyfilter + "three,";
            //    }
            //    if ($scope.checkDifficultyModel.four) {
            //        $scope.difficultyfilter = $scope.difficultyfilter + "four,";
            //    }
            //    if ($scope.checkDifficultyModel.five) {
            //        $scope.difficultyfilter = $scope.difficultyfilter + "five,";
            //    }
              
            //}
            //if ($scope.difficultyfilter == "")
            //    $scope.difficultyfilter = "null";

            $scope.difficultyfilter = "null";

            var difficultystring = '';

            $.each($scope.checkDifficultyModel, function (i) {

                if ($scope.checkDifficultyModel[i] == true) {

                    //var shifted2 = lshift(1, i - 1);
                    //var shifted1 = 1 << (i - 1);
                    difficultystring = difficultystring + i + ',';
                }
            });

            if (difficultystring != '') {
                $scope.difficultyfilter = difficultystring;
            }

        }

        $scope.activities = [];

    }]);

//Modal Controller
var ActivityModalInstanceCtrl = function ($scope, $modalInstance, $http) {

    $scope.ok = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.addactivity = function (activity, isvalid) {

        if (isvalid) {

            $http.post($scope.basePath + '/v1/Activity', activity).success(function (result) {
                alert("Activity added!");
                $scope.activities.push(activity);



                $modalInstance.close();
            });
        }
        else {
            alert("Invalid Data!");
        }
    };

    $scope.updateactivity = function (activity, isvalid) {

        if (isvalid) {
            $http.put($scope.basePath + '/v1/Activity/' + activity.Id, activity).success(function (result) {
                alert("Activity updated!");
                $modalInstance.close();
            });
        }
        else {
            alert("Invalid Data!");
        }
    };

    $scope.isSMGImage = function (imagegallery) {
        if (imagegallery.ImageSource == 'SMG') {
            return true;
        }

        return false;
    };

    $scope.isLTSImage = function (imagegallery) {
        if (imagegallery.ImageSource == 'LTS') {
            return true;
        }

        return false;
    };
    
    //Add SMG Tagging
    $scope.addtag = function (tag) {

        if (tag != "" && tag != undefined) {


            tag = tag.toLowerCase();

            var addToArray = true;

            if ($scope.activity.SmgTags != null) {

                $.each($scope.activity.SmgTags, function (i) {

                    if ($scope.activity.SmgTags[i] === tag) {

                        alert('Already present!');
                        addToArray = false;

                        return false;
                    }
                });
            }
            else {
                $scope.activity.SmgTags = [];
            }


            if (addToArray) {

                $scope.activity.SmgTags.push(tag);
            }
        }
        else {
            alert('Invalid Tag!');
        }
    }

    //Remove SMG Tagging
    $scope.deletetag = function (tag) {
        //alert(tag);
        $.each($scope.activity.SmgTags, function (i) {
            if ($scope.activity.SmgTags[i] === tag) {
                $scope.activity.SmgTags.splice(i, 1);
                return false;
            }
        });
    }

    //$scope.onFileSelect = function ($files) {

    //    alert("hallöle");
    //        //$files: an array of files selected, each file has name, size, and type.
    //        for (var i = 0; i < $files.length; i++) {
    //            var $file = $files[i];
    //            $upload.upload({
    //                url: $scope.basePath + '/v1/FileUpload/' + $scope.activitytype,
    //                file: $file,
    //                progress: function (e) { }
    //            }).then(function (data, status, headers, config) {
    //                // file is uploaded successfully
    //                console.log(data);

    //                if ($scope.activity.ImageGallery == null) {
    //                    $scope.activity.ImageGallery = [];
    //                }

    //                $scope.activity.ImageGallery.push({ ImageName: '', ImageUrl: data.config.file.name, BildBeschreibung: '', ImageSource : 'SMG', IsInGallery : true });
    //            });
    //        }
    //    };

    $scope.deletebild = function (bildname, bildurl) {

        //Querystring parameter holen
        var parameter = getQueryVariable(bildurl, "src");
        //Ersetz a poor kloanigkeiten
        var mybildurl = parameter.replace('.', '$');        

        var find = '/';
        var re = new RegExp(find, 'g');
        var escapeduri = mybildurl.replace(re, '|');

        var deletepath = encodeURI($scope.basePath + '/v1/FileDelete/' + escapeduri);
        alert("Delete Image" + deletepath);

        $http.delete(deletepath).success(function (result) {
            alert("File deleted!");

            $.each($scope.activity.ImageGallery, function (i) {
                if ($scope.activity.ImageGallery[i].ImageName === bildname) {
                    $scope.activity.ImageGallery.splice(i, 1);
                    return false;
                }
            });
        });
    };

};

//Modal Slideshow Controller
var InfoModalInstanceCtrl = function ($scope, $modalInstance, $http) {

    $scope.cancelslidemodal = function () {        
        $modalInstance.dismiss('cancel');
    };

    $scope.myInterval = 5000;
    $scope.slides = $scope.activity.ImageGallery;
    //$http({
    //    method: 'Get',
    //    url: '/api/Images/Huette/' + $scope.huette.Id
    //}).success(function (data, status, headers, config) {
    //    $scope.slides = data;
    //}).error(function (data, status, headers, config) {
    //    $scope.message = 'Unexpected Error';
    //});
}

//Modal Slideshow Controller
var SuedtirolTypeSelectorModalInstanceCtrl = function ($scope, $modalInstance, $http) {
    $scope.canceltypeselectormodal = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.copytosmgpoi = function (activity) {

        alert("Copying Activity:" + $scope.typeselector.ActivityID + " Category: " + $scope.typeselector.Type + " " + $scope.typeselector.SubType + " " + $scope.typeselector.PoiType);

        var mytype = $scope.typeselector.Type
        var mysubtype = $scope.typeselector.SubType;
        var mypoitype = $scope.typeselector.PoiType;
        var selecteddistrict = $scope.typeselector.MatchedDistrict;

        if (mytype == "" || mytype == null || mytype == undefined)
        {
            mytype = 'null';
        }
        if (mysubtype == "" || mysubtype == null || mysubtype == undefined) {
            mysubtype = 'null';
        }
        if (mypoitype == "" || mypoitype == null || mypoitype == undefined) {
            mypoitype = 'null';
        }
        if (selecteddistrict == "" || selecteddistrict == null || selecteddistrict == undefined) {
            selecteddistrict = 'null';
        }

        //Kopier olls in SMGPois onni
        $http.get($scope.basePath + '/v1/SmgPoi/ActivityToSmgPoi/' + $scope.typeselector.ActivityID + '/' + mytype + '/' + mysubtype + '/' + mypoitype + '/' + selecteddistrict + '/LTS/ActivityData/Partial').success(function (result) {

            //console.log(result);
            alert(result.Message);
            
            $scope.isloading = false;

            $modalInstance.dismiss('cancel');

            $scope.$parent.updateSmgActive($scope.typeselector.ActivityID);
        });        

    }
}

//Controller für Typen Maintype Subtype Poitype
var TypeSelectController = app.controller('TypeSelectController', function ($scope, $http) {

    $http({
        method: 'Get',
        //url: $scope.basePath + '/json/LocInfoTvs' + $scope.lang + '.json'
        url: $scope.basePath + '/v1/SuedtirolType/Filtered/null/0/SmgPoi'
    }).success(function (data) {
        $scope.maintypeslist = data;
    });

    $http({
        method: 'Get',
        //url: $scope.basePath + '/json/LocInfoTvs' + $scope.lang + '.json'
        url: $scope.basePath + '/v1/SuedtirolType/Filtered/' + $scope.typeselector.Type + '/1/SmgPoi'
    }).success(function (data) {
        $scope.subtypeslist = data;
    });

    $http({
        method: 'Get',
        //url: $scope.basePath + '/json/LocInfoTvs' + $scope.lang + '.json'
        url: $scope.basePath + '/v1/SuedtirolType/Filtered/' + $scope.typeselector.SubType + '/2/SmgPoi'
    }).success(function (data) {
        $scope.poitypeslist = data;
    });

    $http({
        method: 'Get',
        url: $scope.basePath + '/json/LocInfoFrawithMun' + $scope.lang + '.json'
        //url: $scope.basePath + '/v1/Common/TourismvereinList/Reduced/' + $scope.lang + '/100'  --> PRoblem mit Lowercase IDs
    }).success(function (data) {
        $scope.districtslist = data;
    });


    $scope.changemaintype = function (selectedmaintype) {

        console.log(selectedmaintype);

        $http({
            method: 'Get',
            //url: $scope.basePath + '/json/LocInfoTvs' + $scope.lang + '.json'
            url: $scope.basePath + '/v1/SuedtirolType/Filtered/' + $scope.typeselector.Type + '/1/SmgPoi'
        }).success(function (data) {
            $scope.subtypeslist = data;
        });

        //Cleare die Poi Poi Types und Subtypes
        $scope.poitypeslist = [];      
        
    }

    $scope.changesubtype = function (selectedsubtype) {

        $http({
            method: 'Get',
            //url: $scope.basePath + '/json/LocInfoTvs' + $scope.lang + '.json'
            url: $scope.basePath + '/v1/SuedtirolType/Filtered/' + $scope.typeselector.SubType + '/2/SmgPoi'
        }).success(function (data) {
            $scope.poitypeslist = data;
        });
               
    }

    

});

//Controller for Location Select
var locationlistcontroller = app.controller('LocationTypeAheadController', function ($scope, $http) {

    $scope.locationnametypeaheadselected = false;

    if ($scope.globallocfilter == '') {
        $http({
            method: 'Get',
            url: $scope.basePath + '/json/LocInfoMtaRegTvs' + $scope.lang + '.json'
        }).success(function (data) {
            $scope.locitems = data;
        });
    }
    else {
        //Wenn ein Globaler Locationfilter gesetzt ist so muss ich die Locations live holen welche zu diesem gehören
        $http({
            method: 'Get',
            url: $scope.basePath + '../api/Location?language=' + $scope.lang + '&locfilter=' + $scope.globallocfilter
        }).success(function (data) {
            $scope.locitems = data;

            //Aus Data ausserziagn no zu schaugn wia

            var locationobject = objectFindByKey(data, 'id', $scope.globallocfilter.substring(3));

            $scope.$parent.globallocfilterName = locationobject.name;
            $scope.$parent.SelectedLocationName = locationobject.name;
        });
    }

    $scope.onItemSelected = function () {
        $scope.locationnametypeaheadselected = true;
    }
});

function objectFindByKey(array, key, value) {
    for (var i = 0; i < array.length; i++) {
        if (array[i][key] === value) {
            return array[i];
        }
    }
    return null;
}

var skiarealistcontroller = app.controller('SkiAreaTypeAheadController', function ($scope, $http) {

    $scope.skiareanametypeaheadselected = false;

    if ($scope.globallocfilter == '') {
        $http({
            method: 'Get',
            url: $scope.basePath + '/json/SkiAreaInfoComplete' + $scope.lang + '.json'
        }).success(function (data) {
            $scope.skiitems = data;
        });
    }
    else {
        //Wenn ein Globaler Locationfilter gesetzt ist so muss ich die Locations live holen welche zu diesem gehören
        $http({
            method: 'Get',
            url: $scope.basePath + '../api/Location/Skiarea?language=' + $scope.lang + '&locfilter=' + $scope.globallocfilter
        }).success(function (data) {
            $scope.skiitems = data;            
        });
    }

    $scope.onItemSelected = function () {
        $scope.skiareanametypeaheadselected = true;
    }
});

var poitypeaheadcontroller = app.controller('PoinameTypeAheadController', function ($scope, $http) {

    $scope.poinametypeaheadselected = false;       
    
    $scope.getPoinamesFilteredList = function (lang, activitytype, subtypefilter, locationfilter, areafilter, distancerangefilter, altituderangefilter, durationrangefilter, highlightfilter, difficultyfilter, active, smgactive, smgtagfilter) {
        
        $http({
            method: 'Get',
            url: $scope.basePath + '/v1/ActivityReduced?language=' + lang + '&activitytype=' + activitytype + '&subtype=' + subtypefilter + '&locfilter=' + locationfilter + '&areafilter=' + areafilter + '&distancefilter=' + distancerangefilter + '&altitudefilter=' + altituderangefilter + '&durationfilter=' + durationrangefilter + '&highlight=' + highlightfilter + '&difficultyfilter=' + difficultyfilter + '&active=' + active + '&smgactive=' + smgactive + '&odhtagfilter=' + smgtagfilter
            //url: '/json/' + $scope.activitytype + 'Info.json'
        }).success(function (data) {
            $scope.items = data;
        });
    }
    $scope.$on('LoadPoiNamesList', function (e) {
        
        $scope.getPoinamesFilteredList($scope.lang, $scope.activitytype, $scope.subtypefilter, $scope.locationfilter, $scope.areafilter, $scope.distancerangefilter, $scope.altituderangefilter, $scope.durationrangefilter, $scope.highlightfilter, $scope.difficultyfilter, $scope.active, $scope.smgactive, $scope.smgtagfilter);
    });

    $scope.getPoinamesFilteredList($scope.lang, $scope.activitytype, $scope.subtypefilter, $scope.locationfilter, $scope.areafilter, $scope.distancerangefilter, $scope.altituderangefilter, $scope.durationrangefilter, $scope.highlightfilter, $scope.difficultyfilter, $scope.active, $scope.smgactive, $scope.smgtagfilter);

    $scope.onItemSelected = function () {
        $scope.poinametypeaheadselected = true;
    }
});

var smgtagmodaltypeaheadcontroller = app.controller('SmgTagNameModalTypeAheadController', function ($scope, $http) {

    $scope.smgtagselected = false;

    $scope.getSmgTagNameListModal = function (lang) {

        $http({
            method: 'Get',
            url: $scope.basePath + '/v1/ODHTagReduced?localizationlanguage=' + lang + '&validforentity=' + $scope.activity.Type
        }).success(function (data) {
            $scope.items = data;
        });
    }

    $scope.getSmgTagNameListModal($scope.lang);

    $scope.onItemSelected = function () {
        $scope.smgtagselected = true;
    }
});

var smgtagtypeaheadcontroller = app.controller('SmgTagNameTypeAheadController', function ($scope, $http) {

    $scope.articlenametypeaheadselected = false;

    $scope.getSmgTagNameList = function (lang) {

        var typestofilter = '';
        if (!isNaN($scope.activitytype))
            typestofilter = 'Activity,Berg,Wandern,Radfahren,Stadtrundgang,Pferdesport,Laufen und Fitness,Loipen,Rodelbahnen,Piste,Aufstiegsanlagen,';


        $http({
            method: 'Get',
            url: $scope.basePath + '/v1/ODHTagReduced?localizationlanguage=' + lang + '&validforentity=' + typestofilter + $scope.activitytype
        }).success(function (data) {
            $scope.items = data;
        });
    }

    $scope.getSmgTagNameList($scope.lang);

    $scope.onItemSelected = function () {
        $scope.articlenametypeaheadselected = true;
    }
});

//Directive Typeahead
app.directive('typeaheadpoi', function ($timeout) {
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
            scope.handleSelection = function (selectedItem, selectedTyp, selectedId) {
                scope.model = selectedItem;
                scope.submodel = selectedTyp;
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

//Directive Typeahead
app.directive('typeaheadsmgtag', function ($timeout) {
    return {
        restrict: 'AEC',
        scope: {
            items: '=',
            prompt: '@',
            title: '@',
            name: '@',
            model: '=',
            idmodel: '=',
            onSelect: '&'
        },
        link: function (scope, elem, attrs) {
            scope.handleSelection = function (selectedItem, selectedId) {
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

app.filter('momenttime', function () {
    return function (timeString, length) {

        return timeString.substring(0, length);
    };
});


function getQueryVariable(url, variable) {

    var myurl = url.substring(url.indexOf("?"))

    var query = myurl.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0] == variable) { return pair[1]; }
    }
    return (false);
}

////Fileupload Test
//app.controller('FileUploadController', ['$scope', 'FileUploader', function ($scope, FileUploader) {
//    var uploader = $scope.uploader = new FileUploader({
//        url: $scope.basePath + '/v1/FileUpload/poi/' + $scope.activitytype
//    });


//    // FILTERS
//    uploader.filters.push({
//        name: 'imageFilter',
//        fn: function (item /*{File|FileLikeObject}*/, options) {
//            var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
//            return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
//        }
//    });

//    // CALLBACKS

//    uploader.onWhenAddingFileFailed = function (item /*{File|FileLikeObject}*/, filter, options) {
//        console.info('onWhenAddingFileFailed', item, filter, options);
//    };
//    uploader.onAfterAddingFile = function (fileItem) {
//        console.info('onAfterAddingFile', fileItem);
//    };
//    uploader.onAfterAddingAll = function (addedFileItems) {
//        console.info('onAfterAddingAll', addedFileItems);
//    };
//    uploader.onBeforeUploadItem = function (item) {
//        console.info('onBeforeUploadItem', item);
//    };
//    uploader.onProgressItem = function (fileItem, progress) {
//        console.info('onProgressItem', fileItem, progress);
//    };
//    uploader.onProgressAll = function (progress) {
//        console.info('onProgressAll', progress);
//    };
//    uploader.onSuccessItem = function (fileItem, response, status, headers) {

//        var r = new RegExp('"', 'g');
//        var imageurl = response.replace(r, '');
//        //Filename
//        var imagename = imageurl.substring(imageurl.lastIndexOf('/') + 1);

//        if ($scope.activity.ImageGallery == null) {
//            $scope.activity.ImageGallery = [];
//        }

//        var UploadedImage = { ImageName: imagename, ImageUrl: imageurl, Width: 0, Height: 0, ImageSource: 'SMG', ImageTitle: { de: '', it: '', en: '' }, ImageDesc: { de: '', it: '', en: '' } }

//        $scope.activity.ImageGallery.push(UploadedImage);

//        alert('Image uploaded');

//        console.info('onSuccessItem', fileItem, response, status, headers);
//    };
//    uploader.onErrorItem = function (fileItem, response, status, headers) {

//        alert('error');
//        console.info('onErrorItem', fileItem, response, status, headers);
//    };
//    uploader.onCancelItem = function (fileItem, response, status, headers) {
//        console.info('onCancelItem', fileItem, response, status, headers);
//    };
//    uploader.onCompleteItem = function (fileItem, response, status, headers) {
//        console.info('onCompleteItem', fileItem, response, status, headers);
//    };
//    uploader.onCompleteAll = function () {
//        console.info('onCompleteAll');
//    };

//    console.info('uploader', uploader);
//}]);
