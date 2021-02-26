// Path Config Constants
var pathconfig = angular.module('pathconfig', [])
    .constant('apipath', 'https://localhost:5001')
    //.constant('apipath', 'https://api.tourism.testingmachine.eu')
    //.constant('apipath', 'https://tourism.api.opendatahub.bz.it')
    //.constant('authserverpath', 'https://auth.opendatahub.bz.it/auth/realms/noi/protocol/openid-connect/auth?client_id=odh-frontend-core&response_type=token&redirect_uri=');
    .constant('authserverpath', 'https://auth.opendatahub.testingmachine.eu/auth/realms/noi/protocol/openid-connect/auth?client_id=odh-frontend-core&response_type=token&redirect_uri=');



