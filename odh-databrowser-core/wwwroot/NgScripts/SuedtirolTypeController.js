// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

var app = angular.module('suedtiroltype', ['ui.bootstrap', 'appconfig', 'pathconfig']);

app.controller('suedtiroltypeListController', [
    '$scope', '$http', '$modal', 'appconfig', 'apipath',
    function ($scope, $http, $modal, appconfig, apipath) {

        $scope.basePath = apipath;

        $scope.lang = 'de';
        $scope.suedtiroltypes = [];

        $scope.init = function () {

            $scope.getSuedtirolTypes();
        };

        $scope.editSuedtiroltype = function (suedtiroltype) {

            if (suedtiroltype === 'new') {

                $scope.newsuedtiroltype = true;
                $scope.suedtiroltype = { Id: '', Shortname: '' };
            }
            else {
                $scope.newsuedtiroltype = false;
                $scope.suedtiroltype = suedtiroltype;
            }

            var modalInstance = $modal.open({
                templateUrl: 'SuedtirolTypeCrudModal.html',
                controller: CrudModalInstanceCtrl,
                scope: $scope,
                size: 'lg',
                backdrop: 'static'
            });
        };

        $scope.deleteSuedtiroltype = function (id) {

            //var deleteconfirm = confirm('Are you absolutely sure you want to delete?');

            //if (deleteconfirm) {
            //    $http.delete($scope.basePath + '/v1/' + commontype + '/' + id).success(function (result) {
            //        alert(commontype + " deleted!");

            //        $.each($scope.suedtiroltypes, function (i) {
            //            if ($scope.suedtiroltypes[i].Id === id) {
            //                $scope.suedtiroltypes.splice(i, 1);
            //                return false;
            //            }
            //        });
            //    }).error(function (data) {
            //        alert("ERROR:" + data);
            //    });
            //}           
        };               

        //Get Request
        $scope.getSuedtirolTypes = function () {
            $scope.isloading = true;

            $http.get($scope.basePath + '/v1/SuedtirolType').success(function (result) {

                $scope.suedtiroltypes = result;

                $scope.isloading = false;
            });
        }
                            
    }]);

//Modal Edit & New controller
var CrudModalInstanceCtrl = function ($scope, $modalInstance, $http) {

    $scope.ok = function () {
        //SAVEN
    };

    $scope.cancelCrudModal = function () {
        $modalInstance.dismiss('cancel');
    };

    //$scope.addCrud = function (common, isvalid) {
    //    if (isvalid) {

    //        $http.post($scope.basePath + '/v1/Common/' + $scope.commontype, common).success(function (result) {
    //            alert($scope.commontype + " added!");
    //            $scope.activities.push(activity);

    //            $modalInstance.close();
    //        });
    //    }
    //    else {
    //        alert("Invalid Data!");
    //    }
    //};

    //$scope.updateCrud = function (common, isvalid) {
    //    if (isvalid) {
    //        $http.put($scope.basePath + '/v1/Common/' + $scope.commontype + '/' + common.Id, common).success(function (result) {
    //            alert($scope.commontype + " updated!");
    //            $modalInstance.close();
    //        });
    //    }
    //    else {
    //        alert("Invalid Data!");
    //    }
    //};     
}

