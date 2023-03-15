import { Input } from "@mui/material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const MAX_FILE_SIZE = 500000;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

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
    bookImage: z
      .any()
      .refine(
        (files) => files?.[0]?.size <= MAX_FILE_SIZE,
        `Max image size is 5MB.`
      )
      .refine((files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type), {
        message: "Only .jpg, .jpeg, .png and .webp formats are supported.",
      }),
  })
  .required();

type FormData = z.infer<typeof schema>;

const AddBook = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: any) => {
    const formData = new FormData();
    formData.append("bookName", data.bookName);
    formData.append("bookAuthor", data.bookAuthor);
    formData.append("bookPrice", data.bookPrice);
    formData.append("bookImage", data.bookImage[0]);

    await fetch("http://localhost:5179/api/books", {
      method: "POST",
      body: formData,
    });
    console.log(data);
  };

  return (
    <div className="flex flex-col gap-2 items-center">
      <h1 className="text-4xl text-black text-center">Add a book</h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-1/2 flex flex-col gap-2 items-center"
      >
        <Input {...register("bookName")} className="border border-black mt-2" />
        {errors.bookName?.message && <p>{errors.bookName?.message}</p>}
        <Input {...register("bookAuthor")} className="border border-black" />
        {errors.bookAuthor?.message && <p>{errors.bookAuthor?.message}</p>}
        <Input {...register("bookPrice")} className="border border-black" />
        {errors.bookPrice?.message && <p>{errors.bookPrice?.message}</p>}
        <Input
          {...register("bookImage")}
          type="file"
          className="border border-black"
        />

        <button
          type="submit"
          className="w-1/3 hover:scale-105 bg-black text-white"
        >
          {" "}
          Submit
        </button>
      </form>
    </div>
  );
};

export default AddBook;
