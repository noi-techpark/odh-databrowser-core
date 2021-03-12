// Path Config Constants
var pathconfig = angular.module('pathconfig', [])
    .constant('apipath', 'https://localhost:5001')
    .constant('authserverpath', 'https://auth.opendatahub.testingmachine.eu/auth/realms/noi/protocol/openid-connect/auth?client_id=odh-frontend-core&response_type=token&redirect_uri=');



