var app = angular.module('hgvpackage', ['ui.bootstrap', 'ngSanitize', 'appconfig', 'appfactory', 'leaflet-directive', 'pathconfig']);

app.controller('hgvpackageListController', [
    '$scope', '$http', '$modal', 'appconfig', 'leafletData', 'leafletmapsimple', 'apipath',
    function ($scope, $http, $modal, config, leafletData, leafletmapsimple, apipath) {

        $scope.lang = 'de';

        $scope.globallocfilter = '';
        $scope.globallocfilterName = '';
        $scope.globallocfilterId = '';
        $scope.globallocfilterType = '';

        $scope.page = 1;
        $scope.totalpages = 0;
        $scope.totalcount = 0;
        $scope.seed = 'null';
        $scope.filtered = false;

        $scope.basePath = apipath;

        //Package Filter
        $scope.SelectedPackageName = '';
        $scope.SelectedPackageId = '';
        $scope.packageidfilter = 'null';
        //SMG Tag Filter
        $scope.SelectedSmgTagName = '';
        $scope.SelectedSmgTagId = '';
        $scope.smgtagfilter = 'null';
        //Accommodation Filter
        $scope.SelectedAccoId = '';
        $scope.SelectedAccoName = '';
        $scope.accoidfilter = 'null';
        //Location Filter
        $scope.SelectedLocationName = '';
        $scope.SelectedLocationTyp = '';
        $scope.SelectedLocationId = '';
        $scope.locfilter = 'null';

        $scope.active = 'null';
        $scope.smgactive = 'null';

        //Longstay Shortstay
        $scope.shortstay = false;
        $scope.longstay = false;

        $scope.servicefilter = 'null';
        $scope.validfrom = 'null';
        $scope.validto = 'null';

        $scope.themefilter = 'null';

        $scope.longshortstayfilter = 'null';

        //Für Verfügbarkeitsanfrage
        $scope.persons = [0];
        $scope.roomcount = 1;
        $scope.roomtype = [0];
        $scope.roompersons = [];
        $scope.boardfilter = "Board0";

        var today = new Date();

        $scope.Datumvon = today;
        $scope.Datumbis = new Date();
        $scope.Datumbis.setDate(today.getDate() + 7);

        $scope.gbview = false;

        $scope.init = function (locfilter, locfiltertype, smgactive) {
                  
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

            if (smgactive != "" && smgactive != undefined) {
                if (smgactive != true) {

                    $scope.smgactive = true;
                    $scope.gbview = true;
                }
            }

            $scope.changePage(0);
        };

        $scope.edithgvpackage = function (hgvpackage) {

            if (hgvpackage === 'new') {

                $scope.newhgvpackage = true;
                $scope.hgvpackage = { Id: '', Shortname: '', _Meta: { Id: '', Type: 'package', Source: 'noi' } };
            }
            else {
                $scope.newhgvpackage = false;
                $scope.hgvpackage = hgvpackage;
            }

            var modalInstance = $modal.open({
                templateUrl: 'myPackageModal.html',
                controller: PackageModalInstanceCtrl,
                scope: $scope,
                size: 'lg',
                backdrop: 'static'
            });
        };

        $scope.deletehgvpackage = function (id) {

            var deleteconfirm = confirm('Are you absolutely sure you want to delete?');

            if (deleteconfirm) {

                $http.delete('/api/Package/' + id).success(function (result) {
                    alert("Package deleted!");

                    //$.each($scope.hgvpackages, function (i) {
                    //    if ($scope.hgvpackages[i].Id === id) {
                    //        $scope.hgvpackages.splice(i, 1);
                    //        return false;
                    //    }
                    //});
                    $scope.applyFilter($scope.page);

                }).error(function (data) {
                    alert("ERROR:" + data);
                });
            }
        };

        $scope.updatepackage = function (id) {

            $scope.isAccoDetailloading = true;
            $http.get($scope.basePath + '/v1/Update/Package/' + id).success(function (result) {
                
                console.log(result);
                $scope.isAccoDetailloading = false;
                alert(result);

                //noamol filter ausfiahrn
                $scope.applyFilter($scope.page);

            }).error(function (data) {
                alert("ERROR:" + data);
            });

        };
      
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

        //Verfügbarkeitsanfrage
        $scope.getAvailability = function () {
            var arrivalday = $scope.Datumvon.getDate();
            var arrivalmonth = parseInt($scope.Datumvon.getMonth()) + 1; //Months are zero based            
            var arrivalyear = $scope.Datumvon.getFullYear();

            var datefrom = arrivalyear + "-" + arrivalmonth + "-" + arrivalday;

            var departureday = $scope.Datumbis.getDate();
            var departuremonth = parseInt($scope.Datumbis.getMonth()) + 1; //Months are zero based            
            var departureyear = $scope.Datumbis.getFullYear();

            var dateto = departureyear + "-" + departuremonth + "-" + departureday;

            var bokfilter = 'hgv';

            var roominfo = '';

            for (i = 0; i < $scope.roomcount; i++) {

                roominfo = roominfo + $scope.roomtype[i] + '-' + $scope.roompersons[i].persons;

                var mycounter = parseInt($scope.roomcount) - 1;

                if (i < mycounter)
                    roominfo = roominfo + '|';
            }

            //alert(roominfo + " " + datefrom + " " + dateto);

            $scope.page = 1;
            $scope.isloading = true;

            setSubFilter();

            console.log($scope.basePath + '/v1/Package/Available/' + $scope.page + '/20/' + $scope.lang + '/' + $scope.accoidfilter + '/' + $scope.locfilter + '/' + $scope.themefilter + '/' + $scope.active + '/' + $scope.smgactive + '/' + $scope.smgtagfilter + '/' + $scope.boardfilter + '/' + datefrom + '/' + dateto + '/' + roominfo + '/' + $scope.seed);

            $http.get($scope.basePath + '/v1/Package/Available/' + $scope.page + '/20/' + $scope.lang + '/' + $scope.accoidfilter + '/' + $scope.locfilter + '/' + $scope.themefilter + '/' + $scope.active + '/' + $scope.smgactive + '/' + $scope.smgtagfilter + '/' + $scope.boardfilter + '/' + datefrom + '/' + dateto + '/' + roominfo + '/' + $scope.seed).success(function (result) {
                $scope.hgvpackages = result.Items;
                $scope.totalpages = result.TotalPages;
                $scope.totalcount = result.TotalResults;
                $scope.onlinecount = result.OnlineResults;
                $scope.seed = result.Seed;
                $scope.isloading = false;
            });
        }

        //Ende Verfügbarkeitsanfrage

        setFilterModel();

        function setFilterModel() {
            //Subtype CheckboxFilter
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
                27: false                          
            };            
        }

        function setSubFilter() {
            //Regions Filter
            //$scope.themefilter = "";

            //$.each($scope.checkThemeModel, function (i) {

            //    if ($scope.checkThemeModel[i] == true) {
            //        $scope.themefilter = $scope.themefilter + i + ',';
            //    }
            //});
           
            //if ($scope.themefilter == "")
            //    $scope.themefilter = "null";

            $scope.themefilter = "null";
            var flagcounter = 0;

            $.each($scope.checkThemeModel, function (i) {

                if ($scope.checkThemeModel[i] == true) {

                    var shifted = 1 << (i - 1);
                    flagcounter = flagcounter + shifted;
                }
            });

            if (flagcounter > 0) {
                $scope.themefilter = flagcounter;
            }


            if ($scope.SelectedSmgTagName != '')
                $scope.smgtagfilter = $scope.SelectedSmgTagId;
                        
            $scope.locationfilter = "null"
            $scope.loctyp = '';

            if ($scope.SelectedLocationId != undefined && $scope.SelectedLocationId != '') {
                $scope.locationfilter = $scope.SelectedLocationTyp + $scope.SelectedLocationId;
            }

            $scope.packageidfilter = "null"

            //alert($scope.SelectedPackageId);

            if ($scope.SelectedPackageId != '')
                $scope.packageidfilter = $scope.SelectedPackageId;

            $scope.longshortstayfilter = '';

            if ($scope.shortstay)
                $scope.longshortstayfilter = $scope.longshortstayfilter + 'shortstay';
            if ($scope.longstay)
                $scope.longshortstayfilter = $scope.longshortstayfilter + 'longstay';
            
            if(!$scope.shortstay && !$scope.longstay)
                $scope.longshortstayfilter = 'null';

            $scope.accoidfilter = "null"

            if ($scope.SelectedAccoId != '')
                $scope.accoidfilter = $scope.SelectedAccoId;
        }

        //Filter anwenden
        $scope.applyFilter = function (page, withoutrefresh) {

            $scope.isloading = true;
            $scope.page = page;            

            setSubFilter();

            console.log($scope.smgactive);

            $http.get($scope.basePath + '/v1/Package/Filtered/' + $scope.page + '/20' + '/' + $scope.packageidfilter + '/' + $scope.accoidfilter + '/' + $scope.locationfilter + '/' + $scope.servicefilter + '/' + $scope.themefilter + '/' + $scope.validfrom + '/' + $scope.validto + '/' + $scope.longshortstayfilter + '/' + $scope.active + '/' + $scope.smgactive + '/' + $scope.smgtagfilter).success(function (result) {
                $scope.hgvpackages = result.Items;
                $scope.totalpages = result.TotalPages;
                $scope.totalcount = result.TotalResults;
                $scope.onlinecount = -1;
                $scope.isloading = false;
                $scope.filtered = true;
            });

            if (withoutrefresh != true)
                $scope.$broadcast('LoadPackageNamesList');
        }

        //Filter Löschen
        $scope.clearFilter = function () {

            $scope.filtered = false;
            $scope.onlinecount = -1;

            //Package Filter
            $scope.SelectedPackageName = '';
            $scope.SelectedPackageId = '';
            $scope.packageidfilter = 'null';
            //SMG Tag Filter
            $scope.SelectedSmgTagName = '';
            $scope.SelectedSmgTagId = '';
            $scope.smgtagfilter = 'null';
            //Acco Name Filter
            $scope.SelectedAccoId = '';
            $scope.SelectedAccoName = '';
            $scope.accoidfilter = 'null';
            //Location Filter
     
            if ($scope.globallocfilter == '') {
                $scope.SelectedLocationName = '';
                $scope.SelectedLocationTyp = '';
                $scope.SelectedLocationId = '';
                $scope.locfilter = 'null';
            }
            else {
                $scope.SelectedLocationName = $scope.globallocfilterName;
                $scope.SelectedLocationTyp = $scope.globallocfilterType;
                $scope.SelectedLocationId = $scope.globallocfilterId;

                $scope.locfilter = $scope.globallocfilter;
            }



            //Shortstay Longstay
            $scope.shortstay = false;
            $scope.longstay = false;
            $scope.longshortstayfilter = 'null';

            $scope.servicefilter = 'null';
            $scope.validfrom = 'null';
            $scope.validto = 'null';
            $scope.themefilter = 'null';

            $scope.active = 'null';
            if ($scope.gbview == false)
                $scope.smgactive = 'null';
            
            $.each($scope.checkThemeModel, function (i) {
                $scope.checkThemeModel[i] = false;
            });
            
            $scope.page = 1;
            $scope.changePage(0);

            //$scope.$broadcast('LoadPackageNamesList');
        }

        //Seite Wechseln
        $scope.changePage = function (pageskip, withoutrefresh) {

            $scope.applyFilter($scope.page + pageskip, withoutrefresh);
        }        

        //Modal anzeigen
        $scope.showInfoModal = function (hgvpackage) {

            $scope.hgvpackage = hgvpackage;

            var slidemodalInstance = $modal.open({
                templateUrl: 'myPackageInfoModal.html',
                controller: InfoModalInstanceCtrl,
                scope: $scope,
                size: 'lg'
            });
        };

        //Modal anzeigen
        $scope.showhotelinfo = function (hgvid) {
           
            $scope.isAccoDetailloading = true;
            $http.get($scope.basePath + '/v1/Accommodation/Hgv/' + hgvid).success(function (result) {
                $scope.accommodation = result;
                $scope.isAccoDetailloading = false;

                var passedgps = [];
                passedgps.push({ Gpstype: 'position', Latitude: $scope.accommodation.Latitude, Longitude: $scope.accommodation.Longitude });

                leafletmapsimple.preparemap(passedgps, null, ['position'], 'hgvpackageListController');

                var slidemodalInstance = $modal.open({
                    templateUrl: 'myAccommodationInfoModal.html',
                    controller: AccoInfoModalInstanceCtrl,
                    scope: $scope,
                    size: 'lg'
                });
            });
           

            
        };

        $scope.showBookingInfo = function (hgvpackage) {

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
       
            //api/Package/AvailableSingle/{language}/{packageid}/{boardfilter}/{arrival}/{departure}/{roominfo}
            console.log('/api/Package/AvailableSingle/' + $scope.lang + '/' + hgvpackage.Id + '/' + $scope.boardfilter + '/' + datefrom + '/' + dateto + '/' + roominfo);

            $http.get($scope.basePath + '/v1/Package/AvailableSingle/' + $scope.lang + '/' + hgvpackage.Id + '/' + $scope.boardfilter + '/' + datefrom + '/' + dateto + '/' + roominfo).success(function (result) {
                $scope.hgvpackage = result;
                $scope.isDetailloading = false;
            });

            //alert($scope.accommodation.Id);

            var modalInstance = $modal.open({
                templateUrl: 'myBookingModal.html',
                controller: BookingModalInstanceCtrl,
                scope: $scope,
                size: 'lg'
            });
        };


        $scope.hgvpackages = [];

        //$scope.changePage(0);
    }]);

//Modal Controller
var PackageModalInstanceCtrl = function ($scope, $modalInstance, $http) {

    $scope.ok = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.addhgvpackage = function (hgvpackage, isvalid) {

        if (isvalid) {

            $http.post($scope.basePath + '/v1/Package', hgvpackage).success(function (result) {
                alert("Package added!");
                $scope.hgvpackages.push(hgvpackage);

                $modalInstance.close();
            });
        }
        else {
            alert("Invalid Data!");
        }
    };

    $scope.updatehgvpackage = function (hgvpackage, isvalid) {

        if (isvalid) {
            $http.put($scope.basePath + '/v1/Package/' + hgvpackage.Id, hgvpackage).success(function (result) {
                alert("Package updated!");
                $modalInstance.close();
            });
        }
        else {
            alert("Invalid Data!");
        }
    };    

    //Add SMG Tagging
    $scope.addtag = function (tag) {

        if ($scope.smgtag.smgtagid != "" && $scope.smgtag.smgtagid != undefined) {

            var addToArray = true;

            if ($scope.hgvpackage.SmgTags != null) {

                $.each($scope.hgvpackage.SmgTags, function (i) {

                    if ($scope.hgvpackage.SmgTags[i] === tag.toLowerCase()) {

                        alert('Already present!');
                        addToArray = false;

                        return false;
                    }
                });
            }
            else {
                $scope.hgvpackage.SmgTags = [];
            }


            if (addToArray) {

                $scope.hgvpackage.SmgTags.push(tag.toLowerCase());
            }
        }
        else {
            alert('Invalid Tag!');
        }
    }

    //Remove SMG Tagging
    $scope.deletetag = function (tag) {
        //alert(tag);
        $.each($scope.hgvpackage.SmgTags, function (i) {
            if ($scope.hgvpackage.SmgTags[i] === tag) {
                $scope.hgvpackage.SmgTags.splice(i, 1);
                return false;
            }
        });
    }

};

//Modal Slideshow Controller
var AccoInfoModalInstanceCtrl = function ($scope, $modalInstance, $http) {

    $scope.cancelslidemodal = function () {
        $modalInstance.dismiss('cancel');
    };

    //alert($scope.accommodation.Id);

    $scope.myInterval = 5000;
    //$scope.accoslides = ;
}

//Modal Slideshow Controller
var InfoModalInstanceCtrl = function ($scope, $modalInstance, $http) {

    $scope.cancelslidemodal = function () {        
        $modalInstance.dismiss('cancel');
    };

    $scope.myInterval = 5000;
    $scope.slides = $scope.hgvpackage.ImageGallery;
}

//Booking Modal Controller
var BookingModalInstanceCtrl = function ($scope, $modalInstance, $http) {    

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
};

//Angular RoomDetails Controller+
app.controller('RoomDetailController', function ($scope, $http) {

    $scope.isAccoDetailloading = true;

    $http.get($scope.basePath + '/v1/Accommodation/RoomDetail/' + $scope.accommodation.Id).success(function (result) {
        $scope.accommodationrooms = result;
        $scope.isAccoDetailloading = false;
        
        $scope.myInterval = 5000;
        //$scope.roomslides = $scope.accommodationrooms[0].ImageGallery;
    });

});

app.filter('moment', function () {
    return function (dateString, format) {        

        return moment(dateString).format(format);
    };
});

//Typeahead Packages Filter
var packagetypeaheadcontroller = app.controller('PackageNameTypeAheadController', function ($scope, $http) {

    $scope.packagenametypeaheadselected = false;

    $scope.getPackageNamesFilteredList = function (lang, accoidfilter, locationfilter, servicefilter, themefilter, validfrom, validto, longshortstay, smgtagfilter, active, smgactive) {

        //alert('/api/Activity/Reduced/' + $scope.lang + '/' + $scope.activitytype + '/' + $scope.subtypefilter + '/' + $scope.locationfilter);

        $http({
            method: 'Get',
            url: $scope.basePath + '/v1/Package/Reduced/' + lang + '/' + accoidfilter + '/' + locationfilter + '/' + servicefilter + '/' + themefilter + '/' + validfrom + '/' + validto + '/' + longshortstay + '/' + active + '/' + smgactive + '/' + smgtagfilter
        }).success(function (data) {
            $scope.items = data;
        });
    }

    $scope.$on('LoadPackageNamesList', function (e) {

        $scope.getPackageNamesFilteredList($scope.lang, $scope.accoidfilter, $scope.locationfilter, 'null', $scope.themefilter, 'null', 'null', 'null', $scope.smgtagfilter, $scope.active, $scope.smgactive);
    });

    $scope.getPackageNamesFilteredList($scope.lang, $scope.accoidfilter, $scope.locationfilter, 'null', $scope.themefilter, 'null', 'null', 'null', $scope.smgtagfilter, $scope.active, $scope.smgactive);

    $scope.onItemSelected = function () {
        $scope.packagenametypeaheadselected = true;
    }
});

//Typeahead Location Filter
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

//Typeahead SMGTags Modal
var smgtagmodaltypeaheadcontroller = app.controller('SmgTagNameModalTypeAheadController', function ($scope, $http) {

    $scope.smgtagselected = false;

    $scope.getSmgTagNameListModal = function (lang) {

        $http({
            method: 'Get',
            url: $scope.basePath + '/v1/SmgTag/Reduced/' + lang + '/Package'
        }).success(function (data) {
            $scope.items = data;
        });
    }

    $scope.getSmgTagNameListModal($scope.lang);

    $scope.onItemSelected = function () {
        $scope.smgtagselected = true;
    }
});

//Typeahead SmgTags Filter
var smgtagtypeaheadcontroller = app.controller('SmgTagNameTypeAheadController', function ($scope, $http) {

    $scope.articlenametypeaheadselected = false;

    $scope.getSmgTagNameList = function (lang) {

        $http({
            method: 'Get',
            url: $scope.basePath + '/v1/SmgTag/Reduced/' + lang + '/Package'
        }).success(function (data) {
            $scope.items = data;
        });
    }

    $scope.getSmgTagNameList($scope.lang);

    $scope.onItemSelected = function () {
        $scope.articlenametypeaheadselected = true;
    }
});

//Accommodation Typeahead Filter
var hoteltypeaheadcontroller = app.controller('HotelnameTypeAheadController', function ($scope, $http) {

    $scope.hotelnametypeaheadselected = false;

    $scope.getHotelFilteredList = function (filtered) {

        if (!filtered) {
            $http.get($scope.basePath + '/v1/Accommodation/Reduced/All/' + $scope.lang).success(function (data) {
                $scope.hotelitems = data;
            });
        }
        else {
            $scope.setFilters();

            //console.log('/api/Accommodation/Reduced/Filtered/'+ $scope.categoryfilter + '/' + $scope.typefilter + '/null/' + $scope.featurefilter + '/' + $scope.themefilter + '/' + $scope.badgefilter + '/' + $scope.locfilter);

            //do brauchi die language wegen transformer
            $http.get($scope.basePath + '/v1/Accommodation/Reduced/Filtered/' + $scope.lang + '/' + $scope.categoryfilter + '/' + $scope.typefilter + '/null/' + $scope.featurefilter + '/' + $scope.themefilter + '/' + $scope.badgefilter + '/' + $scope.locfilter + '/' + $scope.active + '/' + $scope.smgactive + '/' + $scope.smgtagfilter).success(function (data) {
                $scope.hotelitems = data;
            });
        }
    }

    //$scope.$on('LoadAccoNamesList', function (e) {
    //    //alert("onkemmen");
    //    $scope.getHotelFilteredList(true);
    //});

    //$scope.$on('clearAcconamesFilter', function (e) {
    //    //alert("clearen");
    //    $scope.getHotelFilteredList(false);
    //});

    $scope.getHotelFilteredList(false);

    $scope.SelectedHotelName = "";

    $scope.onItemSelected = function () {
        $scope.hotelnametypeaheadselected = true;
    }
});

//Directive Location
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

//Directive Typeahead
app.directive('typeaheadpackage', function ($timeout) {
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

//Directive Typeahead Hotel
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
var DatepickerCtrl = function ($scope) {
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