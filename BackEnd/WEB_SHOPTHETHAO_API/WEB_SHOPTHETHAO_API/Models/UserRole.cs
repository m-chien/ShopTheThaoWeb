using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace WEB_SHOPTHETHAO_API.Models;

[PrimaryKey("UserId", "RoleId")]
[Table("UserRole")]
public partial class UserRole
{
    [Key]
    public int UserId { get; set; }

    [Key]
    public int RoleId { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? AssignedDate { get; set; }

    [ForeignKey("RoleId")]
    [InverseProperty("UserRoles")]
    public virtual Role Role { get; set; } = null!;

    [ForeignKey("UserId")]
    [InverseProperty("UserRoles")]
    public virtual User User { get; set; } = null!;
}
