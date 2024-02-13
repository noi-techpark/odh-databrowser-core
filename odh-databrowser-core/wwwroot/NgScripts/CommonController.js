// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

var app = angular.module('common', ['ui.bootstrap', 'angularFileUpload', 'ngSanitize', 'appconfig', 'textAngular', 'appfactory', 'leaflet-directive', 'pathconfig']);

app.controller('commonListController', [
    '$scope', '$http', '$modal', 'appconfig', 'leafletData', 'leafletmapsimple', 'languageFactory', 'apipath',
    function ($scope, $http, $modal, config, leafletData, leafletmapsimple, languageFactory, apipath) {

        $scope.basePath = apipath;

        $scope.lang = languageFactory.getLanguage();;
        $scope.commontype = '';
        $scope.elementstotake = '';
        $scope.commons = [];
        var allowedlanguages = ['de', 'it', 'en', 'nl', 'cs', 'fr', 'pl', 'ru'];

        console.log(languageFactory.getLanguage());

        $scope.init = function (commontype, elementstotake) {
            //This function is sort of private constructor for controller            
            $scope.elementstotake = elementstotake;
            $scope.commontype = commontype;

            //fallback if language is not available here set it back to browserlanguage
            if (!allowedlanguages.includes($scope.lang)) {
                $scope.lang = 'en';
            }

            $scope.getCommons();
        };

        $scope.changeLanguage = function () {

            languageFactory.setLanguage($scope.lang);
            console.log(languageFactory.getLanguage());

            //$scope.getCommons();
        };

        $scope.editCommon = function (common) {

            if (common === 'new') {

                $scope.newcommon = true;
                $scope.common = {
                    Id: guid(), Shortname: '', Gpstype: 'center', AltitudeUnitofMeasure: 'm', _Meta: { Id: '', Type: $scope.commontype, Source: 'noi', Reduced: false }, Source: 'noi', LicenseInfo: { Author: "", License: "CC0", ClosedData: false, LicenseHolder: "https://www.noi.bz.it" }  };
            }
            else {
                $scope.newcommon = false;
                $scope.common = common;
            }

            var modalInstance = $modal.open({
                templateUrl: 'CommonCrudModal.html',
                controller: CrudModalInstanceCtrl,
                scope: $scope,
                //size: 'lg',
                windowClass: 'modal-wide',
                backdrop: 'static'
            });
        };

        $scope.deleteCommon = function (id, commontype) {

            var deleteconfirm = confirm('Are you absolutely sure you want to delete?');

            if (deleteconfirm) {
                $http.delete($scope.basePath + '/v1/' + commontype + '/' + id).then(function (result) {
                    alert(commontype + " deleted!");

                    $.each($scope.commons, function (i) {
                        if ($scope.commons[i].Id === id) {
                            $scope.commons.splice(i, 1);
                            return false;
                        }
                    });
                }, function (error) {
                    alert("Error " + error.status);
                });
            }           
        };               

        //Get Request
        $scope.getCommons = function () {
            $scope.isloading = true;

            //$http.get($scope.basePath + '/v1/Common/' + $scope.commontype + 'List/' + $scope.elementstotake).success(function (result) {
            $http.get($scope.basePath + '/v1/' + $scope.commontype).success(function (result) {

                $scope.commons = result;

                $scope.isloading = false;
            });
        }
               
        //Modal mit DetailInfo anzeigen
        $scope.showInfoModal = function (common) {

            $scope.common = common;

            var passedgps = [];
            passedgps.push({ Gpstype: 'position', Latitude: $scope.common.Latitude, Longitude: $scope.common.Longitude });

            leafletmapsimple.preparemap(passedgps, null, ['position'], 'commonListController');

            var InfoModalInstance = $modal.open({
                templateUrl: 'CommonInfoModal.html',
                controller: InfoModalInstanceCtrl,
                scope: $scope,
                //size: 'lg'
                windowClass: 'modal-wide'
            });
        };       
    }]);

var wysiwygeditorCtrl = function ($scope) {
    $scope.htmlcontentbase = "<div></div>";
    $scope.htmlcontentintro = "<div></div>";
    $scope.disabled = false;
};

//Modal Edit & New controller
var CrudModalInstanceCtrl = function ($scope, $modalInstance, $http) {

    $scope.regiontag = {};
    $scope.tourismvereintag = {};
    $scope.municipalitytag = {};
    $scope.districttag = {};
    $scope.detailthemed = {};
    $scope.gpspolygon = {};
    $scope.webcam = {};
    $scope.webcaminfo = {};
    $scope.smgtag = {};

    //Related Highlights
    $scope.relatedcontent = {};
    $scope.relatedcontentgastro = {};
    $scope.relatedcontentevent = {};
    $scope.relatedcontentwebcam = {};

    $scope.mappingproperty = {};

    $scope.ok = function () {
        //SAVEN
    };

    $scope.cancelCrudModal = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.addCrud = function (common, isvalid) {
        if (isvalid) {
           

            $http.post($scope.basePath + '/v1/' + $scope.commontype, common).then(function (result) {
                alert($scope.commontype + " added!");
                $scope.activities.push(activity);

                $modalInstance.close();
            }, function (error) {
                alert("Error " + error.status);
            });
        }
        else {
            alert("Invalid Data!");
        }
    };

    $scope.updateCrud = function (common, isvalid) {

        if (isvalid) {

            console.log(common.OperationSchedule);

            $http.put($scope.basePath + '/v1/' + $scope.commontype + '/' + common.Id, common).then(function (result) {
                alert($scope.commontype + " updated!");
                $modalInstance.close();
            }, function (error) {
                alert("Error " + error.status);
            });
        }
        else {
            alert("Invalid Data!");
        }
    };
     
    $scope.deleteImage = function (bildname, bildurl) {

        //console.log(bildname);
        //console.log(bildurl);

        //Querystring parameter holen
        var parameter = getQueryVariable(bildurl, "src");
        //Ersetz a poor kloanigkeiten
        var mybildurl = parameter.replace('.', '$');
       
        var find = '/';
        var re = new RegExp(find, 'g');
        var escapeduri = mybildurl.replace(re, '|');

        //var deletepath = encodeURI($scope.basePath + '/v1/FileDelete/' + escapeduri);
        //alert("Delete Image" + deletepath);

        //$http.delete(deletepath).success(function (result) {
        //    alert("File deleted!");

           
        //});

        $.each($scope.common.ImageGallery, function (i) {
            if ($scope.common.ImageGallery[i].ImageUrl === bildurl) {
                $scope.common.ImageGallery.splice(i, 1);
                return false;
            }
        });
    };

    //Add SMG Tagging
    $scope.addtag = function () {

        if ($scope.smgtag.smgtagid != "" && $scope.smgtag.smgtagid != undefined) {

            var addToArray = true;

            //alert(tag);

            if ($scope.common.SmgTags != null) {

                $.each($scope.common.SmgTags, function (i) {

                    if ($scope.common.SmgTags[i] === $scope.smgtag.smgtagid.toLowerCase()) {

                        alert('Already present!');
                        addToArray = false;

                        return false;
                    }
                });
            }
            else {
                $scope.common.SmgTags = [];
            }


            if (addToArray) {

                $scope.common.SmgTags.push($scope.smgtag.smgtagid.toLowerCase());
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

        $.each($scope.common.SmgTags, function (i) {
            if ($scope.common.SmgTags[i] === tag) {
                $scope.common.SmgTags.splice(i, 1);
                return false;
            }
        });
    }

    //Add publishedon Channel
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

    //Remove Publishedon Channel
    $scope.deletepublishedonchannel = function (publishchannel) {
        //alert(tag);
        $.each($scope.accommodation.PublishedOn, function (i) {
            if ($scope.accommodation.PublishedOn[i] === publishchannel) {
                $scope.accommodation.PublishedOn.splice(i, 1);
                return false;
            }
        });
    }

    //Special für MetaRegions

    //Add TV Tagging
    $scope.addregion = function () {

        if ($scope.regiontag.regid != "" && $scope.regiontag.regid != undefined) {

            var addToArray = true;

            //alert(tag);

            if ($scope.common.RegionIds != null) {

                $.each($scope.common.RegionIds, function (i) {

                    if ($scope.common.RegionIds[i] === $scope.regiontag.regid) {

                        alert('Already present!');
                        addToArray = false;

                        return false;
                    }
                });
            }
            else {
                $scope.common.RegionIds = [];
            }


            if (addToArray) {

                $scope.common.RegionIds.push($scope.regiontag.regid);
                $scope.regiontag.regid = '';
                $scope.regiontag.regname = '';
            }
        }
        else {
            alert('Invalid Tag!');
        }
    }

    //Remove TV Tagging
    $scope.deletereg = function (tag) {

        $.each($scope.common.RegionIds, function (i) {
            if ($scope.common.RegionIds[i] === tag) {
                $scope.common.RegionIds.splice(i, 1);
                return false;
            }
        });
    }

    //Add TV Tagging
    $scope.addtv = function () {

        if ($scope.tourismvereintag.tvid != "" && $scope.tourismvereintag.tvid != undefined) {

            var addToArray = true;

            //alert(tag);

            if ($scope.common.TourismvereinIds != null) {

                $.each($scope.common.TourismvereinIds, function (i) {

                    if ($scope.common.TourismvereinIds[i] === $scope.tourismvereintag.tvid) {

                        alert('Already present!');
                        addToArray = false;

                        return false;
                    }
                });
            }
            else {
                $scope.common.TourismvereinIds = [];
            }


            if (addToArray) {

                $scope.common.TourismvereinIds.push($scope.tourismvereintag.tvid);
                $scope.tourismvereintag.tvid = '';
                $scope.tourismvereintag.tvname = '';
            }
        }
        else {
            alert('Invalid Tag!');
        }
    }

    //Remove TV Tagging
    $scope.deletetv = function (tag) {

        $.each($scope.common.TourismvereinIds, function (i) {
            if ($scope.common.TourismvereinIds[i] === tag) {
                $scope.common.TourismvereinIds.splice(i, 1);
                return false;
            }
        });
    }

    //Add Municipality Tagging
    $scope.addmunicipality = function () {

        if ($scope.municipalitytag.munid != "" && $scope.municipalitytag.munid != undefined) {

            var addToArray = true;

            //alert(tag);

            if ($scope.common.MunicipalityIds != null) {

                $.each($scope.common.MunicipalityIds, function (i) {

                    if ($scope.common.MunicipalityIds[i] === $scope.municipalitytag.munid) {

                        alert('Already present!');
                        addToArray = false;

                        return false;
                    }
                });
            }
            else {
                $scope.common.MunicipalityIds = [];
            }


            if (addToArray) {

                $scope.common.MunicipalityIds.push($scope.municipalitytag.munid);
                $scope.municipalitytag.fraid = '';
                $scope.municipalitytag.franame = '';
            }
        }
        else {
            alert('Invalid Municipality!');
        }
    }

    //Remove Municipality Tagging
    $scope.deletemunicipality = function (tag) {

        $.each($scope.common.MunicipalityIds, function (i) {
            if ($scope.common.MunicipalityIds[i] === tag) {
                $scope.common.MunicipalityIds.splice(i, 1);
                return false;
            }
        });
    }

    //Add District Tagging
    $scope.adddistrict = function () {

        if ($scope.districttag.fraid != "" && $scope.districttag.fraid != undefined) {

            var addToArray = true;

            //alert(tag);

            if ($scope.common.DistrictIds != null) {

                $.each($scope.common.DistrictIds, function (i) {

                    if ($scope.common.DistrictIds[i] === $scope.districttag.fraid) {

                        alert('Already present!');
                        addToArray = false;

                        return false;
                    }
                });
            }
            else {
                $scope.common.DistrictIds = [];
            }


            if (addToArray) {

                $scope.common.DistrictIds.push($scope.districttag.fraid);
                $scope.districttag.fraid = '';
                $scope.districttag.franame = '';
            }
        }
        else {
            alert('Invalid District!');
        }
    }

    //Remove District Tagging
    $scope.deletedistrict = function (tag) {

        $.each($scope.common.DistrictIds, function (i) {
            if ($scope.common.DistrictIds[i] === tag) {
                $scope.common.DistrictIds.splice(i, 1);
                return false;
            }
        });
    }

    //Special für DetailThemed

    //Add Detail Themed
    $scope.adddetailthemed = function (lang) {

        if ($scope.detailthemed.keyvalue != "" && $scope.detailthemed.keyvalue != undefined) {


            console.log(lang)

            var addToArray = true;

            if ($scope.common.DetailThemed != null) {
                if ($scope.common.DetailThemed[lang] != null) {

                    $.each($scope.common.DetailThemed[lang].DetailsThemed, function (i) {

                        if ($scope.common.DetailThemed[lang].DetailsThemed[i].Title === $scope.detailthemed.keyvalue) {

                            alert('Already present!');
                            addToArray = false;

                            return false;
                        }
                    });
                }
                else {

                    $scope.common.DetailThemed[lang] = { DetailsThemed: {}, Language: lang };
                }
            }
            else {

                $scope.common.DetailThemed = {};

                $scope.common.DetailThemed[lang] = { DetailsThemed: {}, Language: lang };
            }


            if (addToArray) {

                $scope.common.DetailThemed[lang].DetailsThemed[$scope.detailthemed.keyvalue] = { Title: '', Intro: '', MetaTitle: '', MetaDesc: '' };
                $scope.detailthemed.keyvalue = '';
            }
        }
        else {
            alert('Invalid Detail Themed!');
        }
    }

    //Remove District Tagging
    $scope.deletedetailthemed = function (detailthemed) {

        delete $scope.common.DetailThemed[$scope.lang].DetailsThemed[detailthemed];
    }

    //Add Detail Themed
    $scope.addwebcam = function (webcam) {
       
        if ($scope.common.Webcam == null) {
         
            $scope.common.Webcam = [];
        }

        var gpsinfo = { Gpstype: 'position', Latitude: webcam.Latitude, Longitude: webcam.Longitude, Altitude: webcam.Altitude, AltitudeUnitofMeasure: 'm' };
        var webcamname = { de: webcam.Webcamname, it: webcam.Webcamname, en: webcam.Webcamname, nl: webcam.Webcamname, cs: webcam.Webcamname, pl: webcam.Webcamname, fr: webcam.Webcamname, ru: webcam.Webcamname };

        var webcamtoadd = { WebcamId: guid(), Webcamname: webcamname, Webcamurl: webcam.Webcamurl, GpsInfo: gpsinfo, ListPosition: webcam.ListPosition };
       

        $scope.common.Webcam.push(webcamtoadd);

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

        $.each($scope.common.Webcam, function (i) {
            if ($scope.common.Webcam[i] === webcam) {
                $scope.common.Webcam.splice(i, 1);
                return false;
            }
        });
    }

    //Add Existing Webcam
    $scope.addexistingwebcam = function (webcam) {

        if (webcam.Id) {

            var proceed = true;
            var position = 1;

            if ($scope.common.Webcam == null) {

                $scope.common.Webcam = [];
            }
            else {
                $.each($scope.common.Webcam, function (i) {
                    position++;

                    console.log(webcam.Id);

                    if ($scope.common.Webcam[i].WebcamId.toLowerCase() == webcam.Id.toLowerCase()) {
                        proceed = false;
                        alert("Webcam already present");
                    }
                });
            }

            if (proceed) {
                $http({
                    method: 'Get',
                    url: $scope.basePath + '/v1/WebcamInfo/' + webcam.Id
                }).success(function (data) {
                    var selectedwebcam = data;

                    var webcamname = { de: selectedwebcam.Webcamname["de"], it: selectedwebcam.Webcamname["it"], en: selectedwebcam.Webcamname["en"] };

                    var webcamtoadd = { WebcamId: selectedwebcam.Id, Webcamname: webcamname, Webcamurl: selectedwebcam.Webcamurl, GpsInfo: selectedwebcam.GpsInfo, ListPosition: position, Source: 'WebcamInfo', Previewurl: selectedwebcam.Previewurl, Streamurl: selectedwebcam.Streamurl };

                    $scope.common.Webcam.push(webcamtoadd);

                    $scope.webcam.WebcamId = '';
                    $scope.webcam.Webcamname = '';
                    $scope.webcam.Webcamurl = '';
                    $scope.webcam.Latitude = '';
                    $scope.webcam.Longitude = '';
                    $scope.webcam.Altitude = '';
                    $scope.webcam.ListPosition = '';
                    $scope.webcam.Source = '';
                    $scope.webcam.Previewurl = '';
                    $scope.webcam.Streamurl = '';

                    $scope.webcaminfo.Name = '';
                    $scope.webcaminfo.Id = '';
                });
            }
        }

        //var gpsinfo = { Gpstype: 'position', Latitude: webcam.Latitude, Longitude: webcam.Longitude, Altitude: webcam.Altitude, AltitudeUnitofMeasure: 'm' };

    }


    //Season add
    $scope.addseason = function (season) {
        //var myteilnehmer = teilnehmer;
        if ($scope.common.OperationSchedule == null || $scope.common.OperationSchedule == undefined) {

            $scope.common.OperationSchedule = [];
        }

        //fix set time for season to avoid Zero based time shift otherwise for 2021-12-04 00:00 in the .Net Web Api the date is converted to
        //2021-12-03 23:00 because of GMT +0100
        season.Start = season.Start.toDateString();
        season.Stop = season.Stop.toDateString();

        $scope.common.OperationSchedule.push(season);

        $scope.season = { OperationscheduleName: operationschedulename, Start: '', Stop: '', Type: '1', ClosedonPublicHolidays: '', OperationScheduleTime: [] };
    };

    $scope.deleteseason = function (season, lang) {

        var deleteconfirm = confirm('Are you absolutely sure you want to delete?');

        if (deleteconfirm) {

            $.each($scope.common.OperationSchedule, function (i) {
                if ($scope.common.OperationSchedule[i].OperationscheduleName[lang] === season.OperationscheduleName[lang]) {
                    $scope.common.OperationSchedule.splice(i, 1);
                    return false;
                }
            });
        }

    }

    $scope.addseasontime = function (operationschedule, operationscheduletime, lang) {

        $.each($scope.common.OperationSchedule, function (i) {

            if ($scope.common.OperationSchedule[i].OperationscheduleName[lang] === operationschedule.OperationscheduleName[lang]) {

                //alert($scope.common.OperationSchedule[i].OperationscheduleName[lang] + ' Adding Time!');

                console.log($scope.common.OperationSchedule[i].OperationScheduleTime);

                if ($scope.common.OperationSchedule[i].OperationScheduleTime == null || $scope.common.OperationSchedule[i].OperationScheduleTime == undefined) {

                    //alert("nuies time objekt");
                    $scope.common.OperationSchedule[i].OperationScheduleTime = [];
                }

                //alert(operationscheduletime.Start + " " + operationscheduletime.End);

                $scope.common.OperationSchedule[i].OperationScheduleTime.push(operationscheduletime);
            }
        });

        $scope.operationscheduletime = { Start: '', End: '', Monday: true, Tuesday: true, Wednesday: true, Thuresday: true, Friday: true, Saturday: true, Sunday: true, State: 2, Timecode: 1 }
    };

    var operationschedulename = { de: "Öffnungszeiten", it: "orari d'apertura", en: "opening times", nl: "opening times", cs: "opening times", pl: "opening times" };

    $scope.season = { OperationscheduleName: operationschedulename, Start: '', Stop: '', Type: '1', ClosedonPublicHolidays: '', OperationScheduleTime: [] };

    $scope.operationscheduletime = { Start: '', End: '', Monday: true, Tuesday: true, Wednesday: true, Thuresday: true, Friday: true, Saturday: true, Sunday: true, State: 2, Timecode: 1 };

    //Add Related Content
    $scope.addrelatedcontent = function (relatedcontent) {

        if (relatedcontent.Id != "" && relatedcontent.Id != undefined) {

            var addToArray = true;

            var relatedcontentdata = { Id: relatedcontent.Id, Type: relatedcontent.Type, Name: relatedcontent.Name }

            if ($scope.common.RelatedContent != null) {

                $.each($scope.common.RelatedContent, function (i) {

                    if ($scope.common.RelatedContent[i].Id === relatedcontent.id) {

                        alert('Already present!');
                        addToArray = false;

                        return false;
                    }
                });
            }
            else {
                $scope.common.RelatedContent = [];
            }


            if (addToArray) {

                $scope.common.RelatedContent.push(relatedcontentdata);
                $scope.relatedcontent.Id = '';
                $scope.relatedcontent.Name = '';
                $scope.relatedcontent.Type = '';

                $scope.relatedcontentgastro.Id = '';
                $scope.relatedcontentgastro.Name = '';
                $scope.relatedcontentgastro.Type = '';

                $scope.relatedcontentevent.Id = '';
                $scope.relatedcontentevent.Name = '';
                $scope.relatedcontentevent.Type = '';

                $scope.relatedcontentwebcam.Id = '';
                $scope.relatedcontentwebcam.Name = '';
                $scope.relatedcontentwebcam.Type = '';
            }
        }
        else {
            alert('Invalid Related Highlight!');
        }
    }

    //Remove Related Highlights
    $scope.deleterelatedcontent = function (relatedcontent) {

        $.each($scope.common.RelatedContent, function (i) {
            if ($scope.common.RelatedContent[i].Id === relatedcontent.Id) {
                $scope.common.RelatedContent.splice(i, 1);
                return false;
            }
        });
    }

    //Add Mapping Manually
    $scope.addmapping = function () {

        if ($scope.mappingproperty.Name != '' && $scope.mappingproperty.Value != '' && $scope.mappingproperty.Mappingkey != '') {
            var addToArray = true;

            var provider = $scope.mappingproperty.Mappingkey;

            if ($scope.common.Mapping == null || $scope.common.Mapping == undefined) {
                $scope.common.Mapping = {};
            }

            if ($scope.common.Mapping[provider] == null || $scope.common.Mapping[provider] == undefined) {

                $scope.common.Mapping[provider] = {};
            }

            if ($scope.common.Mapping[provider] != null) {

                //If value is present it will be overwritten....
                Object.keys($scope.common.Mapping[provider]).forEach(function (key) {

                    console.log(key, $scope.common.Mapping[provider][key]);
                });

                //$.each($scope.common.Mapping[provider], function (i) {

                //    if ($scope.common.Mapping[provider][i] === $scope.mappingproperty.Name) {

                //        alert('Already present!');
                //        addToArray = false;

                //        return false;
                //    }
                //});
            }


            if (addToArray) {
                //var property = { Name: $scope.mappingproperty.Name, Value: $scope.mappingproperty.Value };

                //$scope.common.Mapping[provider].push(property);

                var dicttoadd = {};

                if ($scope.common.Mapping[provider] != null && $scope.common.Mapping[provider] != undefined)
                    dicttoadd = $scope.common.Mapping[provider];

                dicttoadd[$scope.mappingproperty.Name] = $scope.mappingproperty.Value;

                $scope.common.Mapping[provider] = dicttoadd;

                console.log($scope.common.Mapping);

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

                delete $scope.common.Mapping[provider];
            }
        }
        else {

            delete $scope.common.Mapping[provider][mapping];

            //$.each($scope.common.Mapping[provider], function (i) {
            //    if ($scope.common.Mapping[provider][i].Name === mapping) {
            //        $scope.common.Mapping[provider].splice(i, 1);
            //        return false;
            //    }
            //});
        }
    }
}

//Modal Slideshow Controller
var InfoModalInstanceCtrl = function ($scope, $modalInstance, $http) {

    $scope.cancelInfoModal = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.myInterval = 5000;
    $scope.slides = $scope.common.ImageGallery;

    //console.log($scope.common.Detail[$scope.lang].AdditionalText);
    //console.log($scope.common.Detail[$scope.lang].GetThereText);

    $scope.checkIsNullorEmpty = function (thing) {
        
        var isnull = false;

        if (thing == undefined) {
            isnull = true;
        }
        else if (thing == '') {
            isnull = true;
        }
    
        return isnull;
    }
}

//Fileupload Test
app.controller('FileUploadController', ['$scope', 'FileUploader', function($scope, FileUploader) {
    var uploader = $scope.uploader = new FileUploader({
        url: $scope.basePath + '/v1/FileUpload/common/' + $scope.commontype
    });
    

    // FILTERS
    uploader.filters.push({
        name: 'imageFilter',
        fn: function(item /*{File|FileLikeObject}*/, options) {
            var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
            return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
        }
    });

    // CALLBACKS

    uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/, filter, options) {
        console.info('onWhenAddingFileFailed', item, filter, options);
    };
    uploader.onAfterAddingFile = function (fileItem) {        
        console.info('onAfterAddingFile', fileItem);
    };
    uploader.onAfterAddingAll = function(addedFileItems) {
        console.info('onAfterAddingAll', addedFileItems);
    };
    uploader.onBeforeUploadItem = function(item) {
        console.info('onBeforeUploadItem', item);
    };
    uploader.onProgressItem = function(fileItem, progress) {
        console.info('onProgressItem', fileItem, progress);
    };
    uploader.onProgressAll = function(progress) {
        console.info('onProgressAll', progress);
    };
    uploader.onSuccessItem = function (fileItem, response, status, headers) {
        
        if ($scope.common.ImageGallery == null) {
            $scope.common.ImageGallery = [];
        }

        console.log($scope.common.ImageGallery.length);

        var currentimagescount = $scope.common.ImageGallery.length;

        var r = new RegExp('"', 'g');
        var imageurl = response.replace(r, '');        

        alert('added Image: ' + imageurl);

        var UploadedImage = { ImageName: '', ImageUrl: imageurl, Width: 0, Height: 0, ImageSource: 'SMGManager', ImageTitle: { de: '', it: '', en: '', nl: '', cs: '', pl: '' }, ListPosition: currentimagescount++ }       

        $scope.common.ImageGallery.push(UploadedImage);


        console.info('onSuccessItem', fileItem, response, status, headers);
    };
    uploader.onErrorItem = function (fileItem, response, status, headers) {

        alert('error');
        console.info('onErrorItem', fileItem, response, status, headers);
    };
    uploader.onCancelItem = function(fileItem, response, status, headers) {
        console.info('onCancelItem', fileItem, response, status, headers);
    };
    uploader.onCompleteItem = function(fileItem, response, status, headers) {
        console.info('onCompleteItem', fileItem, response, status, headers);
    };
    uploader.onCompleteAll = function() {
        console.info('onCompleteAll');
    };

    console.info('uploader', uploader);
}]);

//Fileupload Logo
app.controller('LogoFileUploadController', ['$scope', 'FileUploader', function ($scope, FileUploader) {
    var uploader = $scope.uploader = new FileUploader({
        url: $scope.basePath + '/v1/FileUpload/common/Logo'
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

        $scope.common.ContactInfos[lang].LogoUrl = imageurl;

        //alert($scope.common.ContactInfos[lang].LogoUrl);

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
        url: $scope.basePath + '/v1/FileUpload/common/' + $scope.commontype
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

        var currentimagescount = $scope.common.ImageGallery.length;

        var r = new RegExp('"', 'g');
        var imageurl = response.replace(r, '');
        //Filename
        var imagename = imageurl.substring(imageurl.lastIndexOf('/') + 1);


        alert('changed Image: ' + imageurl);

        var UploadedImage = { ImageName: '', ImageUrl: imageurl, Width: 0, Height: 0, ImageSource: 'SMGManager', ImageTitle: { de: '', it: '', en: '', nl: '', cs: '', pl: '' }, ListPosition: currentimagescount++ }

        //$scope.common.ImageGallery.push(UploadedImage);

        $.each($scope.common.ImageGallery, function (i) {
            if ($scope.common.ImageGallery[i].ImageUrl === $scope.oldimageurl) {

                $scope.common.ImageGallery[i].ImageUrl = imageurl;
                $scope.common.ImageGallery[i].ImageName = imagename;

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

//Skimap Logo Upload
app.controller('SkiMapFileUploadController', ['$scope', 'FileUploader', function ($scope, FileUploader) {
    var uploader = $scope.uploader = new FileUploader({
        url: $scope.basePath + '/v1/FileUpload/SkiMap'
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

        alert('added Skimap Image: ' + imageurl);

        var lang = $scope.lang;

        $scope.common.SkiAreaMapURL = imageurl;

        //alert($scope.common.ContactInfos[lang].LogoUrl);

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

var typeAheadControllerRegion = app.controller('TypeAheadControllerRegion', function ($scope, $http) {

    $scope.selecteditem = false;

    $scope.getCustomNameListModal = function (lang) {

        $http({
            method: 'Get',
            url: $scope.basePath + '/v1/Location?type=reg&language=' + $scope.lang
        }).success(function (data) {
            $scope.items = data;
        });
    }

    $scope.getCustomNameListModal($scope.lang);

    $scope.onItemSelected = function () {
        $scope.selecteditem = true;
    }
});

var typeAheadControllerTV = app.controller('TypeAheadControllerTV', function ($scope, $http) {

    $scope.selecteditem = false;

    $scope.getCustomNameListModal = function (lang) {

        $http({
            method: 'Get',
            url: $scope.basePath + '/v1/Location?type=tvs&language=' + $scope.lang
        }).success(function (data) {
            $scope.items = data;
        });
    }

    $scope.getCustomNameListModal($scope.lang);

    $scope.onItemSelected = function () {
        $scope.selecteditem = true;
    }
});

var typeAheadControllerMunicipality = app.controller('TypeAheadControllerMunicipality', function ($scope, $http) {

    $scope.selecteditem = false;

    $scope.getCustomNameListModal = function (lang) {

        $http({
            method: 'Get',
            url: $scope.basePath + '/v1/Location?type=mun&language=' + $scope.lang
        }).success(function (data) {
            $scope.items = data;
        });
    }

    $scope.getCustomNameListModal($scope.lang);

    $scope.onItemSelected = function () {
        $scope.selecteditem = true;
    }
});

var typeAheadControllerDistrict = app.controller('TypeAheadControllerDistrict', function ($scope, $http) {

    $scope.selecteditem = false;

    $scope.getCustomNameListModal = function (lang) {

        $http({
            method: 'Get',
            url: $scope.basePath + '/v1/Location?type=fra&language=' + $scope.lang
        }).success(function (data) {
            $scope.items = data;
        });
    }

    $scope.getCustomNameListModal($scope.lang);

    $scope.onItemSelected = function () {
        $scope.selecteditem = true;
    }
});

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

//Region Name controller
var regionnamecontroller = app.controller('RegionNameController', function ($scope, $http) {

    $scope.initregname = function (regid) {

        $http({
            method: 'Get',
            url: $scope.basePath + '/v1/Location?type=reg&language=' + $scope.lang
            //url: $scope.basePath + '/v1/Common/TourismvereinList/Reduced/' + $scope.lang + '/100'  --> PRoblem mit Lowercase IDs
        }).success(function (data) {

            $.each(data, function (i) {
                if (data[i].id === regid) {
                    $scope.myregname = data[i].name;
                    return false;
                }
            });
        });

    };
});

//Tourismverein Name controller
var tourismvereinnamecontroller = app.controller('TourismVereinNameController', function ($scope, $http) {

    $scope.inittvname = function (tvid) {
        
        $http({
            method: 'Get',
            url: $scope.basePath + '/v1/Location?type=tvs&language=' + $scope.lang
            //url: $scope.basePath + '/v1/Common/TourismvereinList/Reduced/' + $scope.lang + '/100'  --> PRoblem mit Lowercase IDs
        }).success(function (data) {
            
            $.each(data, function (i) {
                if (data[i].id === tvid) {
                    $scope.mytvname = data[i].name;
                    return false;
                }
            });
        });

    };        
});

//Municipality Name controller
var municipalitynamecontroller = app.controller('MunicipalityNameController', function ($scope, $http) {

    $scope.initmunname = function (munid) {

        $http({
            method: 'Get',
            url: $scope.basePath + '/v1/Location?type=mun&language=' + $scope.lang
        }).success(function (data) {

            $.each(data, function (i) {
                if (data[i].id === munid) {
                    $scope.mymunname = data[i].name;
                    return false;
                }
            });
        });

    };
});

//District Name controller
var districtnamecontroller = app.controller('DistrictNameController', function ($scope, $http) {

    $scope.initdistname = function (fraid) {

        $http({
            method: 'Get',
            url: $scope.basePath + '/v1/Location?type=tvs&language=' + $scope.lang
            //url: $scope.basePath + '/v1/Common/TourismvereinList/Reduced/' + $scope.lang + '/100'  --> PRoblem mit Lowercase IDs
        }).success(function (data) {

            $.each(data, function (i) {
                if (data[i].id === fraid) {
                    $scope.myfraname = data[i].name;
                    return false;
                }
            });
        });

    };
});

//Directive Typeahead
app.directive('typeaheadcustom', function ($timeout) {
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

var relatedcontentsmgpoitypeaheadcontroller = app.controller('SmgRelatedContentActivityPoiTypeAheadController', function ($scope, $http) {

    $scope.relatedcontenttypeaheadselected = false;

    $scope.init = function (loctype, locid) {

        var locfilterstring = "";

        for (var i in locid) {

            if (i > 0)
                locfilterstring = locfilterstring + ",";

            locfilterstring = locfilterstring + loctype + locid[i];
        }

        if (locfilterstring == "")
            locfilterstring = "null";

        $scope.relatedcontentlocfilter = locfilterstring;

        console.log($scope.relatedcontentlocfilter);

        $scope.getRelatedContent();
    };

    $scope.relatedcontenttypeaheadselected = false;

    $scope.getRelatedContent = function () {

        $http({
            method: 'Get',
            url: $scope.basePath + '/v1/ODHActivityPoi?type=233&fields=Id,Detail.de.Title,_Meta.Type&active=true&pagesize=0&locfilter=' + $scope.relatedcontentlocfilter
        }).success(function (data) {
            //alert('data gekriag' + data.length);

            $scope.items = data;
        });
    }

    $scope.onItemSelected = function () {
        $scope.relatedcontenttypeaheadselected = true;
    }
});

var relatedcontentwebcamtypeaheadcontroller = app.controller('SmgRelatedContentWebcamTypeAheadController', function ($scope, $http) {

    $scope.relatedcontenttypeaheadselected = false;

    $http({
        method: 'Get',
        url: $scope.basePath + '/v1/WebcamInfo?fields=Id,Detail.de.Title,_Meta.Type&pagesize=0'
    }).success(function (data) {
        //alert('data gekriag' + data.length);

        $scope.items = data;
    });

    $scope.onItemSelected = function () {
        $scope.relatedcontenttypeaheadselected = true;
    }
});

////Directive Typeahead
//app.directive('typeaheadwebcam', function ($timeout) {
//    return {
//        restrict: 'AEC',
//        scope: {
//            items: '=',
//            prompt: '@',
//            title: '@',
//            name: '@',
//            model: '=',
//            idmodel: '=',
//            onSelect: '&'
//        },
//        link: function (scope, elem, attrs) {
//            scope.handleSelection = function (selectedItem, selectedId) {
//                scope.model = selectedItem;
//                scope.idmodel = selectedId;
//                scope.current = 0;
//                scope.selected = true;
//                $timeout(function () {
//                    scope.onSelect();
//                }, 200);
//            };
//            scope.current = 0;
//            scope.selected = true;
//            scope.isCurrent = function (index) {
//                return scope.current == index;
//            };
//            scope.setCurrent = function (index) {
//                scope.current = index;
//            };
//        },
//        templateUrl: function (elem, attrs) {
//            //alert(attrs.templateurl);
//            return attrs.templateurl || 'default.html'
//        }
//        //templateUrl: 'HuetteTemplate2'
//    }
//});

//var webcamtypeaheadcontroller = app.controller('WebcamTypeAheadController', function ($scope, $http) {

//    $scope.webcamtypeaheadselected = false;

//    $scope.getRelatedContent = function () {
//        $http({
//            method: 'Get',
//            url: $scope.basePath + '/api/WebcamInfoReduced' + '?language=' + $scope.lang
//        }).success(function (data) {
//            $scope.items = data;
//        });
//    }

//    $scope.onItemSelected = function () {
//        $scope.webcamtypeaheadselected = true;
//    }

//    $scope.getRelatedContent();
//});


//var relatedcontentgastrotypeaheadcontroller = app.controller('SmgRelatedContentGastronomyTypeAheadController', function ($scope, $http) {

//    $scope.relatedcontenttypeaheadselected = false;

//    $http({
//        method: 'Get',
//        url: $scope.basePath + '/v1/SmgPoi/ReducedEssenTrinkenRelatedContentAsync/de/Essen Trinken/null/null/null/null/null/true/null/null'
//    }).success(function (data) {
//        //alert('data gekriag' + data.length);

//        $scope.items = data;
//    });

//    $scope.onItemSelected = function () {
//        $scope.relatedcontenttypeaheadselected = true;
//    }
//});

//var relatedcontenteventtypeaheadcontroller = app.controller('SmgRelatedContentEventTypeAheadController', function ($scope, $http) {

//    $scope.relatedcontenttypeaheadselected = false;

//    $http({
//        method: 'Get',
//        url: $scope.basePath + '/v1/SmgPoi/ReducedEventRelatedContentAsync/de/true/true/null'
//    }).success(function (data) {
//        //alert('data gekriag' + data.length);

//        $scope.items = data;
//    });

//    $scope.onItemSelected = function () {
//        $scope.relatedcontenttypeaheadselected = true;
//    }
//});

/**
* The ng-thumb directive
* @author: nerv
* @version: 0.1.2, 2014-01-09
*/
app.directive('ngThumb', ['$window', function($window) {
    var helper = {
        support: !!($window.FileReader && $window.CanvasRenderingContext2D),
        isFile: function(item) {
            return angular.isObject(item) && item instanceof $window.File;
        },
        isImage: function(file) {
            var type =  '|' + file.type.slice(file.type.lastIndexOf('/') + 1) + '|';
            return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
        }
    };

    return {
        restrict: 'A',
        template: '<canvas/>',
        link: function(scope, element, attributes) {
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

function guid() {
    function _p8(s) {
        var p = (Math.random().toString(16) + "000000000").substr(2, 8);
        return s ? "-" + p.substr(0, 4) + "-" + p.substr(4, 4) : p;
    }
    return _p8() + _p8(true) + _p8(true) + _p8();
}

//var MyFileuploadCtrl = ['$scope', '$http', '$timeout', '$upload', function ($scope, $http, $timeout, $upload) {
//    $scope.usingFlash = FileAPI && FileAPI.upload != null;
//    $scope.fileReaderSupported = window.FileReader != null && (window.FileAPI == null || FileAPI.html5 != false);
//    $scope.uploadRightAway = true;
//    $scope.changeAngularVersion = function () {
//        window.location.hash = $scope.angularVersion;
//        window.location.reload(true);
//    };
//    $scope.hasUploader = function (index) {
//        return $scope.upload[index] != null;
//    };
//    $scope.abort = function (index) {
//        $scope.upload[index].abort();
//        $scope.upload[index] = null;
//    };
//    $scope.angularVersion = window.location.hash.length > 1 ? (window.location.hash.indexOf('/') === 1 ?
//			window.location.hash.substring(2) : window.location.hash.substring(1)) : '1.2.20';
//    $scope.onFileSelect = function ($files) {
//        $scope.selectedFiles = [];
//        $scope.progress = [];
//        if ($scope.upload && $scope.upload.length > 0) {
//            for (var i = 0; i < $scope.upload.length; i++) {
//                if ($scope.upload[i] != null) {
//                    $scope.upload[i].abort();
//                }
//            }
//        }
//        $scope.upload = [];
//        $scope.uploadResult = [];
//        $scope.selectedFiles = $files;
//        $scope.dataUrls = [];
//        for (var i = 0; i < $files.length; i++) {
//            var $file = $files[i];
//            if ($scope.fileReaderSupported && $file.type.indexOf('image') > -1) {
//                var fileReader = new FileReader();
//                fileReader.readAsDataURL($files[i]);
//                var loadFile = function (fileReader, index) {
//                    fileReader.onload = function (e) {
//                        $timeout(function () {
//                            $scope.dataUrls[index] = e.target.result;
//                        });
//                    }
//                }(fileReader, i);
//            }
//            $scope.progress[i] = -1;
//            if ($scope.uploadRightAway) {
//                $scope.start(i);
//            }
//        }
//    };

//    $scope.start = function (index) {
//        $scope.progress[index] = 0;
//        $scope.errorMsg = null;
//        if ($scope.howToSend == 1) {
//            $scope.upload[index] = $upload.upload({
//                url: uploadUrl,
//                method: $scope.httpMethod,
//                headers: { 'my-header': 'my-header-value' },
//                data: {
//                    myModel: $scope.myModel,
//                    errorCode: $scope.generateErrorOnServer && $scope.serverErrorCode,
//                    errorMessage: $scope.generateErrorOnServer && $scope.serverErrorMsg
//                },
//                /* formDataAppender: function(fd, key, val) {
//					if (angular.isArray(val)) {
//                        angular.forEach(val, function(v) {
//                          fd.append(key, v);
//                        });
//                      } else {
//                        fd.append(key, val);
//                      }
//				}, */
//                /* transformRequest: [function(val, h) {
//					console.log(val, h('my-header')); return val + '-modified';
//				}], */
//                file: $scope.selectedFiles[index],
//                fileFormDataName: 'myFile'
//            });
//            $scope.upload[index].then(function (response) {
//                $timeout(function () {
//                    $scope.uploadResult.push(response.data);
//                });
//            }, function (response) {
//                if (response.status > 0) $scope.errorMsg = response.status + ': ' + response.data;
//            }, function (evt) {
//                // Math.min is to fix IE which reports 200% sometimes
//                $scope.progress[index] = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
//            });
//            $scope.upload[index].xhr(function (xhr) {
//                //				xhr.upload.addEventListener('abort', function() {console.log('abort complete')}, false);
//            });
//        } else {
//            var fileReader = new FileReader();
//            fileReader.onload = function (e) {
//                $scope.upload[index] = $upload.http({
//                    url: uploadUrl,
//                    headers: { 'Content-Type': $scope.selectedFiles[index].type },
//                    data: e.target.result
//                }).then(function (response) {
//                    $scope.uploadResult.push(response.data);
//                }, function (response) {
//                    if (response.status > 0) $scope.errorMsg = response.status + ': ' + response.data;
//                }, function (evt) {
//                    // Math.min is to fix IE which reports 200% sometimes
//                    $scope.progress[index] = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
//                });
//            }
//            fileReader.readAsArrayBuffer($scope.selectedFiles[index]);
//        }
//    };

//    $scope.dragOverClass = function ($event) {
//        var items = $event.dataTransfer.items;
//        var hasFile = false;
//        if (items != null) {
//            for (var i = 0 ; i < items.length; i++) {
//                if (items[i].kind == 'file') {
//                    hasFile = true;
//                    break;
//                }
//            }
//        } else {
//            hasFile = true;
//        }
//        return hasFile ? "dragover" : "dragover-err";
//    };

//}];