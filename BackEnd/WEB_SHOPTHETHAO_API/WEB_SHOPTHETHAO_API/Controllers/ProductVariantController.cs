//using Microsoft.AspNetCore.Mvc;
//using Microsoft.EntityFrameworkCore;
//using WEB_SHOPTHETHAO_API.Models;

//[Route("api/[controller]")]
//[ApiController]
//public class ProductVariantController : ControllerBase
//{
//    private readonly ApplicationDbContext _context;

//    public ProductVariantController(ApplicationDbContext context)
//    {
//        _context = context;
//    }

//    [HttpGet("product/{productId}")]
//    public async Task<IActionResult> GetByProduct(int productId)
//    {
//        var list = await _context.ProductVariants
//            .Where(x => x.ProductId == productId)
//            .Include(x => x.Size)
//            .Include(x => x.Color)
//            .ToListAsync();

//        return Ok(list);
//    }

//    [HttpPost]
//    public async Task<IActionResult> Create(ProductVariant model)
//    {
//        _context.ProductVariants.Add(model);
//        await _context.SaveChangesAsync();
//        return Ok(model);
//    }
//}
