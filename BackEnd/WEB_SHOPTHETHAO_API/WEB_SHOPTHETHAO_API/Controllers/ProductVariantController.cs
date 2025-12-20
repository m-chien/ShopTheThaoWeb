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

                ColorCode = pv.Color.ColorCode,

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
                    ColorName = x.ColorName,
                    ColorCode = x.ColorCode
                }).Distinct().ToList(),
                Sizes = g.Select(x => new { SizeID = x.SizeId, SizeName = x.SizeName }).Distinct().ToList(),
                Images = g.Select(x => x.Image).Distinct().ToList(),
                Prices = g.Select(x => x.Price).Distinct().ToList()
            })
            .ToList();

        return Ok(groupedProducts);
    }

    [HttpGet("detail/{id}")]
    public async Task<IActionResult> GetProductDetail(int id)
    {
        // 1. Lấy tất cả biến thể của sản phẩm đó từ DB
        // Cần đảm bảo Model Product của bạn đã cấu hình quan hệ với Brand và Category
        var rawVariants = await _context.ProductVariants
            .Include(pv => pv.Product)
                .ThenInclude(p => p.Brand)      // Join Brand từ Product
            .Include(pv => pv.Product)
                .ThenInclude(p => p.Category)   // Join Category từ Product
            .Include(pv => pv.Color)            // Join Color
            .Include(pv => pv.Size)             // Join Size
            .Where(pv => pv.ProductId == id)
            .ToListAsync();

        if (rawVariants == null || !rawVariants.Any())
        {
            return NotFound(new { message = "Không tìm thấy sản phẩm" });
        }

        // 2. Gom nhóm dữ liệu (Client-side evaluation)
        var productDetail = rawVariants
            .GroupBy(pv => new {
                pv.ProductId,
                ProductName = pv.Product.Name,
                ProductDescription = pv.Product.Description,
                // Kiểm tra null để tránh lỗi nếu sản phẩm chưa có Brand/Category
                BrandName = pv.Product.Brand != null ? pv.Product.Brand.Name : "",
                CategoryName = pv.Product.Category != null ? pv.Product.Category.Name : ""
            })
            .Select(g => new
            {
                ProductID = g.Key.ProductId,
                Name = g.Key.ProductName,
                Description = g.Key.ProductDescription,
                Brand = g.Key.BrandName,       // [Mới] Tên thương hiệu
                Category = g.Key.CategoryName, // [Mới] Tên danh mục

                // Danh sách Màu (Distinct)
                Colors = g.Select(x => new
                {
                    ColorID = x.Color.Id,
                    ColorName = x.Color.Name,
                    ColorCode = x.Color.ColorCode
                })
                .GroupBy(c => c.ColorID).Select(c => c.First()).ToList(),

                // Danh sách Size (Distinct) - [Mới]
                Sizes = g.Select(x => new
                {
                    SizeID = x.Size.Id,
                    SizeName = x.Size.Name
                })
                .GroupBy(s => s.SizeID).Select(s => s.First()).OrderBy(s => s.SizeID).ToList(),

                // Danh sách Ảnh (Distinct)
                Images = g.Select(x => x.Image)
                          .Where(img => !string.IsNullOrEmpty(img))
                          .Distinct()
                          .ToList(),

                // Thông tin giá và kho
                Prices = g.Select(x => x.Price).Distinct().OrderBy(p => p).ToList(),
                MinPrice = g.Min(x => x.Price),
                MaxPrice = g.Max(x => x.Price),
                TotalStock = g.Sum(x => x.StockQuantity), // [Mới] Tổng tồn kho

                // [Quan trọng cho trang chi tiết] 
                // Danh sách biến thể cụ thể để Frontend xử lý logic: Chọn Size + Chọn Màu -> Ra giá và tồn kho
                Variants = g.Select(v => new {
                    VariantID = v.Id,
                    ColorID = v.ColorId,
                    SizeID = v.SizeId,
                    Price = v.Price,
                    Stock = v.StockQuantity,
                    Image = v.Image
                }).ToList()
            })
            .FirstOrDefault(); // Vì lọc theo ID nên chỉ lấy 1 kết quả group

        return Ok(productDetail);
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
        // 1. Xử lý Input (như đã bàn ở câu trước để tránh lỗi null)
        object CheckString(string? val) => string.IsNullOrWhiteSpace(val) ? DBNull.Value : val;
        object CheckMaxPrice(decimal? val) => (val == null || val == 0) ? DBNull.Value : val;

        // 2. Lấy dữ liệu thô (Flat Data) từ Stored Procedure
        var rawResults = await _context.FilterProductVariantDtos
            .FromSqlRaw(@"
            EXEC dbo.sp_FilterProductVariants 
                @BrandIds = {0}, @SizeIds = {1}, @ColorIds = {2}, 
                @MinPrice = {3}, @MaxPrice = {4}, @Keyword = {5}",
                CheckString(req.BrandIds),
                CheckString(req.SizeIds),
                CheckString(req.ColorIds),
                req.MinPrice ?? 0,
                CheckMaxPrice(req.MaxPrice),
                CheckString(req.Keyword)
            )
            .ToListAsync(); // Lấy về RAM trước

        // 3. Xử lý GroupBy trên RAM (Client-side evaluation)
        var groupedProducts = rawResults
            .GroupBy(p => new { p.ProductID, p.ProductName, p.ProductDescription })
            .Select(g => new
            {
                ProductID = g.Key.ProductID,
                Name = g.Key.ProductName,
                Description = g.Key.ProductDescription,

                // Lấy danh sách màu (Distinct theo ID để tránh trùng lặp)
                Colors = g.Select(x => new
                {
                    ColorID = x.ColorID,
                    ColorName = x.ColorName,
                    ColorCode = x.ColorCode
                })
                .GroupBy(c => c.ColorID) // Group nhỏ lại để lấy Distinct
                .Select(c => c.First())
                .ToList(),

                // Lấy danh sách ảnh (Distinct)
                Images = g.Select(x => x.Image)
                          .Where(img => !string.IsNullOrEmpty(img)) // Bỏ ảnh null/rỗng
                          .Distinct()
                          .ToList(),

                // Lấy danh sách giá (để hiển thị khoảng giá)
                Prices = g.Select(x => x.Price).Distinct().OrderBy(p => p).ToList(),

                // Tiện ích: Tính luôn Min/Max price cho Frontend dễ hiển thị
                MinPrice = g.Min(x => x.Price),
                MaxPrice = g.Max(x => x.Price)
            })
            .ToList();

        // 4. Trả về kết quả chuẩn format
        return Ok(groupedProducts); // Data bây giờ đã có cấu trúc cây);
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
