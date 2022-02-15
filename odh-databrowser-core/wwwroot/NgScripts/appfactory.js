var appfactory = angular.module('appfactory', ['pathconfig', 'angular-jwt']);

appfactory.factory('authInterceptorService', ['$q', '$location', 'authserverpath', 'jwtHelper', function ($q, $location, authserverpath, jwtHelper) {

    //using jwt lib https://github.com/auth0/angular-jwt

    var authInterceptorServiceFactory = {};

    var _request = function (config) {

        //config.headers = config.headers || {};

        //console.log("is user authorized: " + userAuthorized)

        //Add the header only when user is authorized
        if (userAuthorized) {

            var token = localStorage.getItem("accessToken");

            if (token) {
                var istokenexpired = jwtHelper.isTokenExpired(token);
                var expdate = jwtHelper.getTokenExpirationDate(token);

                //console.log("The token is " + token + " expired: " + istokenexpired + " valid until " + expdate);

                if (istokenexpired) {
                    //console.log("token expired remove token");
                    localStorage.removeItem("accessToken");

                    getMyToken(authserverpath, function (mytoken) {
                        console.log("getting NEW token while Expired");
                        token = mytoken;
                        console.log(token);                        
                    });
                }

                //console.log("adding token to header");                                

                config.headers.Authorization = 'Bearer ' + token;
            }
            else {
                getMyToken(authserverpath, function (mytoken) {
                    //console.log("getting NEW token NO Token");
                    //console.log("adding token to header");
                    config.headers.Authorization = 'Bearer ' + mytoken;
                });
            }          
        }

        return config;
    }

    var _responseError = function (rejection) {
        if (rejection.status === 401) {
            //$location.path('/Account/Login');

            removeAccessToken();
            console.log("Request rejected");         
        }
        
        return $q.reject(rejection);
    }

    authInterceptorServiceFactory.request = _request;
    authInterceptorServiceFactory.responseError = _responseError;

    return authInterceptorServiceFactory;
}]);


function getMyToken(authserverpath, callback) {
    var fragment = getFragment();

    if (fragment.access_token) {

        //console.log(fragment);
        //console.log(fragment.access_token);

        // returning with access token, restore old hash, or at least hide token
        window.location.hash = fragment.state || '';
        
        setAccessToken(fragment.access_token, function () {

            callback(fragment.access_token);
        });
       
    }
    else {       
        window.location = authserverpath + encodeURIComponent(window.location);
    }
};

function setAccessToken(accessToken, callback) {
    localStorage.setItem("accessToken", accessToken);

    callback();
};

function removeAccessToken() {
    localStorage.removeItem("accessToken");

    //console.log("token set: " + accessToken);
};

function getAccessToken() {
    return localStorage.getItem("accessToken");
};

function getFragment() {
    if (window.location.hash.indexOf("#") === 0) {       
        return parseQueryString(window.location.hash.substr(2));  
    } else {
        return {};
    }
};

appfactory.factory('leafletmapsimple', ['leafletData', function (leafletData) {

    var mylatitude = 46.655781;
    var mylongitude = 11.4296877;
    var zoom = 16;

    return {

        preparemap: function (gps, gpstrack, pointstoparse, controllername) {

            var gpx = null;
            var gpspoints = [];

            var scope = angular.element('[ng-controller=' + controllername + ']').scope();


            var addstartmarker = false;
            var addgpxroute = false;


            if (gps != undefined) {

                $.each(gps, function (i) {
                    if (contains(pointstoparse, gps[i].Gpstype)) {

                        mylatitude = gps[i].Latitude;
                        mylongitude = gps[i].Longitude;

                        gpspoints.push(gps[i]);

                        addstartmarker = true;
                    }
                });

            }

            if (gpstrack != null && gpstrack != '') {

                var gpsid = '';
                var gpstrackurl = '';
                var source = '';

                var requesturl = '';

                $.each(gpstrack, function (i) {

                    if (gpstrack[i].Type == 'detailed') {

                        addgpxroute = true;

                        gpstrackid = gpstrack[i].Id;

                        if (gpstrack[i].GpxTrackUrl.startsWith('https://lcs.lts.it/downloads/gpx/')) {
                            source = 'lts';
                            gpstrackurl = gpstrack[i].GpxTrackUrl.replace('https://lcs.lts.it/downloads/gpx/', '');

                            gpx = "/api/Activity/Gpx/" + encodeURI(gpstrackurl);
                        }
                        else if (gpstrack[i].GpxTrackUrl.startsWith('http://lcs.tourist.bz.it/downloads/gpx/')) {
                            source = 'lts';
                            gpstrackurl = gpstrack[i].GpxTrackUrl.replace('http://lcs.tourist.bz.it/downloads/gpx/', '');

                            gpx = "/api/Activity/Gpx/" + encodeURI(gpstrackurl);
                        }
                        else if (gpstrack[i].GpxTrackUrl.startsWith('http://service.suedtirol.info/Gpx/')) {
                            source = 'smg';
                            gpstrackurl = gpstrack[i].GpxTrackUrl.replace('http://service.suedtirol.info/Gpx/', '');

                            gpx = "/api/SmgPoiGpx/" + gpstrackid;
                        }

                        console.log("gpstrack found " + gpx);

                    }
                });
            }

            console.log("centering to " + mylatitude + " " + mylongitude);

            angular.extend(scope, {
                leafletcoords: {
                    lat: mylatitude,
                    lng: mylongitude,
                    zoom: zoom
                }
            });

            L.Icon.Default.imagePath = '../css/images/';

            leafletData.getMap().then(function (map) {

                $.each(gpspoints, function (i) {
                    L.marker([gpspoints[i].Latitude, gpspoints[i].Longitude]).addTo(map)
                    .bindPopup(gpspoints[i].Gpstype)
                    .openPopup();
                });

                if (gpx != null && addgpxroute) {

                    console.log("getting gps from " + gpx);

                    new L.GPX(gpx, {
                        async: true,
                        gpx_options: { parseElements: 'track' },
                        marker_options: {
                            startIconUrl: '../css/images/pin-icon-start.png',
                            endIconUrl: '../css/images/pin-icon-end.png',
                            shadowUrl: '../css/images/pin-shadow.png'
                        }
                    }).on('loaded', function (e) {
                        map.fitBounds(e.target.getBounds());
                    }).addTo(map);
                }
            });
        }
    }
}]);

function contains(a, obj) {
    for (var i = 0; i < a.length; i++) {
        if (a[i] === obj) {
            return true;
        }
    }
    return false;
}

function parseQueryString(queryString) {

    //console.log(queryString);

    var data = {},
        pairs, pair, separatorIndex, escapedKey, escapedValue, key, value;

    if (queryString === null) {
        return data;
    }

    pairs = queryString.split("&");

    for (var i = 0; i < pairs.length; i++) {
        pair = pairs[i];
        separatorIndex = pair.indexOf("=");

        if (separatorIndex === -1) {
            escapedKey = pair;
            escapedValue = null;
        } else {
            escapedKey = pair.substr(0, separatorIndex);
            escapedValue = pair.substr(separatorIndex + 1);
        }

        key = decodeURIComponent(escapedKey);
        value = decodeURIComponent(escapedValue);

        data[key] = value;
    }

    return data;
}

appfactory.factory('languageFactory', function() {
    
    var languageservice = {};

    languageservice.setLanguage = function (lang, backtobrowserlanguage) {        

        return setLanguageLocalBrowser(lang, backtobrowserlanguage);        
    }

    languageservice.getLanguage = function () {
        return getLanguageLocalBrowser();
    }

    return languageservice;
});

function getLanguageLocalBrowser() {

    var currentlang = localStorage.getItem("Language");

    if (currentlang == null) {

        var browserlang = navigator.languages ? navigator.languages[0] : (navigator.language || navigator.userLanguage)

        console.log(browserlang);

        currentlang = browserlang.substring(0, 2);
    }
    
    return currentlang;
};

function setLanguageLocalBrowser(lang, backtobrowserlanguage) {
   
    localStorage.setItem("Language", lang);

    if (backtobrowserlanguage) {

        var browserlang = navigator.languages ? navigator.languages[0] : (navigator.language || navigator.userLanguage)

        console.log(browserlang);

        var browserlang = browserlang.substring(0, 2);

        localStorage.setItem("Language", browserlang);
    }    

    return localStorage.getItem("Language");
}

