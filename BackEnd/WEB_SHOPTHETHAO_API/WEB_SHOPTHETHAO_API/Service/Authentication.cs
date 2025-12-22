
using Microsoft.EntityFrameworkCore;
using WEB_SHOPTHETHAO_API.DTO.Response;
using WEB_SHOPTHETHAO_API.DTO.Request;
using WEB_SHOPTHETHAO_API.Models;

namespace WEB_SHOPTHETHAO_API.Service
{
    public interface IAuthenticationService
    {
        Task<LoginResponse> LoginAsync(LoginRequest request);
        Task<LoginResponse> RegisterAsync(RegisterRequest request);
        Task<LoginResponse> RefreshTokenAsync(string refreshToken);
        Task<bool> AssignRoleToUserAsync(int userId, string roleName);

        Task<bool> ChangePasswordAsync(int userId, string oldPassword, string newPassword);
    }


    public class AuthenticationService : IAuthenticationService
    {
        private readonly ApplicationDbContext _context;
        private readonly ITokenService _tokenService;
        private readonly IPasswordService _passwordService;

        public AuthenticationService(ApplicationDbContext context, ITokenService tokenService, IPasswordService passwordService)
        {
            _context = context;
            _tokenService = tokenService;
            _passwordService = passwordService;
        }


        /// Đăng nhập - trả về token và refresh token

        public async Task<LoginResponse> LoginAsync(LoginRequest request)
        {
            // 1. Tìm user theo username
            var user = await _context.Users
                .Include(u => u.UserRoles)
                .ThenInclude(ur => ur.Role)
                .FirstOrDefaultAsync(u => u.UserName == request.UserName);

            // 2. Kiểm tra User có tồn tại không
            if (user == null)
            {
                return new LoginResponse { Success = false, Message = "Sai tài khoản hoặc mật khẩu" };
            }

            // 3. 👇 QUAN TRỌNG: Kiểm tra Active TRƯỚC khi check pass
            if (!user.IsActive)
            {
                return new LoginResponse
                {
                    Success = false,
                    Message = "Tài khoản của bạn đã bị khóa. Vui lòng liên hệ Admin."
                };
            }

            // 4. Kiểm tra mật khẩu
            if (!_passwordService.VerifyPassword(request.Password, user.Password))
            {
                return new LoginResponse { Success = false, Message = "Sai tài khoản hoặc mật khẩu" };
            }

            // --- Nếu qua hết các bước trên thì mới tạo Token ---
            var roles = user.UserRoles.Select(ur => ur.Role.RoleName).ToList();

            var accessToken = _tokenService.GenerateAccessToken(user, roles);
            var refreshToken = _tokenService.GenerateRefreshToken();

            user.RefreshToken = refreshToken;
            await _context.SaveChangesAsync();

            return new LoginResponse
            {
                Success = true,
                AccessToken = accessToken,
                RefreshToken = refreshToken
            };
        }
        public async Task<bool> ChangePasswordAsync(int userId, string oldPassword, string newPassword)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null) return false;

            // Kiểm tra mật khẩu cũ
            if (!_passwordService.VerifyPassword(oldPassword, user.Password))
                return false;

            // Hash mật khẩu mới
            user.Password = _passwordService.HashPassword(newPassword);

            // (Nâng cao) revoke refresh token
            user.RefreshToken = null;

            await _context.SaveChangesAsync();
            return true;
        }



        /// <summary>
        /// Đăng ký user mới - hash password
        /// </summary>
        public async Task<LoginResponse> RegisterAsync(RegisterRequest request)
        {
            // Kiểm tra username đã tồn tại chưa
            if (await _context.Users.AnyAsync(u => u.UserName == request.UserName))
            {
                throw new InvalidOperationException("Username đã tồn tại");
            }

            // Kiểm tra email đã tồn tại chưa
            if (await _context.Users.AnyAsync(u => u.Email == request.Email))
            {
                throw new InvalidOperationException("Email đã tồn tại");
            }

            // Hash password trước khi lưu
            var hashedPassword = _passwordService.HashPassword(request.Password);

            // Tạo user mới với password đã hash
            var newUser = new User
            {
                UserName = request.UserName,
                Password = hashedPassword, // Lưu password đã hash
                Email = request.Email,
                FullName = request.FullName,
                IsActive = true,
                CreatedDate = DateTime.UtcNow
            };

            _context.Users.Add(newUser);
            await _context.SaveChangesAsync();

            // Gán role mặc định "User" cho user mới
            await AssignRoleToUserAsync(newUser.UserId, "Customer");

            // Tự động login sau khi đăng ký (dùng password gốc chưa hash)
            var loginRequest = new LoginRequest
            {
                UserName = request.UserName,
                Password = request.Password // Password gốc để login
            };

            return await LoginAsync(loginRequest);
        }

        /// <summary>
        /// Refresh token - tạo access token mới từ refresh token
        /// </summary>
        public async Task<LoginResponse> RefreshTokenAsync(String request)
        {
            // Tìm user có refresh token này
            var user = await _context.Users
                .Include(u => u.UserRoles)
                .ThenInclude(ur => ur.Role)
                .FirstOrDefaultAsync(u => u.RefreshToken == request);

            if (user == null)
            {
                throw new UnauthorizedAccessException("Refresh token không hợp lệ");
            }

            // Lấy roles và tạo access token mới
            var roles = user.UserRoles.Select(ur => ur.Role.RoleName).ToList();
            var newAccessToken = _tokenService.GenerateAccessToken(user, roles);

            return new LoginResponse
            {
                AccessToken = newAccessToken,
                RefreshToken = request // Giữ nguyên refresh token
            };
        }

        /// <summary>
        /// Gán role cho user - chỉ Admin mới được
        /// </summary>
        public async Task<bool> AssignRoleToUserAsync(int userId, string roleName)
        {
            var user = await _context.Users.FindAsync(userId);
            var role = await _context.Roles.FirstOrDefaultAsync(r => r.RoleName == roleName);

            if (user == null || role == null)
            {
                return false;
            }

            // Kiểm tra user đã có role này chưa
            if (await _context.UserRoles.AnyAsync(ur => ur.UserId == userId && ur.RoleId == role.RoleId))
            {
                return false; // User đã có role này rồi
            }

            // Thêm role cho user
            var userRole = new UserRole
            {
                UserId = userId,
                RoleId = role.RoleId,
                AssignedDate = DateTime.UtcNow
            };

            _context.UserRoles.Add(userRole);
            await _context.SaveChangesAsync();

            return true;
        }
    }
}
