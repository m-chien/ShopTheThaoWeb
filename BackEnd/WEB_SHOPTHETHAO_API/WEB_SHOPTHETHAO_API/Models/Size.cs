using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore;

namespace WEB_SHOPTHETHAO_API.Models;

[Table("Size")]
public partial class Size
{
    [Key]
    [Column("ID")]
    public int Id { get; set; }

    [StringLength(50)]
    public string Name { get; set; } = null!;

    [Column(TypeName = "decimal(10, 2)")]
    public decimal? Length { get; set; }

    [Column(TypeName = "decimal(10, 2)")]
    public decimal? Width { get; set; }

    [Column(TypeName = "decimal(10, 2)")]
    public decimal? Weight { get; set; }

    [Column(TypeName = "decimal(10, 2)")]
    public decimal? Height { get; set; }

    [InverseProperty("Size")]
    [JsonIgnore]
    public virtual ICollection<ProductVariant> ProductVariants { get; set; } = new List<ProductVariant>();
}
