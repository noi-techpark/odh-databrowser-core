// Module specific configuration
var appconfig = angular.module('appconfig', ['appfactory', 'ngRoute', 'pathconfig','angular-jwt'])
  
appconfig.value('appconfig', {

    //basePath: pathconfig.apipath,
     //basePath: 'https://api.tourism.testingmachine.eu', // odh-api-core on testingmachine
     //basePath: 'https://localhost:5001', // Local odh-api-core URL
     //basePath: 'https://localhost:44322', // Local odh-api-mongo-core URL
     //basePath: 'https://tourism.api.opendatahub.bz.it', // odh-api-core on production

    //authserverpath: 'https://auth.opendatahub.bz.it/auth/realms/noi/protocol/openid-connect/auth?client_id=odh-frontend-core&response_type=token&redirect_uri='
    //authserverpath: 'https://auth.opendatahub.testingmachine.eu/auth/realms/noi/protocol/openid-connect/auth?client_id=odh-frontend-core&response_type=token&redirect_uri='

  });

appconfig.config(function ($httpProvider) {
    $httpProvider.interceptors.push('authInterceptorService');
});

