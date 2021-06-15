using EMERALD.Models;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EMERALD.Controllers
{
    public class AreaController : Controller
    {
        PostgresContext _context;

        public AreaController(IWebHostEnvironment appEnvironment)
        {
            _context = new PostgresContext(appEnvironment);
        }

        public IActionResult Index()
        {
            return View();
        }

        [HttpGet]
        public async Task<IActionResult> Index(long id)
        {
            ViewBag.ID = id;

            var test = _context.Heights.Where(p => p.id_lc.Equals(id.ToString())).AsEnumerable().GroupBy(p => p.breed);
            var test2 = _context.Geos.Where(p => p.id_lc.Equals(id.ToString())).ToList();


            var model = new ViewModel
            {
                geos = _context.Geos.Where(p => p.id_lc.Equals(id.ToString())).ToList(),
                heights = _context.Heights.Where(p => p.id_lc.Equals(id.ToString())).ToList(),
                infos = _context.Infos.Where(p => p.id_lc.Equals(id.ToString())).ToList(),
                jnps = _context.Jnps.Where(p => p.id_lc.Equals(id.ToString())).ToList(),
                podlesoks = _context.Podlesoks.Where(p => p.id_lc.Equals(id.ToString())).ToList(),
                podrostoks = _context.Podrostoks.Where(p => p.id_lc.Equals(id.ToString())).ToList(),
                recounts = _context.Recounts.Where(p => p.id_lc.Equals(id.ToString())).ToList(),

                podrostoksGroup = _context.Podrostoks.OrderBy(p => p.heightCategory).Where(p => p.id_lc.Equals(id.ToString())).AsEnumerable().GroupBy(p => p.breed),
                heightsGroups = _context.Heights.OrderBy(p => p.tier).Where(p => p.id_lc.Equals(id.ToString())).AsEnumerable().GroupBy(p => p.breed),
                recountsGroup = _context.Recounts.OrderBy(p => p.step).OrderBy(p => p.tier).Where(p => p.id_lc.Equals(id.ToString())).AsEnumerable().GroupBy(p => p.nameporod_tier),

                directGroundCoverKinds = _context.DirectGroundCoverKinds.ToList(),
                directBreeds = _context.DirectBreeds.ToList(),
                directLeshozs = _context.DirectLeshozs.ToList(),
                directForestries = _context.DirectForestries.ToList(),
                directPlhos = _context.DirectPlhos.ToList(),
                directRegions = _context.DirectRegions.ToList(),
                
            };

            ViewModel.directHeights = _context.DirectHeights.ToList();
            ViewModel.directHeightClasses = _context.DirectHeightClasses.ToList();

            return View(model);
        }
    }

    public class ComperClass
    {
        public string Breed { get; }
        public int Tier { get; }

        public ComperClass(string breed, int tier)
        {
            Breed = breed;
            Tier = tier;
        }

        public override bool Equals(object obj)
        {
            return obj is ComperClass other &&
                   Breed == other.Breed &&
                   Tier == other.Tier;
        }

        public override int GetHashCode()
        {
            return HashCode.Combine(Breed, Tier);
        }
    }
}
