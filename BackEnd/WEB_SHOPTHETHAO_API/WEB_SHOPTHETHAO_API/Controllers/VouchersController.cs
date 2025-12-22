using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WEB_SHOPTHETHAO_API.Models;

[Route("api/[controller]")]
[ApiController]
public class VouchersController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public VouchersController(ApplicationDbContext context)
    {
        _context = context;
    }

    // GET: api/voucher
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        return Ok(await _context.Vouchers.ToListAsync());
    }

    // GET: api/voucher/5
    [HttpGet("{id}")]
    public async Task<IActionResult> Get(int id)
    {
        var data = await _context.Vouchers.FindAsync(id);
        if (data == null) return NotFound();
        return Ok(data);
    }

    // POST: api/voucher
    [HttpPost]
    public async Task<IActionResult> Create(Voucher model)
    {
        _context.Vouchers.Add(model);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(Get), new { id = model.Id }, model);
    }

    // PUT: api/voucher/5
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, Voucher model)
    {
        if (id != model.Id) return BadRequest();

        _context.Entry(model).State = EntityState.Modified;
        await _context.SaveChangesAsync();

        return NoContent();
    }

    // DELETE: api/voucher/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        // --- BẮT LỖI (TRY-CATCH) ---
        try
        {
            var item = await _context.Vouchers.FindAsync(id);
            if (item == null) return NotFound(new { message = "Không tìm thấy voucher!" });

            var relatedUsers = _context.VoucherUsers.Where(v => v.VoucherId == id).ToList();
            if (relatedUsers.Any())
            {
                _context.VoucherUsers.RemoveRange(relatedUsers);
            }

            // Nếu có đơn hàng đã dùng rồi 
            var relatedOrders = _context.Orders.Where(o => o.VoucherId == id).ToList();
            if (relatedOrders.Any())
            {
                return BadRequest(new { message = "Không thể xóa! Voucher này đã có người dùng trong đơn hàng." });
            }

            // --- BƯỚC 2: Xóa Voucher chính ---
            _context.Vouchers.Remove(item);
            await _context.SaveChangesAsync();

            return NoContent();
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Lỗi hệ thống: " + ex.Message });
        }
    }
}
