using EMERALD.Models;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace EMERALD.Controllers
{
    public class MapsController : Controller
    {
        IWebHostEnvironment _appEnvironment;
        PostgresContext _context;

        public MapsController(IWebHostEnvironment appEnvironment)
        {
            _appEnvironment = appEnvironment;
            _context = new PostgresContext(appEnvironment);
        }

        public IActionResult Index()
        {
            ViewData["ConnectionGeoserver"] = PostgresContext.connectingStringGeoserver;
            return View();
        }


        [HttpGet]
        public JsonResult GetPointPictures(int _point_id)
        {
            var pictures = _context.PointPictures.Where(p => p.point_id == _point_id);
            return Json(pictures);
        }

        [HttpPost]
        public async Task<IActionResult> UploadFiles(List<IFormFile> files,[FromForm] int _point_id)
        {
            foreach (var file in files)
            {
                if (file == null || file.Length == 0)
                    return Content("file not selected");

                string path = "images/points/" + file.FileName;

                using (var fileStream = new FileStream(_appEnvironment.WebRootPath + "/" + path, FileMode.Create))
                {
                    await file.CopyToAsync(fileStream);
                }
                PointPictureModel point = new PointPictureModel { point_id = _point_id, photo_path = path };
                _context.PointPictures.Add(point);
                _context.SaveChanges();

            }
            return RedirectToAction("Index");
        }


        [HttpGet]
        public async Task<IActionResult> GetUriBundle(int id)
        {
            BundleModel trialPlot = _context.Bundles.Where(p => p.id == id).ToList().FirstOrDefault();
            UriBundleModel uriTrialPlot;

            var URL = "";

            if (trialPlot != null)
            {                
                uriTrialPlot = _context.UriBundles.ToList().FirstOrDefault();
                if (uriTrialPlot != null)
                {
                    URL = uriTrialPlot.uri + "/plot/" + trialPlot.id_leshoz + "/" + trialPlot.number;
                    return Content(URL);
                }
            }

            return Content("null");

        }

        [HttpGet]
        public JsonResult GetUniversalBundle()
        {

            var universalBundleModel = _context.UniversalBundles.ToList();

            if (universalBundleModel != null)
            {
                return Json(universalBundleModel);
            }

            return Json(null);
        }
    }
}