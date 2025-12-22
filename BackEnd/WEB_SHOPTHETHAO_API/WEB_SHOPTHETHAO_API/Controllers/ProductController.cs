using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WEB_SHOPTHETHAO_API.DTO.Request;
using WEB_SHOPTHETHAO_API.Models;

[Route("api/[controller]")]
[ApiController]
public class ProductController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public ProductController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var list = await _context.Products
            .Include(x => x.Category)
            .Include(x => x.Brand)
            .ToListAsync();

        return Ok(list);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> Get(int id)
    {
        var item = await _context.Products
            .Include(x => x.Category)
            .Include(x => x.Brand)
            .FirstOrDefaultAsync(x => x.Id == id);

        if (item == null) return NotFound();
        return Ok(item);
    }

    //[HttpPost]
    //public async Task<IActionResult> Create(Product model)
    //{
    //    _context.Products.Add(model);
    //    await _context.SaveChangesAsync();
    //    return CreatedAtAction(nameof(Get), new { id = model.Id }, model);
    //}


    //Hàm lỗi
    //[HttpPut("{id}")]
    //public async Task<IActionResult> UpdateProduct(int id, [FromBody] Product model)
    //{
    //    var product = await _context.Products.FindAsync(id);
    //    if (product == null) return NotFound(new { message = "Không tìm thấy sản phẩm" });

    //    product.Name = model.Name;
    //    product.Description = model.Description;
    //    product.CategoryId = model.CategoryId;
    //    product.BrandId = model.BrandId;

    //    await _context.SaveChangesAsync();
    //    return Ok(new { message = "Cập nhật thành công!" });
    //}

    // [PUT] Cập nhật thông tin chung sản phẩm
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateProduct(int id, [FromBody] UpdateProductDto req)
    {
        var product = await _context.Products.FindAsync(id);
        if (product == null) return NotFound(new { message = "Không tìm thấy sản phẩm" });

        // Cập nhật dữ liệu
        product.Name = req.Name;
        product.Description = req.Description;
        product.CategoryId = req.CategoryID;
        product.BrandId = req.BrandID;

        await _context.SaveChangesAsync();
        return Ok(new { message = "Cập nhật thành công!" });
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteProduct(int id)
    {
        // 1. Kiểm tra ID và tìm sản phẩm
        var product = await _context.Products
            .Include(p => p.ProductVariants)
            .FirstOrDefaultAsync(p => p.Id == id);

        if (product == null) return NotFound(new { message = "Không tìm thấy sản phẩm" });

        try
        {
            if (product.ProductVariants != null && product.ProductVariants.Any())
            {
                _context.ProductVariants.RemoveRange(product.ProductVariants);
            }

            _context.Products.Remove(product);

            await _context.SaveChangesAsync();

            return Ok(new { message = "Đã xóa sản phẩm thành công" });
        }
        catch (DbUpdateException)
        {
            return BadRequest(new
            {
                message = "Không thể xóa sản phẩm này vì đang có trong đơn hàng hoặc giỏ hàng của khách!"
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Lỗi hệ thống: " + ex.Message });
        }
    }

    //Tạo dữ liệu cho Product
    [HttpPost]
    public async Task<IActionResult> CreateProduct([FromBody] ProductRequest req)
    {
        // 1. Validate cơ bản (tùy chọn)
        if (req.Price < 0) return BadRequest(new { message = "Giá không được âm" });

        // 1. Tạo sản phẩm cha (Product)
        var product = new Product
        {
            Name = req.Name,
            Description = req.Description,
            CategoryId = req.CategoryID,
            BrandId = req.BrandID,
            Status = true,
            CreatedAt = DateTime.Now
        };

        _context.Products.Add(product);
        await _context.SaveChangesAsync(); // Lưu để lấy ProductId

        // 2. Tạo biến thể đầu tiên (Variant)
        var variant = new ProductVariant
        {
            ProductId = product.Id, // Lấy ID vừa tạo ở trên
            SizeId = req.SizeID,
            ColorId = req.ColorID,
            Price = req.Price,
            StockQuantity = req.StockQuantity,
            Image = req.Image
        };

        _context.ProductVariants.Add(variant);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Tạo sản phẩm và biến thể thành công!" });
    }

}
