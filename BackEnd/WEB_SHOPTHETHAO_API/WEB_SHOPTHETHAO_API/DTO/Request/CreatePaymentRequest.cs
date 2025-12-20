namespace WEB_SHOPTHETHAO_API.DTO.Request
{
    public class CreatePaymentRequest
    {
        public int UserId { get; set; }
        public int? VoucherId { get; set; }
        public decimal Amount { get; set; }

        public string? DeliveryAddress { get; set; }
        public string? Phone { get; set; }
    }
}
