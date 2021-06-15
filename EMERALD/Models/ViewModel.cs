using EMERALD.Controllers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EMERALD.Models
{
    public class ViewModel
    {
        /// Tables
        public IEnumerable<GeosModel> geos { get; set; }
        public IEnumerable<HeightModel> heights { get; set; }
        public IEnumerable<InfoModel> infos { get; set; }
        public IEnumerable<JnpModel> jnps { get; set; }
        public IEnumerable<PodlesokModel> podlesoks { get; set; }
        public IEnumerable<RecountModel> recounts { get; set; }
        public IEnumerable<PodrostokModel> podrostoks { get; set; }

        public IEnumerable<IGrouping<int,PodrostokModel>> podrostoksGroup { get; set; }
        public IEnumerable<IGrouping<int, HeightModel>> heightsGroups { get; set; }
        public IEnumerable<IGrouping<int, RecountModel>> recountsGroup { get; set; }


        /// Directory
        public IEnumerable<DirectGroundCoverKind> directGroundCoverKinds { get; set; }
        public string getGroundCoverKindsById(int id)
        {
            var value = directGroundCoverKinds.Where(p => p.id == id).ToList().FirstOrDefault().value;
            return value;
        }

        public IEnumerable<DirectBreed> directBreeds { get; set; }
        public string getBreedById(int id)
        {
            var value = directBreeds.Where(p => p.id == id).ToList().FirstOrDefault().value;
            return value;
        }

        public IEnumerable<DirectLeshoz> directLeshozs { get; set; }
        public string getLeshozById(int id)
        {
            var value = directLeshozs.Where(p => p.id == id).ToList().FirstOrDefault().value;
            return value;
        }

        public IEnumerable<DirectPlho> directPlhos { get; set; }
        public string getPlhoById(int id)
        {
            var value = directPlhos.Where(p => p.id == id).ToList().FirstOrDefault().value;
            return value;
        }

        public IEnumerable<DirectForestry> directForestries { get; set; }
        public string getForestryById(int leshozId,int id)
        {
            var value = directForestries.Where(p => p.id == id && p.leshozId == leshozId).ToList().FirstOrDefault().value;
            return value;
        }

        public IEnumerable<DirectRegion> directRegions { get; set; }
        public string getRegionById(int id)
        {
            var value = directRegions.Where(p => p.id == id).ToList().FirstOrDefault().value;
            return value;
        }



        public static IEnumerable<DirectHeight> directHeights { get; set; }
        public static IEnumerable<DirectHeightClass> directHeightClasses { get; set; }

        public string getAvgDiameter(IGrouping<int, HeightModel> group)
        {
            int divisor = 0;
            double sum = 0;
            foreach (var item in group)
            {
                sum += item.diameter;
                divisor++;
            }
            var value = Math.Round(sum / divisor, 1);
            return value.ToString();
        }

        public string getAvgHeight(IGrouping<int, HeightModel> group)
        {
            int divisor = 0;
            double sum = 0;
            foreach (var item in group)
            {
                sum += item.height;
                divisor++;
            }
            var value = Math.Round(sum / divisor, 1);
            return value.ToString();
        }

        public string getAvgInitialHeight(IGrouping<int, HeightModel> group)
        {
            int divisor = 0;
            double sum = 0;
            foreach (var item in group)
            {
                sum += item.initial_height;
                divisor++;
            }
            var value = Math.Round(sum / divisor, 1);

            return value.ToString();
        }

        public string getAvgAge(IGrouping<int, PodrostokModel> group)
        {
            int divisor = 0;
            double sum = 0;
            foreach (var item in group)
            {
                sum += item.age;
                divisor++;
            }
            var value = Math.Round(sum / divisor, 1);

            return value.ToString();
        }

        public string getSumBadTree(IGrouping<int, PodrostokModel> group)
        {
            double sum = 0;
            foreach (var item in group)
            {
                sum += item.badTreeCount;
            }
            var value = sum;

            return value.ToString();
        }
        public string getSumGoodTree(IGrouping<int, PodrostokModel> group)
        {
            double sum = 0;
            foreach (var item in group)
            {
                sum += item.goodTreeCount;
            }
            var value = sum;

            return value.ToString();
        }
        public string getSumDryTree(IGrouping<int, PodrostokModel> group)
        {
            double sum = 0;
            foreach (var item in group)
            {
                sum += item.dryTreeCount;
            }
            var value = sum;

            return value.ToString();
        }

        public static string getRankHeights(double avgDiameter,double avgHeight, int codeSpecies)
        {
            double remainder = Math.IEEERemainder(avgDiameter, 4);
            int dmr = 0;
            if (remainder >= 2)
            {
                dmr = (int)((4 - remainder) + avgDiameter);
            }
            else
            {
                dmr = (int) (avgDiameter - remainder);
            }

            if (avgHeight > 40.0)
            {
                return "Данных для этой высоты нет в справочнике";
            }
            else
            {
                var directHeight = directHeights.Where(p => p.codeAuthor == 21
                                                              && p.codeSpecies == codeSpecies
                                                              && p.drm == dmr
                                                              && p.minHeight <= avgHeight
                                                              && p.maxHeight >= avgHeight).FirstOrDefault();

                if (directHeight != null)
                {
                    var codeHeightsRank = directHeight.codeHeight;
                    var value = directHeightClasses.Where(p => p.id == codeHeightsRank).FirstOrDefault().value;
                    return value;
                }
                else
                {
                    return "Данная древесная порода не поддерживается";
                }
            }
        }

        public string getSumDrov(IGrouping<int, RecountModel> group)
        {
            double sum = 0;
            foreach (var item in group)
            {
                sum += item.count_drov;
            }
            var value = sum;

            return value.ToString();
        }

        public string getSumDel(IGrouping<int, RecountModel> group)
        {
            double sum = 0;
            foreach (var item in group)
            {
                sum += item.count_del;
            }
            var value = sum;

            return value.ToString();
        }

        public string getSumSyx(IGrouping<int, RecountModel> group)
        {
            double sum = 0;
            foreach (var item in group)
            {
                sum += item.count_syx;
            }
            var value = sum;

            return value.ToString();
        }

        public string getSumTrees(IGrouping<int, RecountModel> group)
        {
            double sum = 0;
            foreach (var item in group)
            {
                sum += item.count_trees_not_felling;
            }
            var value = sum;

            return value.ToString();
        }

        
        public string getSumTreesCount(IEnumerable<PodlesokModel> group)
        {
            double sum = 0;
            foreach (var item in group)
            {
                sum += item.treeCount;
            }
            var value = sum;

            return value.ToString();
        }

        public string getAvgHeight(IEnumerable<PodlesokModel> group)
        {
            int divisor = 0;
            double sum = 0;
            foreach (var item in group)
            {
                sum += double.Parse(item.treeMiddleHeight);
                divisor++;
            }
            var value = Math.Round(sum / divisor, 1);

            return value.ToString();
        }
    }
}
