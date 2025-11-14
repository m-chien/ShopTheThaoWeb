using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WEB_SHOPTHETHAO_API.Models;

[Route("api/[controller]")]
[ApiController]
public class UserController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public UserController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll() =>
        Ok(await _context.Users.ToListAsync());

    [HttpPost]
    public async Task<IActionResult> Create(User model)
    {
        _context.Users.Add(model);
        await _context.SaveChangesAsync();
        return Ok(model);
    }
}
