using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace EMERALD.Models
{
    [Table("lc_height")]
    public class HeightModel
    {
        [Key]
        [Column("id")]
        public int id { get; set; }

        [Column("tier")]
        public int tier { get; set; }

        [Column("generation")]
        public int generation { get; set; }

        [Column("code_porod")]
        public int breed { get; set; }

        [Column("diameter")]
        public double diameter { get; set; }

        [Column("height")]
        public double height { get; set; }

        [Column("initial_height")]
        public double initial_height { get; set; }

        [Column("id_lc")]
        public string id_lc { get; set; }

    }
}
