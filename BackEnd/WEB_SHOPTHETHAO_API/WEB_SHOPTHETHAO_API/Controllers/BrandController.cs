using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WEB_SHOPTHETHAO_API.Models;

[Route("api/[controller]")]
[ApiController]
public class BrandController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public BrandController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll() =>
        Ok(await _context.Brands.ToListAsync());

    [HttpPost]
    public async Task<IActionResult> Create(Brand model)
    {
        _context.Brands.Add(model);
        await _context.SaveChangesAsync();
        return Ok(model);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        // 1. Tìm hãng cần xóa
        var brand = await _context.Brands.FindAsync(id);
        if (brand == null) return NotFound(new { message = "Không tìm thấy thương hiệu này." });

        // 2. Kiểm tra ràng buộc: Nếu hãng đang có sản phẩm thì không cho xóa
        if (await _context.Products.AnyAsync(p => p.BrandId == id))
        {
            return BadRequest(new { message = "Không thể xóa hãng này vì đang có sản phẩm." });
        }

        try
        {
            // 3. Xóa
            _context.Brands.Remove(brand);
            await _context.SaveChangesAsync();
            return NoContent();
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Lỗi server: " + ex.Message });
        }
    }
}
