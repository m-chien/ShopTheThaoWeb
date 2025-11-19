using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using AutoMapper.Configuration.Annotations;
using Microsoft.EntityFrameworkCore;

namespace WEB_SHOPTHETHAO_API.Models;

[Table("ProductVariant")]
public partial class ProductVariant
{
    [Key]
    [Column("ID")]
    public int Id { get; set; }

    [Column("ProductID")]
    public int ProductId { get; set; }

    [Column("SizeID")]
    public int SizeId { get; set; }

    [Column("ColorID")]
    public int ColorId { get; set; }

    public int? StockQuantity { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal Price { get; set; }

    [StringLength(200)]
    public string? Image { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? NgayNhap { get; set; }

    [InverseProperty("ProductVariant")]
    [JsonIgnore]
    public virtual ICollection<CartDetail> CartDetails { get; set; } = new List<CartDetail>();

    [ForeignKey("ColorId")]
    [InverseProperty("ProductVariants")]
    public virtual Color Color { get; set; } = null!;

    [InverseProperty("ProductVariant")]
    [JsonIgnore]
    public virtual ICollection<OrderDetail> OrderDetails { get; set; } = new List<OrderDetail>();

    [ForeignKey("ProductId")]
    [InverseProperty("ProductVariants")]
    public virtual Product Product { get; set; } = null!;

    [ForeignKey("SizeId")]
    [InverseProperty("ProductVariants")]
    public virtual Size Size { get; set; } = null!;
}
