using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Npgsql;
using System;
using System.Collections.Generic;
using System.Linq;

namespace SuedtirolManagerPG.Controllers
{
    public class GeoBankController : Controller
    {

        #region Location

        //[Authorize(Roles = "DataVisible,GeobankVisible,LocationVisible")]
        public ActionResult MetaRegionList()
        {            
            return View("~/Views/GeoBank/Location/MetaRegionList.cshtml");
        }

        //[Authorize(Roles = "DataVisible,GeobankVisible,LocationVisible")]
        public ActionResult RegionList()
        {            
            return View("~/Views/GeoBank/Location/RegionList.cshtml");
        }

        //[Authorize(Roles = "DataVisible,GeobankVisible,LocationVisible")]
        public ActionResult TourismVereinList()
        {
            return View("~/Views/GeoBank/Location/TourismVereinList.cshtml");
        }

        //[Authorize(Roles = "DataVisible,GeobankVisible,LocationVisible")]
        public ActionResult MunicipalityList()
        {
            return View("~/Views/GeoBank/Location/MunicipalityList.cshtml");
        }

        //[Authorize(Roles = "DataVisible,GeobankVisible,LocationVisible")]
        public ActionResult DistrictList()
        {
            return View("~/Views/GeoBank/Location/DistrictList.cshtml");
        }

        //[Authorize(Roles = "DataVisible,GeobankVisible,LocationVisible")]
        public ActionResult SkiRegionList()
        {
            return View("~/Views/GeoBank/Location/SkiRegionList.cshtml");
        }

        //[Authorize(Roles = "DataVisible,GeobankVisible,LocationVisible")]
        public ActionResult SkiAreaList()
        {
            return View("~/Views/GeoBank/Location/SkiAreaList.cshtml");
        }

        //[Authorize(Roles = "DataVisible,GeobankVisible,LocationVisible")]
        public ActionResult NatureparksList()
        {
            return View("~/Views/GeoBank/Location/NatureparksList.cshtml");
        }

        //[Authorize(Roles = "DataVisible,GeobankVisible,LocationVisible")]
        public ActionResult ExperienceAreaList()
        {
            return View("~/Views/GeoBank/Location/ExperienceAreaList.cshtml");
        }

        //[Authorize(Roles = "DataVisible,GeobankVisible,LocationVisible")]
        public ActionResult AreaList()
        {
            return View("~/Views/GeoBank/Location/AreaList.cshtml");
        }

        #endregion

        #region GBActivityPoi

        //[Authorize(Roles = "DataVisible,GeobankVisible,GBPoiVisible")]
        public ActionResult AllSmgPoiList()
        {
            return View("~/Views/GeoBank/GBActivityPoi/AllSmgPoiList.cshtml");
        }

        //[Authorize(Roles = "DataVisible,GeobankVisible,GBPoiVisible")]
        public ActionResult WellnessList()
        {
            return View("~/Views/GeoBank/GBActivityPoi/WellnessList.cshtml");
        }

        //[Authorize(Roles = "DataVisible,GeobankVisible,GBPoiVisible")]
        public ActionResult WinterList()
        {
            return View("~/Views/GeoBank/GBActivityPoi/WinterList.cshtml");
        }

        //[Authorize(Roles = "DataVisible,GeobankVisible,GBPoiVisible")]
        public ActionResult OtherList()
        {
            return View("~/Views/GeoBank/GBActivityPoi/OtherList.cshtml");
        }

        //[Authorize(Roles = "DataVisible,GeobankVisible,GBPoiVisible")]
        public ActionResult CultureList()
        {
            return View("~/Views/GeoBank/GBActivityPoi/CultureList.cshtml");
        }

        //[Authorize(Roles = "DataVisible,GeobankVisible,GBPoiVisible")]
        public ActionResult EatingList()
        {
            return View("~/Views/GeoBank/GBActivityPoi/EatingList.cshtml");
        }

        //[Authorize(Roles = "DataVisible,GeobankVisible,GBPoiVisible")]
        public ActionResult SummerList()
        {
            return View("~/Views/GeoBank/GBActivityPoi/SummerList.cshtml");
        }

        public ActionResult ShopsAndServicesList()
        {
            return View("~/Views/GeoBank/GBActivityPoi/ShopsAndServicesList.cshtml");
        }

        public ActionResult MobilityList()
        {
            return View("~/Views/GeoBank/GBActivityPoi/MobilityList.cshtml");
        }

        ////[Authorize(Roles = "DataVisible,GeobankVisible,GBPoiVisible")]
        //public ActionResult GBPoiStatus()
        //{
        //    using (var conn = new NpgsqlConnection(GlobalPGConnection.PGConnectionString))
        //    {
        //        conn.Open();

        //        string poiltswhere = "data @> '{ \"SyncSourceInterface\":\"PoiData\" }' AND data @> '{\"Active\":true}'";
        //        ViewBag.PoisLTS = PostgresSQLHelper.CountDataFromTable(conn, "smgpois", poiltswhere);

        //        string poimagnoliawhere = "data @> '{ \"SyncSourceInterface\":\"Magnolia\" }' AND data @> '{\"Active\":true}'";
        //        ViewBag.PoisMagnolia = PostgresSQLHelper.CountDataFromTable(conn, "smgpois", poimagnoliawhere);

        //        string poinonewhere = "data @> '{ \"SyncSourceInterface\":\"None\" }' AND data @> '{\"Active\":true}'";
        //        ViewBag.PoisCreated = PostgresSQLHelper.CountDataFromTable(conn, "smgpois", poinonewhere);

        //        string poimuseumwhere = "data @> '{ \"SyncSourceInterface\":\"MuseumData\" }' AND data @> '{\"Active\":true}'";
        //        ViewBag.PoisOther = PostgresSQLHelper.CountDataFromTable(conn, "smgpois", poimuseumwhere);


        //        //Wellness
        //        string poipoiwellnesswhere = "data @> '{ \"SyncSourceInterface\":\"PoiData\" }' AND data @> '{ \"Type\": \"Wellness Entspannung\" }' AND data @> '{\"Active\":true}'";
        //        ViewBag.WellnessLTS = PostgresSQLHelper.CountDataFromTable(conn, "smgpois", poipoiwellnesswhere);

        //        string poimagnoliawellnesswhere = "data @> '{ \"SyncSourceInterface\":\"Magnolia\" }' AND data @> '{ \"Type\": \"Wellness Entspannung\" }' AND data @> '{\"Active\":true}'";
        //        ViewBag.WellnessMagnolia = PostgresSQLHelper.CountDataFromTable(conn, "smgpois", poimagnoliawellnesswhere);

        //        string poinonewellnesswhere = "data @> '{ \"SyncSourceInterface\":\"None\" }' AND data @> '{ \"Type\": \"Wellness Entspannung\" }' AND data @> '{\"Active\":true}'";
        //        ViewBag.WellnessCreated = PostgresSQLHelper.CountDataFromTable(conn, "smgpois", poinonewellnesswhere);


        //        ViewBag.WellnessOther = 0;
        //        //session.Query<SmgPoi, SmgPoiMegaFilter>()
        //        //.Where(x => x.SyncSourceInterface == "MuseumData")
        //        //.Where(x => x.Type == "Wellness Entspannung")
        //        //.Where(x => x.Active == true)
        //        //.Count();

        //        //Winter
        //        string poiltswinterwhere = "data @> '{ \"SyncSourceInterface\":\"PoiData\" }' AND data @> '{ \"Type\": \"Winter\" }' AND data @> '{\"Active\":true}'";
        //        ViewBag.WinterLTS = PostgresSQLHelper.CountDataFromTable(conn, "smgpois", poiltswinterwhere);

        //        string poimagnoliawinterwhere = "data @> '{ \"SyncSourceInterface\":\"Magnolia\" }' AND data @> '{ \"Type\": \"Winter\" }' AND data @> '{\"Active\":true}'";
        //        ViewBag.WinterMagnolia = PostgresSQLHelper.CountDataFromTable(conn, "smgpois", poimagnoliawinterwhere);

        //        string poinonewinterwhere = "data @> '{ \"SyncSourceInterface\":\"None\" }' AND data @> '{ \"Type\": \"Winter\" }' AND data @> '{\"Active\":true}'";
        //        ViewBag.WinterCreated = PostgresSQLHelper.CountDataFromTable(conn, "smgpois", poinonewinterwhere);

        //        ViewBag.WinterOther = 0;
        //        //session.Query<SmgPoi, SmgPoiMegaFilter>()
        //        //.Where(x => x.SyncSourceInterface == "MuseumData")
        //        //.Where(x => x.Type == "Winter")
        //        //.Where(x => x.Active == true)
        //        //.Count();

        //        //Sommer
        //        string poiltssommerwhere = "data @> '{ \"SyncSourceInterface\":\"PoiData\" }' AND data @> '{ \"Type\": \"Sommer\" }' AND data @> '{\"Active\":true}'";
        //        ViewBag.SommerLTS = PostgresSQLHelper.CountDataFromTable(conn, "smgpois", poiltssommerwhere);

        //        string poimagnoliasommerwhere = "data @> '{ \"SyncSourceInterface\":\"Magnolia\" }' AND data @> '{ \"Type\": \"Sommer\" }' AND data @> '{\"Active\":true}'";
        //        ViewBag.SommerMagnolia = PostgresSQLHelper.CountDataFromTable(conn, "smgpois", poimagnoliasommerwhere);

        //        string poinonesommerwhere = "data @> '{ \"SyncSourceInterface\":\"None\" }' AND data @> '{ \"Type\": \"Sommer\" }' AND data @> '{\"Active\":true}'";
        //        ViewBag.SommerCreated = PostgresSQLHelper.CountDataFromTable(conn, "smgpois", poinonesommerwhere);

        //        ViewBag.SommerOther = 0;
        //        //session.Query<SmgPoi, SmgPoiMegaFilter>()
        //        //.Where(x => x.SyncSourceInterface == "MuseumData")
        //        //.Where(x => x.Type == "Sommer")
        //        //.Where(x => x.Active == true)
        //        //.Count();

        //        string poiverticallifesommerwhere = "data @> '{ \"SyncSourceInterface\":\"VerticalLife\" }' AND data @> '{ \"Type\": \"Sommer\" }' AND data @> '{\"Active\":true}'";
        //        ViewBag.SommerVerticalLife = PostgresSQLHelper.CountDataFromTable(conn, "smgpois", poiverticallifesommerwhere);

        //        //Kultur
        //        string poiltskulturwhere = "data @> '{ \"SyncSourceInterface\":\"PoiData\" }' AND data @> '{ \"Type\": \"Kultur Sehenswürdigkeiten\" }' AND data @> '{\"Active\":true}'";
        //        ViewBag.KulturLTS = PostgresSQLHelper.CountDataFromTable(conn, "smgpois", poiltskulturwhere);

        //        string poimagnoliakulturwhere = "data @> '{ \"SyncSourceInterface\":\"Magnolia\" }' AND data @> '{ \"Type\": \"Kultur Sehenswürdigkeiten\" }' AND data @> '{\"Active\":true}'";
        //        ViewBag.KulturMagnolia = PostgresSQLHelper.CountDataFromTable(conn, "smgpois", poimagnoliakulturwhere);

        //        string poinonekulturwhere = "data @> '{ \"SyncSourceInterface\":\"None\" }' AND data @> '{ \"Type\": \"Kultur Sehenswürdigkeiten\" }' AND data @> '{\"Active\":true}'";
        //        ViewBag.KulturCreated = PostgresSQLHelper.CountDataFromTable(conn, "smgpois", poinonekulturwhere);

        //        string poiandereskulturwhere = "data @> '{ \"SyncSourceInterface\":\"MuseumData\" }' AND data @> '{ \"Type\": \"Kultur Sehenswürdigkeiten\" }' AND data @> '{\"Active\":true}'";
        //        ViewBag.KulturOther = PostgresSQLHelper.CountDataFromTable(conn, "smgpois", poiandereskulturwhere);

        //        //Essenv
        //        string poiltsessenwhere = "data @> '{ \"SyncSourceInterface\":\"GastronomicData\" }' AND data @> '{ \"Type\": \"Essen Trinken\" }' AND data @> '{\"Active\":true}'";
        //        ViewBag.EssenLTSGastro = PostgresSQLHelper.CountDataFromTable(conn, "smgpois", poiltsessenwhere);

        //        string poimagnoliaessenwhere = "data @> '{ \"SyncSourceInterface\":\"Magnolia\" }' AND data @> '{ \"Type\": \"Essen Trinken\" }' AND data @> '{\"Active\":true}'";
        //        ViewBag.EssenMagnolia = PostgresSQLHelper.CountDataFromTable(conn, "smgpois", poimagnoliaessenwhere);

        //        string poinoneessenwhere = "data @> '{ \"SyncSourceInterface\":\"None\" }' AND data @> '{ \"Type\": \"Essen Trinken\" }' AND data @> '{\"Active\":true}'";
        //        ViewBag.EssenCreated = PostgresSQLHelper.CountDataFromTable(conn, "smgpois", poinoneessenwhere);

        //        ViewBag.EssenOther = 0;
        //        //session.Query<SmgPoi, SmgPoiMegaFilter>()
        //        //.Where(x => x.SyncSourceInterface == "MuseumData")
        //        //.Where(x => x.Type == "Essen Trinken")
        //        //.Where(x => x.Active == true)
        //        //.Count();

        //        string poipoiessenwhere = "data @> '{ \"SyncSourceInterface\":\"PoiData\" }' AND data @> '{ \"Type\": \"Essen Trinken\" }' AND data @> '{\"Active\":true}'";
        //        ViewBag.EssenLTS = PostgresSQLHelper.CountDataFromTable(conn, "smgpois", poipoiessenwhere);

        //        string poisuedtirolweinessenwhere = "data @> '{ \"SyncSourceInterface\":\"SuedtirolWein\" }' AND data @> '{ \"Type\": \"Essen Trinken\" }' AND data @> '{\"Active\":true}'";
        //        ViewBag.EssenSuedtirolWein = PostgresSQLHelper.CountDataFromTable(conn, "smgpois", poisuedtirolweinessenwhere);

        //        //Anderes
        //        string poiltsandereswhere = "data @> '{ \"SyncSourceInterface\":\"PoiData\" }' AND data @> '{ \"Type\": \"Anderes\" }' AND data @> '{\"Active\":true}'";
        //        ViewBag.AnderesLTS = PostgresSQLHelper.CountDataFromTable(conn, "smgpois", poiltsandereswhere);

        //        string poimagnoliaandereswhere = "data @> '{ \"SyncSourceInterface\":\"Magnolia\" }' AND data @> '{ \"Type\": \"Anderes\" }' AND data @> '{\"Active\":true}'";
        //        ViewBag.AnderesMagnolia = PostgresSQLHelper.CountDataFromTable(conn, "smgpois", poimagnoliaandereswhere);

        //        string poinoneandereswhere = "data @> '{ \"SyncSourceInterface\":\"None\" }' AND data @> '{ \"Type\": \"Anderes\" }' AND data @> '{\"Active\":true}'";
        //        ViewBag.AnderesCreated = PostgresSQLHelper.CountDataFromTable(conn, "smgpois", poinoneandereswhere);

        //        ViewBag.AnderesOther = 0;
        //        //session.Query<SmgPoi, SmgPoiMegaFilter>()
        //        //.Where(x => x.SyncSourceInterface == "MuseumData")
        //        //.Where(x => x.Type == "Anderes")
        //        //.Where(x => x.Active == true)
        //        //.Count();

        //        ViewBag.TotalPois = Convert.ToInt32(ViewBag.PoisLTS) + Convert.ToInt32(ViewBag.PoisMagnolia) + Convert.ToInt32(ViewBag.PoisCreated) + Convert.ToInt32(ViewBag.PoisOther) + Convert.ToInt32(ViewBag.EssenSuedtirolWein) + Convert.ToInt32(ViewBag.SommerVerticalLife);
        //        ViewBag.TotalPoisTotal = Convert.ToInt32(ViewBag.PoisLTS) + Convert.ToInt32(ViewBag.PoisMagnolia) + Convert.ToInt32(ViewBag.PoisCreated) + Convert.ToInt32(ViewBag.PoisOther) + Convert.ToInt32(ViewBag.EssenLTSGastro) + Convert.ToInt32(ViewBag.EssenSuedtirolWein) + +Convert.ToInt32(ViewBag.SommerVerticalLife);

        //        conn.Close();
        //    }

        //    //ActivityData
        //    using (var conn = new NpgsqlConnection(GlobalPGConnection.PGConnectionString))
        //    {
        //        conn.Open();

        //        string apoiltswhere = "data @> '{ \"SyncSourceInterface\":\"ActivityData\" }' AND data @> '{\"Active\":true}'";
        //        ViewBag.APoisLTS = PostgresSQLHelper.CountDataFromTable(conn, "smgpois", apoiltswhere);


        //        //Wellness
        //        string apoiwellnesswhere = "data @> '{ \"SyncSourceInterface\":\"ActivityData\" }' AND data @> '{ \"Type\": \"Wellness Entspannung\" }' AND data @> '{\"Active\":true}'";
        //        ViewBag.AWellnessLTS = PostgresSQLHelper.CountDataFromTable(conn, "smgpois", apoiwellnesswhere);

        //        //Winter
        //        string apoiwinterwhere = "data @> '{ \"SyncSourceInterface\":\"ActivityData\" }' AND data @> '{ \"Type\": \"Winter\" }' AND data @> '{\"Active\":true}'";
        //        ViewBag.AWinterLTS = PostgresSQLHelper.CountDataFromTable(conn, "smgpois", apoiwinterwhere);

        //        //Sommer
        //        string apoisommerwhere = "data @> '{ \"SyncSourceInterface\":\"ActivityData\" }' AND data @> '{ \"Type\": \"Sommer\" }' AND data @> '{\"Active\":true}'";
        //        ViewBag.ASommerLTS = PostgresSQLHelper.CountDataFromTable(conn, "smgpois", apoisommerwhere);

        //        //Kultur
        //        string apoikulturwhere = "data @> '{ \"SyncSourceInterface\":\"ActivityData\" }' AND data @> '{ \"Type\": \"Kultur Sehenswürdigkeiten\" }' AND data @> '{\"Active\":true}'";
        //        ViewBag.AKulturLTS = PostgresSQLHelper.CountDataFromTable(conn, "smgpois", apoikulturwhere);

        //        //Essen
        //        string apoiessenwhere = "data @> '{ \"SyncSourceInterface\":\"ActivityData\" }' AND data @> '{ \"Type\": \"Essen Trinken\" }' AND data @> '{\"Active\":true}'";
        //        ViewBag.AEssenLTS = PostgresSQLHelper.CountDataFromTable(conn, "smgpois", apoiessenwhere);

        //        //Anderes
        //        string apoiandereswhere = "data @> '{ \"SyncSourceInterface\":\"ActivityData\" }' AND data @> '{ \"Type\": \"Anderes\" }' AND data @> '{\"Active\":true}'";
        //        ViewBag.AAnderesLTS = PostgresSQLHelper.CountDataFromTable(conn, "smgpois", apoiandereswhere);

        //        conn.Close();
        //    }

        //    return View("~/Views/GeoBank/GBActivityPoi/GBPoiStatus.cshtml");
        //}

        #endregion

        #region GBEvents

        //[Authorize(Roles = "DataVisible,GeobankVisible,GBEventVisible")]
        public ActionResult EventList()
        {
            return View("~/Views/GeoBank/GBEvent/EventList.cshtml");
        }

        #endregion

        #region GBEventShort

        //[Authorize(Roles = "DataVisible,GeobankVisible,EventShortVisible")]
        public ActionResult EventShortList()
        {
            return View("~/Views/GeoBank/GBEventShort/EventShortList.cshtml");
        }

        #endregion

        #region GBArticles        

        //[Authorize(Roles = "DataVisible,GeobankVisible,GBArticleVisible")]
        public ActionResult BaseArticleList()
        {
            return View("~/Views/GeoBank/GBArticle/BaseArticleList.cshtml");
        }

        //[Authorize(Roles = "DataVisible,GeobankVisible,GBArticleVisible")]
        public ActionResult RecipeArticleList()
        {
            return View("~/Views/GeoBank/GBArticle/RecipeArticleList.cshtml");
        }

        //[Authorize(Roles = "DataVisible,GeobankVisible,GBArticleVisible")]
        public ActionResult BookArticleList()
        {
            return View("~/Views/GeoBank/GBArticle/BookArticleList.cshtml");
        }

        //[Authorize(Roles = "DataVisible,GeobankVisible,GBArticleVisible")]
        public ActionResult CatalogArticleList()
        {
            return View("~/Views/GeoBank/GBArticle/CatalogArticleList.cshtml");
        }

        //[Authorize(Roles = "DataVisible,GeobankVisible,GBArticleVisible")]
        public ActionResult TouroperatorArticleList()
        {
            return View("~/Views/GeoBank/GBArticle/TouroperatorArticleList.cshtml");
        }

        //[Authorize(Roles = "DataVisible,GeobankVisible,GBArticleVisible")]
        public ActionResult EventArticleList()
        {
            return View("~/Views/GeoBank/GBArticle/EventArticleList.cshtml");
        }

        //[Authorize(Roles = "DataVisible,GeobankVisible,GBArticleVisible")]
        public ActionResult PressArticleList()
        {
            return View("~/Views/GeoBank/GBArticle/PressArticleList.cshtml");
        }

        //[Authorize(Roles = "DataVisible,GeobankVisible,GBArticleVisible")]
        public ActionResult B2BArticleList()
        {
            return View("~/Views/GeoBank/GBArticle/B2BArticleList.cshtml");
        }

        //[Authorize(Roles = "DataVisible,GeobankVisible,GBArticleVisible")]
        public ActionResult ContentArticleList()
        {
            return View("~/Views/GeoBank/GBArticle/ContentArticleList.cshtml");
        }
        public ActionResult SpecialAnnouncementList()
        {
            return View("~/Views/GeoBank/GBArticle/SpecialAnnouncementList.cshtml");
        }

        public ActionResult NewsFeedNoiList()
        {
            return View("~/Views/GeoBank/GBArticle/NewsFeedNoiList.cshtml");
        }

        #endregion

        #region GBAccos

        //[Authorize(Roles = "DataVisible,GeobankVisible,GBAccoVisible")]
        public ActionResult AccoList()
        {
            return View("~/Views/GeoBank/GBAccommodation/AccommodationSimpleList.cshtml");
        }

        //[Authorize(Roles = "DataVisible,GeobankVisible,GBAccoVisible")]
        public ActionResult AccoSearchList()
        {
            return View("~/Views/GeoBank/GBAccommodation/AccommodationList.cshtml");
        }

        //[Authorize(Roles = "DataVisible,GeobankVisible,GBAccoVisible")]
        public ActionResult AccoRoomList()
        {
            return View("~/Views/GeoBank/GBAccommodation/AccoRoomList.cshtml");
        }

        #endregion

        #region GBPackages

        //[Authorize(Roles = "DataVisible,GeobankVisible,GBPackageVisible")]
        public ActionResult PackageList()
        {
            return View("~/Views/GeoBank/GBPackage/PackageList.cshtml");
        }

        //[Authorize(Roles = "DataVisible,GeobankVisible,GBPackageVisible")]
        public ActionResult PackageSearch()
        {
            return View("~/Views/GeoBank/GBPackage/PackageSearch.cshtml");
        }

        #endregion

        #region LTS Webcams

        //[Authorize(Roles = "DataVisible,ExternalDataSourcesVisible,LTSMeasuringpointsVisible")]
        public ActionResult WebcamInfoList()
        {
            return View("~/Views/GeoBank/WebcamInfo/WebcamInfoList.cshtml");
        }

        #endregion

        #region GBVenues

        public ActionResult VenueList()
        {
            return View("~/Views/GeoBank/GBVenue/VenueList.cshtml");
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


        public ActionResult EventShortCRUDModal()
        {
            return PartialView("~/Views/GeoBank/GBEventShort/EventShortCRUDModal.cshtml");
        }

        public ActionResult EventShortInfoModal()
        {
            return PartialView("~/Views/GeoBank/GBEventShort/EventShortInfoModal.cshtml");
        }

        public ActionResult EventShortNameTemplate()
        {
            return PartialView("~/Views/GeoBank/GBEventShort/EventShortNameTemplate.cshtml");
        }


        public ActionResult WebcamNameTemplate()
        {
            return PartialView("~/Views/PartialViews/WebcamNameTemplate.cshtml");
        }

        public ActionResult VenueNameTemplate()
        {
            return PartialView("~/Views/PartialViews/VenueNameTemplate.cshtml");
        }


        #endregion




    }
}
