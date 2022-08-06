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
    public class AttendanceSettingController : Controller
    {
        // GET: Employer/AttendanceSetting
        public ActionResult Index()
        {
            return View();
        }

        [ActionName("manage-your-shift")]
        public ActionResult EmployerShiftSetting()
        {
            return View("EmployerShiftSetting");
        }

        [ActionName("manage-your-attendancelist")]
        public ActionResult EmployerAttendanceList()
        {
            return View("EmployerAttendanceList");
        }

        [ActionName("manage-your-attendancereport")]
        public ActionResult EmployerAttendanceReport()
        {
            return View("EmployerAttendanceReport");
        }

        [ActionName("manage-your-device")]
        public ActionResult EmployerDevice()
        {
            return View("EmployerDevice");
        }

        [ActionName("manage-your-transfer")]
        public ActionResult EmployerDataTransfer()
        {
            return View("EmployerDataTransfer");
        }

        //! Reports
        [HttpPost]
        public ActionResult load_attendanceReport(string companyName, string reportTitle, string timePeriod, string attendanceData)
        {
            try
            {
                DataTable dtAttendanceData = new DataTable();
                if (attendanceData != "")
                    dtAttendanceData = (DataTable)JsonConvert.DeserializeObject(attendanceData, (typeof(DataTable)));

                DataSet ds = new DataSet();
                if (dtAttendanceData.Rows.Count > 0)
                {
                    dtAttendanceData.TableName = "attendanceReport";
                    ds.Tables.Add(dtAttendanceData);
                }

                ReportDocument CryRPT = new ReportDocument();
                var report = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Reports/Employer/AttendanceReport/AttendanceReport.rpt");
                CryRPT.Load(report);
                CryRPT.SetDataSource(ds);
                CryRPT.SetParameterValue("companyName", companyName);
                CryRPT.SetParameterValue("reportTitle", reportTitle);
                CryRPT.SetParameterValue("timePeriod", timePeriod);
                Response.Buffer = false;
                Response.ClearContent();
                Response.ClearHeaders();
                Stream stream = CryRPT.ExportToStream(CrystalDecisions.Shared.ExportFormatType.PortableDocFormat);
                stream.Seek(0, SeekOrigin.Begin);
                return File(stream, "application/pdf", "AttendanceReport.pdf");
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

        [HttpPost]
        public ActionResult load_attendanceStartEnd1Report(string companyName, string reportTitle, string timePeriod, string attendanceData)
        {
            try
            {
                DataTable dtAttendanceData = new DataTable();
                if (attendanceData != "")
                    dtAttendanceData = (DataTable)JsonConvert.DeserializeObject(attendanceData, (typeof(DataTable)));

                DataSet ds = new DataSet();
                if (dtAttendanceData.Rows.Count > 0)
                {
                    dtAttendanceData.TableName = "attendanceStartEnd1Report";
                    ds.Tables.Add(dtAttendanceData);
                }

                ReportDocument CryRPT = new ReportDocument();
                var report = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Reports/Employer/AttendanceReport/AttendanceStartEnd1Report.rpt");
                CryRPT.Load(report);
                CryRPT.SetDataSource(ds);
                CryRPT.SetParameterValue("companyName", companyName);
                CryRPT.SetParameterValue("reportTitle", reportTitle);
                CryRPT.SetParameterValue("timePeriod", timePeriod);
                Response.Buffer = false;
                Response.ClearContent();
                Response.ClearHeaders();
                Stream stream = CryRPT.ExportToStream(CrystalDecisions.Shared.ExportFormatType.PortableDocFormat);
                stream.Seek(0, SeekOrigin.Begin);
                return File(stream, "application/pdf", "AttendanceStartEnd1Report.pdf");
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

        [HttpPost]
        public ActionResult load_attendanceStartEnd2Report(string companyName, string reportTitle, string timePeriod, string attendanceData)
        {
            try
            {
                DataTable dtAttendanceData = new DataTable();
                if (attendanceData != "")
                    dtAttendanceData = (DataTable)JsonConvert.DeserializeObject(attendanceData, (typeof(DataTable)));

                DataSet ds = new DataSet();
                if (dtAttendanceData.Rows.Count > 0)
                {
                    dtAttendanceData.TableName = "attendanceStartEnd2Report";
                    ds.Tables.Add(dtAttendanceData);
                }

                ReportDocument CryRPT = new ReportDocument();
                var report = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Reports/Employer/AttendanceReport/AttendanceStartEnd2Report.rpt");
                CryRPT.Load(report);
                CryRPT.SetDataSource(ds);
                CryRPT.SetParameterValue("companyName", companyName);
                CryRPT.SetParameterValue("reportTitle", reportTitle);
                CryRPT.SetParameterValue("timePeriod", timePeriod);
                Response.Buffer = false;
                Response.ClearContent();
                Response.ClearHeaders();
                Stream stream = CryRPT.ExportToStream(CrystalDecisions.Shared.ExportFormatType.PortableDocFormat);
                stream.Seek(0, SeekOrigin.Begin);
                return File(stream, "application/pdf", "AttendanceStartEnd2Report.pdf");
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

        [HttpPost]
        public ActionResult load_attendanceStartEnd3Report(string companyName, string reportTitle, string timePeriod, string attendanceData)
        {
            try
            {
                DataTable dtAttendanceData = new DataTable();
                if (attendanceData != "")
                    dtAttendanceData = (DataTable)JsonConvert.DeserializeObject(attendanceData, (typeof(DataTable)));

                DataSet ds = new DataSet();
                if (dtAttendanceData.Rows.Count > 0)
                {
                    dtAttendanceData.TableName = "attendanceStartEnd3Report";
                    ds.Tables.Add(dtAttendanceData);
                }

                ReportDocument CryRPT = new ReportDocument();
                var report = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Reports/Employer/AttendanceReport/AttendanceStartEnd3Report.rpt");
                CryRPT.Load(report);
                CryRPT.SetDataSource(ds);
                CryRPT.SetParameterValue("companyName", companyName);
                CryRPT.SetParameterValue("reportTitle", reportTitle);
                CryRPT.SetParameterValue("timePeriod", timePeriod);
                Response.Buffer = false;
                Response.ClearContent();
                Response.ClearHeaders();
                Stream stream = CryRPT.ExportToStream(CrystalDecisions.Shared.ExportFormatType.PortableDocFormat);
                stream.Seek(0, SeekOrigin.Begin);
                return File(stream, "application/pdf", "AttendanceStartEnd3Report.pdf");
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

        [HttpPost]
        public ActionResult load_attendanceOvertimeReport(string companyName, string reportTitle, string timePeriod, string attendanceData)
        {
            try
            {
                DataTable dtAttendanceData = new DataTable();
                if (attendanceData != "")
                    dtAttendanceData = (DataTable)JsonConvert.DeserializeObject(attendanceData, (typeof(DataTable)));

                DataSet ds = new DataSet();
                if (dtAttendanceData.Rows.Count > 0)
                {
                    dtAttendanceData.TableName = "attendanceOvertimeReport";
                    ds.Tables.Add(dtAttendanceData);
                }

                ReportDocument CryRPT = new ReportDocument();
                var report = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Reports/Employer/AttendanceReport/AttendanceOvertimeReport.rpt");
                CryRPT.Load(report);
                CryRPT.SetDataSource(ds);
                CryRPT.SetParameterValue("companyName", companyName);
                CryRPT.SetParameterValue("reportTitle", reportTitle);
                CryRPT.SetParameterValue("timePeriod", timePeriod);
                Response.Buffer = false;
                Response.ClearContent();
                Response.ClearHeaders();
                Stream stream = CryRPT.ExportToStream(CrystalDecisions.Shared.ExportFormatType.PortableDocFormat);
                stream.Seek(0, SeekOrigin.Begin);
                return File(stream, "application/pdf", "AttendanceOvertimeReport.pdf");
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

        [HttpPost]
        public ActionResult load_attendanceAddPayReport(string companyName, string reportTitle, string timePeriod, string attendanceData)
        {
            try
            {
                DataTable dtAttendanceData = new DataTable();
                if (attendanceData != "")
                    dtAttendanceData = (DataTable)JsonConvert.DeserializeObject(attendanceData, (typeof(DataTable)));

                DataSet ds = new DataSet();
                if (dtAttendanceData.Rows.Count > 0)
                {
                    dtAttendanceData.TableName = "attendanceAddPayReport";
                    ds.Tables.Add(dtAttendanceData);
                }

                ReportDocument CryRPT = new ReportDocument();
                var report = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Reports/Employer/AttendanceReport/AttendanceAddPayReport.rpt");
                CryRPT.Load(report);
                CryRPT.SetDataSource(ds);
                CryRPT.SetParameterValue("companyName", companyName);
                CryRPT.SetParameterValue("reportTitle", reportTitle);
                CryRPT.SetParameterValue("timePeriod", timePeriod);
                Response.Buffer = false;
                Response.ClearContent();
                Response.ClearHeaders();
                Stream stream = CryRPT.ExportToStream(CrystalDecisions.Shared.ExportFormatType.PortableDocFormat);
                stream.Seek(0, SeekOrigin.Begin);
                return File(stream, "application/pdf", "AttendanceAddPayReport.pdf");
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

        [HttpPost]
        public ActionResult load_attendanceShiftReport(string companyName, string reportTitle, string timePeriod, string attendanceData)
        {
            try
            {
                DataTable dtAttendanceData = new DataTable();
                if (attendanceData != "")
                    dtAttendanceData = (DataTable)JsonConvert.DeserializeObject(attendanceData, (typeof(DataTable)));

                DataSet ds = new DataSet();
                if (dtAttendanceData.Rows.Count > 0)
                {
                    dtAttendanceData.TableName = "attendanceShiftReport";
                    ds.Tables.Add(dtAttendanceData);
                }

                ReportDocument CryRPT = new ReportDocument();
                var report = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Reports/Employer/AttendanceReport/AttendanceShiftReport.rpt");
                CryRPT.Load(report);
                CryRPT.SetDataSource(ds);
                CryRPT.SetParameterValue("companyName", companyName);
                CryRPT.SetParameterValue("reportTitle", reportTitle);
                CryRPT.SetParameterValue("timePeriod", timePeriod);
                Response.Buffer = false;
                Response.ClearContent();
                Response.ClearHeaders();
                Stream stream = CryRPT.ExportToStream(CrystalDecisions.Shared.ExportFormatType.PortableDocFormat);
                stream.Seek(0, SeekOrigin.Begin);
                return File(stream, "application/pdf", "AttendanceShiftReport.pdf");
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