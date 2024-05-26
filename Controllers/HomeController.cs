using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Security;

namespace angulaJS.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Login()
        {


            return View();
        }

       
    


        public ActionResult Index()
        {
            return View();
        }
        public ActionResult Device()
        {


              return View();
       
        }
        public ActionResult Client()
        {
            return View();

        }
        public ActionResult Phone()
        {
            return View();

        }
        public ActionResult PhoneNumberReservation()
        {
            return View();

        }

        public ActionResult ReportClient()
        {
            return View(); 

        }

        public ActionResult PhoneNumberReport()
        {
            return View();

        }

    
        public ActionResult About()
        {
            ViewBag.Message = "Your application description page.";

            return View();
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }
    }
}