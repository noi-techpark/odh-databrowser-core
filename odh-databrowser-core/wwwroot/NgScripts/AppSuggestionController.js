// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

var app = angular.module('appsuggestion', ['ui.bootstrap', 'appconfig','pathconfig']);

app.controller('appsuggestionListController', [
    '$scope', '$http', '$modal', 'appconfig', 'apipath',
    function ($scope, $http, $modal, config, apipath) {

        $scope.basePath = apipath;

        $scope.lang = 'de';       
        $scope.appsuggestions = [];

        //$scope.checkEntityModel = {
        //    Gastronomy: false,
        //    Activity: false,
        //    Poi: false,
        //    Accommodation: false,
        //    Event: false,
        //    Article: false           
        //};

        $scope.editappsuggestion = function (appsuggestion) {

            if (appsuggestion === 'new') {

                $scope.newappsuggestion = true;
                $scope.appsuggestion = { Id: '' };
            }
            else {
                $scope.newappsuggestion = false;
                $scope.appsuggestion = appsuggestion;
            }

            var modalInstance = $modal.open({
                templateUrl: 'myAppSuggestionModal.html',
                controller: AppSuggestionModalInstanceCtrl,
                scope: $scope,
                size: 'md',
                backdrop: 'static'
            });
        };

        $scope.deleteappsuggestion = function (id) {

            var deleteconfirm = confirm('Are you absolutely sure you want to delete?');

            if (deleteconfirm) {

                $http.delete($scope.basePath + '/v1/AppSuggestion/' + id).success(function (result) {
                    alert("appsuggestion deleted!");

                    $.each($scope.appsuggestions, function (i) {
                        if ($scope.appsuggestions[i].Id === id) {
                            $scope.appsuggestions.splice(i, 1);
                            return false;
                        }
                    });
                }).error(function (data) {
                    alert("ERROR:" + data);
                });
            }
        };
              
        //Initial Get
        $scope.loadData = function () {

            $scope.isloading = true;

            $http.get($scope.basePath + '/v1/AppSuggestion').success(function (result) {
               
                $scope.appsuggestions = result;
                $scope.isloading = false;
            });
        };

        //Modal anzeigen
        $scope.showInfoModal = function (appsuggestion) {

            $scope.appsuggestion = appsuggestion;

            var slidemodalInstance = $modal.open({
                templateUrl: 'myAppSuggestionInfoModal.html',
                controller: InfoModalInstanceCtrl,
                scope: $scope,
                size: 'lg'
            });
        };
        
        $scope.loadData();
    }]);

//Modal Controller
var AppSuggestionModalInstanceCtrl = function ($scope, $modalInstance, $http) {

    $scope.ok = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.addappsuggestion = function (appsuggestion, isvalid) {

        //console.log($scope.smgtagform.$error.required);

        if (isvalid) {

            $http.post($scope.basePath + '/v1/AppSuggestion', appsuggestion).success(function (result) {
                alert("appsuggestion added!");
                $scope.appsuggestions.push(appsuggestion);

                $modalInstance.close();
            });
        }
        //else {
        //    alert("Invalid Data!");
        //}
    };

    $scope.updateappsuggestion = function (appsuggestion, isvalid) {

        if (isvalid) {
            $http.put($scope.basePath + '/v1/AppSuggestion/' + appsuggestion.Id, appsuggestion).success(function (result) {
                alert("appsuggestion updated!");
                $modalInstance.close();
            });
        }
        //else {
        //    alert("Invalid Data!");
        //}
    };    

    $scope.addsmgpoientity = function (entityname, entitytype) {

       

        if (entityname != undefined && entityname != '') {
            if ($scope.appsuggestion.Validfor == null) {
                $scope.appsuggestion.Validfor = [];
            }

            var addtoentitylist = true;
            var entitytoadd = { MainEntity: entitytype, Type: 'Tag', Value: entityname }

            console.log(entitytoadd);

            $.each($scope.appsuggestion.Validfor, function (i) {
                if ($scope.appsuggestion.Validfor[i].Value === entityname && $scope.appsuggestion.Validfor[i].MainEntity === 'IDM Activity Poi') {
                    addtoentitylist = false;
                    alert('Entity already assigned');
                }
            });

            if (addtoentitylist)
            {
                $scope.appsuggestion.Validfor.push(entitytoadd);

                console.log($scope.appsuggestion.Validfor);

                $scope.appsuggestion.smgtagname = '';
                $scope.appsuggestion.smgtagnameevent = '';
            }
                
        }


    };

  

    $scope.addaccoentity = function (entityname, id, type) {



        if (entityname != undefined && entityname != '') {
            if ($scope.appsuggestion.Validfor == null) {
                $scope.appsuggestion.Validfor = [];
            }

            var addtoentitylist = true;
            var entitytoadd = { MainEntity: 'Accommodation', Type: type, Value: id }

            console.log(entitytoadd);

            $.each($scope.appsuggestion.Validfor, function (i) {
                if ($scope.appsuggestion.Validfor[i].Value === id) {
                    addtoentitylist = false;
                    alert('Entity already assigned');
                }
            });

            if (addtoentitylist) {
                $scope.appsuggestion.Validfor.push(entitytoadd);

                console.log($scope.appsuggestion.Validfor);

                if (type === "Type")
                    $scope.appsuggestion.accotypename = '';
                if (type === "Theme")
                    $scope.appsuggestion.accothemename = '';
                if (type === "Badge")
                    $scope.appsuggestion.accobadgename = '';

            }

        }


    };

   
      $scope.removeentity = function (entityname) {

        //alert(entityname);

        $.each($scope.appsuggestion.Validfor, function (i) {
            if ($scope.appsuggestion.Validfor[i] === entityname) {
                $scope.appsuggestion.Validfor.splice(i, 1);
                return false;
            }
        });
    };

};

var smgtagmodaltypeaheadcontroller = app.controller('SmgTagNameModalTypeAheadController', function ($scope, $http) {

    $scope.smgtagselected = false;

    $scope.getSmgTagNameListModal = function (lang) {

        $http({
            method: 'Get',
            url: $scope.basePath + '/v1/SmgTag/Reduced/' + lang + '/SmgPoi,Sommer,Winter,Kultur Sehenswürdigkeiten,Anderes,Wellness Entspannung,Essen Trinken'
        }).success(function (data) {



            $scope.items = data;
        });

        $http({
            method: 'Get',
            url: $scope.basePath + '/v1/SmgTag/Reduced/' + lang + '/Event'
        }).success(function (data) {

            data.unshift({ Id: 'Event', Name: 'Event' });

            $scope.eventitems = data;
        });
    }

    $scope.getSmgTagNameListModal($scope.lang);

    $scope.onItemSelected = function () {
        $scope.smgtagselected = true;
    }
});

var accomodaltypeaheadcontroller = app.controller('AccoModalTypeAheadController', function ($scope, $http) {

    $scope.accotypeselected = false;
    $scope.accothemeselected = false;
    $scope.accobadgeselected = false;

    $scope.getAccoTypeListModal = function (lang) {

        $http({
            method: 'Get',
            url: $scope.basePath + '/v1/Accommodation/GetAccommodationTypeList'
        }).success(function (data) {

            $scope.accotypeitems = [];
            $scope.accothemeitems = [];
            $scope.accobadgeitems = [];

            $.each(data, function (i) {
               
                if (data[i].Type === "Type") {
                    $scope.accotypeitems.push({ Id: data[i].Id, Name: data[i].TypeDesc['de'], Type: 'Type' });
                }
                if (data[i].Type === "Theme") {
                    $scope.accothemeitems.push({ Id: data[i].Id, Name: data[i].TypeDesc['de'], Type: 'Theme' });
                }
                if (data[i].Type === "Badge") {
                    $scope.accobadgeitems.push({ Id: data[i].Id, Name: data[i].TypeDesc['de'], Type: 'Badge' });
                }
            });
            
            console.log($scope.accotypeitems);

        });   

    }

    $scope.getAccoTypeListModal($scope.lang);

    $scope.onItemSelected = function (accotype) {

        if (accotype) {
            $scope.accotypeselected = true;
        }
        if (accotype) {
            $scope.accothemeselected = true;
        }
        if (accotype) {
            $scope.accobadgeselected = true;
        }

        
    }
});


//Modal Slideshow Controller
var InfoModalInstanceCtrl = function ($scope, $modalInstance, $http) {

    $scope.cancelInfoModal = function () {
        $modalInstance.dismiss('cancel');
    };   
}

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

app.directive('typeaheadacco', function ($timeout) {
    return {
        restrict: 'AEC',
        scope: {
            items: '=',
            prompt: '@',
            title: '@',
            name: '@',
            model: '=',
            idmodel: '=',
            typemodel: '=',
            onSelect: '&'
        },
        link: function (scope, elem, attrs) {
            scope.handleSelection = function (selectedItem, selectedId, selectedType) {
                scope.model = selectedItem;
                scope.idmodel = selectedId;
                scope.typemodel = selectedType;
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