using System.Net;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using WEB_SHOPTHETHAO_API.Models;
using WEB_SHOPTHETHAO_API.Helpers;

namespace WEB_SHOPTHETHAO_API.Service
{
    public class VnpayService
    {
        private readonly IConfiguration _config;

        public VnpayService(IConfiguration config)
        {
            _config = config;
        }

        public string CreatePaymentUrl(Payment payment, string ipAddress)
        {
            string tmnCode = _config["VNPAY:TmnCode"] ?? "";
            string hashSecret = _config["VNPAY:HashSecret"] ?? "";
            string baseUrl = _config["VNPAY:BaseUrl"] ?? "";
            string returnUrl = _config["VNPAY:ReturnUrl"] ?? "";

            var vnTimeZone = TimeZoneInfo.FindSystemTimeZoneById("SE Asia Standard Time");
            var vnNow = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, vnTimeZone);

            //  TxnRef UNIQUE (không trùng trong ngày)
            var txnRef = $"{payment.Id}_{vnNow:yyyyMMddHHmmss}";

            var vnp = new SortedDictionary<string, string>
            {
                ["vnp_Version"] = "2.1.0",
                ["vnp_Command"] = "pay",
                ["vnp_TmnCode"] = tmnCode,
                ["vnp_Amount"] = ((long)((payment.Amount ?? 0m) * 100)).ToString(), // VND * 100
                ["vnp_CurrCode"] = "VND",
                ["vnp_TxnRef"] = txnRef,
                ["vnp_OrderInfo"] = $"Thanh toan don hang #{payment.OrderId}",
                ["vnp_OrderType"] = "other",
                ["vnp_ReturnUrl"] = returnUrl,
                ["vnp_IpAddr"] = ipAddress,
                ["vnp_Locale"] = "vn",
                ["vnp_CreateDate"] = vnNow.ToString("yyyyMMddHHmmss"),

                //  thêm ExpireDate (15 phút)
                ["vnp_ExpireDate"] = vnNow.AddMinutes(15).ToString("yyyyMMddHHmmss")
            };

            string hashData = BuildQuery(vnp, encodeValue: true);
            string secureHash = VnpayHelper.HmacSHA512(hashSecret, hashData);

            return $"{baseUrl}?{hashData}&vnp_SecureHashType=HmacSHA512&vnp_SecureHash={secureHash}";
        }


        public bool ValidateSignature(IQueryCollection queryParams)
        {
            string secureHash = queryParams["vnp_SecureHash"].ToString();
            if (string.IsNullOrWhiteSpace(secureHash)) return false;

            string hashSecret = _config["VNPAY:HashSecret"] ?? "";

            var vnp = new SortedDictionary<string, string>();

            foreach (var key in queryParams.Keys)
            {
                if (key.StartsWith("vnp_", StringComparison.OrdinalIgnoreCase) &&
                    !key.Equals("vnp_SecureHash", StringComparison.OrdinalIgnoreCase) &&
                    !key.Equals("vnp_SecureHashType", StringComparison.OrdinalIgnoreCase))
                {
                    vnp[key] = queryParams[key].ToString();
                }
            }

            // Khi verify cũng ký trên chuỗi encodeValue:true để đồng bộ
            string hashData = BuildQuery(vnp, encodeValue: true);
            string computed = VnpayHelper.HmacSHA512(hashSecret, hashData);

            return secureHash.Equals(computed, StringComparison.OrdinalIgnoreCase);
        }

        private static string BuildQuery(SortedDictionary<string, string> data, bool encodeValue)
        {
            return string.Join("&", data
                .Where(kv => !string.IsNullOrEmpty(kv.Value))
                .Select(kv =>
                {
                    var val = encodeValue ? WebUtility.UrlEncode(kv.Value) : kv.Value;
                    return $"{kv.Key}={val}";
                }));
        }
    }
}
