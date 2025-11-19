using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using AutoMapper.Configuration.Annotations;
using Microsoft.EntityFrameworkCore;

namespace WEB_SHOPTHETHAO_API.Models;

[Table("Role")]
[Index("RoleName", Name = "UQ__Role__8A2B6160EF548C78", IsUnique = true)]
public partial class Role
{
    [Key]
    public int RoleId { get; set; }

    [StringLength(50)]
    public string RoleName { get; set; } = null!;

    [StringLength(200)]
    public string? Description { get; set; }

    [InverseProperty("Role")]
    [JsonIgnore]
    public virtual ICollection<UserRole> UserRoles { get; set; } = new List<UserRole>();
}
