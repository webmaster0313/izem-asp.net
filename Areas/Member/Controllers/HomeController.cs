using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace iZem.my.Areas.Member.Controllers
{
    public class HomeController : Controller
    {
        // GET: Member/Home
        public ActionResult Index()
        {
            return View();
        }

        [ActionName("employee-detail")]
        public ActionResult EmployeeDetail()
        {
            return View("EmployeeDetail");
        }
    }
}