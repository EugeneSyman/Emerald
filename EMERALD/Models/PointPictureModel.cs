using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace EMERALD.Models
{
    [Table("lc_point_photos")]
    public class PointPictureModel
    {
        [Key]
        [Column("id")]
        public int id { get; set; }

        [Column("point_id")]
        public int point_id { get; set; }

        [Column("photo_path")]
        public string photo_path { get; set; }
    }
}
