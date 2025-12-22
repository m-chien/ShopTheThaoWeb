using System.Data;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using WEB_SHOPTHETHAO_API.Models;


[Route("api/[controller]")]
[ApiController]
public class OrderController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public OrderController(ApplicationDbContext context)
    {
        _context = context;
    }
    // GET: api/order
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var orders = await _context.Orders
            .Include(o => o.User) // <--- QUAN TRỌNG: JOIN VỚI BẢNG USER
            .Select(o => new
            {
                o.Id,
                o.UserId,
                // Lấy tên khách hàng, nếu null thì hiện "Khách vãng lai"
                CustomerName = o.User != null ? o.User.FullName : "Khách vãng lai",
                o.OrderDate,
                o.Status,
                o.TotalAmount,
                o.DeliveryAddress,
                o.Phone
            })
            .OrderByDescending(o => o.OrderDate) // Sắp xếp mới nhất lên đầu
            .ToListAsync();

        return Ok(orders);
    }

    // GET: api/order/5
    [HttpGet("{id}")]
    public async Task<IActionResult> Get(int id)
    {
        var data = await _context.Orders.FindAsync(id);
        if (data == null) return NotFound();
        return Ok(data);
    }

    // POST: api/order
    [HttpPost]
    public async Task<IActionResult> Create(Order model)
    {
        _context.Orders.Add(model);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(Get), new { id = model.Id }, model);
    }

    // PUT: api/order/5
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, Order model)
    {
        if (id != model.Id) return BadRequest();

        _context.Entry(model).State = EntityState.Modified;
        await _context.SaveChangesAsync();

        return NoContent();
    }

    // DELETE: api/order/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        try
        {
            // Tìm đối tượng cần xóa
            var item = await _context.Orders.FindAsync(id);
            if (item == null) return NotFound();

            _context.Orders.Remove(item);
            await _context.SaveChangesAsync();

            return NoContent();
        }
        catch (DbUpdateException)
        {
            // Trả về lỗi 400 kèm thông báo để Frontend hiện lên
            return BadRequest(new
            {
                message = "Không thể xóa! Dữ liệu này đang được sử dụng ở nơi khác (Đơn hàng chi tiết hoặc Lịch sử dùng voucher)."
            });
        }
        catch (Exception ex) // Bắt các lỗi khác
        {
            return StatusCode(500, new { message = "Lỗi hệ thống: " + ex.Message });
        }
    }

    [Authorize]
    [HttpGet("my-orders")]
    public async Task<IActionResult> GetMyOrders()
    {
        // 🔐 LẤY USERID TỪ TOKEN
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        if (userIdClaim == null)
            return Unauthorized("Token không chứa UserId");

        int userId = int.Parse(userIdClaim.Value);

        var orders = new List<Order>();
        var orderDetails = new List<OrderDetail>();
        var products = new List<Dictionary<string, object?>>();
        var payments = new List<Payment>();

        var conn = _context.Database.GetDbConnection();
        if (conn.State != ConnectionState.Open)
            await conn.OpenAsync();

        await using var cmd = conn.CreateCommand();
        cmd.CommandText = "dbo.sp_GetOrdersByUserId";
        cmd.CommandType = CommandType.StoredProcedure;
        cmd.Parameters.Add(new SqlParameter("@UserId", SqlDbType.Int) { Value = userId });

        await using var reader = await cmd.ExecuteReaderAsync();

        /* ===== RS1: Orders ===== */
        while (await reader.ReadAsync())
        {
            orders.Add(new Order
            {
                Id = Convert.ToInt32(reader["OrderID"]),
                UserId = Convert.ToInt32(reader["UserID"]),
                Status = reader["Status"]?.ToString(),
                TotalAmount = reader["TotalAmount"] == DBNull.Value ? 0 : Convert.ToDecimal(reader["TotalAmount"]),
                DeliveryAddress = reader["DeliveryAddress"]?.ToString(),
                Phone = reader["Phone"]?.ToString(),
                OrderDate = Convert.ToDateTime(reader["OrderDate"]),
                VoucherId = reader["VoucherID"] == DBNull.Value ? null : (int?)Convert.ToInt32(reader["VoucherID"])
            });
        }

        /* ===== RS2: OrderDetails ===== */
        if (await reader.NextResultAsync())
        {
            while (await reader.ReadAsync())
            {
                orderDetails.Add(new OrderDetail
                {
                    Id = Convert.ToInt32(reader["OrderDetailID"]),
                    OrderId = Convert.ToInt32(reader["OrderID"]),
                    ProductVariantId = Convert.ToInt32(reader["ProductVariantID"]),
                    Quantity = Convert.ToInt32(reader["Quantity"]),
                    UnitPrice = Convert.ToDecimal(reader["UnitPrice"])
                });
            }
        }

        /* ===== RS3: Products ===== */
        if (await reader.NextResultAsync())
        {
            while (await reader.ReadAsync())
            {
                var row = new Dictionary<string, object?>();
                for (int i = 0; i < reader.FieldCount; i++)
                    row[reader.GetName(i)] = reader.IsDBNull(i) ? null : reader.GetValue(i);

                products.Add(row);
            }
        }

        /* ===== RS4: Payments ===== */
        if (await reader.NextResultAsync())
        {
            while (await reader.ReadAsync())
            {
                payments.Add(new Payment
                {
                    Id = Convert.ToInt32(reader["ID"]),
                    OrderId = Convert.ToInt32(reader["OrderID"]),
                    Method = reader["Method"]?.ToString(),
                    Amount = Convert.ToDecimal(reader["Amount"]),
                    Status = reader["Status"]?.ToString(),
                    PaymentDate = Convert.ToDateTime(reader["PaymentDate"])
                });
            }
        }

        return Ok(new
        {
            userId,
            orders,
            orderDetails,
            products,
            payments
        });
    }

    // GET: api/Order/5/details
    [HttpGet("{id}/details")]
    public async Task<IActionResult> GetOrderDetails(int id)
    {
        try
        {
            var details = await _context.OrderDetails
                .Where(od => od.OrderId == id)
                .Include(od => od.ProductVariant)
                    .ThenInclude(pv => pv.Product)
                .Include(od => od.ProductVariant.Size)
                .Include(od => od.ProductVariant.Color)
                .Select(od => new
                {
                    Id = od.Id,
                    ProductId = od.ProductVariant.Product.Id,

                    // --- SỬA 1: Kiểm tra null khi nối chuỗi tên sản phẩm ---
                    Product = (od.ProductVariant.Product != null && od.ProductVariant.Color != null && od.ProductVariant.Size != null)
                              ? $"{od.ProductVariant.Product.Name} - {od.ProductVariant.Color.Name} ({od.ProductVariant.Size.Name})"
                              : "Sản phẩm không xác định (Lỗi dữ liệu)",

                    Quantity = od.Quantity,

                    // --- SỬA 2: Xử lý giá tiền bị null (Thêm ?? 0) ---
                    Price = od.UnitPrice ?? 0,

                    Image = od.ProductVariant.Image,

                    // --- SỬA 3: Tính tổng tiền an toàn ---
                    Total = od.Quantity * (od.UnitPrice ?? 0)
                })
                .ToListAsync();

            return Ok(details);
        }
        catch (Exception ex)
        {
            // Nếu lỗi, trả về 500 để Frontend biết đường báo lỗi
            return StatusCode(500, new { message = "Lỗi Server: " + ex.Message });
        }
    }

}