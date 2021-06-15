using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace EMERALD.Models
{
    [Table("st_trial_plot")]
    public class BundleModel
    {
        [Key]
        [Column("id")]
        public int id { get; set; }

        [Column("number")]
        public int number { get; set; }

        [Column("id_leshoz")]
        public int id_leshoz { get; set; }
    }

    [Table("lc_uri_bundle_st")]
    public class UriBundleModel
    {
        [Key]
        public int id { get; set; }

        public string uri { get; set; }
    }  
    
    [Table("lc_uri_bundle")]
    public class UniversalBundleModel
    {
        [Key]
        public int id { get; set; }

        public string url { get; set; }

        public string field { get; set; }
    }
}
