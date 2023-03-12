import { useQuery } from "@tanstack/react-query";

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

  return (
    <>
      <h1>Books</h1>
      <div>
        {status === "loading" ? (
          "Loading..."
        ) : status === "error" ? (
          <span>Error: {error.message} </span>
        ) : (
          <>
            <div style={{ height: "500px" }}>
              {data.length !== 0
                ? data.map((book: any, index: number) => (
                    <h1 key={index} style={{ color: "white" }}>
                      {book.bookName}
                    </h1>
                  ))
                : "Data is empty"}
            </div>
            <div>{isFetching ? "Background Updating..." : " "}</div>
          </>
        )}
      </div>
    </>
  );
};

export default Books;
