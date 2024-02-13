// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

var app = angular.module('poi', ['ui.bootstrap', 'ngSanitize', 'appconfig', 'angularFileUpload', 'appfactory', 'leaflet-directive','pathconfig']);

app.controller('poiListController', [
    '$scope', '$http', '$modal', 'appconfig', 'leafletData', 'leafletmapsimple', 'languageFactory', 'apipath',
    function ($scope, $http, $modal, appconfig, leafletData, leafletmapsimple, languageFactory, apipath) {

        console.log(apipath);

        $scope.basePath = apipath;

        $scope.lang = languageFactory.getLanguage();

        var allowedlanguages = ['de', 'it', 'en'];

        $scope.globallocfilter = '';
        $scope.globallocfilterName = '';
        $scope.globallocfilterId = '';
        $scope.globallocfilterType = '';

        $scope.init = function (poitype, locfilter, locfiltertype) {
            //This function is sort of private constructor for controller            
            $scope.poitype = poitype;

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

        $scope.editpoi = function (poi) {

            //if (poi === 'new') {

            //    $scope.newpoi = true;
            //    $scope.poi = { Id: '', Shortname: '' };
            //}
            //else {
            //    $scope.newpoi = false;
            //    $scope.poi = poi;
            //}

            $scope.newpoi = false;
            $scope.poi = poi;

            var modalInstance = $modal.open({
                templateUrl: 'myPoiModal.html',
                controller: PoiModalInstanceCtrl,
                scope: $scope,
                //size: 'lg',
                windowClass: 'modal-wide',
                backdrop: 'static'
            });
        };

        $scope.deletepoi = function (id) {

            var deleteconfirm = confirm('Are you absolutely sure you want to delete?');

            if (deleteconfirm) {
                $http.delete($scope.basePath + '/v1/Poi/' + id).then(function (result) {
                    alert("Poi deleted!");

                    $scope.applyFilter($scope.page);

                    //$.each($scope.pois, function (i) {
                    //    if ($scope.pois[i].Id === id) {
                    //        $scope.pois.splice(i, 1);
                    //        return false;
                    //    }
                    //});
                }, function (error) {
                    alert("Error " + error.status);
                });
            }
        };

        $scope.updatepoi = function (id) {

            $scope.isloading = true;
            $http.get($scope.basePath + '/v1/Update/Poi/' + $scope.poitype + '/' + id).success(function (result) {

                console.log(result);
                $scope.isloading = false;
                alert(result);

                //noamol filter ausfiahrn
                $scope.applyFilter($scope.page);

            }).error(function (data) {
                alert("ERROR:" + data);
            });

        };

        $scope.updateSmgActive = function (PoiID) {

            $.each($scope.pois, function (i) {

                //console.log($scope.activities[i].Id);

                if ($scope.pois[i].Id.toLowerCase() === PoiID.toLowerCase()) {
                    $scope.pois[i].SmgActive = true;

                    return false;
                }
            });

        }

        $scope.opentypeselectormodal = function (poi) {

            var temppoitype = 'null';
            if (poi.PoiType != '' && poi.PoiType != 'null')
                temppoitype = poi.PoiType;

            console.log(temppoitype);

            //Test nochmaliger Request auf Detail
            $http.get($scope.basePath + '../api/SuedtirolType/GetMatchedSuedtirolType/PoiData/' + poi.Type + '/' + poi.SubType.replace('/', '') + '/' + temppoitype).success(function (result) {
                $scope.matchingsuedtiroltype = result;

                $scope.isloading = false;

                $scope.typeselector.ActivityID = poi.Id;
                $scope.typeselector.Type = $scope.matchingsuedtiroltype[0];
                $scope.typeselector.SubType = $scope.matchingsuedtiroltype[1];
                $scope.typeselector.PoiType = $scope.matchingsuedtiroltype[2];

                $scope.typeselector.MatchedDistrict = '';

                //Wenn GPS Info vorhanden ist
                if (poi.GpsInfo != null)
                {
                    $.each(poi.GpsInfo, function (i) {
                        if (poi.GpsInfo[i].Gpstype == 'Standpunkt' || poi.GpsInfo[i].Gpstype == 'Startpunkt' || poi.GpsInfo[i].Gpstype == 'Start und Ziel')
                        {
                            //alert('gpsinfo do');

                            $http.get($scope.basePath + '/v1/Common/GetNearestDistrict/' + poi.GpsInfo[i].Latitude + '/' + poi.GpsInfo[i].Longitude + '/10000').success(function (result) {

                                if(result != null)
                                {
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

        //SMG Tags
        $scope.SelectedSmgTagName = '';
        $scope.SelectedSmgTagId = '';
        $scope.smgtagfilter = 'null';

        //Highlight Filter
        $scope.highlightfilter = 'null';
        $scope.highlight = false;
       
        $scope.SelectedPoiName = '';
        $scope.SelectedPoiId = '';
        $scope.SelectedLocationName = '';
        $scope.SelectedLocationTyp = '';
        $scope.SelectedLocationId = '';

        $scope.subtypefilter = 'null';
        $scope.locationfilter = 'null';
        $scope.poiidfilter = 'null';

        $scope.active = 'null';
        $scope.smgactive = 'null';


        setSubTypeModel();

        //Filter anwenden
        $scope.applyFilter = function (page, withoutrefresh) {

            $scope.isloading = true;            
            $scope.page = page;

            setSubFilter();                        

            var searchfilter = '';
            if ($scope.SelectedPoiName != '') {
                searchfilter = '&searchfilter=' + $scope.SelectedPoiName;
            }
            else
                searchfilter = '';

            $http.get($scope.basePath + '/v1/Poi?pagenumber=' + $scope.page + '&pagesize=20&poitype=' + $scope.poitype + '&subtype=' + $scope.subtypefilter + '&idlist=' + $scope.poiidfilter + '&locfilter=' + $scope.locationfilter + '&highlight=' + $scope.highlightfilter + '&active=' + $scope.active + '&smgactive=' + $scope.smgactive + '&odhtagfilter=' + $scope.smgtagfilter + '&seed=' + $scope.seed + searchfilter).success(function (result) {
                $scope.pois = result.Items;
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
            $scope.SelectedPoiName = '';
            $scope.SelectedPoiId = '';

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

            if (!isNaN($scope.poitype))
                $scope.poitype = '511';


            $scope.subtypefilter = 'null';
            //$scope.locationfilter = 'null';
            $scope.areafilter = 'null';
            $scope.poiidfilter = 'null';
            $scope.smgtagfilter = 'null';
            $scope.SelectedSmgTagName = '';
            $scope.SelectedSmgTagId = '';
            $scope.highlightfilter = 'null';
            $scope.highlight = false;

            $scope.active = 'null';
            $scope.smgactive = 'null';
            
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
            $scope.SelectedPoiName = '';
            $scope.SelectedPoiId = '';
            $scope.poiidfilter = 'null';
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

            //$scope.$broadcast('LoadPoiNamesList');
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

            //$scope.poitype = '511';

            $scope.page = 1;
            $scope.changePage(0);

            //$scope.$broadcast('LoadPoiNamesList');
        }

        $scope.clearMainTypeFilter = function () {

            $.each($scope.checkSubTypeModel, function (i) {
                $scope.checkSubTypeModel[i] = false;
            });

            $scope.poitype = '511';

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
        $scope.showInfoModal = function (poi) {

            $scope.poi = poi;

            leafletmapsimple.preparemap($scope.poi.GpsInfo, $scope.poi.GpsTrack, ['Standpunkt', 'position', 'carparking', 'startingpoint', 'arrivalpoint', 'viewpoint', 'Talstation', 'Bergstation', 'startingandarrivalpoint'], 'poiListController');

            var slidemodalInstance = $modal.open({
                templateUrl: 'myPoiInfoModal.html',
                controller: InfoModalInstanceCtrl,
                scope: $scope,
                size: 'lg'
            });
        };

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
                30: false,
                31: false,
                32: false,                
                33: false,
                34: false,
                35: false,
                36: false,
                37: false,
                38: false,
                39: false,
                40: false,
                41: false,
                42: false,
                43: false,
                44: false,
                45: false,
                46: false,
                47: false,
                48: false,
                49: false,
                50: false
            };
        }

        function setSubFilter() {
            //Regions Filter
            //$scope.subtypefilter = "";

            //if ($scope.checkSubTypeModel.one && $scope.checkSubTypeModel.two && $scope.checkSubTypeModel.three && $scope.checkSubTypeModel.four && $scope.checkSubTypeModel.five && $scope.checkSubTypeModel.six && $scope.checkSubTypeModel.seven && $scope.checkSubTypeModel.eight && $scope.checkSubTypeModel.nine && $scope.checkSubTypeModel.ten && $scope.checkSubTypeModel.eleven && $scope.checkSubTypeModel.twelve && $scope.checkSubTypeModel.thirteen && $scope.checkSubTypeModel.fourteen && $scope.checkSubTypeModel.fiftheen && $scope.checkSubTypeModel.sixteen && $scope.checkSubTypeModel.seventeen && $scope.checkSubTypeModel.eighteen && $scope.checkSubTypeModel.nineteen && $scope.checkSubTypeModel.twenty && $scope.checkSubTypeModel.twentyone && $scope.checkSubTypeModel.twentytwo && $scope.checkSubTypeModel.twentythree && $scope.checkSubTypeModel.twentyfour) {
            //    $scope.subtypefilter = "";
            //}
            //else if (!$scope.checkSubTypeModel.one && !$scope.checkSubTypeModel.two && !$scope.checkSubTypeModel.three && !$scope.checkSubTypeModel.four && !$scope.checkSubTypeModel.five && !$scope.checkSubTypeModel.six && !$scope.checkSubTypeModel.seven && !$scope.checkSubTypeModel.eight && !$scope.checkSubTypeModel.nine && !$scope.checkSubTypeModel.ten && !$scope.checkSubTypeModel.eleven && !$scope.checkSubTypeModel.twelve && !$scope.checkSubTypeModel.thirteen && !$scope.checkSubTypeModel.fourteen && !$scope.checkSubTypeModel.fiftheen && !$scope.checkSubTypeModel.sixteen && !$scope.checkSubTypeModel.seventeen && !$scope.checkSubTypeModel.eighteen && !$scope.checkSubTypeModel.nineteen && !$scope.checkSubTypeModel.twenty && !$scope.checkSubTypeModel.twentyone && !$scope.checkSubTypeModel.twentytwo && !$scope.checkSubTypeModel.twentythree && !$scope.checkSubTypeModel.twentyfour) {
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
            //    if ($scope.checkSubTypeModel.thirteen) {
            //        $scope.subtypefilter = $scope.subtypefilter + "thirteen,";
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
            //    if ($scope.checkSubTypeModel.twentyone) {
            //        $scope.subtypefilter = $scope.subtypefilter + "twentyone,";
            //    }
            //    if ($scope.checkSubTypeModel.twentytwo) {
            //        $scope.subtypefilter = $scope.subtypefilter + "twentytwo,";
            //    }
            //    if ($scope.checkSubTypeModel.twentythree) {
            //        $scope.subtypefilter = $scope.subtypefilter + "twentythree,";
            //    }
            //    if ($scope.checkSubTypeModel.twentyfour) {
            //        $scope.subtypefilter = $scope.subtypefilter + "twentyfour,";
            //    }
            //}

            $scope.subtypefilter = "null";

            var subtypeflagcounter = 0;

            $.each($scope.checkSubTypeModel, function (i) {

                if ($scope.checkSubTypeModel[i] == true) {

                    var shifted2 = lshift(1, i - 1);
                    //var shifted1 = 1 << (i - 1);
                    subtypeflagcounter = subtypeflagcounter + shifted2;                    
                }
            });

            if (subtypeflagcounter > 0) {
                $scope.subtypefilter = subtypeflagcounter;
            }


            //if ($scope.subtypefilter == "")
            //    $scope.subtypefilter = "null";

            if ($scope.highlight)
                $scope.highlightfilter = 'true';
            else
                $scope.highlightfilter = 'null';

            if ($scope.SelectedSmgTagName != '')
                $scope.smgtagfilter = $scope.SelectedSmgTagId;

            $scope.locfilter = 'null';

            if ($scope.SelectedPoiId != '')
                $scope.poiidfilter = $scope.SelectedPoiId;

            if ($scope.SelectedLocationId != '')
                $scope.locationfilter = $scope.SelectedLocationTyp + $scope.SelectedLocationId;

        }

        $scope.pois = [];
    }]);

function lshift(num, bits) {
    return num * Math.pow(2, bits);
}

//Modal Controller
var PoiModalInstanceCtrl = function ($scope, $modalInstance, $http) {

    $scope.ok = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.addpoi = function (poi, isvalid) {

        if (isvalid) {

            $http.post($scope.basePath + '/v1/Poi', poi).then(function (result) {
                alert("Poi added!");
                $scope.pois.push(poi);

                $modalInstance.close();
            }, function (error) {
                alert("Error " + error.status);
            });
        }
        else {
            alert("Invalid Data!");
        }
    };

    $scope.updatepoi = function (poi, isvalid) {

        if (isvalid) {
            $http.put($scope.basePath + '/v1/Poi/' + poi.Id, poi).then(function (result) {
                alert("Poi updated!");
                $modalInstance.close();
            }, function (error) {
                alert("Error " + error.status);
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

            //alert(tag);

            if ($scope.poi.SmgTags != null) {

                $.each($scope.poi.SmgTags, function (i) {

                    if ($scope.poi.SmgTags[i] === tag.toLowerCase()) {

                        alert('Already present!');
                        addToArray = false;

                        return false;
                    }
                });
            }
            else {
                $scope.poi.SmgTags = [];
            }


            if (addToArray) {

                $scope.poi.SmgTags.push(tag.toLowerCase());
            }
        }
        else {
            alert('Invalid Tag!');
        }
    }

    //Remove SMG Tagging
    $scope.deletetag = function (tag) {

        $.each($scope.poi.SmgTags, function (i) {
            if ($scope.poi.SmgTags[i] === tag) {
                $scope.poi.SmgTags.splice(i, 1);
                return false;
            }
        });
    }

    ////Add a Image
    //$scope.onFileSelect = function ($files) {
        
    //    alert('es bild werd aigloden')

    //    for (var i = 0; i < $files.length; i++) {
    //        var $file = $files[i];
    //        $upload.upload({
    //            url: $scope.basePath + '/v1/FileUpload/' + $scope.poi.SubType,
    //            file: $file,
    //            progress: function (e) { }
    //        }).then(function (data, status, headers, config) {
    //            // file is uploaded successfully
    //            console.log(data);

    //            if ($scope.poi.ImageGallery == null) {
    //                $scope.poi.ImageGallery = [];
    //            }

    //            //alert(data.config.file.name);
    //            alert(data[0]);
    //            console.log(data.filename);
    //            //$scope.poi.ImageGallery.push({ ImageName: '', ImageUrl: data.config.file.name, ImageSource: 'SMG', IsInGallery: true });
    //        });
    //    }
    //};

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

            $.each($scope.poi.ImageGallery, function (i) {
                if ($scope.poi.ImageGallery[i].ImageName === bildname) {
                    $scope.poi.ImageGallery.splice(i, 1);
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
    $scope.slides = $scope.poi.ImageGallery;
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

        alert("Copying Poi:" + $scope.typeselector.ActivityID + " Category: " + $scope.typeselector.Type + " " + $scope.typeselector.SubType + " " + $scope.typeselector.PoiType);

        var mytype = $scope.typeselector.Type
        var mysubtype = $scope.typeselector.SubType;
        var mypoitype = $scope.typeselector.PoiType;
        var selecteddistrict = $scope.typeselector.MatchedDistrict;

        if (mytype == "" || mytype == null || mytype == undefined) {
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
        $http.get($scope.basePath + '/v1/SmgPoi/ActivityToSmgPoi/' + $scope.typeselector.ActivityID + '/' + mytype + '/' + mysubtype + '/' + mypoitype + '/' + selecteddistrict + '/LTS/PoiData/Partial').success(function (result) {

            console.log(result);
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

var poitypeaheadcontroller = app.controller('PoinameTypeAheadController', function ($scope, $http) {

    $scope.poinametypeaheadselected = false;

    $scope.getPoinamesFilteredList = function (lang, poitype, subtypefilter, locationfilter, areafilter, highlightfilter, active, smgactive, smgtagfilter) {
        
         $http({
             method: 'Get',
             url: $scope.basePath + '/v1/Poi?pagesize=0&fields=Id,Detail.' + lang + '.Title&language=' + lang + '&poitype=' + poitype + '&subtype=' + subtypefilter + '&locfilter=' + locationfilter + '&areafilter=' + areafilter + '&highlight=' + highlightfilter + '&active=' + active + '&smgactive=' + smgactive + '&odhtagfilter=' + smgtagfilter
        }).success(function (data) {
            var idandnames = [];
            $.each(data.Items, function (i) {
                idandnames.push({ Id: data.Items[i].Id, Name: data.Items[i]["Detail." + lang + ".Title"] });
            });

            $scope.items = idandnames; 
        });
    }
    $scope.$on('LoadPoiNamesList', function (e) {

        //alert("onkemmen");

        $scope.getPoinamesFilteredList($scope.lang, $scope.poitype, $scope.subtypefilter, $scope.locationfilter, 'null', $scope.highlightfilter, $scope.active, $scope.smgactive, $scope.smgtagfilter);
    });

    $scope.getPoinamesFilteredList($scope.lang, $scope.poitype, $scope.subtypefilter, $scope.locationfilter, $scope.areafilter, $scope.highlightfilter, $scope.active, $scope.smgactive, $scope.smgtagfilter);

    $scope.onItemSelected = function () {
        $scope.poinametypeaheadselected = true;
    }
});

var smgtagmodaltypeaheadcontroller = app.controller('SmgTagNameModalTypeAheadController', function ($scope, $http) {

    $scope.smgtagselected = false;

    $scope.getSmgTagNameListModal = function (lang) {

        $http({
            method: 'Get',
            url: $scope.basePath + '/v1/ODHTagReduced?localizationlanguage=' + lang + '&validforentity=' + $scope.poi.Type
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
        if (!isNaN($scope.poitype))
            typestofilter = 'Poi,Ärzte Apotheken,Geschäfte,Kultur und Sehenswürdigkeiten,Nachtleben und Unterhaltung,Öffentliche Einrichtungen,Sport und Freizeit,Verkehr und Transport,Dienstleister,Kunsthandwerker,';


        $http({
            method: 'Get',
            url: $scope.basePath + '/v1/ODHTagReduced?localizationlanguage=' + lang + '&validforentity=' + typestofilter + $scope.poitype
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

        //alert(timeString);

        return timeString.substring(0, length);
    };
});


/**
* The ng-thumb directive
* @author: nerv
* @version: 0.1.2, 2014-01-09
*/
app.directive('ngThumb', ['$window', function ($window) {
    var helper = {
        support: !!($window.FileReader && $window.CanvasRenderingContext2D),
        isFile: function (item) {
            return angular.isObject(item) && item instanceof $window.File;
        },
        isImage: function (file) {
            var type = '|' + file.type.slice(file.type.lastIndexOf('/') + 1) + '|';
            return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
        }
    };

    return {
        restrict: 'A',
        template: '<canvas/>',
        link: function (scope, element, attributes) {
            if (!helper.support) return;

            var params = scope.$eval(attributes.ngThumb);

            if (!helper.isFile(params.file)) return;
            if (!helper.isImage(params.file)) return;

            var canvas = element.find('canvas');
            var reader = new FileReader();

            reader.onload = onLoadFile;
            reader.readAsDataURL(params.file);

            function onLoadFile(event) {
                var img = new Image();
                img.onload = onLoadImage;
                img.src = event.target.result;
            }

            function onLoadImage() {
                var width = params.width || this.width / this.height * params.height;
                var height = params.height || this.height / this.width * params.width;
                canvas.attr({ width: width, height: height });
                canvas[0].getContext('2d').drawImage(this, 0, 0, width, height);
            }
        }
    };
}]);

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
//        url: $scope.basePath + '/v1/FileUpload/pois/' + $scope.poi.SubType
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

//        if ($scope.poi.ImageGallery == null) {
//            $scope.poi.ImageGallery = [];
//        }

//        var UploadedImage = { ImageName: imagename, ImageUrl: imageurl, Width: 0, Height: 0, ImageSource: 'SMG', ImageTitle: { de: '', it: '', en: '' }, ImageDesc: { de: '', it: '', en: '' } }

//        $scope.poi.ImageGallery.push(UploadedImage);

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
