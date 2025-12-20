using System.Security.Claims;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
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
        [Authorize]
        public IActionResult CreateVnpayPayment([FromBody] CreatePaymentRequest request)
        {
            if (request.Items == null || request.Items.Count == 0)
                return BadRequest("Items is empty.");

            if (request.Items.Any(i => i.Quantity <= 0))
                return BadRequest("Quantity must be > 0.");

            // Lấy list variantId
            var variantIds = request.Items.Select(i => i.ProductVariantId).Distinct().ToList();

            // Load các biến thể + giá (và tồn kho nếu cần)
            var variants = _db.ProductVariants
                .Where(v => variantIds.Contains(v.Id))
                .Select(v => new
                {
                    v.Id,
                    v.Price,
                    v.StockQuantity
                })
                .ToList();

            // Check thiếu variant
            if (variants.Count != variantIds.Count)
            {
                var foundIds = variants.Select(v => v.Id).ToHashSet();
                var missing = variantIds.Where(id => !foundIds.Contains(id)).ToList();
                return BadRequest(new { message = "Some ProductVariantId not found.", missing });
            }

            // (Tuỳ chọn) check tồn kho
            foreach (var item in request.Items)
            {
                var v = variants.First(x => x.Id == item.ProductVariantId);
                if (v.StockQuantity < item.Quantity)
                    return BadRequest($"Insufficient stock for variantId={item.ProductVariantId}");
            }

            // Tính tổng tiền từ DB (chuẩn)
            decimal totalAmount = 0;
            foreach (var item in request.Items)
            {
                var v = variants.First(x => x.Id == item.ProductVariantId);
                totalAmount += v.Price * item.Quantity;

            }

            // Nếu bạn vẫn muốn dùng request.Amount thì có thể so sánh, nhưng nên tin DB
            // if (request.Amount != totalAmount) ...

            // Dùng transaction để đảm bảo tạo Order + Detail + Payment đồng bộ
            using var tx = _db.Database.BeginTransaction();

            int userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));

            try
            {
                // 1) Tạo Order
                var order = new Order
                {
                    UserId = userId,
                    VoucherId = request.VoucherId,
                    Status = "Đang xử lý",
                    TotalAmount = totalAmount,
                    DeliveryAddress = request.DeliveryAddress,
                    Phone = request.Phone,
                    OrderDate = DateTime.Now
                };

                _db.Orders.Add(order);
                _db.SaveChanges(); // có order.Id

                // 2) Tạo N OrderDetail (Pending)
                var orderDetails = request.Items.Select(item =>
                {
                    var v = variants.First(x => x.Id == item.ProductVariantId);

                    return new OrderDetail
                    {
                        OrderId = order.Id,
                        ProductVariantId = item.ProductVariantId,
                        Quantity = item.Quantity,
                        UnitPrice = v.Price
                    };
                }).ToList();

                _db.OrderDetails.AddRange(orderDetails);

                // 3) (Option A) trừ kho ngay
                // Nếu bạn muốn trừ kho sau khi VNPAY Paid thì bỏ đoạn này
                var mapQty = request.Items
                    .GroupBy(i => i.ProductVariantId)
                    .ToDictionary(g => g.Key, g => g.Sum(x => x.Quantity));

                var variantEntities = _db.ProductVariants.Where(v => variantIds.Contains(v.Id)).ToList();
                foreach (var v in variantEntities)
                {
                    v.StockQuantity -= mapQty[v.Id];
                }

                _db.SaveChanges();

                // 4) Tạo Payment
                var payment = new Payment
                {
                    OrderId = order.Id,
                    Method = "VNPAY",
                    Amount = order.TotalAmount,
                    Status = "Đang chờ thanh toán",
                    PaymentDate = null
                };

                _db.Payments.Add(payment);
                _db.SaveChanges();

                tx.Commit();

                // 5) Tạo URL VNPAY
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
