"use client";
import React, { FormEvent, useEffect, useRef, useState } from "react";
import Input from "@/app/components/Input";
import Button from "@/app/components/Button";
import { FormType } from "@/types/form";
import axios from "axios";
import { useAddPost } from "@/utils/useAddPost";
import { BsIncognito } from "react-icons/bs";
import toast, { Toaster } from "react-hot-toast";
import { formatTime } from "@/utils/FormatTime";
import { isOpenAgreement } from "@/utils/Overlay/Agreement";
import Agreement from "@/app/components/overlays/Agreement";
import { Capitalize } from "@/utils/Capitalize";
import { useSession } from "next-auth/react";
import { BiImageAdd } from "react-icons/bi";
import { getRemainingTime } from "@/utils/CountDown";
import { isOpenEdit, valueEdit } from "@/utils/Overlay/EditPost";
import { useRequest } from "ahooks";

const EditPost: React.FC<any> = ({
  data,
  mutate,
  setKeyword,
  keyword,
  postId,
}) => {
  let status = ["BUSY", "UNAUTHORIZED", "NEGATIVE", "ERROR", "FAILED"];
  const [hydrate, setHydrate] = useState<boolean>(false);
  const { data: session } = useSession();
  const { click, clicked } = useAddPost();
  const { openAgreement, agreementT } = isOpenAgreement();
  const edit = isOpenEdit();
  const editValue = valueEdit();
  const fileRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const initialData = {
    title: "",
    focus: "",
    content: "",
    anonymous: false,
    image: "",
  };

  const [post, setPostData] = useState<any>(initialData);
  const [states, setStates] = useState<any>(initialData);
  const [disabled, setDisabled] = useState<boolean>(false);

  function getPost(): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await axios.post("/api/post/get/specific", {
          postId: postId,
        });
        const data = response.data;
        if (data.ok) {
          resolve(data);
          toast.success("DATA RECEIENVE");
        } else reject(data);
      } catch (err) {
        reject(err);
      }
    });
  }

  const postReq = useRequest(() => getPost());

  useEffect(() => {
    setHydrate(true);
  }, []);

  useEffect(() => {
    if (postReq && postReq.data) {
      setPostData(postReq.data.post);
      setStates(postReq.data.post);
    }
  }, [postReq.data]);

  useEffect(() => {
    const isChanged = Object.keys(post).some(
      (key) => post[key] !== states[key]
    );
    setDisabled(!isChanged);
  }, [states]);

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

  const remove = () => {
    setStates({ ...states, image: "" });
    if (fileRef.current) return (fileRef.current.value = "");
  };

  const imageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      if (file.type.startsWith("image/")) {
        if (file.size <= 3 * 1024 * 1024) {
          try {
            const converted = await convertToBase64(file);
            setStates({
              ...states,
              image: converted as string | null,
            });
          } catch (err) {
            remove();

            toast.error("Error: Error Occured");
          }
        } else {
          remove();

          toast.error("File exceeds the maximum size of 3MB");
        }
      } else {
        remove();
        toast.error("Please select valid file format.");
      }
    }
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setStates({ ...states, [name]: value });
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
  };
  return (
    hydrate && (
      <div
        className="absolute top-0 left-0 w-full h-screen z-50 flex items-center justify-center overflow-hidden animate-fadeIn"
        style={{
          backgroundImage: `url("/bg.png")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {postReq.loading ? (
          <span className="loading loading-dots w-40 z-50"></span>
        ) : (
          <div className="w-full h-screen animate-fadeIn">
            <Toaster />
            {states.anonymous && openAgreement && (
              <Agreement setStates={setStates} states={states} />
            )}
            <div className="flex w-full h-full flex-wrap">
              <div className="flex flex-col justify-center w-1/2 pl-28 gap-20">
                <div className="text-5xl font-semibold">
                  Hello,{" "}
                  {session && Capitalize(session?.user?.name).split(" ")[0]}
                </div>
                <div className="flex items-center flex-col justify-center w-full">
                  <div className="font-bold text-7xl leading-snug w-5/12">
                    We care about what you think
                  </div>
                </div>
                <div className=" text-justify font-medium text-xl w-10/12">
                  You can share your thoughts anonymously by clicking the
                  anonymous icon and you can add photo if you want *maximum 1
                  photo only*
                </div>
              </div>
              {/* ----------------------------------------------------------------------------- */}
              <form
                onSubmit={onSubmit}
                className="w-1/2 h-full flex flex-col item-center p-2 px-10 gap-5"
                style={{ backgroundColor: "#DBD9D9" }}
                ref={formRef}
              >
                {/* -------------------------------------------------------------------------- */}
                <div className="w-full flex justify-end items-center">
                  <Button
                    label="Cancel"
                    type="button"
                    onClick={() => {
                      edit.close();
                      editValue.clear();
                      setStates(initialData);
                    }}
                    className="text-xl font-semibold"
                  />
                </div>
                {/* -------------------------------------------------------------------------- */}
                <Input
                  type="text"
                  name="title"
                  className="outline-none text-7xl w-full bg-transparent font-bold placeholder-black"
                  placeholder="Untitled"
                  onChange={handleChange}
                  maxLength={50}
                  required={true}
                  value={states.title}
                />

                {/* -------------------------------------------------------------------------- */}

                <div className="w-full flex gap-1 items-center">
                  <div className="text-5xl">Focus: </div>
                  <select
                    className="w-full text-3xl outline-none rounded-xl p-2 bg-transparent text-left"
                    name="focus"
                    onChange={handleChange}
                    value={states.focus}
                    required
                  >
                    <option value=""></option>
                    <option value="facility">Facility</option>
                    <option value="professor">Professor</option>
                    <option value="experience">Experience</option>
                    <option value="others">Others</option>
                  </select>
                </div>
                {/* -------------------------------------------------------------------------- */}
                <div className="flex items-center justify-center flex-col">
                  <textarea
                    placeholder="What's Happening now?"
                    name="content"
                    maxLength={500}
                    onChange={handleChange}
                    value={states.content}
                    className="resize-none w-full h-96 outline-none rounded-t-xl text-xl text-justify p-4"
                    required
                  />

                  <div className="w-full rounded-bl-xl rounded-br-xl bg-white p-2 flex items-center justify-between">
                    <div
                      className={`w-1/3 ${
                        states.image ? "animate-fadeIn" : "animate-fadeOut"
                      }`}
                    >
                      {states.image && "With Photo"}
                    </div>
                    <div>{states.content.length}/500</div>

                    <div className="w-1/3"></div>
                  </div>
                </div>
                {/* -------------------------------------------------------------------------- */}

                <div className="w-full flex items-center justify-end gap-4">
                  {/* -------------------------------------------------------------------------- */}
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    name="image"
                    className="hidden"
                    onChange={imageChange}
                  />

                  {states.image ? (
                    <button
                      type="button"
                      onClick={() => remove()}
                      className={`bg-red-600 rounded-xl p-1 text-white text-lg animate-fadeIn`}
                    >
                      Remove Photo
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => fileRef.current?.click()}
                      className="text-5xl flex items-center justify-center"
                    >
                      <BiImageAdd />
                    </button>
                  )}
                  {/* -------------------------------------------------------------------------- */}
                  <button
                    type="button"
                    onClick={() => {
                      setStates({ ...states, anonymous: !states.anonymous });
                      agreementT();
                    }}
                    className="text-4xl flex items-center justify-center"
                    aria-description="Button"
                  >
                    <BsIncognito
                      fill={states.anonymous ? "#706f6d" : "black"}
                    />
                  </button>

                  {/* -------------------------------------------------------------------------- */}

                  <button
                    type="submit"
                    className="text-2xl font-semibold"
                    style={{ cursor: disabled ? "not-allowed" : "pointer" }}
                    disabled={disabled}
                  >
                    {disabled ? "disabled" : "Post"}
                  </button>
                </div>

                {/* -------------------------------------------------------------------------- */}
              </form>
            </div>
          </div>
        )}
      </div>
    )
  );
};

export default EditPost;
