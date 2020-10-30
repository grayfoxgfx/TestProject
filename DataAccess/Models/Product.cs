using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;
using Microsoft.AspNetCore.Http;

namespace DataAccess.Models
{
    [Table("Product")]
    public class Product
    {
        [Required(ErrorMessage = "Id is required")]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Key]
        public int Id { get; set; }
        [Required]
        [StringLength(50)]
        public string Name { get; set; }
        [StringLength(100)]
        public string Description { get; set; }
        [Range(0, 100)]
        public int AgeRestriction { get; set; }
        [Required]
        [StringLength(50)]
        public string Company { get; set; }
        [Required]
        [Range(1, 1000)]
        public decimal Price { get; set; }

        [Required]
        public string ImageUrl { get; set; }

    }
}
