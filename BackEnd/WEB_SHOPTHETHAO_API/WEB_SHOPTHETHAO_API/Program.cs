using Microsoft.EntityFrameworkCore;
using WEB_SHOPTHETHAO_API.Models;

var builder = WebApplication.CreateBuilder(args);

// ---------------------------
// 1. Add services
// ---------------------------

// Add controllers
builder.Services.AddControllers()
    // Fix vòng lặp JSON cho navigation properties
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
        options.JsonSerializerOptions.WriteIndented = true;
    });

// Add DbContext
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<ApplicationDbContext>(options =>
{
    options.UseSqlServer(connectionString);
    options.EnableSensitiveDataLogging();
    options.LogTo(Console.WriteLine); // Optional: log SQL ra console
});

// Swagger/OpenAPI
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// CORS: Allow all
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// ---------------------------
// 2. Build app
// ---------------------------

var app = builder.Build();

// ---------------------------
// 3. Configure middleware
// ---------------------------

app.UseCors("AllowAll");

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseAuthorization();

app.MapControllers();

app.Run();

