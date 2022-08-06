using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Web;
using System.Web.Mvc;

namespace iZem.my.Areas.Member.Controllers
{
    public class LeaveSettingController : Controller
    {
        // GET: Member/LeaveSetting
        public ActionResult Index()
        {
            return View();
        }

        [ActionName("manage-your-leaveapplication")]
        public ActionResult EmployeeLeaveApplication()
        {
            return View("EmployeeLeaveApplication");
        }

        [ActionName("manage-your-leavesummary")]
        public ActionResult EmployeeLeaveSummary()
        {
            return View("EmployeeLeaveSummary");
        }

        const string employerEmailId = "izemmalaysia@gmail.com";
        const string employerEmailPassword = "Admin@123";

        [HttpPost]
        public string send_EmailForPendingLeaveApplication(string employerEmail, string memberEmail, string loginName, string memberName, string leaveStatus, string dateRange,
            string leaveType, string leaveTotalDay, string takenLeave, string reason, string data)
        {
            try
            {
                DataTable dt = (DataTable)JsonConvert.DeserializeObject(data, (typeof(DataTable)));

                MailMessage message = new MailMessage();
                SmtpClient smtp = new SmtpClient();
                message.From = new MailAddress(employerEmailId, "Leave Application/HR Admin");
                message.To.Add(new MailAddress(memberEmail));
                message.CC.Add(new MailAddress(employerEmail));

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
    }
}