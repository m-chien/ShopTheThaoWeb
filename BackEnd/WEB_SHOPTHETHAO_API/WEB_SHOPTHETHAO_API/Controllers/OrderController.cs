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
        return Ok(await _context.Orders.ToListAsync());
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
        var item = await _context.Orders.FindAsync(id);
        if (item == null) return NotFound();

        _context.Orders.Remove(item);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    //[Authorize]
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

}
