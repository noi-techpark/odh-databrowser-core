// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

var app = angular.module('webcam', ['ui.bootstrap', 'angularFileUpload', 'ngSanitize', 'appconfig', 'textAngular', 'appfactory', 'leaflet-directive', 'pathconfig']);

app.controller('webcamListController', [
    '$scope', '$http', '$modal', 'appconfig', 'leafletData', 'leafletmapsimple', 'languageFactory', 'apipath',
    function ($scope, $http, $modal, appconfig, leafletData, leafletmapsimple, languageFactory, apipath) {

        $scope.basePath = apipath;
        $scope.lang = languageFactory.getLanguage();

        $scope.init = function () {
            $scope.changePage(0);
        };

        $scope.editwebcam = function (webcam) {

            if (webcam === 'new') {

                $scope.newwebcam = true;
                $scope.webcam = {
                    Id: '', Shortname: '', Source: 'Content', _Meta: { Id: '', Type: 'webcam', Source: 'noi' } };

                var modalInstance = $modal.open({
                    templateUrl: 'myWebcamModal.html',
                    controller: WebcamModalInstanceCtrl,
                    scope: $scope,
                    //size: 'lg',
                    windowClass: 'modal-wide',
                    backdrop: 'static'
                });
            }
            else {
                $scope.newwebcam = false;

                $scope.webcam = webcam;

                var modalInstance = $modal.open({
                    templateUrl: 'myWebcamModal.html',
                    controller: WebcamModalInstanceCtrl,
                    scope: $scope,
                    //size: 'lg',
                    windowClass: 'modal-wide',
                    backdrop: 'static'
                });
            }
            
        };

        $scope.deletewebcam = function (id) {

            var deleteconfirm = confirm('Are you absolutely sure you want to delete?');

            if (deleteconfirm) {
                $http.delete($scope.basePath + '/v1/WebcamInfo/' + id).then(function (result) {
                    alert("Webcam deleted!");

                    $scope.applyFilter($scope.page);
                }, function (error) {
                    alert("Error " + error.status);
                });
            }
        };

        $scope.updatewebcam = function (id) {

            $scope.isloading = true;
            $http.get($scope.basePath + '/v1/WebcamInfo/' + id).success(function (result) {

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

        $scope.SelectedWebcamName = '';
        $scope.SelectedWebcamId = '';        

        $scope.webcamidfilter = 'null';        
        $scope.active = 'null';
        $scope.smgactive = 'null';
        $scope.source = 'null';
        $scope.publishchannelfilter = '';

        //Filter anwenden
        $scope.applyFilter = function (page, withoutrefresh) {

            $scope.isloading = true;
            $scope.page = page;            
           
            if ($scope.SelectedWebcamId != '')
                $scope.webcamidfilter = $scope.SelectedWebcamId;

            var searchfilter = '';
            if ($scope.SelectedWebcamName != '') {
                searchfilter = '&searchfilter=' + $scope.SelectedWebcamName;
            }
            else
                searchfilter = '';

            if ($scope.SelectedWebcamId != '') {
                $scope.webcamidfilter = $scope.SelectedWebcamId;
            }
            else {
                $scope.webcamidfilter = 'null';
            }

            $http.get($scope.basePath + '/v1/WebcamInfo?pagenumber=' + $scope.page + '&pagesize=20&source=' + $scope.source + '&idlist=' + $scope.webcamidfilter + '&active=' + $scope.active + '&odhactive=' + $scope.smgactive + '&publishedon=' + $scope.publishchannelfilter + '&seed=' + $scope.Seed + searchfilter).success(function (result) {
                $scope.webcams = result.Items;
                $scope.totalpages = result.TotalPages;
                $scope.totalcount = result.TotalResults;
                $scope.Seed = result.Seed;
                $scope.isloading = false;
                $scope.filtered = true;
            });

            //if (withoutrefresh != true)
            //    $scope.$broadcast('LoadWebcamNamesList');
        }

        //Filter Löschen
        $scope.clearFilter = function () {
            $scope.SelectedWebcamName = '';
            $scope.SelectedWebcamId = '';

            $scope.webcamidfilter = 'null';
        
            $scope.active = 'null';
            $scope.smgactive = 'null';
            $scope.source = 'null';
            $scope.publishchannelfilter = '';

          
            $scope.page = 1;
            $scope.filtered = false;
            $scope.changePage(0);
            
            //$scope.$broadcast('LoadWebcamNamesList');
        }

        //Clear single Filters
        $scope.clearNameFilter = function () {
            $scope.SelectedWebcamName = '';
            $scope.page = 1;
            $scope.applyFilter(0);

            //$scope.$broadcast('LoadWebcamNamesList');
        }

        $scope.clearIdFilter = function () {
            $scope.SelectedWebcamId = '';
            $scope.webcamidfilter = 'null';

            $scope.page = 1;
            $scope.changePage(0);

            //$scope.$broadcast('LoadEventNamesList');
        }
   
        $scope.clearActiveFilter = function () {

            $scope.smgactive = 'null';

            $scope.page = 1;
            $scope.changePage(0);

            //$scope.$broadcast('LoadWebcamNamesList');
        }

        $scope.clearTICActiveFilter = function () {

            $scope.active = 'null';

            $scope.page = 1;
            $scope.changePage(0);

            //$scope.$broadcast('LoadWebcamNamesList');
        }

        $scope.clearSourceFilter = function () {

            $scope.source = 'null';

            $scope.page = 1;
            $scope.changePage(0);

            //$scope.$broadcast('LoadWebcamNamesList');
        }

        $scope.clearPublishedOnFilter = function () {

            $scope.publishchannelfilter = '';

            $scope.page = 1;
            $scope.changePage(0);

            //$scope.$broadcast('LoadWebcamNamesList');
        }

        //Seite Wechseln
        $scope.changePage = function (pageskip) {

            $scope.page = $scope.page + pageskip;
            $scope.isloading = true;

            $scope.applyFilter($scope.page, true);           
        }        

        //Modal anzeigen
        $scope.showInfoModal = function (webcam) {            

            //Test nochmaliger Request auf Detail
            $http.get($scope.basePath + '/v1/WebcamInfo/' + webcam.Id).success(function (result) {
                $scope.webcam = result;
                $scope.isloading = false;

                leafletmapsimple.preparemap($scope.webcam.GpsInfo, null, ['Standpunkt', 'position', 'carparking', 'startingpoint', 'arrivalpoint', 'viewpoint', 'Talstation', 'Bergstation', 'startingandarrivalpoint'], 'webcamListController');
                
                var slidemodalInstance = $modal.open({
                    templateUrl: 'myWebcamInfoModal.html',
                    controller: InfoModalInstanceCtrl,
                    scope: $scope,
                    size: 'lg'
                });
            });            
        };

        $scope.webcams = [];
    }]);

var wysiwygeditorCtrl = function ($scope) {
    $scope.htmlcontentbase = "<div></div>";
    $scope.htmlcontentintro = "<div></div>";
    $scope.disabled = false;
};

//Modal Controller
var WebcamModalInstanceCtrl = function ($scope, $modalInstance, $http) {

    $scope.mappingproperty = {};
    $scope.smgtag = {};

    $scope.ok = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.addwebcam = function (webcam, isvalid) {

        if (isvalid) {

            $http.post($scope.basePath + '/v1/WebcamInfo', webcam).then(function (result) {
                alert("Webcam added!");
                $scope.webcams.push(webcam);

                $modalInstance.close();
            }, function (error) {
                alert("Error " + error.status);
            });
        }
        else {
            alert("Invalid Data!");
        }
    };

    $scope.updatewebcam = function (webcam, isvalid) {

        if (isvalid) {
            $http.put($scope.basePath + '/v1/WebcamInfo/' + webcam.Id, webcam).then(function (result) {
                alert("Webcam updated!");
                $modalInstance.close();
            }, function (error) {
                alert("Error " + error.status);
            });
        }
        else {
            alert("Invalid Data!");
        }
    };

    //Add SMG Tagging
    $scope.addtag = function () {

        if ($scope.smgtag.smgtagid != "" && $scope.smgtag.smgtagid != undefined) {

            var addToArray = true;


            if ($scope.webcam.SmgTags != null) {

                $.each($scope.webcam.SmgTags, function (i) {

                    if ($scope.webcam.SmgTags[i] === $scope.smgtag.smgtagid) {

                        alert('Already present!');
                        addToArray = false;

                        return false;
                    }
                });
            }
            else {
                $scope.webcam.SmgTags = [];
            }


            if (addToArray) {

                $scope.webcam.SmgTags.push($scope.smgtag.smgtagid);
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

        $.each($scope.webcam.SmgTags, function (i) {
            if ($scope.webcam.SmgTags[i] === tag) {
                $scope.webcam.SmgTags.splice(i, 1);
                return false;
            }
        });
    }

    //Add Mapping Manually
    $scope.addmapping = function () {

        if ($scope.mappingproperty.Name != '' && $scope.mappingproperty.Value != '' && $scope.mappingproperty.Mappingkey != '') {
            var addToArray = true;

            var provider = $scope.mappingproperty.Mappingkey;

            if ($scope.webcam.Mapping == null || $scope.webcam.Mapping == undefined) {
                $scope.webcam.Mapping = {};
            }

            if ($scope.webcam.Mapping[provider] == null || $scope.webcam.Mapping[provider] == undefined) {

                $scope.webcam.Mapping[provider] = {};
            }

            if ($scope.webcam.Mapping[provider] != null) {

                //If value is present it will be overwritten....
                Object.keys($scope.webcam.Mapping[provider]).forEach(function (key) {

                    console.log(key, $scope.webcam.Mapping[provider][key]);
                });

                //$.each($scope.webcam.Mapping[provider], function (i) {

                //    if ($scope.webcam.Mapping[provider][i] === $scope.mappingproperty.Name) {

                //        alert('Already present!');
                //        addToArray = false;

                //        return false;
                //    }
                //});
            }


            if (addToArray) {
                //var property = { Name: $scope.mappingproperty.Name, Value: $scope.mappingproperty.Value };

                //$scope.webcam.Mapping[provider].push(property);

                var dicttoadd = {};

                if ($scope.webcam.Mapping[provider] != null && $scope.webcam.Mapping[provider] != undefined)
                    dicttoadd = $scope.webcam.Mapping[provider];

                dicttoadd[$scope.mappingproperty.Name] = $scope.mappingproperty.Value;

                $scope.webcam.Mapping[provider] = dicttoadd;

                console.log($scope.webcam.Mapping);

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

                delete $scope.webcam.Mapping[provider];
            }
        }
        else {

            delete $scope.webcam.Mapping[provider][mapping];

            //$.each($scope.webcam.Mapping[provider], function (i) {
            //    if ($scope.webcam.Mapping[provider][i].Name === mapping) {
            //        $scope.webcam.Mapping[provider].splice(i, 1);
            //        return false;
            //    }
            //});
        }
    }
};

//Modal Slideshow Controller
var InfoModalInstanceCtrl = function ($scope, $modalInstance, $http) {
    $scope.ok = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.cancelmodal = function () {
        $modalInstance.dismiss('cancel');
    };
}

var smgtagmodaltypeaheadcontroller = app.controller('SmgTagNameModalTypeAheadController', function ($scope, $http) {

    $scope.smgtagselected = false;

    $scope.getSmgTagNameListModal = function (lang) {

        $http({
            method: 'Get',
            url: $scope.basePath + '/v1/SmgTag/Reduced/' + lang + '/Common' //+ $scope.commontype
        }).success(function (data) {
            $scope.items = data;
        });
    }

    $scope.getSmgTagNameListModal($scope.lang);

    $scope.onItemSelected = function () {
        $scope.smgtagselected = true;
    }
});

//TODO REWRITE!!!

//var webcamtypeaheadcontroller = app.controller('WebcamTypeAheadController', function ($scope, $http) {

//    $scope.webcamtypeaheadselected = false;

//    $scope.getWebcamFilteredList = function (lang, active, smgactive, source) {



//            $http({
//                method: 'Get',
//                url: $scope.basePath + '/v1/WebcamInfoReduced?language=' + lang + '&active=' + active + '&odhactive=' + smgactive + '&source=' + source
//                //url: '/json/' + $scope.activitytype + 'Info.json'
//            }).success(function (data) {
//                $scope.items = data;
//            });       
//    }

//    $scope.$on('LoadWebcamNamesList', function (e) {
        
//        $scope.getWebcamFilteredList($scope.lang, $scope.active, $scope.smgactive, $scope.source);
//    });   

//    $scope.getWebcamFilteredList($scope.lang, $scope.active, $scope.smgactive, $scope.source);

//    $scope.onItemSelected = function () {
//        $scope.webcamtypeaheadselected = true;
//    }
//});

//Directive Typeahead
app.directive('typeaheadwebcam', function ($timeout) {
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
            scope.handleSelection = function (selectedItem, selectedId) {
                //alert(selectedItem + selectedTyp + selectedId);

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

app.filter('moment', function () {
    return function (dateString, format) {
        return moment(dateString).format(format);
    };
});

//Fileupload Test
app.controller('FileUploadController', ['$scope', 'FileUploader', function ($scope, FileUploader) {
    var uploader = $scope.uploader = new FileUploader({
        url: $scope.basePath + '/v1/FileUpload/webcam'
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

        if ($scope.webcam.ImageGallery == null) {
            $scope.webcam.ImageGallery = [];
        }

        console.log($scope.webcam.ImageGallery.length);

        var currentimagescount = $scope.webcam.ImageGallery.length;

        var r = new RegExp('"', 'g');
        var imageurl = response.replace(r, '');

        alert('added Image: ' + imageurl);

        var UploadedImage = { ImageName: '', ImageUrl: imageurl, Width: 0, Height: 0, ImageSource: 'SMGManager', ImageTitle: { de: '', it: '', en: '', nl: '', cs: '', pl: '' }, ListPosition: currentimagescount++ }

        $scope.webcam.ImageGallery.push(UploadedImage);


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

    console.info('uploader', uploader);
}]);

//Fileupload Logo
app.controller('LogoFileUploadController', ['$scope', 'FileUploader', function ($scope, FileUploader) {
    var uploader = $scope.uploader = new FileUploader({
        url: $scope.basePath + '/v1/FileUpload/webcam/Logo'
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
        alert("file selected");
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

        alert('added Logo Image: ' + imageurl);

        var lang = $scope.lang;

        $scope.webcam.ContactInfos[lang].LogoUrl = imageurl;

        //alert($scope.webcam.ContactInfos[lang].LogoUrl);

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

    console.info('uploader', uploader);
}]);

//Fileupload Test
app.controller('FileUploadControllerSingle', ['$scope', 'FileUploader', function ($scope, FileUploader) {

    $scope.oldimageurl = "";

    $scope.init = function (oldimageurl) {
        $scope.oldimageurl = oldimageurl;
    }

    var uploader = $scope.uploader = new FileUploader({
        url: $scope.basePath + '/v1/FileUpload/webcam'
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

        var currentimagescount = $scope.webcam.ImageGallery.length;

        var r = new RegExp('"', 'g');
        var imageurl = response.replace(r, '');
        //Filename
        var imagename = imageurl.substring(imageurl.lastIndexOf('/') + 1);


        alert('changed Image: ' + imageurl);

        var UploadedImage = { ImageName: '', ImageUrl: imageurl, Width: 0, Height: 0, ImageSource: 'SMGManager', ImageTitle: { de: '', it: '', en: '', nl: '', cs: '', pl: '' }, ListPosition: currentimagescount++ }

        //$scope.webcam.ImageGallery.push(UploadedImage);

        $.each($scope.webcam.ImageGallery, function (i) {
            if ($scope.webcam.ImageGallery[i].ImageUrl === $scope.oldimageurl) {

                $scope.webcam.ImageGallery[i].ImageUrl = imageurl;
                $scope.webcam.ImageGallery[i].ImageName = imagename;

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