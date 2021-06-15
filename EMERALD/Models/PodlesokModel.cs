using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace EMERALD.Models
{
    [Table("lc_podlesok")]
    public class PodlesokModel
    {
        [Key]
        [Column("id")]
        public int id { get; set; }

        [Column("code_porod")]
        public int breed { get; set; }

        [Column("tree_count")]
        public int treeCount { get; set; }

        [Column("tree_middle_height")]
        public string treeMiddleHeight { get; set; }

        [Column("id_lc")]
        public string id_lc { get; set; }
    }
}
