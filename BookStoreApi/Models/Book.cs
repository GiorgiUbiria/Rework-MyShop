using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BookStoreApi.Models;
public class Book
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public long Id { get; set; }
    public string? BookName { get; set; }
    public string? BookAuthor { get; set; }
    public decimal BookPrice { get; set; }
    public int? BookQuantity { get; set; }
    public bool? IsAvailable { get; set; }
    public int BookCreationYear { get; set; }
    [NotMapped]
    public IFormFile? BookImage { get; set; }
    public string? BookImagePath { get; set; }
}