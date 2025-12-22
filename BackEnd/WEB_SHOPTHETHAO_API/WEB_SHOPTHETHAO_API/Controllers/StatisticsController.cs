using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WEB_SHOPTHETHAO_API.Models;

namespace WEB_SHOPTHETHAO_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StatisticsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public StatisticsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // 1. Thống kê tổng quan
        [HttpGet("dashboard-summary")]
        public async Task<IActionResult> GetDashboardSummary()
        {
            // SỬA: Bỏ điều kiện Where status để tính hết (Test dữ liệu trước)
            var revenue = await _context.Orders
                // .Where(o => o.Status.Contains("Hoàn thành") || o.Status.Contains("Paid")) <--- BỎ DÒNG NÀY ĐỂ TEST
                .SumAsync(o => o.TotalAmount ?? 0);

            var totalOrders = await _context.Orders.CountAsync();
            var totalCustomers = await _context.Users.CountAsync();
            var totalProducts = await _context.Products.CountAsync();

            return Ok(new
            {
                revenue,
                totalOrders,
                totalCustomers,
                totalProducts
            });
        }

        // 2. Biểu đồ doanh thu 7 ngày gần nhất
        [HttpGet("revenue-chart")]
        public async Task<IActionResult> GetRevenueChart()
        {
            var sevenDaysAgo = DateTime.Now.AddDays(-7);

            var data = await _context.Orders
                .Where(o => o.OrderDate >= sevenDaysAgo) // SỬA: Chỉ lấy theo ngày, bỏ check trạng thái tạm thời
                .GroupBy(o => o.OrderDate.Value.Date)
                .Select(g => new
                {
                    Date = g.Key,
                    Revenue = g.Sum(o => o.TotalAmount ?? 0)
                })
                .OrderBy(x => x.Date)
                .ToListAsync();

            return Ok(data);
        }

        // 3. Top 5 sản phẩm (Giữ nguyên)
        [HttpGet("top-products")]
        public async Task<IActionResult> GetTopSellingProducts()
        {
            var topProducts = await _context.OrderDetails
                .Include(od => od.ProductVariant)
                .ThenInclude(pv => pv.Product)
                .GroupBy(od => od.ProductVariant.Product.Name)
                .Select(g => new
                {
                    ProductName = g.Key,
                    TotalSold = g.Sum(od => od.Quantity)
                })
                .OrderByDescending(x => x.TotalSold)
                .Take(5)
                .ToListAsync();

            return Ok(topProducts);
        }
    }
}