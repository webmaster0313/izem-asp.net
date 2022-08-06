using System;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.IO;
using System.Web;

namespace BusinessLayer
{
    public class commonClass
    {
        public void GenerateThumbnails(Stream sourcePath, string targetPath, int lnWidth, int lnHeight)
        {
            using (var image = System.Drawing.Image.FromStream(sourcePath))
            {
                int lnNewWidth = 0;
                decimal lnRatio;
                int lnNewHeight = 0;
                if (image.Width > lnWidth || image.Height > lnHeight)
                {
                    if (image.Width > image.Height)
                    {
                        lnRatio = (decimal)lnWidth / image.Width;
                        lnNewWidth = lnWidth;
                        decimal lnTemp = image.Height * lnRatio;
                        lnNewHeight = (int)lnTemp;
                    }
                    else
                    {
                        lnRatio = (decimal)lnHeight / image.Height;
                        lnNewHeight = lnHeight;
                        decimal lnTemp = image.Width * lnRatio;
                        lnNewWidth = (int)lnTemp;
                    }
                }
                else
                {
                    lnNewHeight = image.Height;
                    lnNewWidth = image.Width;
                }
                var thumbnailImg = new Bitmap(lnNewWidth, lnNewHeight);
                var thumbGraph = Graphics.FromImage(thumbnailImg);
                thumbGraph.CompositingQuality = CompositingQuality.HighQuality;
                thumbGraph.SmoothingMode = SmoothingMode.HighQuality;
                thumbGraph.InterpolationMode = InterpolationMode.HighQualityBicubic;
                var imageRectangle = new Rectangle(0, 0, lnNewWidth, lnNewHeight);
                thumbGraph.DrawImage(image, imageRectangle);
                thumbnailImg.Save(HttpContext.Current.Server.MapPath(targetPath), image.RawFormat);
            }
        }

        public string ImageUpload(string data, string insertedId, string folderId)
        {
            string str = string.Empty;
            string strImage = string.Empty;

            try
            {

                if (data.Contains("data:image/jpeg;base64,"))
                    strImage = data.Replace("data:image/jpeg;base64,", "");
                if (data.Contains("data:image/png;base64,"))
                    strImage = data.Replace("data:image/png;base64,", "");
                if (data.Contains("data:image/jpg;base64,"))
                    strImage = data.Replace("data:image/jpg;base64,", "");


                String path1 = HttpContext.Current.Server.MapPath("~/Image");
                if (!Directory.Exists(path1))
                {
                    Directory.CreateDirectory(path1);
                }
                String path2 = HttpContext.Current.Server.MapPath("~/Image/" + folderId);
                if (!Directory.Exists(path2))
                {
                    Directory.CreateDirectory(path2);
                }

                using (MemoryStream ms = new MemoryStream(Convert.FromBase64String(strImage)))
                {
                    using (Bitmap bm2 = new Bitmap(ms))
                    {
                        GenerateThumbnails(ms, "~/Image/" + folderId + "/" + insertedId + ".jpg", 600, 600);
                    }
                }
                str = "success";
            }
            catch (Exception ex)
            {
                str = "fail";
            }

            return str;
        }

        public string DeleteImage(string insertedId, string folderId)
        {
            string str = string.Empty;

            try
            {
                var filePath = HttpContext.Current.Server.MapPath("~/Image/" + folderId + "/" + insertedId + ".jpg");
                if (File.Exists(filePath))
                    File.Delete(filePath);

                str = "success";
            }
            catch (Exception ex)
            {
                str = "fail";
            }

            return str;
        }
    }
}