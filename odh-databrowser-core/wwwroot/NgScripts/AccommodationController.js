// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

var app = angular.module('accommodation', ['ui.bootstrap', 'ngSanitize', 'ui-rangeSlider', 'appconfig', 'appfactory', 'leaflet-directive', 'pathconfig']);

app.controller('accommodationListController', [
    '$scope', '$http', '$modal', 'appconfig', 'leafletData', 'leafletmapsimple', 'languageFactory', 'apipath',
    function ($scope, $http, $modal, appconfig, leafletData, leafletmapsimple, languageFactory, apipath) {

        console.log(apipath);
        $scope.basePath = apipath;

        $scope.lang = languageFactory.getLanguage();        

        var allowedlanguages = ['de', 'it', 'en'];


        //$scope.hasfilteredlocations = false;
        $scope.globallocfilter = '';
        $scope.globallocfilterName = '';
        $scope.globallocfilterId = '';
        $scope.globallocfilterType = '';

        $scope.checkonlts = false;
        $scope.checkonhgv = false;
        $scope.onlinecountlcs = 0;

        $scope.themefilter = 'null';
        $scope.badgefilter = 'null';
        $scope.categoryfilter = 'null';
        $scope.boardfilter = '0';
        $scope.typefilter = 'null';
        $scope.featurefilter = 'null';

        //booking Filter
        $scope.bookfilter = 'null';

        //SMG Tags
        $scope.SelectedSmgTagName = '';
        $scope.SelectedSmgTagId = '';
        $scope.smgtagfilter = 'null';
        //Location Filter
        $scope.SelectedLocationName = '';
        $scope.SelectedLocationTyp = '';
        $scope.SelectedLocationId = '';
        $scope.locfilter = 'null';
        //Accommodation Filter
        $scope.SelectedAccoId = '';
        $scope.SelectedAccoName = '';
        $scope.accoidfilter = 'null';
        //Active Filters
        $scope.active = 'null';
        $scope.smgactive = 'null';
        $scope.gbview = false;

        $scope.seed = 'null';

        //Für Verfügbarkeitsanfrage
        $scope.persons = [0];
        $scope.roomcount = 1;
        $scope.roomtype = [0];
        $scope.roompersons = [];

        var today = new Date();

        $scope.Datumvon = today;
        $scope.Datumbis = new Date();
        $scope.Datumbis.setDate(today.getDate() + 7);

        $scope.publishchannelfilter = '';

        $scope.personnumber = function (roomcount) {
            return new Array(parseInt($scope.persons[roomcount]));
        };

        $scope.roomnumber = function () {
            return new Array(parseInt($scope.roomcount));
        };

        $scope.updateroomselection = function (roomcount) {
            
            //zuerst schauen ob room dazugefügt wird ACHTUNG wenn wianiger Rooms muassi sell von roompersons array aussiwerfen
                       
            if ($scope.roomtype.length < roomcount) {
                var counter = parseInt(roomcount) - parseInt($scope.roomtype.length);

                //alert(counter);

                for (i = 0; i < counter; i++) {
                    $scope.roomtype.push(0);
                    $scope.persons.push(0);
                }                
            }
                
          
            if ($scope.roomtype.length > roomcount) {
                var diff = parseInt($scope.roomtype.length) - parseInt(roomcount);
                //alert(diff);
                $scope.roomtype.splice(roomcount, diff);
                $scope.persons.splice(roomcount, diff);
            }
                
        };

        $scope.updatepersonselection = function (roomnumber, roomtype, personcount) {

            //alert("zimmer nr: " + roomnumber + " typ: " + roomtype + " personen " + personcount);

            var selectedpersons = [];

            //Wenn koane personen no definiert sein
            if ($scope.roompersons[roomnumber] == undefined) {

                //alert("keine personen definiert");

                for (i = 0; i < personcount; i++) {
                    selectedpersons.push(18);
                }
            }
            else {
                //alert("übernehme personen alter")

                //Schaugn ob mear gwortn sein


                var x = $scope.roompersons[roomnumber].persons;
                for (i = 0; i < personcount; i++) {

                    if (x[i] != undefined)
                        selectedpersons.push(x[i]);
                    else
                        selectedpersons.push(18);
                }
            }


            if ($scope.roompersons[roomnumber] == undefined) {

                //alert("i push iatz");

                $scope.roompersons.push({
                    roomnr: roomtype,
                    persons: selectedpersons
                });
            }
            else {
                //alert("i splice iatz");
                
                var x = {
                    roomnr: roomtype,
                    persons: selectedpersons
                };

                $scope.roompersons.splice(roomnumber, 1, x);
            }
                        
            //alert($scope.roompersons[roomnumber].persons);
        };

        $scope.range = { min: 0, max: 2000 }

        $scope.init = function (accommodationtype, locfilter, locfiltertype, smgactive) {
            //This function is sort of private constructor for controller            
            $scope.accommodationtype = accommodationtype;

            //fallback if language is not available here set it back to browserlanguage
            if (!allowedlanguages.includes($scope.lang)) {
                $scope.lang = 'en';
            }

            if (locfiltertype != "" && locfiltertype != undefined)
            {
                //$scope.hasfilteredlocations = true;
                //Des muassi no setzen
                //$scope.SelectedLocationName = 'Filtered';
                $scope.SelectedLocationTyp = locfiltertype;
                $scope.SelectedLocationId = locfilter;

                
                $scope.globallocfilterId = locfilter;
                $scope.globallocfilterType = locfiltertype;

                $scope.globallocfilter = locfiltertype + locfilter;                
            }

            if (smgactive != "" && smgactive != undefined) {
                if (smgactive != true) {

                    $scope.smgactive = true;
                    $scope.gbview = true;
                }
            }

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

        $scope.page = 1;
        $scope.totalpages = 0;
        $scope.totalcount = 0;
        $scope.onlinecount = -1;

        $scope.initFilters = function()
        {
            $scope.checkBookFilter = {
                hgv: true,
                bok: true,
                htl: true,
                exp: true,
                lts: true
            };

            $scope.checkCatModel = {
                1: true,
                2: true,
                3: true,
                4: true,
                5: true,
                6: true
            };

            $scope.checkThemeModel = {
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
                15: false
            };

            $scope.checkFeatModel = {
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
                11: false
            };

            $scope.checkBadgeModel = {
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
                11: false
            };
        }

        $scope.setFilters = function() {
            //Category Filter

            $scope.categoryfilter = "null";
            var categoryflagcounter = 0;

            $.each($scope.checkCatModel, function (i) {

                if ($scope.checkCatModel[i] == true) {

                    var counter = 0;
                    if (i == 1)
                        counter = 1;
                    if (i == 2)
                        counter = 14;
                    if (i == 3)
                        counter = 112;
                    if (i == 4)
                        counter = 1920
                    if (i == 5)
                        counter = 30720
                    if (i == 6)
                        counter = 229376

                    categoryflagcounter = categoryflagcounter + counter;                    
                }
            });

            if (categoryflagcounter > 0) {
                $scope.categoryfilter = categoryflagcounter;
            }
            if ($scope.categoryfilter == 262143)
                $scope.categoryfilter = "null";

           
            //Booking Filter
            //var bokfilter = 'hgv,htl,exp,bok,pos';
            $scope.bookfilter = "";

            if ($scope.checkBookFilter.hgv && $scope.checkBookFilter.bok && $scope.checkBookFilter.htl && $scope.checkBookFilter.exp) {
                $scope.bookfilter = "hgv,bok,htl,exp,pos";
            }
            else {
                if ($scope.checkBookFilter.hgv)
                    $scope.bookfilter = $scope.bookfilter + "hgv,"
                if ($scope.checkBookFilter.bok)
                    $scope.bookfilter = $scope.bookfilter + "bok,"
                if ($scope.checkBookFilter.htl)
                    $scope.bookfilter = $scope.bookfilter + "htl,"
                if ($scope.checkBookFilter.exp)
                    $scope.bookfilter = $scope.bookfilter + "exp,"
                //if ($scope.checkBookFilter.lts)
                //    $scope.bookfilter = $scope.bookfilter + "pos,"
            }

            console.log($scope.bookfilter);

            if ($scope.bookfilter == "") {
                $scope.checkonhgv = false;
            }
            else {
                $scope.checkonhgv = true;
            }
                

            //alert($scope.bookfilter);

            //Feature Filter
            $scope.featurefilter = "null";
            var featureflagcounter = 0;

            $.each($scope.checkFeatModel, function (i) {

                if ($scope.checkFeatModel[i] == true) {                    
                    var shifted1 = 1 << (i - 1);
                    featureflagcounter = featureflagcounter + shifted1;
                }
            });
            if (featureflagcounter > 0) {
                $scope.featurefilter = featureflagcounter;
            }
            

            //Theme Filter
            $scope.themefilter = "null";
            var themeflagcounter = 0;

            $.each($scope.checkThemeModel, function (i) {

                if ($scope.checkThemeModel[i] == true) {
                    var shifted2 = 1 << (i - 1);
                    themeflagcounter = themeflagcounter + shifted2;
                }
            });
            if (themeflagcounter > 0) {
                $scope.themefilter = themeflagcounter;
            }


            //Badge Filter
            $scope.badgefilter = "null";
            var badgeflagcounter = 0;

            $.each($scope.checkBadgeModel, function (i) {

                if ($scope.checkBadgeModel[i] == true) {
                    var shifted3 = 1 << (i - 1);
                    badgeflagcounter = badgeflagcounter + shifted3;
                }
            });
            if (badgeflagcounter > 0) {
                $scope.badgefilter = badgeflagcounter;
            }                                    

            //LocFilter

            $scope.locfilter = "null"
            $scope.loctyp = '';

            if ($scope.SelectedLocationId != undefined && $scope.SelectedLocationId != '') {
                $scope.locfilter = $scope.SelectedLocationTyp + $scope.SelectedLocationId;
            }

            $scope.accoidfilter = "null"

            if ($scope.SelectedAccoId != '')
                $scope.accoidfilter = $scope.SelectedAccoId;

            if ($scope.SelectedSmgTagName != '')
                $scope.smgtagfilter = $scope.SelectedSmgTagId;
        }
       
        //Filter anwenden
        $scope.applyFilter = function (currentpage, withoutrefresh) {            

            $scope.isloading = true;

            console.log(currentpage);

            if (currentpage == undefined)
                $scope.page = 1;
            else
                $scope.page = currentpage;

            $scope.setFilters();

            $http.get($scope.basePath + '/v1/Accommodation?pagenumber=' + $scope.page + '&pagesize=20&categoryfilter=' + $scope.categoryfilter + '&typefilter=' + $scope.typefilter + '&featurefilter=' + $scope.featurefilter + '&themefilter=' + $scope.themefilter + '&badgefilter=' + $scope.badgefilter + '&idfilter=' + $scope.accoidfilter + '&locfilter=' + $scope.locfilter + '&active=' + $scope.active + '&odhactive=' + $scope.smgactive + '&odhtagfilter=' + $scope.smgtagfilter + '&publishedon=' + $scope.publishchannelfilter + '&seed=' + $scope.seed).success(function (result) {
                $scope.accommodations = result.Items;
                $scope.totalpages = result.TotalPages;
                $scope.totalcount = result.TotalResults;
                $scope.onlinecount = -1;
                $scope.seed = result.Seed;
                $scope.isloading = false;
            });

            if (withoutrefresh != true)
                $scope.$broadcast('LoadAccoNamesList');
        }
        
        //Seite Wechseln
        $scope.changePage = function (pageskip) {

            $scope.page = $scope.page + pageskip;

            $scope.applyFilter($scope.page, true);          
        }               

        $scope.accommodations = [];        
      
        //Verfügbarkeitsanfrage
        $scope.getAvailability = function()
        {
            var arrivalday = $scope.Datumvon.getDate();            
            var arrivalmonth = parseInt($scope.Datumvon.getMonth()) + 1; //Months are zero based            
            var arrivalyear = $scope.Datumvon.getFullYear();
            
            var datefrom = arrivalyear + "-" + arrivalmonth + "-" + arrivalday;
           
            var departureday = $scope.Datumbis.getDate();
            var departuremonth = parseInt($scope.Datumbis.getMonth()) + 1; //Months are zero based            
            var departureyear = $scope.Datumbis.getFullYear();

            var dateto = departureyear + "-" + departuremonth + "-" + departureday;

            //var bokfilter = 'hgv,htl,exp,bok,pos';
            

            var roominfo = '';
           
            for (i = 0; i < $scope.roomcount; i++) {
                
                roominfo = roominfo + $scope.roomtype[i] + '-' + $scope.roompersons[i].persons;
                //var personinfo = ''
                //for (i = 0; i < $scope.roompersons[i]; i++) {
                //    personinfo = personinfo + $scope.roompersons[i].roomnr + '-';
                //}
                //alert(i + " " + $scope.roomcount);

                var mycounter = parseInt($scope.roomcount) - 1;

                if (i < mycounter)
                    roominfo = roominfo + '|';
            }            

            //alert(roominfo + " " + datefrom + " " + dateto);

            $scope.page = 1;
            $scope.isloading = true;

            $scope.setFilters();

            var bokfilter = $scope.bookfilter;

            $scope.hgvfinished = false;
            $scope.ltsfinished = false;

            //console.log($scope.basePath + '/v1/Accommodation/Available/' + $scope.page + '/20/' + $scope.lang + '/' + $scope.categoryfilter + '/' + $scope.typefilter + '/' + $scope.boardfilter + '/' + $scope.featurefilter + '/' + $scope.themefilter + '/' + $scope.badgefilter + '/' + $scope.accoidfilter + '/' + $scope.locfilter + '/' + $scope.smgtagfilter + '/' + datefrom + '/' + dateto + '/' + roominfo + '/' + bokfilter + '/' + $scope.seed);

            console.log("check on hgv " + $scope.checkonhgv);
            console.log("check on lts " + $scope.checkonlts);

            if ($scope.checkonhgv == false && $scope.checkonlts == false) {
                $scope.stopisloading(true, true, true, true)
            }

            $scope.accommodations = [];

            if ($scope.checkonhgv == true) {
                $http.get($scope.basePath + '/v1/Accommodation?pagesize=0&pagenumber=' + $scope.page + '&availabilitychecklanguage=' + $scope.lang + '&categoryfilter=' + $scope.categoryfilter + '&typefilter=' + $scope.typefilter + '&boardfilter=' + $scope.boardfilter + '&featurefilter=' + $scope.featurefilter + '&themefilter=' + $scope.themefilter + '&badgefilter=' + $scope.badgefilter + '&idfilter=' + $scope.accoidfilter + '&locfilter=' + $scope.locfilter + '&active=' + $scope.active + '&odhactive=' + $scope.smgactive + '&odhtagfilter=' + $scope.smgtagfilter + '&arrival=' + datefrom + '&departure=' + dateto + '&roominfo=' + roominfo + '&bokfilter=' + bokfilter + '&seed=' + $scope.seed + '&availabilitycheck=true').success(function (result) {
                    //$scope.accommodations = result.Items;

                    $.each(result.Items, function (i) {
                        $scope.accommodations.push(result.Items[i]);
                    });

                    $scope.totalpages = result.TotalPages;
                    $scope.totalcount = result.TotalResults;
                    $scope.onlinecount = result.OnlineResults;
                    $scope.seed = result.Seed;

                    console.log("found on mss: " + $scope.onlinecount);

                    $scope.hgvfinished = true;

                    $scope.stopisloading($scope.checkonhgv, $scope.checkonlts, $scope.hgvfinished, $scope.ltsfinished)
                });
            }

            if ($scope.checkonlts == true) {

                $http.get($scope.basePath + '/v1/Accommodation?pagesize=0&pagenumber=' + $scope.page + '&availabilitychecklanguage=' + $scope.lang + '&categoryfilter=' + $scope.categoryfilter + '&typefilter=' + $scope.typefilter + '&boardfilter=' + $scope.boardfilter + '&featurefilter=' + $scope.featurefilter + '&themefilter=' + $scope.themefilter + '&badgefilter=' + $scope.badgefilter + '&idfilter=' + $scope.accoidfilter + '&locfilter=' + $scope.locfilter + '&active=' + $scope.active + '&odhactive=' + $scope.smgactive + '&odhtagfilter=' + $scope.smgtagfilter + '&arrival=' + datefrom + '&departure=' + dateto + '&roominfo=' + roominfo + '&bokfilter=lts&seed=' + $scope.seed + '&availabilitycheck=true').success(function (resultlcs) {

                    $.each(resultlcs.Items, function (i) {
                        $scope.accommodations.push(resultlcs.Items[i]);
                    });

                    $scope.onlinecountlcs = resultlcs.AvailableOnRequest;

                    console.log("found on lcs: " + $scope.onlinecountlcs);

                    $scope.ltsfinished = true;

                    $scope.stopisloading($scope.checkonhgv, $scope.checkonlts, $scope.hgvfinished, $scope.ltsfinished)
                });
            }

            $scope.stopisloading = function(checkonhgv, checkonlts, hgvfinished, ltsfinished){

                if (checkonhgv && checkonlts) {
                    if (hgvfinished && ltsfinished) {
                        $scope.isloading = false;

                        console.log("hgv and lts finished");
                    }
                }
                else {
                    if (checkonhgv && hgvfinished) {
                        $scope.isloading = false;

                        console.log("hgv finished");
                    }
                    if (checkonlts && ltsfinished) {
                        $scope.isloading = false;

                        console.log("lts finished");
                    }
                }

                
            }

                

           
        }

        $scope.editaccommodation = function (accommodation) {

            if (accommodation === 'new') {

                $scope.newaccommodation = true;
                $scope.accommodation = { Id: '', Shortname: '', _Meta: { Id: '', Type: 'accommodation', Source: 'noi' } };
            }
            else {
                $scope.newaccommodation = false;
                $scope.accommodation = accommodation;
            }

            var modalInstance = $modal.open({
                templateUrl: 'myAccommodationModal.html',
                controller: AccommodationModalInstanceCtrl,
                scope: $scope,
                //size: 'lg',
                windowClass: 'modal-wide',
                backdrop: 'static'
            });
        };

        $scope.deleteaccommodation = function (id) {

            var deleteconfirm = confirm('Are you absolutely sure you want to delete?');

            if (deleteconfirm) {

                $http.delete($scope.basePath + '/v1/Accommodation/' + id).success(function (result) {
                    alert("Accommodation deleted!");

                    $.each($scope.accommodations, function (i) {
                        if ($scope.accommodations[i].Id === id) {
                            $scope.accommodations.splice(i, 1);
                            return false;
                        }
                    });
                }).error(function (data) {
                    alert("ERROR:" + data);
                });
            }
        };

        $scope.updateacco = function (id) {

            $scope.isAccoDetailloading = true;
            $http.get($scope.basePath + '/v1/Update/Accommodation/' + id).success(function (result) {

                console.log(result.replace(/^"(.*)"$/, '$1'));
                $scope.isAccoDetailloading = false;
                alert(result.replace(/^"(.*)"$/, '$1'));

                //noamol filter ausfiahrn
                $scope.applyFilter($scope.page);

            }).error(function (data) {
                alert("ERROR:" + data);
            });

        };

        $scope.showBookingInfo = function (accommodation, channel) {

            //$scope.mssresponse = mssresponse;

            //Single MSS Request machen
            var arrivalday = $scope.Datumvon.getDate();
            var arrivalmonth = parseInt($scope.Datumvon.getMonth()) + 1; //Months are zero based            
            var arrivalyear = $scope.Datumvon.getFullYear();

            var datefrom = arrivalyear + "-" + arrivalmonth + "-" + arrivalday;

            var departureday = $scope.Datumbis.getDate();
            var departuremonth = parseInt($scope.Datumbis.getMonth()) + 1; //Months are zero based            
            var departureyear = $scope.Datumbis.getFullYear();

            var dateto = departureyear + "-" + departuremonth + "-" + departureday;

            var roominfo = '';

            for (i = 0; i < $scope.roomcount; i++) {

                roominfo = roominfo + $scope.roomtype[i] + '-' + $scope.roompersons[i].persons;

                var mycounter = parseInt($scope.roomcount) - 1;

                if (i < mycounter)
                    roominfo = roominfo + '|';
            }            

            $scope.page = 1;
            $scope.isDetailloading = true;

            //alert(accommodation.Id);

            //api/Accommodation/AvailableSingle/{lang}/{boardfilter}/{arrival}/{departure}/{roominfo}/{a0rid}")]

            //var bokfilter = 'hgv,htl,exp,bok,pos';
            var bokfilter = $scope.bookfilter;

            //$http.get($scope.basePath + '/v1/Accommodation/AvailableSingle/' + $scope.lang + '/' + $scope.boardfilter + '/' + datefrom + '/' + dateto + '/' + roominfo + '/' + accommodation.Id + '/' + bokfilter).success(function (result) {
            //    $scope.accommodation = result;
            //    $scope.isDetailloading = false;
            //});

            if (channel == "lts") {
                $http.get($scope.basePath + '/v1/Accommodation/' + accommodation.Id + '?availabilitychecklanguage=' + $scope.lang + '&detail=1&boardfilter=' + $scope.boardfilter + '&arrival=' + datefrom + '&departure=' + dateto + '&roominfo=' + roominfo + '&bokfilter=lts&availabilitycheck=true').success(function (result) {
                    $scope.accommodation = result;
                    $scope.isDetailloading = false;
                });
            }
            else {
                $http.get($scope.basePath + '/v1/Accommodation/' + accommodation.Id + '?availabilitychecklanguage=' + $scope.lang + '&detail=1&boardfilter=' + $scope.boardfilter + '&arrival=' + datefrom + '&departure=' + dateto + '&roominfo=' + roominfo + '&bokfilter=' + bokfilter + '&availabilitycheck=true').success(function (result) {
                    $scope.accommodation = result;
                    $scope.isDetailloading = false;
                });
            }

            //alert($scope.accommodation.Id);

            var modalInstance = $modal.open({
                templateUrl: 'myBookingModal.html',
                controller: BookingModalInstanceCtrl,
                scope: $scope,
                size: 'lg'
            });
        };

        //Filter Löschen
        $scope.clearFilter = function () {

            $scope.SelectedAccoId = '';
            $scope.SelectedAccoName = '';

            //$scope.SelectedHotelName = '';
            $scope.checkonlts = false;
            $scope.checkonhgv = false;
            
            $scope.SelectedSmgTagName = '';
            $scope.SelectedSmgTagId = '';
            $scope.onlinecount = -1;

            //Reset the locfilter only if there is no globallocfilter



            if ($scope.globallocfilter == '')
            {
                $scope.SelectedLocationName = '';
                $scope.SelectedLocationTyp = '';
                $scope.SelectedLocationId = '';
                $scope.locfilter = 'null';
            }                
            else
            {
                $scope.SelectedLocationName = $scope.globallocfilterName;
                $scope.SelectedLocationTyp = $scope.globallocfilterType;
                $scope.SelectedLocationId = $scope.globallocfilterId;

                $scope.locfilter = $scope.globallocfilter;
            }
                

            $scope.publishchannelfilter = '';
            $scope.accoidfilter = 'null';
            $scope.typefilter = 'null';
            $scope.themefilter = 'null';
            $scope.badgefilter = 'null';
            $scope.featurefilter = 'null';
            $scope.smgtagfilter = 'null';
            $scope.active = 'null';
            if ($scope.gbview == false)
                $scope.smgactive = 'null';

            $.each($scope.checkCatModel, function (i) {
                $scope.checkCatModel[i] = true;
            });

            $.each($scope.checkBadgeModel, function (i) {
                $scope.checkBadgeModel[i] = false;
            });

            $.each($scope.checkThemeModel, function (i) {
                $scope.checkThemeModel[i] = false;
            });

            $.each($scope.checkFeatModel, function (i) {
                $scope.checkFeatModel[i] = false;
            });

            //Calling method in Child Method to clear the Filter of Accommodation Name list
            $scope.$broadcast('clearAcconamesFilter');

            $scope.page = 1;
            $scope.changePage(0);
        }

        //Clear single Filters
        $scope.clearNameFilter = function () {
            $scope.SelectedAccoName = '';
            $scope.SelectedAccoId = '';
            $scope.accoidfilter = 'null';
            $scope.page = 1;
            $scope.changePage(0);

            $scope.$broadcast('clearAcconamesFilter');
        }

        $scope.clearLocationFilter = function () {

            $scope.SelectedLocationName = '';
            $scope.SelectedLocationTyp = '';
            $scope.SelectedLocationId = '';
            $scope.locationfilter = 'null';

            $scope.page = 1;
            $scope.changePage(0);

            $scope.$broadcast('clearAcconamesFilter');
        }

        $scope.clearTagFilter = function () {
            $scope.SelectedSmgTagName = '';
            $scope.SelectedSmgTagId = '';
            $scope.smgtagfilter = 'null';
            $scope.page = 1;
            $scope.changePage(0);

            $scope.$broadcast('clearAcconamesFilter');
        }

        $scope.clearActiveFilter = function () {

            $scope.smgactive = 'null';

            $scope.page = 1;
            $scope.changePage(0);

            $scope.$broadcast('clearAcconamesFilter');
        }

        $scope.clearTICActiveFilter = function () {

            $scope.active = 'null';

            $scope.page = 1;
            $scope.changePage(0);

            $scope.$broadcast('clearAcconamesFilter');
        }

        $scope.clearTypeFilter = function () {

            $scope.typefilter = 'null';

            $scope.page = 1;
            $scope.changePage(0);

            $scope.$broadcast('clearAcconamesFilter');
        }

        $scope.clearThemeFilter = function () {

            $.each($scope.checkThemeModel, function (i) {
                $scope.checkThemeModel[i] = false;
            });
            $scope.page = 1;
            $scope.changePage(0);

            $scope.$broadcast('clearAcconamesFilter');
        }

        $scope.clearBadgeFilter = function () {

            $.each($scope.checkBadgeModel, function (i) {
                $scope.checkBadgeModel[i] = false;
            });
            $scope.page = 1;
            $scope.changePage(0);

            $scope.$broadcast('clearAcconamesFilter');
        }

        $scope.clearAusstattungFilter = function () {

            $.each($scope.checkFeatModel, function (i) {
                $scope.checkFeatModel[i] = false;
            });
            $scope.page = 1;
            $scope.changePage(0);

            $scope.$broadcast('clearAcconamesFilter');
        }

        $scope.clearCategoryFilter = function () {

            $.each($scope.checkCatModel, function (i) {
                $scope.checkCatModel[i] = true;
            });
            $scope.page = 1;
            $scope.changePage(0);

            $scope.$broadcast('clearAcconamesFilter');
        }

        $scope.clearPublishedOnFilter = function () {

            $scope.publishchannelfilter = '';

            $scope.page = 1;
            $scope.changePage(0);

            $scope.$broadcast('clearAcconamesFilter');
        }

       

        //Modal anzeigen
        $scope.showInfoModal = function (accommodation) {

            $scope.accommodation = accommodation;

            var passedgps = [];
            passedgps.push({ Gpstype: 'position', Latitude: $scope.accommodation.Latitude, Longitude: $scope.accommodation.Longitude });

            leafletmapsimple.preparemap(passedgps, null, ['position'], 'accommodationListController');


            var slidemodalInstance = $modal.open({
                templateUrl: 'myAccommodationInfoModal.html',
                controller: InfoModalInstanceCtrl,
                scope: $scope,
                size: 'lg'
            });
        };

        $scope.initFilters();
    }]);

//Edit and New Modal Controller
var AccommodationModalInstanceCtrl = function ($scope, $modalInstance, $http) {

    $scope.mappingproperty = {};

    $scope.ok = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.addaccommodation = function (accommodation, isvalid) {

        if (isvalid) {

            $http.post($scope.basePath + '/v1/Accommodation', accommodation).success(function (result) {
                alert("Accommodation added!");
                $scope.accommodations.push(accommodation);

                $modalInstance.close();
            });
        }
        else {
            alert("Invalid Data!");
        }
    };

    $scope.updateaccommodation = function (accommodation, isvalid) {

        if (isvalid) {
            $http.put($scope.basePath + '/v1/Accommodation/' + accommodation.Id, accommodation).success(function (result) {
                alert("Accommodation updated!");
                $modalInstance.close();
            });
        }
        else {
            alert("Invalid Data!");
        }
    };

    //$scope.isSMGImage = function (imagegallery) {
    //    if (imagegallery.ImageSource == 'SMG') {
    //        return true;
    //    }

    //    return false;
    //};

    //$scope.isLTSImage = function (imagegallery) {
    //    if (imagegallery.ImageSource == 'LTS') {
    //        return true;
    //    }

    //    return false;
    //};

    //Add SMG Tagging
    $scope.addtag = function (tag) {

        if (tag != "" && tag != undefined) {

            tag = tag.toLowerCase();

            var addToArray = true;

            if ($scope.accommodation.SmgTags != null) {

                $.each($scope.accommodation.SmgTags, function (i) {

                    if ($scope.accommodation.SmgTags[i] === tag) {

                        alert('Already present!');
                        addToArray = false;

                        return false;
                    }
                });
            }
            else {
                $scope.accommodation.SmgTags = [];
            }


            if (addToArray) {

                $scope.accommodation.SmgTags.push(tag);
            }
        }
        else {
            alert('Invalid Tag!');
        }
    }

    //Remove SMG Tagging
    $scope.deletetag = function (tag) {
        //alert(tag);
        $.each($scope.accommodation.SmgTags, function (i) {
            if ($scope.accommodation.SmgTags[i] === tag) {
                $scope.accommodation.SmgTags.splice(i, 1);
                return false;
            }
        });
    }

    $scope.addpublishedonchannel = function (publishchannel) {

        if (publishchannel != "" && publishchannel != undefined) {

            var addToArray = true;

            if ($scope.accommodation.PublishedOn != null) {

                $.each($scope.accommodation.PublishedOn, function (i) {

                    if ($scope.accommodation.PublishedOn[i] === publishchannel) {

                        alert('Already present!');
                        addToArray = false;

                        return false;
                    }
                });
            }
            else {
                $scope.accommodation.PublishedOn = [];
            }


            if (addToArray) {

                $scope.accommodation.PublishedOn.push(publishchannel);
            }
        }
        else {
            alert('Invalid publishchannel!');
        }
    }

    //Remove SMG Tagging
    $scope.deletepublishedonchannel = function (publishchannel) {
        //alert(tag);
        $.each($scope.accommodation.PublishedOn, function (i) {
            if ($scope.accommodation.PublishedOn[i] === publishchannel) {
                $scope.accommodation.PublishedOn.splice(i, 1);
                return false;
            }
        });
    }

    //Add Mapping Manually
    $scope.addmapping = function () {

        if ($scope.mappingproperty.Name != '' && $scope.mappingproperty.Value != '' && $scope.mappingproperty.Mappingkey != '') {
            var addToArray = true;

            var provider = $scope.mappingproperty.Mappingkey;

            if ($scope.accommodation.Mapping == null || $scope.accommodation.Mapping == undefined) {
                $scope.accommodation.Mapping = {};
            }

            if ($scope.accommodation.Mapping[provider] == null || $scope.accommodation.Mapping[provider] == undefined) {

                $scope.accommodation.Mapping[provider] = {};
            }

            if ($scope.accommodation.Mapping[provider] != null) {

                //If value is present it will be overwritten....
                Object.keys($scope.accommodation.Mapping[provider]).forEach(function (key) {

                    console.log(key, $scope.accommodation.Mapping[provider][key]);
                });               
            }


            if (addToArray) {
                //var property = { Name: $scope.mappingproperty.Name, Value: $scope.mappingproperty.Value };

                //$scope.accommodation.Mapping[provider].push(property);

                var dicttoadd = {};

                if ($scope.accommodation.Mapping[provider] != null && $scope.accommodation.Mapping[provider] != undefined)
                    dicttoadd = $scope.accommodation.Mapping[provider];

                dicttoadd[$scope.mappingproperty.Name] = $scope.mappingproperty.Value;

                $scope.accommodation.Mapping[provider] = dicttoadd;

                console.log($scope.accommodation.Mapping);

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

                delete $scope.accommodation.Mapping[provider];
            }
        }
        else {

            delete $scope.accommodation.Mapping[provider][mapping];

            //$.each($scope.common.Mapping[provider], function (i) {
            //    if ($scope.common.Mapping[provider][i].Name === mapping) {
            //        $scope.common.Mapping[provider].splice(i, 1);
            //        return false;
            //    }
            //});
        }
    }
};

//Modal Slideshow Controller
var InfoModalInstanceCtrl = function ($scope, $modalInstance, $http, $sce) {

    $scope.cancelslidemodal = function () {        
        $modalInstance.dismiss('cancel');
    };

    $scope.myInterval = 5000;
    $scope.slides = $scope.accommodation.ImageGallery;
}

//Booking Modal Controller
var BookingModalInstanceCtrl = function ($scope, $modalInstance, $http) {

    //NUIEN REQUEST osetzen frog ob gleich onfrogen oder per angebotsid ??



    //$scope.ok = function () {
    //    $modalInstance.dismiss('cancel');
    //};

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };    
};

//Angular RoomDetails Controller+
app.controller('RoomDetailController', function ($scope, $http) {    

    $scope.isAccoDetailloading = true;

    $http.get($scope.basePath + '/v1/AccommodationRoom?accoid=' + $scope.accommodation.Id).success(function (result) {
        $scope.accommodationrooms = result;
        $scope.isAccoDetailloading = false;

        //alert($scope.accommodationrooms[0].ImageGallery);

        $scope.myInterval = 5000;        
        //$scope.roomslides = $scope.accommodationrooms[0].ImageGallery;
    });

});


//Filter für HTML Binding noch zu überprüfen obs des bring
app.filter('xmlTOlf', function () {
    return function (text) {
        //alert(text.replace('&#xD;', ' \n '));
        return text.replace(/&#xD;/g, ' \r\n ').replace(/&#xA;/g, ' \r\n ');
      };
});

app.filter('xmlTObr', function () {
    return function (text) {
        //alert(text.replace('&#xD;', ' \n '));
        return text.replace(/&#xD;/g, ' <br /> ').replace(/&#xA;/g, ' <br /> ');
    };
});

//Accommodation Typeahead Gschichten
var hoteltypeaheadcontroller = app.controller('HotelnameTypeAheadController', function ($scope, $http) {

    $scope.hotelnametypeaheadselected = false;

    $scope.getHotelFilteredList = function (filtered) {        

        if (!filtered) {
            $http.get($scope.basePath + '/v1/AccommodationReduced?language=' + $scope.lang).success(function (data) {
                $scope.hotelitems = data;
            });
        }
        else {
            $scope.setFilters();

            $http.get($scope.basePath + '/v1/AccommodationReduced?language=' + $scope.lang + '&categoryfilter=' + $scope.categoryfilter + '&typefilter=' + $scope.typefilter + '&featurefilter=' + $scope.featurefilter + '&themefilter=' + $scope.themefilter + '&badgefilter=' + $scope.badgefilter + '&locfilter=' + $scope.locfilter + '&active=' + $scope.active + '&odhactive=' + $scope.smgactive + '&odhtagfilter=' + $scope.smgtagfilter).success(function (data) {
             $scope.hotelitems = data;
            });             
        }        
    }    

    $scope.$on('LoadAccoNamesList', function (e) {
        //alert("onkemmen");
        $scope.getHotelFilteredList(true);
    });

    $scope.$on('clearAcconamesFilter', function (e) {
        //alert("clearen");

        if ($scope.globallocfilter == '')
            $scope.getHotelFilteredList(false);
        else
            $scope.getHotelFilteredList(true);
    });
    
    //Logik der vorgefilterten Liste

    if ($scope.globallocfilter == '')
        $scope.getHotelFilteredList(false);
    else
        $scope.getHotelFilteredList(true);

    $scope.SelectedHotelName = "";

    $scope.onItemSelected = function () {
        $scope.hotelnametypeaheadselected = true;     
    }    
});

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
    else
    {
        //Wenn ein Globaler Locationfilter gesetzt ist so muss ich die Locations live holen welche zu diesem gehören
        $http({
            method: 'Get',
            url: $scope.basePath + '../api/Location?language=' + $scope.lang + '&locfilter=' + $scope.globallocfilter
        }).success(function (data) {
            $scope.locitems = data;

            //Aus Data ausserziagn no zu schaugn wia

            var locationobject= objectFindByKey(data, 'id', $scope.globallocfilter.substring(3));

            $scope.$parent.globallocfilterName = locationobject.name;
            $scope.$parent.SelectedLocationName = locationobject.name;
        });
    }


    $scope.onItemSelected = function () {
               
        //$scope.$parent.getHotelFilteredList($scope.SelectedLocationId, $scope.SelectedLocationTyp);


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

app.directive('typeaheadloc', function ($timeout) {
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

app.directive('typeaheadhotel', function ($timeout) {
    return {
        restrict: 'AEC',
        scope: {
            items: '=',
            prompt: '@',
            title: '@',
            //subtitle: '@',
            //bild: '@',
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
   }
});

//DatePicker controller
var DatepickerDemoCtrl = function ($scope) {
    //$scope.today = function (customdate) {

    //    //alert(customdate);
    //    if (customdate == null || customdate.length == 0) {
    //        //$scope.Datumvon = new Date();
    //    }
    //    else {
    //        //$scope.Datumvon = new Date(customdate);
    //    }
    //};

    //$scope.today($scope.Datumvon);

    $scope.clear = function () {
        //$scope.Datumvon = null;
    };

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

    $scope.changeDate = function (dateselected) {
        //alert("date changed");

        var tomorrow = new Date(dateselected);
        tomorrow.setDate(dateselected.getDate() + 1);

        $scope.$parent.Datumbis = tomorrow;
        //alert($scope.$parent.Datumbis);
    };


    $scope.initDate = new Date();
    $scope.formats = ['dd-MM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    $scope.format = $scope.formats[0];
};

//SMG Tags

var smgtagmodaltypeaheadcontroller = app.controller('SmgTagNameModalTypeAheadController', function ($scope, $http) {

    $scope.smgtagselected = false;

    $scope.getSmgTagNameListModal = function (lang) {

        $http({
            method: 'Get',
            url: $scope.basePath + '/v1/ODHTagReduced?localizationlanguage=' + lang + '&validforentity=Accommodation'
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
            url: $scope.basePath + '/v1/ODHTagReduced?localizationlanguage=' + lang + '&validforentity=Accommodation'
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