import { useMutation, useQuery } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";
import { Input } from "@mui/material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const schema = z
  .object({
    bookName: z
      .string({
        required_error: "Book name is required",
        invalid_type_error: "Book name must be a string",
      })
      .min(5, { message: "Must be 5 or more characters long" }),
    bookPrice: z
      .string({
        required_error: "Book price is required",
        invalid_type_error: "Book price must be a number",
      })
      .refine(
        (val) => {
          const num = Number(val);
          return !isNaN(num) && num >= 0;
        },
        { message: "Book price must be a valid number" }
      )
      .transform((val) => Number(val)),
    bookAuthor: z
      .string({
        required_error: "Book author's name is required",
        invalid_type_error: "Book author's name must be a string",
      })
      .min(3, { message: "Must be 3 or more characters long" }),
  })
  .required();

type FormData = z.infer<typeof schema>;

const useBook = () => {
  const params = useParams({
    from: "/books/$bookId",
  });

  return useQuery({
    queryKey: ["book"],
    queryFn: async () => {
      const data = (
        await fetch(`http://localhost:5179/api/books/${params.bookId}`)
      ).json();
      return data;
    },
  });
};

const Book = () => {
  const params = useParams({
    from: "/books/$bookId",
  });

  const mutation = useMutation({
    mutationFn: (book: any) => {
      console.log(book);

      return fetch(`http://localhost:5179/api/books/${params.bookId}`, {
        method: "PATCH",
        body: JSON.stringify(book),
        headers: {
          "content-type": "application/json-patch+json",
        },
      });
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const { status, data, error, isFetching } = useBook();

  if (error instanceof Error) {
    error;
  }

  const onSubmit = (data: any) => {
    const patchDoc = [
      {
        path: "/bookName",
        op: "replace",
        value: "aFrikca2",
      },
      {
        path: "/bookAuthor",
        op: "replace",
        value: "aFrikceli",
      },
      {
        path: "/bookPrice",
        op: "replace",
        value: 25,
      },
    ];

    mutation.mutate(patchDoc);
  };

  return (
    <div className="books_list w-full h-full flex flex-col gap-4">
      <div className="flex flex-col">
        {status === "loading" ? (
          "Loading..."
        ) : status === "error" ? (
          <span>Error: {error.message} </span>
        ) : (
          <div className="flex justify-center">
            <div className="flex flex-col gap-2 items-center">
              <h1 className="text-4xl text-black text-center">Add a book</h1>
              <form
                className="flex flex-col gap-2 items-center"
                onSubmit={handleSubmit(onSubmit)}
              >
                <Input
                  {...register("bookName")}
                  className="border border-black mt-2"
                  placeholder={data.bookName}
                />
                {errors.bookName?.message && <p>{errors.bookName?.message}</p>}
                <Input
                  {...register("bookAuthor")}
                  className="border border-black"
                  placeholder={data.bookAuthor}
                />
                {errors.bookAuthor?.message && (
                  <p>{errors.bookAuthor?.message}</p>
                )}
                <Input
                  {...register("bookPrice")}
                  className="border border-black"
                  placeholder={data.bookPrice.toString()}
                />
                {errors.bookPrice?.message && (
                  <p>{errors.bookPrice?.message}</p>
                )}
                <button
                  type="submit"
                  className="w-1/3 hover:scale-105 bg-black text-white"
                >
                  {" "}
                  Save Changes
                </button>
              </form>
            </div>

            <div>{isFetching ? "Background Updating..." : " "}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Book;
