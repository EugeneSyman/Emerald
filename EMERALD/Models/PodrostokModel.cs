using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace EMERALD.Models
{
    [Table("lc_podrost")]
    public class PodrostokModel
    {
        [Key]
        [Column("id")]
        public int id { get; set; }

        [Column("age")]
        public int age { get; set; }

        [Column("bad_tree_count")]
        public int badTreeCount { get; set; }

        [Column("breed")]
        public int breed { get; set; }

        [Column("dry_tree_count")]
        public int dryTreeCount { get; set; }

        [Column("good_tree_count")]
        public int goodTreeCount { get; set; }

        [Column("height_category")]
        public int heightCategory { get; set; }

        [Column("id_lc")]
        public string id_lc { get; set; }
    }
}
