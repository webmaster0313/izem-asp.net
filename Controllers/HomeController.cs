using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace iZem.my.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }

        [ActionName("registration")]
        public ActionResult Registration()
        {
            return View("Registration");
        }

        [ActionName("forgot-password")]
        public ActionResult ForgotPassword()
        {
            return View("ForgotPassword");
        }

        [ActionName("verification")]
        public ActionResult Verification()
        {
            return View("Verification");
        }

        [ActionName("TermsConditions")]
        public ActionResult TermsConditions()
        {
            return View("TermsConditions");
        }

        [ActionName("PrivacyPolicy")]
        public ActionResult PrivacyPolicy()
        {
            return View("PrivacyPolicy");
        }
    }
}