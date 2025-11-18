using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using AutoMapper.Configuration.Annotations;
using Microsoft.EntityFrameworkCore;

namespace WEB_SHOPTHETHAO_API.Models;

[Table("User")]
public partial class User
{
    [Key]
    public int UserId { get; set; }

    [StringLength(100)]
    public string UserName { get; set; } = null!;

    [StringLength(255)]
    public string Password { get; set; } = null!;

    [StringLength(255)]
    public string? Email { get; set; }

    [StringLength(255)]
    public string? FullName { get; set; }

    public string? RefreshToken { get; set; }

    public bool IsActive { get; set; }

    public DateTime CreatedDate { get; set; }

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
