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
            var user = HttpContext.User;
            if (user?.Identity.IsAuthenticated == true)
            {
                // delete local authentication cookie
                HttpContext.SignOutAsync();

                // raise the logout event
                //await _events.RaiseAsync(new UserLogoutSuccessEvent(user.GetSubjectId(), user.GetName()));

                return SignOut(new AuthenticationProperties { RedirectUri = "/" }, OpenIdConnectDefaults.AuthenticationScheme);
            }

            return Ok();
        }
    }
}
