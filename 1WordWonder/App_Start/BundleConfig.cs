using System.Web;
using System.Web.Optimization;

namespace _1WordWonder
{
    public class BundleConfig
    {
        // For more information on Bundling, visit http://go.microsoft.com/fwlink/?LinkId=254725
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.UseCdn = true;

            bundles.Add(new ScriptBundle("~/bundles/javascript").Include(
                "~/Scripts/jquery-1.11.2.min.js",
                "~/Scripts/jquery-ui.js",
                "~/Scripts/bootstrap.js",
                "~/Scripts/app.js"
                ));


            bundles.Add(new StyleBundle("~/bundles/css").Include(
                "~/Content/css/jquery-ui.min.css",
                "~/Content/css/bootstrap.min.css",
                "~/Content/css/sticky-footer.css",
                "~/Content/Site.css"
                ));
        }
    }
}