using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore;

namespace WEB_SHOPTHETHAO_API.Models;

[Table("User")]
[Index("Email", Name = "UQ__User__A9D10534B5DE110A", IsUnique = true)]
public partial class User
{
    [Key]
    [Column("ID")]
    public int Id { get; set; }

    [StringLength(100)]
    public string Name { get; set; } = null!;

    [StringLength(100)]
    public string Email { get; set; } = null!;

    [Column("SDT")]
    [StringLength(20)]
    public string? Sdt { get; set; }

    [StringLength(200)]
    public string? DiaChi { get; set; }

    [Column("AvatarURL")]
    [StringLength(200)]
    public string? AvatarUrl { get; set; }

    [Column("DOB")]
    public DateOnly? Dob { get; set; }

    [InverseProperty("User")]
    [JsonIgnore]
    public virtual ICollection<Cart> Carts { get; set; } = new List<Cart>();

    [InverseProperty("User")]
    [JsonIgnore]
    public virtual ICollection<Order> Orders { get; set; } = new List<Order>();

    [InverseProperty("User")]
    [JsonIgnore]
    public virtual ICollection<UserRole> UserRoles { get; set; } = new List<UserRole>();

    [InverseProperty("User")]
    [JsonIgnore]
    public virtual ICollection<VoucherUser> VoucherUsers { get; set; } = new List<VoucherUser>();
}
