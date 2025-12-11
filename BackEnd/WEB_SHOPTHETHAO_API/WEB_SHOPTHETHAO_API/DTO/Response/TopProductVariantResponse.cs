namespace WEB_SHOPTHETHAO_API.DTO.Response
{
    public class TopProductVariantResponse
    {
        public int ProductVariantID { get; set; }
        public int ProductID { get; set; }
        public string ProductName { get; set; }

        public int ColorID { get; set; }
        public string ColorName { get; set; }

        public int SizeID { get; set; }
        public string SizeName { get; set; }

        public decimal Price { get; set; }
        public string Image { get; set; }

        public int TotalSold { get; set; }
        public decimal TotalRevenue { get; set; }
    }
}
