namespace WEB_SHOPTHETHAO_API.DTO.Response
{
    public class PaymentResultResponse
    {
        public bool IsSuccess { get; set; }       // Giao dịch thành công hay không
        public string? OrderId { get; set; }      // Mã đơn hàng (hoặc Payment.Id) phía merchant
        public string? PaymentId { get; set; }    // Mã giao dịch phía VNPAY (vnp_TransactionNo)
        public string? ResponseCode { get; set; } // Mã phản hồi từ VNPAY (vnp_ResponseCode)
        public string? Message { get; set; }      // Thông báo hoặc mô tả kết quả
    }

}
