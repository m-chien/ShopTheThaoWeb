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
        if (id != model.Id) return BadRequest();

        _context.Entry(model).State = EntityState.Modified;
        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var item = await _context.Categories.FindAsync(id);
        if (item == null) return NotFound();

        _context.Categories.Remove(item);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}
