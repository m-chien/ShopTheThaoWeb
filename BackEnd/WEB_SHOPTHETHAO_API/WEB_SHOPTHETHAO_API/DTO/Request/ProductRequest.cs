namespace WEB_SHOPTHETHAO_API.DTO.Request
{
    public class ProductRequest
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public int CategoryID { get; set; }
        public int BrandID { get; set; }

        public int SizeID { get; set; }
        public int ColorID { get; set; }
        public decimal Price { get; set; }
        public int StockQuantity { get; set; }
        public string Image { get; set; }
    }
}
