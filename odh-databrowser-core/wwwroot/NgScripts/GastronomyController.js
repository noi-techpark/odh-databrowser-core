// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

var app = angular.module('gastronomy', ['ui.bootstrap', 'ngSanitize', 'appconfig', 'appfactory', 'leaflet-directive', 'pathconfig']);

app.controller('gastronomyListController', [
    '$scope', '$http', '$modal', 'appconfig', 'leafletData', 'leafletmapsimple', 'languageFactory', 'apipath',
    function ($scope, $http, $modal, config, leafletData, leafletmapsimple, languageFactory, apipath) {

        $scope.basePath = apipath;
        $scope.lang = languageFactory.getLanguage();

        var allowedlanguages = ['de', 'it', 'en'];     

        $scope.globallocfilter = '';
        $scope.globallocfilterName = '';
        $scope.globallocfilterId = '';
        $scope.globallocfilterType = '';

        $scope.init = function (gastronomytype, locfilter, locfiltertype) {
            //This function is sort of private constructor for controller            
            $scope.gastronomytype = gastronomytype;

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

            $scope.changePage(0, false);
        };

        $scope.changeLanguage = function () {

            languageFactory.setLanguage($scope.lang);
            console.log(languageFactory.getLanguage());

            //Reload Entire PAge (Hack)
            location.reload();
        };

        $scope.editgastronomy = function (gastronomy) {

            if (gastronomy === 'new') {

                $scope.newgastronomy = true;
                $scope.gastronomy = { Id: '', Shortname: '', _Meta: { Id: '', Type: 'gastronomy', Source: 'noi' } };

                var modalInstance = $modal.open({
                    templateUrl: 'myGastronomyModal.html',
                    controller: GastronomyModalInstanceCtrl,
                    scope: $scope,
                    //size: 'lg',
                    windowClass: 'modal-wide',
                    backdrop: 'static'
                });
            }
            else {
                $scope.newgastronomy = false;

                $scope.gastronomy = gastronomy;

                var modalInstance = $modal.open({
                    templateUrl: 'myGastronomyModal.html',
                    controller: GastronomyModalInstanceCtrl,
                    scope: $scope,
                    //size: 'lg',
                    windowClass: 'modal-wide',
                    backdrop: 'static'
                });

                //Test nochmaliger Request auf Detail
                //$http.get($scope.basePath + '/v1/Gastronomy/' + gastronomy.Id).success(function (result) {
                //    $scope.gastronomy = result;
                //    $scope.isloading = false;

                //    var modalInstance = $modal.open({
                //        templateUrl: 'myGastronomyModal.html',
                //        controller: GastronomyModalInstanceCtrl,
                //        scope: $scope,
                //        size: 'lg',
                //        backdrop: 'static'
                //    });
                //});

                
            }
            
        };

        $scope.deletegastronomy = function (id) {

            var deleteconfirm = confirm('Are you absolutely sure you want to delete?');

            if (deleteconfirm) {
                $http.delete($scope.basePath + '/v1/Gastronomy/' + id).success(function (result) {
                    alert("Gastronomy deleted!");

                    //$.each($scope.gastronomies, function (i) {
                    //    if ($scope.gastronomies[i].Id === id) {
                    //        $scope.gastronomies.splice(i, 1);
                    //        return false;
                    //    }
                    //}).error(function (data) {
                    //    alert("ERROR:" + data);
                    //});

                    $scope.applyFilter($scope.page);
                });
            }
        };

        $scope.updategastronomy = function (id) {

            $scope.isloading = true;
            $http.get($scope.basePath + '/v1/Update/Gastronomy/' + id).success(function (result) {

                console.log(result.replace(/^"(.*)"$/, '$1'));
                $scope.isloading = false;
                alert(result.replace(/^"(.*)"$/, '$1'));

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

        $scope.SelectedGastroName = '';
        $scope.SelectedGastroId = '';
        $scope.SelectedLocationName = '';
        $scope.SelectedLocationTyp = '';
        $scope.SelectedLocationId = '';

        //SMG Tags
        $scope.SelectedSmgTagName = '';
        $scope.SelectedSmgTagId = '';
        $scope.smgtagfilter = 'null';

        $scope.gastroidfilter = 'null';        
        $scope.locationfilter = 'null';
        $scope.dishcodefilter = "null";
        $scope.ceremonycodefilter = "null";
        $scope.facilitycodefilter = "null";
        $scope.categorycodefilter = "null";

        $scope.active = 'null';
        $scope.smgactive = 'null';

        //Filter anwenden
        $scope.applyFilter = function (page, withoutrefresh) {

            $scope.isloading = true;
            $scope.page = page;

            setCheckFilter();
            
            if ($scope.SelectedGastroId != '')
                $scope.gastroidfilter = $scope.SelectedGastroId;

            if ($scope.SelectedLocationId != '')
                $scope.locationfilter = $scope.SelectedLocationTyp + $scope.SelectedLocationId;

            //console.log($scope.locationfilter);

            $http.get($scope.basePath + '/v1/Gastronomy?pagenumber=' + $scope.page + '&pagesize=20&idlist=' + $scope.gastroidfilter + '&locfilter=' + $scope.locationfilter + '&dishcodefilter=' + $scope.dishcodefilter + '&ceremonycodefilter=' + $scope.ceremonycodefilter + '&categorycodefilter=' + $scope.categorycodefilter + '&facilitycodefilter=' + $scope.facilitycodefilter + '&cuisinecodefilter=' + $scope.cuisinecodefilter + '&active=' + $scope.active + '&odhactive=' + $scope.smgactive + '&odhtagfilter=' + $scope.smgtagfilter + '&seed=' + $scope.Seed).success(function (result) {
                $scope.gastronomies = result.Items;
                $scope.totalpages = result.TotalPages;
                $scope.totalcount = result.TotalResults;
                $scope.Seed = result.Seed;
                $scope.isloading = false;
                $scope.filtered = true;
            });

            if (withoutrefresh != true)
                $scope.$broadcast('LoadGastroNamesList');
        }

        //Filter Löschen
        $scope.clearFilter = function () {
            $scope.SelectedGastroName = '';
            $scope.SelectedGastroId = '';

            //Location     
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

            //console.log($scope.locfilter);

            $scope.gastroidfilter = 'null';

            $scope.SelectedSmgTagName = '';
            $scope.SelectedSmgTagId = '';
            $scope.smgtagfilter = 'null';

            $scope.active = 'null';
            $scope.smgactive = 'null';

            $.each($scope.checkCatCodesModel, function (i) {
                $scope.checkCatCodesModel[i] = false;
            });

            $.each($scope.checkFacCodesModel, function (i) {
                $scope.checkFacCodesModel[i] = false;
            });

            $.each($scope.checkDishCodesModel, function (i) {
                $scope.checkDishCodesModel[i] = false;
            });

            $.each($scope.checkCeremonyCodesModel, function (i) {
                $scope.checkCeremonyCodesModel[i] = false;
            });

            $.each($scope.checkCuisineCodesModel, function (i) {
                $scope.checkCuisineCodesModel[i] = false;
            });

            $scope.page = 1;
            $scope.filtered = false;
            $scope.changePage(0);
            
            //$scope.$broadcast('LoadGastroNamesList');
        }

        //Clear single Filters
        $scope.clearNameFilter = function () {
            $scope.SelectedGastroName = '';
            $scope.SelectedGastroId = '';
            $scope.gastroidfilter = 'null';
            $scope.page = 1;
            $scope.applyFilter(0);

            //$scope.$broadcast('LoadGastroNamesList');
        }

        $scope.clearLocationFilter = function () {

            $scope.SelectedLocationName = '';
            $scope.SelectedLocationTyp = '';
            $scope.SelectedLocationId = '';
            $scope.locationfilter = 'null';

            $scope.page = 1;
            $scope.changePage(0);

            //$scope.$broadcast('LoadGastroNamesList');
        }

        $scope.clearTagFilter = function () {
            $scope.SelectedSmgTagName = '';
            $scope.SelectedSmgTagId = '';
            $scope.smgtagfilter = 'null';
            $scope.page = 1;
            $scope.changePage(0);

            //$scope.$broadcast('LoadGastroNamesList');
        }

        $scope.clearActiveFilter = function () {

            $scope.smgactive = 'null';

            $scope.page = 1;
            $scope.changePage(0);

            //$scope.$broadcast('LoadGastroNamesList');
        }

        $scope.clearTICActiveFilter = function () {

            $scope.active = 'null';

            $scope.page = 1;
            $scope.changePage(0);

            //$scope.$broadcast('LoadGastroNamesList');
        }

        $scope.clearCategoryFilter = function () {

            $.each($scope.checkCatCodesModel, function (i) {
                $scope.checkCatCodesModel[i] = false;
            });
            $scope.page = 1;
            $scope.changePage(0);

            //$scope.$broadcast('LoadGastroNamesList');
        }

        $scope.clearFacilityFilter = function () {

            $.each($scope.checkFacCodesModel, function (i) {
                $scope.checkFacCodesModel[i] = false;
            });
            $scope.page = 1;
            $scope.changePage(0);

            //$scope.$broadcast('LoadGastroNamesList');
        }

        $scope.clearCuisineFilter = function () {

            $.each($scope.checkCuisineCodesModel, function (i) {
                $scope.checkCuisineCodesModel[i] = false;
            });
            $scope.page = 1;
            $scope.changePage(0);

            //$scope.$broadcast('LoadGastroNamesList');
        }

        $scope.clearDishcodeFilter = function () {

            $.each($scope.checkDishCodesModel, function (i) {
                $scope.checkDishCodesModel[i] = false;
            });
            $scope.page = 1;
            $scope.changePage(0);

            //$scope.$broadcast('LoadGastroNamesList');
        }

        $scope.clearCeremonyCodeFilter = function () {

            $.each($scope.checkCeremonyCodesModel, function (i) {
                $scope.checkCeremonyCodesModel[i] = false;
            });
            $scope.page = 1;
            $scope.changePage(0);

            //$scope.$broadcast('LoadGastroNamesList');
        }

        //Seite Wechseln
        $scope.changePage = function (pageskip, withoutrefresh) {

            $scope.page = $scope.page + pageskip;
            $scope.isloading = true;

            $scope.applyFilter($scope.page, withoutrefresh);                 
        }        

        //Modal anzeigen
        $scope.showInfoModal = function (gastronomy) {            

            //Test nochmaliger Request auf Detail
            $http.get($scope.basePath + '/v1/Gastronomy/' + gastronomy.Id).success(function (result) {
                $scope.gastronomy = result;
                $scope.isloading = false;

                var passedgps = [];
                passedgps.push({ Gpstype: 'position', Latitude: $scope.gastronomy.Latitude, Longitude: $scope.gastronomy.Longitude });

                leafletmapsimple.preparemap(passedgps, null, ['position'], 'gastronomyListController');


                var slidemodalInstance = $modal.open({
                    templateUrl: 'myGastronomyInfoModal.html',
                    controller: InfoModalInstanceCtrl,
                    scope: $scope,
                    size: 'lg'
                });
            });

            //$scope.gastronomy = gastronomy;
        };

        function setCheckModels() {
            //Subtype CheckboxFilter
            $scope.checkCatCodesModel = {
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

            $scope.checkFacCodesModel = {
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
                20: false,
                21: false,
                22: false,
                23: false,
                24: false,
                25: false,
                26: false,
                27: false,
                28: false,
                29: false,
                30: false             
            };

            $scope.checkCuisineCodesModel = {
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
                20: false,
                21: false,
                22: false,
                23: false,
                24: false,
                25: false,
                26: false
            };


            $scope.checkCeremonyCodesModel = {
                1: false,
                2: false,
                3: false,
                4: false,
                5: false,
                6: false,
                7: false,
                8: false,
                9: false
            };

            $scope.checkDishCodesModel = {
                1: false,
                2: false,
                3: false,
                4: false,
                5: false,
                6: false,
                7: false,
                8: false,
                9: false
            };
        }

        function setCheckFilter() {

            $scope.dishcodefilter = "null";
            var dishcodeflagcounter = 0;
            $scope.ceremonycodefilter = "null";
            var ceremonycodeflagcounter = 0;
            $scope.facilitycodefilter = "null";
            var facilitycodeflagcounter = 0;
            $scope.categorycodefilter = "null";
            var categorycodeflagcounter = 0;
            $scope.cuisinecodefilter = "null";
            var cuisinecodeflagcounter = 0;
                                  
            $.each($scope.checkCatCodesModel, function (i) {                

                if ($scope.checkCatCodesModel[i] == true) {
                    //$scope.categorycodefilter = $scope.categorycodefilter + i + ',';            
                    var shifted1 = 1 << (i - 1);
                    categorycodeflagcounter = categorycodeflagcounter + shifted1;
                }
            });

            $.each($scope.checkFacCodesModel, function (i) {
                if ($scope.checkFacCodesModel[i] == true)
                {
                    //$scope.facilitycodefilter = $scope.facilitycodefilter + i + ',';
                    var shifted2 = 1 << (i - 1); 
                    //var shifted2 = 1 * Math.pow(2, i - 1);

                    //alert("Shifting to " + i + " " + shifted2);

                    facilitycodeflagcounter = facilitycodeflagcounter + shifted2;
                }                    
            });

            $.each($scope.checkCeremonyCodesModel, function (i) {
                if ($scope.checkCeremonyCodesModel[i] == true)
                {
                    //$scope.ceremonycodefilter = $scope.ceremonycodefilter + i + ',';
                    var shifted3 = 1 << (i - 1);
                    ceremonycodeflagcounter = ceremonycodeflagcounter + shifted3;
                }
                    
            });

            $.each($scope.checkDishCodesModel, function (i) {
                if ($scope.checkDishCodesModel[i] == true)
                {
                    //$scope.dishcodefilter = $scope.dishcodefilter + i + ',';
                    var shifted4 = 1 << (i - 1);
                    dishcodeflagcounter = dishcodeflagcounter + shifted4;
                }
                    
            });

            $.each($scope.checkCuisineCodesModel, function (i) {
                if ($scope.checkCuisineCodesModel[i] == true) {
                    //$scope.facilitycodefilter = $scope.facilitycodefilter + i + ',';
                    var shifted5 = 1 << (i - 1); 
                    //var shifted2 = 1 * Math.pow(2, i - 1);

                    //alert("Shifting to " + i + " " + shifted2);

                    cuisinecodeflagcounter = cuisinecodeflagcounter + shifted5;
                }
            });

            
            if (dishcodeflagcounter > 0) {
                $scope.dishcodefilter = dishcodeflagcounter;
            }
            if (ceremonycodeflagcounter > 0) {
                $scope.ceremonycodefilter = ceremonycodeflagcounter;
            }
            if (facilitycodeflagcounter > 0) {
                $scope.facilitycodefilter = facilitycodeflagcounter;
            }
            if (categorycodeflagcounter > 0) {
                $scope.categorycodefilter = categorycodeflagcounter;
            }
            if (cuisinecodeflagcounter > 0) {
                $scope.cuisinecodefilter = cuisinecodeflagcounter;
            }

            if ($scope.SelectedSmgTagName != '')
                $scope.smgtagfilter = $scope.SelectedSmgTagId;
        }

        setCheckModels();

        $scope.gastronomies = [];
    }]);

//Modal Controller
var GastronomyModalInstanceCtrl = function ($scope, $modalInstance, $http) {

    $scope.ok = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.addgastronomy = function (gastronomy, isvalid) {

        if (isvalid) {

            $http.post($scope.basePath + '/v1/Gastronomy', gastronomy).success(function (result) {
                alert("Gastronomy added!");
                $scope.gastronomies.push(gastronomy);

                $modalInstance.close();
            });
        }
        else {
            alert("Invalid Data!");
        }
    };

    $scope.updategastronomy = function (gastronomy, isvalid) {

        if (isvalid) {
            $http.put($scope.basePath + '/v1/Gastronomy/' + gastronomy.Id, gastronomy).success(function (result) {
                alert("Gastronomy updated!");
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

        if ($scope.smgtag.smgtagid != "" && $scope.smgtag.smgtagid != undefined) {

            var addToArray = true;

            if ($scope.gastronomy.SmgTags != null) {

                $.each($scope.gastronomy.SmgTags, function (i) {

                    if ($scope.gastronomy.SmgTags[i] === tag.toLowerCase()) {

                        alert('Already present!');
                        addToArray = false;

                        return false;
                    }
                });
            }
            else {
                $scope.gastronomy.SmgTags = [];
            }


            if (addToArray) {

                $scope.gastronomy.SmgTags.push(tag.toLowerCase());
            }
        }
        else {
            alert('Invalid Tag!');
        }
    }

    //Remove SMG Tagging
    $scope.deletetag = function (tag) {
        //alert(tag);
        $.each($scope.gastronomy.SmgTags, function (i) {
            if ($scope.gastronomy.SmgTags[i] === tag) {
                $scope.gastronomy.SmgTags.splice(i, 1);
                return false;
            }
        });
    }

};

//Modal Slideshow Controller
var InfoModalInstanceCtrl = function ($scope, $modalInstance, $http) {

    $scope.cancelslidemodal = function () {        
        $modalInstance.dismiss('cancel');
    };

    $scope.myInterval = 5000;
    $scope.slides = $scope.gastronomy.ImageGallery;
    //$http({
    //    method: 'Get',
    //    url: '/api/Images/Huette/' + $scope.huette.Id
    //}).success(function (data, status, headers, config) {
    //    $scope.slides = data;
    //}).error(function (data, status, headers, config) {
    //    $scope.message = 'Unexpected Error';
    //});
}

//Angular App Module and Controller
app.controller('MapCtrl', function ($scope) {

    var mylatitude = 46.655781;
    var mylongitude = 11.4296877;

    if ($scope.gastronomy.Gpstype != null) {              
        mylatitude = $scope.gastronomy.Latitude;
        mylongitude = $scope.gastronomy.Longitude;
    }

    var mapOptions = {
        zoom: 14,
        center: new google.maps.LatLng(mylatitude, mylongitude),
        mapTypeId: google.maps.MapTypeId.TERRAIN,
        noClear: true
    }

    var mymap = document.getElementById('map');

    $scope.map = new google.maps.Map(mymap, mapOptions);

    //DES GEAT!   (Dirty Fix)
    google.maps.event.addListenerOnce($scope.map, 'idle', function () {
        google.maps.event.trigger($scope.map, 'resize');
    
        if ($scope.gastronomy.Gpstype != null && $scope.gastronomy.Gpstype != '') {

            $scope.map.setCenter(new google.maps.LatLng(mylatitude, mylongitude));
        }
    });


    $scope.markers = [];

    var infoWindow = new google.maps.InfoWindow();

    var createMarker = function (info) {

        var marker = new google.maps.Marker({
            map: $scope.map,
            position: new google.maps.LatLng(info.Latitude, info.Longitude),
            title: $scope.gastronomy.ContactInfos['de'].CompanyName
        });
        marker.content = '<div class="infoWindowContent">' + info.Gpstype + '</div>';

        google.maps.event.addListener(marker, 'click', function () {
            infoWindow.setContent('<h3>' + marker.title + '</h3>' + marker.content);
            infoWindow.open($scope.map, marker);
        });

        $scope.markers.push(marker);

    }

    if ($scope.gastronomy.Gpstype != null) {

        var gpsinfo = { Gpstype: $scope.gastronomy.Gpstype, Latitude: $scope.gastronomy.Latitude, Longitude: $scope.gastronomy.Longitude };
        
        createMarker(gpsinfo);
    }

    $scope.openInfoWindow = function (e, selectedMarker) {
        e.preventDefault();
        google.maps.event.trigger(selectedMarker, 'click');
    }
    

});

//Controller for Location Select
var locationlistcontroller = app.controller('LocationTypeAheadController', function ($scope, $http) {

    $scope.locationnametypeaheadselected = false;

    if ($scope.globallocfilter == '') {
        $http({
            method: 'Get',
            url: $scope.basePath + '/json/LocInfoMtaRegTvsMunFra' + $scope.lang + '.json'
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

var gastrotypeaheadcontroller = app.controller('GastronameTypeAheadController', function ($scope, $http) {

    $scope.gastronametypeaheadselected = false;

    $scope.getGastronamesFilteredList = function (lang, locationfilter, categorycodefilter, capacityceremonyfilter, facilitycodefilter, dishcodefilter, cuisinecodefilter, smgtagfilter, active, smgactive) {

        $http({
            method: 'Get',
            url: $scope.basePath + '/v1/GastronomyReduced?language=' + lang + '&locfilter=' + locationfilter + '&dishcodefilter=' + dishcodefilter + '&ceremonycodefilter=' + capacityceremonyfilter + '&categorycodefilter=' + categorycodefilter + '&facilitycodefilter=' + facilitycodefilter + '&cuisinecodefilter=' + cuisinecodefilter + '&active=' + active + '&odhactive=' + smgactive + '&odhtagfilter=' + smgtagfilter
            //url: '/json/' + $scope.activitytype + 'Info.json'
        }).success(function (data) {
            $scope.items = data;
        });

        //if (locationfilter != "null" || categorycodefilter != "null" || capacityceremonyfilter != "null" || facilitycodefilter != "null" || dishcodefilter != "null" || smgtagfilter != "null" || smgactive != "null" || active != "null") {
            
        //    $http({
        //        method: 'Get',
        //        url: $scope.basePath + '/v1/GastronomyReduced?language=' + lang + '&locfilter=' + locationfilter + '&dishcodefilter=' + dishcodefilter + '&ceremonycodefilter=' + capacityceremonyfilter + '&categorycodefilter=' + categorycodefilter + '&facilitycodefilter=' + facilitycodefilter + '&cuisinecodefilter=' + cuisinecodefilter + '&active=' + active + '&odhactive=' + smgactive + '&odhtagfilter=' + smgtagfilter
        //        //url: '/json/' + $scope.activitytype + 'Info.json'
        //    }).success(function (data) {
        //        $scope.items = data;
        //    });
        //}
        //else
        //{
        //    $http({
        //        method: 'Get',
        //        url: $scope.basePath + '/json/GastroInfo' + $scope.lang + '.json'
        //    }).success(function (data) {
        //        $scope.items = data;
        //    });
        //}
    }

    $scope.$on('LoadGastroNamesList', function (e) {

        //alert("onkemmen");

        $scope.getGastronamesFilteredList($scope.lang, $scope.locationfilter, $scope.categorycodefilter, $scope.ceremonycodefilter, $scope.facilitycodefilter, $scope.dishcodefilter, $scope.cuisinecodefilter, $scope.smgtagfilter, $scope.active, $scope.smgactive);
    });   

    $scope.getGastronamesFilteredList($scope.lang, $scope.locationfilter, $scope.categorycodefilter, $scope.ceremonycodefilter, $scope.facilitycodefilter, $scope.dishcodefilter, $scope.cuisinecodefilter, $scope.smgtagfilter, $scope.active, $scope.smgactive);

    $scope.onItemSelected = function () {
        $scope.gastronametypeaheadselected = true;
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

//Directive Typeahead
app.directive('typeaheadgastro', function ($timeout) {
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
                //alert(selectedItem + selectedTyp + selectedId);

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

//SMG Tags

var smgtagmodaltypeaheadcontroller = app.controller('SmgTagNameModalTypeAheadController', function ($scope, $http) {

    $scope.smgtagselected = false;

    $scope.getSmgTagNameListModal = function (lang) {

        $http({
            method: 'Get',
            url: $scope.basePath + '/v1/ODHTagReduced?localizationlanguage=' + lang + '&validforentity=Gastronomy'
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

    $scope.acconametypeaheadselected = false;

    $scope.getSmgTagNameList = function (lang) {

        $http({
            method: 'Get',
            url: $scope.basePath + '/v1/ODHTagReduced?localizationlanguage=' + lang + '&validforentity=Gastronomy'
        }).success(function (data) {
            $scope.items = data;
        });
    }

    $scope.getSmgTagNameList($scope.lang);

    $scope.onItemSelected = function () {
        $scope.acconametypeaheadselected = true;
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

        //alert(timeString);

        return timeString.substring(0, length);
    };
});