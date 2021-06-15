using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace EMERALD.Models
{
    [Table("lc_info")]
    public class InfoModel
    {
        [Key]
        [Column("id_lc")]
        public string id_lc { get; set; }

        [Column("code_lesxoz")]
        public int code_lesxoz { get; set; }

        [Column("code_plxo")]
        public int code_plxo { get; set; }

        [Column("code_lestichestva")]
        public int code_lestichestva { get; set; }

        [Column("number_vided")]
        public int number_vided { get; set; }

        [Column("number_kvartala")]
        public int number_kvartala { get; set; }

        [Column("number_region")]
        public int number_region { get; set; }
        
        [Column("number_lesoseka")]
        public int number_lesoseka { get; set; }
    }
}
