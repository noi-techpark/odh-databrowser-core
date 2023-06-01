// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

// Module specific configuration
var appconfig = angular.module('appconfig', ['appfactory', 'ngRoute', 'pathconfig','angular-jwt'])
  
appconfig.value('appconfig', {
  });

appconfig.config(function ($httpProvider) {
    $httpProvider.interceptors.push('authInterceptorService');
});

