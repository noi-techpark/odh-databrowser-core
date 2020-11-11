// Module specific configuration
var appconfig = angular.module('appconfig', ['appfactory', 'ngRoute'])

appconfig.value('appconfig', {
      basePath: '' // Set your base path here
  });

appconfig.config(function ($httpProvider) {
    $httpProvider.interceptors.push('authInterceptorService');
});