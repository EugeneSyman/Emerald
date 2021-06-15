using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace EMERALD.Models
{
    public class DirectoryModel
    {
    }

    [Table("lc_dict_height_class")]
    public class DirectHeightClass
    {
        [Key]
        [Column("CODE_TRF_HEIGHT")]
        public double id { get; set; }

        [Column("NAME_TRF_HEIGHT")]
        public string value { get; set; }
    }


    [Table("lc_dict_height")]
    public class DirectHeight
    {
        [Key]
        [Column("ID")]
        public int id { get; set; }

        [Column("CODE_AUTHOR")]
        public int codeAuthor { get; set; }

        [Column("CODE_SPECIES")]
        public int? codeSpecies { get; set; }   
        
        [Column("DMR")]
        public int drm { get; set; }
        
        [Column("MAX_HEIGHT")]
        public double maxHeight { get; set; }

        [Column("MIN_HEIGHT")]
        public double minHeight { get; set; }
        
        [Column("CODE_TRF_HEIGHT")]
        public int codeHeight { get; set; }
    }

    [Table("lc_dict_species")]
    public class DirectSpecies
    {
        [Key]
        [Column("CODE_SPECIES")]
        public int codeSpecies { get; set; }

        [Column("NAME_SPECIES")]
        public string nameSpecies { get; set; }

        [Column("NAME_SPECIES_SHORT")]
        public string shortName { get; set; } 

        [Column("NEW_CODE")]
        public int? newCode { get; set; }
    }

    [Table("ref_10200050")]
    public class DirectGroundCoverKind
    {
        [Key]
        [Column("RefValue_ID")]
        public double id { get; set; }

        [Column("RefValue_txt")]
        public string value { get; set; }
    }

    [Table("ref_10200003")]
    public class DirectBreed
    {
        [Key]
        [Column("RefValue_ID")]
        public int id { get; set; }

        [Column("RefValue_txt")]
        public string value { get; set; }
    }


    [Table("Admin_Leshos")]
    public class DirectLeshoz
    {
        [Column("RespublicaKod")]
        public double? RespublicaKod { get; set; }

        [Column("PlhoKod")]
        public int? PlhoKod { get; set; }

        [Key]
        [Column("LeshosKod")]
        public int id { get; set; }
        
        [Column("LeshosRP")]
        public string value { get; set; }
    }

    [Table("Admin_Plho")]
    public class DirectPlho
    {
        [Key]
        [Column("PlhoKod")]
        public int id { get; set; }

        [Column("Plho")]
        public string value { get; set; }

        [Column("Kod_Obl")]
        public int codeRegion { get; set; }
    }

    [Table("Admin_Lesnich")]
    public class DirectForestry
    {
        [Column("LeshosKod")]
        public int leshozId { get; set; }
        
        [Column("LesnichKod")]
        public double id { get; set; }

        [Column("LesnichName")]
        public string value { get; set; }
    }

    [Table("Admin_Obl")]
    public class DirectRegion
    {
        [Key]
        [Column("Kod_Obl")]
        public int id { get; set; }

        [Column("Name_Obl")]
        public string value { get; set; }
    }

}
