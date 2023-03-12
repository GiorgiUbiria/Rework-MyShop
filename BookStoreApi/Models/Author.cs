namespace BookStoreApi.Models;
public class Author
{
    public long Id { get; set; }
    public string? Name { get; set; }
    public string? Surname { get; set; }
    public int BooksQuantity { get; set; }
    public bool CurrentlyActive { get; set; }
    public DateTime BirthDate { get; set; }
    public DateTime PassingDate { get; set; }
    public ICollection<Book>? Books { get; set; }
}