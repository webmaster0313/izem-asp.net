using CrystalDecisions.CrystalReports.Engine;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace iZem.my.Areas.Employer.Controllers
{
    public class MasterSettingController : Controller
    {
        // GET: Employer/MasterSetting
        public ActionResult Index()
        {
            return View();
        }

        [ActionName("manage-your-branch")]
        public ActionResult EmployerBranch()
        {
            return View("EmployerBranch");
        }

        [ActionName("manage-your-department")]
        public ActionResult EmployerDepartment()
        {
            return View("EmployerDepartment");
        }

        [ActionName("manage-your-setting")]
        public ActionResult EmployerSetting()
        {
            return View("EmployerSetting");
        }

        [ActionName("manage-your-entitlement")]
        public ActionResult EmployerEntitlement()
        {
            return View("EmployerEntitlement");
        }

        [ActionName("manage-your-facility")]
        public ActionResult EmployerFacility()
        {
            return View("EmployerFacility");
        }

        [ActionName("manage-your-subscription")]
        public ActionResult EmployerSubscription()
        {
            return View("EmployerSubscription");
        }

        [ActionName("manage-your-holiday")]
        public ActionResult EmployerHoliday()
        {
            return View("EmployerHoliday");
        }

        [ActionName("manage-your-company-setting")]
        public ActionResult EmployerCompanySetting()
        {
            return View("EmployerCompanySetting");
        }

        [ActionName("manage-your-employee-list")]
        public ActionResult Employee()
        {
            return View("Employee");
        }

        //! Reports
        [HttpPost]
        public ActionResult load_employeeReport(string companyName, string reportTitle, string employeeData)
        {
            try
            {
                DataTable dtEmployeeData = new DataTable();
                if (employeeData != "")
                    dtEmployeeData = (DataTable)JsonConvert.DeserializeObject(employeeData, (typeof(DataTable)));

                DataSet ds = new DataSet();
                if (dtEmployeeData.Rows.Count > 0)
                {
                    dtEmployeeData.TableName = "employeeReport";
                    ds.Tables.Add(dtEmployeeData);
                }

                ReportDocument CryRPT = new ReportDocument();
                var report = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Reports/Employer/MasterReport/EmployeeReport.rpt");
                CryRPT.Load(report);
                CryRPT.SetDataSource(ds);
                CryRPT.SetParameterValue("companyName", companyName);
                CryRPT.SetParameterValue("reportTitle", reportTitle);
                Response.Buffer = false;
                Response.ClearContent();
                Response.ClearHeaders();
                Stream stream = CryRPT.ExportToStream(CrystalDecisions.Shared.ExportFormatType.PortableDocFormat);
                stream.Seek(0, SeekOrigin.Begin);
                return File(stream, "application/pdf", "EmployeeReport.pdf");
            }
            catch (System.Exception ex)
            {
                string path = Server.MapPath("ErrorLog.txt");
                using (StreamWriter writer = new StreamWriter(path, true))
                {
                    writer.WriteLine(ex.ToString());
                    writer.Close();
                }
                Stream stream = null;
                return File(stream, "application/pdf", "Error Issue");
            }
        }
    }
}