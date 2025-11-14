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
}
