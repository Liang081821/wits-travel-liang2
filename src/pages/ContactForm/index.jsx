import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import { submitContactForm } from "../../firebase/uploadForm";
import CarouselInForm from "./CarouselInForm";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function ContactForm() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors },
    control,
    reset,
  } = useForm({
    defaultValues: {
      purpose: "",
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
      replied: false,
    },
  });

  const selectOptions = [
    { value: "問題詢問", label: "問題詢問" },
    { value: "合作提案", label: "合作提案" },
    { value: "給予建議", label: "給予建議" },
  ];

  const onSubmit = async (data) => {
    try {
      await submitContactForm(data);
      console.log("Form Data:", data);
      setIsDialogOpen(true);
      reset();
    } catch (error) {
      console.error("Error submitting form: ", error);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="mt-[60px] w-full px-6 lg:px-8">
      <div className="flex w-full flex-col lg:mx-auto lg:h-fit lg:w-fit lg:flex-row">
        <div className="w-full lg:w-[500px]">
          <h1 className="mb-6 text-3xl font-bold lg:text-4xl">CONTACT US</h1>
          <h2 className="border-b-2 border-gray-300 pb-5 text-xl font-semibold tracking-wide lg:text-2xl">
            旅遊行程安排/諮詢
          </h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label className="mb-1 mt-5 block flex items-center text-lg font-medium lg:text-xl">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="mr-2 h-6 w-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 0 1-.982-3.172M9.497 14.25a7.454 7.454 0 0 0 .981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 0 0 7.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 0 0 2.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 0 1 2.916.52 6.003 6.003 0 0 1-5.395 4.972m0 0a6.726 6.726 0 0 1-2.749 1.35m0 0a6.772 6.772 0 0 1-3.044 0"
                  />
                </svg>
                表單主旨
                <span className="text-red-600">*</span>
              </label>

              <Input
                type="text"
                className={`mb-3 lg:text-lg ${errors.purpose ? "border-red-600" : "border-gray-300"}`}
                placeholder="簡述您的問題"
                {...register("purpose", {
                  required: "主旨是必填項",
                  pattern: {
                    value: /^.{1,20}$/,
                    message: "主旨長度不可超過20字",
                  },
                })}
                onBlur={() => trigger("purpose")}
              />

              <ErrorMessage
                errors={errors}
                name="purpose"
                render={({ message }) => (
                  <p className="mt-1 text-xs text-red-600 lg:text-lg">
                    {message}
                  </p>
                )}
              />
            </div>

            <div>
              <label className="mb-1 mt-5 block flex items-center text-lg font-medium lg:text-xl">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="mr-2 h-6 w-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                  />
                </svg>
                姓名
                <span className="text-red-600">*</span>
              </label>

              <Input
                type="text"
                className={`mb-3 lg:text-lg ${errors.name ? "border-red-600" : "border-gray-300"}`}
                placeholder="王小明"
                {...register("name", {
                  required: "姓名是必填項",
                  pattern: {
                    value: /^[\u4E00-\u9FA5A-Za-z]+$/,
                    message: "請輸入中文或英文姓名",
                  },
                })}
                onBlur={() => trigger("name")}
              />

              <ErrorMessage
                errors={errors}
                name="name"
                render={({ message }) => (
                  <p className="mt-1 text-xs text-red-600 lg:text-lg">
                    {message}
                  </p>
                )}
              />
            </div>

            <div>
              <label className="mb-1 mt-5 block flex items-center text-lg font-medium lg:text-xl">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="mr-2 h-6 w-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
                  />
                </svg>
                電子郵件
                <span className="text-red-600">*</span>
              </label>
              <Input
                className={`mb-3 lg:text-lg ${errors.email ? "border-red-600" : "border-gray-300"}`}
                type="text"
                placeholder="mail@mail.com"
                {...register("email", {
                  required: "電子郵件是必填項",
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|tw|org)$/,
                    message: "請輸入有效的電子郵件地址",
                  },
                })}
                onBlur={() => trigger("email")}
              />
              <ErrorMessage
                errors={errors}
                name="email"
                render={({ message }) => (
                  <p className="mt-1 text-xs text-red-600 lg:text-lg">
                    {message}
                  </p>
                )}
              />
            </div>

            <div>
              <label className="mb-1 mt-5 block flex items-center text-lg font-medium lg:text-xl">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="mr-2 h-6 w-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z"
                  />
                </svg>
                電話號碼
                <span className="text-red-600">*</span>
              </label>
              <Input
                className={`mb-3 lg:text-lg ${errors.phone ? "border-red-600" : "border-gray-300"}`}
                type="text"
                placeholder="09XXXXXXXX"
                {...register("phone", {
                  required: "電話號碼是必填項",
                  pattern: {
                    value: /^09\d{8}$/,
                    message: "請輸入有效的電話號碼 (09 開頭, 共 10 碼)",
                  },
                })}
                onBlur={() => trigger("phone")}
              />
              <ErrorMessage
                errors={errors}
                name="phone"
                render={({ message }) => (
                  <p className="mt-1 text-xs text-red-600 lg:text-lg">
                    {message}
                  </p>
                )}
              />
            </div>

            <div className="w-full">
              <label className="mb-1 mt-5 block flex items-center text-lg font-medium lg:text-xl">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="mr-2 h-6 w-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z"
                  />
                </svg>
                詢問主題
                <span className="text-red-600">*</span>
              </label>
              <Controller
                className="w-full"
                name="subject"
                control={control}
                rules={{ required: "請選擇類別" }}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    className="w-full lg:text-xl"
                    onBlur={() => trigger("subject")}
                  >
                    <SelectTrigger
                      className={`w-full lg:text-xl ${errors.subject ? "border-red-600" : "border-gray-300"}`}
                    >
                      <SelectValue placeholder="請選擇類別" />
                    </SelectTrigger>
                    <SelectContent>
                      {selectOptions.map((option) => (
                        <SelectItem
                          key={option.value}
                          value={option.value}
                          className="lg:text-lg"
                        >
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              <ErrorMessage
                errors={errors}
                name="subject"
                render={({ message }) => (
                  <p className="mt-1 text-xs text-red-600 lg:text-lg">
                    {message}
                  </p>
                )}
              />
            </div>

            <div>
              <label className="mb-1 mt-5 block flex items-center text-lg font-medium lg:text-xl">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="mr-2 h-6 w-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
                  />
                </svg>
                訊息內容
                <span className="text-red-600">*</span>
              </label>
              <Textarea
                placeholder="我想詢問關於XXX的旅遊行程資訊..."
                className={`h-40 lg:text-lg ${errors.message ? "border-red-600" : "border-gray-300"}`}
                as="textarea"
                {...register("message", { required: "訊息內容是必填項" })}
                onBlur={() => trigger("message")}
              />

              <ErrorMessage
                errors={errors}
                name="message"
                render={({ message }) => (
                  <p className="mt-1 text-xs text-red-600 lg:text-lg">
                    {message}
                  </p>
                )}
              />
            </div>
          </form>
        </div>
        <div className="ml-20 mt-6 hidden h-full w-auto flex-shrink-0 items-center justify-center lg:mt-0 lg:flex lg:flex-1">
          <CarouselInForm />
        </div>
      </div>
      <div className="mb-5 mt-3 flex w-full justify-center lg:mb-10 lg:mt-8">
        <Button
          type="submit"
          onClick={handleSubmit(onSubmit)}
          className="flex w-40 items-center justify-center bg-[#006c98] text-white hover:bg-[#1679a0] lg:w-52 lg:text-xl lg:tracking-wider"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="mr-2 h-6 w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15M12 9l3 3m0 0-3 3m3-3H2.25"
            />
          </svg>
          提交
        </Button>
      </div>

      <AlertDialog open={isDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-3xl">
              已收到您的諮詢表單
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xl">
              我們會儘速與您聯繫！
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              onClick={() => setIsDialogOpen(false)}
              className="text-xl"
            >
              確定
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
