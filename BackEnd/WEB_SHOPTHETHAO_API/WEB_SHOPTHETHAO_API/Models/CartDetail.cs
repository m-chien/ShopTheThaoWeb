using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace WEB_SHOPTHETHAO_API.Models;

[PrimaryKey("CartId", "ProductVariantId")]
[Table("CartDetail")]
public partial class CartDetail
{
    [Key]
    [Column("CartID")]
    public int CartId { get; set; }

    [Key]
    [Column("ProductVariantID")]
    public int ProductVariantId { get; set; }

    public int Quantity { get; set; }

    [ForeignKey("CartId")]
    [InverseProperty("CartDetails")]
    public virtual Cart Cart { get; set; } = null!;

    [ForeignKey("ProductVariantId")]
    [InverseProperty("CartDetails")]
    public virtual ProductVariant ProductVariant { get; set; } = null!;
}
