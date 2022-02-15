var app = angular.module('event', ['ui.bootstrap', 'ngSanitize', 'appconfig', 'appfactory', 'textAngular', 'leaflet-directive', 'pathconfig']);

app.controller('eventListController', [
    '$scope', '$http', '$modal', 'appconfig', 'leafletData', 'leafletmapsimple', 'languageFactory', 'apipath',
    function ($scope, $http, $modal, config, leafletData, leafletmapsimple, languageFactory, apipath) {

        $scope.basePath = apipath;
        $scope.lang = languageFactory.getLanguage();

        var allowedlanguages = ['de', 'it', 'en'];

        $scope.globallocfilter = '';
        $scope.globallocfilterName = '';
        $scope.globallocfilterId = '';
        $scope.globallocfilterType = '';

        $scope.source = 'null';
        $scope.predefinedsource = false;


        $scope.gbview = false;

        $scope.init = function (locfilter, locfiltertype, smgactive, source) {

            //fallback if language is not available here set it back to browserlanguage
            if (!allowedlanguages.includes($scope.lang)) {
                $scope.lang = 'en';
            }

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

            if (source != "" && source != undefined) {

                console.log(source);

                $scope.source = source;
                $scope.predefinedsource = true;
            }

            //console.log(smgactive);

            if (smgactive != "" && smgactive != undefined) {
                if (smgactive == true) {

                    $scope.smgactive = true;
                    $scope.gbview = true;
                }                
            }


            $scope.changePage(0);
        };

        $scope.changeLanguage = function () {

            languageFactory.setLanguage($scope.lang);
            console.log(languageFactory.getLanguage());

            //Reload Entire PAge (Hack)
            location.reload();
        };

        $scope.editevent = function (event) {

            if (event === 'new') {

                $scope.newevent = true;
                $scope.event = { Id: '', Shortname: '', _Meta: { Id: '', Type: 'event', Source: 'noi' } };
            }
            else {
                $scope.newevent = false;
                $scope.event = event;
            }

            var modalInstance = $modal.open({
                templateUrl: 'myEventModal.html',
                controller: EventModalInstanceCtrl,
                scope: $scope,
                //size: 'lg',
                windowClass: 'modal-wide',
                backdrop: 'static'
            });
        };

        $scope.deleteevent = function (id) {

            var deleteconfirm = confirm('Are you absolutely sure you want to delete?');

            if (deleteconfirm) {
                $http.delete($scope.basePath + '/v1/Event/' + id).success(function (result) {
                    alert("Event deleted!");

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

        $scope.updateevent = function (id) {

            $scope.isloading = true;
            $http.get($scope.basePath + '/v1/Update/Event/' + id).success(function (result) {

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
        $scope.SelectedEventName = '';
        $scope.SelectedEventId = '';        

        //Location
        $scope.SelectedLocationName = '';
        $scope.SelectedLocationTyp = '';
        $scope.SelectedLocationId = '';

        //SMG Tags
        $scope.SelectedSmgTagName = '';
        $scope.SelectedSmgTagId = '';        

        //Custom Filters
        $scope.smgtagfilter = 'null';
        $scope.eventidfilter = 'null';
        $scope.locationfilter = 'null';
        $scope.topicfilter = "null";
        $scope.rancfilter = "null";
        $scope.typefilter = "null";
        $scope.orgridfilter = "null";

        $scope.active = 'null';
        $scope.smgactive = 'null';

    
        //Datumsfilter
        //var today = new Date();

        //$scope.Datumvon = today;
        //$scope.Datumbis = new Date();
        //$scope.Datumbis.setDate(today.getDate() + 7);

        //$scope.Datumvon = '';
        $scope.Datumvon = new Date();
        $scope.Datumbis = '';
        $scope.datumvonfilter = 'null';
        $scope.datumbisfilter = 'null';

        $scope.sortdescfilter = 'asc';

        //Filter anwenden
        $scope.applyFilter = function (page, withoutrefresh) {

            $scope.isloading = true;
            $scope.filtered = true;
            $scope.page = page;
                          
            setFilters();            

            $http.get($scope.basePath + '/v1/Event?pagenumber=' + $scope.page + '&pagesize=20&idlist=' + $scope.eventidfilter + '&locfilter=' + $scope.locationfilter + '&rancfilter=' + $scope.rancfilter + '&typefilter=' + $scope.typefilter + '&topicfilter=' + $scope.topicfilter + '&orgfilter=' + $scope.orgridfilter + '&active=' + $scope.active + '&odhactive=' + $scope.smgactive + '&odhtagfilter=' + $scope.smgtagfilter + '&begindate=' + $scope.datumvonfilter + '&enddate=' + $scope.datumbisfilter + '&source=' + $scope.source + '&sort=' + $scope.sortdescfilter + '&langfilter=' + $scope.lang).success(function (result) {
                $scope.events = result.Items;
                $scope.totalpages = result.TotalPages;
                $scope.totalcount = result.TotalResults;
                $scope.seed = result.Seed;
                $scope.isloading = false;
            });

            if (withoutrefresh != true)
                $scope.$broadcast('LoadEventNamesList');
        }

        //Filter Löschen
        $scope.clearFilter = function () {
            
            $scope.smgtagfilter = 'null';
            $scope.eventidfilter = 'null';
            $scope.locationfilter = 'null';
            $scope.topicfilter = "null";
            $scope.rancfilter = "null";
            $scope.typefilter = "null";
            $scope.orgridfilter = "null";
            $scope.active = 'null';
            if ($scope.gbview == false)
                $scope.smgactive = 'null';
            $scope.SelectedEventName = '';
            $scope.SelectedEventId = '';
            $scope.Datumvon = new Date();
            $scope.Datumbis = '';
            $scope.datumvonfilter = 'null';
            $scope.datumbisfilter = 'null';
            $scope.sortdescfilter = 'asc';

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

            $.each($scope.checkEventTopicModel, function (i) {
                $scope.checkEventTopicModel[i] = false;
            });

            $scope.source = 'null';

            $scope.filtered = false;
            $scope.page = 1;
            $scope.changePage(0);

            //$scope.$broadcast('LoadEventNamesList');
        }

        //single Clear Filter
        $scope.clearNameFilter = function () {
            $scope.SelectedEventName = '';
            $scope.SelectedEventId = '';
            $scope.eventidfilter = 'null';
            $scope.page = 1;
            $scope.changePage(0);

            //$scope.$broadcast('LoadEventNamesList');
        }

        $scope.clearLocationFilter = function () {

            $scope.SelectedLocationName = '';
            $scope.SelectedLocationTyp = '';
            $scope.SelectedLocationId = '';
            $scope.locationfilter = 'null';

            $scope.page = 1;
            $scope.changePage(0);

            //$scope.$broadcast('LoadEventNamesList');
        }

        $scope.clearTagFilter = function () {
            $scope.SelectedSmgTagName = '';
            $scope.SelectedSmgTagId = '';
            $scope.smgtagfilter = 'null';
            $scope.page = 1;
            $scope.changePage(0);

            //$scope.$broadcast('LoadEventNamesList');
        }

        $scope.clearTopicFilter = function () {

            $.each($scope.checkEventTopicModel, function (i) {
                $scope.checkEventTopicModel[i] = false;
            });
            $scope.page = 1;
            $scope.changePage(0);

            //$scope.$broadcast('LoadEventNamesList');
        }

        $scope.clearActiveFilter = function () {

            $scope.smgactive = 'null';

            $scope.page = 1;
            $scope.changePage(0);

            //$scope.$broadcast('LoadEventNamesList');
        }

        $scope.clearTICActiveFilter = function () {

            $scope.active = 'null';

            $scope.page = 1;
            $scope.changePage(0);

            //$scope.$broadcast('LoadEventNamesList');
        }

        $scope.clearDateFilter = function () {

            $scope.Datumvon = '';
            $scope.Datumbis = '';
            $scope.datumvonfilter = 'null';
            $scope.datumbisfilter = 'null';
            $scope.sortdescfilter = 'true';

            $scope.page = 1;
            $scope.changePage(0);

            //$scope.$broadcast('LoadEventNamesList');
        }

        $scope.clearSourceFilter = function () {

            $scope.source = 'null';

            $scope.page = 1;
            $scope.changePage(0);

            //$scope.$broadcast('LoadPoiNamesList');
        }


        function setFilters() {
           
            //$scope.topicfilter = "";          

            //$.each($scope.checkEventtypeModel, function (i) {

            //    if ($scope.checkEventtypeModel[i] == true) {
            //        $scope.topicfilter = $scope.topicfilter + i + ',';
            //    }
            //});
          
            //if ($scope.topicfilter == "")
            //    $scope.topicfilter = "null";          

            if ($scope.SelectedSmgTagName != '')
                $scope.smgtagfilter = $scope.SelectedSmgTagId;

            if ($scope.SelectedEventId != '')
                $scope.eventidfilter = $scope.SelectedEventId;

            if ($scope.SelectedLocationId != '')
                $scope.locationfilter = $scope.SelectedLocationTyp + $scope.SelectedLocationId;

            //NEU:

            $scope.topicfilter = "null";
            var flagcounter = 0;

            $.each($scope.checkEventTopicModel, function (i) {

                if ($scope.checkEventTopicModel[i] == true) {

                    var shifted = 1 << (i - 1);
                    flagcounter = flagcounter + shifted;                    
                }
            });

            if(flagcounter > 0)
            {
                $scope.topicfilter = flagcounter;
            }

            //DATE Gschicht
            $scope.datumvonfilter = 'null';
            $scope.datumbisfilter = 'null';

            if ($scope.Datumvon != '' && $scope.Datumvon != undefined) {

                var arrivalday = $scope.Datumvon.getDate();
                var arrivalmonth = parseInt($scope.Datumvon.getMonth()) + 1; //Months are zero based            
                var arrivalyear = $scope.Datumvon.getFullYear();

                $scope.datumvonfilter = arrivalyear + "-" + arrivalmonth + "-" + arrivalday;                 
            }
            if ($scope.Datumbis != '' && $scope.Datumbis != undefined) {

                var arrivalday2 = $scope.Datumbis.getDate();
                var arrivalmonth2 = parseInt($scope.Datumbis.getMonth()) + 1; //Months are zero based            
                var arrivalyear2 = $scope.Datumbis.getFullYear();

                $scope.datumbisfilter = arrivalyear2 + "-" + arrivalmonth2 + "-" + arrivalday2;
            }            

        }

        function setCheckModels() {
            //Subtype CheckboxFilter
            //$scope.checkEventtypeModel = {
            //    1: false,
            //    2: false,
            //    3: false,
            //    4: false,
            //    5: false,
            //    6: false,
            //    7: false,
            //    8: false,
            //    9: false,
            //    10: false,
            //    11: false,
            //    12: false,
            //    13: false
            //};

            $scope.checkEventTopicModel = {
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
                13: false
            };
        }

        //Seite Wechseln
        $scope.changePage = function (pageskip, withoutrefresh) {

            $scope.page = $scope.page + pageskip;
            $scope.isloading = true;

            $scope.applyFilter($scope.page, withoutrefresh);            
        }        

        //Modal anzeigen
        $scope.showInfoModal = function (event) {

            $scope.event = event;

            var passedgps = [];
            passedgps.push({ Gpstype: 'position', Latitude: $scope.event.Latitude, Longitude: $scope.event.Longitude });

            leafletmapsimple.preparemap(passedgps, null, ['position'], 'eventListController');


            var slidemodalInstance = $modal.open({
                templateUrl: 'myEventInfoModal.html',
                controller: InfoModalInstanceCtrl,
                scope: $scope,
                size: 'lg'
            });
        };

        setCheckModels();

        $scope.events = [];
    }]);

//Modal Controller
var EventModalInstanceCtrl = function ($scope, $modalInstance, $http) {

    $scope.ok = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.addevent = function (event, isvalid) {

        if (isvalid) {

            $http.post($scope.basePath + '/v1/Event', event).success(function (result) {
                alert("Event added!");
                $scope.events.push(event);

                $modalInstance.close();
            });
        }
        else {
            alert("Invalid Data!");
        }
    };

    $scope.updateevent = function (event, isvalid) {

        if (isvalid) {
            $http.put($scope.basePath + '/v1/Event/' + event.Id, event).success(function (result) {
                alert("Event updated!");
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

            if ($scope.event.SmgTags != null) {

                $.each($scope.event.SmgTags, function (i) {

                    if ($scope.event.SmgTags[i] === tag.toLowerCase()) {

                        alert('Already present!');
                        addToArray = false;

                        return false;
                    }
                });
            }
            else {
                $scope.event.SmgTags = [];
            }


            if (addToArray) {

                $scope.event.SmgTags.push(tag.toLowerCase());

                //alert("added");
            }
        }
        else {
            alert('Invalid Tag!');
        }
    }

    //Remove SMG Tagging
    $scope.deletetag = function (tag) {

        $.each($scope.event.SmgTags, function (i) {
            if ($scope.event.SmgTags[i] === tag) {
                $scope.event.SmgTags.splice(i, 1);
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
    $scope.slides = $scope.event.ImageGallery;
}

var wysiwygeditorCtrl = function ($scope) {
    $scope.htmlcontentbase = "<div></div>";  
    $scope.disabled = false;
};

app.filter('moment', function () {
    return function (dateString, format) {
        return moment(dateString).format(format);
    };
});

app.filter('eventtime', function () {
    return function (timeString, length) {
        return timeString.substring(0, length);
    };
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

function objectFindByKey(array, key, value) {
    for (var i = 0; i < array.length; i++) {
        if (array[i][key] === value) {
            return array[i];
        }
    }
    return null;
}

var eventtypeaheadcontroller = app.controller('EventTypeAheadController', function ($scope, $http) {

    $scope.eventnametypeaheadselected = false;

    $scope.getEventnamesFilteredList = function (lang, locationfilter, rancfilter, typefilter, topicfilter, orgridfilter, smgtagfilter, active, smgactive, datumvon, datumbis, source) {
      
        if (locationfilter != "null" || rancfilter != "null" || typefilter != "null" || topicfilter != "null" || orgridfilter != "null" || smgtagfilter != "null" || active != "null" || smgactive != "null" || datumvon != "null" || datumbis != "null" || source != "null") {

            $http({
                method: 'Get',
                url: $scope.basePath + '/v1/EventReduced?language=' + lang + '&locfilter=' + locationfilter + '&rancfilter=' + rancfilter + '&typefilter=' + typefilter + '&topicfilter=' + topicfilter + '&orgfilter=' + orgridfilter + '&active=' + active + '&odhactive=' + smgactive + '&odhtagfilter=' + smgtagfilter + '&begindate=' + datumvon + '&enddate=' + datumbis + '&source=' + source
            }).success(function (data) {
                $scope.items = data;
            });
        }
        else {
            $http({
                method: 'Get',
                url: $scope.basePath + '/json/EventInfo' + $scope.lang + '.json'
            }).success(function (data) {
                $scope.items = data;
            });
        }
    }

    $scope.$on('LoadEventNamesList', function (e) {

        $scope.getEventnamesFilteredList($scope.lang, $scope.locationfilter, $scope.rancfilter, $scope.typefilter, $scope.topicfilter, $scope.orgridfilter, $scope.smgtagfilter, $scope.active, $scope.smgactive, $scope.datumvonfilter, $scope.datumbisfilter, $scope.source);
    });

    $scope.getEventnamesFilteredList($scope.lang, $scope.locationfilter, $scope.rancfilter, $scope.typefilter, $scope.topicfilter, $scope.orgridfilter, $scope.smgtagfilter, $scope.active, $scope.smgactive, $scope.datumvonfilter, $scope.datumbisfilter, $scope.source);

    $scope.onItemSelected = function () {
        $scope.eventnametypeaheadselected = true;
    }
});

//Directive Typeahead
app.directive('typeaheadevent', function ($timeout) {
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
            url: $scope.basePath + '/v1/ODHTagReduced?localizationlanguage=' + lang + '&validforentity=Event'
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
            url: $scope.basePath + '/v1/ODHTagReduced?localizationlanguage=' + lang + '&validforentity=Event'
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