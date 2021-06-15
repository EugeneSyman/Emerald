using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace EMERALD.Models
{
    public class PostgresContext : DbContext
    {
        public DbSet<HeightModel> Heights { get; set; }
        public DbSet<GeosModel> Geos { get; set; }
        public DbSet<InfoModel> Infos { get; set; }
        public DbSet<JnpModel> Jnps { get; set; }
        public DbSet<PodlesokModel> Podlesoks { get; set; }
        public DbSet<PodrostokModel> Podrostoks { get; set; }
        public DbSet<RecountModel> Recounts { get; set; }
        public DbSet<BundleModel> Bundles { get; set; }

        public DbSet<UriBundleModel> UriBundles { get; set; }
        public DbSet<UniversalBundleModel> UniversalBundles { get; set; }
        public DbSet<PointPictureModel> PointPictures { get; set; }

        public DbSet<DirectGroundCoverKind> DirectGroundCoverKinds { get; set; }
        public DbSet<DirectBreed> DirectBreeds { get; set; }
        public DbSet<DirectLeshoz> DirectLeshozs { get; set; }
        public DbSet<DirectPlho> DirectPlhos { get; set; }
        public DbSet<DirectForestry> DirectForestries { get; set; }
        public DbSet<DirectRegion> DirectRegions { get; set; }
        public DbSet<DirectSpecies> DirectSpecies { get; set; }
        public DbSet<DirectHeight> DirectHeights { get; set; }
        public DbSet<DirectHeightClass> DirectHeightClasses { get; set; }
        public static string connectingStringDB { get; set; }
        public static string connectingStringGeoserver { get; set; }

        class ConnectionConfigurations
        {
            public string ConnectingStringDB { get; set; }
            public string ConnectingStringGeoserver { get; set; }
        }

        public PostgresContext(IWebHostEnvironment webHostEnvironment)
        {
            string json = File.ReadAllText(webHostEnvironment.WebRootPath + '/' + "config.json");
            ConnectionConfigurations connection = JsonConvert.DeserializeObject<ConnectionConfigurations>(json);
            connectingStringDB = connection.ConnectingStringDB;
            connectingStringGeoserver = connection.ConnectingStringGeoserver;
            Database.EnsureCreated();
        }
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {          
            optionsBuilder.UseNpgsql(connectingStringDB);
        }
    }
}
