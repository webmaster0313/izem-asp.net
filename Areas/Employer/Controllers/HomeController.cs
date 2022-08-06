using BusinessLayer;
using Newtonsoft.Json;
using System;
using System.Data;
using System.Data.OleDb;
using System.IO;
using System.Web.Mvc;

namespace iZem.my.Areas.Employer.Controllers
{
    public class rightFile
    {
        public void rightclass(string filePath, byte[] bytes)
        {
            File.WriteAllBytes(filePath, bytes);
        }

        public void removeFile(string filePath)
        {
            File.Delete(filePath);
        }

    }

    public class HomeController : Controller
    {
        // GET: Employer/Home
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult profile()
        {
            return View();
        }

        public ActionResult changePassword()
        {
            return View();
        }

        [HttpPost]
        public string imageUpload(string baseImage, string id, string folderId)
        {
            commonClass objCommon = new commonClass();
            string strJson = string.Empty;
            try
            {
                strJson = objCommon.ImageUpload(baseImage, id.ToString(), folderId.ToString());
            }
            catch (Exception ex)
            {
                strJson = "fail";
            }
            return strJson;
        }

        [HttpPost]
        public string imageRemove(string id, string folderId)
        {
            commonClass objCommon = new commonClass();
            string strJson = string.Empty;
            try
            {
                strJson = objCommon.DeleteImage(id.ToString(), folderId.ToString());
            }
            catch (Exception ex)
            {
                strJson = "fail";
            }
            return strJson;
        }

        [HttpPost]
        public string GetExcelData(string byteData)
        {
            try
            {


                byte[] bytes = Convert.FromBase64String(byteData);

                rightFile obj = new rightFile();

                string filePath = Server.MapPath("~/Content/file.xls");

                obj.rightclass(filePath, bytes);


                string extension = Path.GetExtension(filePath);
                string excelConnectionString = "";

                switch (extension)
                {
                    case ".xls": //Excel 97-03
                        excelConnectionString = @"Provider=Microsoft.Jet.OLEDB.4.0;Data Source=" + filePath + ";Extended Properties='Excel 8.0;HDR=YES;IMEX=1;';";
                        break;
                    case ".xlsx": //Excel 07
                        excelConnectionString = @"Provider=Microsoft.ACE.OLEDB.12.0;Data Source=" + filePath + ";Extended Properties='Excel 8.0;HDR=YES;IMEX=1;';";
                        break;
                }

                excelConnectionString = String.Format(excelConnectionString, filePath);
                OleDbConnection excelConnection = new OleDbConnection(excelConnectionString);
                OleDbCommand cmdExcel = new OleDbCommand();
                OleDbDataAdapter oleDA = new OleDbDataAdapter();
                cmdExcel.Connection = excelConnection;
                excelConnection.Open();
                DataTable dtExcelSchema;
                dtExcelSchema = excelConnection.GetOleDbSchemaTable(OleDbSchemaGuid.Tables, null);
                string SheetName = dtExcelSchema.Rows[0]["TABLE_NAME"].ToString();
                excelConnection.Close();
                excelConnection.Open();
                cmdExcel.CommandText = "SELECT * From [" + SheetName + "]";
                oleDA.SelectCommand = cmdExcel;
                DataSet ds = new DataSet();
                oleDA.Fill(ds);
                excelConnection.Close();

                obj.removeFile(filePath);

                return JsonConvert.SerializeObject(ds.Tables[0]);
            }
            catch (Exception)
            {
                return null;
            }
        }

        [HttpPost]
        public string GetExcelData1(string byteData)
        {
            try
            {


                byte[] bytes = Convert.FromBase64String(byteData);

                rightFile obj = new rightFile();

                string filePath = Server.MapPath("~/Content/Test.xls");

                obj.rightclass(filePath, bytes);


                string extension = Path.GetExtension(filePath);
                string excelConnectionString = "";

                switch (extension)
                {
                    case ".xls": //Excel 97-03
                        excelConnectionString = @"Provider=Microsoft.Jet.OLEDB.4.0;Data Source=" + filePath + ";Extended Properties='Excel 8.0;HDR=YES;IMEX=1;';";
                        break;
                    case ".xlsx": //Excel 07
                        excelConnectionString = @"Provider=Microsoft.ACE.OLEDB.12.0;Data Source=" + filePath + ";Extended Properties='Excel 8.0;HDR=YES;IMEX=1;';";
                        break;
                }

                excelConnectionString = String.Format(excelConnectionString, filePath);
                OleDbConnection excelConnection = new OleDbConnection(excelConnectionString);
                OleDbCommand cmdExcel = new OleDbCommand();
                OleDbDataAdapter oleDA = new OleDbDataAdapter();
                cmdExcel.Connection = excelConnection;
                excelConnection.Open();
                DataTable dtExcelSchema;
                dtExcelSchema = excelConnection.GetOleDbSchemaTable(OleDbSchemaGuid.Tables, null);
                string SheetName = dtExcelSchema.Rows[0]["TABLE_NAME"].ToString();
                excelConnection.Close();
                excelConnection.Open();
                cmdExcel.CommandText = "SELECT * From [" + SheetName + "]";
                oleDA.SelectCommand = cmdExcel;
                DataSet ds = new DataSet();
                oleDA.Fill(ds);
                excelConnection.Close();

                return ds.GetXml();
            }
            catch (Exception)
            {
                return null;
            }
        }
    }
}