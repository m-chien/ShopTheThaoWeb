using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WEB_SHOPTHETHAO_API.Models;

[Route("api/[controller]")]
[ApiController]
public class CategoryController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public CategoryController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        return Ok(await _context.Categories.ToListAsync());
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> Get(int id)
    {
        var data = await _context.Categories.FindAsync(id);
        if (data == null) return NotFound();
        return Ok(data);
    }

    [HttpPost]
    public async Task<IActionResult> Create(Category model)
    {
        _context.Categories.Add(model);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(Get), new { id = model.Id }, model);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, Category model)
    {
        // 1. Kiểm tra ID cơ bản
        if (id != model.Id)
        {
            return BadRequest(new { message = "ID trong URL và trong Body không khớp." });
        }

        // 2. Tìm bản ghi cũ trong Database
        var existingCategory = await _context.Categories.FindAsync(id);

        if (existingCategory == null)
        {
            return NotFound(new { message = "Không tìm thấy danh mục cần sửa." });
        }

        // 3. Cập nhật thủ công từng trường
        existingCategory.Name = model.Name;
        existingCategory.Description = model.Description;

        // Nếu có gửi ảnh mới thì cập nhật, không thì giữ ảnh cũ
        if (!string.IsNullOrEmpty(model.Image))
        {
            existingCategory.Image = model.Image;
        }

        try
        {
            // 4. Lưu thay đổi
            await _context.SaveChangesAsync();
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Lỗi server: " + ex.Message });
        }

        // 5. Trả về thành công
        return Ok(new { message = "Cập nhật thành công!", data = existingCategory });
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var item = await _context.Categories.FindAsync(id);
        if (item == null) return NotFound();

        // Kiểm tra ràng buộc trước khi xóa (Ví dụ: Danh mục đã có sản phẩm chưa?)
        if (await _context.Products.AnyAsync(p => p.CategoryId == id))
            return BadRequest("Không thể xóa danh mục đang chứa sản phẩm.");

        _context.Categories.Remove(item);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}
