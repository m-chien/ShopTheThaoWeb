namespace WEB_SHOPTHETHAO_API.DTO.Response
{
    public class FilterProductVariantResponse
    {
        public int ProductID { get; set; }
        public string ProductName { get; set; }
        public string ProductDescription { get; set; } // Mới
        public int ColorID { get; set; }
        public string ColorName { get; set; }
        public string ColorCode { get; set; }          // Mới
        public decimal Price { get; set; }
        public string Image { get; set; }
    }
}
