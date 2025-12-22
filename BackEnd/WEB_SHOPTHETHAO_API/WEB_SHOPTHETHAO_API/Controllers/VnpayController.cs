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

            // 1) Check chữ ký
            if (!_vnpayService.ValidateSignature(query))
                return BadRequest("Invalid signature");

            string responseCode = query["vnp_ResponseCode"].ToString();
            string tranStatus = query["vnp_TransactionStatus"].ToString();
            string txnRef = query["vnp_TxnRef"].ToString();
            string vnpTransNo = query["vnp_TransactionNo"].ToString();

            // ✅ Parse paymentId từ txnRef (có thể là "3" hoặc "3_2025...")
            string paymentIdStr = txnRef.Contains("_") ? txnRef.Split('_')[0] : txnRef;

            if (!int.TryParse(paymentIdStr, out int paymentId))
                return BadRequest($"Invalid payment id from txnRef: {txnRef}");

            var payment = _db.Payments.Find(paymentId);
            if (payment == null)
                return NotFound("Payment not found");

            var order = _db.Orders.Find(payment.OrderId);

            // ✅ Success khi cả 2 = "00"
            bool isSuccess = responseCode == "00" && tranStatus == "00";

            if (isSuccess)
            {
                payment.Status = "Đã thanh toán";
                payment.PaymentDate = DateTime.Now;
            }
            else
            {
                payment.Status = "Thanh toán thất bại";
            }

            _db.SaveChanges();

            return Redirect(
                $"http://localhost:5173/payment-result" +
                $"?paymentId={paymentId}&code={responseCode}&transNo={vnpTransNo}"
            );
        }

    }
}
