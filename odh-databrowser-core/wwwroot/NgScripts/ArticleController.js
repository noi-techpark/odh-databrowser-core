// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

var app = angular.module('article', ['ui.bootstrap', 'ngSanitize', 'angularFileUpload', 'appconfig', 'textAngular', 'pathconfig']);

app.controller('articleListController', [
    '$scope', '$http', '$modal', 'appconfig', 'languageFactory', 'apipath',
    function ($scope, $http, $modal, config, languageFactory, apipath) {

        $scope.basePath = apipath;
        $scope.lang = languageFactory.getLanguage();  

        var allowedlanguages = ['de', 'it', 'en', 'nl', 'cs', 'pl', 'fr', 'ru'];

        $scope.datesort = 'false';

        $scope.init = function (articletype, datesort) {

            //fallback if language is not available here set it back to browserlanguage
            if (!allowedlanguages.includes($scope.lang)) {
                $scope.lang = 'en';
            }

            //This function is sort of private constructor for controller            
            $scope.articletype = articletype;
            $scope.datesort = datesort;              

            //alert($scope.datesort);
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

        $scope.editarticle = function (article) {

            if (article === 'new') {
               
                $scope.newarticle = true;

                var articlestartdate = null;
                if ($scope.articletype == 'newsfeednoi')
                    articlestartdate = new Date();

                $scope.article = {
                    Id: guid(), _Meta: { Id: '', Type: 'article', Source: 'noi', Reduced: false }, Shortname: '', Type: $scope.articletype, HasLanguage: [], Highlight: false, Active: false, SmgActive: false, ArticleDate: articlestartdate, LicenseInfo: { Author: "", ClosedData: false, License: "CC0", LicenseHolder: "https://noi.bz.it" }, Source: "noi", ContactInfos: {} };

                if ($scope.articletype == 'newsfeednoi') {
                    //Adding some infos by standard
                    $scope.article.SmgActive = true;
                    $scope.article.HasLanguage = ['de', 'it', 'en'];
                    $scope.article.ContactInfos['de'] = { CompanyName: 'NOI Techpark', Email: 'community@noi.bz.it' };
                    $scope.article.ContactInfos['it'] = { CompanyName: 'NOI Techpark', Email: 'community@noi.bz.it' };
                    $scope.article.ContactInfos['en'] = { CompanyName: 'NOI Techpark', Email: 'community@noi.bz.it' };
                }

                var modalInstance = $modal.open({
                    templateUrl: 'myArticleModal.html',
                    controller: ArticleModalInstanceCtrl,
                    scope: $scope,
                    //size: 'modal-wide',
                    windowClass: 'modal-wide',
                    backdrop: 'static'
                });
            }
            else {
                $scope.newarticle = false;
                //scope.article = article;

                //Test nochmaliger Request auf Detail
                $http.get($scope.basePath + '/v1/Article/' + article.Id).success(function (result) {
                    $scope.article = result;                    
                    $scope.isloading = false;

                    if ($scope.article.ArticleDateTo == '9999-12-31T23:59:59.9999999')
                        $scope.article.ArticleDateTo = null;

                    var modalInstance = $modal.open({
                        templateUrl: 'myArticleModal.html',
                        controller: ArticleModalInstanceCtrl,
                        scope: $scope,
                        //size: 'lg',
                        windowClass: 'modal-wide',
                        backdrop: 'static'
                    });
                });
            }            
        };

        $scope.updateDatainList = function (article) {

            $.each($scope.articles, function (i) {
                if ($scope.articles[i].Id === article.Id) {
                    $scope.articles[i] = article;
                    //alert("upgedated");
                    return false;
                }
            });

        }

        $scope.deletearticle = function (id) {

            var deleteconfirm = confirm('Are you absolutely sure you want to delete?');

            if (deleteconfirm) {

                $http.delete($scope.basePath + '/v1/Article/' + id).then(function (result) {
                    alert("Article deleted!");

                    //$.each($scope.articles, function (i) {
                    //    if ($scope.articles[i].Id === id) {
                    //        $scope.articles.splice(i, 1);
                    //        return false;
                    //    }
                    //});

                    $scope.applyFilter($scope.page);

                }, function (error) {
                    alert("Error " + error.status);
                });
            }
        };

        $scope.sendtopushserver = function (article) {

            var pushconfirm = confirm('Are you sure you want to send a push?');

            if (pushconfirm) {

                $http.get($scope.basePath + '/v1/FCMMessage/article/' + article.Id + '/noicommunityapp/de,it,en').success(function (result) {
                    alert("PushNotification sent!");

                    var addToArray = true;
                    
                    //Add the tag pushed + Date 
                    if (article.SmgTags != undefined && article.SmgTags != null) {
                        $.each(article.SmgTags, function (i) {
                            if (article.SmgTags[i] === 'pushed') {
                               addToArray = false;
                                return false;
                            }
                        });
                    }
                    else {
                        article.SmgTags = [];
                    }

                    if (addToArray) {
                        article.SmgTags.push('pushed');
                    }

                    //Save to DB
                    $http.put($scope.basePath + '/v1/Article/' + article.Id, article).success(function (result) {
                       
                        $scope.applyFilter($scope.page);
                    });

                }).error(function (data) {
                    alert("ERROR:" + data);
                });
            }
        };

        $scope.page = 1;
        $scope.totalpages = 0;
        $scope.totalcount = 0;
        $scope.seed = 'null';
        $scope.filtered = false;

        $scope.SelectedArticleId = '';
        $scope.SelectedArticleName = '';
        $scope.articlefilter = 'null';
        $scope.smgtagfilter = 'null';
        $scope.subtypefilter = 'null';
        $scope.langlistfilter = 'null';

        $scope.active = 'null';
        $scope.smgactive = 'null';

        $scope.publishchannelfilter = '';

        $scope.SelectedSmgTagName = '';
        $scope.SelectedSmgTagId = '';

        $scope.datumvonfilter = '';
        $scope.datumbisfilter = '';

        setSubTypeModel();
        setLanglistModel();

        //$scope.changeLanguage = function (lang) {
        //    $scope.lang = lang;
        //    $scope.changePage(0);

        //    //$scope.$broadcast('LoadArticleNamesList');
        //}

        //Filter anwenden
        $scope.applyFilter = function (page, withoutrefresh) {

            $scope.page = page;
            $scope.isloading = true;
            $scope.setFilters();
            $scope.page = page;

            if ($scope.langlistfilter != '' && $scope.langlistfilter != 'null')
                $scope.lang = $scope.langlistfilter.substring(0, 2);

            //DATE Gschicht
            $scope.datumvonfilter = '';
            $scope.datumbisfilter = '';

            if ($scope.Datumvon != '' && $scope.Datumvon != undefined) {

                var arrivalday = $scope.Datumvon.getDate();
                var arrivalmonth = parseInt($scope.Datumvon.getMonth()) + 1; //Months are zero based            
                var arrivalyear = $scope.Datumvon.getFullYear();

                $scope.datumvonfilter = "&startdate=" + arrivalyear + "-" + arrivalmonth + "-" + arrivalday;
            }
            else {
                $scope.datumvonfilter = '';
            }

            if ($scope.Datumbis != '' && $scope.Datumbis != undefined) {

                var arrivalday2 = $scope.Datumbis.getDate();
                var arrivalmonth2 = parseInt($scope.Datumbis.getMonth()) + 1; //Months are zero based            
                var arrivalyear2 = $scope.Datumbis.getFullYear();

                $scope.datumbisfilter = "&enddate=" + arrivalyear2 + "-" + arrivalmonth2 + "-" + arrivalday2;
            }
            else {
                $scope.datumbisfilter = '';
            }

            var sortby = '';
            if ($scope.articletype == 'newsfeednoi') {
                sortby = '&rawsort=-ArticleDate'
            }

            if ($scope.SelectedArticleId != '') {
                $scope.articlefilter = $scope.SelectedArticleId;
            }
            else {
                $scope.articlefilter = 'null';
            }

            var searchfilter = '';
            if ($scope.SelectedArticleName != '') {
                searchfilter = '&searchfilter=' + $scope.SelectedArticleName;
            }
            else
                searchfilter = '';

            $http.get($scope.basePath + '/v1/Article?pagenumber=' + $scope.page + '&pagesize=20&articletype=' + $scope.articletype + '&articlesubtype=' + $scope.subtypefilter + '&idlist=' + $scope.articlefilter + '&langfilter=' + $scope.langlistfilter + '&active=' + $scope.active + '&odhactive=' + $scope.smgactive + '&smgtagfilter=' + $scope.smgtagfilter + '&publishedon=' + $scope.publishchannelfilter + '&seed=' + $scope.seed + $scope.datumvonfilter + $scope.datumbisfilter + sortby + searchfilter).success(function (result) {
                $scope.articles = result.Items;
                $scope.totalpages = result.TotalPages;
                $scope.totalcount = result.TotalResults;
                $scope.seed = result.Seed;
                $scope.isloading = false;
                $scope.filtered = true
            });        

            if (withoutrefresh != true)
                $scope.$broadcast('LoadArticleNamesList');
        }

        //Filter Löschen
        $scope.clearFilter = function () {
            $scope.filtered = false;
            $scope.page = 1;
            $scope.SelectedArticleId = '';
            $scope.SelectedArticleName = '';
            $scope.SelectedSmgTagName = '';
            $scope.articlefilter = 'null';
            $scope.smgtagfilter = 'null';
            $scope.subtypefilter = 'null';
            $scope.langlistfilter = 'null';

            $scope.active = 'null';
            $scope.smgactive = 'null';

            $scope.datumvonfilter = '';
            $scope.datumbisfilter = '';

            $scope.Datumvon = '';
            $scope.Datumbis = '';
            $scope.publishchannelfilter = '';

            setSubTypeModel();
            setLanglistModel();

            $scope.checkLangListModel[$scope.lang] = true;

            $scope.changePage(0);
            //$scope.$broadcast('LoadArticleNamesList');
        }

        $scope.clearIdFilter = function () {
            $scope.SelectedArticleId = '';
            $scope.articlefilter = 'null';
            $scope.page = 1;
            $scope.changePage(0);

            //$scope.$broadcast('LoadEventNamesList');
        }

        //Clear single Filters
        $scope.clearNameFilter = function () {
            $scope.SelectedArticleName = '';
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

        function setSubTypeModel() {
            //Subtype CheckboxFilter
            $scope.checkSubTypeModel = {
                one: false,
                two: false,
                three: false,
                four: false,
                six: false,
                seven: false,
                eight: false,
                nine: false,
                ten: false,               
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
                pl: false
            };
        }

        $scope.canPushed = function (smgtags) {

            //console.log(smgtags);
            if (smgtags != undefined && smgtags != null) {

             
                //console.log(smgtags.includes("pushed"));

                if (smgtags.includes("pushed"))
                    return false;
            }
            
            return true;
        };


        $scope.setFilters = function () {
            if ($scope.SelectedArticleId != '')
                $scope.articlefilter = $scope.SelectedArticleId;

            if ($scope.SelectedSmgTagName != '')
                $scope.smgtagfilter = $scope.SelectedSmgTagId;

            //Subtype Filter
            $scope.subtypefilter = "";

            if ($scope.checkSubTypeModel.one && $scope.checkSubTypeModel.two && $scope.checkSubTypeModel.three && $scope.checkSubTypeModel.four && $scope.checkSubTypeModel.five && $scope.checkSubTypeModel.six && $scope.checkSubTypeModel.seven && $scope.checkSubTypeModel.eight && $scope.checkSubTypeModel.nine && $scope.checkSubTypeModel.ten && $scope.checkSubTypeModel.eleven && $scope.checkSubTypeModel.twelve && $scope.checkSubTypeModel.thirteen && $scope.checkSubTypeModel.fourteen && $scope.checkSubTypeModel.fifteen) {
                $scope.subtypefilter = "";
            }
            else if (!$scope.checkSubTypeModel.one && !$scope.checkSubTypeModel.two && !$scope.checkSubTypeModel.three && !$scope.checkSubTypeModel.four && !$scope.checkSubTypeModel.five && !$scope.checkSubTypeModel.six && !$scope.checkSubTypeModel.seven && $scope.checkSubTypeModel.eight && $scope.checkSubTypeModel.nine && $scope.checkSubTypeModel.ten && !$scope.checkSubTypeModel.eleven && !$scope.checkSubTypeModel.twelve && $scope.checkSubTypeModel.thirteen && $scope.checkSubTypeModel.fourteen && $scope.checkSubTypeModel.fifteen) {
                $scope.subtypefilter = "";
            }
            else {

                if ($scope.checkSubTypeModel.one) {
                    $scope.subtypefilter = $scope.subtypefilter + "1,";
                }
                if ($scope.checkSubTypeModel.two) {
                    $scope.subtypefilter = $scope.subtypefilter + "2,";
                }
                if ($scope.checkSubTypeModel.three) {
                    $scope.subtypefilter = $scope.subtypefilter + "3,";
                }
                if ($scope.checkSubTypeModel.four) {
                    $scope.subtypefilter = $scope.subtypefilter + "4,";
                }
                if ($scope.checkSubTypeModel.five) {
                    $scope.subtypefilter = $scope.subtypefilter + "5,";
                }
                if ($scope.checkSubTypeModel.six) {
                    $scope.subtypefilter = $scope.subtypefilter + "6,";
                }
                if ($scope.checkSubTypeModel.seven) {
                    $scope.subtypefilter = $scope.subtypefilter + "7,";
                }
                if ($scope.checkSubTypeModel.eight) {
                    $scope.subtypefilter = $scope.subtypefilter + "8,";
                }
                if ($scope.checkSubTypeModel.nine) {
                    $scope.subtypefilter = $scope.subtypefilter + "9,";
                }
                if ($scope.checkSubTypeModel.ten) {
                    $scope.subtypefilter = $scope.subtypefilter + "10,";
                }
                if ($scope.checkSubTypeModel.eleven) {
                    $scope.subtypefilter = $scope.subtypefilter + "11,";
                }
                if ($scope.checkSubTypeModel.twelve) {
                    $scope.subtypefilter = $scope.subtypefilter + "12,";
                }
                if ($scope.checkSubTypeModel.thirteen) {
                    $scope.subtypefilter = $scope.subtypefilter + "13,";
                }
                if ($scope.checkSubTypeModel.fourteen) {
                    $scope.subtypefilter = $scope.subtypefilter + "14,";
                }
                if ($scope.checkSubTypeModel.fifteen) {
                    $scope.subtypefilter = $scope.subtypefilter + "15,";
                }

            }
            if ($scope.subtypefilter == "")
                $scope.subtypefilter = "null";


            //Subtype Filter
            $scope.langlistfilter = "";

            if ($scope.checkLangListModel.de && $scope.checkLangListModel.it && $scope.checkLangListModel.en && $scope.checkLangListModel.nl && $scope.checkLangListModel.cs && $scope.checkLangListModel.pl) {
                $scope.langlistfilter = "";
            }
            else if (!$scope.checkLangListModel.de && !$scope.checkLangListModel.it && !$scope.checkLangListModel.en && !$scope.checkLangListModel.nl && !$scope.checkLangListModel.cs && !$scope.checkLangListModel.pl) {
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
            }
            if ($scope.langlistfilter == "")
                $scope.langlistfilter = "null";

        }

        //Modal anzeigen
        $scope.showInfoModal = function (article) {

            $scope.article = article;

            var slidemodalInstance = $modal.open({
                templateUrl: 'myArticleInfoModal.html',
                controller: InfoModalInstanceCtrl,
                scope: $scope,
                size: 'lg'
            });
        };

        $scope.articles = [];        

    }]);

var wysiwygeditorCtrl = function ($scope) {
    $scope.htmlcontent = "Insert HTML";
    $scope.htmlcontentbase = "<div></div>";
    $scope.htmlcontentintro = "<div></div>";

    $scope.disabled = false;
};


//Modal Controller
var ArticleModalInstanceCtrl = function ($scope, $modalInstance, $http) {
    
    //$scope.smgtag.smgtagname = '';
    //$scope.smgtag.smgtagid = '';

    $scope.smgtag = {};
    $scope.additional = {};
    $scope.link = {};
    $scope.selectedlogo = {};

    $scope.mappingproperty = {};

    $scope.ok = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.cancel = function () {
        var cancelconfirm = confirm('Close and dismiss changes?');

        if (cancelconfirm) {
            $modalInstance.dismiss('cancel');
        }
    };

    $scope.addarticle = function (article, isvalid) {

        //console.log(isvalid);

        if (isvalid) {

            if (article.ArticleDate != null && article.ArticleDate != undefined && article.ArticleDate instanceof Date)
                article.ArticleDate = article.ArticleDate.toDateString();
            if (article.ArticleDateTo != null && article.ArticleDateTo != undefined && article.ArticleDateTo instanceof Date)
                article.ArticleDateTo = article.ArticleDateTo.toDateString();

            $http.post($scope.basePath + '/v1/Article', article).then(function (result) {
                alert("Article added!");

                console.log(article);

                $scope.articles.push(article);
                
                $modalInstance.close();

                $scope.$parent.applyFilter($scope.page);

            }, function (error) {
                alert("Error " + error.status);
            });              
        }
        else {
            alert("Invalid Data!");
        }
    };

    $scope.updatearticle = function (article, isvalid) {

        if (isvalid) {
          
            if (article.ArticleDate != null && article.ArticleDate != undefined && article.ArticleDate instanceof Date)
                article.ArticleDate = article.ArticleDate.toDateString();
            if (article.ArticleDateTo != null && article.ArticleDateTo != undefined && article.ArticleDateTo instanceof Date)
                article.ArticleDateTo = article.ArticleDateTo.toDateString();

            //Start Date richtig setzen
            //eventshort.StartDate = eventshort.eventstartonlydate.getFullYear() + "/" + parseInt(eventshort.eventstartonlydate.getMonth() + 1) + "/" + eventshort.eventstartonlydate.getDate() + " " + eventshort.eventstartonlytime;
            //eventshort.EndDate = eventshort.eventendonlydate.getFullYear() + "/" + parseInt(eventshort.eventendonlydate.getMonth() + 1) + "/" + eventshort.eventendonlydate.getDate() + " " + eventshort.eventendonlytime;



            $http.put($scope.basePath + '/v1/Article/' + article.Id, article).then(function (result) {
                alert("Article updated!");
                $modalInstance.close();

                //$scope.$parent.updateDatainList(article);
                $scope.$parent.applyFilter($scope.page);
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
    $scope.addtag = function () {

        //console.log($scope.smgtag.smgtagid);

        if ($scope.smgtag.smgtagid != "" && $scope.smgtag.smgtagid != undefined) {
            var addToArray = true;

            if ($scope.article.SmgTags != null) {

                $.each($scope.article.SmgTags, function (i) {

                    if ($scope.article.SmgTags[i] === $scope.smgtag.smgtagid.toLowerCase()) {

                        alert('Already present!');
                        addToArray = false;

                        return false;
                    }
                });
            }
            else {
                $scope.article.SmgTags = [];
            }


            if (addToArray) {

                $scope.article.SmgTags.push($scope.smgtag.smgtagid.toLowerCase());
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
        //alert(tag);
        $.each($scope.article.SmgTags, function (i) {
            if ($scope.article.SmgTags[i] === tag) {
                $scope.article.SmgTags.splice(i, 1);
                return false;
            }
        });
    }

    $scope.addaddtionalproperty = function (currentlang) {        

        if ($scope.additional.header != null && $scope.additional.header != "" && $scope.additional.header != undefined) {

            var additionalheader = $scope.additional.header.replace(/\s+/g, '').trim();

            if ($scope.article.AdditionalArticleInfos == null) {

                $scope.article.AdditionalArticleInfos = {};

                var additionalinfoelement = {};
                additionalinfoelement[additionalheader] = '';
                $scope.article.AdditionalArticleInfos[currentlang] = { 'Language': currentlang, 'Elements': additionalinfoelement };

                $scope.additional.header = '';
            }
            else if (!($scope.article.AdditionalArticleInfos.hasOwnProperty(currentlang))) {

                var additionalinfoelement = {};
                additionalinfoelement[additionalheader] = '';
                $scope.article.AdditionalArticleInfos[currentlang] = { 'Language': currentlang, 'Elements': additionalinfoelement };

                $scope.additional.header = '';
            }
            else {
                $scope.article.AdditionalArticleInfos[currentlang].Elements[additionalheader] = '';

                $scope.additional.header = '';                
            }
        }
    }

    $scope.removeaddtionalproperty = function (additionalpropertyname, lang) {
       delete $scope.article.AdditionalArticleInfos[lang].Elements[additionalpropertyname];
    }
    
    $scope.addlinkproperty = function (currentlang) {
        
        if ($scope.link.header != null && $scope.link.header != "" && $scope.link.header != undefined) {

            var linkheader = $scope.link.header.replace(/\s+/g, '').trim();

            if ($scope.article.ArticleLinkInfo == null) {

                $scope.article.ArticleLinkInfo = {};

                var additionalinfoelement = {};
                additionalinfoelement[linkheader] = '';
                $scope.article.ArticleLinkInfo[currentlang] = { 'Language': currentlang, 'Elements': additionalinfoelement };

                $scope.link.header = "";
            }
            else if (!($scope.article.ArticleLinkInfo.hasOwnProperty(currentlang))) {

                var additionalinfoelement = {};
                additionalinfoelement[linkheader] = '';
                $scope.article.ArticleLinkInfo[currentlang] = { 'Language': currentlang, 'Elements': additionalinfoelement };

                // alert($scope.article.AdditionalArticleInfos.hasOwnProperty("nl"));   

                $scope.link.header = "";
            }
            else {
                $scope.article.ArticleLinkInfo[currentlang].Elements[linkheader] = '';

                $scope.link.header = "";
            }
        }
        else {
            alert("Insert a link title")
        }
    }

    $scope.removelinkproperty = function (linkpropertyname, lang) {       
        delete $scope.article.ArticleLinkInfo[lang].Elements[linkpropertyname];
    }

    //TODO DELETE image on source
    $scope.deletebild = function (bildname) {

        ////Querystring parameter holen
        //var parameter = getQueryVariable(bildurl, "src");
        ////Ersetz a poor kloanigkeiten
        //var mybildurl = parameter.replace('.', '$');

        //alert(mybildurl);
       
        //var find = '/';
        //var re = new RegExp(find, 'g');
        //var escapeduri = mybildurl.replace(re, '|');

        //var deletepath = encodeURI($scope.basePath + '/v1/FileDelete/' + escapeduri);
        //alert("Delete Image" + deletepath);

        //$http.delete(deletepath).success(function (result) {
        //    alert("File deleted!");

            $.each($scope.article.ImageGallery, function (i) {
                if ($scope.article.ImageGallery[i].ImageName === bildname) {
                    $scope.article.ImageGallery.splice(i, 1);
                    return false;
                }
            });

        //}).error(function (result) {

        //    $.each($scope.article.ImageGallery, function (i) {
        //        if ($scope.article.ImageGallery[i].ImageName === bildname) {
        //            $scope.article.ImageGallery.splice(i, 1);
        //            return false;
        //        }
        //    });
        //});

        
            
        
    };

    //for newsfeed logo selection
    $scope.selectlogo = function (selectedlogo) {

        console.log("select logo");
        console.log(selectedlogo);

        //Set article.ContactInfo to this logo
        if ($scope.article.ContactInfos == null)
            $scope.article.ContactInfos = {};

        if ($scope.article.ContactInfos["de"] == null || $scope.article.ContactInfos["de"] == undefined)
            $scope.article.ContactInfos["de"] = {};
        if ($scope.article.ContactInfos["it"] == null || $scope.article.ContactInfos["it"] == undefined)
            $scope.article.ContactInfos["it"] = {};
        if ($scope.article.ContactInfos["en"] == null || $scope.article.ContactInfos["en"] == undefined)
            $scope.article.ContactInfos["en"] = {};

        $scope.article.ContactInfos["de"].LogoUrl = selectedlogo;
        $scope.article.ContactInfos["it"].LogoUrl = selectedlogo;
        $scope.article.ContactInfos["en"].LogoUrl = selectedlogo;

    }

    $scope.addlinkpropertynews = function (currentlang) {

        if ($scope.link.header != null && $scope.link.header != "" && $scope.link.header != undefined) {

            //var linkheader = $scope.link.header.replace(/\s+/g, '').trim();

            if ($scope.article.ArticleLinkInfo == null) {

                $scope.article.ArticleLinkInfo = {};

                var additionalinfoelement = {};
                additionalinfoelement['link'] = $scope.link.header;
                $scope.article.ArticleLinkInfo[currentlang] = { 'Language': currentlang, 'Elements': additionalinfoelement };

                $scope.link.header = "";
            }
            else if (!($scope.article.ArticleLinkInfo.hasOwnProperty(currentlang))) {

              
                var additionalinfoelement = {};
                additionalinfoelement['link'] = $scope.link.header;
                $scope.article.ArticleLinkInfo[currentlang] = { 'Language': currentlang, 'Elements': additionalinfoelement };

                // alert($scope.article.AdditionalArticleInfos.hasOwnProperty("nl"));   

                $scope.link.header = "";
            }
            else {

                //Count how many links are inserted
                var elcount = Object.keys($scope.article.ArticleLinkInfo[currentlang].Elements).length;

                $scope.article.ArticleLinkInfo[currentlang].Elements['link' + elcount] = $scope.link.header;

                $scope.link.header = "";
            }
        }
        else {
            alert("Insert a link title")
        }
    }

    $scope.addpublishedonchannel = function (publishchannel) {

        if (publishchannel != "" && publishchannel != undefined) {

            var addToArray = true;

            if ($scope.article.PublishedOn != null) {

                $.each($scope.article.PublishedOn, function (i) {

                    if ($scope.article.PublishedOn[i] === publishchannel) {

                        alert('Already present!');
                        addToArray = false;

                        return false;
                    }
                });
            }
            else {
                $scope.article.PublishedOn = [];
            }


            if (addToArray) {

                $scope.article.PublishedOn.push(publishchannel);
            }
        }
        else {
            alert('Invalid publishchannel!');
        }
    }

    //Remove SMG Tagging
    $scope.deletepublishedonchannel = function (publishchannel) {
        //alert(tag);
        $.each($scope.article.PublishedOn, function (i) {
            if ($scope.article.PublishedOn[i] === publishchannel) {
                $scope.article.PublishedOn.splice(i, 1);
                return false;
            }
        });
    }

    //Add Mapping Manually
    $scope.addmapping = function () {

        if ($scope.mappingproperty.Name != '' && $scope.mappingproperty.Value != '' && $scope.mappingproperty.Mappingkey != '') {
            var addToArray = true;

            var provider = $scope.mappingproperty.Mappingkey;

            if ($scope.article.Mapping == null || $scope.article.Mapping == undefined) {
                $scope.article.Mapping = {};
            }

            if ($scope.article.Mapping[provider] == null || $scope.article.Mapping[provider] == undefined) {

                $scope.article.Mapping[provider] = {};
            }

            if ($scope.article.Mapping[provider] != null) {

                //If value is present it will be overwritten....
                Object.keys($scope.article.Mapping[provider]).forEach(function (key) {

                    console.log(key, $scope.article.Mapping[provider][key]);
                });
            }


            if (addToArray) {
                //var property = { Name: $scope.mappingproperty.Name, Value: $scope.mappingproperty.Value };

                //$scope.article.Mapping[provider].push(property);

                var dicttoadd = {};

                if ($scope.article.Mapping[provider] != null && $scope.article.Mapping[provider] != undefined)
                    dicttoadd = $scope.article.Mapping[provider];

                dicttoadd[$scope.mappingproperty.Name] = $scope.mappingproperty.Value;

                $scope.article.Mapping[provider] = dicttoadd;

                console.log($scope.article.Mapping);

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

                delete $scope.article.Mapping[provider];
            }
        }
        else {

            delete $scope.article.Mapping[provider][mapping];

            //$.each($scope.common.Mapping[provider], function (i) {
            //    if ($scope.common.Mapping[provider][i].Name === mapping) {
            //        $scope.common.Mapping[provider].splice(i, 1);
            //        return false;
            //    }
            //});
        }
    }

};

var isDate = function (date) {
    return (new Date(date) !== "Invalid Date") && !isNaN(new Date(date));
}

//Modal Slideshow Controller
var InfoModalInstanceCtrl = function ($scope, $modalInstance, $http) {

    $scope.cancelslidemodal = function () {        
        $modalInstance.dismiss('cancel');
    };

    $scope.myInterval = 5000;
    $scope.slides = $scope.article.ImageGallery;
    //$http({
    //    method: 'Get',
    //    url: '/api/Images/Huette/' + $scope.huette.Id
    //}).success(function (data, status, headers, config) {
    //    $scope.slides = data;
    //}).error(function (data, status, headers, config) {
    //    $scope.message = 'Unexpected Error';
    //});
}

//var articletypeaheadcontroller = app.controller('ArticleNameTypeAheadController', function ($scope, $http) {
    
//    $scope.articlenametypeaheadselected = false;

//    $scope.getArticleNameList = function (lang, articletype, smgtagfilter, active, smgactive, datumvonfilter, datumbisfilter) {

//        $http({
//            method: 'Get',
//            url: $scope.basePath + '/v1/ArticleReduced?language=' + lang + '&articletype=' + articletype + '&active=' + active + '&odhactive=' + smgactive + '&odhtagfilter=' + smgtagfilter + datumvonfilter + datumbisfilter
//        }).success(function (data) {
//            $scope.items = data;
//        });
//    }   

//    $scope.getArticleNameList($scope.lang, $scope.articletype, $scope.smgtagfilter, $scope.active, $scope.smgactive, $scope.datumvonfilter, $scope.datumbisfilter);

//    $scope.$on('LoadArticleNamesList', function (e) {
//        //alert("onkemmen");
//        $scope.getArticleNameList($scope.lang, $scope.articletype, $scope.smgtagfilter, $scope.active, $scope.smgactive);
//    });

//    $scope.onItemSelected = function () {
//        $scope.articlenametypeaheadselected = true;
//    }
//});

var smgtagtypeaheadcontroller = app.controller('SmgTagNameTypeAheadController', function ($scope, $http) {

    $scope.articlenametypeaheadselected = false;

    $scope.getSmgTagNameList = function (lang) {

        $http({
            method: 'Get',
            url: $scope.basePath + '/v1/ODHTagReduced?localizationlanguage=' + lang + '&validforentity=Article,' + $scope.articletype
        }).success(function (data) {
            $scope.items = data;

            //Setting manual tagging for newsfeed
            if ($scope.$parent.articletype == 'newsfeednoi')
                $scope.items.push({ Id: "important", Name: "important" });

        });
    }

    $scope.getSmgTagNameList($scope.lang);

    $scope.onItemSelected = function () {
        $scope.articlenametypeaheadselected = true;
    }
});

var smgtagmodaltypeaheadcontroller = app.controller('SmgTagNameModalTypeAheadController', function ($scope, $http) {

    $scope.smgtagselected = false;

    $scope.getSmgTagNameListModal = function (lang) {

        $http({
            method: 'Get',
            url: $scope.basePath + '/v1/ODHTagReduced?localizationlanguage=' + lang + '&validforentity=Article,' + $scope.articletype
        }).success(function (data) {
            $scope.items = data;

            //Setting manual tagging for newsfeed
            if ($scope.$parent.articletype == 'newsfeednoi')
                $scope.items.push({ Id: "important", Name : "important" });
        });
    }

    $scope.getSmgTagNameListModal($scope.lang);

    $scope.onItemSelected = function () {
        $scope.smgtagselected = true;
    }
});

//Directive Typeahead
app.directive('typeaheadarticle', function ($timeout) {
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

//Fileupload Test
app.controller('FileUploadController', ['$scope', 'FileUploader', function ($scope, FileUploader) {

    var uploader = $scope.uploader = new FileUploader({
        url: $scope.basePath + '/v1/FileUpload',
        headers: { Authorization: "Bearer " + localStorage.getItem("accessToken") }
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

        var r = new RegExp('"', 'g');
        var imageurl = response.replace(r, '');
        //Filename
        var imagename = imageurl.substring(imageurl.lastIndexOf('/') + 1);

        var counter = 0;

        if ($scope.article.ImageGallery == null) {
            $scope.article.ImageGallery = [];
        }
        else {
            counter = $scope.article.ImageGallery.length;
        }

        var UploadedImage = { ImageName: imagename, ImageUrl: imageurl, Width: 0, Height: 0, ImageSource: 'NOI', ImageTitle: { de: '', it: '', en: '' }, ImageDesc: { de: '', it: '', en: '' }, ListPosition: counter, License: "CC0", IsInGallery: true }

        $scope.article.ImageGallery.push(UploadedImage);

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

    console.info('uploader', uploader);
}]);

//Fileupload Test
app.controller('FileUploadControllerSingle', ['$scope', 'FileUploader', function ($scope, FileUploader) {

    $scope.oldimageurl = "";

    $scope.init = function (oldimageurl) {
        $scope.oldimageurl = oldimageurl;
    }

    var uploader = $scope.uploader = new FileUploader({
        url: $scope.basePath + '/v1/FileUpload',
        headers: { Authorization: "Bearer " + localStorage.getItem("accessToken") }
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

        var currentimagescount = $scope.article.ImageGallery.length;

        var r = new RegExp('"', 'g');
        var imageurl = response.replace(r, '');
        //Filename
        var imagename = imageurl.substring(imageurl.lastIndexOf('/') + 1);

        alert('changed Image: ' + imageurl);

        var UploadedImage = { ImageName: '', ImageUrl: imageurl, Width: 0, Height: 0, ImageSource: 'NOI', ImageTitle: { de: '', it: '', en: '', nl: '', cs: '', pl: '' }, ListPosition: currentimagescount++, License: "CC0", IsInGallery: true }

        $.each($scope.article.ImageGallery, function (i) {
            if ($scope.article.ImageGallery[i].ImageUrl === $scope.oldimageurl) {

                $scope.article.ImageGallery[i].ImageUrl = imageurl;
                $scope.article.ImageGallery[i].ImageName = imagename;

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

app.filter('moment', function () {
    return function (dateString, format) {
        return moment(dateString).format(format);
    };
});

//DatePicker controller
var DatepickerCtrl = function ($scope) {

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