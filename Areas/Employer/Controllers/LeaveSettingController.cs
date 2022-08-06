using CrystalDecisions.CrystalReports.Engine;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Web;
using System.Web.Mvc;

namespace iZem.my.Areas.Employer.Controllers
{
    public class LeaveSettingController : Controller
    {
        // GET: Employer/LeaveSetting
        public ActionResult Index()
        {
            return View();
        }

        [ActionName("manage-your-leavetype")]
        public ActionResult EmployerLeaveType()
        {
            return View("EmployerLeaveType");
        }

        [ActionName("manage-your-leaveapplication")]
        public ActionResult EmployerLeaveApplication()
        {
            return View("EmployerLeaveApplication");
        }

        [ActionName("manage-your-leavesummary")]
        public ActionResult EmployerLeaveSummary()
        {
            return View("EmployerLeaveSummary");
        }

        const string employerEmailId = "izemmalaysia@gmail.com";
        const string employerEmailPassword = "nufzhmscsyzqqjwi";

        //! Emails
        [HttpPost]
        public string send_EmailForRejectLeaveApplication(string memberEmail, string loginName, string memberName, string leaveStatus,
            string dateRange, string leaveType, string leaveTotalDay, string takenLeave, string reason)
        {
            try
            {
                MailMessage message = new MailMessage();
                SmtpClient smtp = new SmtpClient();
                message.From = new MailAddress(employerEmailId, "Leave Application/HR Admin");
                message.To.Add(new MailAddress(memberEmail));
                message.Subject = leaveType + " request rejected";
                message.IsBodyHtml = true;
                string contain = string.Empty;

                contain += "Dear, <b>" + memberName + "</b>,";
                contain += "<br />";
                contain += "<br />";
                contain += "Your leave application for " + leaveStatus + " " + takenLeave + " from " + dateRange + " was rejected due to the " + reason;
                contain += "<br />";
                contain += "<br />";
                contain += "Please contact your manager for more details.";
                contain += "<br />";
                contain += "<br />";
                contain += "Thank you,";
                contain += "<br />";
                contain += "Izem System Admin";

                message.Body = contain;

                smtp.Port = 587;
                smtp.Host = "smtp.gmail.com";
                smtp.EnableSsl = true;
                smtp.UseDefaultCredentials = false;
                smtp.Credentials = new NetworkCredential(employerEmailId, employerEmailPassword);
                smtp.DeliveryMethod = SmtpDeliveryMethod.Network;
                smtp.Send(message);

                return "Sent";
            }
            catch (System.Exception ex)
            {
                return ex.ToString();

            }
        }

        [HttpPost]
        public string send_EmailForApproveLeaveApplication(string memberEmail, string loginName, string memberName, string leaveStatus,
            string dateRange, string leaveType, string leaveTotalDay, string takenLeave, string reason, string data)
        {
            try
            {
                DataTable dt = (DataTable)JsonConvert.DeserializeObject(data, (typeof(DataTable)));

                MailMessage message = new MailMessage();
                SmtpClient smtp = new SmtpClient();
                message.From = new MailAddress(employerEmailId, "Leave Application/HR Admin");
                message.To.Add(new MailAddress(memberEmail));
                message.Subject = leaveType + " request approved";
                message.IsBodyHtml = true;
                string contain = string.Empty;

                contain += "Dear, <b>" + memberName + "</b>,";
                contain += "<br />";
                contain += "<br />";
                contain += "Your leave application for " + leaveType + " " + takenLeave + " from " + dateRange + " with the reason "+ reason + " was approved";
                contain += "<br />";
                contain += "<br />";
                contain += "Your leave summary after minus the above leave as below: ";
                contain += "<br />";
                contain += "<br />";
                contain += "<table border = 1>";
                contain += "<thead>";
                contain += "<tr>";
                contain += "<th>Start Year</th> <th>End Year</th> <th>Type</th> <th>Entitled</th> <th>Pre. YearBnf</th> <th>Total Entitled</th> <th>Taken Leave</th> <th>Balance Leave</th>";
                contain += "</tr>";
                contain += "</thead>";

                if (dt.Rows.Count > 0)
                {
                    for (int i = 0; i < dt.Rows.Count; i++)
                    {
                        contain += "<tr>";
                        contain += "<td>" + dt.Rows[i]["currentStartYear"].ToString() + "</td>";
                        contain += "<td>" + dt.Rows[i]["currentEndYear"].ToString() + "</td>";
                        contain += "<td>" + dt.Rows[i]["employerleavetypeLeaveType"].ToString() + "</td>";
                        contain += "<td>" + dt.Rows[i]["totalEntitleForYear"].ToString() + "</td>";
                        contain += "<td>" + dt.Rows[i]["previousYearBnf"].ToString() + "</td>";
                        contain += "<td>" + dt.Rows[i]["EntitleDay"].ToString() + "</td>";
                        contain += "<td>" + dt.Rows[i]["totalLeave"].ToString() + "</td>";
                        contain += "<td>" + dt.Rows[i]["totalLeaveBalance"].ToString() + "</td>";
                        contain += "</tr>";
                    }
                }
                contain += "</table>";

                contain += "<br />";
                contain += "<br />";
                contain += "Thank you,";
                contain += "<br />";
                contain += "Izem System Admin";

                message.Body = contain;

                smtp.Port = 587;
                smtp.Host = "smtp.gmail.com";
                smtp.EnableSsl = true;
                smtp.UseDefaultCredentials = false;
                smtp.Credentials = new NetworkCredential(employerEmailId, employerEmailPassword);
                smtp.DeliveryMethod = SmtpDeliveryMethod.Network;
                smtp.Send(message);

                return "Sent";
            }
            catch (System.Exception ex)
            {
                return ex.ToString();

            }
        }

        [HttpPost]
        public string send_EmailForPendingLeaveApplication(string memberEmail, string loginName, string memberName, string leaveStatus, string dateRange, string leaveType, string leaveTotalDay, string takenLeave, string reason, string data)
        {
            try
            {
                DataTable dt = (DataTable)JsonConvert.DeserializeObject(data, (typeof(DataTable)));

                MailMessage message = new MailMessage();
                SmtpClient smtp = new SmtpClient();
                message.From = new MailAddress(employerEmailId, "Leave Application/HR Admin");
                message.To.Add(new MailAddress(memberEmail));
                message.CC.Add(new MailAddress(memberEmail));

                message.Subject = leaveType + " request from " + memberName;
                message.IsBodyHtml = true;
                string contain = string.Empty;

                contain += "Dear, <b>" + memberEmail + "</b>,";
                contain += "<br />";
                contain += "<br />";
                contain += memberName + " has applied for " + leaveType + " " + takenLeave + " from " + dateRange + " with the reason " + reason + ".";
                contain += "<br />";
                contain += "<br />";
                contain += "Please review this application for approval or rejection.  The leave summary of this employee is as below including above applied leave(s) dates:";
                contain += "<br />";
                contain += "<br />";
                contain += "<table border = 1>";
                contain += "<thead>";
                contain += "<tr>";
                contain += "<th>Start Year</th> <th>End Year</th> <th>Type</th> <th>Entitled</th> <th>Pre. YearBnf</th> <th>Total Entitled</th> <th>Taken Leave</th> <th>Balance Leave</th>";
                contain += "</tr>";
                contain += "</thead>";

                if (dt.Rows.Count > 0)
                {
                    for (int i = 0; i < dt.Rows.Count; i++)
                    {
                        contain += "<tr>";
                        contain += "<td>" + dt.Rows[i]["currentStartYear"].ToString() + "</td>";
                        contain += "<td>" + dt.Rows[i]["currentEndYear"].ToString() + "</td>";
                        contain += "<td>" + dt.Rows[i]["employerleavetypeLeaveType"].ToString() + "</td>";
                        contain += "<td>" + dt.Rows[i]["totalEntitleForYear"].ToString() + "</td>";
                        contain += "<td>" + dt.Rows[i]["previousYearBnf"].ToString() + "</td>";
                        contain += "<td>" + dt.Rows[i]["EntitleDay"].ToString() + "</td>";
                        contain += "<td>" + dt.Rows[i]["totalLeave"].ToString() + "</td>";
                        contain += "<td>" + dt.Rows[i]["totalLeaveBalance"].ToString() + "</td>";
                        contain += "</tr>";
                    }
                }
                contain += "</table>";

                contain += "<br />";
                contain += "<br />";
                contain += "Thank you,";
                contain += "<br />";
                contain += "Izem System Admin";

                message.Body = contain;

                smtp.Port = 587;
                smtp.Host = "smtp.gmail.com";
                smtp.EnableSsl = true;
                smtp.UseDefaultCredentials = false;
                smtp.Credentials = new NetworkCredential(employerEmailId, employerEmailPassword);
                smtp.DeliveryMethod = SmtpDeliveryMethod.Network;
                smtp.Send(message);

                return "Sent";
            }
            catch (System.Exception ex)
            {
                return ex.ToString();

            }
        }

        //! Reports
        [HttpPost]
        public ActionResult load_leaveApplicationReport(string companyName, string reportTitle, string timePeriod, string leaveApplicationData)
        {
            try
            {
                DataTable dtLeaveApplicationData = new DataTable();
                if (leaveApplicationData != "")
                    dtLeaveApplicationData = (DataTable)JsonConvert.DeserializeObject(leaveApplicationData, (typeof(DataTable)));

                DataSet ds = new DataSet();
                if (dtLeaveApplicationData.Rows.Count > 0)
                {
                    dtLeaveApplicationData.TableName = "leaveApplicationReport";
                    ds.Tables.Add(dtLeaveApplicationData);
                }

                ReportDocument CryRPT = new ReportDocument();
                var report = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Reports/Employer/LeaveReport/LeaveApplicationReport.rpt");
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
        public ActionResult load_leaveCurrentLeaveSummaryReport(string companyName, string reportTitle, string leaveApplicationData)
        {
            try
            {
                DataTable dtLeaveApplicationData = new DataTable();
                if (leaveApplicationData != "")
                    dtLeaveApplicationData = (DataTable)JsonConvert.DeserializeObject(leaveApplicationData, (typeof(DataTable)));

                DataSet ds = new DataSet();
                if (dtLeaveApplicationData.Rows.Count > 0)
                {
                    dtLeaveApplicationData.TableName = "leaveCurrentLeaveSummaryReport";
                    ds.Tables.Add(dtLeaveApplicationData);
                }

                ReportDocument CryRPT = new ReportDocument();
                var report = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Reports/Employer/LeaveReport/LeaveCurrentLeaveSummaryReport.rpt");
                CryRPT.Load(report);
                CryRPT.SetDataSource(ds);
                CryRPT.SetParameterValue("companyName", companyName);
                CryRPT.SetParameterValue("reportTitle", reportTitle);
                Response.Buffer = false;
                Response.ClearContent();
                Response.ClearHeaders();
                Stream stream = CryRPT.ExportToStream(CrystalDecisions.Shared.ExportFormatType.PortableDocFormat);
                stream.Seek(0, SeekOrigin.Begin);
                return File(stream, "application/pdf", "LeaveCurrentLeaveSummaryReport.pdf");
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
        public ActionResult load_leaveDetailReport(string companyName, string reportTitle, string timePeriod, string leaveApplicationData)
        {
            try
            {
                DataTable dtLeaveApplicationData = new DataTable();
                if (leaveApplicationData != "")
                    dtLeaveApplicationData = (DataTable)JsonConvert.DeserializeObject(leaveApplicationData, (typeof(DataTable)));

                DataSet ds = new DataSet();
                if (dtLeaveApplicationData.Rows.Count > 0)
                {
                    dtLeaveApplicationData.TableName = "leaveDetailReport";
                    ds.Tables.Add(dtLeaveApplicationData);
                }

                ReportDocument CryRPT = new ReportDocument();
                var report = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Reports/Employer/LeaveReport/LeaveDetailReport.rpt");
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
                return File(stream, "application/pdf", "LeaveDetailReport.pdf");
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