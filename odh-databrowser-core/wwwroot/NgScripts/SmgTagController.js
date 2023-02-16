var app = angular.module('smgtagging', ['ui.bootstrap', 'appconfig', 'pathconfig']);

app.controller('smgtagListController', [
    '$scope', '$http', '$modal', 'appconfig', 'apipath',
    function ($scope, $http, $modal, appconfig, apipath) {

        $scope.basePath = apipath;

        $scope.lang = 'de';       
        $scope.smgtags = [];
       

        $scope.editsmgtag = function (smgtag) {

            if (smgtag === 'new') {

                $scope.newsmgtag = true;
                $scope.smgtag = { Id: '', Shortname: '', _Meta: { Id: '', Type: 'odhtag', Source: 'noi' } };
            }
            else {
                $scope.newsmgtag = false;
                $scope.smgtag = smgtag;
            }

            var modalInstance = $modal.open({
                templateUrl: 'mySmgTagModal.html',
                controller: SmgTagModalInstanceCtrl,
                scope: $scope,
                windowClass: 'modal-wide',
                backdrop: 'static'
            });
        };

        $scope.deletesmgtag = function (id) {

            var deleteconfirm = confirm('Are you absolutely sure you want to delete?');

            if (deleteconfirm) {

                $http.delete($scope.basePath + '/v1/SmgTag/' + id).success(function (result) {
                    alert("SmgTag deleted!");

                    $.each($scope.smgtags, function (i) {
                        if ($scope.smgtags[i].Id === id) {
                            $scope.smgtags.splice(i, 1);
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

            $http.get($scope.basePath + '/v1/ODHTag').success(function (result) {
               
                $scope.smgtags = result;
                $scope.isloading = false;
            });
        };

        //Modal anzeigen
        $scope.showInfoModal = function (smgtag) {

            $scope.smgtag = smgtag;

            var slidemodalInstance = $modal.open({
                templateUrl: 'SmgTagInfoModal.html',
                controller: InfoModalInstanceCtrl,
                scope: $scope,
                size: 'lg'
            });
        };
        
        $scope.loadData();
    }]);

//Modal Controller
var SmgTagModalInstanceCtrl = function ($scope, $modalInstance, $http) {

    $scope.smgtagmapped = '';
    $scope.publishedchannel = {};
    $scope.publishedchannel.name = 'idm-marketplace';


    $scope.ok = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.addsmgtag = function (smgtag, isvalid) {

        if (isvalid) {

            $http.post($scope.basePath + '/v1/SmgTag', smgtag).success(function (result) {
                alert("SmgTag added!");
                $scope.smgtags.push(smgtag);

                $modalInstance.close();
            });
        }
        //else {
        //    alert("Invalid Data!");
        //}
    };

    $scope.updatesmgtag = function (smgtag, isvalid) {

        if (isvalid) {
            $http.put($scope.basePath + '/v1/SmgTag/' + smgtag.Id, smgtag).success(function (result) {
                alert("SmgTag updated!");
                $modalInstance.close();
            });
        }
        //else {
        //    alert("Invalid Data!");
        //}
    };    

    $scope.addentity = function (entityname) {

       

        if (entityname != undefined && entityname != '') {
            if ($scope.smgtag.ValidForEntity == null) {
                $scope.smgtag.ValidForEntity = [];
            }

            var addtoentitylist = true;

            $.each($scope.smgtag.ValidForEntity, function (i) {
                if ($scope.smgtag.ValidForEntity[i] === entityname) {
                    addtoentitylist = false;
                    alert('Entity already assigned');
                }
            });

            if (addtoentitylist)
                $scope.smgtag.ValidForEntity.push(entityname);
        }
    };

    $scope.removeentity = function (entityname) {

        //alert(entityname);

        $.each($scope.smgtag.ValidForEntity, function (i) {
            if ($scope.smgtag.ValidForEntity[i] === entityname) {
                $scope.smgtag.ValidForEntity.splice(i, 1);
                return false;
            }
        });
    };

    $scope.addsource = function (sourcename) {

        if (sourcename != "LTSCategory" && sourcename != "ODHCategory") {

            if (sourcename != undefined && sourcename != '') {
                if ($scope.smgtag.Source == null) {
                    $scope.smgtag.Source = [];
                }

                var addtosourcelist = true;

                $.each($scope.smgtag.Source, function (i) {
                    if ($scope.smgtag.Source[i] === sourcename) {
                        addtosourcelist = false;
                        alert('Source already assigned');
                    }
                });

                if (addtosourcelist)
                    $scope.smgtag.Source.push(sourcename);
            }
        }
        else {
            alert("only IDMRedactionalCategory allowed");
        }
    };

    $scope.removesource = function (sourcename) {

        if (sourcename != "LTSCategory" && sourcename != "ODHCategory") {
            $.each($scope.smgtag.Source, function (i) {
                if ($scope.smgtag.Source[i] === sourcename) {
                    $scope.smgtag.Source.splice(i, 1);
                    return false;
                }
            });
        }
        else {
            alert("cannot delete automatic generated categories");
        }

    };

    //Add SMG Tagging
    $scope.addmappedtag = function () {

        if ($scope.smgtagmapped.smgtagid != "" && $scope.smgtagmapped.smgtagid != undefined) {

            var addToArray = true;

            //alert(tag);

            if ($scope.smgtag.MappedTagIds != null) {

                $.each($scope.smgtag.MappedTagIds, function (i) {

                    if ($scope.smgtag.MappedTagIds[i] === $scope.smgtagmapped.smgtagid) {

                        alert('Already present!');
                        addToArray = false;

                        return false;
                    }
                });
            }
            else {
                $scope.smgtag.MappedTagIds = [];
            }


            if (addToArray) {

                $scope.smgtag.MappedTagIds.push($scope.smgtagmapped.smgtagid);
                $scope.smgtagmapped.smgtagid = '';
                $scope.smgtagmapped.smgtagname = '';
            }
        }
        else {
            alert('Invalid Tag!');
        }
    }

    //Remove SMG Tagging
    $scope.deletemappedtag = function (tag) {

        $.each($scope.smgtag.MappedTagIds, function (i) {
            if ($scope.smgtag.MappedTagIds[i] === tag) {
                $scope.smgtag.MappedTagIds.splice(i, 1);
                return false;
            }
        });
    }

    //Add SMG Published Channel
    $scope.addpublishedchannel = function () {

        //console.log($scope.publishedchannel.name);

        if ($scope.publishedchannel.name != "" && $scope.publishedchannel.name != undefined) {

            var addToArray = true;


            if ($scope.smgtag.AutoPublishOn != null) {

                $.each($scope.smgtag.AutoPublishOn, function (i) {

                    if ($scope.smgtag.AutoPublishOn[i] === $scope.publishedchannel.name) {

                        alert('Already present!');
                        addToArray = false;

                        return false;
                    }
                });
            }
            else {
                $scope.smgtag.AutoPublishOn = [];
            }


            if (addToArray) {

                $scope.smgtag.AutoPublishOn.push($scope.publishedchannel.name);
                $scope.publishedchannel.name = '';
            }
        }
        else {
            alert('Invalid!');
        }
    }

    //Remove SMG Tagging
    $scope.deletepublishedchannel = function (channel) {

        $.each($scope.smgtag.AutoPublishOn, function (i) {
            if ($scope.smgtag.AutoPublishOn[i] === channel) {
                $scope.smgtag.AutoPublishOn.splice(i, 1);
                return false;
            }
        });
    }


    $scope.addpublishedonchannel = function (publishchannel) {

        if (publishchannel != "" && publishchannel != undefined) {

            var addToArray = true;

            if ($scope.poi.PublishedOn != null) {

                $.each($scope.poi.PublishedOn, function (i) {

                    if ($scope.poi.PublishedOn[i] === publishchannel) {

                        alert('Already present!');
                        addToArray = false;

                        return false;
                    }
                });
            }
            else {
                $scope.poi.PublishedOn = [];
            }


            if (addToArray) {

                $scope.poi.PublishedOn.push(publishchannel);
            }
        }
        else {
            alert('Invalid publishchannel!');
        }
    }

    //Remove SMG Tagging
    $scope.deletepublishedonchannel = function (publishchannel) {
        //alert(tag);
        $.each($scope.poi.PublishedOn, function (i) {
            if ($scope.poi.PublishedOn[i] === publishchannel) {
                $scope.poi.PublishedOn.splice(i, 1);
                return false;
            }
        });
    }

    //Add Mapping Manually
    $scope.addmapping = function () {

        if ($scope.mappingproperty.Name != '' && $scope.mappingproperty.Value != '' && $scope.mappingproperty.Mappingkey != '') {
            var addToArray = true;

            var provider = $scope.mappingproperty.Mappingkey;

            if ($scope.poi.Mapping == null || $scope.poi.Mapping == undefined) {
                $scope.poi.Mapping = {};
            }

            if ($scope.poi.Mapping[provider] == null || $scope.poi.Mapping[provider] == undefined) {

                $scope.poi.Mapping[provider] = {};
            }

            if ($scope.poi.Mapping[provider] != null) {

                //If value is present it will be overwritten....
                Object.keys($scope.poi.Mapping[provider]).forEach(function (key) {

                    console.log(key, $scope.poi.Mapping[provider][key]);
                });
            }


            if (addToArray) {
                //var property = { Name: $scope.mappingproperty.Name, Value: $scope.mappingproperty.Value };

                //$scope.poi.Mapping[provider].push(property);

                var dicttoadd = {};

                if ($scope.poi.Mapping[provider] != null && $scope.poi.Mapping[provider] != undefined)
                    dicttoadd = $scope.poi.Mapping[provider];

                dicttoadd[$scope.mappingproperty.Name] = $scope.mappingproperty.Value;

                $scope.poi.Mapping[provider] = dicttoadd;

                console.log($scope.poi.Mapping);

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

                delete $scope.poi.Mapping[provider];
            }
        }
        else {

            delete $scope.poi.Mapping[provider][mapping];

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
var InfoModalInstanceCtrl = function ($scope, $modalInstance, $http) {

    $scope.cancelslidemodal = function () {        
        $modalInstance.dismiss('cancel');
    };   
}

var smgtagmodaltypeaheadcontroller = app.controller('SmgTagNameModalTypeAheadController', function ($scope, $http) {

    $scope.smgtagselected = false;

    $scope.getSmgTagNameListModal = function (lang) {

        $http({
            method: 'Get',
            url: $scope.basePath + '/v1/ODHTag?language=' + lang + '&fields=Id,TagName.' + lang + '&rawfilter=in(Source.[*],"ODHCategory")'
        }).success(function (data) {
           
            $scope.items = [];

            $.each(data, function (i) {
                $scope.items.push({ Id: data[i]['Id'], Name: data[i]['TagName.' + lang] });
            });


        });
    }

    $scope.getSmgTagNameListModal($scope.lang);

    $scope.onItemSelected = function () {
        $scope.smgtagselected = true;
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