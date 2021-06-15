using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace EMERALD.Models
{
    [Table("lc_geo")]
    public class GeosModel
    {
        [Key]
        [Column("id")]
        public int id { get; set; }

        [Column("azimuth")]
        public string? azimuth { get; set; }

        [Column("coordinate_x")]
        public string? coordinate_x { get; set; }

        [Column("coordinate_y")]
        public string? coordinate_y { get; set; }

        [Column("position_point")]
        public int? position_point { get; set; }

        [Column("direction_angle")]
        public string? direction_angle { get; set; }

        [Column("horizontal_distance")]
        public string? horizontal_distance { get; set; }

        [Column("rhumb")]
        public string? rhumb { get; set; }

        [Column("slant_distance")]
        public string? slant_distance { get; set; }

        [Column("vertical_angle")]
        public string? vertical_angle { get; set; }

        [Column("is_binding_line")]
        public bool? is_binding_line { get; set; }

        [Column("id_lc")]
        public string id_lc { get; set; }
    }
}
