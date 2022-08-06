using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Web;
using System.Web.Mvc;

namespace iZem.my.Areas.Employer.Controllers
{
    public class UtilityController : Controller
    {
        // GET: Employer/Utility
        public ActionResult Index()
        {
            return View();
        }

        [ActionName("manage-template")]
        public ActionResult EmployerTemplate()
        {
            return View("EmployerTemplate");
        }

        [ActionName("manage-template-permission")]
        public ActionResult EmployerTemplatePermission()
        {
            return View("EmployerTemplatePermission");
        }

        [ActionName("manage-user-rights")]
        public ActionResult EmployerUserRights()
        {
            return View("EmployerUserRights");
        }
    }
}