using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Npgsql;

namespace SuedtirolManagerPG.Controllers
{
    public class HomeController : Controller
    {
        private readonly NpgsqlConnection _connection;

        public HomeController(/*NpgsqlConnection connection*/)
        {
            //_connection = connection;
            _connection = default;
        }

        //[HasPermission("IndexViewer")]
        public ActionResult Index()
        {
            ViewBag.Title = "Home Page";

            //Display Rights:

            //var user = User.Identity.Name;
            //var user2 = System.Web.HttpContext.Current.Request.LogonUserIdentity.Name;

            //var cookies = this.ControllerContext.HttpContext.Request.Cookies;


            return View();
        }

        //[Authorize]
       

        public ActionResult LicenseStatus()
        {
            ViewBag.Title = "CC0 License State";

            //Query PG 
            ViewBag.AccoLicenses = GetCC0Licenses("accommodations");
            ViewBag.GastroLicenses = GetCC0Licenses("gastronomies");
            ViewBag.EventLicenses = GetCC0Licenses("events");
            ViewBag.PoiLicenses = GetCC0Licenses("pois");
            ViewBag.ActivityLicenses = GetCC0Licenses("activities");
            ViewBag.RegionLicenses = GetCC0Licenses("regions");
            ViewBag.TVLicenses = GetCC0Licenses("tvs");
            ViewBag.SkiAreaLicenses = GetCC0Licenses("skiareas");
            ViewBag.ODHActivityPoiLicenses = GetCC0Licenses("smgpois");

            ViewBag.AccoTotaldata = GetTotalCount("accommodations");
            ViewBag.GastroTotaldata = GetTotalCount("gastronomies");
            ViewBag.EventTotaldata = GetTotalCount("events");
            ViewBag.PoiTotaldata = GetTotalCount("pois");
            ViewBag.ActivityTotaldata = GetTotalCount("activities");
            ViewBag.RegionTotaldata = GetTotalCount("regions");
            ViewBag.TVTotaldata = GetTotalCount("tvs");
            ViewBag.SkiAreaTotaldata = GetTotalCount("skiareas");
            ViewBag.ODHActivityPoiTotaldata = GetTotalCount("smgpois");

            ViewBag.AccoTotaldataopen = GetTotalCount("accommodationsopen");
            ViewBag.GastroTotaldataopen = GetTotalCount("gastronomiesopen");
            ViewBag.EventTotaldataopen = GetTotalCount("eventsopen");
            ViewBag.PoiTotaldataopen = GetTotalCount("poisopen");
            ViewBag.ActivityTotaldataopen = GetTotalCount("activitiesopen");
            ViewBag.RegionTotaldataopen = GetTotalCount("regionsopen");
            ViewBag.TVTotaldataopen = GetTotalCount("tvsopen");
            ViewBag.SkiAreaTotaldataopen = GetTotalCount("skiareasopen");
            ViewBag.ODHActivityPoiTotaldataopen = GetTotalCount("smgpoisopen");

            ViewBag.AccoImagesopenCount = GetTotalImagesCount("accommodations");
            ViewBag.GastroImagesopenCount = GetTotalImagesCount("gastronomies");
            ViewBag.EventImagesopenCount = GetTotalImagesCount("events");
            ViewBag.PoiImagesopenCount = GetTotalImagesCount("pois");
            ViewBag.ActivityImagesopenCount = GetTotalImagesCount("activities");
            ViewBag.RegionImagesopenCount = GetTotalImagesCount("regions");
            ViewBag.TVImagesopenCount = GetTotalImagesCount("tvs");
            ViewBag.SkiAreaImagesopenCount = GetTotalImagesCount("skiareas");
            ViewBag.ODHActivityPoiImagesopenCount = GetTotalImagesCount("smgpois");

            return View();
        }

        private long GetCC0Licenses(string tablename)
        {
            long result = 0;

            using (var conn = _connection)
            {
                conn.Open();
               
                // TODO: implement
                //result = Common.PGLicenseHelper.GetAllLicenses(conn, tablename);
                
                conn.Close();

            }

            return result;
        }

        private long GetTotalCount(string tablename)
        {
            long result = 0;

            using (var conn = _connection)
            {
                conn.Open();

                // TODO: implement
                //result = Common.PostgresSQLHelper.CountDataFromTable(conn, tablename, "");

                conn.Close();
            }

            return result;
        }

        private long GetTotalImagesCount(string tablename)
        {
            long result = 0;

            using (var conn = _connection)
            {
                conn.Open();

                // TODO: implement
                //result = Common.PGLicenseHelper.GetAllImagesWithLicenseCount(conn, tablename);

                conn.Close();
            }

            return result;
        }
    }
}
