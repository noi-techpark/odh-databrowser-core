// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

// Path Config Constants
var pathconfig = angular.module('pathconfig', [])
    .constant('apipath', 'https://tourism.api.opendatahub.com')
    .constant('authserverpath', 'https://auth.opendatahub.com/auth/realms/noi/protocol/openid-connect/auth?client_id=odh-frontend-core&response_type=token&redirect_uri=');
    



