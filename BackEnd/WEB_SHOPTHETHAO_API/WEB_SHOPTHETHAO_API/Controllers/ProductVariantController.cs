using System.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using WEB_SHOPTHETHAO_API.DTO.Request;
using WEB_SHOPTHETHAO_API.DTO.Response;
using WEB_SHOPTHETHAO_API.Models;

[Route("api/[controller]")]
[ApiController]
public class ProductVariantController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public ProductVariantController(ApplicationDbContext context)
    {
        _context = context;
    }


    [HttpGet("product/{productId}")]
    public async Task<IActionResult> GetByProduct(int productId)
    {
        var list = await _context.ProductVariants
            .Where(x => x.ProductId == productId)
            .Include(x => x.Size)
            .Include(x => x.Color)
            .ToListAsync();

        return Ok(list);
    }
    [HttpGet("with-product")]
    public async Task<IActionResult> GetAllWithProduct()
    {
        var list = await _context.ProductVariants
            .Include(pv => pv.Product) // join Product
            .Include(pv => pv.Size)
            .Include(pv => pv.Color)
            .ToListAsync();

        return Ok(list);
    }

    // Hàm lấy dữ liệu của Product
    [HttpGet("grouped-products")]
    public async Task<IActionResult> GetGroupedProducts()
    {
        var rawResults = await _context.ProductVariants
            .Include(pv => pv.Product)
                .ThenInclude(p => p.Category)
            .Include(pv => pv.Product)
                .ThenInclude(p => p.Brand)
            .Include(pv => pv.Color)
            .Include(pv => pv.Size)
            .Select(pv => new
            {
                pv.ProductId,
                ProductName = pv.Product.Name,
                ProductDescription = pv.Product.Description,

                CategoryId = pv.Product.CategoryId,
                BrandId = pv.Product.BrandId,

                CategoryName = pv.Product.Category.Name,
                BrandName = pv.Product.Brand.Name,

                pv.ColorId,
                ColorName = pv.Color.Name,

                pv.SizeId,
                SizeName = pv.Size.Name,

                pv.Image,
                pv.Price
            })
            .ToListAsync();

        var groupedProducts = rawResults
            .GroupBy(pv => new { pv.ProductId, pv.ProductName, pv.ProductDescription, pv.CategoryName, pv.BrandName,
                pv.CategoryId,
                pv.BrandId,
            })
            .Select(g => new
            {
                ProductID = g.Key.ProductId,
                Name = g.Key.ProductName,
                Description = g.Key.ProductDescription,
                CategoryID = g.Key.CategoryId,
                BrandID = g.Key.BrandId,
                CategoryName = g.Key.CategoryName,
                BrandName = g.Key.BrandName,

                Colors = g.Select(x => new
                {
                    ColorID = x.ColorId,
                    ColorName = x.ColorName
                }).Distinct().ToList(),
                Sizes = g.Select(x => new { SizeID = x.SizeId, SizeName = x.SizeName }).Distinct().ToList(),
                Images = g.Select(x => x.Image).Distinct().ToList(),
                Prices = g.Select(x => x.Price).Distinct().ToList()
            })
            .ToList();

        return Ok(groupedProducts);
    }
    //[HttpPost]
    //public async Task<IActionResult> Create(ProductVariant model)
    //{
    //    _context.ProductVariants.Add(model);
    //    await _context.SaveChangesAsync();
    //    return Ok(model);
    //}

    [HttpGet("top-variants")]
    public async Task<IActionResult> GetTopVariants()
    {
        var result = await _context
            .Set<TopProductVariantResponse>()
            .FromSqlRaw("EXEC sp_GetTop3ProductVariants")
            .ToListAsync();

        return Ok(result);
    }


    [HttpPost("filter-sp")]
    public async Task<IActionResult> FilterByStoredProcedure([FromBody] ProductFilterRequest req)
    {
        var result = await _context.FilterProductVariantDtos
            .FromSqlRaw(@"
                EXEC dbo.sp_FilterProductVariants 
                    @BrandIds = {0},
                    @SizeIds  = {1},
                    @ColorIds = {2},
                    @MinPrice = {3},
                    @MaxPrice = {4},
                    @Keyword  = {5}",
                req.BrandIds,
                req.SizeIds,
                req.ColorIds,
                (object?)req.MinPrice ?? DBNull.Value,
                (object?)req.MaxPrice ?? DBNull.Value,
                (object?)req.Keyword ?? DBNull.Value
            )
            .ToListAsync();

        return Ok(result);
    }

    // Hàm lấy danh sách Product theo các sản phẩm hiện có của Product
    [HttpGet("by-product/{productId}")]
    public async Task<IActionResult> GetVariantsByProduct(int productId)
    {
        var variants = await _context.ProductVariants
            // --- QUAN TRỌNG: PHẢI CÓ 2 DÒNG NÀY ---
            .Include(pv => pv.Size)   // Câu lệnh bắt buộc để lấy thông tin bảng Size
            .Include(pv => pv.Color)  // Câu lệnh bắt buộc để lấy thông tin bảng Color
            // -------------------------------------
            
            .Where(pv => pv.ProductId == productId)
            .Select(pv => new
            {
                pv.Id,
                pv.SizeId,
                // Kiểm tra null để tránh lỗi 500 nếu dữ liệu bị sai
                SizeName = pv.Size != null ? pv.Size.Name : "Không tìm thấy Size", 
                
                pv.ColorId,
                ColorName = pv.Color != null ? pv.Color.Name : "Không tìm thấy Màu",

                pv.Price,
                pv.StockQuantity,
                pv.Image
            })
            .ToListAsync();

        return Ok(variants);
    }

    // [PUT] Cập nhật giá và tồn kho của 1 biến thể cụ thể
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateVariant(int id, [FromBody] UpdateVariantDto req)
    {
        var variant = await _context.ProductVariants.FindAsync(id);
        if (variant == null) return NotFound(new { message = "Không tìm thấy biến thể!" });

        // Chỉ cập nhật Giá và Tồn kho
        variant.Price = req.Price;
        variant.StockQuantity = req.StockQuantity;

        await _context.SaveChangesAsync();
        return Ok(new { message = "Cập nhật biến thể thành công!" });
    }

    // [DELETE] Xóa 1 biến thể cụ thể
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteVariant(int id)
    {
        var variant = await _context.ProductVariants.FindAsync(id);
        if (variant == null) return NotFound();

        _context.ProductVariants.Remove(variant);
        await _context.SaveChangesAsync();
        return Ok(new { message = "Đã xóa biến thể!" });
    }

    // [POST] Thêm một biến thể mới (Có kiểm tra trùng lặp)
    [HttpPost]
    public async Task<IActionResult> CreateVariant([FromBody] CreateProductVariantDto req)
    {
        // 1. Kiểm tra: Sản phẩm này đã có cặp Size + Màu này chưa?
        var exists = await _context.ProductVariants.AnyAsync(x =>
            x.ProductId == req.ProductId &&
            x.SizeId == req.SizeId &&
            x.ColorId == req.ColorId);

        if (exists)
        {
            return BadRequest(new { message = "Sản phẩm này đã có Size và Màu đó rồi!" });
        }

        // 2. Map từ DTO sang Entity (Thủ công)
        var newVariant = new ProductVariant
        {
            ProductId = req.ProductId,
            SizeId = req.SizeId,
            ColorId = req.ColorId,
            Price = req.Price,
            StockQuantity = req.StockQuantity,
            Image = req.Image,
            // Các trường ngày tháng có thể gán mặc định
            NgayNhap = DateTime.Now
        };

        // 3. Thêm mới
        _context.ProductVariants.Add(newVariant);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Thêm biến thể mới thành công!" });
    }
}
