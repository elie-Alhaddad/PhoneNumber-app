using System.Web;
using System.Web.Optimization;

namespace angulaJS
{
    public class BundleConfig
    {
        // For more information on bundling, visit https://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                        "~/Scripts/jquery-{version}.js"));

            bundles.Add(new ScriptBundle("~/bundles/jqueryval").Include(
                        "~/Scripts/jquery.validate*"));
          bundles.Add(new ScriptBundle("~/bundles/angular").Include(
              "~/Scripts/angular.js"));

            bundles.Add(new ScriptBundle("~/bundles/directive").Include(
         "~/app-directives/appDirectives.js"));

            //for script
            bundles.Add(new ScriptBundle("~/bundles/app-scriptDevice").Include(
              "~/app-script/DeviceScript.js"));
        

            //cript client
            bundles.Add(new ScriptBundle("~/bundles/app-scriptClient").Include(
              "~/app-script/ClientScript.js"));

            bundles.Add(new ScriptBundle("~/bundles/app-scriptPhone").Include(
             "~/app-script/PhoneScript.js"));

            bundles.Add(new ScriptBundle("~/bundles/app-scriptPhoneNumberReservations").Include(
            "~/app-script/PhoneNumberReservations.js"));


            bundles.Add(new ScriptBundle("~/bundles/app-scriptClientReport").Include(
             "~/app-script/ClientReport.js"));


            bundles.Add(new ScriptBundle("~/bundles/app-scriptPhoneNumberReportReport").Include(
            "~/app-script/PhoneNumberReport.js"));


            bundles.Add(new ScriptBundle("~/bundles/app-login").Include(
           "~/app-script/Login.js"));


            /*    bundles.Add(new ScriptBundle("~/bundles/app-Selector").Include(
                "~/app-directives/ClientTypeSelector.js",
                "~/app-directives/DeviceSelector.js",
                "~/app-directives/PhoneNumberReservations.js"
                ));

                */







            bundles.Add(new ScriptBundle("~/bundles/ui-bootstrap").Include(
             "~/Scripts/angular-ui/ui-bootstrap-tpls.min.js"));

            // Use the development version of Modernizr to develop with and learn from. Then, when you're
            // ready for production, use the build tool at https://modernizr.com to pick only the tests you need.
            bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
                        "~/Scripts/modernizr-*"));

            bundles.Add(new Bundle("~/bundles/bootstrap").Include(
                      "~/Scripts/bootstrap.js"));

            bundles.Add(new StyleBundle("~/Content/css").Include(
                       
                      "~/Content/bootstrap.css",
                      "~/Content/site.css"));


            bundles.Add(new StyleBundle("~/Css/style").Include(
                  "~/Content/bootstrap.min.css",
                  "~/bootstrapOldVersion/bootstrap.min.css",
                  "~/Css/style.css"));

            


        }
    }
}
