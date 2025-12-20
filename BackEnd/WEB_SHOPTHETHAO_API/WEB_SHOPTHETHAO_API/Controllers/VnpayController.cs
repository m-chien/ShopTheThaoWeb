using Microsoft.AspNetCore.Mvc;
using WEB_SHOPTHETHAO_API.Service;
using WEB_SHOPTHETHAO_API.Models;

namespace WEB_SHOPTHETHAO_API.Controllers
{
    [ApiController]
    [Route("api/vnpay")]
    public class VnpayController : ControllerBase
    {
        private readonly VnpayService _vnpayService;
        private readonly ApplicationDbContext _db;

        public VnpayController(VnpayService vnpayService, ApplicationDbContext db)
        {
            _vnpayService = vnpayService;
            _db = db;
        }

        // URL: https://localhost:7299/api/vnpay/return
        [HttpGet("return")]
        public IActionResult VnpayReturn()
        {
            var query = Request.Query;

            // 1. Check chữ ký
            if (!_vnpayService.ValidateSignature(query))
                return BadRequest("Invalid signature");

            string responseCode = query["vnp_ResponseCode"];
            string txnRef = query["vnp_TxnRef"];
            string vnpTransNo = query["vnp_TransactionNo"];

            if (!int.TryParse(txnRef, out int paymentId))
                return BadRequest("Invalid payment id");

            var payment = _db.Payments.Find(paymentId);
            if (payment == null)
                return NotFound("Payment not found");

            var order = _db.Orders.Find(payment.OrderId);

            // 2. Update DB
            if (responseCode == "00")
            {
                payment.Status = "Paid";
                payment.PaymentDate = DateTime.Now;
                if (order != null) order.Status = "Paid";
            }
            else
            {
                payment.Status = "Failed";
                if (order != null && order.Status != "Paid")
                    order.Status = "Payment Failed";
            }

            _db.SaveChanges();

            // 3. Redirect về frontend
            return Redirect(
                $"http://localhost:3000/payment-result" +
                $"?paymentId={paymentId}&code={responseCode}&transNo={vnpTransNo}"
            );
        }
    }
}
