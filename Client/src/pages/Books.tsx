import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";

const useBooks = () => {
  return useQuery({
    queryKey: ["books"],
    queryFn: async () => {
      const data = (await fetch(`http://localhost:5179/api/Books`)).json();
      console.log(data);

      return data;
    },
  });
};

const Books = () => {
  const { status, data, error, isFetching } = useBooks();

  if (error instanceof Error) {
    error;
  }

  const navigate = useNavigate();

  return (
    <div className="books_list w-full h-full flex flex-col gap-4">
      <h1 className="text-center text-4xl">Books</h1>
      <div className="flex flex-col">
        {status === "loading" ? (
          "Loading..."
        ) : status === "error" ? (
          <span>Error: {error.message} </span>
        ) : (
          <div className="flex flex-wrap gap-12 justify-evenly">
            {data.map((book: any, index: number) => (
              <div
                className="flex flex-col gap-2 justify-center items-center w-1/6 h-64 border-2 border-black"
                key={"book_" + index}
              >
                <h1 className="text-2xl text-balck"> {book.bookName} </h1>
                <h1 className="text-xl text-balck"> {book.bookAuthor} </h1>
                <h1> {book.bookPrice}$ </h1>
                <button
                  onClick={() => {
                    navigate({
                      to: "/books/$bookId",
                      params: { bookId: book.id },
                    });
                  }}
                >
                  {" "}
                  Edit a book{" "}
                </button>
              </div>
            ))}
            <div>{isFetching ? "Background Updating..." : " "}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Books;
