"use client";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast } from "sonner";
import { login } from "@/lib/api/auth";
export default function Login() {
  const router = useRouter();
  interface LoginValues {
    email: string;
    password: string;
  }

  const initialValues: LoginValues = {
    email: "",
    password: "",
  };
  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  const handleSubmit = async (values: LoginValues) => {
    try {
      const response = await login(values);

      if (response?.status == 200) {
        toast.success(response.data.message);
        router.push("/dashboard");
      }
    } catch (err) {
      console.error(err);
    } finally {
    }
  };
  return (
    <div className="min-h-screen bg-white px-4 md:px-6 py-6 flex items-center justify-center">
      <main className="flex flex-col items-center justify-center flex-1  text-center">
        <h1 className="text-3xl font-bold mb-6 text-[#2A586F]">
          <span className="relative inline-block">
            <span className="bg-[#f5c45a] absolute inset-x-0 bottom-1 sm:bottom-1 md:bottom-0 h-2 z-0"></span>
            <span className="relative z-10">Login</span>
          </span>
        </h1>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="bg-white shadow-md rounded-lg p-6 w-full max-w-md mt-4">
              {/* Email */}
              <div className="mb-4">
                <label className="block text-left text-sm font-semibold mb-1 text-[#313131]">
                  Email
                </label>
                <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
                  <Field
                    as={Input}
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 border-none focus-visible:ring-0 focus:outline-none rounded-none"
                  />
                </div>
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-red-500 text-sm mt-1 text-left"
                />
              </div>

              <div className="mb-6">
                <label className="block text-left text-sm font-semibold mb-1 text-[#313131]">
                  Password
                </label>
                <Field
                  as={Input}
                  name="password"
                  type="password"
                  placeholder="Enter Password"
                  className="w-full"
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-red-500 text-sm mt-1 text-left"
                />
              </div>

              {/* General Error */}
              <ErrorMessage
                name="general"
                component="div"
                className="text-red-600 text-sm mb-2 text-left"
              />

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#2A586F] hover:bg-[#234b5e] text-white font-semibold py-4 cursor-pointer"
              >
                {isSubmitting ? "Logging..." : "Login"}
              </Button>

              <p className="mt-4 text-sm text-center text-[#313131]">
                Not a user?{" "}
                <a
                  href="/register"
                  className="text-blue-600 font-medium hover:underline"
                >
                  Register Now
                </a>
              </p>
            </Form>
          )}
        </Formik>
      </main>
    </div>
  );
}
