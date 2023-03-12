import { Input } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { json } from "react-router-dom";

const AddBook = () => {
  const { control, handleSubmit } = useForm({
    defaultValues: {
      bookName: "",
      bookAuthor: "",
      bookPrice: null,
    },
  });

  const onSubmit = async (data: any) => {
    await fetch("http://localhost:5179/api/books", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "content-type": "application/json",
      },
    });
    console.log(data);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      style={{ display: "flex", flexDirection: "column" }}
    >
      <Controller
        name="bookName"
        control={control}
        render={({ field }) => <Input {...field} />}
      />
      <Controller
        name="bookPrice"
        control={control}
        render={({ field }) => <Input {...field} />}
      />
      <Controller
        name="bookAuthor"
        control={control}
        render={({ field }) => <Input {...field} />}
      />
      <input type="submit" />
    </form>
  );
};

export default AddBook;
