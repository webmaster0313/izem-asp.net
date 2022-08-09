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
    public class PayrollSettingController : Controller
    {

        const string employerEmailId = "izemmalaysia@gmail.com";
        const string employerEmailPassword = "Admin@123";

        // GET: Employer/PayrollSetting
        public ActionResult Index()
        {
            return View();
        }

        [ActionName("manage-payroll-additionalpaysetup")]
        public ActionResult EmployerAdditionalPaySetting()
        {
            return View("EmployerAdditionalPaySetting");
        }

        [ActionName("manage-payroll-globalsetting")]
        public ActionResult EmployerGlobalSetting()
        {
            return View("EmployerGlobalSetting");
        }

        [ActionName("manage-payroll-overtimesetup")]
        public ActionResult EmployerOvertimeSetting()
        {
            return View("EmployerOvertimeSetting");
        }

        [ActionName("manage-payroll-shiftsetup")]
        public ActionResult EmployerShiftSeting()
        {
            return View("EmployerShiftSeting");
        }

        [ActionName("manage-payroll-allowance-deduction")]
        public ActionResult EmployerAllowanceDeductionSetting()
        {
            return View("EmployerAllowanceDeductionSetting");
        }

        [ActionName("manage-payroll-process")]
        public ActionResult EmployerPayrollProcess()
        {
            return View("EmployerPayrollProcess");
        }

        [ActionName("manage-payroll-report")]
        public ActionResult EmployerPayrollReport()
        {
            return View("EmployerPayrollReport");
        }

        [ActionName("manage-hourlypayroll-process")]
        public ActionResult EmployerHourlySalaryProcess()
        {
            return View("EmployerHourlySalaryProcess");
        }
        //! Reports
        [HttpPost]
        public ActionResult load_hourlyPayVoucherReport(string companyName, string reportTitle, string hourlyData)
        {
            try
            {
                DataTable dtHourlyData = new DataTable();
                if (hourlyData != "")
                    dtHourlyData = (DataTable)JsonConvert.DeserializeObject(hourlyData, (typeof(DataTable)));

                DataSet ds = new DataSet();
                if (dtHourlyData.Rows.Count > 0)
                {
                    dtHourlyData.TableName = "hourlyPayVoucherReport";
                    ds.Tables.Add(dtHourlyData);
                }

                ReportDocument CryRPT = new ReportDocument();
                var report = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Reports/Employer/PayrollReport/HourlyPayVoucherReport.rpt");
                CryRPT.Load(report);
                CryRPT.SetDataSource(ds);
                CryRPT.SetParameterValue("companyName", companyName);
                CryRPT.SetParameterValue("reportTitle", reportTitle);
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
        public ActionResult load_hourlyPaymentMethodReport(string companyName, string reportTitle, string timePeriod, string hourlyData)
        {
            try
            {
                DataTable dtHourlyData = new DataTable();
                if (hourlyData != "")
                    dtHourlyData = (DataTable)JsonConvert.DeserializeObject(hourlyData, (typeof(DataTable)));

                DataSet ds = new DataSet();
                if (dtHourlyData.Rows.Count > 0)
                {
                    dtHourlyData.TableName = "hourlyPaymentMethod";
                    ds.Tables.Add(dtHourlyData);
                }

                ReportDocument CryRPT = new ReportDocument();
                var report = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Reports/Employer/PayrollReport/HourlyPaymentMethod.rpt");
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
                return File(stream, "application/pdf", "HourlyPaymentMethod.pdf");
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

        //! Section 1
        [HttpPost]
        public ActionResult load_payrollPayslipReport(string companyName, string companyAddress, string reportTitle, string firstDay, string lastDay,
            string salaryData, string earningData, string deductionData, string leaveSummaryData)
        {
            try
            {
                DataTable dtSalaryData = new DataTable();
                if (salaryData != "")
                    dtSalaryData = (DataTable)JsonConvert.DeserializeObject(salaryData, (typeof(DataTable)));

                DataTable dtEarningData = new DataTable();
                if (earningData != "")
                    dtEarningData = (DataTable)JsonConvert.DeserializeObject(earningData, (typeof(DataTable)));

                DataTable dtDeductionData = new DataTable();
                if (deductionData != "")
                    dtDeductionData = (DataTable)JsonConvert.DeserializeObject(deductionData, (typeof(DataTable)));

                DataTable dtLeaveSummaryData = new DataTable();
                if (leaveSummaryData != "")
                    dtLeaveSummaryData = (DataTable)JsonConvert.DeserializeObject(leaveSummaryData, (typeof(DataTable)));

                DataSet ds = new DataSet();
                if (dtSalaryData.Rows.Count > 0)
                {
                    dtSalaryData.TableName = "payslipSalary";
                    ds.Tables.Add(dtSalaryData);
                }

                if (dtEarningData.Rows.Count > 0)
                {
                    dtEarningData.TableName = "payslipEarning";
                    ds.Tables.Add(dtEarningData);
                }

                if (dtDeductionData.Rows.Count > 0)
                {
                    dtDeductionData.TableName = "payslipDeduction";
                    ds.Tables.Add(dtDeductionData);
                }

                if (dtLeaveSummaryData.Rows.Count > 0)
                {
                    dtLeaveSummaryData.TableName = "payslipLeaveSummary";
                    ds.Tables.Add(dtLeaveSummaryData);
                }

                ReportDocument CryRPT = new ReportDocument();
                var report = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Reports/Employer/PayrollReport/PayrollPayslipReport.rpt");
                CryRPT.Load(report);
                CryRPT.SetDataSource(ds);
                CryRPT.SetParameterValue("companyName", companyName);
                CryRPT.SetParameterValue("companyAddress", companyAddress);
                CryRPT.SetParameterValue("firstDay", firstDay);
                CryRPT.SetParameterValue("lastDay", lastDay);
                Response.Buffer = false;
                Response.ClearContent();
                Response.ClearHeaders();
                Stream stream = CryRPT.ExportToStream(CrystalDecisions.Shared.ExportFormatType.PortableDocFormat);
                stream.Seek(0, SeekOrigin.Begin);
                return File(stream, "application/pdf", "PayrollPayslipReport.pdf");
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
        public ActionResult load_payrollDetailReport(string companyName, string companyAddress, string reportTitle, string firstDay, string lastDay,
            string salaryData, string earningData, string deductionData, string reportType)
        {
            try
            {
                DataTable dtSalaryData = new DataTable();
                if (salaryData != "")
                    dtSalaryData = (DataTable)JsonConvert.DeserializeObject(salaryData, (typeof(DataTable)));

                DataTable dtEarningData = new DataTable();
                if (earningData != "")
                    dtEarningData = (DataTable)JsonConvert.DeserializeObject(earningData, (typeof(DataTable)));

                DataTable dtDeductionData = new DataTable();
                if (deductionData != "")
                    dtDeductionData = (DataTable)JsonConvert.DeserializeObject(deductionData, (typeof(DataTable)));

                DataSet ds = new DataSet();
                if (dtSalaryData.Rows.Count > 0)
                {
                    dtSalaryData.TableName = "payrollDetailReport";
                    ds.Tables.Add(dtSalaryData);
                }

                if (dtEarningData.Rows.Count > 0)
                {
                    dtEarningData.TableName = "payrollDetailEarningArray";
                    ds.Tables.Add(dtEarningData);
                }

                if (dtDeductionData.Rows.Count > 0)
                {
                    dtDeductionData.TableName = "payrollDetailDeductionArray";
                    ds.Tables.Add(dtDeductionData);
                }

                ReportDocument CryRPT = new ReportDocument();

                var report = "";
                if (reportType == "Normal")
                    report = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Reports/Employer/PayrollReport/PayrollDetailReport.rpt");

                if (reportType == "Department")
                    report = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Reports/Employer/PayrollReport/PayrollDetail_Department_Report.rpt");

                if (reportType == "Branch")
                    report = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Reports/Employer/PayrollReport/PayrollDetail_Branch_Report.rpt");

                CryRPT.Load(report);
                CryRPT.SetDataSource(ds);
                CryRPT.SetParameterValue("companyName", companyName);
                CryRPT.SetParameterValue("companyAddress", companyAddress);
                CryRPT.SetParameterValue("reportTitle", reportTitle);
                CryRPT.SetParameterValue("firstDay", firstDay);
                CryRPT.SetParameterValue("lastDay", lastDay);
                Response.Buffer = false;
                Response.ClearContent();
                Response.ClearHeaders();
                Stream stream = CryRPT.ExportToStream(CrystalDecisions.Shared.ExportFormatType.PortableDocFormat);
                stream.Seek(0, SeekOrigin.Begin);
                return File(stream, "application/pdf", "PayrollDetailReport.pdf");
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
        public ActionResult load_payrollOvertimeReport(string companyName, string reportTitle, string timePeriod, string payrollData)
        {
            try
            {
                DataTable dtPayrollData = new DataTable();
                if (payrollData != "")
                    dtPayrollData = (DataTable)JsonConvert.DeserializeObject(payrollData, (typeof(DataTable)));

                DataSet ds = new DataSet();
                if (dtPayrollData.Rows.Count > 0)
                {
                    dtPayrollData.TableName = "payrollOvertimeReport";
                    ds.Tables.Add(dtPayrollData);
                }

                ReportDocument CryRPT = new ReportDocument();
                var report = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Reports/Employer/PayrollReport/PayrollOvertimeReport.rpt");
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
                return File(stream, "application/pdf", "PayrollOvertimeReport.pdf");
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
        public ActionResult load_payrollAdditionalPayReport(string companyName, string reportTitle, string timePeriod, string payrollData)
        {
            try
            {
                DataTable dtPayrollData = new DataTable();
                if (payrollData != "")
                    dtPayrollData = (DataTable)JsonConvert.DeserializeObject(payrollData, (typeof(DataTable)));

                DataSet ds = new DataSet();
                if (dtPayrollData.Rows.Count > 0)
                {
                    dtPayrollData.TableName = "payrollAdditionalPayReport";
                    ds.Tables.Add(dtPayrollData);
                }

                ReportDocument CryRPT = new ReportDocument();
                var report = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Reports/Employer/PayrollReport/PayrollAdditionalPayReport.rpt");
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
                return File(stream, "application/pdf", "PayrollAdditionalPayReport.pdf");
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
        public ActionResult load_payrollShiftReport(string companyName, string reportTitle, string timePeriod, string payrollData)
        {
            try
            {
                DataTable dtPayrollData = new DataTable();
                if (payrollData != "")
                    dtPayrollData = (DataTable)JsonConvert.DeserializeObject(payrollData, (typeof(DataTable)));

                DataSet ds = new DataSet();
                if (dtPayrollData.Rows.Count > 0)
                {
                    dtPayrollData.TableName = "payrollShiftReport";
                    ds.Tables.Add(dtPayrollData);
                }

                ReportDocument CryRPT = new ReportDocument();
                var report = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Reports/Employer/PayrollReport/PayrollShiftReport.rpt");
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
                return File(stream, "application/pdf", "PayrollShiftReport.pdf");
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
        public ActionResult load_payrollPaymentMethodReport(string companyName, string reportTitle, string timePeriod, string payrollData)
        {
            try
            {
                DataTable dtPayrollData = new DataTable();
                if (payrollData != "")
                    dtPayrollData = (DataTable)JsonConvert.DeserializeObject(payrollData, (typeof(DataTable)));

                DataSet ds = new DataSet();
                if (dtPayrollData.Rows.Count > 0)
                {
                    dtPayrollData.TableName = "payrollPaymentMethodReport";
                    ds.Tables.Add(dtPayrollData);
                }

                ReportDocument CryRPT = new ReportDocument();
                var report = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Reports/Employer/PayrollReport/PayrollPaymentMethodReport.rpt");
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
                return File(stream, "application/pdf", "PayrollPaymentMethodReport.pdf");
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

        //. Text
        [HttpPost]
        public ActionResult load_payrollTextPerkeso_Socso_Report(string payrollYear, string payrollMonth, string objFilter, string objSetting)
        {
            try
            {
                DataTable dtObjFilter = new DataTable();
                if (objFilter != "")
                    dtObjFilter = (DataTable)JsonConvert.DeserializeObject(objFilter, (typeof(DataTable)));

                DataTable dtObjSetting = new DataTable();
                if (objSetting != "")
                    dtObjSetting = (DataTable)JsonConvert.DeserializeObject(objSetting, (typeof(DataTable)));

                MemoryStream memoryStream = new MemoryStream();
                TextWriter tw = new StreamWriter(memoryStream);

                string employerSocso = string.Empty;

                if (dtObjSetting.Rows.Count > 0)
                {
                    for (int i = 0; i < dtObjSetting.Rows.Count; i++)
                    {
                        employerSocso = dtObjSetting.Rows[i]["employerglobalpayrollSocsoNumber"].ToString();
                    }
                }

                if (dtObjFilter.Rows.Count > 0)
                {
                    string _textFile = string.Empty;
                    for (int i = 0; i < dtObjFilter.Rows.Count; i++)
                    {
                        _textFile = "";
                        string memberNric = dtObjFilter.Rows[i]["memberNric"].ToString().Replace("-", "");
                        string memberName = dtObjFilter.Rows[i]["memberName"].ToString();

                        string memberSocso = dtObjFilter.Rows[i]["memberSocso"].ToString();
                        string memberEIS = dtObjFilter.Rows[i]["memberEIS"].ToString();

                        string employerRegistration = dtObjFilter.Rows[i]["employerRegistration"].ToString();

                        string payrollstatutorySocsoEmployee = dtObjFilter.Rows[i]["payrollstatutorySocsoEmployeeRound2"].ToString();
                        string payrollstatutorySocsoEmployer = dtObjFilter.Rows[i]["payrollstatutorySocsoEmployerRound2"].ToString();

                        string _total = (Convert.ToDouble(payrollstatutorySocsoEmployee) + Convert.ToDouble(payrollstatutorySocsoEmployer)).ToString("0.00");
                        string value = _total.ToString().Replace(".", "");
                        value = Convert.ToInt32(value).ToString("D14");

                        string employeeLeaving = dtObjFilter.Rows[i]["employeeLeavingDDMMYYYY"].ToString().Replace("-", "");
                        string employeeJoining = dtObjFilter.Rows[i]["employeeJoiningDDMMYYYY"].ToString().Replace("-", "");

                        string _date = payrollMonth + payrollYear;

                        string convertJoining = "";

                        if (employeeLeaving != "")
                        {
                            convertJoining = employeeLeaving;
                        }
                        else
                        {
                            convertJoining = employeeJoining;
                        }

                        if (_total != "0.00")
                        {
                            _textFile += employerSocso.PadRight(12) + employerRegistration.PadRight(20);
                            _textFile += memberNric.PadRight(12) + memberName.PadRight(150);
                            //9 space
                            _textFile += _date + value + "         ";
                            tw.WriteLine(_textFile);
                        }
                    }
                }

                tw.Flush();

                var length = memoryStream.Length;
                tw.Close();
                var toWrite = new byte[length];
                Array.Copy(memoryStream.GetBuffer(), 0, toWrite, 0, length);

                return File(toWrite, "text/plain", "file.txt");
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

        //. Text
        [HttpPost]
        public ActionResult load_payrollTextPerkeso_Eis_Report(string payrollYear, string payrollMonth, string objFilter, string objSetting)
        {
            try
            {
                DataTable dtObjFilter = new DataTable();
                if (objFilter != "")
                    dtObjFilter = (DataTable)JsonConvert.DeserializeObject(objFilter, (typeof(DataTable)));

                DataTable dtObjSetting = new DataTable();
                if (objSetting != "")
                    dtObjSetting = (DataTable)JsonConvert.DeserializeObject(objSetting, (typeof(DataTable)));


                MemoryStream memoryStream = new MemoryStream();
                TextWriter tw = new StreamWriter(memoryStream);

                string employerSocso = string.Empty;

                if (dtObjSetting.Rows.Count > 0)
                {
                    for (int i = 0; i < dtObjSetting.Rows.Count; i++)
                    {
                        employerSocso = dtObjSetting.Rows[i]["employerglobalpayrollEISNumber"].ToString();
                    }
                }

                if (dtObjFilter.Rows.Count > 0)
                {
                    string _textFile = string.Empty;
                    for (int i = 0; i < dtObjFilter.Rows.Count; i++)
                    {
                        _textFile = "";
                        string memberNric = dtObjFilter.Rows[i]["memberNric"].ToString().Replace("-", "");
                        string memberName = dtObjFilter.Rows[i]["memberName"].ToString();

                        string memberSocso = dtObjFilter.Rows[i]["memberSocso"].ToString();
                        string memberEIS = dtObjFilter.Rows[i]["memberEIS"].ToString();

                        string employerRegistration = dtObjFilter.Rows[i]["employerRegistration"].ToString();

                        string payrollstatutoryEISEmployee = dtObjFilter.Rows[i]["payrollstatutoryEISEmployeeRound2"].ToString();
                        string payrollstatutoryEISEmployer = dtObjFilter.Rows[i]["payrollstatutoryEISEmployerRound2"].ToString();

                        string _total = (Convert.ToDouble(payrollstatutoryEISEmployee) + Convert.ToDouble(payrollstatutoryEISEmployer)).ToString("0.00");
                        string value = _total.ToString().Replace(".", "");
                        value = Convert.ToInt32(value).ToString("D14");

                        string employeeLeaving = dtObjFilter.Rows[i]["employeeLeavingDDMMYYYY"].ToString().Replace("-", "");
                        string employeeJoining = dtObjFilter.Rows[i]["employeeJoiningDDMMYYYY"].ToString().Replace("-", "");

                        string _date = payrollMonth + payrollYear;

                        string convertJoining = "";

                        if (employeeLeaving != "")
                        {
                            convertJoining = employeeLeaving;
                        }
                        else
                        {
                            convertJoining = employeeJoining;
                        }

                        if (_total != "0.00")
                        {
                            _textFile += employerSocso.PadRight(12) + employerRegistration.PadRight(20);
                            _textFile += memberNric.PadRight(12) + memberName.PadRight(150);
                            _textFile += _date + value + "         ";
                            tw.WriteLine(_textFile);
                        }
                    }
                }

                tw.Flush();

                var length = memoryStream.Length;
                tw.Close();
                var toWrite = new byte[length];
                Array.Copy(memoryStream.GetBuffer(), 0, toWrite, 0, length);

                return File(toWrite, "text/plain", "file.txt");
            }
            catch (System.Exception ex)
            {
                var toWrite = new byte[0];
                return File(toWrite, "text/plain", "file.txt");
            }
        }

        //. Text
        [HttpPost]
        public ActionResult load_payrollTextIncome_Tax_Text_File_for_PCB39(string payrollYear, string payrollMonth, string objFilter, string objSetting)
        {
            try
            {
                DataTable dtObjFilter = new DataTable();
                if (objFilter != "")
                    dtObjFilter = (DataTable)JsonConvert.DeserializeObject(objFilter, (typeof(DataTable)));

                DataTable dtObjSetting = new DataTable();
                if (objSetting != "")
                    dtObjSetting = (DataTable)JsonConvert.DeserializeObject(objSetting, (typeof(DataTable)));


                MemoryStream memoryStream = new MemoryStream();
                TextWriter tw = new StreamWriter(memoryStream);

                if (dtObjFilter.Rows.Count > 0)
                {
                    string _textFile = string.Empty;

                    /* Header */

                    double _MTDAmount = 0;
                    double _MTDRecords = 0;
                    double _CP38Amount = 0;
                    double _CP38Records = 0;

                    for (int i = 0; i < dtObjFilter.Rows.Count; i++)
                    {
                        if (dtObjFilter.Rows[i]["payrollstatutoryPcbEmployeeRound2"].ToString() != "0.00")
                        {
                            _MTDAmount += Convert.ToDouble(dtObjFilter.Rows[i]["payrollstatutoryPcbEmployeeRound2"].ToString());
                            _MTDRecords += 1;
                        }
                        if (dtObjFilter.Rows[i]["payrollallowancendeductionAmount"].ToString() != "0")
                        {
                            _CP38Amount += Convert.ToDouble(dtObjFilter.Rows[i]["payrollallowancendeductionAmount"].ToString());
                            _CP38Records += 1;
                        }
                    }

                    string employerPCB = "";
                    if (dtObjSetting.Rows.Count > 0)
                    {
                        employerPCB = dtObjSetting.Rows[0]["employerglobalpayrollPCBNumber"].ToString();
                    }

                    _textFile = "";
                    _textFile += "H".PadRight(1);
                    _textFile += employerPCB.PadRight(10);
                    _textFile += employerPCB.PadRight(10);
                    _textFile += payrollYear.ToString().PadRight(4);
                    _textFile += payrollMonth.ToString().PadRight(2);
                    _textFile += _MTDAmount.ToString().Replace(".", "").PadLeft(10, '0');
                    _textFile += _MTDRecords.ToString().Replace(".", "").PadLeft(5, '0');
                    _textFile += _CP38Amount.ToString().Replace(".", "").PadLeft(10, '0');
                    _textFile += _CP38Records.ToString().Replace(".", "").PadLeft(5, '0');

                    tw.WriteLine(_textFile);

                    for (int i = 0; i < dtObjFilter.Rows.Count; i++)
                    {
                        _textFile = "";

                        string _detail = "D";
                        string _incometax = dtObjFilter.Rows[i]["memberIncomeTax"].ToString();
                        string _wifecode = 0.ToString();
                        string _employeeName = dtObjFilter.Rows[i]["memberName"].ToString();
                        string _employeeIcNoNew = dtObjFilter.Rows[i]["memberNric"].ToString().Replace("-", "");
                        string _employeeIcNoOld = dtObjFilter.Rows[i]["memberNric"].ToString().Replace("-", "");
                        string _employeePassport = dtObjFilter.Rows[i]["memberpassport"].ToString();
                        string _countryCode = dtObjFilter.Rows[i]["mastercountryCode"].ToString();
                        string _MTD = dtObjFilter.Rows[i]["payrollstatutoryPcbEmployeeRound2"].ToString().Replace(".", "");
                        string _CP38 = dtObjFilter.Rows[i]["payrollallowancendeductionAmount"].ToString().Replace(".", "");
                        string _employeeNo = dtObjFilter.Rows[i]["employeeEnroll"].ToString();

                        _textFile += _detail.PadRight(1);
                        _textFile += _incometax.PadRight(10);
                        _textFile += _wifecode.PadRight(1);
                        _textFile += _employeeName.PadRight(60);
                        _textFile += _employeeIcNoOld.PadRight(12);
                        _textFile += _employeeIcNoNew.PadRight(12);
                        _textFile += _employeePassport.PadRight(12);
                        _textFile += _countryCode.PadRight(2);
                        _textFile += _MTD.PadLeft(8, '0');
                        _textFile += _CP38.PadLeft(8, '0');
                        _textFile += _employeeNo.PadRight(10);

                        tw.WriteLine(_textFile);
                    }
                }

                tw.Flush();

                var length = memoryStream.Length;
                tw.Close();
                var toWrite = new byte[length];
                Array.Copy(memoryStream.GetBuffer(), 0, toWrite, 0, length);

                return File(toWrite, "text/plain", "file.txt");
            }
            catch (System.Exception ex)
            {
                var toWrite = new byte[0];
                return File(toWrite, "text/plain", "file.txt");
            }
        }

        [HttpPost]
        public ActionResult load_payrollKWSP_EPF_FormA(string timePeriod, string objFilter, string objSetting)
        {
            try
            {
                DataTable dtObjFilter = new DataTable();
                if (objFilter != "")
                    dtObjFilter = (DataTable)JsonConvert.DeserializeObject(objFilter, (typeof(DataTable)));

                DataTable dtObjSetting = new DataTable();
                if (objSetting != "")
                    dtObjSetting = (DataTable)JsonConvert.DeserializeObject(objSetting, (typeof(DataTable)));

                DataSet ds = new DataSet();
                if (dtObjFilter.Rows.Count > 0)
                {
                    dtObjFilter.TableName = "Kwsp_EPF_FormAReport";
                    ds.Tables.Add(dtObjFilter);
                }
                if (dtObjSetting.Rows.Count > 0)
                {
                    dtObjSetting.TableName = "globalSettingReport";
                    ds.Tables.Add(dtObjSetting);
                }

                ReportDocument CryRPT = new ReportDocument();
                var report = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Reports/Employer/PayrollReport/PayrollKwspEpfFormA.rpt");
                CryRPT.Load(report);
                CryRPT.SetDataSource(ds);
                CryRPT.SetParameterValue("timePeriod", timePeriod);
                Response.Buffer = false;
                Response.ClearContent();
                Response.ClearHeaders();
                Stream stream = CryRPT.ExportToStream(CrystalDecisions.Shared.ExportFormatType.PortableDocFormat);
                stream.Seek(0, SeekOrigin.Begin);
                return File(stream, "application/pdf", "KWSP_EPF_FormA.pdf");
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
        public ActionResult load_payrollPerkeso_Socso_Form_A(string month, string year, string objFilter, string objSetting)
        {
            try
            {
                DataTable dtObjFilter = new DataTable();
                if (objFilter != "")
                    dtObjFilter = (DataTable)JsonConvert.DeserializeObject(objFilter, (typeof(DataTable)));

                DataTable dtObjSetting = new DataTable();
                if (objSetting != "")
                    dtObjSetting = (DataTable)JsonConvert.DeserializeObject(objSetting, (typeof(DataTable)));

                DataSet ds = new DataSet();
                if (dtObjFilter.Rows.Count > 0)
                {
                    dtObjFilter.TableName = "Perkeso_Socso_Form_AReport";
                    ds.Tables.Add(dtObjFilter);
                }
                if (dtObjSetting.Rows.Count > 0)
                {
                    dtObjSetting.TableName = "globalSettingReport";
                    ds.Tables.Add(dtObjSetting);
                }

                ReportDocument CryRPT = new ReportDocument();
                var report = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Reports/Employer/PayrollReport/PayrollPerkesoSocsoFormA.rpt");
                CryRPT.Load(report);
                CryRPT.SetDataSource(ds);
                CryRPT.SetParameterValue("month", month);
                CryRPT.SetParameterValue("year", year);
                Response.Buffer = false;
                Response.ClearContent();
                Response.ClearHeaders();
                Stream stream = CryRPT.ExportToStream(CrystalDecisions.Shared.ExportFormatType.PortableDocFormat);
                stream.Seek(0, SeekOrigin.Begin);
                return File(stream, "application/pdf", "Perkeso_Socso_FormA.pdf");
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
        public ActionResult load_payrollPerkeso_EIS_Form_A(string month, string year, string objFilter, string objSetting)
        {
            try
            {
                DataTable dtObjFilter = new DataTable();
                if (objFilter != "")
                    dtObjFilter = (DataTable)JsonConvert.DeserializeObject(objFilter, (typeof(DataTable)));

                DataTable dtObjSetting = new DataTable();
                if (objSetting != "")
                    dtObjSetting = (DataTable)JsonConvert.DeserializeObject(objSetting, (typeof(DataTable)));

                DataSet ds = new DataSet();
                if (dtObjFilter.Rows.Count > 0)
                {
                    dtObjFilter.TableName = "Perkeso_EIS_Form_AReport";
                    ds.Tables.Add(dtObjFilter);
                }
                if (dtObjSetting.Rows.Count > 0)
                {
                    dtObjSetting.TableName = "globalSettingReport";
                    ds.Tables.Add(dtObjSetting);
                }

                ReportDocument CryRPT = new ReportDocument();
                var report = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Reports/Employer/PayrollReport/PayrollPerkesoEisFormA.rpt");
                CryRPT.Load(report);
                CryRPT.SetDataSource(ds);
                CryRPT.SetParameterValue("month", month);
                CryRPT.SetParameterValue("year", year);
                Response.Buffer = false;
                Response.ClearContent();
                Response.ClearHeaders();
                Stream stream = CryRPT.ExportToStream(CrystalDecisions.Shared.ExportFormatType.PortableDocFormat);
                stream.Seek(0, SeekOrigin.Begin);
                return File(stream, "application/pdf", "Perkeso_Eis_FormA.pdf");
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
        public ActionResult load_payrollIncome_Tax_Form_PCB39(string companyName, string companyAddress, string month, string year, string obj, string objSetting)
        {
            try
            {
                DataTable dtObj = new DataTable();
                if (obj != "")
                    dtObj = (DataTable)JsonConvert.DeserializeObject(obj, (typeof(DataTable)));

                DataTable dtObjSetting = new DataTable();
                if (objSetting != "")
                    dtObjSetting = (DataTable)JsonConvert.DeserializeObject(objSetting, (typeof(DataTable)));

                DataSet ds = new DataSet();
                if (dtObj.Rows.Count > 0)
                {
                    dtObj.TableName = "Income_Tax_Form_PCB39";
                    ds.Tables.Add(dtObj);
                }
                if (dtObjSetting.Rows.Count > 0)
                {
                    dtObjSetting.TableName = "globalSettingReport";
                    ds.Tables.Add(dtObjSetting);
                }

                ReportDocument CryRPT = new ReportDocument();
                var report = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Reports/Employer/PayrollReport/IncomeTaxFormPCB39.rpt");
                CryRPT.Load(report);
                CryRPT.SetDataSource(ds);
                CryRPT.SetParameterValue("companyName", companyName);
                CryRPT.SetParameterValue("companyAddress", companyAddress);
                CryRPT.SetParameterValue("month", month);
                CryRPT.SetParameterValue("year", year);
                Response.Buffer = false;
                Response.ClearContent();
                Response.ClearHeaders();
                Stream stream = CryRPT.ExportToStream(CrystalDecisions.Shared.ExportFormatType.PortableDocFormat);
                stream.Seek(0, SeekOrigin.Begin);
                return File(stream, "application/pdf", "Income_Tax_Form_PCB39.pdf");
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
        public ActionResult load_payroll_HRDF_Form(string timePeriod, string companyName, string objFilter, string objSetting)
        {
            try
            {
                DataTable dtObjFilter = new DataTable();
                if (objFilter != "")
                    dtObjFilter = (DataTable)JsonConvert.DeserializeObject(objFilter, (typeof(DataTable)));

                DataTable dtObjSetting = new DataTable();
                if (objSetting != "")
                    dtObjSetting = (DataTable)JsonConvert.DeserializeObject(objSetting, (typeof(DataTable)));

                DataSet ds = new DataSet();
                if (dtObjFilter.Rows.Count > 0)
                {
                    dtObjFilter.TableName = "HRDF_FormReport";
                    ds.Tables.Add(dtObjFilter);
                }
                if (dtObjSetting.Rows.Count > 0)
                {
                    dtObjSetting.TableName = "globalSettingReport";
                    ds.Tables.Add(dtObjSetting);
                }

                ReportDocument CryRPT = new ReportDocument();
                var report = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Reports/Employer/PayrollReport/PayrollHRDFForm.rpt");
                CryRPT.Load(report);
                CryRPT.SetDataSource(ds);
                CryRPT.SetParameterValue("timePeriod", timePeriod);
                CryRPT.SetParameterValue("companyName", companyName);
                Response.Buffer = false;
                Response.ClearContent();
                Response.ClearHeaders();
                Stream stream = CryRPT.ExportToStream(CrystalDecisions.Shared.ExportFormatType.PortableDocFormat);
                stream.Seek(0, SeekOrigin.Begin);
                return File(stream, "application/pdf", "HRDF_Form.pdf");
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

        /* Email process for salary-slip */

        public string email_PayrollSlip(Stream file, string memberEmail)
        {
            byte[] b;
            using (BinaryReader br = new BinaryReader(file))
            {
                b = br.ReadBytes((int)file.Length);
            }

            MailMessage message = new MailMessage();
            SmtpClient smtp = new SmtpClient();
            message.From = new MailAddress(employerEmailId, "Payroll/HR Admin");
            message.To.Add(new MailAddress(memberEmail));
            message.Subject = "Payroll Salary Slip";
            message.IsBodyHtml = true;
            message.Body = "Please find your payroll salary slip.";

            var memStream = new MemoryStream(b);
            memStream.Position = 0;
            var contentType = new System.Net.Mime.ContentType(System.Net.Mime.MediaTypeNames.Application.Pdf);
            var reportAttachment = new Attachment(memStream, contentType);
            reportAttachment.ContentDisposition.FileName = "Payroll-Slip.pdf";
            message.Attachments.Add(reportAttachment);

            smtp.Port = 587;
            smtp.Host = "smtp.gmail.com";
            smtp.EnableSsl = true;
            smtp.UseDefaultCredentials = false;
            smtp.Credentials = new NetworkCredential(employerEmailId, employerEmailPassword);
            smtp.DeliveryMethod = SmtpDeliveryMethod.Network;
            smtp.Send(message);

            return "";
        }

        [HttpPost]
        public ActionResult send_payrollPayslipReport(string companyName, string companyAddress, string reportTitle, string firstDay, string lastDay,
          string salaryData, string earningData, string deductionData, string leaveSummaryData)
        {
            try
            {
                DataTable dtFilterSalaryData = new DataTable();
                if (salaryData != "")
                    dtFilterSalaryData = (DataTable)JsonConvert.DeserializeObject(salaryData, (typeof(DataTable)));

                DataTable dtEmployeeId = dtFilterSalaryData.DefaultView.ToTable(true, "employeeId");
                if (dtEmployeeId.Rows.Count > 0)
                {
                    for (int i = 0; i < dtEmployeeId.Rows.Count; i++)
                    {
                        DataTable dtSalaryData = new DataTable();
                        DataRow[] rows = dtFilterSalaryData.Select(" employeeId = " + dtEmployeeId.Rows[i]["employeeId"]);
                        if (rows.Length > 0)
                        {
                            dtSalaryData = rows.CopyToDataTable();
                            string memberEmail = dtSalaryData.Rows[0]["memberEmail"].ToString();
                            if (memberEmail != "")
                            {
                                DataTable dtEarningData = new DataTable();
                                if (earningData != "")
                                    dtEarningData = (DataTable)JsonConvert.DeserializeObject(earningData, (typeof(DataTable)));

                                DataTable dtDeductionData = new DataTable();
                                if (deductionData != "")
                                    dtDeductionData = (DataTable)JsonConvert.DeserializeObject(deductionData, (typeof(DataTable)));

                                DataTable dtLeaveSummaryData = new DataTable();
                                if (leaveSummaryData != "")
                                    dtLeaveSummaryData = (DataTable)JsonConvert.DeserializeObject(leaveSummaryData, (typeof(DataTable)));

                                DataSet ds = new DataSet();
                                if (dtSalaryData.Rows.Count > 0)
                                {
                                    dtSalaryData.TableName = "payslipSalary";
                                    ds.Tables.Add(dtSalaryData);
                                }
                                if (dtEarningData.Rows.Count > 0)
                                {
                                    dtEarningData.TableName = "payslipEarning";
                                    ds.Tables.Add(dtEarningData);
                                }
                                if (dtDeductionData.Rows.Count > 0)
                                {
                                    dtDeductionData.TableName = "payslipDeduction";
                                    ds.Tables.Add(dtDeductionData);
                                }
                                if (dtLeaveSummaryData.Rows.Count > 0)
                                {
                                    dtLeaveSummaryData.TableName = "payslipLeaveSummary";
                                    ds.Tables.Add(dtLeaveSummaryData);
                                }

                                ReportDocument CryRPT = new ReportDocument();
                                var report = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Reports/Employer/PayrollReport/PayrollPayslipDefaultReport.rpt");
                                CryRPT.Load(report);
                                CryRPT.SetDataSource(ds);
                                CryRPT.SetParameterValue("companyName", companyName);
                                CryRPT.SetParameterValue("companyAddress", companyAddress);
                                CryRPT.SetParameterValue("firstDay", firstDay);
                                CryRPT.SetParameterValue("lastDay", lastDay);
                                Response.Buffer = false;
                                Response.ClearContent();
                                Response.ClearHeaders();
                                Stream stream = CryRPT.ExportToStream(CrystalDecisions.Shared.ExportFormatType.PortableDocFormat);
                                stream.Seek(0, SeekOrigin.Begin);

                                email_PayrollSlip(stream, memberEmail);
                            }
                        }
                    }
                }
                return null;
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

        /* Email process for Pay-Voucher */
        public string email_HourlyPayVoucher(Stream file, string memberEmail)
        {
            byte[] b;
            using (BinaryReader br = new BinaryReader(file))
            {
                b = br.ReadBytes((int)file.Length);
            }

            MailMessage message = new MailMessage();
            SmtpClient smtp = new SmtpClient();
            message.From = new MailAddress(employerEmailId, "Payroll/HR Admin");
            message.To.Add(new MailAddress(memberEmail));
            message.Subject = "Hourly Payment Voucher";
            message.IsBodyHtml = true;
            message.Body = "Please find your hourly payment voucher.";

            var memStream = new MemoryStream(b);
            memStream.Position = 0;
            var contentType = new System.Net.Mime.ContentType(System.Net.Mime.MediaTypeNames.Application.Pdf);
            var reportAttachment = new Attachment(memStream, contentType);
            reportAttachment.ContentDisposition.FileName = "Hourly-Payment-Voucher.pdf";
            message.Attachments.Add(reportAttachment);

            smtp.Port = 587;
            smtp.Host = "smtp.gmail.com";
            smtp.EnableSsl = true;
            smtp.UseDefaultCredentials = false;
            smtp.Credentials = new NetworkCredential(employerEmailId, employerEmailPassword);
            smtp.DeliveryMethod = SmtpDeliveryMethod.Network;
            smtp.Send(message);

            return "";
        }

        [HttpPost]
        public ActionResult send_hourlyPayVoucherReport(string companyName, string reportTitle, string hourlyData)
        {
            try
            {
                DataTable dtHourlyData = new DataTable();
                if (hourlyData != "")
                    dtHourlyData = (DataTable)JsonConvert.DeserializeObject(hourlyData, (typeof(DataTable)));

                DataTable dt1 = dtHourlyData.DefaultView.ToTable(true, "employeeId");
                if (dt1.Rows.Count > 0)
                {
                    for (int i = 0; i < dt1.Rows.Count; i++)
                    {
                        DataRow[] rows = dtHourlyData.Select(" employeeId = " + dt1.Rows[i]["employeeId"]);
                        if (rows.Length > 0)
                        {
                            string memberEmail = rows[0]["memberEmail"].ToString();
                            if (memberEmail != "")
                            {
                                DataTable dt = new DataTable();
                                dt.Clear();
                                dt.Columns.Add("memberName");
                                dt.Columns.Add("memberNric");
                                dt.Columns.Add("employerdepartmentTitle");
                                dt.Columns.Add("employerbranchName");
                                dt.Columns.Add("employeeEnroll");
                                dt.Columns.Add("memberEmail");
                                dt.Columns.Add("payrollDateDDMMYYYY");
                                dt.Columns.Add("payrollInTimeDDMMYYYYHHMMSS");
                                dt.Columns.Add("payrollOutTimeDDMMYYYYHHMMSS");
                                dt.Columns.Add("payrollBasicSalaryRound2");
                                dt.Columns.Add("payrollNetSalaryRound2");
                                dt.Columns.Add("totalTime");


                                for (int j = 0; j < rows.Length; j++)
                                {
                                    DataRow _data = dt.NewRow();
                                    _data["memberName"] = rows[j]["memberName"];
                                    _data["memberNric"] = rows[j]["memberNric"];
                                    _data["employerdepartmentTitle"] = rows[j]["employerdepartmentTitle"];
                                    _data["employerbranchName"] = rows[j]["employerbranchName"];
                                    _data["employeeEnroll"] = rows[j]["employeeEnroll"];
                                    _data["memberEmail"] = rows[j]["memberEmail"];
                                    _data["payrollDateDDMMYYYY"] = rows[j]["payrollDateDDMMYYYY"];
                                    _data["payrollInTimeDDMMYYYYHHMMSS"] = rows[j]["payrollInTimeDDMMYYYYHHMMSS"];
                                    _data["payrollOutTimeDDMMYYYYHHMMSS"] = rows[j]["payrollOutTimeDDMMYYYYHHMMSS"];
                                    _data["payrollBasicSalaryRound2"] = rows[j]["payrollBasicSalaryRound2"];
                                    _data["payrollNetSalaryRound2"] = rows[j]["payrollNetSalaryRound2"];
                                    _data["totalTime"] = rows[j]["totalTime"];
                                    dt.Rows.Add(_data);
                                }

                                DataSet ds = new DataSet();
                                dt.TableName = "hourlyPayVoucherReport";
                                ds.Tables.Add(dt);

                                ReportDocument CryRPT = new ReportDocument();
                                var report = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Reports/Employer/PayrollReport/HourlyPayVoucherReport.rpt");
                                CryRPT.Load(report);
                                CryRPT.SetDataSource(ds);
                                CryRPT.SetParameterValue("companyName", companyName);
                                CryRPT.SetParameterValue("reportTitle", reportTitle);
                                Response.Buffer = false;
                                Response.ClearContent();
                                Response.ClearHeaders();
                                Stream stream = CryRPT.ExportToStream(CrystalDecisions.Shared.ExportFormatType.PortableDocFormat);
                                stream.Seek(0, SeekOrigin.Begin);

                                email_HourlyPayVoucher(stream, memberEmail);
                            }
                        }
                    }
                }
                return null;
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

        /* EA Form */
        [HttpPost]
        public ActionResult load_payrollEAForm(string year, string masterData, string companyNameAddress, string companyPhone, string iZemUser)
        {
            try
            {
                DataTable dtMasterData = new DataTable();
                if (masterData != "")
                    dtMasterData = (DataTable)JsonConvert.DeserializeObject(masterData, (typeof(DataTable)));

                DataSet ds = new DataSet();
                if (dtMasterData.Rows.Count > 0)
                {
                    dtMasterData.TableName = "EAReport";
                    ds.Tables.Add(dtMasterData);
                }

                ReportDocument CryRPT = new ReportDocument();
                var report = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Reports/Employer/PayrollReport/PayrollEAForm.rpt");
                CryRPT.Load(report);
                CryRPT.SetDataSource(ds);
                CryRPT.SetParameterValue("year", year);
                CryRPT.SetParameterValue("companyNameAddress", companyNameAddress);
                CryRPT.SetParameterValue("companyPhone", companyPhone);
                CryRPT.SetParameterValue("iZemUser", iZemUser);
                Response.Buffer = false;
                Response.ClearContent();
                Response.ClearHeaders();
                Stream stream = CryRPT.ExportToStream(CrystalDecisions.Shared.ExportFormatType.PortableDocFormat);
                stream.Seek(0, SeekOrigin.Begin);
                return File(stream, "application/pdf", "Perkeso_Eis_FormA.pdf");
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
        public ActionResult load_IncomeTax_EFormfor_Employer(string objFilter)
        {
            try
            {
                DataTable dtObjFilter = new DataTable();
                if (objFilter != "")
                    dtObjFilter = (DataTable)JsonConvert.DeserializeObject(objFilter, (typeof(DataTable)));

                DataSet ds = new DataSet();
                if (dtObjFilter.Rows.Count > 0)
                {
                    dtObjFilter.TableName = "IncomeTaxEFormforEmployer";
                    ds.Tables.Add(dtObjFilter);
                }

                ReportDocument CryRPT = new ReportDocument();
                var report = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Reports/Employer/PayrollReport/PayrollEFormForEmployer.rpt");
                CryRPT.Load(report);
                CryRPT.SetDataSource(ds);
                CryRPT.SetParameterValue("year", "2021");
                Response.Buffer = false;
                Response.ClearContent();
                Response.ClearHeaders();
                Stream stream = CryRPT.ExportToStream(CrystalDecisions.Shared.ExportFormatType.PortableDocFormat);
                stream.Seek(0, SeekOrigin.Begin);
                return File(stream, "application/pdf", "PayrollEFormForEmployer.pdf");
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
        public ActionResult load_PayrollCP22AReport(string objFilter, string objYear)
        {
            try
            {
                DataTable dtObjFilter = new DataTable();
                if (objFilter != "")
                    dtObjFilter = (DataTable)JsonConvert.DeserializeObject(objFilter, (typeof(DataTable)));

                DataSet ds = new DataSet();
                if (dtObjFilter.Rows.Count > 0)
                {
                    dtObjFilter.TableName = "CP22AReport";
                    ds.Tables.Add(dtObjFilter);
                }

                ReportDocument CryRPT = new ReportDocument();
                var report = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Reports/Employer/PayrollReport/PayrollCP22AReport.rpt");
                CryRPT.Load(report);
                CryRPT.SetDataSource(ds);
                CryRPT.SetParameterValue("year", objYear);
                Response.Buffer = false;
                Response.ClearContent();
                Response.ClearHeaders();
                Stream stream = CryRPT.ExportToStream(CrystalDecisions.Shared.ExportFormatType.PortableDocFormat);
                stream.Seek(0, SeekOrigin.Begin);
                return File(stream, "application/pdf", "PayrollCP22AReport.pdf");
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
        public ActionResult load_payrollTextIncomeTax_EFormfor_Employer(string masterData)
        {
            try
            {
                DataTable dtMasterData = new DataTable();
                if (masterData != "")
                    dtMasterData = (DataTable)JsonConvert.DeserializeObject(masterData, (typeof(DataTable)));

                MemoryStream memoryStream = new MemoryStream();
                TextWriter tw = new StreamWriter(memoryStream);

                if (dtMasterData.Rows.Count > 0)
                {
                    string _textFile = string.Empty;

                    for (int i = 0; i < dtMasterData.Rows.Count; i++)
                    {
                        _textFile = "";
                        string _memberName = dtMasterData.Rows[i]["memberName"].ToString();
                        string _memberIncomeTax = dtMasterData.Rows[i]["memberIncomeTax"].ToString();
                        string _memberPassport = dtMasterData.Rows[i]["memberPassport"].ToString();
                        string _memberNric = dtMasterData.Rows[i]["memberNric"].ToString();
                        string _PCBCategory = dtMasterData.Rows[i]["employeesalarysetupCategory"].ToString();
                        string _TaxBornByEmployer = dtMasterData.Rows[i]["employeesalarysetupTaxBorneEmployer"].ToString();
                        string _NoChilder = dtMasterData.Rows[i]["employeesalarysetupChildren"].ToString();
                        string _ChildrenDeductionAmount = dtMasterData.Rows[i]["childrenValue"].ToString();
                        string _FormEA1A = dtMasterData.Rows[i]["SectionB1A"].ToString();
                        string _FormEA3 = dtMasterData.Rows[i]["SectionB3"].ToString();
                        string _FormEA4 = dtMasterData.Rows[i]["SectionB4"].ToString();
                        string _FormEA1E = dtMasterData.Rows[i]["SectionB1E"].ToString();
                        string _FormEA1F = dtMasterData.Rows[i]["SectionB1F"].ToString();
                        string _MinusBIK = dtMasterData.Rows[i]["MinusBIK"].ToString();
                        string _Zakat = 0.ToString();
                        string _EPFEmployee = dtMasterData.Rows[i]["payrollstatutoryEpfEmployeeRound2"].ToString();
                        string _ZakatAllowance = dtMasterData.Rows[i]["SectionDZAKAT"].ToString();
                        string _PCBDeducted = dtMasterData.Rows[i]["payrollstatutoryPcbEmployeeRound2"].ToString();
                        string _CP38Checked = dtMasterData.Rows[i]["CP38Total"].ToString();

                        _textFile += _memberName + "|";
                        _textFile += _memberIncomeTax + "|";
                        _textFile += _memberPassport + "|";
                        if (_memberNric != "")
                        {
                            _textFile += _memberNric + "|";
                        }
                        else
                        {
                            _textFile += _PCBCategory + "|";
                        }
                        _textFile += _TaxBornByEmployer + "|";
                        _textFile += _NoChilder + "|";
                        _textFile += _ChildrenDeductionAmount + "|";
                        _textFile += _FormEA1A + "|";
                        _textFile += _FormEA3 + "|";
                        _textFile += _FormEA4 + "|";
                        _textFile += _FormEA1E + "|";
                        _textFile += _FormEA1F + "|";
                        _textFile += _MinusBIK + "|";
                        _textFile += _Zakat + "|";
                        _textFile += _EPFEmployee + "|";
                        _textFile += _ZakatAllowance + "|";
                        _textFile += _PCBDeducted + "|";
                        _textFile += _CP38Checked + "|";

                        tw.WriteLine(_textFile);
                    }
                }

                tw.Flush();

                var length = memoryStream.Length;
                tw.Close();
                var toWrite = new byte[length];
                Array.Copy(memoryStream.GetBuffer(), 0, toWrite, 0, length);

                return File(toWrite, "text/plain", "file.txt");
            }
            catch (System.Exception ex)
            {
                var toWrite = new byte[0];
                return File(toWrite, "text/plain", "file.txt");
            }
        }

        /* PCB-38 */
        [HttpPost]
        public ActionResult load_payrollPCB38(string masterData, string year, string pcbNumber, string employerName, string employerContactno, string employerAddress)
        {
            try
            {
                DataTable dtMasterData = new DataTable();
                if (masterData != "")
                    dtMasterData = (DataTable)JsonConvert.DeserializeObject(masterData, (typeof(DataTable)));

                DataSet ds = new DataSet();
                if (dtMasterData.Rows.Count > 0)
                {
                    dtMasterData.TableName = "PayrollPCB38";
                    ds.Tables.Add(dtMasterData);
                }

                ReportDocument CryRPT = new ReportDocument();
                var report = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Reports/Employer/PayrollReport/PayrollPCB38Report.rpt");
                CryRPT.Load(report);
                CryRPT.SetDataSource(ds);
                CryRPT.SetParameterValue("Year", year);
                CryRPT.SetParameterValue("pcbNumber", pcbNumber);
                CryRPT.SetParameterValue("employerName", employerName);
                CryRPT.SetParameterValue("employerContactno", employerContactno);
                CryRPT.SetParameterValue("employerAddress", employerAddress);
                Response.Buffer = false;
                Response.ClearContent();
                Response.ClearHeaders();
                Stream stream = CryRPT.ExportToStream(CrystalDecisions.Shared.ExportFormatType.PortableDocFormat);
                stream.Seek(0, SeekOrigin.Begin);
                return File(stream, "application/pdf", "PayrollPCB38.pdf");
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