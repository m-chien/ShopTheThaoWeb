using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace WEB_SHOPTHETHAO_API.Models;

[Table("Voucher_User")]
public partial class VoucherUser
{
    [Key]
    [Column("ID")]
    public int Id { get; set; }

    [Column("UserID")]
    public int UserId { get; set; }

    [Column("VoucherID")]
    public int VoucherId { get; set; }

    public DateOnly? ReceivedDate { get; set; }

    [ForeignKey("UserId")]
    [InverseProperty("VoucherUsers")]
    public virtual User User { get; set; } = null!;

    [ForeignKey("VoucherId")]
    [InverseProperty("VoucherUsers")]
    public virtual Voucher Voucher { get; set; } = null!;
}
