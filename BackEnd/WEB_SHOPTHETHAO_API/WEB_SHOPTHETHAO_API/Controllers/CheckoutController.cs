using Microsoft.AspNetCore.Mvc;
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

        // FE gọi API này -> trả về paymentUrl để redirect qua VNPAY
        [HttpPost("vnpay")]
        public IActionResult CreateVnpayPayment([FromBody] CreatePaymentRequest request)
        {
            // 1) Tạo Order (đúng field trong model)
            var order = new Order
            {
                UserId = request.UserId,                 // bắt buộc bạn phải truyền
                VoucherId = request.VoucherId,           // optional
                Status = "Pending",
                TotalAmount = request.Amount,            // dùng TotalAmount
                DeliveryAddress = request.DeliveryAddress,
                Phone = request.Phone,
                OrderDate = DateTime.Now
            };

            _db.Orders.Add(order);
            _db.SaveChanges(); // để có order.Id

            // 2) (Tuỳ bạn) tạo OrderDetail nếu request có items
            // Nếu bạn chưa làm giỏ hàng/chi tiết đơn, có thể bỏ qua phần này.

            // 3) Tạo Payment (đúng model)
            var payment = new Payment
            {
                OrderId = order.Id,
                Method = "VNPAY",
                Amount = order.TotalAmount,              // decimal?
                Status = "Pending",
                PaymentDate = null
            };

            _db.Payments.Add(payment);
            _db.SaveChanges(); // để có payment.Id -> làm vnp_TxnRef

            // 4) Tạo URL VNPAY
            string clientIp = HttpContext.Connection.RemoteIpAddress?.ToString() ?? "127.0.0.1";
            if (clientIp == "::1") clientIp = "127.0.0.1";

            string paymentUrl = _vnpayService.CreatePaymentUrl(payment, clientIp);

            return Ok(new
            {
                orderId = order.Id,
                paymentId = payment.Id,
                paymentUrl
            });
        }
    }
}
