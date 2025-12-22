using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

using WEB_SHOPTHETHAO_API.DTO.Request;
using WEB_SHOPTHETHAO_API.Models;
using WEB_SHOPTHETHAO_API.Service;

namespace WEB_SHOPTHETHAO_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IAuthenticationService _authService;

        public UserController(ApplicationDbContext context, IAuthenticationService authService)
        {
            _context = context;
            _authService = authService;
        }

        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<IActionResult> Login(LoginRequest request)
        {
            var response = await _authService.LoginAsync(request);
            if (!response.Success)
            {
                // Trả về lỗi cho Frontend kèm lời nhắn (Message)
                return BadRequest(new { message = response.Message });
            }
            Response.Cookies.Append("refreshToken", response.RefreshToken, new CookieOptions
            {
                HttpOnly = true,
                Secure = true,       
                SameSite = SameSiteMode.None,
                Expires = DateTime.UtcNow.AddDays(7)
            });

            return Ok(new
            {
                accessToken = response.AccessToken
            });
        }


        [HttpPost("register")]
        [AllowAnonymous]
        public async Task<IActionResult> Register(RegisterRequest request)
        {
                var response = await _authService.RegisterAsync(request);
                Response.Cookies.Append("refreshToken", response.RefreshToken, new CookieOptions
                {
                    HttpOnly = true,
                    Secure = true,
                    SameSite = SameSiteMode.None,
                    Expires = DateTime.UtcNow.AddDays(7)
                });

                return Ok(new
                {
                    accessToken = response.AccessToken
                });
        }

        [HttpPost("refresh-token")]
        [AllowAnonymous]
        public async Task<IActionResult> RefreshToken()
        {
            try
            {
                var refreshToken = Request.Cookies["refreshToken"];
                if (string.IsNullOrEmpty(refreshToken))
                    return Unauthorized("Missing refresh token");

                var response = await _authService.RefreshTokenAsync(refreshToken);
                return Ok(response);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
        [HttpPost("logout")]
        [AllowAnonymous] // cho phép client gọi dù token có hết hạn
        public IActionResult Logout()
        {
            // Xoá cookie refreshToken trên trình duyệt
            Response.Cookies.Delete("refreshToken", new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.None
            });

            // (Tuỳ) bạn cũng có thể xoá các cookie khác nếu có
            return Ok(new { message = "Đăng xuất thành công" });
        }

        [HttpPut("update-profile")]
        [Authorize]
        public async Task<IActionResult> UpdateProfile([FromBody] updateUserRequest request)
        {
            var userName = User.FindFirst(ClaimTypes.Name)?.Value;
            if (string.IsNullOrEmpty(userName))
                return Unauthorized(new { message = "Token không hợp lệ" });

            var user = await _context.Users.FirstOrDefaultAsync(u => u.UserName == userName);
            if (user == null)
                return NotFound(new { message = "Không tìm thấy user" });

            // Cập nhật thông tin
            user.FullName = request.FullName;
            user.Email = request.Email;
            user.PhoneNumber = request.Phone;
            user.Address = request.Address;

            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Cập nhật thông tin thành công",
                user.FullName,
                user.Email,
                user.PhoneNumber,
                user.Address
            });
        }

        [Authorize]
        [HttpPut("change-password")]
        public async Task<IActionResult> ChangePassword(ChangePasswordRequest request)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim))
                return Unauthorized("Token không hợp lệ");

            var userId = int.Parse(userIdClaim);

            var result = await _authService.ChangePasswordAsync(
                userId,
                request.OldPassword,
                request.NewPassword
            );

            if (!result)
                return BadRequest(new { message = "Mật khẩu cũ không đúng" });

            return Ok(new { message = "Đổi mật khẩu thành công, vui lòng đăng nhập lại" });
        }




        [HttpGet("profile")]
        [Authorize] // Yêu cầu phải đăng nhập
        public async Task<IActionResult> GetProfile()
        {
            //var username = User.Identity.Name; // lấy từ ClaimTypes.Name
            // Lấy username từ JWT token claims
            var userName = User.FindFirst(ClaimTypes.Name)?.Value;
            if (string.IsNullOrEmpty(userName))
            {
                return Unauthorized(new { message = "Token không hợp lệ" });
            }

            var user = await _context.Users
                .Include(u => u.UserRoles)
                .ThenInclude(ur => ur.Role)
                .FirstOrDefaultAsync(u => u.UserName == userName);

            if (user == null)
            {
                return NotFound(new { message = "Không tìm thấy user" });
            }

            var roles = user.UserRoles.Select(ur => ur.Role.RoleName).ToList();

            return Ok(new
            {
                UserId = user.UserId,
                UserName = user.UserName,
                Email = user.Email,
                FullName = user.FullName,
                phone = user.PhoneNumber,
                address = user.Address,
                Roles = roles,
                IsActive = user.IsActive,
                CreatedDate = user.CreatedDate
            });
        }

        /// <summary>
        /// Lấy danh sách users (Có hỗ trợ tìm kiếm) - Chỉ Admin
        /// </summary>
        [HttpGet("all")]
        //[Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAllUsers([FromQuery] string? keyword)
        {
            var query = _context.Users.AsQueryable();

            // Logic tìm kiếm theo Tên hoặc Email
            if (!string.IsNullOrEmpty(keyword))
            {
                query = query.Where(u => u.UserName.Contains(keyword) ||
                                         u.Email.Contains(keyword) ||
                                         u.FullName.Contains(keyword));
            }

            var users = await query
                .Include(u => u.UserRoles)
                .ThenInclude(ur => ur.Role)
                .Select(u => new
                {
                    u.UserId,
                    u.UserName,
                    u.Email,
                    u.FullName,
                    u.IsActive, // Quan trọng để hiển thị trạng thái Khóa/Mở
                    u.CreatedDate,
                    Roles = u.UserRoles.Select(ur => ur.Role.RoleName).ToList()
                })
                .OrderByDescending(u => u.CreatedDate) // Người mới nhất lên đầu
                .ToListAsync();

            return Ok(users);
        }

        /// <summary>
        /// Khóa/Mở khóa tài khoản - Chỉ Admin
        /// </summary>
        [HttpPatch("{id}/toggle-status")]
        //[Authorize(Roles = "Admin")]
        public async Task<IActionResult> ToggleUserStatus(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return NotFound(new { message = "Không tìm thấy user" });

            // Nếu đang Mở -> Thành Khóa, Nếu đang Khóa -> Thành Mở
            user.IsActive = !user.IsActive;

            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = user.IsActive ? "Đã mở khóa tài khoản." : "Đã khóa tài khoản.",
                isActive = user.IsActive
            });
        }

        /// <summary>
        /// Gán role cho user - Chỉ Admin mới được phép
        /// </summary>
        [HttpPost("assign-role")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> AssignRole([FromBody] AssignRoleRequest request)
        {
            try
            {
                var result = await _authService.AssignRoleToUserAsync(request.UserId, request.RoleName);
                if (result)
                {
                    return Ok(new { message = "Gán role thành công" });
                }
                return BadRequest(new { message = "Gán role thất bại" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }

    // DTO cho việc gán role
    public class AssignRoleRequest
    {
        public int UserId { get; set; }
        public string RoleName { get; set; }
    }
}
