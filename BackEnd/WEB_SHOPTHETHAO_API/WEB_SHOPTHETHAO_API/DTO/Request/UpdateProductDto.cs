namespace WEB_SHOPTHETHAO_API.DTO.Request
{
    public class UpdateProductDto
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public int CategoryID { get; set; }
        public int BrandID { get; set; }
    }
}
