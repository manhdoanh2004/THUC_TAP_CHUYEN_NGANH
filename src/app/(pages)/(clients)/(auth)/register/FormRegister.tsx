"use client";
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */

import PasswordInput from "@/components/input/PasswordInput";
import ResendTimer from "@/components/ResendTimer";
import JustValidate from "just-validate";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { toast, Toaster } from "sonner";

// Định nghĩa kiểu Form
const FormType = {
  CANDIDATE: 'candidate',
  COMPANY: 'company'
};

export const FormRegiter = () => {
  const [activeForm, setActiveForm] = useState(FormType.CANDIDATE);
  const [data, setData] = useState<any>(null); 
  const [isResending, setIsResending] = useState(false);
  const [resetTimerSignal, setResetTimerSignal] = useState(0); 
  const validatorRef = useRef<typeof JustValidate | null>(null);

  // Hàm chuyển đổi form
  const toggleForm = (type: string) => {
    setActiveForm(type);
    setIsResending(false);
  };

  // --- HÀM XỬ LÝ GỬI LẠI EMAIL ---
  const handleResendEmail =  async (event: any) => {
    if (isResending) return; 
    setIsResending(true);
     const form = event.target as HTMLFormElement;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
      try {
      const response = await fetch(` ${process.env.NEXT_PUBLIC_API_URL}/user/resend`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({email:email}),
      });
      const resData = await response.json();

      setIsResending(false);
      if (resData.code === "error") {
        toast.error('Lỗi', { description: resData.message });
      } else {
          toast.success('Thông báo', { description: "Đã gửi lại liên kết xác minh mới!" });
      setIsResending(false);
      setResetTimerSignal(prev => prev + 1); 
        form.reset();
      }
    } catch (error) {
      setIsResending(false);
      toast.error('Lỗi', { description: "Lỗi kết nối máy chủ!" });
    }
   
  };

  // --- LOGIC JUSTVALIDATE ---
  useEffect(() => {
    const formId = "#registerForm";
    const nameFieldId = activeForm === FormType.CANDIDATE ? "#fullNameCandidate" : "#companyName";
    
    const validator = new JustValidate(formId);

    validator
      .addField(nameFieldId, [
        { rule: "required", errorMessage: activeForm === FormType.CANDIDATE ? "Vui lòng nhập họ tên của bạn!" : "Vui lòng nhập tên công ty!" },
        { rule: "minLength", value: 5, errorMessage: "Tên phải có ít nhất 5 ký tự!" },
      ])
      .addField("#email", [
        { rule: "required", errorMessage: "Vui lòng nhập email của bạn!" },
        { rule: "email", errorMessage: "Email không đúng định dạng!" },
      ])
      .addField("#password", [
        { rule: "required", errorMessage: "Vui lòng nhập mật khẩu!" },
        { validator: (value: string) => value.length >= 8, errorMessage: "Mật khẩu ít nhất 8 ký tự!" },
      ])
      .onSuccess((event: any) => {
        handleRegisterSubmit(event);
      });
    
    validatorRef.current = validator;
    return () => { validatorRef.current = null; };
  }, [activeForm]); 

  const handleRegisterSubmit = async (event: any) => {
    setIsResending(true);
    const form = event.target as HTMLFormElement;
    
    const nameFieldName = activeForm === FormType.CANDIDATE ? "fullNameCandidate" : "companyName";
    const fullNameValue = (form.elements.namedItem(nameFieldName) as HTMLInputElement).value;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const password = (form.elements.namedItem("password") as HTMLInputElement).value;

    let dataFinal: any = { 
        email, 
        password, 
        [activeForm === FormType.CANDIDATE ? 'fullName' : 'companyName']: fullNameValue 
    };

    let apiUrl = activeForm === FormType.CANDIDATE 
        ? `${process.env.NEXT_PUBLIC_API_URL}/user/register` 
        : `${process.env.NEXT_PUBLIC_API_URL}/company/register`;

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataFinal),
      });
      const resData = await response.json();

      setIsResending(false);
      if (resData.code === "error") {
        toast.error('Lỗi', { description: resData.message });
      } else {
        toast.success('Thông báo', { description: resData.message });
        setData(resData);
        setResetTimerSignal(prev => prev + 1);
        form.reset();
      }
    } catch (error) {
      setIsResending(false);
      toast.error('Lỗi', { description: "Lỗi kết nối máy chủ!" });
    }
  };

  return (
    <>
      <Toaster richColors position="top-right" />
     
        <div className="w-full max-w-xl bg-white p-8 rounded-2xl shadow-2xl border border-gray-200">
          <h2 className="text-xl font-extrabold text-center text-gray-900 mb-6">
            Đăng ký 
          </h2>

          {/* Thanh chuyển đổi Form (Toggle) */}
          <div className="flex mb-8 bg-gray-200 rounded-lg p-1 shadow-inner">
            <button
              onClick={() => toggleForm(FormType.CANDIDATE)}
              className={`w-1/2 py-2 text-sm font-semibold rounded-lg transition-all duration-300 ${
                activeForm === FormType.CANDIDATE ? 'bg-white shadow-md text-blue-600' : 'text-gray-600 hover:text-blue-500'
              }`}
            >
              Ứng viên
            </button>
            <button
              onClick={() => toggleForm(FormType.COMPANY)}
              className={`w-1/2 py-2 text-sm font-semibold rounded-lg transition-all duration-300 ${
                activeForm === FormType.COMPANY ? 'bg-white shadow-md text-blue-600' : 'text-gray-600 hover:text-blue-500'
              }`}
            >
              Nhà tuyển dụng
            </button>
          </div>

          {/* Vùng Form với Hiệu ứng Chuyển đổi */}
          <div className="relative overflow-hidden min-h-[400px]">
            <form id="registerForm" className="grid grid-cols-1 gap-y-[15px] mx-[5px]">
              {/* Trường Tên (Họ tên hoặc Tên công ty) */}
              <div>
                <label htmlFor={activeForm === FormType.CANDIDATE ? "fullNameCandidate" : "companyName"} className="block font-[500] text-[14px] text-black mb-[5px]">
                  {activeForm === FormType.CANDIDATE ? "Họ tên *" : "Tên công ty *"}
                </label>
                <input
                  type="text"
                  name={activeForm === FormType.CANDIDATE ? "fullNameCandidate" : "companyName"}
                  id={activeForm === FormType.CANDIDATE ? "fullNameCandidate" : "companyName"}
                  readOnly={isResending}
                  className="w-[100%] h-[46px] border border-[#DEDEDE] rounded-[4px] py-[14px] px-[20px] font-[500] text-[14px] text-black shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                />
              </div>

              {/* Trường Email */}
              <div>
                <label htmlFor="email" className="block font-[500] text-[14px] text-black mb-[5px]">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  readOnly={isResending}
                  className="w-[100%] h-[46px] border border-[#DEDEDE] rounded-[4px] py-[14px] px-[20px] font-[500] text-[14px] text-black shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                />
              </div>

              {/* Trường Mật khẩu */}
              <PasswordInput isResending={isResending} idPassword="password" />

              {/* Nút Đăng ký */}
              <div className="mt-2">
                <button
                  type="submit"
                  disabled={isResending}
                  className={`bg-[#0088FF] rounded-[4px] w-[100%] h-[48px] px-[20px] font-[700] text-[16px] text-white transition-all
                    ${isResending ? "bg-gray-400 cursor-not-allowed" : "hover:bg-blue-600 shadow-lg"}`}
                >
                  {isResending ? "Đang xử lý..." : "Đăng ký"}
                </button>
              </div>

              {/* Timer gửi lại email */}
              <ResendTimer 
                data={data} 
                handleResendEmail={handleResendEmail}
                shouldReset={resetTimerSignal}
              />

              {/* Điều hướng */}
              <div className="space-y-2 pt-2">
                <p className="text-sm">
                  Bạn là {activeForm === FormType.CANDIDATE ? 'nhà tuyển dụng' : 'ứng viên'}? 
                  <button
                    type="button"
                    onClick={() => toggleForm(activeForm === FormType.CANDIDATE ? FormType.COMPANY : FormType.CANDIDATE)}
                    className="underline ml-1 font-medium text-red-500 hover:text-red-700 transition"
                  >
                    Đăng ký với vai trò {activeForm === FormType.CANDIDATE ? 'Nhà tuyển dụng' : 'Ứng viên'}
                  </button>
                </p>
                <p className="text-sm">
                  Bạn đã có tài khoản? 
                  <Link href="/login" className="underline ml-1 font-medium text-blue-500 hover:text-blue-700">
                    Đăng nhập ngay
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
    
    </>
  );
};

export default FormRegiter;