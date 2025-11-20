using System.ComponentModel.DataAnnotations;

namespace WEB_SHOPTHETHAO_API.DTO.Request
{
    public class LoginRequest
    {
        [Required]
        public string UserName { get; set; }

        [Required]
        public string Password { get; set; }

    }
}
