import * as z from "zod";
import { courseSchema } from "@/types/auth/userauth";
import { ChevronLeft, ImageUp, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";

import { CREATE_COURSE, IMAGE_UPLOAD } from "@/utils/constants";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";
import instructorApiClient from "@/utils/instructorauth";

const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await instructorApiClient.post(IMAGE_UPLOAD, formData);

  if (response.status !== 200) {
    throw new Error("Image upload failed");
  }

  const data = await response.data;
  return data.url;
};

const CreateCourse = ({ setCreate }) => {
  const [imageUrl, setImageUrl] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [languages, setTags] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [imageUploadLoad, setImageLoad] = useState(false);

  const form = useForm({
    resolver: zodResolver(courseSchema),
  });

  const { watch, reset } = form;
  const { errors } = form.formState;

  const title = watch("title");
  const description = watch("description");
  const domain = watch("domain");

  useEffect(() => {
    const isFormValid = !!(title && description && domain && imageUrl !== "");
    setIsValid(isFormValid);
  }, [title, description, domain, imageUrl]);

  const handleTagInput = (event) => {
    if (event.key === 'Enter' && event.currentTarget.value.trim() !== '') {
      event.preventDefault();
      const newTag = event.currentTarget.value.trim();
      if (!languages.includes(newTag)) {
        setTags([...languages, newTag]);
        event.currentTarget.value = '';
      }
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(languages.filter(language => language !== tagToRemove));
  };

  const onSubmit = async (values) => {
    const courseData = {
      title: values.title,
      price: values.price,
      imageurl: values.imageurl,
      description: values.description,
      tags: {
        domain: values.domain,
        languages: languages.map((language) => ({ name: language }))
      }
    };

    try {
      setIsLoading(true);
      const response = await instructorApiClient.post(CREATE_COURSE, courseData);
      if (response.status === 201) {
        toast.success("Course Created successfully");
      }
      reset();
      setImageUrl("");
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      toast.error("Course creation unsuccessful");
      setIsLoading(false);
    }
  };

  const handleFileChange = async (event) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setImageFile(file);
      setImageLoad(true);

      try {
        const imageUrl = await uploadImage(file);
        setImageUrl(imageUrl);
        form.setValue("imageurl", imageUrl);
        setImageLoad(false);
      } catch (error) {
        console.error("Error uploading image:", error);
        setImageLoad(false);
      }
    }
  };

  return (
    <section className="mt-3">
      {imageUploadLoad && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-10">
          <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      <button
        onClick={() => setCreate(false)}
        className="border px-3 py-2 bg-purple-50 shadow-sm rounded-md text-neutral-600 text-sm flex items-center space-x-2"
      >
        <ChevronLeft size={18} />
        Back
      </button>

      <div className="mt-12">
        <form onSubmit={form.handleSubmit(onSubmit)} className="gap-5">
          <div className="grid grid-cols-2 gap-5 items-center">
            {/* Title */}
            <div className="flex flex-col space-y-2">
              <label htmlFor="title" className="text-sm ">
                <span className="font-semibold text-purple-600"> Name</span> of
                the Course
              </label>
              <input
                autoFocus
                id="title"
                placeholder="MERN Stack , React Begin . . ."
                type="text"
                {...form.register("title")}
                className="border w-3/5 px-3 py-2 border-neutral-400 focus:outline-purple-500 rounded-md transition delay-200 "
              />
              {errors.title && (
                <p className="text-xs text-red-500">{errors.title.message}</p>
              )}
            </div>

            {/* Price */}
            <div className="flex flex-col space-y-2">
              <label htmlFor="price" className="text-sm ">
                <span className="font-semibold text-purple-600"> Price </span> of
                the Course
              </label>
              <input
                autoFocus
                id="price"
                placeholder="0 / 500"
                type="text"
                {...form.register("price")}
                className="border w-3/5 px-3 py-2 border-neutral-400 focus:outline-purple-500 rounded-md transition delay-200 "
              />
              {errors.price && (
                <p className="text-xs text-red-500">{errors.price.message}</p>
              )}
            </div>
            {/* Description */}
            <div className="flex flex-col space-y-2">
              <label htmlFor="description" className="text-sm ">
                <span className="font-semibold text-purple-600">
                  Description
                </span>{" "}
                for your course
              </label>
              <input
                type="text"
                id="description"
                placeholder="Unlock the power of full-stack . . ."
                {...form.register("description")}
                className="border transition delay-200 w-3/5 px-3 py-2 border-neutral-400 focus:outline-purple-500 rounded-md"
              />
              {errors.description && (
                <p className="text-xs text-red-500">
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* Domain */}
            <div className="flex flex-col space-y-2">
              <label htmlFor="domain" className="text-sm ">
                <span className="font-semibold text-purple-600">Domain </span>{" "}
                of your field
              </label>
              <input
                type="text"
                id="domain"
                placeholder="AI, ML , Full Stack . . . ."
                {...form.register("domain")}
                className="border transition delay-200 w-3/5 px-3 py-2 border-neutral-400 focus:outline-purple-500 rounded-md"
              />
              {errors.domain && (
                <p className="text-xs text-red-500">{errors.domain.message}</p>
              )}
            </div>

            {/* Tags */}
            <div className="flex flex-col space-y-2 ">
              <label htmlFor="languages" className="text-sm ">
                <span className="font-semibold text-purple-600">Languages </span> used
                in your course
              </label>
              <input
                type="text"
                id="languages"
                placeholder="Type and press Enter to add languages used "
                onKeyPress={handleTagInput}
                className="border transition delay-200 w-3/5 px-3 py-2 border-neutral-400 focus:outline-purple-500 rounded-md"
              />
              <div className="flex flex-wrap gap-2 mt-2">
                {languages.map((language, index) => (
                  <span key={index} className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center">
                    {language}
                    <button type="button" onClick={() => removeTag(language)} className="ml-1 text-purple-600 hover:text-purple-800">
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="flex flex-col space-y-2 mt-6">
            <label htmlFor="fileInput" className="text-sm">
              Upload an{" "}
              <span className="font-semibold text-purple-600">Image</span> for
              the course
            </label>
            <input
              id="fileInput"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            {imageUrl !== "" ? (
              <div className="w-[30%] h-64 rounded-md relative">
                <img src={imageUrl} alt={'Image'} className="object-cover absolute h-full w-full rounded-md" />
              </div>
            ) : (
              <div
                className="w-[30%] border h-36 rounded-md bg-purple-400 backdrop-blur-md shadow-sm border-dotted p-2 border-neutral-400 flex justify-center items-center text-white cursor-pointer"
                onClick={() => document.getElementById("fileInput")?.click()}
              >
                <div className="backdrop-blur-md border-white/20 w-full flex items-center justify-center h-full  rounded-lg bg-white/30">
                  <ImageUp size={40} />
                </div>
              </div>
            )}
          </div>

          <input type="hidden" {...form.register("imageurl")} />

          <button
            className={cn(
              "px-8 py-2 mt-8 rounded-full bg-purple-600 text-white w-fit",
              !isValid && "opacity-50 cursor-not-allowed"
            )}
            disabled={!isValid || isLoading}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Creating
              </div>
            ) : (
              <>Create</>
            )}
          </button>
        </form>
      </div>
    </section>
  );
};

export default CreateCourse;
