import { z } from 'zod'; // Use ES module import for zod

const emailSchema = z.string().email();
const passwordSchema = z.string().regex(
  new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])[a-zA-Z\d!@#$%^&*]{8,}$/),
  "Password must be 8 characters long"
);

const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema
});

const registerSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: passwordSchema
}).refine((object) => object.password === object.confirmPassword, {
  message: "Passwords do not match"
});

const courseSchema = z.object({
  price: z.coerce.number({
    message: "Price is required"
  }).min(0, { message: "Please enter a price" }),
  title: z.string({
    message: "Course title is required"
  }).min(10, { message: "Course title should be at least 10 characters" }),
  description: z.string({
    message: "Course description is required"
  }).min(20, {
    message: "Description should be at least 20 characters"
  }),
  domain: z.string({
    message: "Domain or Category of the course is required"
  }).min(5, {
    message: "Domain should be at least 5 characters"
  }),
  imageurl: z.string({
    message: "Image is required!"
  }).min(10, {
    message: "Image needs to be uploaded"
  })
});

const editProfileSchema = z.object({
  username: z.string({
    message: "Please enter your username"
  }).min(5, { message: "Username must be minimum 5 characters" }),
  age: z.coerce.number({
    message: "Age is required"
  }).min(0, { message: "Users should be at least 15 years old" }).transform((value) => Number(value)),
  contactNumber: z.coerce.number({
    message: "Contact number is required"
  }).min(10, {
    message: "Contact number should be at least 10 characters"
  }).transform((value) => Number(value))
});

// Exporting all schemas using ES module export syntax
export {

    emailSchema,
    passwordSchema,
  loginSchema,
  registerSchema,
  courseSchema,
  editProfileSchema
};
