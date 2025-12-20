using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WEB_SHOPTHETHAO_API.DTO.Request;
using WEB_SHOPTHETHAO_API.Models;
using WEB_SHOPTHETHAO_API.Service;

namespace WEB_SHOPTHETHAO_API.Controllers
{
    [ApiController]
    [Route("api/checkout")]
    public class CheckoutController : ControllerBase
    {
        private readonly VnpayService _vnpayService;
        private readonly ApplicationDbContext _db;

        public CheckoutController(VnpayService vnpayService, ApplicationDbContext db)
        {
            _vnpayService = vnpayService;
            _db = db;
        }

        [HttpPost("vnpay")]
        public IActionResult CreateVnpayPayment([FromBody] CreatePaymentRequest request)
        {
            if (request.Items == null || request.Items.Count == 0)
                return BadRequest("Items is empty.");

            if (request.Items.Any(i => i.Quantity <= 0))
                return BadRequest("Quantity must be > 0.");

            var variantIds = request.Items.Select(i => i.ProductVariantId).Distinct().ToList();

            // Load biến thể
            var variants = _db.ProductVariants
                .Where(v => variantIds.Contains(v.Id))
                .Select(v => new { v.Id, v.Price, v.StockQuantity })
                .ToList();

            if (variants.Count != variantIds.Count)
            {
                var foundIds = variants.Select(v => v.Id).ToHashSet();
                var missing = variantIds.Where(id => !foundIds.Contains(id)).ToList();
                return BadRequest(new { message = "Some ProductVariantId not found.", missing });
            }

            // Map nhanh
            var variantMap = variants.ToDictionary(x => x.Id);

            // Check tồn kho
            foreach (var item in request.Items)
            {
                var v = variantMap[item.ProductVariantId];
                if (v.StockQuantity < item.Quantity)
                    return BadRequest($"Insufficient stock for variantId={item.ProductVariantId}");
            }

            // Tính tổng tiền từ DB
            decimal totalAmount = 0m;
            foreach (var item in request.Items)
            {
                var v = variantMap[item.ProductVariantId];

                // Nếu Price là decimal (không nullable)
                totalAmount += v.Price * item.Quantity;

                // Nếu Price là decimal? thì dùng dòng này thay cho dòng trên:
                // totalAmount += (v.Price ?? 0m) * item.Quantity;
            }

            using var tx = _db.Database.BeginTransaction();
            try
            {
                // 1) Order
                var order = new Order
                {
                    UserId = request.UserId,
                    VoucherId = request.VoucherId,
                    Status = "Pending",
                    TotalAmount = totalAmount,
                    DeliveryAddress = request.DeliveryAddress,
                    Phone = request.Phone,
                    OrderDate = DateTime.Now
                };

                _db.Orders.Add(order);
                _db.SaveChanges();

                // 2) OrderDetail: mỗi item -> 1 detail
                var orderDetails = request.Items.Select(item =>
                {
                    var v = variantMap[item.ProductVariantId];
                    return new OrderDetail
                    {
                        OrderId = order.Id,
                        ProductVariantId = item.ProductVariantId,
                        Quantity = item.Quantity,
                        UnitPrice = v.Price
                    };
                }).ToList();

                _db.OrderDetails.AddRange(orderDetails);
                _db.SaveChanges();

                // 3) Payment
                var payment = new Payment
                {
                    OrderId = order.Id,
                    Method = "VNPAY",
                    Amount = order.TotalAmount,
                    Status = "Pending",
                    PaymentDate = null
                };

                _db.Payments.Add(payment);
                _db.SaveChanges();

                tx.Commit();

                // 4) URL VNPAY
                string clientIp = HttpContext.Connection.RemoteIpAddress?.ToString() ?? "127.0.0.1";
                if (clientIp == "::1") clientIp = "127.0.0.1";

                string paymentUrl = _vnpayService.CreatePaymentUrl(payment, clientIp);

                return Ok(new
                {
                    orderId = order.Id,
                    paymentId = payment.Id,
                    totalAmount = order.TotalAmount,
                    paymentUrl
                });
            }
            catch (Exception ex)
            {
                tx.Rollback();
                return BadRequest(ex.Message);
            }
        }

       }
}
