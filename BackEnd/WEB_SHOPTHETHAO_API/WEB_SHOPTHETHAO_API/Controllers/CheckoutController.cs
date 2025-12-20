using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WEB_SHOPTHETHAO_API.Models;

namespace WEB_SHOPTHETHAO_API.Controllers
{
    [ApiController]
    [Route("api/voucher-users")]
    public class VoucherUsersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public VoucherUsersController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/voucher-users
        // (Admin xem tất cả bản ghi Voucher_User)
        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAll()
        {
            var data = await _context.VoucherUsers
                .AsNoTracking()
                .Include(x => x.User)
                .Include(x => x.Voucher)
                .OrderByDescending(x => x.Id)
                .Select(x => new
                {
                    x.Id,
                    x.UserId,
                    UserName = x.User.UserName,
                    x.VoucherId,
                    VoucherName = x.Voucher.Name,
                    x.ReceivedDate
                })
                .ToListAsync();

            return Ok(data);
        }

        // GET: api/voucher-users/5
        [HttpGet("{id:int}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetById(int id)
        {
            var data = await _context.VoucherUsers
                .AsNoTracking()
                .Include(x => x.User)
                .Include(x => x.Voucher)
                .Where(x => x.Id == id)
                .Select(x => new
                {
                    x.Id,
                    x.UserId,
                    UserName = x.User.UserName,
                    x.VoucherId,
                    VoucherName = x.Voucher.Name,
                    x.ReceivedDate
                })
                .FirstOrDefaultAsync();

            if (data == null) return NotFound("Voucher_User not found");
            return Ok(data);
        }

        // GET: api/voucher-users/by-user/1
        // (User/FE lấy danh sách voucher mà user đã nhận)
        [HttpGet("by-user/{userId:int}")]
        [AllowAnonymous] // tuỳ bạn, nếu muốn bắt đăng nhập thì đổi [Authorize]
        public async Task<IActionResult> GetByUser(int userId)
        {
            var data = await _context.VoucherUsers
                .AsNoTracking()
                .Where(x => x.UserId == userId)
                .Include(x => x.Voucher)
                .OrderByDescending(x => x.ReceivedDate)
                .Select(x => new
                {
                    x.Id,
                    x.UserId,
                    x.VoucherId,
                    VoucherName = x.Voucher.Name,
                    x.Voucher.DiscountPercent,
                    x.Voucher.Description,
                    x.Voucher.StartDate,
                    x.Voucher.EndDate,
                    x.Voucher.Type,
                    x.ReceivedDate
                })
                .ToListAsync();

            return Ok(data);
        }

        // POST: api/voucher-users/assign
        // Gán voucher cho user (tạo bản ghi Voucher_User)
        [HttpPost("assign")]
        [Authorize(Roles = "Admin")] // hoặc AllowAnonymous nếu bạn muốn ai cũng gán (không nên)
        public async Task<IActionResult> AssignVoucher([FromBody] AssignVoucherUserRequest request)
        {
            // check user tồn tại
            bool userExists = await _context.Users.AnyAsync(u => u.UserId == request.UserId);
            if (!userExists) return BadRequest("User not found");

            // check voucher tồn tại
            bool voucherExists = await _context.Vouchers.AnyAsync(v => v.Id == request.VoucherId);
            if (!voucherExists) return BadRequest("Voucher not found");

            // check đã gán chưa (tránh trùng)
            bool duplicated = await _context.VoucherUsers
                .AnyAsync(x => x.UserId == request.UserId && x.VoucherId == request.VoucherId);

            if (duplicated) return BadRequest("Voucher already assigned to this user");

            var vu = new VoucherUser
            {
                UserId = request.UserId,
                VoucherId = request.VoucherId,
                ReceivedDate = DateOnly.FromDateTime(DateTime.Now) // ✅ đúng kiểu DateOnly
            };

            _context.VoucherUsers.Add(vu);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Assigned", id = vu.Id });
        }

        // PUT: api/voucher-users/5
        // (Admin sửa lại ReceivedDate nếu muốn)
        [HttpPut("{id:int}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateVoucherUserRequest request)
        {
            var vu = await _context.VoucherUsers.FirstOrDefaultAsync(x => x.Id == id);
            if (vu == null) return NotFound("Voucher_User not found");

            // chỉ cho sửa ngày nhận (thường không cho sửa UserId/VoucherId để tránh loạn dữ liệu)
            if (request.ReceivedDate.HasValue)
                vu.ReceivedDate = request.ReceivedDate.Value;

            await _context.SaveChangesAsync();
            return Ok(new { message = "Updated" });
        }

        // DELETE: api/voucher-users/5
        [HttpDelete("{id:int}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(int id)
        {
            var vu = await _context.VoucherUsers.FirstOrDefaultAsync(x => x.Id == id);
            if (vu == null) return NotFound("Voucher_User not found");

            _context.VoucherUsers.Remove(vu);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Deleted" });
        }
    }

    public class AssignVoucherUserRequest
    {
        public int UserId { get; set; }
        public int VoucherId { get; set; }
    }

    public class UpdateVoucherUserRequest
    {
        public DateOnly? ReceivedDate { get; set; }
    }
}
