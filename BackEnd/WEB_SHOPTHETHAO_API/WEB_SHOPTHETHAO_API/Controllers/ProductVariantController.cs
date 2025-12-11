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
    [HttpGet("grouped-products")]
    public async Task<IActionResult> GetGroupedProducts()
    {
        var rawResults = await _context.ProductVariants
            .Include(pv => pv.Product)
            .Include(pv => pv.Color)
            .Select(pv => new
            {
                pv.ProductId,
                ProductName = pv.Product.Name,
                ProductDescription = pv.Product.Description,
                pv.ColorId,
                ColorName = pv.Color.Name,
                pv.Image,
                pv.Price
            })
            .ToListAsync();

        var groupedProducts = rawResults
            .GroupBy(pv => new { pv.ProductId, pv.ProductName, pv.ProductDescription })
            .Select(g => new
            {
                ProductID = g.Key.ProductId,
                Name = g.Key.ProductName,
                Description = g.Key.ProductDescription,
                Colors = g.Select(x => new
                {
                    ColorID = x.ColorId,
                    ColorName = x.ColorName
                }).Distinct().ToList(),
                Images = g.Select(x => x.Image).Distinct().ToList(),
                Prices = g.Select(x => x.Price).Distinct().ToList()
            })
            .ToList();

        return Ok(groupedProducts);
    }
    [HttpPost]
    public async Task<IActionResult> Create(ProductVariant model)
    {
        _context.ProductVariants.Add(model);
        await _context.SaveChangesAsync();
        return Ok(model);
    }

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
}
