namespace BookStoreApi.Models;
public class Book
{
    public long Id { get; set; }
    public string? BookName { get; set; }
    public string? BookAuthor { get; set; }
    public int? BookPrice { get; set; }
    public int? BookQuantity { get; set; }
    public bool? IsAvailable { get; set; }
    public DateTime? BookCreationDate { get; set; }
}