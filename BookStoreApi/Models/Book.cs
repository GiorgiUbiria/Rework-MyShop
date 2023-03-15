using System.ComponentModel.DataAnnotations.Schema;

namespace BookStoreApi.Models;
public class Book
{
    public long Id { get; set; }
    public string? BookName { get; set; }
    public string? BookAuthor { get; set; }
    public decimal BookPrice { get; set; }
    public int? BookQuantity { get; set; }
    public bool? IsAvailable { get; set; }
    public DateTime? BookCreationDate { get; set; }
    [NotMapped]
    public IFormFile? BookImage { get; set; }
    public string? BookImagePath { get; set; }
}