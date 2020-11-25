using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.OpenIdConnect;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace odh_databrowser_core.Controllers
{
    public class AccountController : Controller
    {
        public ActionResult Login()
        {
            return Challenge(new AuthenticationProperties() { RedirectUri = "/" }, OpenIdConnectDefaults.AuthenticationScheme);

            //var auth = User.Identity.IsAuthenticated;

            //string accToken = HttpContext.GetTokenAsync("access_token").Result;
            //string idToken = HttpContext.GetTokenAsync("id_token").Result;

            //return View();
        }

        public ActionResult Logout()
        {
            return Ok();
        }
    }
}
