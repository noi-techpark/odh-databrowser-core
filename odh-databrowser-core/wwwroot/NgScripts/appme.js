var app = angular.module('meAngularApp', ['appconfig']);


app.controller('meController', [
    '$scope', '$http', 'appconfig',
    function ($scope, $http) {

        $http({ method: 'GET', url: '/api/me' }).then(function (success) {
            console.log(success);
            $scope.username = success.data.username;
        },
        function (error) {
            console.log(error);
        });


        //des geat
        //$http.get('/api/me').success(function (result) {
            
        //});

    }]);