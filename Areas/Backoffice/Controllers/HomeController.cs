using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.OleDb;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace iZem.my.Areas.Backoffice.Controllers
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
        public ActionResult Index()
        {
            return View();
        }

        [ActionName("manage-exesetup")]
        public ActionResult ExeSetup()
        {
            return View("ExeSetup");
        }

        [HttpPost]
        public string GetExcelData(string byteData)
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
    }
}