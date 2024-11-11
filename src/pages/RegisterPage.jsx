// import React from "react";
// import { Form, Link, redirect } from "react-router-dom";
// import FormInput from "../Components/FormInput";
// import SubmitButton from "../Components/SubmitButton";
// import axios from "axios";
// import { REGISTERURL } from "./data";
// import { toast } from "react-toastify";

// export const action = async ({ request }) => {
//   const formData = await request.formData();
//   const data = Object.fromEntries(formData);

//   try {
//     const response = await axios.post(REGISTERURL, data, {
//       headers: {
//         "Content-Type": "multipart/form-data",
//       },
//     });
//     console.log(response.data);
//     toast.success("Account created successfully");
//     return redirect("/login");
//   } catch (error) {
//     const errorMessage =
//       error?.response?.data?.error?.message || "Please check credentials";
//     console.log("error");
//     toast.error(errorMessage);
//     return null;
//   }
// };

// const RegisterPage = () => {
//   return (
//     <div className="flex items-center justify-center h-screen bg-gray-100">
//       <div className="w-full max-w-md p-8 space-y-4 bg-white rounded-lg shadow-md">
//         <h4 className="text-xl font-semibold text-center text-gray-800">
//           Register
//         </h4>
//         <Form method="post" className="space-y-4">
//           <FormInput label="Username" name="username" type="text" />
//           <FormInput label="Email" name="email" type="email" />
//           <FormInput label="Password" name="password" type="password" />
//           <SubmitButton text="Register" />
//         </Form>
//         <p className="text-center text-gray-600">
//           Already have an account?{" "}
//           <Link to="/login" className="text-blue-500 hover:underline">
//             Login here
//           </Link>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default RegisterPage;
