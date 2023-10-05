import { FormProps, DataForm } from "@/types";
import axios from "axios";
import React, { ChangeEvent, useState, useRef } from "react";

const Form: React.FC<FormProps> = ({ mode, initialData, setOpen }) => {
  const [formData, setFormData] = useState<DataForm>(initialData);

  //const [currentImg, setImg] = useState<string | null>(formData.image ?? null);
  const [imgError, setImageError] = useState<string>("");
  const inputFileRef = useRef<HTMLInputElement>(null);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const checkboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: checked,
    }));
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file && file.size > 3 * 1024 * 1024) {
      setImageError("File exceed maximum size: 3MB");
      if (inputFileRef.current) {
        inputFileRef.current.value = "";
      }
      return;
    }

    if (file) {
      try {
        if (file.type.startsWith("image/")) {
          const base64String = await convertToBase64(file);

          setFormData((prev) => ({
            ...prev,
            image: base64String as string | null,
          }));
          setImageError("");
        } else {
          setImageError("Please select a valid image file.");
        }
      } catch (error) {
        console.error("Error converting image to base64:", error);
      }
    }
  };

  const convertToBase64 = async (file: File) => {
    return new Promise<string | ArrayBuffer | null>((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);

      fileReader.onload = () => {
        resolve(fileReader.result);
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };

  const RemovePhoto = () => {
    setFormData((prev) => ({ ...prev, image: null }));
    if (inputFileRef.current) {
      inputFileRef.current.value = "";
    }
  };

  const handleSubmit = async (e: ChangeEvent<HTMLFormElement>) => {
    if (mode === "add") {
      const response = await axios.post("/api/post/add", { formData });
      const data = response.data;

      console.log(data);

      if (data.success) {
        setOpen(false);
      }
    }
  };

  console.log(formData);
  return (
    <div className="w-full h-screen flex items-center justify-center fixed top-0 left-0 z-50 bg-slate-500/80">
      <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
        {imgError && <p className="text-red-500">{imgError}</p>}
        <p>{mode === "add" ? "Add FeedBack" : "Edit Post"}</p>
        <button type="button" onClick={() => setOpen(false)}>
          Close
        </button>

        <input
          type="text"
          name="title"
          placeholder="title"
          onChange={handleChange}
          required
        />

        <textarea
          placeholder="Let your voice be heard."
          name="content"
          onChange={handleChange}
          required
        />

        <select onChange={handleChange} name="concern" required>
          <option value="">Please Select</option>
          <option value="facility">Facility</option>
          <option value="student">Student</option>
          <option value="professor">Professor</option>
          <option value="etc">ETC</option>
        </select>

        <div>
          <p>Post as Anonymous? </p>
          <input type="checkbox" name="postAs" onChange={checkboxChange} />
        </div>

        <div>
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleImageChange}
            ref={inputFileRef}
          />
          <button type="button" onClick={RemovePhoto}>
            X
          </button>
        </div>

        <button type="submit">
          {mode === "add" ? "Add Post" : "Edit Post"}
        </button>
      </form>
    </div>
  );
};

export default Form;
