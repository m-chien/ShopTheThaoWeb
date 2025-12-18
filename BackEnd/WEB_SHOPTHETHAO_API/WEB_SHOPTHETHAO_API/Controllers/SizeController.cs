using Microsoft.AspNetCore.Mvc;
using WEB_SHOPTHETHAO_API.Models;
using Microsoft.EntityFrameworkCore;


[Route("api/[controller]")]
[ApiController]
public class SizeController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public SizeController(ApplicationDbContext context)
        {
            _context = context;
        }
        [HttpGet]
        public async Task<IActionResult> GetAll() =>
            Ok(await _context.Sizes.ToListAsync());
    }
