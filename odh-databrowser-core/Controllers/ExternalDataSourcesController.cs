// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;

namespace SuedtirolManagerPG.Controllers
{
    public class ExternalDataSourcesController : Controller
    {
        #region LTS Activites        

        //[Authorize(Roles = "DataVisible,ExternalDataSourcesVisible,LTSActivityVisible")]
        public ActionResult AllActivitiesList()
        {
            return View("~/Views/ExternalDataSources/LTSActivityData/AllActivitiesList.cshtml");
        }

        //[Authorize(Roles = "DataVisible,ExternalDataSourcesVisible,LTSActivityVisible")]
        public ActionResult AlpineList()
        {
            return View("~/Views/ExternalDataSources/LTSActivityData/AlpineList.cshtml");
        }

        //[Authorize(Roles = "DataVisible,ExternalDataSourcesVisible,LTSActivityVisible")]
        public ActionResult BikeList()
        {
            return View("~/Views/ExternalDataSources/LTSActivityData/BikeList.cshtml");
        }

        //[Authorize(Roles = "DataVisible,ExternalDataSourcesVisible,LTSActivityVisible")]
        public ActionResult HikeList()
        {
            return View("~/Views/ExternalDataSources/LTSActivityData/HikeList.cshtml");
        }

        //[Authorize(Roles = "DataVisible,ExternalDataSourcesVisible,LTSActivityVisible")]
        public ActionResult RunningFitnessList()
        {
            return View("~/Views/ExternalDataSources/LTSActivityData/RunningFitnessList.cshtml");
        }

        //[Authorize(Roles = "DataVisible,ExternalDataSourcesVisible,LTSActivityVisible")]
        public ActionResult SlopeList()
        {
            return View("~/Views/ExternalDataSources/LTSActivityData/SlopeList.cshtml");
        }

        //[Authorize(Roles = "DataVisible,ExternalDataSourcesVisible,LTSActivityVisible")]
        public ActionResult SkitrackList()
        {
            return View("~/Views/ExternalDataSources/LTSActivityData/SkitrackList.cshtml");
        }

        //[Authorize(Roles = "DataVisible,ExternalDataSourcesVisible,LTSActivityVisible")]
        public ActionResult LiftList()
        {
            return View("~/Views/ExternalDataSources/LTSActivityData/LiftList.cshtml");
        }

        //[Authorize(Roles = "DataVisible,ExternalDataSourcesVisible,LTSActivityVisible")]
        public ActionResult SlideList()
        {
            return View("~/Views/ExternalDataSources/LTSActivityData/SlideList.cshtml");
        }

        //[Authorize(Roles = "DataVisible,ExternalDataSourcesVisible,LTSActivityVisible")]
        public ActionResult CityTourList()
        {
            return View("~/Views/ExternalDataSources/LTSActivityData/CityTourList.cshtml");
        }

        //[Authorize(Roles = "DataVisible,ExternalDataSourcesVisible,LTSActivityVisible")]
        public ActionResult EquestrianismList()
        {
            return View("~/Views/ExternalDataSources/LTSActivityData/EquestrianismList.cshtml");
        }

        #endregion

        #region LTS Pois

        //[Authorize(Roles = "DataVisible,ExternalDataSourcesVisible,LTSPoiVisible")]
        public ActionResult AllPoisList()
        {
            return View("~/Views/ExternalDataSources/LTSPoiData/AllPoisList.cshtml");
        }

        //[Authorize(Roles = "DataVisible,ExternalDataSourcesVisible,LTSPoiVisible")]
        public ActionResult NightlifeList()
        {
            return View("~/Views/ExternalDataSources/LTSPoiData/NightlifeList.cshtml");
        }

        //[Authorize(Roles = "DataVisible,ExternalDataSourcesVisible,LTSPoiVisible")]
        public ActionResult MobilityTrafficList()
        {
            return View("~/Views/ExternalDataSources/LTSPoiData/MobilityTrafficList.cshtml");
        }

        //[Authorize(Roles = "DataVisible,ExternalDataSourcesVisible,LTSPoiVisible")]
        public ActionResult ActiveList()
        {
            return View("~/Views/ExternalDataSources/LTSPoiData/ActiveList.cshtml");
        }

        //[Authorize(Roles = "DataVisible,ExternalDataSourcesVisible,LTSPoiVisible")]
        public ActionResult ServiceList()
        {
            return View("~/Views/ExternalDataSources/LTSPoiData/ServiceList.cshtml");
        }

        //[Authorize(Roles = "DataVisible,ExternalDataSourcesVisible,LTSPoiVisible")]
        public ActionResult SightseenList()
        {
            return View("~/Views/ExternalDataSources/LTSPoiData/SightseenList.cshtml");
        }

        //[Authorize(Roles = "DataVisible,ExternalDataSourcesVisible,LTSPoiVisible")]
        public ActionResult ShopList()
        {
            return View("~/Views/ExternalDataSources/LTSPoiData/ShopList.cshtml");
        }

        //[Authorize(Roles = "DataVisible,ExternalDataSourcesVisible,LTSPoiVisible")]
        public ActionResult ArtisanList()
        {
            return View("~/Views/ExternalDataSources/LTSPoiData/ArtisanList.cshtml");
        }

        //[Authorize(Roles = "DataVisible,ExternalDataSourcesVisible,LTSPoiVisible")]
        public ActionResult ServiceProviderList()
        {
            return View("~/Views/ExternalDataSources/LTSPoiData/ServiceProviderList.cshtml");
        }

        //[Authorize(Roles = "DataVisible,ExternalDataSourcesVisible,LTSPoiVisible")]
        public ActionResult HealthList()
        {
            return View("~/Views/ExternalDataSources/LTSPoiData/HealthList.cshtml");
        }

        public ActionResult CompaniesList()
        {
            return View("~/Views/ExternalDataSources/LTSPoiData/CompaniesList.cshtml");
        }

        public ActionResult AssociationsList()
        {
            return View("~/Views/ExternalDataSources/LTSPoiData/AssociationsList.cshtml");
        }

        #endregion

        #region LTS Gastronomies

        //[Authorize(Roles = "DataVisible,ExternalDataSourcesVisible,LTSGastroVisible")]
        public ActionResult GastronomyList()
        {
            return View("~/Views/ExternalDataSources/LTSGastronomyData/GastronomyList.cshtml");
        }

        #endregion

        #region LTS Events

        //[Authorize(Roles = "DataVisible,ExternalDataSourcesVisible,LTSEventVisible")]
        public ActionResult EventList()
        {
            return View("~/Views/ExternalDataSources/LTSEventData/EventList.cshtml");
        }

        #endregion

        #region LTS Accommodations

        //[Authorize(Roles = "DataVisible,ExternalDataSourcesVisible,LTSAccoVisible")]
        public ActionResult AccommodationSimpleList()
        {
            return View("~/Views/ExternalDataSources/LTSAccommodationData/AccommodationSimpleList.cshtml");
        }

        //[Authorize(Roles = "DataVisible,ExternalDataSourcesVisible,LTSAccoRoomVisible")]
        public ActionResult AccommodationRoomList()
        {
            return View("~/Views/ExternalDataSources/LTSAccommodationData/AccommodationRoomList.cshtml");
        }

        //[Authorize(Roles = "DataVisible,ExternalDataSourcesVisible,LTSAccoVisible")]
        public ActionResult AccommodationList()
        {
            return View("~/Views/ExternalDataSources/LTSAccommodationData/AccommodationList.cshtml");
        }

        #endregion

        #region HGV Packages

        //[Authorize(Roles = "DataVisible,ExternalDataSourcesVisible,HgvPackageVisible")]
        public ActionResult PackageList()
        {
            return View("~/Views/ExternalDataSources/HGVPackageData/PackageList.cshtml");
        }

        //[Authorize(Roles = "DataVisible,ExternalDataSourcesVisible,HgvPackageVisible")]
        public ActionResult PackageSearch()
        {
            return View("~/Views/ExternalDataSources/HGVPackageData/PackageSearch.cshtml");
        }

        #endregion

        #region SuedtirolWein        

        //[Authorize(Roles = "DataVisible,ExternalDataSourcesVisible,SuedtirolWeinVisible")]
        public ActionResult SuedtirolWeinList()
        {
            return View("~/Views/ExternalDataSources/SuedtirolWein/SuedtirolWeinList.cshtml");
        }

        //[Authorize(Roles = "DataVisible,ExternalDataSourcesVisible,SuedtirolWeinVisible")]
        public ActionResult WineAwardList()
        {
            return View("~/Views/ExternalDataSources/SuedtirolWein/WineAwardList.cshtml");
        }

        #endregion

        #region VerticalLife

        //[Authorize(Roles = "DataVisible,ExternalDataSourcesVisible,VerticalLifeVisible")]
        public ActionResult VerticalLifeList()
        {
            return View("~/Views/ExternalDataSources/VerticalLife/VerticalLifeList.cshtml");
        }

        #endregion

        #region MuseumData

        //[Authorize(Roles = "DataVisible,ExternalDataSourcesVisible,SiagMuseumDataVisible")]
        public ActionResult SiagMuseumDataList()
        {
            return View("~/Views/ExternalDataSources/SIAGMuseumData/SiagMuseumDataList.cshtml");
        }

        #endregion

        #region ArchappData

        //[Authorize(Roles = "DataVisible,ExternalDataSourcesVisible,ArchappDataVisible")]
        public ActionResult ArchappDataList()
        {
            return View("~/Views/ExternalDataSources/ArchappData/ArchappDataList.cshtml");
        }

        #endregion

        #region SIAG Weather

        //[Authorize(Roles = "DataVisible,ExternalDataSourcesVisible,WeatherVisible")]
        public ActionResult WeatherList()
        {
            return View("~/Views/ExternalDataSources/SIAGWeatherData/WeatherList.cshtml");
        }

        //[Authorize(Roles = "DataVisible,ExternalDataSourcesVisible,WeatherDistrictVisible")]
        public ActionResult DistrictWeatherList()
        {
            return View("~/Views/ExternalDataSources/SIAGWeatherData/DistrictWeatherList.cshtml");
        }

        //[Authorize(Roles = "DataVisible,ExternalDataSourcesVisible,WeatherRealtimeVisible")]
        public ActionResult RealtimeWeatherList()
        {
            return View("~/Views/ExternalDataSources/SIAGWeatherData/RealtimeWeatherList.cshtml");
        }




        #endregion

        #region LTS Weather

        //[Authorize(Roles = "DataVisible,ExternalDataSourcesVisible,LTSMeasuringpointsVisible")]
        public ActionResult MeasuringPointsList()
        {
            return View("~/Views/ExternalDataSources/LTSMeasuringpointData/MeasuringPointsList.cshtml");
        }

        //[Authorize(Roles = "DataVisible,ExternalDataSourcesVisible,SnowReportVisible")]
        public ActionResult SnowReportList()
        {
            return View("~/Views/ExternalDataSources/LTSMeasuringpointData/SnowReportList.cshtml");
        }

        #endregion

        #region LTS Venues

        public ActionResult VenueList()
        {
            return View("~/Views/ExternalDataSources/LTSVenueData/VenueList.cshtml");
        }

        #endregion

        #region PartialViews

        public ActionResult TypeAheadNameTemplate()
        {
            return PartialView("~/Views/PartialViews/TypeAheadNameTemplate.cshtml");
        }

        public ActionResult ArticleNameTemplate()
        {
            return PartialView("~/Views/PartialViews/ArticleNameTemplate.cshtml");
        }

        public ActionResult SmgTagNameTemplate()
        {
            return PartialView("~/Views/PartialViews/SmgTagNameTemplate.cshtml");
        }

        public ActionResult AccoNameTemplate()
        {
            return PartialView("~/Views/PartialViews/AccoNameTemplate.cshtml");
        }

        public ActionResult LocationNameTemplate()
        {
            return PartialView("~/Views/PartialViews/LocationNameTemplate.cshtml");
        }

        public ActionResult PackageNameTemplate()
        {
            return PartialView("~/Views/PartialViews/PackageNameTemplate.cshtml");
        }

        public ActionResult PoiNameTemplate()
        {
            return PartialView("~/Views/PartialViews/PoiNameTemplate.cshtml");
        }

        public ActionResult RelatedContentNameTemplate()
        {
            return PartialView("~/Views/PartialViews/RelatedContentNameTemplate.cshtml");
        }

        public ActionResult EventNameTemplate()
        {
            return PartialView("~/Views/PartialViews/EventNameTemplate.cshtml");
        }

        public ActionResult SkiAreaNameTemplate()
        {
            return PartialView("~/Views/PartialViews/SkiAreaNameTemplate.cshtml");
        }

        public ActionResult GastroNameTemplate()
        {
            return PartialView("~/Views/PartialViews/GastroNameTemplate.cshtml");
        }

        public ActionResult VenueNameTemplate()
        {
            return PartialView("~/Views/PartialViews/VenueNameTemplate.cshtml");
        }

        #endregion        
    }
}
