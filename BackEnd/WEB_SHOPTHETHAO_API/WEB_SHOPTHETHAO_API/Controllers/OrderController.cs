using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WEB_SHOPTHETHAO_API.Models;

[Route("api/[controller]")]
[ApiController]
public class OrderController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public OrderController(ApplicationDbContext context)
    {
        _context = context;
    }

    // GET: api/order
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        return Ok(await _context.Orders.ToListAsync());
    }

    // GET: api/order/5
    [HttpGet("{id}")]
    public async Task<IActionResult> Get(int id)
    {
        var data = await _context.Orders.FindAsync(id);
        if (data == null) return NotFound();
        return Ok(data);
    }

    // POST: api/order
    [HttpPost]
    public async Task<IActionResult> Create(Order model)
    {
        _context.Orders.Add(model);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(Get), new { id = model.Id }, model);
    }

    // PUT: api/order/5
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, Order model)
    {
        if (id != model.Id) return BadRequest();

        _context.Entry(model).State = EntityState.Modified;
        await _context.SaveChangesAsync();

        return NoContent();
    }

    // DELETE: api/order/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var item = await _context.Orders.FindAsync(id);
        if (item == null) return NotFound();

        _context.Orders.Remove(item);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
