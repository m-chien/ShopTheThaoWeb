namespace WEB_SHOPTHETHAO_API.DTO.Request
{
    public class CreateProductVariantDto
    {
        public int ProductId { get; set; }
        public int SizeId { get; set; }
        public int ColorId { get; set; }
        public decimal Price { get; set; }
        public int StockQuantity { get; set; }
        public string? Image { get; set; }
    }
}
