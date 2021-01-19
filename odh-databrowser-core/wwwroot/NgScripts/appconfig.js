// Module specific configuration
var appconfig = angular.module('appconfig', ['appfactory', 'ngRoute'])

appconfig.value('appconfig', {
    //basePath: 'https://api.tourism.testingmachine.eu' // odh-api-core on testingmachine
    //basePath: 'https://localhost:5001' // Local odh-api-core URL
    //basePath: 'https://localhost:44322' // Local odh-api-mongo-core URL
    basePath: 'https://tourism.api.opendatahub.bz.it' // odh-api-core on production
  });

appconfig.config(function ($httpProvider) {
    $httpProvider.interceptors.push('authInterceptorService');
});
