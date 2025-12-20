namespace WEB_SHOPTHETHAO_API.DTO.Request
{
    public class CreatePaymentRequest
    {
        public int UserId { get; set; }
        public int? VoucherId { get; set; }
        public decimal Amount { get; set; }
        public string DeliveryAddress { get; set; } = "";
        public string Phone { get; set; } = "";

        public List<CreateOrderItemRequest> Items { get; set; } = new();
    }

    public class CreateOrderItemRequest
    {
        public int ProductVariantId { get; set; }
        public int Quantity { get; set; }
    }
}
