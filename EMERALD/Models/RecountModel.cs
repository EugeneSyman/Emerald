using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace EMERALD.Models
{
    [Table("lc_recount")]
    public class RecountModel
    {
        [Key]
        [Column("id")]
        public int id { get; set; }

        [Column("step")]
        public int step { get; set; }

        [Column("code_porod")]
        public int nameporod_tier { get; set; }

        [Column("count_drov")]
        public int count_drov { get; set; }

        [Column("count_del")]
        public int count_del { get; set; }

        [Column("count_syx")]
        public int count_syx { get; set; }

        [Column("count_trees_not_felling")]
        public int count_trees_not_felling { get; set; }

        [Column("tier")]
        public int tier { get; set; }

        [Column("id_lc")]
        public string id_lc { get; set; }
    }
}
