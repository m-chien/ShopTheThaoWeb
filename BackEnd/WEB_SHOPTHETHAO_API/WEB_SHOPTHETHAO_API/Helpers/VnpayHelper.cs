using System.Security.Cryptography;
using System.Text;

namespace WEB_SHOPTHETHAO_API.Helpers
{
    public static class VnpayHelper
    {
        public static string HmacSHA512(string key, string inputData)
        {
            var keyBytes = Encoding.UTF8.GetBytes(key);
            var inputBytes = Encoding.UTF8.GetBytes(inputData);

            using var hmac = new HMACSHA512(keyBytes);
            var hashBytes = hmac.ComputeHash(inputBytes);

            var sb = new StringBuilder(hashBytes.Length * 2);
            foreach (var b in hashBytes)
                sb.Append(b.ToString("x2")); // hex lowercase

            return sb.ToString();
        }
    }
}
