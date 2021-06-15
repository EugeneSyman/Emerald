using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace EMERALD.Models
{
    [Table("lc_jnp")]
    public class JnpModel
    {
        [Key]
        [Column("id")]
        public int id { get; set; }

        [Column("groundcover_kind_1")]
        public int? groundcover_kind_1 { get; set; }

        [Column("groundcover_kind_2")]
        public int? groundcover_kind_2 { get; set; }

        [Column("groundcover_kind_3")]
        public int? groundcover_kind_3 { get; set; }

        [Column("id_lc")]
        public string id_lc { get; set; }

    }
}
