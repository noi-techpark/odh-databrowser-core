var app = angular.module('venue', ['ui.bootstrap', 'ui-rangeSlider', 'ngSanitize', 'appconfig', 'appfactory', 'leaflet-directive', 'pathconfig']);

app.controller('venueListController', [
    '$scope', '$http', '$modal', '$sanitize', 'appconfig', 'leafletData', 'leafletmapsimple', 'languageFactory', 'apipath',
    function ($scope, $http, $modal, $sanitize, appconfig, leafletData, leafletmapsimple, languageFactory, apipath) {

        $scope.basePath = apipath;
        $scope.lang = 'deu';

        $scope.globallocfilter = '';
        $scope.globallocfilterName = '';
        $scope.globallocfilterId = '';
        $scope.globallocfilterType = '';

        $scope.init = function (locfilter, locfiltertype) {
            //This function is sort of private constructor for controller   
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

        $scope.editvenue = function (venue) {

            if (venue === 'new') {

                $scope.newvenue = true;
                $scope.venue = { Id: '', Shortname: '' };
            }
            else {
                $scope.newvenue = false;
                $scope.venue = venue;
            }

            var modalInstance = $modal.open({
                templateUrl: 'myVenueModal.html',
                controller: VenueModalInstanceCtrl,
                scope: $scope,
                //size: 'lg',
                windowClass: 'modal-wide',
                backdrop: 'static'
            });
        };

        $scope.deletevenue = function (id) {

            var deleteconfirm = confirm('Are you absolutely sure you want to delete?');

            if (deleteconfirm) {
                $http.delete($scope.basePath + '/v1/Venue/' + id).success(function (result) {
                    alert("Venue deleted!");

                    //$.each($scope.events, function (i) {
                    //    if ($scope.events[i].Id === id) {
                    //        $scope.events.splice(i, 1);
                    //        return false;
                    //    }
                    //});
                    $scope.applyFilter($scope.page);

                }).error(function (data) {
                    alert("ERROR:" + data);
                });
            }
        };

        $scope.updatevenue = function (id) {

            $scope.isloading = true;
            $http.get($scope.basePath + '/v1/Update/Venue/' + id).success(function (result) {

                console.log(result);
                $scope.isloading = false;
                alert(result);

                //noamol filter ausfiahrn
                $scope.applyFilter($scope.page);

            }).error(function (data) {
                alert("ERROR:" + data);
            });

        };

        $scope.page = 1;
        $scope.totalpages = 0;
        $scope.totalcount = 0;
        $scope.filtered = false;
        $scope.seed = 'null';

        //Name
        $scope.SelectedVenueName = '';
        $scope.SelectedVenueId = '';        

        //Location
        $scope.SelectedLocationName = '';
        $scope.SelectedLocationTyp = '';
        $scope.SelectedLocationId = '';

        //SMG Tags
        $scope.SelectedSmgTagName = '';
        $scope.SelectedSmgTagId = '';        

        //Custom Filters
        $scope.smgtagfilter = 'null';
        $scope.venueidfilter = 'null';
        $scope.locationfilter = 'null';
        $scope.catfilter = "null";
        $scope.featfilter = "null";
        $scope.typefilter = "null";
        
        $scope.active = 'null';
        $scope.smgactive = 'null';

        $scope.capacityrangefilter = 'null';
        $scope.capacityrange = { min: 0, max: 1000 };

        $scope.roomcountrangefilter = 'null';
        $scope.roomcountrange = { min: 0, max: 1000 };

        //Filter anwenden
        $scope.applyFilter = function (page) {

            $scope.isloading = true;
            $scope.filtered = true;
            $scope.page = page;
                          
            setFilters();            

            var venueidfilterqs = "";
            var locfilterqs = "";
            var catfilterqs = "";
            var featfilterqs = "";
            var typefilterqs = "";
            var activefilterqs = "";
            var odhactivefilterqs = "";
            var odhtagfilterqs = "";
            var capacityfilterqs = "";
            var roomcountfilterqs = "";

            if ($scope.venueidfilter != "null")
                venueidfilterqs = "&idlist=" + $scope.venueidfilter;

            if ($scope.locationfilter != "null")
                locfilterqs = "&locfilter=" + $scope.locationfilter;

            if ($scope.catfilter != "null")
                catfilterqs = "&categoryfilter=" + $scope.catfilter;

            if ($scope.featfilter != "null")
                featfilterqs = "&featurefilter=" + $scope.featfilter;

            if ($scope.typefilter != "null")
                typefilterqs = "&setuptypefilter=" + $scope.typefilter;

            if ($scope.active != "null")
                activefilterqs = "&active=" + $scope.active;

            if ($scope.smgactive != "null")
                odhactivefilterqs = "&odhactive=" + $scope.smgactive;

            if ($scope.smgtagfilter != "null")
                odhtagfilterqs = "&odhtagfilter=" + $scope.smgtagfilter;

            if ($scope.capacityrange.min > 0 || $scope.capacityrange.max < 10)
                $scope.capacityrangefilter = $scope.capacityrange.min + ',' + $scope.capacityrange.max;
            else
                $scope.capacityrangefilter = 'null';

            if ($scope.capacityrangefilter != "null")
                capacityfilterqs = "&capacityfilter=" + $scope.capacityrangefilter;

            if ($scope.roomcountrange.min > 0 || $scope.roomcountrange.max < 10)
                $scope.roomcountrangefilter = $scope.roomcountrange.min + ',' + $scope.roomcountrange.max;
            else
                $scope.roomcountrangefilter = 'null';

            if ($scope.roomcountrangefilter != "null")
                roomcountfilterqs = "&roomcountfilter=" + $scope.roomcountrangefilter;


            $http.get($scope.basePath + '/v1/Venue?pagenumber=' + $scope.page + '&pagesize=20' + venueidfilterqs + locfilterqs + catfilterqs + featfilterqs + typefilterqs + activefilterqs + odhactivefilterqs + odhtagfilterqs + capacityfilterqs + roomcountfilterqs).success(function (result) {
                $scope.venues = result.Items;
                $scope.totalpages = result.TotalPages;
                $scope.totalcount = result.TotalResults;
                $scope.seed = result.Seed;
                $scope.isloading = false;
            });

            $scope.$broadcast('LoadVenueNamesList');
        }

        //Filter Löschen
        $scope.clearFilter = function () {
            
            $scope.smgtagfilter = 'null';
            $scope.venueidfilter = 'null';
            $scope.locationfilter = 'null';
            $scope.typefilter = "null";
            $scope.catfilter = "null";
            $scope.featfilter = "null";
            $scope.active = 'null';
            $scope.smgactive = 'null';
            $scope.SelectedVenueName = '';
            $scope.SelectedVenueId = '';
            $scope.capacityrangefilter = 'null';
            $scope.capacityrange = { min: 0, max: 1000 };
            $scope.roomcountrangefilter = 'null';
            $scope.roomcountrange = { min: 0, max: 1000 };

            //Location
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

            //SMG Tags
            $scope.SelectedSmgTagName = '';
            $scope.SelectedSmgTagId = '';

            $.each($scope.checkVenuecatModel, function (i) {
                $scope.checkVenuecatModel[i] = false;
            });

            $.each($scope.checkVenuefeatModel, function (i) {
                $scope.checkVenuefeatModel[i] = false;
            });

            $.each($scope.checkVenueseatModel, function (i) {
                $scope.checkVenueseatModel[i] = false;
            });

            $scope.filtered = false;
            $scope.page = 1;
            $scope.changePage(0);

            $scope.$broadcast('LoadVenueNamesList');
        }

        function setFilters() {
           
             if ($scope.SelectedSmgTagName != '')
                $scope.smgtagfilter = $scope.SelectedSmgTagId;

            if ($scope.SelectedVenueId != '')
                $scope.venueidfilter = $scope.SelectedVenueId;

            if ($scope.SelectedLocationId != '')
                $scope.locationfilter = $scope.SelectedLocationTyp + $scope.SelectedLocationId;

            //Category:
            $scope.catfilter = "null";
            var flagcounter = 0;

            $.each($scope.checkVenuecatModel, function (i) {

                if ($scope.checkVenuecatModel[i] == true) {

                    var shifted = 1 << (i - 1);
                    flagcounter = flagcounter + shifted;                    
                }
            });

            if(flagcounter > 0)
            {
                $scope.catfilter = flagcounter;
            }


            //Features:
            $scope.featfilter = "null";
            var flagcounterfeature = 0;

            $.each($scope.checkVenuefeatModel, function (i) {

                if ($scope.checkVenuefeatModel[i] == true) {

                    var shifted = 1 << (i - 1);
                    flagcounterfeature = flagcounterfeature + shifted;
                }
            });

            if (flagcounterfeature > 0) {
                $scope.featfilter = flagcounterfeature;
            }

            //Types:
            $scope.typefilter = "null";
            var flagcountertype = 0;

            $.each($scope.checkVenueseatModel, function (i) {

                if ($scope.checkVenueseatModel[i] == true) {

                    var shifted = 1 << (i - 1);
                    flagcountertype = flagcountertype + shifted;
                }
            });

            if (flagcountertype > 0) {
                $scope.typefilter = flagcountertype;
            }
            
        }

        function setCheckModels() {            

            $scope.checkVenuecatModel = {
                1: false,
                2: false,
                3: false,
                4: false,
                5: false,
                6: false,
                7: false
            };

            $scope.checkVenuefeatModel = {
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

            $scope.checkVenueseatModel = {
                1: false,
                2: false,
                3: false,
                4: false,
                5: false,
                6: false
            };
        }

        //Seite Wechseln
        $scope.changePage = function (pageskip) {

            $scope.page = $scope.page + pageskip;
            $scope.isloading = true;

            if ($scope.filtered || $scope.globallocfilter != '') {
                $scope.applyFilter($scope.page);
            }
            else {
                //$http.get($scope.basePath + '/v1/Event/Paged/' + $scope.page + '/' + 20 + '/' + $scope.seed).success(function (result) {
                //    $scope.events = result.Items;
                //    $scope.totalpages = result.TotalPages;
                //    $scope.totalcount = result.TotalResults;
                //    $scope.seed = result.Seed;
                //    $scope.isloading = false;
                //});

                $scope.applyFilter(1);
            }

            
        }        

		//single Clear Filter
		$scope.clearNameFilter = function () {
			$scope.SelectedVenueName = '';
			$scope.SelectedVenueId = '';
			$scope.venueidfilter = 'null';
			$scope.page = 1;
            $scope.changePage(0);		

            $scope.$broadcast('LoadVenueNamesList');
		}

		$scope.clearLocationFilter = function () {
			
			$scope.SelectedLocationName = '';
			$scope.SelectedLocationTyp = '';
			$scope.SelectedLocationId = '';
			$scope.locationfilter = 'null';
			
			$scope.page = 1;
            $scope.changePage(0);

            $scope.$broadcast('LoadVenueNamesList');
		}

		$scope.clearTagFilter = function () {
			$scope.SelectedSmgTagName = '';
			$scope.SelectedSmgTagId = '';
			$scope.smgtagfilter = 'null';
			$scope.page = 1;
            $scope.changePage(0);

            $scope.$broadcast('LoadVenueNamesList');
		}

		$scope.clearCatFilter = function () {

            $.each($scope.checkVenuecatModel, function (i) {
                $scope.checkVenuecatModel[i] = false;
			});
			$scope.page = 1;
            $scope.changePage(0);	

            $scope.$broadcast('LoadVenueNamesList');
        }

        $scope.clearFeatFilter = function () {

            $.each($scope.checkVenuefeatModel, function (i) {
                $scope.checkVenuefeatModel[i] = false;
            });
            $scope.page = 1;
            $scope.changePage(0);

            $scope.$broadcast('LoadVenueNamesList');
        }

        $scope.clearTypeFilter = function () {

            $.each($scope.checkVenueseatModel, function (i) {
                $scope.checkVenueseatModel[i] = false;
            });
            $scope.page = 1;
            $scope.changePage(0);

            $scope.$broadcast('LoadVenueNamesList');
        }

		$scope.clearActiveFilter = function () {

			$scope.smgactive = 'null';

			$scope.page = 1;
            $scope.changePage(0);	

            $scope.$broadcast('LoadVenueNamesList');
		}

		$scope.clearTICActiveFilter = function () {

			$scope.active = 'null';

			$scope.page = 1;
            $scope.changePage(0);

            $scope.$broadcast('LoadVenueNamesList');
		}

        $scope.clearCapacityFilter = function () {

            $scope.capacityrange = { min: 0, max: 1000 };
            $scope.capacityrangefilter = 'null';

            $scope.page = 1;
            $scope.changePage(0);

            $scope.$broadcast('LoadVenueNamesList');
        }

        $scope.clearRoomCountFilter = function () {

            $scope.roomcountrange = { min: 0, max: 1000 };
            $scope.roomcountrangefilter = 'null';

            $scope.page = 1;
            $scope.changePage(0);

            $scope.$broadcast('LoadVenueNamesList');
        }

        //Modal anzeigen
        $scope.showInfoModal = function (venue) {

            $scope.venue = venue;
           
            var passedgps = [];
            
            if ($scope.venue.attributes.geometries && $scope.venue.attributes.geometries.length > 0) {
                var geometry = $scope.venue.attributes.geometries[0];
                if (geometry) {
                    passedgps.push({ Gpstype: 'position', Latitude: geometry.coordinates[0], Longitude: geometry.coordinates[1] });

                    leafletmapsimple.preparemap(passedgps, null, ['position'], 'venueListController');
                }
            }
            
            var slidemodalInstance = $modal.open({
                templateUrl: 'myVenueInfoModal.html',
                controller: InfoModalInstanceCtrl,
                scope: $scope,
                size: 'lg'
            });
        };

        setCheckModels();

        $scope.venues = [];
    }]);

//Modal Controller
var VenueModalInstanceCtrl = function ($scope, $modalInstance, $http) {

    $scope.ok = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.addvenue = function (venue, isvalid) {

        if (isvalid) {

            $http.post($scope.basePath + '/v1/Venue', venue).success(function (result) {
                alert("venue added!");
                $scope.venues.push(venue);

                $modalInstance.close();
            });
        }
        else {
            alert("Invalid Data!");
        }
    };

    $scope.updatevenue = function (venue, isvalid) {

        if (isvalid) {
            $http.put($scope.basePath + '/v1/Venue/' + venue.Id, venue).success(function (result) {
                alert("venue updated!");
                $modalInstance.close();
            });
        }
        else {
            alert("Invalid Data!");
        }
    };   

    //Add SMG Tagging
    $scope.addtag = function (tag) {

        if (tag != "" && tag != undefined) {


            var addToArray = true;

            //alert(tag);

            if ($scope.venue.odhdata.SmgTags != null) {

                $.each($scope.venue.SmgTags, function (i) {

                    if ($scope.venue.SmgTags[i] === tag) {

                        alert('Already present!');
                        addToArray = false;

                        return false;
                    }
                });
            }
            else {
                $scope.venue.SmgTags = [];
            }


            if (addToArray) {

                $scope.venue.SmgTags.push(tag);

                //alert("added");
            }
        }
        else {
            alert('Invalid Tag!');
        }
    }

    //Remove SMG Tagging
    $scope.deletetag = function (tag) {

        $.each($scope.venue.SmgTags, function (i) {
            if ($scope.venue.SmgTags[i] === tag) {
                $scope.venue.SmgTags.splice(i, 1);
                return false;
            }
        });
    }

};

//Modal Slideshow Controller
var InfoModalInstanceCtrl = function ($scope, $modalInstance, $http, $sanitize) {

    $scope.cancelslidemodal = function () {        
        $modalInstance.dismiss('cancel');
    };

    $scope.myInterval = 5000;
    //TODO ADD IMAGE URLS
    //filter: { attributes: { contentType: 'image/jpeg' } }

    var slidelist = [];

    $.each($scope.venue.relationships.multimediaDescriptions.data, function (i) {
        if ($scope.venue.relationships.multimediaDescriptions.data[i].attributes.contentType === 'image/jpeg') {
            slidelist.push($scope.venue.relationships.multimediaDescriptions.data[i].attributes);
        }
    });

    $scope.slides = slidelist;
}

//var wysiwygeditorCtrl = function ($scope) {
//    $scope.htmlcontentbase = "<div></div>";  
//    $scope.disabled = false;
//};

app.filter('moment', function () {
    return function (dateString, format) {
        return moment(dateString).format(format);
    };
});

app.filter('decoded', ['$sanitize', function ($sanitize) {
    function htmlDecode(input) {
        
        var e = document.createElement('div');
        e.innerHTML = input;
        console.log(decodeURIComponent(input));
        return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
    }

    return function (input) {
        return htmlDecode(input);
    }
}]);

app.filter('decoded2', ['$sanitize', function ($sanitize) {
    function htmlDecode(input) {

        var e = document.createElement('div');
        e.innerHTML = unescape(input.replace('data:text/html;charset:utf8,', ''));
        console.log(unescape(input.replace('data:text/html;charset:utf8,', '')));
        return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
    }

    return function (input) {
        return htmlDecode(input);
    }
}]);

//Controller for Location Select
var locationlistcontroller = app.controller('LocationTypeAheadController', function ($scope, $http) {

    $scope.locationnametypeaheadselected = false;

    if ($scope.globallocfilter == '') {
        $http({
            method: 'Get',
            url: $scope.basePath + '/json/LocInfoMtaRegTvsMunFra' + $scope.lang.substring(0,2) + '.json'
        }).success(function (data) {
            $scope.locitems = data;
        });
    }
    else {
        //Wenn ein Globaler Locationfilter gesetzt ist so muss ich die Locations live holen welche zu diesem gehören
        $http({
            method: 'Get',
            url: $scope.basePath + '../api/Location/LocationList/' + $scope.lang.substring(0, 2) + '/' + $scope.globallocfilter
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

var venuetypeaheadcontroller = app.controller('VenueTypeAheadController', function ($scope, $http) {

    $scope.venuenametypeaheadselected = false;

    $scope.getVenuenamesFilteredList = function (lang) {
      
	    $http({
                method: 'Get',
				url: $scope.basePath + '/v1/VenueReduced?language=' + lang 
            }).success(function (data) {
                $scope.items = data;
            });
    
    }

    $scope.$on('LoadVenueNamesList', function (e) {

		$scope.getVenuenamesFilteredList($scope.lang);
    });

	$scope.getVenuenamesFilteredList($scope.lang);

    $scope.onItemSelected = function () {
        $scope.venuenametypeaheadselected = true;
    }
});

//Directive Typeahead
app.directive('typeaheadvenue', function ($timeout) {
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
            url: $scope.basePath + '/v1/SmgTag/Reduced/' + lang + '/Venue'
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
            url: $scope.basePath + '/v1/SmgTag/Reduced/' + lang + '/Venue'
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

    $scope.open = function ($venue) {
        $venue.preventDefault();
        $venue.stopPropagation();

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



