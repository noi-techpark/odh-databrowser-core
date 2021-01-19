var app = angular.module('smgpoi', ['ui.bootstrap', 'ngSanitize', 'appconfig', 'angularFileUpload', 'textAngular', 'appfactory', 'leaflet-directive']);

app.controller('smgpoiListController', [
    '$scope', '$http', '$modal', 'appconfig', 'leafletData', 'leafletmapsimple', 'languageFactory',
    function ($scope, $http, $modal, config, leafletData, leafletmapsimple, languageFactory) {

        $scope.basePath = config.basePath;

        $scope.lang = languageFactory.getLanguage();

        var allowedlanguages = ['de', 'it', 'en', 'nl', 'cs', 'pl', 'fr', 'ru'];

        $scope.globallocfilter = '';
        $scope.globallocfilterName = '';
        $scope.globallocfilterId = '';
        $scope.globallocfilterType = '';

        $scope.predefinedsource = false;

        $scope.page = 1;
        $scope.totalpages = 0;
        $scope.totalcount = 0;
        $scope.seed = 'null';
        $scope.filtered = false;

        //SMG Tags
        $scope.SelectedSmgTagName = '';
        $scope.SelectedSmgTagId = '';
        $scope.smgtagfilter = 'null';

        //Lang Filter
        $scope.langlistfilter = 'null';

        //Highlight Filter
        $scope.highlightfilter = 'null';
        $scope.highlight = false;

        $scope.SelectedPoiName = '';
        $scope.SelectedPoiId = '';
        $scope.SelectedLocationName = '';
        $scope.SelectedLocationTyp = '';
        $scope.SelectedLocationId = '';

        $scope.subtypefilter = 'null';
        $scope.poitypefilter = 'null';
        $scope.locationfilter = 'null';
        $scope.poiidfilter = 'null';

        $scope.active = 'null';
        $scope.smgactive = 'null';

        $scope.source = 'null';

        setSubTypeModel();
        setPoiTypeModel();
        setLanglistModel();

        $scope.init = function (poitype, locfilter, locfiltertype, source) {
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

            if (source != "" && source != undefined) {

                console.log(source);

                $scope.source = source;
                $scope.predefinedsource = true;
            }

            $scope.checkLangListModel[$scope.lang] = true;

            $scope.changePage(0);
        };

        $scope.changeLanguage = function () {

            languageFactory.setLanguage($scope.lang);
            console.log(languageFactory.getLanguage());

            //REfresh Names list

            //Refresh Location List

            //$scope.changePage(0);

            location.reload();
        };

        $scope.editpoi = function (poi) {

            if (poi === 'new') {

                $scope.newpoi = true;
                $scope.poi = { Id: guid(), Shortname: '', Type: $scope.poitype, HasLanguage: [], Highlight: false, Active: false, SmgActive: false, SmgTags: [], LocationInfo: { TvInfo: null, RegionInfo: null, MunicipalityInfo: null, DistrictInfo: null  } };
                $scope.poi.AdditionalPoiInfos = {};
                //Maintype adden
                $scope.poi.AdditionalPoiInfos['de'] = { Novelty: null, MainType: "", SubType: "", PoiType: "", Language: "de" };
                $scope.poi.AdditionalPoiInfos['it'] = { Novelty: null, MainType: "", SubType: "", PoiType: "", Language: "it" };
                $scope.poi.AdditionalPoiInfos['en'] = { Novelty: null, MainType: "", SubType: "", PoiType: "", Language: "en" };
                $scope.poi.AdditionalPoiInfos['nl'] = { Novelty: null, MainType: "", SubType: "", PoiType: "", Language: "nl" };
                $scope.poi.AdditionalPoiInfos['cs'] = { Novelty: null, MainType: "", SubType: "", PoiType: "", Language: "cs" };
                $scope.poi.AdditionalPoiInfos['pl'] = { Novelty: null, MainType: "", SubType: "", PoiType: "", Language: "pl" };
                $scope.poi.AdditionalPoiInfos['fr'] = { Novelty: null, MainType: "", SubType: "", PoiType: "", Language: "fr" };
                $scope.poi.AdditionalPoiInfos['ru'] = { Novelty: null, MainType: "", SubType: "", PoiType: "", Language: "ru" };                
                

                //Update Maintype + smgtag

                //UNTERN Additional muassi des no setzen!
                $http({
                    method: 'Get',
                    //url: $scope.basePath + '/json/LocInfoTvs' + $scope.lang + '.json'
                    url: $scope.basePath + '/v1/SuedtirolType/Single/' + $scope.poitype + '/0/SmgPoi'
                }).success(function (data) {

                    $.each($scope.poi.AdditionalPoiInfos, function (i) {
                        $scope.poi.AdditionalPoiInfos[$scope.poi.AdditionalPoiInfos[i].Language].MainType = data.TypeNames[$scope.poi.AdditionalPoiInfos[i].Language];
                    });

                    //$scope.poi.AdditionalPoiInfos['de'].MainType = data.TypeNames['de'];
                    //$scope.poi.AdditionalPoiInfos['it'].MainType = data.TypeNames['it'];
                    //$scope.poi.AdditionalPoiInfos['en'].MainType = data.TypeNames['en'];
                    //$scope.poi.AdditionalPoiInfos['nl'].MainType = data.TypeNames['nl'];
                    //$scope.poi.AdditionalPoiInfos['cs'].MainType = data.TypeNames['cs'];
                    //$scope.poi.AdditionalPoiInfos['pl'].MainType = data.TypeNames['pl'];
                    //$scope.poi.AdditionalPoiInfos['fr'].MainType = data.TypeNames['fr'];
                    //$scope.poi.AdditionalPoiInfos['ru'].MainType = data.TypeNames['ru'];
                    var addtag = true;
                    $.each($scope.poi.SmgTags, function (i) {
                        if ($scope.poi.SmgTags[i] == data.Key)
                            addtag = false;
                    });
                    if (addtag)
                        $scope.poi.SmgTags.push(data.Key);

                });




                //$scope.poi.SmgTags.push($scope.poitype);

                var modalInstance = $modal.open({
                    templateUrl: 'myPoiModal.html',
                    controller: PoiModalInstanceCtrl,
                    scope: $scope,
                    //size: 'lg',
                    windowClass: 'modal-wide',
                    backdrop: 'static'
                });
            }
            else {
                $scope.newpoi = false;
                //$scope.poi = poi;

                //Test nochmaliger Request auf Detail
                $http.get($scope.basePath + '/v1/SmgPoi/' + poi.Id).success(function (result) {
                    $scope.poi = result;
                   
                    $scope.isloading = false;

                    var modalInstance = $modal.open({
                        templateUrl: 'myPoiModal.html',
                        controller: PoiModalInstanceCtrl,
                        scope: $scope,
                        //size: 'lg',
                        windowClass: 'modal-wide',
                        backdrop: 'static'
                    });
                   
                });
            }

            
        };

        $scope.deletepoi = function (id) {

            var deleteconfirm = confirm('Are you absolutely sure you want to delete?');

            if (deleteconfirm) {
                $http.delete($scope.basePath + '/v1/SmgPoi/' + id).success(function (result) {
                    alert("SmgPoi deleted!");

                    //Noamol holen
                    $scope.applyFilter($scope.page);

                    //Aus liste löschen
                    //$.each($scope.pois, function (i) {
                    //    if ($scope.pois[i].Id === id) {
                    //        $scope.pois.splice(i, 1);
                    //        return false;
                    //    }
                    //});
                }).error(function (data) {
                    alert("ERROR:" + data);
                });
            }
        };
     
        //Filter anwenden
        $scope.applyFilter = function (page, withoutrefresh) {

            $scope.isloading = true;            
            $scope.page = page;

            setSubFilter();                        

            var pagenumberqs = 'pagenumber=' + $scope.page;
            var pagesizeqs = 'pagesize=20';
            var typeqs = 'type=' + $scope.poitype;
            var subtypeqs = 'subtype=' + $scope.subtypefilter;
            var poitypeqs = 'poitype=' + $scope.poitypefilter;
            var pioidqs = 'idlist=' + $scope.poiidfilter;
            var langlistqs = 'langfilter=' + $scope.langlistfilter;
            var locfilterqs = 'locfilter=' + $scope.locationfilter;
            var highlightqs = 'highlight=' + $scope.highlightfilter;
            var activeqs = 'active=' + $scope.active;
            var smgactiveqs = 'odhactive=' + $scope.smgactive;
            var sourceqs = 'source=' + $scope.source;
            var smgtagqs = 'odhtagfilter=' + $scope.smgtagfilter;
            var seedqs = 'seed=' + $scope.seed;

            $http.get($scope.basePath + '/v1/ODHActivityPoi?' + pagenumberqs + '&' + pagesizeqs + '&' + typeqs + '&' + subtypeqs + '&' + poitypeqs + '&' + pioidqs + '&' + langlistqs + '&' + locfilterqs + '&' + highlightqs + '&' + activeqs + '&' + smgactiveqs + '&' + sourceqs + '&' + smgtagqs + '&' + seedqs).success(function (result) {
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
                $scope.poitype = '63';


            $scope.subtypefilter = 'null';
            $scope.poitypefilter = 'null';
            
            $scope.areafilter = 'null';
            $scope.poiidfilter = 'null';
            $scope.smgtagfilter = 'null';
            $scope.SelectedSmgTagName = '';
            $scope.SelectedSmgTagId = '';
            $scope.highlightfilter = 'null';
            $scope.highlight = false;
            $scope.active = 'null';

            if($scope.predefinedsource == false)
                $scope.source = 'null';
            
            $.each($scope.checkSubTypeModel, function (i) {
                $scope.checkSubTypeModel[i] = false;
            });

            $.each($scope.checkPoiTypeModel, function (i) {
                $scope.checkPoiTypeModel[i] = false;
            });

            //Language Filter zurücksetzen
            $scope.langlistfilter = 'null';            
            setLanglistModel();

            $scope.filtered = false;
            $scope.page = 1;
            $scope.changePage(0);

            //$scope.$broadcast('LoadPoiNamesList');
        }

        $scope.clearNameFilter = function () {
            $scope.SelectedPoiName = '';
            $scope.SelectedPoiId = '';            
            $scope.poiidfilter = 'null';
            $scope.page = 1;
            $scope.changePage(0);

            //$scope.$broadcast('LoadPoiNamesList');
        }

        $scope.clearLocationFilter = function () {            

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

        $scope.clearTypeFilter = function () {

            $.each($scope.checkSubTypeModel, function (i) {
                $scope.checkSubTypeModel[i] = false;
            });

            $.each($scope.checkPoiTypeModel, function (i) {
                $scope.checkPoiTypeModel[i] = false;
            });

            $scope.subtypefilter = 'null';
            $scope.poitypefilter = 'null';
            $scope.page = 1;
            $scope.changePage(0);

            //$scope.$broadcast('LoadPoiNamesList');
        }

        $scope.clearActiveFilter = function () {
           
            $scope.active = 'null';            

            $scope.page = 1;
            $scope.changePage(0);

            //$scope.$broadcast('LoadPoiNamesList');
        }

        $scope.clearSmgActiveFilter = function () {

            $scope.smgactive = 'null';

            $scope.page = 1;
            $scope.changePage(0);

            //$scope.$broadcast('LoadPoiNamesList');
        }

        $scope.clearSourceFilter = function () {
            
            $scope.source = 'null';

            $scope.page = 1;
            $scope.changePage(0);

            //$scope.$broadcast('LoadPoiNamesList');
        }

        $scope.clearLanguageFilter = function () {

            $scope.langlistfilter = 'null';
            setLanglistModel();

            $scope.page = 1;
            $scope.changePage(0);

            //$scope.$broadcast('LoadPoiNamesList');
        }

        $scope.clearHighlightFilter = function () {

            $scope.highlightfilter = 'null';
            $scope.highlight = false;

            $scope.page = 1;
            $scope.changePage(0);

            //$scope.$broadcast('LoadPoiNamesList');
        }

        $scope.clearMainTypeFilter = function () {
            $scope.poitype = '63';
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

            leafletmapsimple.preparemap($scope.poi.GpsInfo, $scope.poi.GpsTrack, ['Standpunkt', 'position', 'carparking', 'startingpoint', 'arrivalpoint', 'viewpoint', 'Talstation', 'Bergstation', 'startingandarrivalpoint'], 'smgpoiListController');

            var slidemodalInstance = $modal.open({
                templateUrl: 'myPoiInfoModal.html',
                controller: InfoModalInstanceCtrl,
                scope: $scope,
                size: 'lg'
            });
        };

        $scope.updateDatainList = function (poi){

            //console.log("updaterequestonkemmen");

            //console.log(poi.Id);
            //console.log($scope.pois);

            $.each($scope.pois, function (i) {



                if ($scope.pois[i].Id.toLowerCase() === poi.Id.toLowerCase()) {
                    $scope.pois[i] = poi;
                    console.log("update poi found");
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
                20: false,
                21: false,
                22: false,
                23: false
            };
        }

        function setPoiTypeModel() {

            //Subtype CheckboxFilter
            $scope.checkPoiTypeModel = {
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
                12: false               
            };
        }

        function setLanglistModel() {
            //Subtype CheckboxFilter
            $scope.checkLangListModel = {
                de: false,
                it: false,
                en: false,
                nl: false,
                cs: false,
                pl: false,
                fr: false,
                ru: false,
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
            //if ($scope.subtypefilter == "")
            //    $scope.subtypefilter = "null";

            //new SubType with Flags
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


            //poitypefilter
            //$scope.poitypefilter = "";

            //if ($scope.checkPoiTypeModel.one && $scope.checkPoiTypeModel.two && $scope.checkPoiTypeModel.three && $scope.checkPoiTypeModel.four && $scope.checkPoiTypeModel.five && $scope.checkPoiTypeModel.six && $scope.checkPoiTypeModel.seven && $scope.checkPoiTypeModel.eight && $scope.checkPoiTypeModel.nine && $scope.checkPoiTypeModel.ten && $scope.checkPoiTypeModel.eleven && $scope.checkPoiTypeModel.twelve) {
            //    $scope.poitypefilter = "";
            //}
            //else if (!$scope.checkPoiTypeModel.one && !$scope.checkPoiTypeModel.two && !$scope.checkPoiTypeModel.three && !$scope.checkPoiTypeModel.four && !$scope.checkPoiTypeModel.five && !$scope.checkPoiTypeModel.six && !$scope.checkPoiTypeModel.seven && !$scope.checkPoiTypeModel.eight && !$scope.checkPoiTypeModel.nine && !$scope.checkPoiTypeModel.ten && !$scope.checkPoiTypeModel.eleven && !$scope.checkPoiTypeModel.twelve) {
            //    $scope.poitypefilter = "";
            //}
            //else {

            //    if ($scope.checkPoiTypeModel.one) {
            //        $scope.poitypefilter = $scope.poitypefilter + "one,";
            //    }
            //    if ($scope.checkPoiTypeModel.two) {
            //        $scope.poitypefilter = $scope.poitypefilter + "two,";
            //    }
            //    if ($scope.checkPoiTypeModel.three) {
            //        $scope.poitypefilter = $scope.poitypefilter + "three,";
            //    }
            //    if ($scope.checkPoiTypeModel.four) {
            //        $scope.poitypefilter = $scope.poitypefilter + "four,";
            //    }
            //    if ($scope.checkPoiTypeModel.five) {
            //        $scope.poitypefilter = $scope.poitypefilter + "five,";
            //    }
            //    if ($scope.checkPoiTypeModel.six) {
            //        $scope.poitypefilter = $scope.poitypefilter + "six,";
            //    }
            //    if ($scope.checkPoiTypeModel.seven) {
            //        $scope.poitypefilter = $scope.poitypefilter + "seven,";
            //    }
            //    if ($scope.checkPoiTypeModel.eight) {
            //        $scope.poitypefilter = $scope.poitypefilter + "eight,";
            //    }
            //    if ($scope.checkPoiTypeModel.nine) {
            //        $scope.poitypefilter = $scope.poitypefilter + "nine,";
            //    }
            //    if ($scope.checkPoiTypeModel.ten) {
            //        $scope.poitypefilter = $scope.poitypefilter + "ten,";
            //    }
            //    if ($scope.checkPoiTypeModel.eleven) {
            //        $scope.poitypefilter = $scope.poitypefilter + "eleven,";
            //    }
            //    if ($scope.checkPoiTypeModel.twelve) {
            //        $scope.poitypefilter = $scope.poitypefilter + "twelve,";
            //    }              
            //}
            //if ($scope.poitypefilter == "")
            //    $scope.poitypefilter = "null";
            //Ende poitypefilter

            //NEW PoiTypeFilter with Flags
            $scope.poitypefilter = "null";

            var poitypeflagcounter = 0;

            $.each($scope.checkPoiTypeModel, function (i) {

                if ($scope.checkPoiTypeModel[i] == true) {

                    var shifted2 = lshift(1, i - 1);
                    //var shifted1 = 1 << (i - 1);
                    poitypeflagcounter = poitypeflagcounter + shifted2;
                }
            });

            if (poitypeflagcounter > 0) {
                $scope.poitypefilter = poitypeflagcounter;
            }


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

            //Subtype Filter
            $scope.langlistfilter = "";

            if ($scope.checkLangListModel.de && $scope.checkLangListModel.it && $scope.checkLangListModel.en && $scope.checkLangListModel.nl && $scope.checkLangListModel.cs && $scope.checkLangListModel.pl && $scope.checkLangListModel.fr && $scope.checkLangListModel.ru) {
                $scope.langlistfilter = "";
            }
            else if (!$scope.checkLangListModel.de && !$scope.checkLangListModel.it && !$scope.checkLangListModel.en && !$scope.checkLangListModel.nl && !$scope.checkLangListModel.cs && !$scope.checkLangListModel.pl && !$scope.checkLangListModel.fr && !$scope.checkLangListModel.ru) {
                $scope.langlistfilter = "";
            }
            else {

                if ($scope.checkLangListModel.de) {
                    $scope.langlistfilter = $scope.langlistfilter + "de,";
                }
                if ($scope.checkLangListModel.it) {
                    $scope.langlistfilter = $scope.langlistfilter + "it,";
                }
                if ($scope.checkLangListModel.en) {
                    $scope.langlistfilter = $scope.langlistfilter + "en,";
                }
                if ($scope.checkLangListModel.nl) {
                    $scope.langlistfilter = $scope.langlistfilter + "nl,";
                }
                if ($scope.checkLangListModel.cs) {
                    $scope.langlistfilter = $scope.langlistfilter + "cs,";
                }
                if ($scope.checkLangListModel.pl) {
                    $scope.langlistfilter = $scope.langlistfilter + "pl,";
                }
                if ($scope.checkLangListModel.fr) {
                    $scope.langlistfilter = $scope.langlistfilter + "fr,";
                }
                if ($scope.checkLangListModel.ru) {
                    $scope.langlistfilter = $scope.langlistfilter + "ru,";
                }
            }
            if ($scope.langlistfilter == "")
                $scope.langlistfilter = "null";

        }
        
        $scope.poi = [];

        $scope.pois = [];

        //$scope.$on('UpdateSubTypeFileUpload', function (e) {

        //    alert("onkemmen");

        //    console.log('scope ' + $scope.poi.SubType);
        //});
    }]);

var wysiwygeditorCtrl = function ($scope) {
    $scope.htmlcontentbase = "<div></div>";
    $scope.htmlcontentintro = "<div></div>";
    $scope.disabled = false;
};

function lshift(num, bits) {
    return num * Math.pow(2, bits);
}

//Modal Controller
var PoiModalInstanceCtrl = function ($scope, $modalInstance, $http) {

    $scope.smgnewproperty = {};
    $scope.smgtag = {};
    $scope.relatedcontent = {};
    $scope.relatedcontentgastro = {};
    $scope.relatedcontentevent = {};
    $scope.webcam = {};

    $scope.ok = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.cancel = function () {

        var cancelconfirm = confirm('Close and dismiss changes?');

        if (cancelconfirm) {
            $modalInstance.dismiss('cancel');
        }
    };

    $scope.addpoi = function (poi, isvalid) {

        if (isvalid) {

            $http.post($scope.basePath + '/v1/SmgPoi', poi).success(function (result) {
                alert("Poi added!");
                $scope.pois.push(poi);

                $modalInstance.close();
            });
        }
        else {
            alert("Invalid Data!");
        }
    };

    $scope.updatepoi = function (poi, isvalid) {

        if (isvalid) {
            $http.put($scope.basePath + '/v1/SmgPoi/' + poi.Id, poi).success(function (result) {
                alert("Poi updated!");
                $modalInstance.close();

                //I ersetz iatz die Parent Liste mit der Updgedatetn
                $scope.$parent.updateDatainList(poi);
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
    $scope.addtag = function () {

        if ($scope.smgtag.smgtagid != "" && $scope.smgtag.smgtagid != undefined) {

            var addToArray = true;

            //alert(tag);

            if ($scope.poi.SmgTags != null) {

                $.each($scope.poi.SmgTags, function (i) {

                    if ($scope.poi.SmgTags[i] === $scope.smgtag.smgtagid.toLowerCase()) {

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

                $scope.poi.SmgTags.push($scope.smgtag.smgtagid.toLowerCase());
                $scope.smgtag.smgtagid = '';
                $scope.smgtag.smgtagname = '';
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

    //Add Property
    $scope.addproperty = function (lang) {
        
        if ($scope.smgnewproperty.Name != '' && $scope.smgnewproperty.Value != '') {
            var addToArray = true;
                        
            if ($scope.poi.PoiProperty == null || $scope.poi.PoiProperty == undefined) {
      
                $scope.poi.PoiProperty = {};
                //$scope.poi.PoiProperty[lang] = [];
            }

            if ($scope.poi.PoiProperty[lang] == null || $scope.poi.PoiProperty[lang] == undefined) {
                
                $scope.poi.PoiProperty[lang] = [];
            }


            if ($scope.poi.PoiProperty[lang] != null) {
              
                $.each($scope.poi.PoiProperty[lang], function (i) {

                    if ($scope.poi.PoiProperty[lang][i] === $scope.smgnewproperty.Name) {

                        alert('Already present!');
                        addToArray = false;

                        return false;
                    }
                });
            }      


            if (addToArray) {
                var property = { Name: $scope.smgnewproperty.Name, Value: $scope.smgnewproperty.Value };
                
                //console.log(property);

                $scope.poi.PoiProperty[lang].push(property);

                console.log($scope.poi.PoiProperty[lang]);

                $scope.smgnewproperty.Name = '';
                $scope.smgnewproperty.Value = '';
            }
        }
    }

    //Remove SMG Tagging
    $scope.deleteproperty = function (property, lang) {

        $.each($scope.poi.PoiProperty[lang], function (i) {
            if ($scope.poi.PoiProperty[lang][i].Name === property) {
                $scope.poi.PoiProperty[lang].splice(i, 1);
                return false;
            }
        });
    }

    //Add Related Content
    $scope.addrelatedcontent = function (relatedcontent) {

        if (relatedcontent.Id != "" && relatedcontent.Id != undefined) {

            var addToArray = true;

            var relatedcontentdata = { Id: relatedcontent.Id, Type: relatedcontent.Type, Name: relatedcontent.Name }

            if ($scope.poi.RelatedContent != null) {

                $.each($scope.poi.RelatedContent, function (i) {

                    if ($scope.poi.RelatedContent[i].Id === relatedcontent.id) {

                        alert('Already present!');
                        addToArray = false;

                        return false;
                    }
                });
            }
            else {
                $scope.poi.RelatedContent = [];
            }


            if (addToArray) {

                $scope.poi.RelatedContent.push(relatedcontentdata);
                $scope.relatedcontent.Id = '';
                $scope.relatedcontent.Name = '';
                $scope.relatedcontent.Type = '';

                $scope.relatedcontentgastro.Id = '';
                $scope.relatedcontentgastro.Name = '';
                $scope.relatedcontentgastro.Type = '';

                $scope.relatedcontentevent.Id = '';
                $scope.relatedcontentevent.Name = '';
                $scope.relatedcontentevent.Type = '';

                //$scope.relatedcontentwine.Id = '';
                //$scope.relatedcontentwine.Name = '';
                //$scope.relatedcontentwine.Type = '';
            }
        }
        else {
            alert('Invalid Related Content!');
        }
    }

    //Remove Related Content
    $scope.deleterelatedcontent = function (relatedcontent) {

        $.each($scope.poi.RelatedContent, function (i) {
            if ($scope.poi.RelatedContent[i].Id === relatedcontent.Id) {
                $scope.poi.RelatedContent.splice(i, 1);
                return false;
            }
        });
    }

    //Bild löschen
    $scope.deletebild = function (bildname, bildurl, bildsource) {


        //FEHLER! wenn LTS Bild gehts nicht......
        if (bildsource == "SMG" || bildsource == "Magnolia" || bildsource == "Content") {
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
                    if ($scope.poi.ImageGallery[i].ImageUrl === bildurl) {
                        $scope.poi.ImageGallery.splice(i, 1);
                        return false;
                    }
                });
            });
        }
        else if(bildsource == "LTS")
        {
            $.each($scope.poi.ImageGallery, function (i) {
                if ($scope.poi.ImageGallery[i].ImageName === bildname) {
                    $scope.poi.ImageGallery.splice(i, 1);
                    return false;
                }
            });
        }
    };

    //GPS Add
    $scope.addgps = function (gps) {
        //var myteilnehmer = teilnehmer;
        if ($scope.poi.GpsInfo == null) {
            $scope.poi.GpsInfo = [];
        }

        var addToArray = true;

        $.each($scope.poi.GpsInfo, function (i) {

            if ($scope.poi.GpsInfo[i].Gpstype === gps.typ) {

                alert(gps.typ + ' already defined, Updating!');

                $scope.poi.GpsInfo[i] = { Gpstype: gps.typ, Longitude: gps.longitude, Latitude: gps.latitude, Altitude: gps.altitude, AltitudeUnitofMeasure: "m" };
                $scope.gps = { Gpstype: '', Longitude: '', Latitude: '', Altitude: '', AltitudeUnitofMeasure: '' };
                addToArray = false;

                return false;
            }
        });


        if (addToArray) {

            $scope.poi.GpsInfo.push({ Gpstype: gps.typ, Longitude: gps.longitude, Latitude: gps.latitude, Altitude: gps.altitude, AltitudeUnitofMeasure: "m" });
            $scope.gps = { Gpstype: '', Longitude: '', Latitude: '', Altitude: '', AltitudeUnitofMeasure: '' };
        }
    };

    //GPS Delete
    $scope.deletegps = function (Gpstype) {

        var deleteconfirm = confirm('Are you absolutely sure you want to delete?');

        if (deleteconfirm) {

            $.each($scope.poi.GpsInfo, function (i) {
                if ($scope.poi.GpsInfo[i].Gpstype === Gpstype) {
                    $scope.poi.GpsInfo.splice(i, 1);
                    return false;
                }
            });
        }
    };    

    //GPX Track delete
    $scope.deletegpstrack = function (gpstrackid) {

        var deleteconfirm = confirm('Are you absolutely sure you want to delete?');

        if (deleteconfirm) {

            $.each($scope.poi.GpsTrack, function (i) {
                if ($scope.poi.GpsTrack[i].Id === gpstrackid) {
                    $scope.poi.GpsTrack.splice(i, 1);
                    return false;
                }
            });
        }
    };

    $scope.gps = { Gpstype: '', Longitude: '', Latitude: '', Altitude: '', AltitudeUnitofMeasure: '' };
    $scope.gpxfile = '';

    //Season add
    $scope.addseason = function (season) {
        //var myteilnehmer = teilnehmer;
        if ($scope.poi.OperationSchedule == null || $scope.poi.OperationSchedule == undefined) {

            $scope.poi.OperationSchedule = [];
        }
       
        $scope.poi.OperationSchedule.push(season);

        $scope.season = { OperationscheduleName: operationschedulename, Start: '', Stop: '', Type : '1', ClosedonPublicHolidays: '', OperationScheduleTime: [] };
    };

    $scope.deleteseason = function (season, lang) {

        var deleteconfirm = confirm('Are you absolutely sure you want to delete?');

        if (deleteconfirm) {

            $.each($scope.poi.OperationSchedule, function (i) {
                if ($scope.poi.OperationSchedule[i] === season) {
                    $scope.poi.OperationSchedule.splice(i, 1);
                    return false;
                }
            });
        }

    }

    $scope.addseasontime = function (operationschedule, operationscheduletime, lang) {
        
        $.each($scope.poi.OperationSchedule, function (i) {

            if ($scope.poi.OperationSchedule[i] === operationschedule) {

                console.log(i + "found equal");

                console.log($scope.poi.OperationSchedule[i].OperationScheduleTime);

                if ($scope.poi.OperationSchedule[i].OperationScheduleTime == null || $scope.poi.OperationSchedule[i].OperationScheduleTime == undefined) {

                    //alert("nuies time objekt");
                    $scope.poi.OperationSchedule[i].OperationScheduleTime = [];
                }

                //alert(operationscheduletime.Start + " " + operationscheduletime.End);

                $scope.poi.OperationSchedule[i].OperationScheduleTime.push(operationscheduletime);
            }
        });        

        $scope.operationscheduletime = { Start: '', End: '', Monday: true, Tuesday: true, Wednesday: true, Thuresday: true, Friday: true, Saturday: true, Sunday: true, State: 2, Timecode: 1 }
    };

    $scope.deleteseasontime = function (operationscheduletime, operationschedule, lang) {
        $.each($scope.poi.OperationSchedule, function (i) {

            if ($scope.poi.OperationSchedule[i] === operationschedule) {

                $.each($scope.poi.OperationSchedule[i].OperationScheduleTime, function (j) {

                    if($scope.poi.OperationSchedule[i].OperationScheduleTime[j] == operationscheduletime)
                    {
                        console.log('löschn');
                        $scope.poi.OperationSchedule[i].OperationScheduleTime.splice(j, 1);
                        return false;
                    }

                });

            }
        });
    };


    var operationschedulename = { de: "Öffnungszeiten", it: "orari d'apertura", en: "opening times", nl: "opening times", cs: "opening times", pl: "opening times" };

    $scope.season = { OperationscheduleName: operationschedulename, Start: '', Stop: '', Type: '1', ClosedonPublicHolidays: '', OperationScheduleTime: [] };

    $scope.operationscheduletime = { Start: '', End: '', Monday: true, Tuesday: true, Wednesday: true, Thuresday: true, Friday: true, Saturday: true, Sunday: true, State: 2, Timecode: 1 };
    
    //Add Detail Themed
    $scope.addwebcam = function (webcam) {

        if ($scope.poi.Webcam == null) {

            $scope.poi.Webcam = [];
        }

        var gpsinfo = { Gpstype: 'position', Latitude: webcam.Latitude, Longitude: webcam.Longitude, Altitude: webcam.Altitude, AltitudeUnitofMeasure: 'm' };
        var webcamname = { de: webcam.Webcamname, it: webcam.Webcamname, en: webcam.Webcamname, nl: webcam.Webcamname, cs: webcam.Webcamname, pl: webcam.Webcamname, fr: webcam.Webcamname, ru: webcam.Webcamname };

        var webcamtoadd = { WebcamId: guid(), Webcamname: webcamname, Webcamurl: webcam.Webcamurl, GpsInfo: gpsinfo, ListPosition: webcam.ListPosition };


        $scope.poi.Webcam.push(webcamtoadd);

        $scope.webcam.WebcamId = '';
        $scope.webcam.Webcamname = '';
        $scope.webcam.Webcamurl = '';
        $scope.webcam.Latitude = '';
        $scope.webcam.Longitude = '';
        $scope.webcam.Altitude = '';
        $scope.webcam.ListPosition = '';
    }

    //Remove District Tagging
    $scope.deletewebcam = function (webcam) {

        $.each($scope.poi.Webcam, function (i) {
            if ($scope.poi.Webcam[i] === webcam) {
                $scope.poi.Webcam.splice(i, 1);
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

//Tourismverein Select controller
var tourismvereinlistcontroller = app.controller('TourismVereinSelectController', function ($scope, $http) {
  
        $http({
            method: 'Get',
            url: $scope.basePath + '/json/LocInfoTvs' + $scope.lang + '.json'
            //url: $scope.basePath + '/v1/Common/TourismvereinList/Reduced/' + $scope.lang + '/100'  --> PRoblem mit Lowercase IDs
        }).success(function (data) {            
            $scope.tourismorganizationlist = data;
        });

        $scope.changetourismusverein = function(selectedtv)
        {
            $http({
                method: 'Get',
                url: $scope.basePath + '/v1/TourismAssociation/' + selectedtv
            }).success(function (data) {

                if ($scope.poi.LocationInfo.TvInfo == null) {
                    
                    //var tvobject = {};
                    //tvobject.Id = selectedtv;
                    //tvobject.Name = {};
                    //tvobject.Name['de'] = data.Detail['de'].Title;
                    //tvobject.Name['it'] = data.Detail['it'].Title;
                    //tvobject.Name['en'] = data.Detail['en'].Title;
                    //tvobject.Name['nl'] = data.Detail['nl'].Title;
                    //tvobject.Name['cs'] = data.Detail['cs'].Title;
                    //tvobject.Name['pl'] = data.Detail['pl'].Title;

                    //$scope.poi.LocationInfo.TvInfo = tvobject;

                    $scope.poi.LocationInfo.TvInfo = {};
                    $scope.poi.LocationInfo.TvInfo.Id = "";
                    $scope.poi.LocationInfo.TvInfo.Name = {};
                }
                
                $scope.poi.LocationInfo.TvInfo.Id = selectedtv;
                $scope.poi.LocationInfo.TvInfo.Name = {};
                $scope.poi.LocationInfo.TvInfo.Name['de'] = data.Detail['de'].Title;
                $scope.poi.LocationInfo.TvInfo.Name['it'] = data.Detail['it'].Title;
                $scope.poi.LocationInfo.TvInfo.Name['en'] = data.Detail['en'].Title;
                $scope.poi.LocationInfo.TvInfo.Name['nl'] = data.Detail['nl'].Title;
                $scope.poi.LocationInfo.TvInfo.Name['cs'] = data.Detail['cs'].Title;
                $scope.poi.LocationInfo.TvInfo.Name['pl'] = data.Detail['pl'].Title;
                $scope.poi.LocationInfo.TvInfo.Name['fr'] = data.Detail['fr'].Title;
                $scope.poi.LocationInfo.TvInfo.Name['ru'] = data.Detail['ru'].Title;

                    //$.each($scope.poi.LocationInfo.TvInfo.Name, function (key, value) {
                    //    $scope.poi.LocationInfo.TvInfo.Name[key] = data.Detail[key].Title;
                    //});
                

                $http({
                    method: 'Get',
                    url: $scope.basePath + '/v1/Region/' + data.RegionId
                }).success(function (data2) {

                    if ($scope.poi.LocationInfo.RegionInfo == null) {
                        //var regionobject = {};
                        //regionobject.Id = data2.Id;
                        //regionobject.Name = {};
                        //regionobject.Name['de'] = data2.Detail['de'].Title;
                        //regionobject.Name['it'] = data2.Detail['it'].Title;
                        //regionobject.Name['en'] = data2.Detail['en'].Title;
                        //regionobject.Name['nl'] = data2.Detail['nl'].Title;
                        //regionobject.Name['cs'] = data2.Detail['cs'].Title;
                        //regionobject.Name['pl'] = data2.Detail['pl'].Title;

                        //$scope.poi.LocationInfo.RegionInfo = regionobject;

                        $scope.poi.LocationInfo.RegionInfo = {};
                        $scope.poi.LocationInfo.RegionInfo.Id = "";
                        $scope.poi.LocationInfo.RegionInfo.Name = {};
                    }

                    $scope.poi.LocationInfo.RegionInfo.Id = data2.Id;
                    $scope.poi.LocationInfo.RegionInfo.Name = {};
                    $scope.poi.LocationInfo.RegionInfo.Name['de'] = data2.Detail['de'].Title;
                    $scope.poi.LocationInfo.RegionInfo.Name['it'] = data2.Detail['it'].Title;
                    $scope.poi.LocationInfo.RegionInfo.Name['en'] = data2.Detail['en'].Title;
                    $scope.poi.LocationInfo.RegionInfo.Name['nl'] = data2.Detail['nl'].Title;
                    $scope.poi.LocationInfo.RegionInfo.Name['cs'] = data2.Detail['cs'].Title;
                    $scope.poi.LocationInfo.RegionInfo.Name['pl'] = data2.Detail['pl'].Title;
                    $scope.poi.LocationInfo.RegionInfo.Name['fr'] = data2.Detail['fr'].Title;
                    $scope.poi.LocationInfo.RegionInfo.Name['ru'] = data2.Detail['ru'].Title;

                    //$.each($scope.poi.LocationInfo.RegionInfo.Name, function (key, value) {
                    //    $scope.poi.LocationInfo.RegionInfo.Name[key] = data2.Detail[key].Title;
                    //});

                    console.log($scope.poi.LocationInfo);
                });
                

                //broadcast Update District List
                $scope.$broadcast('LoadFilteredDistrictNamesList');

            });                      
        }
});

//District Select controller
var districtlistcontroller = app.controller('DistrictSelectController', function ($scope, $http) {

    var mydistrictserviceurl = $scope.basePath + '/json/LocInfoFrawithMun' + $scope.lang + '.json';
    //Nur wenn TV ID gewählt ist
    if ($scope.poi.LocationInfo.TvInfo != null) {
        if ($scope.poi.LocationInfo.TvInfo.Id != null) {
            mydistrictserviceurl = $scope.basePath + '/v1/Location/DistrictReducedbyTv/de/' + $scope.poi.LocationInfo.TvInfo.Id;
        }
    }


    $http({
        method: 'Get',
        //url: $scope.basePath + '/json/LocInfoFrawithMun' + $scope.lang + '.json'
        url: mydistrictserviceurl
    }).success(function (data) {
        $scope.districtlist = data;
    });

    $scope.$on('LoadFilteredDistrictNamesList', function (e) {

        //alert('onkemmen' + $scope.poi.LocationInfo.TvInfo.Id);

        $http({
            method: 'Get',
            url: $scope.basePath + '/v1/Location/DistrictReducedbyTv/de/' + $scope.poi.LocationInfo.TvInfo.Id

        }).success(function (data) {
            $scope.districtlist = data;
        });

    });


    $scope.changedistrict = function (selectedfra) {
        $http({
            method: 'Get',
            url: $scope.basePath + '/v1/District/' + selectedfra
        }).success(function (data) {

            

            if ($scope.poi.LocationInfo.DistrictInfo == null || $scope.poi.LocationInfo.DistrictInfo == undefined) {

                $scope.poi.LocationInfo.DistrictInfo = {};
                $scope.poi.LocationInfo.DistrictInfo.Id = "";
                $scope.poi.LocationInfo.DistrictInfo.Name = {};
 
            }

            //console.log($scope.poi.LocationInfo.DistrictInfo);

            $scope.poi.LocationInfo.DistrictInfo.Id = data.Id;
            $scope.poi.LocationInfo.DistrictInfo.Name = {};
            $scope.poi.LocationInfo.DistrictInfo.Name['de'] = data.Detail['de'].Title;
            $scope.poi.LocationInfo.DistrictInfo.Name['it'] = data.Detail['it'].Title;
            $scope.poi.LocationInfo.DistrictInfo.Name['en'] = data.Detail['en'].Title;
            $scope.poi.LocationInfo.DistrictInfo.Name['nl'] = data.Detail['nl'].Title;
            $scope.poi.LocationInfo.DistrictInfo.Name['cs'] = data.Detail['cs'].Title;
            $scope.poi.LocationInfo.DistrictInfo.Name['pl'] = data.Detail['pl'].Title;
            $scope.poi.LocationInfo.DistrictInfo.Name['fr'] = data.Detail['fr'].Title;
            $scope.poi.LocationInfo.DistrictInfo.Name['ru'] = data.Detail['ru'].Title;

            //$.each($scope.poi.LocationInfo.DistrictInfo.Name, function (key, value) {
            //    $scope.poi.LocationInfo.DistrictInfo.Name[key] = data.Detail[key].Title;
            //});



            $http({
                method: 'Get',
                url: $scope.basePath + '/v1/Municipality/' + data.MunicipalityId
            }).success(function (data2) {

                if ($scope.poi.LocationInfo.MunicipalityInfo == null || $scope.poi.LocationInfo.MunicipalityInfo == undefined) {

                    $scope.poi.LocationInfo.MunicipalityInfo = {};
                    $scope.poi.LocationInfo.MunicipalityInfo.Id = "";
                    $scope.poi.LocationInfo.MunicipalityInfo.Name = { };
                }

                $scope.poi.LocationInfo.MunicipalityInfo.Id = data2.Id;
                $scope.poi.LocationInfo.MunicipalityInfo.Name = {};
                $scope.poi.LocationInfo.MunicipalityInfo.Name['de'] = data2.Detail['de'].Title;
                $scope.poi.LocationInfo.MunicipalityInfo.Name['it'] = data2.Detail['it'].Title;
                $scope.poi.LocationInfo.MunicipalityInfo.Name['en'] = data2.Detail['en'].Title;
                $scope.poi.LocationInfo.MunicipalityInfo.Name['nl'] = data2.Detail['nl'].Title;
                $scope.poi.LocationInfo.MunicipalityInfo.Name['cs'] = data2.Detail['cs'].Title;
                $scope.poi.LocationInfo.MunicipalityInfo.Name['pl'] = data2.Detail['pl'].Title;
                $scope.poi.LocationInfo.MunicipalityInfo.Name['fr'] = data2.Detail['fr'].Title;
                $scope.poi.LocationInfo.MunicipalityInfo.Name['ru'] = data2.Detail['ru'].Title;

                //$.each($scope.poi.LocationInfo.MunicipalityInfo.Name, function (key, value) {
                //    $scope.poi.LocationInfo.MunicipalityInfo.Name[key] = data2.Detail[key].Title;
                //});

                console.log($scope.poi.LocationInfo);
            });            
        });
    }
});

//Controller für Typen Maintype Subtype Poitype
var TypeSelectController = app.controller('TypeSelectController', function ($scope, $http) {    

    //geat et
    //$scope.$on('AddNewMainTypeInfo', function (e) {

    //    alert('onkemmen');
    //    $scope.changemaintype($scope.poitype)

    //});


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
            url: $scope.basePath + '/v1/SuedtirolType/Filtered/' + $scope.poi.Type + '/1/SmgPoi'
        }).success(function (data) {
            $scope.subtypeslist = data;
        });

        $http({
            method: 'Get',
            //url: $scope.basePath + '/json/LocInfoTvs' + $scope.lang + '.json'
            url: $scope.basePath + '/v1/SuedtirolType/Filtered/' + $scope.poi.SubType + '/2/SmgPoi'
        }).success(function (data) {
            $scope.poitypeslist = data;
        });
   
    
       
   

    $scope.changemaintype = function (selectedmaintype) {

        //console.log(selectedmaintype);

        $http({
            method: 'Get',
            //url: $scope.basePath + '/json/LocInfoTvs' + $scope.lang + '.json'
            url: $scope.basePath + '/v1/SuedtirolType/Filtered/' + $scope.poi.Type + '/1/SmgPoi'
        }).success(function (data) {
            $scope.subtypeslist = data;
        });

        //Cleare die Poi Poi Types und Subtypes
        $scope.poitypeslist = [];
        $scope.poi.SubType = '';
        $scope.poi.PoiType = '';

        $.each($scope.poi.AdditionalPoiInfos, function (i) {
            $scope.poi.AdditionalPoiInfos[$scope.poi.AdditionalPoiInfos[i].Language].SubType = '';
            $scope.poi.AdditionalPoiInfos[$scope.poi.AdditionalPoiInfos[i].Language].PoiType = '';
        });        

        

        //UNTERN Additional muassi des no setzen!
        $http({
            method: 'Get',
            //url: $scope.basePath + '/json/LocInfoTvs' + $scope.lang + '.json'
            url: $scope.basePath + '/v1/SuedtirolType/Single/' + selectedmaintype + '/0/SmgPoi'
        }).success(function (data) {

            $.each($scope.poi.AdditionalPoiInfos, function (i) {
                $scope.poi.AdditionalPoiInfos[$scope.poi.AdditionalPoiInfos[i].Language].MainType = data.TypeNames[$scope.poi.AdditionalPoiInfos[i].Language];                
            });

            //$scope.poi.AdditionalPoiInfos['de'].MainType = data.TypeNames['de'];
            //$scope.poi.AdditionalPoiInfos['it'].MainType = data.TypeNames['it'];
            //$scope.poi.AdditionalPoiInfos['en'].MainType = data.TypeNames['en'];
            //$scope.poi.AdditionalPoiInfos['nl'].MainType = data.TypeNames['nl'];
            //$scope.poi.AdditionalPoiInfos['cs'].MainType = data.TypeNames['cs'];
            //$scope.poi.AdditionalPoiInfos['pl'].MainType = data.TypeNames['pl'];
            //$scope.poi.AdditionalPoiInfos['fr'].MainType = data.TypeNames['fr'];
            //$scope.poi.AdditionalPoiInfos['ru'].MainType = data.TypeNames['ru'];
            var addtag = true;
            $.each($scope.poi.SmgTags, function (i) {
                if ($scope.poi.SmgTags[i] == data.Key)
                    addtag = false;
            });
            if (addtag)
                $scope.poi.SmgTags.push(data.Key);

        });
    }

    $scope.changesubtype = function (selectedsubtype) {        

        $http({
            method: 'Get',
            //url: $scope.basePath + '/json/LocInfoTvs' + $scope.lang + '.json'
            url: $scope.basePath + '/v1/SuedtirolType/Filtered/' + $scope.poi.SubType + '/2/SmgPoi'
        }).success(function (data) {
            $scope.poitypeslist = data;
        });

        //Cleare die Poi Poi Types und Subtypes        
        $scope.poi.PoiType = '';

        //console.log($scope.poi.SubType);
        //console.log($scope.$parent.poi.SubType);

        //$scope.$emit('UpdateSubTypeFileUpload');

        $.each($scope.poi.AdditionalPoiInfos, function (i) {            
            $scope.poi.AdditionalPoiInfos[$scope.poi.AdditionalPoiInfos[i].Language].PoiType = '';
        });


        //UNTERN Additional muassi des no setzen!
        $http({
            method: 'Get',
            //url: $scope.basePath + '/json/LocInfoTvs' + $scope.lang + '.json'
            url: $scope.basePath + '/v1/SuedtirolType/Single/' + selectedsubtype + '/1/SmgPoi'
        }).success(function (data) {

            //$.each($scope.poi.HasLanguage, function (i) {

            //    $scope.poi.AdditionalPoiInfos[$scope.poi.HasLanguage[i]].SubType = data.TypeNames[$scope.poi.HasLanguage[i]];
            //});

            $.each($scope.poi.AdditionalPoiInfos, function (i) {
                $scope.poi.AdditionalPoiInfos[$scope.poi.AdditionalPoiInfos[i].Language].SubType = data.TypeNames[$scope.poi.AdditionalPoiInfos[i].Language];
            });

            //$scope.poi.AdditionalPoiInfos['de'].SubType = data.TypeNames['de'];
            //$scope.poi.AdditionalPoiInfos['it'].SubType = data.TypeNames['it'];
            //$scope.poi.AdditionalPoiInfos['en'].SubType = data.TypeNames['en'];
            //$scope.poi.AdditionalPoiInfos['nl'].SubType = data.TypeNames['nl'];
            //$scope.poi.AdditionalPoiInfos['cs'].SubType = data.TypeNames['cs'];
            //$scope.poi.AdditionalPoiInfos['pl'].SubType = data.TypeNames['pl'];
            //$scope.poi.AdditionalPoiInfos['fr'].SubType = data.TypeNames['fr'];
            //$scope.poi.AdditionalPoiInfos['ru'].SubType = data.TypeNames['ru'];

            var addtag = true;
            $.each($scope.poi.SmgTags, function (i) {
                if ($scope.poi.SmgTags[i] == data.Key)
                    addtag = false;
            });
            if (addtag)
                $scope.poi.SmgTags.push(data.Key);
        });
    }

    $scope.changepoitype = function (selectedpoitype) {
        
        //UNTERN Additional muassi des no setzen!
        $http({
            method: 'Get',
            //url: $scope.basePath + '/json/LocInfoTvs' + $scope.lang + '.json'
            url: $scope.basePath + '/v1/SuedtirolType/Single/' + selectedpoitype + '/2/SmgPoi'
        }).success(function (data) {

            //$.each($scope.poi.HasLanguage, function (i) {

            //    $scope.poi.AdditionalPoiInfos[$scope.poi.HasLanguage[i]].PoiType = data.TypeNames[$scope.poi.HasLanguage[i]];
            //});

            $.each($scope.poi.AdditionalPoiInfos, function (i) {
                $scope.poi.AdditionalPoiInfos[$scope.poi.AdditionalPoiInfos[i].Language].PoiType = data.TypeNames[$scope.poi.AdditionalPoiInfos[i].Language];
            });

            //$scope.poi.AdditionalPoiInfos['de'].PoiType = data.TypeNames['de'];
            //$scope.poi.AdditionalPoiInfos['it'].PoiType = data.TypeNames['it'];
            //$scope.poi.AdditionalPoiInfos['en'].PoiType = data.TypeNames['en'];
            //$scope.poi.AdditionalPoiInfos['nl'].PoiType = data.TypeNames['nl'];
            //$scope.poi.AdditionalPoiInfos['cs'].PoiType = data.TypeNames['cs'];
            //$scope.poi.AdditionalPoiInfos['pl'].PoiType = data.TypeNames['pl'];
            //$scope.poi.AdditionalPoiInfos['fr'].PoiType = data.TypeNames['fr'];
            //$scope.poi.AdditionalPoiInfos['ru'].PoiType = data.TypeNames['ru'];

            var addtag = true;
            $.each($scope.poi.SmgTags, function (i) {
                if ($scope.poi.SmgTags[i] == data.Key)
                    addtag = false;
            });
            if (addtag)
                $scope.poi.SmgTags.push(data.Key);
        });
    }

});

String.prototype.startsWith = function (prefix) {
    return this.indexOf(prefix) === 0;
}

String.prototype.endsWith = function (suffix) {
    return this.match(suffix + "$") == suffix;
};

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
            url: $scope.basePath + '../api/Location/LocationList/' + $scope.lang + '/' + $scope.globallocfilter
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

    $scope.getPoinamesFilteredList = function (lang, poitype, subtypefilter, poitypefilter, locationfilter, areafilter, highlightfilter, smgactive, source, smgtagfilter, active) {
        
         $http({
             method: 'Get',
             url: $scope.basePath + '/v1/ODHActivityPoiReduced?language=' + lang + '&type=' + poitype + '&subtype=' + subtypefilter + '&poitype=' + poitypefilter + '&locfilter=' + locationfilter + '&areafilter=' + areafilter + '&highlight=' + highlightfilter + '&odhactive=' + smgactive + '&active=' + active + '&source=' + source + '&odhtagfilter=' + smgtagfilter
        }).success(function (data) {
            $scope.items = data;
        });
    }

    $scope.$on('LoadPoiNamesList', function (e) {        

        $scope.getPoinamesFilteredList($scope.lang, $scope.poitype, $scope.subtypefilter, 'null', $scope.locationfilter, 'null', $scope.highlightfilter, $scope.smgactive, $scope.source, $scope.smgtagfilter, $scope.active);
    });

    $scope.getPoinamesFilteredList($scope.lang, $scope.poitype, $scope.subtypefilter, 'null', $scope.locationfilter, 'null', $scope.highlightfilter, $scope.smgactive, $scope.source, $scope.smgtagfilter, $scope.active);

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
            typestofilter = 'Wellness Entspannung,Winter,Sommer,Kultur Sehenswürdigkeiten,Anderes,Essen Trinken,';


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

var relatedcontentsmgpoitypeaheadcontroller = app.controller('SmgRelatedContentActivityPoiTypeAheadController', function ($scope, $http) {

    $scope.relatedcontenttypeaheadselected = false;
    
    $http({
        method: 'Get',
        url: $scope.basePath + '/v1/SmgPoi/ReducedRelatedContentAsync/de/Sommer,Winter,Anderes,Wellness Entspannung,Kultur Sehenswürdigkeiten/null/null/null/null/null/true/null/null'
    }).success(function (data) {
        //alert('data gekriag' + data.length);

        $scope.items = data;
    });
    
    $scope.onItemSelected = function () {
        $scope.relatedcontenttypeaheadselected = true;
    }
});

var relatedcontentgastrotypeaheadcontroller = app.controller('SmgRelatedContentGastronomyTypeAheadController', function ($scope, $http) {

    $scope.relatedcontenttypeaheadselected = false;

    $http({
        method: 'Get',
        url: $scope.basePath + '/v1/SmgPoi/ReducedEssenTrinkenRelatedContentAsync/de/Essen Trinken/null/null/null/null/null/true/null/null'
    }).success(function (data) {
        //alert('data gekriag' + data.length);

        $scope.items = data;
    });

    $scope.onItemSelected = function () {
        $scope.relatedcontenttypeaheadselected = true;
    }
});

var relatedcontenteventtypeaheadcontroller = app.controller('SmgRelatedContentEventTypeAheadController', function ($scope, $http) {

    $scope.relatedcontenttypeaheadselected = false;

    $http({
        method: 'Get',
        url: $scope.basePath + '/v1/SmgPoi/ReducedEventRelatedContentAsync/de/true/true/null'
    }).success(function (data) {
        //alert('data gekriag' + data.length);

        $scope.items = data;
    });

    $scope.onItemSelected = function () {
        $scope.relatedcontenttypeaheadselected = true;
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
app.directive('typeaheadrelatedcontent', function ($timeout) {
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

//Fileupload Test
app.controller('FileUploadController', ['$scope', 'FileUploader', function ($scope, FileUploader) {

    

    var uploader = $scope.uploader = new FileUploader({
        url: $scope.basePath + '/v1/FileUpload/pois/' + $scope.$parent.poi.SubType
    });


    //GEAT net
    //$scope.$on('UpdateSubTypeFileUpload', function (e) {

    //    alert("onkemmen");

    //    console.log('parent ' + $scope.$parent.poi.SubType);
    //    console.log('scope ' + $scope.poi.SubType);
    //});


    // FILTERS
    uploader.filters.push({
        name: 'imageFilter',
        fn: function (item /*{File|FileLikeObject}*/, options) {

            //alert(item.type.slice(item.type.lastIndexOf('/') + 1));

            var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
            return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
        }
    });

    // CALLBACKS

    uploader.onWhenAddingFileFailed = function (item /*{File|FileLikeObject}*/, filter, options) {
        console.info('onWhenAddingFileFailed', item, filter, options);
    };
    uploader.onAfterAddingFile = function (fileItem) {
        console.info('onAfterAddingFile', fileItem);
    };
    uploader.onAfterAddingAll = function (addedFileItems) {
        console.info('onAfterAddingAll', addedFileItems);
    };
    uploader.onBeforeUploadItem = function (item) {
        console.info('onBeforeUploadItem', item);
    };
    uploader.onProgressItem = function (fileItem, progress) {
        console.info('onProgressItem', fileItem, progress);
    };
    uploader.onProgressAll = function (progress) {
        console.info('onProgressAll', progress);
    };
    uploader.onSuccessItem = function (fileItem, response, status, headers) {

        var r = new RegExp('"', 'g');
        var imageurl = response.replace(r, '');
        //Filename
        var imagename = imageurl.substring(imageurl.lastIndexOf('/') + 1);               

        if ($scope.poi.ImageGallery == null) {
            $scope.poi.ImageGallery = [];
        }

        var UploadedImage = { ImageName: imagename, ImageUrl: imageurl, Width: 0, Height: 0, ImageSource: 'SMG', ImageTitle: { de: '', it: '', en: '' }, ImageDesc: { de: '', it: '', en: '' } }

        $scope.poi.ImageGallery.push(UploadedImage);

        alert('Image uploaded');

        console.info('onSuccessItem', fileItem, response, status, headers);
    };
    uploader.onErrorItem = function (fileItem, response, status, headers) {

        alert('error');
        console.info('onErrorItem', fileItem, response, status, headers);
    };
    uploader.onCancelItem = function (fileItem, response, status, headers) {
        console.info('onCancelItem', fileItem, response, status, headers);
    };
    uploader.onCompleteItem = function (fileItem, response, status, headers) {
        console.info('onCompleteItem', fileItem, response, status, headers);
    };
    uploader.onCompleteAll = function () {
        console.info('onCompleteAll');
    };

    //console.info('uploader', uploader);
}]);

//Fileupload Test
app.controller('FileUploadControllerGPX', ['$scope', 'FileUploader', function ($scope, FileUploader) {
    var gpxuploader = $scope.gpxuploader = new FileUploader({
        url: $scope.basePath + '/v1/GpxFileUpload'
    });

    // FILTERS DER GEAT LEI BA IMAGES
    //gpxuploader.filters.push({
    //    name: 'gpxFilter',
    //    fn: function (item /*{File|FileLikeObject}*/, options) {

    //        console.log(item);

    //        var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
    //        return '|gpx|kml|'.indexOf(type) !== -1;
    //    }
    //});

    // CALLBACKS

    gpxuploader.onWhenAddingFileFailed = function (item /*{File|FileLikeObject}*/, filter, options) {
        console.info('onWhenAddingFileFailed', item, filter, options);
    };
    gpxuploader.onAfterAddingFile = function (fileItem) {
        console.info('onAfterAddingFile', fileItem);
    };
    gpxuploader.onAfterAddingAll = function (addedFileItems) {
        console.info('onAfterAddingAll', addedFileItems);
    };
    gpxuploader.onBeforeUploadItem = function (item) {
        console.info('onBeforeUploadItem', item);
    };
    gpxuploader.onProgressItem = function (fileItem, progress) {
        console.info('onProgressItem', fileItem, progress);
    };
    gpxuploader.onProgressAll = function (progress) {
        console.info('onProgressAll', progress);
    };
    gpxuploader.onSuccessItem = function (fileItem, response, status, headers) {

        console.log(fileItem);

        if ($scope.poi.GpsTrack == null) {
            $scope.poi.GpsTrack = [];
        }

        //alert("File uploaded: " + response);

        var gpxtrackdesc = { de: "Datei zum herunterladen", it: "scaricare dato", en: "file to download", nl: "file to download", cs: "file to download", pl: "file to download" };
        //Create Random Id
        var gpxtrackid = response; //Math.floor((Math.random() * 1000) + (Math.random() * 10000));

        //guat schagun!
        $scope.poi.GpsTrack.push({ Id: gpxtrackid, GpxTrackDesc: gpxtrackdesc, GpxTrackUrl: 'http://webapps.smg.bz.it/service/Gpx/' + response });
      
        alert('Gpx Track uploaded');

        console.info('onSuccessItem', fileItem, response, status, headers);
    };
    gpxuploader.onErrorItem = function (fileItem, response, status, headers) {

        alert('error');
        console.info('onErrorItem', fileItem, response, status, headers);
    };
    gpxuploader.onCancelItem = function (fileItem, response, status, headers) {
        console.info('onCancelItem', fileItem, response, status, headers);
    };
    gpxuploader.onCompleteItem = function (fileItem, response, status, headers) {
        console.info('onCompleteItem', fileItem, response, status, headers);
    };
    gpxuploader.onCompleteAll = function () {
        console.info('onCompleteAll');
    };

    //console.info('gpxuploader', gpxuploader);
}]);

//Fileupload Test
app.controller('FileUploadControllerSingle', ['$scope', 'FileUploader', function ($scope, FileUploader) {

    $scope.oldimageurl = "";

    $scope.init = function (oldimageurl) {
        $scope.oldimageurl = oldimageurl;
    }

    var uploader = $scope.uploader = new FileUploader({
        url: $scope.basePath + '/v1/FileUpload/pois/' + $scope.$parent.poi.SubType
    });

    // FILTERS
    uploader.filters.push({
        name: 'imageFilter',
        fn: function (item /*{File|FileLikeObject}*/, options) {
            var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
            return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
        }
    });

    // CALLBACKS

    uploader.onWhenAddingFileFailed = function (item /*{File|FileLikeObject}*/, filter, options) {
        console.info('onWhenAddingFileFailed', item, filter, options);
    };
    uploader.onAfterAddingFile = function (fileItem) {
        console.info('onAfterAddingFile', fileItem);
    };
    uploader.onAfterAddingAll = function (addedFileItems) {
        console.info('onAfterAddingAll', addedFileItems);
    };
    uploader.onBeforeUploadItem = function (item) {
        console.info('onBeforeUploadItem', item);
    };
    uploader.onProgressItem = function (fileItem, progress) {
        console.info('onProgressItem', fileItem, progress);
    };
    uploader.onProgressAll = function (progress) {
        console.info('onProgressAll', progress);
    };
    uploader.onSuccessItem = function (fileItem, response, status, headers) {

        var currentimagescount = $scope.poi.ImageGallery.length;

        var r = new RegExp('"', 'g');
        var imageurl = response.replace(r, '');

        //Filename
        var imagename = imageurl.substring(imageurl.lastIndexOf('/') + 1);


        alert('changed Image: ' + imageurl);

        var UploadedImage = { ImageName: '', ImageUrl: imageurl, Width: 0, Height: 0, ImageSource: 'IDM', ImageTitle: { de: '', it: '', en: '', nl: '', cs: '', pl: '' }, ListPosition: currentimagescount++ }

        $.each($scope.poi.ImageGallery, function (i) {
            if ($scope.poi.ImageGallery[i].ImageUrl === $scope.oldimageurl) {

                $scope.poi.ImageGallery[i].ImageUrl = imageurl;
                $scope.poi.ImageGallery[i].ImageName = imagename;

                //console.log("image changed from " + $scope.oldimageurl + " to " + imageurl);

                return false;
            }
        });

        console.info('onSuccessItem', fileItem, response, status, headers);
    };
    uploader.onErrorItem = function (fileItem, response, status, headers) {

        alert('error');
        console.info('onErrorItem', fileItem, response, status, headers);
    };
    uploader.onCancelItem = function (fileItem, response, status, headers) {
        console.info('onCancelItem', fileItem, response, status, headers);
    };
    uploader.onCompleteItem = function (fileItem, response, status, headers) {
        console.info('onCompleteItem', fileItem, response, status, headers);
    };
    uploader.onCompleteAll = function () {
        console.info('onCompleteAll');
    };

    //console.info('uploader', uploader);
}]);

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

//DatePicker controller
var DatepickerDemoCtrl = function ($scope) {
    //$scope.today = function (customdate) {

    //    //alert(customdate);
    //    if (customdate == null || customdate.length == 0) {
    //        $scope.season.startdate = new Date();
    //    }
    //    else {
    //        $scope.season.startdate = new Date(customdate);
    //    }
    //};

    //$scope.today($scope.season.startdate);

    //$scope.clear = function () {
    //    $scope.season.startdate = null;
    //};

    //Disable weekend selection
    $scope.disabled = function (date, mode) {
        return (mode === 'day' && (date.getDay() === 0 || date.getDay() === 6));
    };

    $scope.toggleMin = function () {
        $scope.minDate = $scope.minDate ? null : new Date();
    };
    $scope.toggleMin();

    $scope.open = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $scope.opened = true;
    };

    $scope.dateOptions = {
        formatYear: 'yy',
        startingDay: 1
    };

    $scope.initDate = new Date();
    $scope.formats = ['dd-MM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    $scope.format = $scope.formats[0];
};

/**
 * Generates a GUID string.
 * @returns {String} The generated GUID.
 * @example af8a8416-6e18-a307-bd9c-f2c947bbb3aa
 * @author Slavik Meltser (slavik@meltser.info).
 * @link http://slavik.meltser.info/?p=142
 */
function guid() {
    function _p8(s) {
        var p = (Math.random().toString(16) + "000000000").substr(2, 8);
        return s ? "-" + p.substr(0, 4) + "-" + p.substr(4, 4) : p;
    }
    return _p8() + _p8(true) + _p8(true) + _p8();
}

//Obsolete
var difficultylistcontroller = app.controller('DifficultySelectController', function ($scope, $http) {

    //$http({
    //    method: 'Get',
    //    url: $scope.basePath + '/json/DifficultyInfo.json'        
    //}).success(function (data) {

    //    $scope.difficultylist = data;

    //    console.log(data);

    //});

    $scope.changedifficulty = function (selecteddifficulty) {

        if ($scope.poi.Ratings == null || $scope.poi.Ratings == undefined)
        {
            $scope.poi.Ratings = {};

            console.log(selecteddifficulty.toString());

            var ratingobject = { Stamina: null, Experience: null, Landscape: null, Difficulty: selecteddifficulty.toString(), Technique: null };

            $scope.poi.Ratings = ratingobject;
        }
        else
        {
            if ($scope.poi.Ratings.Difficulty != null)
            {
                console.log(selecteddifficulty.toString());

                $scope.poi.Ratings.Difficulty = selecteddifficulty.toString();

                //if(selecteddifficulty == "")
                //{
                //    $scope.poi.$parent.Ratings.Difficulty = "";
                //}
            }            
        }

    }

});