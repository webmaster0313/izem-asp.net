using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace iZem.my.Areas.Member.Controllers
{
    public class AttendanceSettingController : Controller
    {
        // GET: Member/AttendanceSetting
        public ActionResult Index()
        {
            return View();
        }

        [ActionName("manage-your-attendancelist")]
        public ActionResult EmployeeAttendanceList()
        {
            return View("EmployeeAttendanceList");
        }

        [ActionName("manage-your-attendancereport")]
        public ActionResult EmployeeAttendanceReport()
        {
            return View("EmployeeAttendanceReport");
        }
    }
}