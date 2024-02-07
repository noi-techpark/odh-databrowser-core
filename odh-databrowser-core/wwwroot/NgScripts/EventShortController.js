// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

var app = angular.module('eventshort', ['ui.bootstrap', 'ngSanitize', 'appconfig', 'textAngular', 'angularFileUpload', 'pathconfig']);

app.controller('eventshortListController', [
    '$scope', '$http', '$modal', 'appconfig', 'apipath',
    function ($scope, $http, $modal, config, apipath) {

        $scope.virtualvillagemanager = false;
        $scope.publishchannelfilter = '';

        $scope.basePath = apipath;
		$scope.lang = 'de';

		$scope.init = function (virtualvillagemanager) {

            console.log("Virtualvillagemanager: " + virtualvillagemanager);            
          
            if(virtualvillagemanager != 'False') {
               $scope.virtualvillagemanager = true;
               $scope.eventlocation = 'VV';               
            }                

            $scope.changePage(0);

            console.log("eventlocation =" + $scope.eventlocation);
		};

		$scope.editeventshort = function (eventshort, operation) {

			if (eventshort === 'new') {

				var eventstartonlydate = new Date();
				var eventendonlydate = new Date();
				var eventstartonlytime = "";
                var eventendonlytime = "";

                var eventlocationstring = "NOI";
                if ($scope.virtualvillagemanager)
                    eventlocationstring = 'VV';

                $scope.neweventshort = true;
                $scope.eventshort = {
                    Id: '', Source: 'Content', Self: '', _Meta: { Id: '', Type: 'eventshort', Source: 'noi', Reduced: false, LicenseInfo: { Author: "", ClosedData: false, License: "CC0", LicenseHolder: "https://noi.bz.it" } },
                    Shortname: '', eventstartonlydate: eventstartonlydate, eventendonlydate: eventendonlydate, eventstartonlytime: eventstartonlytime, eventendonlytime: eventendonlytime,
                    ActiveToday: false, hasmoreRooms: false, EventLocation: eventlocationstring,
                    LicenseInfo: { Author: "", ClosedData: false, License: "CC0", LicenseHolder: "https://noi.bz.it" }
                };

			}
			else {

				var startdate = new Date(eventshort.StartDate);
				var enddate = new Date(eventshort.EndDate);

				eventshort.eventstartonlydate = startdate;
				eventshort.eventendonlydate = enddate;
				eventshort.eventstartonlytime = addZero(startdate.getHours()) + ":" + addZero(startdate.getMinutes());
				eventshort.eventendonlytime = addZero(enddate.getHours()) + ":" + addZero(enddate.getMinutes());

				//if (eventshort.Display1 == "Y")
				//	eventshort.isActive = true;
				//else
				//	eventshort.isActive = false;

				eventshort.hasmoreRooms = true;

				$scope.neweventshort = false;
                $scope.eventshort = eventshort;

                if (operation && operation == "copy") {
                    $scope.neweventshort = true;
                    $scope.eventshort.Id = '';

                    //Check if there are more rooms if not cut them off and disable room management
                    if ($scope.eventshort.RoomBooked.length == 1) {
                        eventshort.hasmoreRooms = false;
                        $scope.eventshort.RoomBooked = [];
                    }
                }

			}

			var modalInstance = $modal.open({
				templateUrl: 'EventShortCRUDModal',
				controller: EventShortModalInstanceCtrl,
				scope: $scope,
				size: 'lg',
				//windowClass: 'lg',
				backdrop: 'static'
			});
		};

		$scope.deleteeventshort = function (eventshort) {

            if (eventshort.Source != "EBMS") {

                if ($scope.virtualvillagemanager && eventshort.EventLocation != "VV") {
                    alert("User can only insert Virtual Village Events");
                }
                else {
                    var deleteconfirm = confirm('Are you absolutely sure you want to delete?');

                    if (deleteconfirm) {
                        $http.delete($scope.basePath + '/v1/EventShort/' + eventshort.Id).success(function (result) {
                            alert("Event deleted!");

                            $scope.applyFilter($scope.page);

                        }).error(function (data) {
                            alert("ERROR:" + data);
                        });
                    }
                }
			}
		};		

		$scope.page = 1;
		$scope.totalpages = 0;
		$scope.totalcount = 0;
		$scope.filtered = true;

		//Name
		$scope.SelectedEventName = '';
		$scope.SelectedEventId = '';


		$scope.Datumvon = new Date();
		$scope.Datumbis = '';

		$scope.datumvonfilter = '';
		$scope.datumbisfilter = '';

		$scope.datumformat = '';
		$scope.eventidfilter = '';
		$scope.source = '';
		$scope.sourcefilter = '';
		$scope.eventlocation = '';
		$scope.eventlocationfilter = '';
		$scope.onlyactive = '';
        $scope.onlyactivefilter = '';
        $scope.onlywebsiteactive = '';
        $scope.onlywebsiteactivefilter = '';
        $scope.onlycommunityactive = '';
        $scope.onlycommunityactivefilter = '';

		$scope.queryfilter = '';

		//Filter anwenden
        $scope.applyFilter = function (page, withoutrefresh) {

			$scope.isloading = true;
			$scope.filtered = true;
			$scope.page = page;

			setFilters();

			$http.get($scope.basePath + '/v1/EventShort?pagenumber=' + page + '&pagesize=' + '20' + $scope.queryfilter).success(function (result) {
				$scope.eventsshort = result.Items;
				$scope.totalpages = result.TotalPages;
				$scope.totalcount = result.TotalResults;
				$scope.isloading = false;
			});

            if (withoutrefresh != true)
                $scope.$broadcast('LoadEventNamesList');
		}

		//Filter Löschen
		$scope.clearFilter = function () {

			$scope.eventidfilter = '';
			$scope.source = '';
			$scope.sourcefilter = '';
            $scope.eventlocation = '';

            if ($scope.virtualvillagemanager) {                 
                $scope.eventlocation = 'VV';
            }  

			$scope.eventlocationfilter = '';
			$scope.onlyactive = '';
			$scope.onlyactivefilter = '';
            $scope.onlywebsiteactive = '';
            $scope.onlywebsiteactivefilter = '';
            $scope.onlycommunityactive = '';
            $scope.onlycommunityactivefilter = '';

			$scope.queryfilter = '';

			$scope.SelectedEventName = '';
			$scope.SelectedEventId = '';
			$scope.Datumvon = new Date();
			$scope.Datumbis = '';
			$scope.datumvonfilter = '';
            $scope.datumbisfilter = '';
            $scope.publishchannelfilter = '';


			$scope.filtered = true;
			$scope.page = 1;
			$scope.changePage(0);

			//$scope.$broadcast('LoadEventNamesList');
		}

		function setFilters() {

			if ($scope.SelectedEventId != '')
				$scope.eventidfilter = "&eventids=" + $scope.SelectedEventId;
			else
				$scope.eventidfilter = '';

			if ($scope.onlyactive != '')
				$scope.onlyactivefilter = "&onlyactive=" + $scope.onlyactive;
			else
                $scope.onlyactivefilter = '';

            if ($scope.onlywebsiteactive != '')
                $scope.onlywebsiteactivefilter = "&websiteactive=" + $scope.onlywebsiteactive;
            else
                $scope.onlywebsiteactive = '';

            if ($scope.onlycommunityactive != '')
                $scope.onlycommunityactivefilter = "&communityactive=" + $scope.onlycommunityactive;
            else
                $scope.onlycommunityactivefilter = '';

			if ($scope.source != '')
				$scope.sourcefilter = "&source=" + $scope.source;
			else
				$scope.sourcefilter = '';

			if ($scope.eventlocation != '')
				$scope.eventlocationfilter = "&eventlocation=" + $scope.eventlocation;
			else
				$scope.eventlocationfilter = '';

			//DATE Gschicht
			$scope.datumvonfilter = '';
			$scope.datumbisfilter = '';

			if ($scope.Datumvon != '' && $scope.Datumvon != undefined) {

				var arrivalday = $scope.Datumvon.getDate();
				var arrivalmonth = parseInt($scope.Datumvon.getMonth()) + 1; //Months are zero based            
				var arrivalyear = $scope.Datumvon.getFullYear();

				$scope.datumvonfilter = "&startdate=" + arrivalyear + "-" + arrivalmonth + "-" + arrivalday;
			}
			else {
				$scope.datumvonfilter = '';
			}

			if ($scope.Datumbis != '' && $scope.Datumbis != undefined) {

				var arrivalday2 = $scope.Datumbis.getDate();
				var arrivalmonth2 = parseInt($scope.Datumbis.getMonth()) + 1; //Months are zero based            
				var arrivalyear2 = $scope.Datumbis.getFullYear();

				$scope.datumbisfilter = "&enddate=" + arrivalyear2 + "-" + arrivalmonth2 + "-" + arrivalday2;
			}
			else {
				$scope.datumbisfilter = '';
            }

            if ($scope.publishchannelfilter != '')
                $scope.publishchannelfilterfilter = "&publishedon=" + $scope.publishchannelfilter;
            else
                $scope.publishchannelfilterfilter = '';

			console.log("eventidfilter:" + $scope.eventidfilter + " onlyactivefilter:" + $scope.onlyactivefilter + " sourcefilter:" + $scope.sourcefilter + " eventlocationfilter: " + $scope.eventlocationfilter + " datumvon:" + $scope.datumvonfilter + " datumbis:" + $scope.datumbisfilter)

            $scope.queryfilter = $scope.eventidfilter + $scope.onlyactivefilter + $scope.onlywebsiteactivefilter + $scope.onlycommunityactivefilter + $scope.sourcefilter + $scope.eventlocationfilter + $scope.datumvonfilter + $scope.datumbisfilter + $scope.publishchannelfilterfilter;
		}

		//Seite Wechseln
        $scope.changePage = function (pageskip, withoutrefresh) {

			$scope.page = $scope.page + pageskip;
			$scope.isloading = true;

            $scope.applyFilter($scope.page, withoutrefresh);
		}

		//Modal anzeigen
		$scope.showInfoModal = function (eventshort, lang) {

            $scope.eventshort = eventshort;
            $scope.lang = lang;

			var slidemodalInstance = $modal.open({
                templateUrl: 'EventShortInfoModal',
				controller: InfoModalInstanceCtrl,
				scope: $scope,
				size: 'lg'
			});
		};

		$scope.eventsshort = [];
	}]);

function addZero(i) {
	if (i < 10) {
		i = "0" + i;
	}
	return i;
}

//Modal Controller
var EventShortModalInstanceCtrl = function ($scope, $modalInstance, $http) {

    $scope.mappingproperty = {};

    $scope.eventdocument = { hasde: true, hasit: true, hasen: true };

	if ($scope.eventshort.Source == 'Content') {

        var roomloc = $scope.eventlocation;
        if (roomloc == "NOI")
            roomloc = "NO";

        $scope.newroom = { roomstartonlydate: new Date(), roomstartonlytime: "", roomendonlydate: new Date(), roomendonlytime: "", SpaceDesc: "", SpaceAbbrev: "", SpaceType: roomloc };

	}

	$scope.ok = function () {
		$modalInstance.dismiss('cancel');
	};

	$scope.cancel = function () {
		$modalInstance.dismiss('cancel');
	};

	$scope.addeventshort = function (eventshort, isvalid, errors) {
        
        console.log(isvalid);
        console.log(errors);
                    
		if (isvalid) {

            if (eventshort.Source == "Content") {

                console.log(eventshort.EventLocation);

                if ($scope.virtualvillagemanager && eventshort.EventLocation != "VV") {
                    alert("User can only insert Virtual Village Events");
                }
                else {

                    eventshort.StartDate = eventshort.eventstartonlydate.getFullYear() + "/" + parseInt(eventshort.eventstartonlydate.getMonth() + 1) + "/" + eventshort.eventstartonlydate.getDate() + " " + eventshort.eventstartonlytime;
                    eventshort.EndDate = eventshort.eventendonlydate.getFullYear() + "/" + parseInt(eventshort.eventendonlydate.getMonth() + 1) + "/" + eventshort.eventendonlydate.getDate() + " " + eventshort.eventendonlytime;

                    //if (eventshort.isActive)
                    //    eventshort.Display1 = "Y";
                    //else
                    //    eventshort.Display1 = "N";

                    eventshort.Shortname = eventshort.EventTitle['de'];

                    //console.log(eventshort.StartDate);
                    //console.log(eventshort.EndDate);

                    $http.post($scope.basePath + '/v1/EventShort', eventshort).success(function (result) {
                        alert("Event added!");
                        $scope.eventsshort.push(eventshort);

                        $modalInstance.close();

                        $scope.$parent.applyFilter($scope.page);
                    });
                }
            }		
		}
        else {            
			alert("Invalid Data! Check required Fields");
		}
	};

	$scope.updateeventshort = function (eventshort, isvalid) {

		if (isvalid) {

            if ($scope.virtualvillagemanager && eventshort.EventLocation != "VV") {
                alert("User can only insert Virtual Village Events");
            }
            else {

                //Start Date richtig setzen
                eventshort.StartDate = eventshort.eventstartonlydate.getFullYear() + "/" + parseInt(eventshort.eventstartonlydate.getMonth() + 1) + "/" + eventshort.eventstartonlydate.getDate() + " " + eventshort.eventstartonlytime;
                eventshort.EndDate = eventshort.eventendonlydate.getFullYear() + "/" + parseInt(eventshort.eventendonlydate.getMonth() + 1) + "/" + eventshort.eventendonlydate.getDate() + " " + eventshort.eventendonlytime;

                eventshort.Shortname = eventshort.EventTitle['de'];

                //if (eventshort.isActive)
                //    eventshort.Display1 = "Y";
                //else
                //    eventshort.Display1 = "N";

                $http.put($scope.basePath + '/v1/EventShort/' + eventshort.Id, eventshort).success(function (result) {
                    alert("Event updated!");
                    $modalInstance.close();

                    $scope.$parent.applyFilter($scope.page);
                });
            }
		}
		else {
			alert("Invalid Data!");
		}
	};

	$scope.updateeventdate = function (setteddate) {

		//console.log(setteddate);
		$scope.eventshort.eventendonlydate = setteddate;

		$scope.newroom.roomstartonlydate = setteddate;
		$scope.newroom.roomendonlydate = setteddate;
	}

	$scope.updateroomdate = function (setteddate) {

		//console.log(setteddate);
		$scope.newroom.roomendonlydate = setteddate;
	}

	$scope.addroom = function (room) {

		var roomtoadd = {};

		roomtoadd.StartDate = room.roomstartonlydate.getFullYear() + "/" + parseInt(room.roomstartonlydate.getMonth() + 1) + "/" + room.roomstartonlydate.getDate() + " " + room.roomstartonlytime;
		roomtoadd.EndDate = room.roomendonlydate.getFullYear() + "/" + parseInt(room.roomendonlydate.getMonth() + 1) + "/" + room.roomendonlydate.getDate() + " " + room.roomendonlytime;

		roomtoadd.SpaceDesc = room.SpaceDesc;
		roomtoadd.SpaceAbbrev = room.SpaceDesc;
		roomtoadd.SpaceType = room.SpaceType;
		roomtoadd.Space = room.Space;
		roomtoadd.Subtitle = room.Subtitle;
		roomtoadd.Comment = "";

		$scope.eventshort.RoomBooked

		if (room != "" && room != undefined) {


			if ($scope.eventshort.RoomBooked == null) {
				$scope.eventshort.RoomBooked = [];
			}

			$scope.eventshort.RoomBooked.push(roomtoadd);

		}
		else {
			alert('Invalid Room Info!');
		}

	};

	$scope.deleteroom = function (room) {
		$.each($scope.eventshort.RoomBooked, function (i) {
			if ($scope.eventshort.RoomBooked[i] === room) {
				$scope.eventshort.RoomBooked.splice(i, 1);
				return false;
			}
		});
    };
    
    //TODO DELETE image on source
    $scope.deletebild = function (bildurl) {

            ////Querystring parameter holen
            //var parameter = getQueryVariable(bildurl, "src");
            ////Ersetz a poor kloanigkeiten
            //var mybildurl = parameter.replace('.', '$');

            //var find = '/';
            //var re = new RegExp(find, 'g');
            //var escapeduri = mybildurl.replace(re, '|');

            //var deletepath = encodeURI($scope.basePath + '/v1/FileDelete/' + escapeduri);
            //alert("Delete Image" + deletepath);

            //$http.delete(deletepath).success(function (result) {
                
                $.each($scope.eventshort.ImageGallery, function (i) {
                    if ($scope.eventshort.ImageGallery[i].ImageUrl === bildurl) {
                        $scope.eventshort.ImageGallery.splice(i, 1);
                        return false;
                    }
                });
            //});       
    };

    //Add Technology Field
    $scope.addtechnologyfield = function (tag) {
       
        var addToArray = true;
            
        if ($scope.eventshort.TechnologyFields != null) {

            $.each($scope.eventshort.TechnologyFields, function (i) {

                if ($scope.eventshort.TechnologyFields[i] === tag) {

                    alert('Already present!');

                    addToArray = false;

                    return false;
                }
            });
        }
        else {
            $scope.eventshort.TechnologyFields = [];
        }

        if (tag == '' || tag == undefined) {
            addToArray = false;
            alert('Please select a Technology Field');
        }

        if (addToArray) {
            $scope.eventshort.TechnologyFields.push(tag);
        }
    }

    //Remove Technologyfield
    $scope.deletetechnologyfield = function (tag) {

        $.each($scope.eventshort.TechnologyFields, function (i) {
            if ($scope.eventshort.TechnologyFields[i] === tag) {
                $scope.eventshort.TechnologyFields.splice(i, 1);
                return false;
            }
        });
    }

    //Add Technology Field
    $scope.addcustomfield = function (customtag) {

        var addToArray = true;

        if ($scope.eventshort.CustomTagging != null) {

            $.each($scope.eventshort.CustomTagging, function (i) {

                if ($scope.eventshort.CustomTagging[i] === customtag) {

                    alert('Already present!');

                    addToArray = false;

                    return false;
                }
            });
        }
        else {
            $scope.eventshort.CustomTagging = [];
        }

        if (customtag == '' || customtag == undefined) {
            addToArray = false;
            alert('Please select a Tag');
        }

        if (addToArray) {
            $scope.eventshort.CustomTagging.push(customtag);
        }
    }

    //Remove Technologyfield
    $scope.deletecustomfield = function (customtag) {

        $.each($scope.eventshort.CustomTagging, function (i) {
            if ($scope.eventshort.CustomTagging[i] === customtag) {
                $scope.eventshort.CustomTagging.splice(i, 1);
                return false;
            }
        });
    }

    //Bild löschen
    $scope.deletedocument = function (documenturl, language) {

        $.each($scope.eventshort.Documents[language], function (i) {
            if ($scope.eventshort.Documents[language][i].DocumentURL === documenturl) {
                $scope.eventshort.Documents[language].splice(i, 1);
                return false;
            }
        });
        //});       
    };

    $scope.addpublishedonchannel = function (publishchannel) {

        if (publishchannel != "" && publishchannel != undefined) {

            var addToArray = true;

            if ($scope.eventshort.PublishedOn != null) {

                $.each($scope.eventshort.PublishedOn, function (i) {

                    if ($scope.eventshort.PublishedOn[i] === publishchannel) {

                        alert('Already present!');
                        addToArray = false;

                        return false;
                    }
                });
            }
            else {
                $scope.eventshort.PublishedOn = [];
            }


            if (addToArray) {

                $scope.eventshort.PublishedOn.push(publishchannel);
            }
        }
        else {
            alert('Invalid publishchannel!');
        }
    }

    //Remove SMG Tagging
    $scope.deletepublishedonchannel = function (publishchannel) {
        //alert(tag);
        $.each($scope.eventshort.PublishedOn, function (i) {
            if ($scope.eventshort.PublishedOn[i] === publishchannel) {
                $scope.eventshort.PublishedOn.splice(i, 1);
                return false;
            }
        });
    }

    //Add Mapping Manually
    $scope.addmapping = function () {

        if ($scope.mappingproperty.Name != '' && $scope.mappingproperty.Value != '' && $scope.mappingproperty.Mappingkey != '') {
            var addToArray = true;

            var provider = $scope.mappingproperty.Mappingkey;

            if ($scope.eventshort.Mapping == null || $scope.eventshort.Mapping == undefined) {
                $scope.eventshort.Mapping = {};
            }

            if ($scope.eventshort.Mapping[provider] == null || $scope.eventshort.Mapping[provider] == undefined) {

                $scope.eventshort.Mapping[provider] = {};
            }

            if ($scope.eventshort.Mapping[provider] != null) {

                //If value is present it will be overwritten....
                Object.keys($scope.eventshort.Mapping[provider]).forEach(function (key) {

                    console.log(key, $scope.eventshort.Mapping[provider][key]);
                });
            }


            if (addToArray) {
                //var property = { Name: $scope.mappingproperty.Name, Value: $scope.mappingproperty.Value };

                //$scope.eventshort.Mapping[provider].push(property);

                var dicttoadd = {};

                if ($scope.eventshort.Mapping[provider] != null && $scope.eventshort.Mapping[provider] != undefined)
                    dicttoadd = $scope.eventshort.Mapping[provider];

                dicttoadd[$scope.mappingproperty.Name] = $scope.mappingproperty.Value;

                $scope.eventshort.Mapping[provider] = dicttoadd;

                console.log($scope.eventshort.Mapping);

                $scope.mappingproperty.Name = '';
                $scope.mappingproperty.Value = '';
            }
        }
    }

    //Remove Maping
    $scope.deletemapping = function (mapping, provider) {

        if (mapping == 'all') {

            var deleteconfirm = confirm('Are you sure you want to delete all keys from ' + provider);

            if (deleteconfirm) {

                delete $scope.eventshort.Mapping[provider];
            }
        }
        else {

            delete $scope.eventshort.Mapping[provider][mapping];

            //$.each($scope.common.Mapping[provider], function (i) {
            //    if ($scope.common.Mapping[provider][i].Name === mapping) {
            //        $scope.common.Mapping[provider].splice(i, 1);
            //        return false;
            //    }
            //});
        }
    }

    //Add Technology Field
    $scope.addageinfo = function (agefrom, ageto) {

        var addToArray = true;

        if ($scope.eventshort.TypicalAgeRange != null) {

            $.each($scope.eventshort.TypicalAgeRange, function (i) {

                if ($scope.eventshort.TypicalAgeRange[i].AgeFrom === agefrom && $scope.eventshort.TypicalAgeRange[i].AgeTo === ageto) {

                    alert('Already present!');

                    addToArray = false;

                    return false;
                }
            });
        }
        else {
            $scope.eventshort.TypicalAgeRange = [];
        }

        if (agefrom == '' || agefrom == undefined || ageto == '' || ageto == undefined) {
            addToArray = false;
            alert('Please insert an age range');
        }

        if (addToArray) {
            $scope.eventshort.TypicalAgeRange.push({ AgeFrom: agefrom, AgeTo: ageto });
        }
    }

    //Remove Technologyfield
    $scope.deleteageinfo = function (ageinfo) {

        $.each($scope.eventshort.TypicalAgeRange, function (i) {
            if ($scope.eventshort.TypicalAgeRange[i] === ageinfo) {
                $scope.eventshort.TypicalAgeRange.splice(i, 1);
                return false;
            }
        });
    }

};

//Modal Slideshow Controller
var InfoModalInstanceCtrl = function ($scope, $modalInstance, $http) {
    $scope.cancelslidemodal = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.myInterval = 5000;
    $scope.slides = $scope.eventshort.ImageGallery;
}

var wysiwygeditorCtrl = function ($scope) {
	$scope.htmlcontentbase = "<div></div>";
	$scope.disabled = false;
};

app.filter('moment', function () {
	return function (dateString, format) {
		return moment(dateString).format(format);
	};
});

app.filter('eventtime', function () {
	return function (timeString, length) {
		return timeString.substring(0, length);
	};
});

function objectFindByKey(array, key, value) {
	for (var i = 0; i < array.length; i++) {
		if (array[i][key] === value) {
			return array[i];
		}
	}
	return null;
}

var eventtypeaheadcontroller = app.controller('EventTypeAheadController', function ($scope, $http) {

	$scope.eventnametypeaheadselected = false;

	$scope.getEventnamesFilteredList = function (language, queryfilter) {

		$http({
			method: 'Get',
            url: $scope.basePath + '/v1/EventShort?pagesize=0&fields=Id,EventTitle.' + language + '&language=' + language + queryfilter
        }).success(function (data) {

            var idandnames = [];
            $.each(data.Items, function (i) {
                idandnames.push({ Id: data.Items[i].Id, Name: data.Items[i]["EventTitle." + language] });                
            });

            $scope.items = idandnames; 
            
		});

	}

	$scope.$on('LoadEventNamesList', function (e) {

		$scope.queryfilterreduced = $scope.onlyactivefilter + $scope.sourcefilter + $scope.eventlocationfilter + $scope.datumvonfilter + $scope.datumbisfilter;

		$scope.getEventnamesFilteredList($scope.lang, $scope.queryfilterreduced);
	});

	$scope.queryfilterreduced = $scope.onlyactivefilter + $scope.sourcefilter + $scope.eventlocationfilter + $scope.datumvonfilter + $scope.datumbisfilter;

	$scope.getEventnamesFilteredList($scope.lang, $scope.queryfilterreduced);

	$scope.onItemSelected = function () {
		$scope.eventnametypeaheadselected = true;
	}
});

//Directive Typeahead
app.directive('typeaheadevent', function ($timeout) {
	return {
		restrict: 'AEC',
		scope: {
			items: '=',
			prompt: '@',
			title: '@',
			name: '@',
			model: '=',
			submodel: '=',
			idmodel: '=',
			onSelect: '&'
		},
		link: function (scope, elem, attrs) {
			scope.handleSelection = function (selectedItem, selectedTyp, selectedId) {
				//alert(selectedItem + selectedTyp + selectedId);

				scope.model = selectedItem;
				scope.submodel = selectedTyp;
				scope.idmodel = selectedId;
				scope.current = 0;
				scope.selected = true;
				$timeout(function () {
					scope.onSelect();
				}, 200);
			};
			scope.current = 0;
			scope.selected = true;
			scope.isCurrent = function (index) {
				return scope.current == index;
			};
			scope.setCurrent = function (index) {
				scope.current = index;
			};
		},
		templateUrl: function (elem, attrs) {
			//alert(attrs.templateurl);
			return attrs.templateurl || 'default.html'
		}
		//templateUrl: 'HuetteTemplate2'
	}
});

app.directive('uiTime', function () {
	return {
		require: '?ngModel',
		link: function ($scope, element, attrs, controller) {
			element.mask("00:00");
		}
	};
});

//DatePicker controller
var DatepickerDemoCtrl = function ($scope) {
	//$scope.today = function (customdate) {

	//    //alert(customdate);
	//    if (customdate == null || customdate.length == 0) {
	//        $scope.season.startdate = new Date();
	//    }
	//    else {
	//        $scope.season.startdate = new Date(customdate);
	//    }
	//};

	//$scope.today($scope.season.startdate);

	//$scope.clear = function () {
	//    $scope.season.startdate = null;
	//};

	//Disable weekend selection
	$scope.disabled = function (date, mode) {
		return (mode === 'day' && (date.getDay() === 0 || date.getDay() === 6));
	};

	$scope.toggleMin = function () {
		$scope.minDate = $scope.minDate ? null : new Date();
	};
	$scope.toggleMin();

	$scope.open = function ($event) {
		$event.preventDefault();
		$event.stopPropagation();

		$scope.opened = true;
	};

	$scope.dateOptions = {
		formatYear: 'yy',
		startingDay: 1
	};

	$scope.initDate = new Date();
	$scope.formats = ['dd-MM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
	$scope.format = $scope.formats[0];
};

//Fileupload Images
app.controller('FileUploadController', ['$scope', 'FileUploader', function ($scope, FileUploader) {

    var uploader = $scope.uploader = new FileUploader({
        url: $scope.basePath + '/v1/FileUpload',
        headers: { Authorization: "Bearer " + localStorage.getItem("accessToken")  }
    });

    // FILTERS
    uploader.filters.push({
        name: 'imageFilter',
        fn: function (item /*{File|FileLikeObject}*/, options) {

            var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
            return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
        }
    });

    // CALLBACKS

    uploader.onWhenAddingFileFailed = function (item /*{File|FileLikeObject}*/, filter, options) {
        console.info('onWhenAddingFileFailed', item, filter, options);
    };
    uploader.onAfterAddingFile = function (fileItem) {
        console.info('onAfterAddingFile', fileItem);
    };
    uploader.onAfterAddingAll = function (addedFileItems) {
        console.info('onAfterAddingAll', addedFileItems);
    };
    uploader.onBeforeUploadItem = function (item) {
        console.info('onBeforeUploadItem', item);
    };
    uploader.onProgressItem = function (fileItem, progress) {
        console.info('onProgressItem', fileItem, progress);
    };
    uploader.onProgressAll = function (progress) {
        console.info('onProgressAll', progress);
    };
    uploader.onSuccessItem = function (fileItem, response, status, headers) {

        var r = new RegExp('"', 'g');
        var imageurl = response.replace(r, '');
        //Filename
        var imagename = imageurl.substring(imageurl.lastIndexOf('/') + 1);

        var counter = 0;

        if ($scope.eventshort.ImageGallery == null) {
            $scope.eventshort.ImageGallery = [];
        }
        else {
            counter = $scope.eventshort.ImageGallery.length;
        }

        var UploadedImage = { ImageName: imagename, ImageUrl: imageurl, Width: 0, Height: 0, ImageSource: 'NOI', ImageTitle: { de: '', it: '', en: '' }, ImageDesc: { de: '', it: '', en: '' }, ListPosition: counter, License: "CC0", IsInGallery: true }

        console.log(UploadedImage);

        $scope.eventshort.ImageGallery.push(UploadedImage);

        alert('Image uploaded');

        console.info('onSuccessItem', fileItem, response, status, headers);
    };
    uploader.onErrorItem = function (fileItem, response, status, headers) {

        alert('error');
        console.info('onErrorItem', fileItem, response, status, headers);
    };
    uploader.onCancelItem = function (fileItem, response, status, headers) {
        console.info('onCancelItem', fileItem, response, status, headers);
    };
    uploader.onCompleteItem = function (fileItem, response, status, headers) {
        console.info('onCompleteItem', fileItem, response, status, headers);
    };
    uploader.onCompleteAll = function () {
        console.info('onCompleteAll');
    };

    //console.info('uploader', uploader);
}]);

//Fileupload Image Single
app.controller('FileUploadControllerSingle', ['$scope', 'FileUploader', function ($scope, FileUploader) {

    $scope.oldimageurl = "";

    $scope.init = function (oldimageurl) {
        $scope.oldimageurl = oldimageurl;
    }

    var uploader = $scope.uploader = new FileUploader({
        url: $scope.basePath + '/v1/FileUpload',
        headers: { Authorization: "Bearer " + localStorage.getItem("accessToken") }
    });

    // FILTERS
    uploader.filters.push({
        name: 'imageFilter',
        fn: function (item /*{File|FileLikeObject}*/, options) {
            var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
            return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
        }
    });

    // CALLBACKS

    uploader.onWhenAddingFileFailed = function (item /*{File|FileLikeObject}*/, filter, options) {
        console.info('onWhenAddingFileFailed', item, filter, options);
    };
    uploader.onAfterAddingFile = function (fileItem) {
        console.info('onAfterAddingFile', fileItem);
    };
    uploader.onAfterAddingAll = function (addedFileItems) {
        console.info('onAfterAddingAll', addedFileItems);
    };
    uploader.onBeforeUploadItem = function (item) {
        console.info('onBeforeUploadItem', item);
    };
    uploader.onProgressItem = function (fileItem, progress) {
        console.info('onProgressItem', fileItem, progress);
    };
    uploader.onProgressAll = function (progress) {
        console.info('onProgressAll', progress);
    };
    uploader.onSuccessItem = function (fileItem, response, status, headers) {

        var currentimagescount = $scope.eventshort.ImageGallery.length;

        var r = new RegExp('"', 'g');
        var imageurl = response.replace(r, '');

        //Filename
        var imagename = imageurl.substring(imageurl.lastIndexOf('/') + 1);

        alert('changed Image: ' + imageurl);

        var UploadedImage = { ImageName: '', ImageUrl: imageurl, Width: 0, Height: 0, ImageSource: 'NOI', ImageTitle: { de: '', it: '', en: '', nl: '', cs: '', pl: '' }, ListPosition: currentimagescount++, License: "CC0", IsInGallery: true }

        $.each($scope.eventshort.ImageGallery, function (i) {
            if ($scope.eventshort.ImageGallery[i].ImageUrl === $scope.oldimageurl) {

                $scope.eventshort.ImageGallery[i].ImageUrl = imageurl;
                $scope.eventshort.ImageGallery[i].ImageName = imagename;

                return false;
            }
        });

        console.log(UploadedImage);

        console.info('onSuccessItem', fileItem, response, status, headers);
    };
    uploader.onErrorItem = function (fileItem, response, status, headers) {

        alert('error');
        console.info('onErrorItem', fileItem, response, status, headers);
    };
    uploader.onCancelItem = function (fileItem, response, status, headers) {
        console.info('onCancelItem', fileItem, response, status, headers);
    };
    uploader.onCompleteItem = function (fileItem, response, status, headers) {
        console.info('onCompleteItem', fileItem, response, status, headers);
    };
    uploader.onCompleteAll = function () {
        console.info('onCompleteAll');
    };    
}]);

//Fileupload PDF
app.controller('FileUploadControllerPDF', ['$scope', 'FileUploader', function ($scope, FileUploader) {

    var uploaderpdf = $scope.uploaderpdf = new FileUploader({
        url: $scope.basePath + '/v1/FileUpload/Doc',
        headers: { Authorization: "Bearer " + localStorage.getItem("accessToken") }
    });

    // FILTERS
    uploaderpdf.filters.push({
        name: 'pdfFilter',
        fn: function (item /*{File|FileLikeObject}*/, options) {

            var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
            return '|pdf|'.indexOf(type) !== -1;
        }
    });

    // CALLBACKS

    uploaderpdf.onWhenAddingFileFailed = function (item /*{File|FileLikeObject}*/, filter, options) {
        console.info('onWhenAddingFileFailed', item, filter, options);
    };
    uploaderpdf.onAfterAddingFile = function (fileItem) {
        console.info('onAfterAddingFile', fileItem);
    };
    uploaderpdf.onAfterAddingAll = function (addedFileItems) {
        console.info('onAfterAddingAll', addedFileItems);
    };
    uploaderpdf.onBeforeUploadItem = function (item) {
        console.info('onBeforeUploadItem', item);
    };
    uploaderpdf.onProgressItem = function (fileItem, progress) {
        console.info('onProgressItem', fileItem, progress);
    };
    uploaderpdf.onProgressAll = function (progress) {
        console.info('onProgressAll', progress);
    };
    uploaderpdf.onSuccessItem = function (fileItem, response, status, headers) {

        var r = new RegExp('"', 'g');
        var pdfurl = response.replace(r, '');
        //Filename

        //var counter = 0;

        //if ($scope.eventshort.EventDocument == null) {
        //    $scope.eventshort.EventDocument = [];
        //}
        //else {
        //    counter = $scope.eventshort.EventDocument.length;
        //}

        ////language check1
        //if ($scope.eventshort.EventDocument.length > 0) {
        //    $.each($scope.eventshort.EventDocument, function (i) {
        //        if ($scope.eventshort.EventDocument[i].Language === 'de') {
        //            hasde = true;
        //        }
        //        else if ($scope.eventshort.EventDocument[i].Language === 'it') {
        //            hasit = true;
        //        }
        //        else if ($scope.eventshort.EventDocument[i].Language === 'en') {
        //            hasen = true;
        //        }
        //    });
        //}

        //console.log('de ' + hasde);
        //console.log('it ' + hasit);
        //console.log('en ' + hasen);


        //if (hasde && !hasit && !hasen)
        //    languagetoset = 'it';
        //if (hasde && hasit && !hasen)
        //    languagetoset = 'en';

        //if (hasde && hasit && hasen) {
        //    alert('Documents in de/it/en already assigned');
        //}
        //else {

        //console.log(pdfurl);

        if ($scope.eventshort.Documents == null || $scope.eventshort.Documents == undefined) {
            $scope.eventshort.Documents = {};
        }

        if ($scope.eventdocument.hasde) {
            var UploadedPDF = { DocumentUrl: pdfurl, Language: "de", DocumentName: "" }

            if ($scope.eventshort.Documents["de"] == undefined)
                $scope.eventshort.Documents["de"] = [];

            $scope.eventshort.Documents["de"].push(UploadedPDF);

            //alert('Document uploaded');

            console.info('onSuccessItem', fileItem, response, status, headers);
        }
        if ($scope.eventdocument.hasit) {
            var UploadedPDF = { DocumentUrl: pdfurl, Language: "it", DocumentName: "" }

            if ($scope.eventshort.Documents["it"] == undefined)
                $scope.eventshort.Documents["it"] = [];

            $scope.eventshort.Documents["it"].push(UploadedPDF);

            //alert('Document uploaded');

            console.info('onSuccessItem', fileItem, response, status, headers);
        }
        if ($scope.eventdocument.hasen) {
            var UploadedPDF = { DocumentUrl: pdfurl, Language: "en", DocumentName: "" }

            if ($scope.eventshort.Documents["en"] == undefined)
                $scope.eventshort.Documents["en"] = [];

            $scope.eventshort.Documents["en"].push(UploadedPDF);

            //alert('Document uploaded');

            console.info('onSuccessItem', fileItem, response, status, headers);
        }
       
    };
    uploaderpdf.onErrorItem = function (fileItem, response, status, headers) {
        alert('error');
        console.info('onErrorItem', fileItem, response, status, headers);
    };
    uploaderpdf.onCancelItem = function (fileItem, response, status, headers) {
        console.info('onCancelItem', fileItem, response, status, headers);
    };
    uploaderpdf.onCompleteItem = function (fileItem, response, status, headers) {
        console.info('onCompleteItem', fileItem, response, status, headers);
    };
    uploaderpdf.onCompleteAll = function () {
        console.info('onCompleteAll');
    };

    //console.info('uploader', uploader);
}]);

function getQueryVariable(url, variable) {

    var myurl = url.substring(url.indexOf("?"))

    var query = myurl.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0] == variable) { return pair[1]; }
    }
    return (false);
}

//Tag Select controller
var tagselectcontroller = app.controller('TagSelectController', function ($scope, $http) {

    var mytagspath = $scope.basePath + '/v1/EventShortTypes?rawfilter=eq(Type,"CustomTagging")';
    
    $http({
        method: 'Get',        
        url: mytagspath
    }).success(function (data) {
        $scope.taglist = data;
    });      
});

//Technology field Select controller
var technologyfieldsselectcontroller = app.controller('TechnologyfieldSelectController', function ($scope, $http) {

    var mytechnologyfieldsspath = $scope.basePath + '/v1/EventShortTypes?rawfilter=eq(Type,"TechnologyFields")';

    $http({
        method: 'Get',
        url: mytechnologyfieldsspath
    }).success(function (data) {
        $scope.technologyfieldslist = data;
    });
});
