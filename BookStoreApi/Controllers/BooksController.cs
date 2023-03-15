using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BookStoreApi.Models;
using Microsoft.AspNetCore.JsonPatch;

namespace BookStoreApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BooksController : ControllerBase
    {
        private readonly BookContext _context;

        public BooksController(BookContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Book>>> GetBooks()
        {
            if (_context.Books == null)
            {
                return NotFound();
            }
            return await _context.Books.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Book>> GetBook(long id)
        {
            if (_context.Books == null)
            {
                return NotFound();
            }
            var book = await _context.Books.FindAsync(id);

            if (book == null)
            {
                return NotFound();
            }

            return book;
        }

        [HttpPatch("{id}")]
        public async Task<IActionResult> PatchBook(long id, [FromBody] JsonPatchDocument<Book> patchDoc)
        {
            if (patchDoc == null)
            {
                return BadRequest();
            }

            var book = await _context.Books.FindAsync(id);
            if (book == null)
            {
                return NotFound();
            }

            patchDoc.ApplyTo(book, ModelState);

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!BookExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }


        [HttpPost]
        public async Task<ActionResult<Book>> PostBook([FromForm] Book book)
        {
            if (_context.Books == null)
            {
                return Problem("Entity set 'BookContext.Books'  is null.");
            }

            if (book.BookImage != null && book.BookImage.Length > 0)
            {
                var fileName = Guid.NewGuid().ToString() + Path.GetExtension(book.BookImage.FileName);
                var filePath = Path.Combine("uploads", fileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await book.BookImage.CopyToAsync(stream);
                }

                book.BookImagePath = filePath;
            }

            book.IsAvailable = true;
            book.BookCreationDate = DateTime.Today;
            book.BookQuantity = 1;

            var existingBook = await _context.Books
                .FirstOrDefaultAsync(b => b.BookName == book.BookName && b.BookAuthor == book.BookAuthor);

            if (existingBook != null)
            {
                existingBook.BookQuantity++;
                await _context.SaveChangesAsync();
                return CreatedAtAction("GetBook", new { id = existingBook.Id }, existingBook);
            }

            _context.Books.Add(book);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetBook", new { id = book.Id }, book);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBook(long id)
        {
            if (_context.Books == null)
            {
                return NotFound();
            }
            var book = await _context.Books.FindAsync(id);
            if (book == null)
            {
                return NotFound();
            }

            _context.Books.Remove(book);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool BookExists(long id)
        {
            return (_context.Books?.Any(e => e.Id == id)).GetValueOrDefault();
        }
    }
}
