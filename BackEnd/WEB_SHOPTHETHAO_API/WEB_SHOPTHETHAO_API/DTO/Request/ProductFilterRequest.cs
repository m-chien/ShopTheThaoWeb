namespace WEB_SHOPTHETHAO_API.DTO.Request
{
    public class ProductFilterRequest
    {
        public string? BrandIds { get; set; }   // "1,2,3"
        public string? SizeIds { get; set; }    // "1,2"
        public string? ColorIds { get; set; }   // "3,4"
        public decimal? MinPrice { get; set; }
        public decimal? MaxPrice { get; set; }
        public string? Keyword { get; set; }
    }
}
