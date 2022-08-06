using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace iZem.my.Areas.Backoffice.Controllers
{
    public class UserController : Controller
    {
        // GET: Backoffice/User
        public ActionResult Index()
        {
            return View();
        }
        

        [ActionName("manage-signin")]
        public ActionResult SignIn()
        {
            return View("SignIn");
        }

        [ActionName("manage-member")]
        public ActionResult Member()
        {
            return View("Member");
        }

        [ActionName("manage-employer")]
        public ActionResult Employer()
        {
            return View("Employer");
        }

    }
}