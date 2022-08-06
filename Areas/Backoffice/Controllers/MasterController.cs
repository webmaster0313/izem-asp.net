using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace iZem.my.Areas.Backoffice.Controllers
{
    public class MasterController : Controller
    {
        /* 
         * Master Menu
         */
        [ActionName("manage-citizenship")]
        public ActionResult MasterCitizenship()
        {
            return View("MasterCitizenship");
        }

        [ActionName("manage-country")]
        public ActionResult MasterCountry()
        {
            return View("MasterCountry");
        }

        [ActionName("manage-state")]
        public ActionResult MasterState()
        {
            return View("MasterState");
        }

        [ActionName("manage-facility")]
        public ActionResult MasterFacility()
        {
            return View("MasterFacility");
        }

        [ActionName("manage-race")]
        public ActionResult MasterRace()
        {
            return View("MasterRace");
        }

        [ActionName("manage-relationship")]
        public ActionResult MasterRelationship()
        {
            return View("MasterRelationship");
        }

        [ActionName("manage-subscription")]
        public ActionResult MasterSubscription()
        {
            return View("MasterSubscription");
        }

        [ActionName("manage-term")]
        public ActionResult MasterTerm()
        {
            return View("MasterTerm");
        }

        /* 
         * Payroll Menu
         */

        [ActionName("manage-epf")]
        public ActionResult MasterEpf()
        {
            return View("MasterEpf");
        }

        [ActionName("manage-socso")]
        public ActionResult MasterSocso()
        {
            return View("MasterSocso");
        }

        [ActionName("manage-eis")]
        public ActionResult MasterEis()
        {
            return View("MasterEis");
        }

        [ActionName("manage-hrdf")]
        public ActionResult MasterHrdf()
        {
            return View("MasterHrdf");
        }

        /* 
         * Bank Menu
         */

        [ActionName("master-employee-bank")]
        public ActionResult MasterEmployeeBank()
        {
            return View("MasterEmployeeBank");
        }

        [ActionName("master-employer-bank")]
        public ActionResult MasterEmployerBank()
        {
            return View("MasterEmployerBank");
        }
    }
}