using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.OpenIdConnect;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Protocols.OpenIdConnect;
using Microsoft.IdentityModel.Tokens;

namespace odh_databrowser_core
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {            
            services.AddAuthorization(options =>
            {
                options.AddPolicy("Users", policy =>
                policy.RequireRole("Users"));
            });

            services.Configure<ForwardedHeadersOptions>(options =>
            {
                options.ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto;
                options.KnownNetworks.Clear();
                options.KnownProxies.Clear();
            }); ;

            services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = CookieAuthenticationDefaults.AuthenticationScheme; //"oidc";
                options.DefaultSignInScheme = CookieAuthenticationDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = CookieAuthenticationDefaults.AuthenticationScheme;
                //options.DefaultChallengeScheme = "oidc";
            })
            .AddCookie()
            .AddOpenIdConnect(options =>
            {                
                options.Authority = "https://auth.opendatahub.testingmachine.eu/auth/realms/noi/";
                options.ClientId = "odh-frontend-core";
                options.ClientSecret = "";
                options.RequireHttpsMetadata = false;
                options.GetClaimsFromUserInfoEndpoint = true;
                options.SaveTokens = true;
                options.RemoteSignOutPath = "/SignOut";
                //options.SignedOutRedirectUri = "/";        
                //options.SignedOutCallbackPath = "/Account/Logout";
                //options.ResponseType = "code";    
                options.SaveTokens = true;
                options.ResponseType = OpenIdConnectResponseType.Code;
                //options.SignInScheme = "oidc";
                //options.CallbackPath = "/";
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    NameClaimType = "preferred_username",
                    ValidateIssuer = true
                };
            });

            services.AddControllersWithViews();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {         
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Home/Error");
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }

            app.UseForwardedHeaders();

            app.UseCookiePolicy(new CookiePolicyOptions()
            {
                MinimumSameSitePolicy = SameSiteMode.Strict
            });

            //app.UseHttpsRedirection();
            app.UseStaticFiles();

            app.UseRouting();

            //app.UseCookiePolicy();
            app.UseAuthentication();

            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllerRoute(
                    name: "default",
                    pattern: "{controller=Home}/{action=Index}/{id?}");
            });
           

            //app.UseMvc();
        }

        //private OpenIdConnectOptions CreateOpenIdConnectOptions()
        //{
        //    var options = new OpenIdConnectOptions
        //    {
        //        SignInScheme = CookieAuthenticationDefaults.AuthenticationScheme,
        //        Authority = ,
        //        RequireHttpsMetadata = true,
        //        ClientId = "odh-fontend-core",
        //        ClientSecret = "",
        //        ResponseType = OpenIdConnectResponseType.CodeToken,
        //        GetClaimsFromUserInfoEndpoint = true,
        //        SaveTokens = true
        //    };
        //    options.Scope.Clear();
        //    options.Scope.Add("openid");
        //    return options;
        //}
    }
}
