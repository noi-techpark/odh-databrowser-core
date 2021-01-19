using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace odh_databrowser_core.Filters
{
    public class MyPropertyActionFilter : ActionFilterAttribute
    {
        public override void OnResultExecuting(ResultExecutingContext filterContext)
        {
            if (filterContext.Result is ViewResult)
            {

                //var principal = filterContext.HttpContext.User; // .ControllerContext.HttpContext.User;

                var controller = filterContext.Controller as Controller;

                var principal = controller.HttpContext.User;

                //NEU VISIBLE Hauptkategorien
                controller.ViewBag.DataVisible = false;
                controller.ViewBag.GeobankVisible = false;
                controller.ViewBag.GBConfigVisible = false;
                controller.ViewBag.ExternalDataSourcesVisible = false;
                controller.ViewBag.UserManagementVisible = false;

                //NEU VISIBLE Unterkategorien
                //Config
                controller.ViewBag.UserManagementVisible = false;
                controller.ViewBag.RoleManagementVisible = false;
                controller.ViewBag.SyncProfilesVisible = false;
                controller.ViewBag.GBTagsAndTypesVisible = false;
                controller.ViewBag.LTSConfigVisible = false;
                //Geobank
                controller.ViewBag.LocationVisible = false;
                controller.ViewBag.GBPoiVisible = false;
                controller.ViewBag.GBEventVisible = false;
                controller.ViewBag.GBVenueVisible = false;
                controller.ViewBag.GBEventShortVisible = false;
                controller.ViewBag.GBArticleVisible = false;
                controller.ViewBag.GBAccoVisible = false;
                controller.ViewBag.GBPackageVisible = false;
                //External Datasources
                controller.ViewBag.LTSActivityVisible = false;
                controller.ViewBag.LTSPoiVisible = false;
                controller.ViewBag.LTSGastroVisible = false;
                controller.ViewBag.LTSEventVisible = false;
                controller.ViewBag.VenueVisible = false;
                controller.ViewBag.LTSAccoVisible = false;
                controller.ViewBag.HgvPackageVisible = false;
                controller.ViewBag.ExternalDataSourcesVisible = false;


                //List<dynamic> globalPropertyList = new List<dynamic>();
                controller.ViewBag.globaldelete = false;
                controller.ViewBag.globalcreate = false;
                controller.ViewBag.globalmodify = false;
                controller.ViewBag.globalupdate = false;
                controller.ViewBag.globalvisible = false;
                controller.ViewBag.globalread = false;
                controller.ViewBag.globaldetail = false;
                //Acco
                controller.ViewBag.accodelete = false;
                controller.ViewBag.accocreate = false;
                controller.ViewBag.accomodify = false;
                controller.ViewBag.accoupdate = false;
                controller.ViewBag.accoread = false;
                //Package
                controller.ViewBag.packagedelete = false;
                controller.ViewBag.packagecreate = false;
                controller.ViewBag.packagemodify = false;
                controller.ViewBag.packageupdate = false;
                controller.ViewBag.packageread = false;
                //Gastro
                controller.ViewBag.gastrodelete = false;
                controller.ViewBag.gastrocreate = false;
                controller.ViewBag.gastromodify = false;
                controller.ViewBag.gastroupdate = false;
                controller.ViewBag.gastroread = false;
                //Activity
                controller.ViewBag.activitydelete = false;
                controller.ViewBag.activitycreate = false;
                controller.ViewBag.activitymodify = false;
                controller.ViewBag.activityupdate = false;
                controller.ViewBag.activityread = false;
                //Poi
                controller.ViewBag.poidelete = false;
                controller.ViewBag.poicreate = false;
                controller.ViewBag.poimodify = false;
                controller.ViewBag.poiupdate = false;
                controller.ViewBag.poiread = false;
                //Event
                controller.ViewBag.eventdelete = false;
                controller.ViewBag.eventcreate = false;
                controller.ViewBag.eventmodify = false;
                controller.ViewBag.eventupdate = false;
                controller.ViewBag.eventread = false;
                //EventShort
                controller.ViewBag.eventshortdelete = false;
                controller.ViewBag.eventshortcreate = false;
                controller.ViewBag.eventshortmodify = false;
                controller.ViewBag.eventshortupdate = false;
                controller.ViewBag.eventshortread = false;
                //SmgPoi
                controller.ViewBag.ODHPoiDelete = false;
                controller.ViewBag.ODHPoiCreate = false;
                controller.ViewBag.ODHPoiModify = false;
                controller.ViewBag.ODHPoiUpdate = false;
                controller.ViewBag.ODHPoiRead = false;
                //Article
                controller.ViewBag.articledelete = false;
                controller.ViewBag.articlecreate = false;
                controller.ViewBag.articlemodify = false;
                controller.ViewBag.articleupdate = false;
                controller.ViewBag.articleread = false;
                //Common
                controller.ViewBag.commondelete = false;
                controller.ViewBag.commoncreate = false;
                controller.ViewBag.commonmodify = false;
                controller.ViewBag.commonupdate = false;
                controller.ViewBag.commonread = false;
                //Webcam
                controller.ViewBag.webcamdelete = false;
                controller.ViewBag.webcamcreate = false;
                controller.ViewBag.webcammodify = false;
                controller.ViewBag.webcamupdate = false;
                controller.ViewBag.webcamread = false;
                //Venue
                controller.ViewBag.venuedelete = false;
                controller.ViewBag.venuecreate = false;
                controller.ViewBag.venuemodify = false;
                controller.ViewBag.venueupdate = false;
                controller.ViewBag.venueread = false;


                //Visibility Filters TODO
                controller.ViewBag.articlesvisible = false;
                controller.ViewBag.activitiesvisible = false;
                controller.ViewBag.poisvisible = false;
                controller.ViewBag.odhpoisvisible = false;
                controller.ViewBag.accommodationsvisible = false;
                controller.ViewBag.packagesvisible = false;
                controller.ViewBag.eventsvisible = false;
                controller.ViewBag.eventsshortvisible = false;
                controller.ViewBag.gastronomiesvisible = false;
                controller.ViewBag.commonvisible = false;
                controller.ViewBag.webcamvisible = false;
                controller.ViewBag.venuevisible = false;


                //Filtered Locations Special TV + TVB Users
                controller.ViewBag.isTV = false;
                controller.ViewBag.isTVB = false;
                controller.ViewBag.predefinedlocationfilter = "";
                controller.ViewBag.predefinedlocationfiltertyp = "";

                //VirtualVillage
                controller.ViewBag.virtualvillageadmin = false;


                CheckRoles(principal, filterContext);

                CheckGBRolesVisible(principal, filterContext);


                //CheckLocations(principal, filterContext);
            }
        }

        public void CheckRoles(System.Security.Principal.IPrincipal principal, ResultExecutingContext filterContext)
        {
            //Global
            var controller = filterContext.Controller as Controller;

            if (principal.IsInRole("DataWriter"))
            {
                controller.ViewBag.globalread = true;
                controller.ViewBag.globaldelete = true;
                controller.ViewBag.globalcreate = true;
                controller.ViewBag.globalmodify = true;
                controller.ViewBag.globalupdate = true;
                //controller.ViewBag.globalvisible = true;
            }
            if (principal.IsInRole("DataCreate"))
            {
                controller.ViewBag.globalread = true;
                controller.ViewBag.globalcreate = true;
                //controller.ViewBag.globalvisible = true;
            }
            if (principal.IsInRole("DataModify"))
            {
                controller.ViewBag.globalread = true;
                controller.ViewBag.globalmodify = true;
                //controller.ViewBag.globalvisible = true;
            }
            if (principal.IsInRole("DataUpdate"))
            {
                controller.ViewBag.globalread = true;
                controller.ViewBag.globalupdate = true;
                //controller.ViewBag.globalvisible = true;
            }
            if (principal.IsInRole("DataDelete"))
            {
                controller.ViewBag.globalread = true;
                controller.ViewBag.globaldelete = true;
                //controller.ViewBag.globalvisible = true;
            }
            if (principal.IsInRole("DataVisible"))
            {
                controller.ViewBag.globalread = true;
                controller.ViewBag.globalvisible = true;
            }
            if (principal.IsInRole("DataReader"))
            {
                controller.ViewBag.globalread = true;
            }
            if (principal.IsInRole("DataDetail"))
            {
                controller.ViewBag.globaldetail = true;
            }



            //ACCO
            if (principal.IsInRole("AccoManager"))
            {
                controller.ViewBag.accoread = true;
                controller.ViewBag.accomodify = true;
                controller.ViewBag.accodelete = true;
                controller.ViewBag.accoupdate = true;
                controller.ViewBag.accocreate = true;
                //controller.ViewBag.accommodationsvisible = true;
            }
            if (principal.IsInRole("AccoModify"))
            {
                controller.ViewBag.accoread = true;
                controller.ViewBag.accomodify = true;
                //controller.ViewBag.accommodationsvisible = true;
            }
            if (principal.IsInRole("AccoDelete"))
            {
                controller.ViewBag.accoread = true;
                controller.ViewBag.accodelete = true;
                //controller.ViewBag.accommodationsvisible = true;  
            }
            if (principal.IsInRole("AccoUpdate"))
            {
                controller.ViewBag.accoread = true;
                controller.ViewBag.accoupdate = true;
                //controller.ViewBag.accommodationsvisible = true;
            }
            if (principal.IsInRole("AccoCreate"))
            {
                controller.ViewBag.accoread = true;
                controller.ViewBag.accocreate = true;
                //controller.ViewBag.accommodationsvisible = true;
            }
            if (principal.IsInRole("AccoVisible"))
            {
                controller.ViewBag.accoread = true;
                controller.ViewBag.accommodationsvisible = true;
            }
            if (principal.IsInRole("AccoReader"))
            {
                controller.ViewBag.accoread = true;
            }


            //PACKAGE
            if (principal.IsInRole("PackageManager"))
            {
                controller.ViewBag.packageread = true;
                controller.ViewBag.packagedelete = true;
                controller.ViewBag.packagecreate = true;
                controller.ViewBag.packagemodify = true;
                controller.ViewBag.packageupdate = true;
                //controller.ViewBag.packagesvisible = true;
            }
            if (principal.IsInRole("PackageModify"))
            {
                controller.ViewBag.packageread = true;
                controller.ViewBag.packagemodify = true;
                //controller.ViewBag.packagesvisible = true;
            }
            if (principal.IsInRole("PackageDelete"))
            {
                controller.ViewBag.packageread = true;
                controller.ViewBag.packagedelete = true;
                //controller.ViewBag.packagesvisible = true;
            }
            if (principal.IsInRole("PackageUpdate"))
            {
                controller.ViewBag.packageread = true;
                controller.ViewBag.packageupdate = true;
                //controller.ViewBag.packagesvisible = true;
            }
            if (principal.IsInRole("PackageCreate"))
            {
                controller.ViewBag.packageread = true;
                controller.ViewBag.packagecreate = true;
                //controller.ViewBag.packagesvisible = true;
            }
            if (principal.IsInRole("PackageVisible"))
            {
                controller.ViewBag.packageread = true;
                controller.ViewBag.packagesvisible = true;
            }
            if (principal.IsInRole("PackageReader"))
            {
                controller.ViewBag.packageread = true;
            }

            //GASTRO
            if (principal.IsInRole("GastroManager"))
            {
                controller.ViewBag.gastroread = true;
                controller.ViewBag.gastrodelete = true;
                controller.ViewBag.gastrocreate = true;
                controller.ViewBag.gastromodify = true;
                controller.ViewBag.gastroupdate = true;
                //controller.ViewBag.gastronomiesvisible = true;
            }
            if (principal.IsInRole("GastroModify"))
            {
                controller.ViewBag.gastroread = true;
                controller.ViewBag.gastromodify = true;
                //controller.ViewBag.gastronomiesvisible = true;
            }
            if (principal.IsInRole("GastroUpdate"))
            {
                controller.ViewBag.gastroread = true;
                controller.ViewBag.gastroupdate = true;
                //controller.ViewBag.gastronomiesvisible = true;
            }
            if (principal.IsInRole("GastroCreate"))
            {
                controller.ViewBag.gastroread = true;
                controller.ViewBag.gastrocreate = true;
                controller.ViewBag.gastronomiesvisible = true;
            }
            if (principal.IsInRole("GastroDelete"))
            {
                controller.ViewBag.gastroread = true;
                controller.ViewBag.gastrodelete = true;
                //controller.ViewBag.gastronomiesvisible = true;
            }
            if (principal.IsInRole("GastroVisible"))
            {
                controller.ViewBag.gastroread = true;
                controller.ViewBag.gastronomiesvisible = true;
            }
            if (principal.IsInRole("GastroReader"))
            {
                controller.ViewBag.gastroread = true;
            }

            //ACTIVITY
            if (principal.IsInRole("ActivityManager"))
            {
                controller.ViewBag.activityread = true;
                controller.ViewBag.activitydelete = true;
                controller.ViewBag.activitycreate = true;
                controller.ViewBag.activitymodify = true;
                controller.ViewBag.activityupdate = true;
                //controller.ViewBag.activitiesvisible = true;
            }
            if (principal.IsInRole("ActivityModify"))
            {
                controller.ViewBag.activityread = true;
                controller.ViewBag.activitymodify = true;
                //controller.ViewBag.activitiesvisible = true;
            }
            if (principal.IsInRole("ActivityCreate"))
            {
                controller.ViewBag.activityread = true;
                controller.ViewBag.activitycreate = true;
                //controller.ViewBag.activitiesvisible = true;
            }
            if (principal.IsInRole("ActivityUpdate"))
            {
                controller.ViewBag.activityread = true;
                controller.ViewBag.activityupdate = true;
                //controller.ViewBag.activitiesvisible = true;
            }
            if (principal.IsInRole("ActivityDelete"))
            {
                controller.ViewBag.activityread = true;
                controller.ViewBag.activitydelete = true;
                //controller.ViewBag.activitiesvisible = true;
            }
            if (principal.IsInRole("ActivityVisible"))
            {
                controller.ViewBag.activityread = true;
                controller.ViewBag.activitiesvisible = true;
            }
            if (principal.IsInRole("ActivityReader"))
            {
                controller.ViewBag.activityread = true;
            }


            //POI
            if (principal.IsInRole("PoiManager"))
            {
                controller.ViewBag.poiread = true;
                controller.ViewBag.poidelete = true;
                controller.ViewBag.poicreate = true;
                controller.ViewBag.poimodify = true;
                controller.ViewBag.poiupdate = true;
                //controller.ViewBag.poisvisible = true;
            }
            if (principal.IsInRole("PoiCreate"))
            {
                controller.ViewBag.poiread = true;
                controller.ViewBag.poicreate = true;
                //controller.ViewBag.poisvisible = true;
            }
            if (principal.IsInRole("PoiModify"))
            {
                controller.ViewBag.poiread = true;
                controller.ViewBag.poimodify = true;
                //controller.ViewBag.poisvisible = true;
            }
            if (principal.IsInRole("PoiDelete"))
            {
                controller.ViewBag.poiread = true;
                controller.ViewBag.poidelete = true;
                //controller.ViewBag.poisvisible = true;
            }
            if (principal.IsInRole("PoiUpdate"))
            {
                controller.ViewBag.poiread = true;
                controller.ViewBag.poiupdate = true;
                //controller.ViewBag.poisvisible = true;
            }
            if (principal.IsInRole("PoiVisible"))
            {
                controller.ViewBag.poiread = true;
                controller.ViewBag.poisvisible = true;
            }
            if (principal.IsInRole("PoiReader"))
            {
                controller.ViewBag.poiread = true;
            }


            //EVENT
            if (principal.IsInRole("EventManager"))
            {
                controller.ViewBag.eventread = true;
                controller.ViewBag.eventdelete = true;
                controller.ViewBag.eventcreate = true;
                controller.ViewBag.eventmodify = true;
                controller.ViewBag.eventupdate = true;
                //controller.ViewBag.eventsvisible = true;
            }
            if (principal.IsInRole("EventCreate"))
            {
                controller.ViewBag.eventread = true;
                controller.ViewBag.eventcreate = true;
                //controller.ViewBag.eventsvisible = true;
            }
            if (principal.IsInRole("EventModify"))
            {
                controller.ViewBag.eventread = true;
                controller.ViewBag.eventmodify = true;
                //controller.ViewBag.eventsvisible = true;
            }
            if (principal.IsInRole("EventDelete"))
            {
                controller.ViewBag.eventread = true;
                controller.ViewBag.eventdelete = true;
                //controller.ViewBag.eventsvisible = true;
            }
            if (principal.IsInRole("EventUpdate"))
            {
                controller.ViewBag.eventread = true;
                controller.ViewBag.eventupdate = true;
                //controller.ViewBag.eventsvisible = true;
            }
            if (principal.IsInRole("EventVisible"))
            {
                controller.ViewBag.eventread = true;
                controller.ViewBag.eventsvisible = true;
            }
            if (principal.IsInRole("EventReader"))
            {
                controller.ViewBag.eventread = true;
            }


            //EVENTSHORT
            if (principal.IsInRole("EventShortManager"))
            {
                controller.ViewBag.eventshortread = true;
                controller.ViewBag.eventshortdelete = true;
                controller.ViewBag.eventshortcreate = true;
                controller.ViewBag.eventshortmodify = true;
                controller.ViewBag.eventshortupdate = true;
                //controller.ViewBag.eventsvisible = true;
            }
            if (principal.IsInRole("EvenShortCreate"))
            {
                controller.ViewBag.eventshortread = true;
                controller.ViewBag.eventshortcreate = true;
                //controller.ViewBag.eventsvisible = true;
            }
            if (principal.IsInRole("EventShortModify"))
            {
                controller.ViewBag.eventshortread = true;
                controller.ViewBag.eventshortmodify = true;
                //controller.ViewBag.eventsvisible = true;
            }
            if (principal.IsInRole("EventShortDelete"))
            {
                controller.ViewBag.eventshortread = true;
                controller.ViewBag.eventshortdelete = true;
                //controller.ViewBag.eventsvisible = true;
            }
            if (principal.IsInRole("EventShortUpdate"))
            {
                controller.ViewBag.eventshortread = true;
                controller.ViewBag.eventshortupdate = true;
                //controller.ViewBag.eventsvisible = true;
            }
            if (principal.IsInRole("EventShortVisible"))
            {
                controller.ViewBag.eventshortread = true;
                controller.ViewBag.eventshortvisible = true;
            }
            if (principal.IsInRole("EventShortReader"))
            {
                controller.ViewBag.eventshortread = true;
            }


            //SmgPOI
            if (principal.IsInRole("ODHPoiManager"))
            {
                controller.ViewBag.ODHPoiRead = true;
                controller.ViewBag.ODHPoiDelete = true;
                controller.ViewBag.ODHPoiCreate = true;
                controller.ViewBag.ODHPoiModify = true;
                controller.ViewBag.ODHPoiUpdate = true;
                //controller.ViewBag.odhpoisvisible = true;
            }
            if (principal.IsInRole("ODHPoiCreate"))
            {
                controller.ViewBag.ODHPoiRead = true;
                controller.ViewBag.ODHPoiCreate = true;
                //controller.ViewBag.odhpoisvisible = true;
            }
            if (principal.IsInRole("ODHPoiModify"))
            {
                controller.ViewBag.ODHPoiRead = true;
                controller.ViewBag.ODHPoiModify = true;
                //controller.ViewBag.odhpoisvisible = true;
            }
            if (principal.IsInRole("ODHPoiUpdate"))
            {
                controller.ViewBag.ODHPoiRead = true;
                controller.ViewBag.ODHPoiDelete = true;
                //controller.ViewBag.odhpoisvisible = true;
            }
            if (principal.IsInRole("SmgPoiUpdate"))
            {
                controller.ViewBag.ODHPoiRead = true;
                controller.ViewBag.ODHPoiUpdate = true;
                //controller.ViewBag.odhpoisvisible = true;
            }
            if (principal.IsInRole("ODHPoiVisible"))
            {
                controller.ViewBag.ODHPoiRead = true;
                controller.ViewBag.odhpoisvisible = true;
            }
            if (principal.IsInRole("ODHPoiReader"))
            {
                controller.ViewBag.ODHPoiRead = true;
            }


            //ARTICLE
            if (principal.IsInRole("ArticleManager"))
            {
                controller.ViewBag.articleread = true;
                controller.ViewBag.articledelete = true;
                controller.ViewBag.articlecreate = true;
                controller.ViewBag.articlemodify = true;
                controller.ViewBag.articleupdate = true;
                //controller.ViewBag.articlesvisible = true;
            }
            if (principal.IsInRole("ArticleCreate"))
            {
                controller.ViewBag.articleread = true;
                controller.ViewBag.articlecreate = true;
                //controller.ViewBag.articlesvisible = true;
            }
            if (principal.IsInRole("ArticleModify"))
            {
                controller.ViewBag.articleread = true;
                controller.ViewBag.articlemodify = true;
                //controller.ViewBag.articlesvisible = true;
            }
            if (principal.IsInRole("ArticleDelete"))
            {
                controller.ViewBag.articleread = true;
                controller.ViewBag.articledelete = true;
                //controller.ViewBag.articlesvisible = true;
            }
            if (principal.IsInRole("ArticleUpdate"))
            {
                controller.ViewBag.articleread = true;
                controller.ViewBag.articleupdate = true;
                //controller.ViewBag.articlesvisible = true;
            }
            if (principal.IsInRole("ArticleVisible"))
            {
                controller.ViewBag.articleread = true;
                controller.ViewBag.articlesvisible = true;
            }
            if (principal.IsInRole("ArticleReader"))
            {
                controller.ViewBag.articleread = true;
            }

            //COMMON
            if (principal.IsInRole("CommonManager"))
            {
                controller.ViewBag.commonread = true;
                controller.ViewBag.commondelete = true;
                controller.ViewBag.commoncreate = true;
                controller.ViewBag.commonmodify = true;
                controller.ViewBag.commonupdate = true;
                //controller.ViewBag.commonvisible = true;
            }
            if (principal.IsInRole("CommonCreate"))
            {
                controller.ViewBag.commonread = true;
                controller.ViewBag.commoncreate = true;
                //controller.ViewBag.commonvisible = true;
            }
            if (principal.IsInRole("CommonModify"))
            {
                controller.ViewBag.commonread = true;
                controller.ViewBag.commonmodify = true;
                //controller.ViewBag.commonvisible = true;
            }
            if (principal.IsInRole("CommonDelete"))
            {
                controller.ViewBag.commonread = true;
                controller.ViewBag.commondelete = true;
                //controller.ViewBag.commonvisible = true;
            }
            if (principal.IsInRole("CommonUpdate"))
            {
                controller.ViewBag.commonread = true;
                controller.ViewBag.commonupdate = true;
                //controller.ViewBag.commonvisible = true;
            }
            if (principal.IsInRole("CommonVisible"))
            {
                controller.ViewBag.commonread = true;
                controller.ViewBag.commonvisible = true;
            }
            if (principal.IsInRole("CommonReader"))
            {
                controller.ViewBag.commonread = true;
            }

            //Webcam
            if (principal.IsInRole("WebcamManager"))
            {
                controller.ViewBag.webcamread = true;
                controller.ViewBag.webcamdelete = true;
                controller.ViewBag.webcamcreate = true;
                controller.ViewBag.webcammodify = true;
                controller.ViewBag.webcamupdate = true;
                //controller.ViewBag.commonvisible = true;
            }
            if (principal.IsInRole("WebcamCreate"))
            {
                controller.ViewBag.webcamread = true;
                controller.ViewBag.webcamcreate = true;
                //controller.ViewBag.commonvisible = true;
            }
            if (principal.IsInRole("WebcamModify"))
            {
                controller.ViewBag.webcamread = true;
                controller.ViewBag.webcammodify = true;
                //controller.ViewBag.commonvisible = true;
            }
            if (principal.IsInRole("WebcamDelete"))
            {
                controller.ViewBag.webcamread = true;
                controller.ViewBag.webcamdelete = true;
                //controller.ViewBag.commonvisible = true;
            }
            if (principal.IsInRole("WebcamUpdate"))
            {
                controller.ViewBag.webcamread = true;
                controller.ViewBag.webcamupdate = true;
                //controller.ViewBag.commonvisible = true;
            }
            if (principal.IsInRole("WebcamVisible"))
            {
                controller.ViewBag.webcamread = true;
                controller.ViewBag.webcamvisible = true;
            }
            if (principal.IsInRole("WebcamReader"))
            {
                controller.ViewBag.webcamread = true;
            }

            //Venue
            if (principal.IsInRole("VenueManager"))
            {
                controller.ViewBag.venueread = true;
                controller.ViewBag.venuedelete = true;
                controller.ViewBag.venuecreate = true;
                controller.ViewBag.venuemodify = true;
                controller.ViewBag.venueupdate = true;
                //controller.ViewBag.commonvisible = true;
            }
            if (principal.IsInRole("VenueCreate"))
            {
                controller.ViewBag.venueread = true;
                controller.ViewBag.venuecreate = true;
                //controller.ViewBag.commonvisible = true;
            }
            if (principal.IsInRole("VenueModify"))
            {
                controller.ViewBag.venueread = true;
                controller.ViewBag.venuemodify = true;
                //controller.ViewBag.commonvisible = true;
            }
            if (principal.IsInRole("VenueDelete"))
            {
                controller.ViewBag.venueread = true;
                controller.ViewBag.venuedelete = true;
                //controller.ViewBag.commonvisible = true;
            }
            if (principal.IsInRole("VenueUpdate"))
            {
                controller.ViewBag.venueread = true;
                controller.ViewBag.venueupdate = true;
                //controller.ViewBag.commonvisible = true;
            }
            if (principal.IsInRole("VenueVisible"))
            {
                controller.ViewBag.venueread = true;
                controller.ViewBag.venuevisible = true;
            }
            if (principal.IsInRole("VenueReader"))
            {
                controller.ViewBag.venueread = true;
            }



            if (principal.IsInRole("VirtualVillageManager"))
            {
                controller.ViewBag.virtualvillageadmin = true;
            }
        }

        public void CheckGBRolesVisible(System.Security.Principal.IPrincipal principal, ResultExecutingContext filterContext)
        {
            var controller = filterContext.Controller as Controller;

            if (principal.IsInRole("DataAdmin"))
            {
                controller.ViewBag.GBConfigVisible = true;

                controller.ViewBag.UserManagementVisible = true;
                controller.ViewBag.RoleManagementVisible = true;
                controller.ViewBag.SyncProfilesVisible = true;
                controller.ViewBag.GBTagsAndTypesVisible = true;
                controller.ViewBag.LTSConfigVisible = true;

                controller.ViewBag.DataVisible = true;
                controller.ViewBag.GeobankVisible = true;
                controller.ViewBag.ExternalDataSourcesVisible = true;

                controller.ViewBag.LocationVisible = true;
                controller.ViewBag.GBPoiVisible = true;
                controller.ViewBag.GBEventVisible = true;
                controller.ViewBag.GBVenueVisible = true;
                controller.ViewBag.GBEventShortVisible = true;
                controller.ViewBag.GBArticleVisible = true;
                controller.ViewBag.GBAccoVisible = true;
                controller.ViewBag.GBPackageVisible = true;
                controller.ViewBag.GBWebcamVisible = true;

                controller.ViewBag.LTSActivityVisible = true;
                controller.ViewBag.LTSPoiVisible = true;
                controller.ViewBag.LTSGastroVisible = true;
                controller.ViewBag.LTSEventVisible = true;
                controller.ViewBag.LTSAccoVisible = true;
                controller.ViewBag.HgvPackageVisible = true;
                controller.ViewBag.SuedtirolWeinVisible = true;
                controller.ViewBag.LTSMeasuringpointsVisible = true;
                controller.ViewBag.SnowReportVisible = true;
                controller.ViewBag.ArchappDataVisible = true;
                controller.ViewBag.SiagMuseumDataVisible = true;
                controller.ViewBag.WeatherVisible = true;
                controller.ViewBag.WebcamVisible = true;
                controller.ViewBag.VenueVisible = true;
            }

            if (principal.IsInRole("DataVisible"))
            {
                controller.ViewBag.DataVisible = true;
                controller.ViewBag.GeobankVisible = true;
                controller.ViewBag.ExternalDataSourcesVisible = true;

                controller.ViewBag.LocationVisible = true;
                controller.ViewBag.GBPoiVisible = true;
                controller.ViewBag.GBEventVisible = true;
                controller.ViewBag.GBVenueVisible = true;
                controller.ViewBag.GBEventShortVisible = true;
                controller.ViewBag.GBArticleVisible = true;
                controller.ViewBag.GBAccoVisible = true;
                controller.ViewBag.GBPackageVisible = true;
                controller.ViewBag.GBWebcamVisible = true;

                controller.ViewBag.LTSActivityVisible = true;
                controller.ViewBag.LTSPoiVisible = true;
                controller.ViewBag.LTSGastroVisible = true;
                controller.ViewBag.LTSEventVisible = true;
                controller.ViewBag.LTSAccoVisible = true;
                controller.ViewBag.HgvPackageVisible = true;
                controller.ViewBag.SuedtirolWeinVisible = true;
                controller.ViewBag.LTSMeasuringpointsVisible = true;
                controller.ViewBag.SnowReportVisible = true;
                controller.ViewBag.ArchappDataVisible = true;
                controller.ViewBag.SiagMuseumDataVisible = true;
                controller.ViewBag.WeatherVisible = true;
                controller.ViewBag.WebcamVisible = true;
                controller.ViewBag.VenueVisible = true;
            }

            if (principal.IsInRole("GBConfigVisible"))
            {
                controller.ViewBag.GBConfigVisible = true;

                controller.ViewBag.UserManagementVisible = true;
                controller.ViewBag.RoleManagementVisible = true;
                controller.ViewBag.SyncProfilesVisible = true;
                controller.ViewBag.GBTagsAndTypesVisible = true;
                controller.ViewBag.LTSConfigVisible = true;
            }

            if (principal.IsInRole("GeobankVisible"))
            {
                controller.ViewBag.GeobankVisible = true;

                controller.ViewBag.LocationVisible = true;
                controller.ViewBag.GBPoiVisible = true;
                controller.ViewBag.GBEventVisible = true;
                controller.ViewBag.GBVenueVisible = true;
                controller.ViewBag.GBEventShortVisible = true;
                controller.ViewBag.GBArticleVisible = true;
                controller.ViewBag.GBAccoVisible = true;
                controller.ViewBag.GBPackageVisible = true;
                controller.ViewBag.GBWebcamVisible = true;
            }

            if (principal.IsInRole("ExternalDataSourcesVisible"))
            {
                controller.ViewBag.ExternalDataSourcesVisible = true;

                controller.ViewBag.LTSActivityVisible = true;
                controller.ViewBag.LTSPoiVisible = true;
                controller.ViewBag.LTSGastroVisible = true;
                controller.ViewBag.LTSEventVisible = true;
                controller.ViewBag.LTSAccoVisible = true;
                controller.ViewBag.HgvPackageVisible = true;
                controller.ViewBag.SuedtirolWeinVisible = true;
                controller.ViewBag.LTSMeasuringpointsVisible = true;
                controller.ViewBag.SnowReportVisible = true;
                controller.ViewBag.ArchappDataVisible = true;
                controller.ViewBag.SiagMuseumDataVisible = true;
                controller.ViewBag.WeatherVisible = true;
                controller.ViewBag.WebcamVisible = true;
                controller.ViewBag.VenueVisible = true;
            }
            //Geobank
            if (principal.IsInRole("LocationVisible"))
            {
                controller.ViewBag.LocationVisible = true;
            }
            if (principal.IsInRole("GBPoiVisible"))
            {
                controller.ViewBag.GBPoiVisible = true;
            }
            if (principal.IsInRole("GBEventVisible"))
            {
                controller.ViewBag.GBEventVisible = true;
            }
            if (principal.IsInRole("GBVenueVisible"))
            {
                controller.ViewBag.GBVenueVisible = true;
            }
            if (principal.IsInRole("EventShortVisible"))
            {
                controller.ViewBag.GBEventShortVisible = true;
            }
            if (principal.IsInRole("GBArticleVisible"))
            {
                controller.ViewBag.GBArticleVisible = true;
            }
            if (principal.IsInRole("GBAccoVisible"))
            {
                controller.ViewBag.GBAccoVisible = true;
            }
            if (principal.IsInRole("GBPackageVisible"))
            {
                controller.ViewBag.GBPackageVisible = true;
            }
            if (principal.IsInRole("GBWebcamVisible"))
            {
                controller.ViewBag.GBWebcamVisible = true;
            }
            //External Data Soruces
            if (principal.IsInRole("LTSActivityVisible"))
            {
                controller.ViewBag.LTSActivityVisible = true;
            }
            if (principal.IsInRole("LTSPoiVisible"))
            {
                controller.ViewBag.LTSPoiVisible = true;
            }
            if (principal.IsInRole("LTSGastroVisible"))
            {
                controller.ViewBag.LTSGastroVisible = true;
            }
            if (principal.IsInRole("LTSEventVisible"))
            {
                controller.ViewBag.LTSEventVisible = true;
            }
            if (principal.IsInRole("LTSAccoVisible"))
            {
                controller.ViewBag.LTSAccoVisible = true;
            }
            if (principal.IsInRole("HgvPackageVisible"))
            {
                controller.ViewBag.HgvPackageVisible = true;
            }
            if (principal.IsInRole("SuedtirolWeinVisible"))
            {
                controller.ViewBag.SuedtirolWeinVisible = true;
            }
            if (principal.IsInRole("LTSMeasuringpointsVisible"))
            {
                controller.ViewBag.LTSMeasuringpointsVisible = true;
            }
            if (principal.IsInRole("SnowReportVisible"))
            {
                controller.ViewBag.SnowReportVisible = true;
            }
            if (principal.IsInRole("WebcamVisible"))
            {
                controller.ViewBag.WebcamVisible = true;
            }
            if (principal.IsInRole("VenueVisible"))
            {
                controller.ViewBag.VenueVisible = true;
            }
            //Config
            if (principal.IsInRole("UserManagementVisible"))
            {
                controller.ViewBag.UserManagementVisible = true;
            }
            if (principal.IsInRole("RoleManagementVisible"))
            {
                controller.ViewBag.RoleManagementVisible = true;
            }
            if (principal.IsInRole("SyncProfilesVisible"))
            {
                controller.ViewBag.SyncProfilesVisible = true;
            }
            if (principal.IsInRole("GBTagsAndTypesVisible"))
            {
                controller.ViewBag.GBTagsAndTypesVisible = true;
            }
            if (principal.IsInRole("LTSConfigVisible"))
            {
                controller.ViewBag.LTSConfigVisible = true;
            }
        }

        public void CheckGBRolesRead(System.Security.Principal.IPrincipal principal, ResultExecutingContext filterContext)
        {
            var controller = filterContext.Controller as Controller;

            if (principal.IsInRole("DataRead"))
            {
                controller.ViewBag.DataRead = true;
                controller.ViewBag.GeobankRead = true;
                controller.ViewBag.ExternalDataSourcesRead = true;

                controller.ViewBag.LocationRead = true;
                controller.ViewBag.GBPoiRead = true;
                controller.ViewBag.GBEventRead = true;
                controller.ViewBag.GBEventShortRead = true;
                controller.ViewBag.GBArticleRead = true;
                controller.ViewBag.GBAccoRead = true;
                controller.ViewBag.GBPackageRead = true;
                controller.ViewBag.GBWebcamRead = true;

                controller.ViewBag.LTSActivityRead = true;
                controller.ViewBag.LTSPoiRead = true;
                controller.ViewBag.LTSGastroRead = true;
                controller.ViewBag.LTSEventRead = true;
                controller.ViewBag.LTSAccoRead = true;
                controller.ViewBag.HgvPackageRead = true;
                controller.ViewBag.SuedtirolWeinRead = true;
                controller.ViewBag.LTSMeasuringpointsRead = true;
                controller.ViewBag.SnowReportRead = true;
                controller.ViewBag.WebcamRead = true;
                controller.ViewBag.VenueRead = true;
            }
            if (principal.IsInRole("GBConfigRead"))
            {
                controller.ViewBag.GBConfigRead = true;

                controller.ViewBag.UserManagementRead = true;
                controller.ViewBag.RoleManagementRead = true;
                controller.ViewBag.SyncProfilesRead = true;
                controller.ViewBag.GBTagsAndTypesRead = true;
                controller.ViewBag.LTSConfigRead = true;
            }
            if (principal.IsInRole("GeobankRead"))
            {
                controller.ViewBag.GeobankRead = true;

                controller.ViewBag.LocationRead = true;
                controller.ViewBag.GBPoiRead = true;
                controller.ViewBag.GBEventRead = true;
                controller.ViewBag.GBEventShortRead = true;
                controller.ViewBag.GBArticleRead = true;
                controller.ViewBag.GBAccoRead = true;
                controller.ViewBag.GBPackageRead = true;
                controller.ViewBag.GBWebcamRead = true;
            }
            if (principal.IsInRole("ExternalDataSourcesRead"))
            {
                controller.ViewBag.ExternalDataSourcesRead = true;

                controller.ViewBag.LTSActivityRead = true;
                controller.ViewBag.LTSPoiRead = true;
                controller.ViewBag.LTSGastroRead = true;
                controller.ViewBag.LTSEventRead = true;
                controller.ViewBag.LTSAccoRead = true;
                controller.ViewBag.HgvPackageRead = true;
                controller.ViewBag.SuedtirolWeinRead = true;
                controller.ViewBag.LTSMeasuringpointsRead = true;
                controller.ViewBag.SnowReportRead = true;
                controller.ViewBag.WebcamRead = true;
                controller.ViewBag.VenueRead = true;
            }
            //Geobank
            if (principal.IsInRole("LocationRead"))
            {
                controller.ViewBag.LocationRead = true;
            }
            if (principal.IsInRole("GBPoiRead"))
            {
                controller.ViewBag.GBPoiRead = true;
            }
            if (principal.IsInRole("GBEventRead"))
            {
                controller.ViewBag.GBEventRead = true;
            }
            if (principal.IsInRole("GBEventShortRead"))
            {
                controller.ViewBag.GBEventShortRead = true;
            }
            if (principal.IsInRole("GBArticleRead"))
            {
                controller.ViewBag.GBArticleRead = true;
            }
            if (principal.IsInRole("GBAccoRead"))
            {
                controller.ViewBag.GBAccoRead = true;
            }
            if (principal.IsInRole("GBPackageRead"))
            {
                controller.ViewBag.GBPackageRead = true;
            }
            if (principal.IsInRole("GBWebcamRead"))
            {
                controller.ViewBag.GBWebcamRead = true;
            }
            //External Data Soruces
            if (principal.IsInRole("LTSActivityRead"))
            {
                controller.ViewBag.LTSActivityRead = true;
            }
            if (principal.IsInRole("LTSPoiRead"))
            {
                controller.ViewBag.LTSPoiRead = true;
            }
            if (principal.IsInRole("LTSGastroRead"))
            {
                controller.ViewBag.LTSGastroRead = true;
            }
            if (principal.IsInRole("LTSEventRead"))
            {
                controller.ViewBag.LTSEventRead = true;
            }
            if (principal.IsInRole("LTSAccoRead"))
            {
                controller.ViewBag.LTSAccoRead = true;
            }
            if (principal.IsInRole("HgvPackageRead"))
            {
                controller.ViewBag.HgvPackageRead = true;
            }
            if (principal.IsInRole("SuedtirolWeinRead"))
            {
                controller.ViewBag.SuedtirolWeinRead = true;
            }
            if (principal.IsInRole("LTSMeasuringpointsRead"))
            {
                controller.ViewBag.LTSMeasuringpointsRead = true;
            }
            if (principal.IsInRole("SnowReportRead"))
            {
                controller.ViewBag.SnowReportRead = true;
            }
            if (principal.IsInRole("WebcamRead"))
            {
                controller.ViewBag.WebcamRead = true;
            }
            if (principal.IsInRole("VenueRead"))
            {
                controller.ViewBag.VenueRead = true;
            }
            //Config
            if (principal.IsInRole("UserManagementRead"))
            {
                controller.ViewBag.UserManagementRead = true;
            }
            if (principal.IsInRole("RoleManagementRead"))
            {
                controller.ViewBag.RoleManagementRead = true;
            }
            if (principal.IsInRole("SyncProfilesRead"))
            {
                controller.ViewBag.SyncProfilesRead = true;
            }
            if (principal.IsInRole("GBTagsAndTypesRead"))
            {
                controller.ViewBag.GBTagsAndTypesRead = true;
            }
            if (principal.IsInRole("LTSConfigRead"))
            {
                controller.ViewBag.LTSConfigRead = true;
            }
        }

        public void CheckGBRolesWrite(System.Security.Principal.IPrincipal principal, ResultExecutingContext filterContext)
        {
            var controller = filterContext.Controller as Controller;

            if (principal.IsInRole("DataWrite"))
            {
                controller.ViewBag.DataWrite = true;
                controller.ViewBag.GeobankWrite = true;
                controller.ViewBag.ExternalDataSourcesWrite = true;

                controller.ViewBag.LocationWrite = true;
                controller.ViewBag.GBPoiWrite = true;
                controller.ViewBag.GBEventWrite = true;
                controller.ViewBag.GBEventShortWrite = true;
                controller.ViewBag.GBArticleWrite = true;
                controller.ViewBag.GBAccoWrite = true;
                controller.ViewBag.GBPackageWrite = true;
                controller.ViewBag.GBWebcamWrite = true;

                controller.ViewBag.LTSActivityWrite = true;
                controller.ViewBag.LTSPoiWrite = true;
                controller.ViewBag.LTSGastroWrite = true;
                controller.ViewBag.LTSEventWrite = true;
                controller.ViewBag.LTSAccoWrite = true;
                controller.ViewBag.HgvPackageWrite = true;
                controller.ViewBag.SuedtirolWeinWrite = true;
                controller.ViewBag.LTSMeasuringpointsWrite = true;
                controller.ViewBag.SnowReportWrite = true;
                controller.ViewBag.WebcamWrite = true;
                controller.ViewBag.VenueWrite = true;
            }
            if (principal.IsInRole("GBConfigWrite"))
            {
                controller.ViewBag.GBConfigWrite = true;

                controller.ViewBag.UserManagementWrite = true;
                controller.ViewBag.RoleManagementWrite = true;
                controller.ViewBag.SyncProfilesWrite = true;
                controller.ViewBag.GBTagsAndTypesWrite = true;
                controller.ViewBag.LTSConfigWrite = true;
            }
            if (principal.IsInRole("GeobankWrite"))
            {
                controller.ViewBag.GeobankWrite = true;

                controller.ViewBag.LocationWrite = true;
                controller.ViewBag.GBPoiWrite = true;
                controller.ViewBag.GBEventWrite = true;
                controller.ViewBag.GBEventShortWrite = true;
                controller.ViewBag.GBArticleWrite = true;
                controller.ViewBag.GBAccoWrite = true;
                controller.ViewBag.GBPackageWrite = true;
                controller.ViewBag.GBWebcamWrite = true;
            }
            if (principal.IsInRole("ExternalDataSourcesWrite"))
            {
                controller.ViewBag.ExternalDataSourcesWrite = true;

                controller.ViewBag.LTSActivityWrite = true;
                controller.ViewBag.LTSPoiWrite = true;
                controller.ViewBag.LTSGastroWrite = true;
                controller.ViewBag.LTSEventWrite = true;
                controller.ViewBag.LTSAccoWrite = true;
                controller.ViewBag.HgvPackageWrite = true;
                controller.ViewBag.SuedtirolWeinWrite = true;
                controller.ViewBag.LTSMeasuringpointsWrite = true;
                controller.ViewBag.SnowReportWrite = true;
                controller.ViewBag.WebcamWrite = true;
                controller.ViewBag.VenueWrite = true;
            }
            //Geobank
            if (principal.IsInRole("LocationWrite"))
            {
                controller.ViewBag.LocationWrite = true;
            }
            if (principal.IsInRole("GBPoiWrite"))
            {
                controller.ViewBag.GBPoiWrite = true;
            }
            if (principal.IsInRole("GBEventWrite"))
            {
                controller.ViewBag.GBEventWrite = true;
            }
            if (principal.IsInRole("GBEventShortWrite"))
            {
                controller.ViewBag.GBEventShortWrite = true;
            }
            if (principal.IsInRole("GBArticleWrite"))
            {
                controller.ViewBag.GBArticleWrite = true;
            }
            if (principal.IsInRole("GBAccoWrite"))
            {
                controller.ViewBag.GBAccoWrite = true;
            }
            if (principal.IsInRole("GBPackageWrite"))
            {
                controller.ViewBag.GBPackageWrite = true;
            }
            if (principal.IsInRole("GBWebcamWrite"))
            {
                controller.ViewBag.GBWebcamWrite = true;
            }
            //External Data Soruces
            if (principal.IsInRole("LTSActivityWrite"))
            {
                controller.ViewBag.LTSActivityWrite = true;
            }
            if (principal.IsInRole("LTSPoiWrite"))
            {
                controller.ViewBag.LTSPoiWrite = true;
            }
            if (principal.IsInRole("LTSGastroWrite"))
            {
                controller.ViewBag.LTSGastroWrite = true;
            }
            if (principal.IsInRole("LTSEventWrite"))
            {
                controller.ViewBag.LTSEventWrite = true;
            }
            if (principal.IsInRole("LTSAccoWrite"))
            {
                controller.ViewBag.LTSAccoWrite = true;
            }
            if (principal.IsInRole("HgvPackageWrite"))
            {
                controller.ViewBag.HgvPackageWrite = true;
            }
            if (principal.IsInRole("SuedtirolWeinWrite"))
            {
                controller.ViewBag.SuedtirolWeinWrite = true;
            }
            if (principal.IsInRole("LTSMeasuringpointsWrite"))
            {
                controller.ViewBag.LTSMeasuringpointsWrite = true;
            }
            if (principal.IsInRole("SnowReportWrite"))
            {
                controller.ViewBag.SnowReportWrite = true;
            }
            if (principal.IsInRole("WebcamWrite"))
            {
                controller.ViewBag.WebcamWrite = true;
            }
            if (principal.IsInRole("VenueWrite"))
            {
                controller.ViewBag.VenueWrite = true;
            }
            //Config
            if (principal.IsInRole("UserManagementWrite"))
            {
                controller.ViewBag.UserManagementWrite = true;
            }
            if (principal.IsInRole("RoleManagementWrite"))
            {
                controller.ViewBag.RoleManagementWrite = true;
            }
            if (principal.IsInRole("SyncProfilesWrite"))
            {
                controller.ViewBag.SyncProfilesWrite = true;
            }
            if (principal.IsInRole("GBTagsAndTypesWrite"))
            {
                controller.ViewBag.GBTagsAndTypesWrite = true;
            }
            if (principal.IsInRole("LTSConfigWrite"))
            {
                controller.ViewBag.LTSConfigWrite = true;
            }
        }

        public void CheckGBRolesUpdate(System.Security.Principal.IPrincipal principal, ResultExecutingContext filterContext)
        {
            var controller = filterContext.Controller as Controller;

            if (principal.IsInRole("DataUpdate"))
            {
                controller.ViewBag.DataUpdate = true;
                controller.ViewBag.GeobankUpdate = true;
                controller.ViewBag.ExternalDataSourcesUpdate = true;

                controller.ViewBag.LocationUpdate = true;
                controller.ViewBag.GBPoiUpdate = true;
                controller.ViewBag.GBEventUpdate = true;
                controller.ViewBag.GBEventShortUpdate = true;
                controller.ViewBag.GBArticleUpdate = true;
                controller.ViewBag.GBAccoUpdate = true;
                controller.ViewBag.GBPackageUpdate = true;
                controller.ViewBag.GBWebcamUpdate = true;

                controller.ViewBag.LTSActivityUpdate = true;
                controller.ViewBag.LTSPoiUpdate = true;
                controller.ViewBag.LTSGastroUpdate = true;
                controller.ViewBag.LTSEventUpdate = true;
                controller.ViewBag.LTSAccoUpdate = true;
                controller.ViewBag.HgvPackageUpdate = true;
                controller.ViewBag.SuedtirolWeinUpdate = true;
                controller.ViewBag.LTSMeasuringpointsUpdate = true;
                controller.ViewBag.SnowReportUpdate = true;
                controller.ViewBag.WebcamUpdate = true;
                controller.ViewBag.VenueUpdate = true;
            }
            if (principal.IsInRole("GBConfigUpdate"))
            {
                controller.ViewBag.GBConfigUpdate = true;

                controller.ViewBag.UserManagementUpdate = true;
                controller.ViewBag.RoleManagementUpdate = true;
                controller.ViewBag.SyncProfilesUpdate = true;
                controller.ViewBag.GBTagsAndTypesUpdate = true;
                controller.ViewBag.LTSConfigUpdate = true;
            }
            if (principal.IsInRole("GeobankUpdate"))
            {
                controller.ViewBag.GeobankUpdate = true;

                controller.ViewBag.LocationUpdate = true;
                controller.ViewBag.GBPoiUpdate = true;
                controller.ViewBag.GBEventUpdate = true;
                controller.ViewBag.GBEventShortUpdate = true;
                controller.ViewBag.GBArticleUpdate = true;
                controller.ViewBag.GBAccoUpdate = true;
                controller.ViewBag.GBPackageUpdate = true;
                controller.ViewBag.GBWebcamUpdate = true;
            }
            if (principal.IsInRole("ExternalDataSourcesUpdate"))
            {
                controller.ViewBag.ExternalDataSourcesUpdate = true;

                controller.ViewBag.LTSActivityUpdate = true;
                controller.ViewBag.LTSPoiUpdate = true;
                controller.ViewBag.LTSGastroUpdate = true;
                controller.ViewBag.LTSEventUpdate = true;
                controller.ViewBag.LTSAccoUpdate = true;
                controller.ViewBag.HgvPackageUpdate = true;
                controller.ViewBag.SuedtirolWeinUpdate = true;
                controller.ViewBag.LTSMeasuringpointsUpdate = true;
                controller.ViewBag.SnowReportUpdate = true;
                controller.ViewBag.WebcamUpdate = true;
                controller.ViewBag.VenueUpdate = true;
            }
            //Geobank
            if (principal.IsInRole("LocationUpdate"))
            {
                controller.ViewBag.LocationUpdate = true;
            }
            if (principal.IsInRole("GBPoiUpdate"))
            {
                controller.ViewBag.GBPoiUpdate = true;
            }
            if (principal.IsInRole("GBEventUpdate"))
            {
                controller.ViewBag.GBEventUpdate = true;
            }
            if (principal.IsInRole("GBEventShortUpdate"))
            {
                controller.ViewBag.GBEventShortUpdate = true;
            }
            if (principal.IsInRole("GBArticleUpdate"))
            {
                controller.ViewBag.GBArticleUpdate = true;
            }
            if (principal.IsInRole("GBAccoUpdate"))
            {
                controller.ViewBag.GBAccoUpdate = true;
            }
            if (principal.IsInRole("GBPackageUpdate"))
            {
                controller.ViewBag.GBPackageUpdate = true;
            }
            if (principal.IsInRole("GBWebcamUpdate"))
            {
                controller.ViewBag.GBWebcamUpdate = true;
            }
            //External Data Soruces
            if (principal.IsInRole("LTSActivityUpdate"))
            {
                controller.ViewBag.LTSActivityUpdate = true;
            }
            if (principal.IsInRole("LTSPoiUpdate"))
            {
                controller.ViewBag.LTSPoiUpdate = true;
            }
            if (principal.IsInRole("LTSGastroUpdate"))
            {
                controller.ViewBag.LTSGastroUpdate = true;
            }
            if (principal.IsInRole("LTSEventUpdate"))
            {
                controller.ViewBag.LTSEventUpdate = true;
            }
            if (principal.IsInRole("LTSAccoUpdate"))
            {
                controller.ViewBag.LTSAccoUpdate = true;
            }
            if (principal.IsInRole("HgvPackageUpdate"))
            {
                controller.ViewBag.HgvPackageUpdate = true;
            }
            if (principal.IsInRole("SuedtirolWeinUpdate"))
            {
                controller.ViewBag.SuedtirolWeinUpdate = true;
            }
            if (principal.IsInRole("LTSMeasuringpointsUpdate"))
            {
                controller.ViewBag.LTSMeasuringpointsUpdate = true;
            }
            if (principal.IsInRole("SnowReportUpdate"))
            {
                controller.ViewBag.SnowReportUpdate = true;
            }
            if (principal.IsInRole("WebcamUpdate"))
            {
                controller.ViewBag.WebcamUpdate = true;
            }
            if (principal.IsInRole("VenueUpdate"))
            {
                controller.ViewBag.VenueUpdate = true;
            }
            //Config
            if (principal.IsInRole("UserManagementUpdate"))
            {
                controller.ViewBag.UserManagementUpdate = true;
            }
            if (principal.IsInRole("RoleManagementUpdate"))
            {
                controller.ViewBag.RoleManagementUpdate = true;
            }
            if (principal.IsInRole("SyncProfilesUpdate"))
            {
                controller.ViewBag.SyncProfilesUpdate = true;
            }
            if (principal.IsInRole("GBTagsAndTypesUpdate"))
            {
                controller.ViewBag.GBTagsAndTypesUpdate = true;
            }
            if (principal.IsInRole("LTSConfigUpdate"))
            {
                controller.ViewBag.LTSConfigUpdate = true;
            }
        }

        public void CheckGBRolesDelete(System.Security.Principal.IPrincipal principal, ResultExecutingContext filterContext)
        {
            var controller = filterContext.Controller as Controller;

            if (principal.IsInRole("DataDelete"))
            {
                controller.ViewBag.DataDelete = true;
                controller.ViewBag.GeobankDelete = true;
                controller.ViewBag.ExternalDataSourcesDelete = true;

                controller.ViewBag.LocationDelete = true;
                controller.ViewBag.GBPoiDelete = true;
                controller.ViewBag.GBEventDelete = true;
                controller.ViewBag.GBEventShortDelete = true;
                controller.ViewBag.GBArticleDelete = true;
                controller.ViewBag.GBAccoDelete = true;
                controller.ViewBag.GBPackageDelete = true;
                controller.ViewBag.GBWebcamDelete = true;

                controller.ViewBag.LTSActivityDelete = true;
                controller.ViewBag.LTSPoiDelete = true;
                controller.ViewBag.LTSGastroDelete = true;
                controller.ViewBag.LTSEventDelete = true;
                controller.ViewBag.LTSAccoDelete = true;
                controller.ViewBag.HgvPackageDelete = true;
                controller.ViewBag.SuedtirolWeinDelete = true;
                controller.ViewBag.LTSMeasuringpointsDelete = true;
                controller.ViewBag.SnowReportDelete = true;
                controller.ViewBag.WebcamDelete = true;
                controller.ViewBag.VenueDelete = true;
            }
            if (principal.IsInRole("GBConfigDelete"))
            {
                controller.ViewBag.GBConfigDelete = true;

                controller.ViewBag.UserManagementDelete = true;
                controller.ViewBag.RoleManagementDelete = true;
                controller.ViewBag.SyncProfilesDelete = true;
                controller.ViewBag.GBTagsAndTypesDelete = true;
                controller.ViewBag.LTSConfigDelete = true;
            }
            if (principal.IsInRole("GeobankDelete"))
            {
                controller.ViewBag.GeobankDelete = true;

                controller.ViewBag.LocationDelete = true;
                controller.ViewBag.GBPoiDelete = true;
                controller.ViewBag.GBEventDelete = true;
                controller.ViewBag.GBEventShortDelete = true;
                controller.ViewBag.GBArticleDelete = true;
                controller.ViewBag.GBAccoDelete = true;
                controller.ViewBag.GBPackageDelete = true;
                controller.ViewBag.GBWebcamDelete = true;
            }
            if (principal.IsInRole("ExternalDataSourcesDelete"))
            {
                controller.ViewBag.ExternalDataSourcesDelete = true;

                controller.ViewBag.LTSActivityDelete = true;
                controller.ViewBag.LTSPoiDelete = true;
                controller.ViewBag.LTSGastroDelete = true;
                controller.ViewBag.LTSEventDelete = true;
                controller.ViewBag.LTSAccoDelete = true;
                controller.ViewBag.HgvPackageDelete = true;
                controller.ViewBag.SuedtirolWeinDelete = true;
                controller.ViewBag.LTSMeasuringpointsDelete = true;
                controller.ViewBag.SnowReportDelete = true;
                controller.ViewBag.WebcamDelete = true;
                controller.ViewBag.VenueDelete = true;
            }
            //Geobank
            if (principal.IsInRole("LocationDelete"))
            {
                controller.ViewBag.LocationDelete = true;
            }
            if (principal.IsInRole("GBPoiDelete"))
            {
                controller.ViewBag.GBPoiDelete = true;
            }
            if (principal.IsInRole("GBEventDelete"))
            {
                controller.ViewBag.GBEventDelete = true;
            }
            if (principal.IsInRole("GBEventShortDelete"))
            {
                controller.ViewBag.GBEventShortDelete = true;
            }
            if (principal.IsInRole("GBArticleDelete"))
            {
                controller.ViewBag.GBArticleDelete = true;
            }
            if (principal.IsInRole("GBAccoDelete"))
            {
                controller.ViewBag.GBAccoDelete = true;
            }
            if (principal.IsInRole("GBPackageDelete"))
            {
                controller.ViewBag.GBPackageDelete = true;
            }
            if (principal.IsInRole("GBWebcamDelete"))
            {
                controller.ViewBag.GBWebcamDelete = true;
            }
            //External Data Soruces
            if (principal.IsInRole("LTSActivityDelete"))
            {
                controller.ViewBag.LTSActivityDelete = true;
            }
            if (principal.IsInRole("LTSPoiDelete"))
            {
                controller.ViewBag.LTSPoiDelete = true;
            }
            if (principal.IsInRole("LTSGastroDelete"))
            {
                controller.ViewBag.LTSGastroDelete = true;
            }
            if (principal.IsInRole("LTSEventDelete"))
            {
                controller.ViewBag.LTSEventDelete = true;
            }
            if (principal.IsInRole("LTSAccoDelete"))
            {
                controller.ViewBag.LTSAccoDelete = true;
            }
            if (principal.IsInRole("HgvPackageDelete"))
            {
                controller.ViewBag.HgvPackageDelete = true;
            }
            if (principal.IsInRole("SuedtirolWeinDelete"))
            {
                controller.ViewBag.SuedtirolWeinDelete = true;
            }
            if (principal.IsInRole("LTSMeasuringpointsDelete"))
            {
                controller.ViewBag.LTSMeasuringpointsDelete = true;
            }
            if (principal.IsInRole("SnowReportDelete"))
            {
                controller.ViewBag.SnowReportDelete = true;
            }
            if (principal.IsInRole("WebcamDelete"))
            {
                controller.ViewBag.WebcamDelete = true;
            }
            if (principal.IsInRole("VenueDelete"))
            {
                controller.ViewBag.VenueDelete = true;
            }
            //Config
            if (principal.IsInRole("UserManagementDelete"))
            {
                controller.ViewBag.UserManagementDelete = true;
            }
            if (principal.IsInRole("RoleManagementDelete"))
            {
                controller.ViewBag.RoleManagementDelete = true;
            }
            if (principal.IsInRole("SyncProfilesDelete"))
            {
                controller.ViewBag.SyncProfilesDelete = true;
            }
            if (principal.IsInRole("GBTagsAndTypesDelete"))
            {
                controller.ViewBag.GBTagsAndTypesDelete = true;
            }
            if (principal.IsInRole("LTSConfigDelete"))
            {
                controller.ViewBag.LTSConfigDelete = true;
            }
        }

        public void CheckGBRolesSync(System.Security.Principal.IPrincipal principal, ResultExecutingContext filterContext)
        {
            var controller = filterContext.Controller as Controller;

            if (principal.IsInRole("DataSync"))
            {
                controller.ViewBag.DataSync = true;
                controller.ViewBag.GeobankSync = true;
                controller.ViewBag.ExternalDataSourcesSync = true;

                controller.ViewBag.LocationSync = true;
                controller.ViewBag.GBPoiSync = true;
                controller.ViewBag.GBEventSync = true;
                controller.ViewBag.GBEventShortSync = true;
                controller.ViewBag.GBArticleSync = true;
                controller.ViewBag.GBAccoSync = true;
                controller.ViewBag.GBPackageSync = true;
                controller.ViewBag.GBWebcamSync = true;

                controller.ViewBag.LTSActivitySync = true;
                controller.ViewBag.LTSPoiSync = true;
                controller.ViewBag.LTSGastroSync = true;
                controller.ViewBag.LTSEventSync = true;
                controller.ViewBag.LTSAccoSync = true;
                controller.ViewBag.HgvPackageSync = true;
                controller.ViewBag.SuedtirolWeinSync = true;
                controller.ViewBag.LTSMeasuringpointsSync = true;
                controller.ViewBag.SnowReportSync = true;
                controller.ViewBag.WebcamSync = true;
                controller.ViewBag.VenueSync = true;
            }
            if (principal.IsInRole("GBConfigSync"))
            {
                controller.ViewBag.GBConfigSync = true;

                controller.ViewBag.UserManagementSync = true;
                controller.ViewBag.RoleManagementSync = true;
                controller.ViewBag.SyncProfilesSync = true;
                controller.ViewBag.GBTagsAndTypesSync = true;
                controller.ViewBag.LTSConfigSync = true;
            }
            if (principal.IsInRole("GeobankSync"))
            {
                controller.ViewBag.GeobankSync = true;

                controller.ViewBag.LocationSync = true;
                controller.ViewBag.GBPoiSync = true;
                controller.ViewBag.GBEventSync = true;
                controller.ViewBag.GBEventShortSync = true;
                controller.ViewBag.GBArticleSync = true;
                controller.ViewBag.GBAccoSync = true;
                controller.ViewBag.GBPackageSync = true;
                controller.ViewBag.GBWebcamSync = true;
            }
            if (principal.IsInRole("ExternalDataSourcesSync"))
            {
                controller.ViewBag.ExternalDataSourcesSync = true;

                controller.ViewBag.LTSActivitySync = true;
                controller.ViewBag.LTSPoiSync = true;
                controller.ViewBag.LTSGastroSync = true;
                controller.ViewBag.LTSEventSync = true;
                controller.ViewBag.LTSAccoSync = true;
                controller.ViewBag.HgvPackageSync = true;
                controller.ViewBag.SuedtirolWeinSync = true;
                controller.ViewBag.LTSMeasuringpointsSync = true;
                controller.ViewBag.SnowReportSync = true;
                controller.ViewBag.WebcamSync = true;
                controller.ViewBag.VenueSync = true;
            }
            //Geobank
            if (principal.IsInRole("LocationSync"))
            {
                controller.ViewBag.LocationSync = true;
            }
            if (principal.IsInRole("GBPoiSync"))
            {
                controller.ViewBag.GBPoiSync = true;
            }
            if (principal.IsInRole("GBEventSync"))
            {
                controller.ViewBag.GBEventSync = true;
            }
            if (principal.IsInRole("GBEventShortSync"))
            {
                controller.ViewBag.GBEventShortSync = true;
            }
            if (principal.IsInRole("GBArticleSync"))
            {
                controller.ViewBag.GBArticleSync = true;
            }
            if (principal.IsInRole("GBAccoSync"))
            {
                controller.ViewBag.GBAccoSync = true;
            }
            if (principal.IsInRole("GBPackageSync"))
            {
                controller.ViewBag.GBPackageSync = true;
            }
            if (principal.IsInRole("GBWebcamSync"))
            {
                controller.ViewBag.GBWebcamSync = true;
            }
            //External Data Soruces
            if (principal.IsInRole("LTSActivitySync"))
            {
                controller.ViewBag.LTSActivitySync = true;
            }
            if (principal.IsInRole("LTSPoiSync"))
            {
                controller.ViewBag.LTSPoiSync = true;
            }
            if (principal.IsInRole("LTSGastroSync"))
            {
                controller.ViewBag.LTSGastroSync = true;
            }
            if (principal.IsInRole("LTSEventSync"))
            {
                controller.ViewBag.LTSEventSync = true;
            }
            if (principal.IsInRole("LTSAccoSync"))
            {
                controller.ViewBag.LTSAccoSync = true;
            }
            if (principal.IsInRole("HgvPackageSync"))
            {
                controller.ViewBag.HgvPackageSync = true;
            }
            if (principal.IsInRole("SuedtirolWeinSync"))
            {
                controller.ViewBag.SuedtirolWeinSync = true;
            }
            if (principal.IsInRole("LTSMeasuringpointsSync"))
            {
                controller.ViewBag.LTSMeasuringpointsSync = true;
            }
            if (principal.IsInRole("SnowReportSync"))
            {
                controller.ViewBag.SnowReportSync = true;
            }
            if (principal.IsInRole("WebcamSync"))
            {
                controller.ViewBag.WebcamSync = true;
            }
            if (principal.IsInRole("VenueSync"))
            {
                controller.ViewBag.VenueSync = true;
            }
            //Config
            if (principal.IsInRole("UserManagementSync"))
            {
                controller.ViewBag.UserManagementSync = true;
            }
            if (principal.IsInRole("RoleManagementSync"))
            {
                controller.ViewBag.RoleManagementSync = true;
            }
            if (principal.IsInRole("SyncProfilesSync"))
            {
                controller.ViewBag.SyncProfilesSync = true;
            }
            if (principal.IsInRole("GBTagsAndTypesSync"))
            {
                controller.ViewBag.GBTagsAndTypesSync = true;
            }
            if (principal.IsInRole("LTSConfigSync"))
            {
                controller.ViewBag.LTSConfigSync = true;
            }
        }

        //public void CheckLocations(System.Security.Principal.IPrincipal principal, ResultExecutingContext filterContext)
        //{
        //    //Zuerst Check ob User überhaupt ein TV ist
        //    if (principal.IsInRole("TV"))
        //    {

        //        WindowsIdentity identity = (WindowsIdentity)principal.Identity;

        //        var hostname = identity.Name.Substring(0, identity.Name.LastIndexOf("\\"));

        //        var groupNames = identity.Groups.Select(x => x.Translate(typeof(NTAccount)).Value).Where(y => y.StartsWith(hostname)).Select(z => z.Replace(hostname + "\\", ""));

        //        var mylocationfilter = groupNames.Where(x => x.StartsWith("TV-")).FirstOrDefault();

        //        if (!String.IsNullOrEmpty(mylocationfilter))
        //        {
        //            controller.ViewBag.isTV = true;
        //            controller.ViewBag.predefinedlocationfilter = mylocationfilter.Substring(3);
        //            controller.ViewBag.predefinedlocationfiltertyp = "tvs";
        //        }
        //    }
        //    if (principal.IsInRole("TVB"))
        //    {
        //        WindowsIdentity identity = (WindowsIdentity)principal.Identity;

        //        var hostname = identity.Name.Substring(0, identity.Name.LastIndexOf("\\"));

        //        var groupNames = identity.Groups.Select(x => x.Translate(typeof(NTAccount)).Value).Where(y => y.StartsWith(hostname)).Select(z => z.Replace(hostname + "\\", ""));

        //        var mylocationfilter = groupNames.Where(x => x.StartsWith("TVB-")).FirstOrDefault();

        //        if (!String.IsNullOrEmpty(mylocationfilter))
        //        {
        //            controller.ViewBag.isTVB = true;
        //            controller.ViewBag.predefinedlocationfilter = mylocationfilter.Substring(4);
        //            controller.ViewBag.predefinedlocationfiltertyp = "reg";
        //        }
        //    }

        //}
    }
}
