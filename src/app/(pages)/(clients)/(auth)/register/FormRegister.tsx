// src/components/FormRegiter.tsx

/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";
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
  const [data, setData] = useState<any>(null); // Chứa data sau khi đăng ký thành công
  const [isResending, setIsResending] = useState(false);
  const [resetTimerSignal, setResetTimerSignal] = useState(0); // 💡 State báo hiệu reset timer (number)
  const validatorRef = useRef<typeof JustValidate | null>(null);

  // Hàm chuyển đổi form
  const toggleForm = (type: string) => {
    setActiveForm(type);
  };

  // --- HÀM XỬ LÝ GỬI LẠI EMAIL (Được truyền xuống ResendTimer) ---
  const handleResendEmail = () => {
    if (isResending) return; 

    setIsResending(true);

    //  GỌI API GỬI LẠI EMAIL (Thực hiện API call thực tế ở đây)
    setTimeout(() => {
      toast.success('Thông báo', { description: "Đã gửi lại liên kết xác minh mới!" });

      setIsResending(false);
      // 💡 Báo hiệu cho ResendTimer reset đồng hồ
      setResetTimerSignal(prev => prev + 1); 
    }, 2000);
  };

  // --- LOGIC JUSTVALIDATE ---
  useEffect(() => {
    if (validatorRef.current) {
      validatorRef.current = null;
    }

    const nameFieldId = activeForm === FormType.CANDIDATE ? "#fullNameCandidate" : "#companyName";
    const validator = new JustValidate("#registerForm");

    validator
      .addField(nameFieldId, [
        { rule: "required", errorMessage: activeForm === FormType.CANDIDATE ? "Vui lòng nhập họ tên của bạn!" : "Vui lòng nhập tên công ty!" },
        { rule: "minLength", value: 5, errorMessage: "Tên phải có ít nhất 5 ký tự!" },
        { rule: "maxLength", value: 50, errorMessage: "Tên không được vượt quá 50 ký tự!" },
      ])
      .addField("#email", [
        { rule: "required", errorMessage: "Vui lòng nhập email của bạn!" },
        { rule: "email", errorMessage: "Email không đúng định dạng!" },
      ])
      .addField("#password", [
        { rule: "required", errorMessage: "Vui lòng nhập mật khẩu!" },
        { validator: (value: string) => value.length >= 8, errorMessage: "Mật khẩu phải chứa ít nhất 8 ký tự!" },
        { validator: (value: string) => /[A-Z]/.test(value), errorMessage: "Mật khẩu phải chứa ít nhất một chữ cái in hoa!" },
        { validator: (value: string) => /[a-z]/.test(value), errorMessage: "Mật khẩu phải chứa ít nhất một chữ cái thường!" },
        { validator: (value: string) => /\d/.test(value), errorMessage: "Mật khẩu phải chứa ít nhất một chữ số!" },
        { validator: (value: string) => /[@$!%*?&]/.test(value), errorMessage: "Mật khẩu phải chứa ít nhất một ký tự đặc biệt!" },
      ])
   .onSuccess((event: any) => {
      event.preventDefault();
      handleRegisterSubmit(event);
    });
    
    validatorRef.current = validator;

    return () => { validatorRef.current = null; };
  }, [activeForm]); 

  // --- HÀM XỬ LÝ SUBMIT CHÍNH ---
  const handleRegisterSubmit = async (event: any) => {
    setIsResending(true);
    const target = event.target as HTMLFormElement;

    const nameFieldName = activeForm === FormType.CANDIDATE ? "fullNameCandidate" : "companyName";
    const fullNameValue = (target.elements.namedItem(nameFieldName) as HTMLInputElement).value;
    const email = (target.elements.namedItem("email") as HTMLInputElement).value;
    const password = (target.elements.namedItem("password") as HTMLInputElement).value;

    let dataFinal: any = { email: email, password: password };
    let apiUrl = activeForm === FormType.CANDIDATE 
        ? `${process.env.NEXT_PUBLIC_API_URL}/user/register` 
        : `${process.env.NEXT_PUBLIC_API_URL}/company/register`;

    if (activeForm === FormType.CANDIDATE) {
        dataFinal = { ...dataFinal, fullName: fullNameValue }; 
    } else {
        dataFinal = { ...dataFinal, companyName: fullNameValue }; 
    }

    try {
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dataFinal),
        });
        const data = await response.json();

      setIsResending(false);
      target.reset(); 

      if (data.code === "error") {
        toast.error('Lỗi', { description: `${data.message}` });
      } else if (data.code === "success") {
        toast.success('Thông báo', { description: `${data.message}` });
        setData(data); //  CHỈ SET DATA KHI THÀNH CÔNG (Khởi động Timer)
        setResetTimerSignal(prev => prev + 1); //  Kích hoạt reset timer
      }
    } catch (error) {
      setIsResending(false);
      target.reset();
      toast.error('Lỗi', { description: `Lỗi kết nối đến máy chủ. Xin vui lòng thử lại sau ít phút` });
      console.error("Lỗi Fetch API:", error);
    }
  };

  // --- COMPONENT HIỂN THỊ NỘI DUNG FORM ---
  const FormContent = ({ currentRole }: { currentRole: string }) => {
    const isCandidate = currentRole === FormType.CANDIDATE;
    const nameLabel = isCandidate ? "Họ tên *" : "Tên công ty *";
    const nameId = isCandidate ? "fullNameCandidate" : "companyName";

    return (
      <>
        <div className="h-[115px]">
          <label htmlFor={nameId} className="block font-[500] text-[14px] text-black mb-[5px]">{nameLabel}</label>
          <input
            type="text"
            name={nameId} 
            id={nameId}
            readOnly={isResending}
            className="w-[100%] h-[46px] border border-[#DEDEDE] rounded-[4px] py-[14px] px-[20px] font-[500] text-[14px] text-black shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
          />
        </div>
        <div className="h-[115px]">
          <label htmlFor="email" className="block font-[500] text-[14px] text-black ">Email *</label>
          <input
            readOnly={isResending}
            type="email"
            name="email"
            id="email"
            className="w-[100%] h-[46px] border border-[#DEDEDE] rounded-[4px] py-[14px] px-[20px] font-[500] text-[14px] text-black shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
          />
        </div>
        <PasswordInput isResending={isResending} idPassword="password" />
        
        {/* Liên kết chuyển đổi vai trò */}
        <p className="mt-2 text-sm"> 
            Đăng ký với vai trò 
            <button 
                type="button" 
                onClick={() => toggleForm(isCandidate ? FormType.COMPANY : FormType.CANDIDATE)}
                className="underline ml-1 cursor-pointer font-medium text-red-500 hover:text-red-700 transition"
            >
                {isCandidate ? 'Nhà tuyển dụng' : 'Ứng viên'}
            </button>
            ?
        </p>
        
        <div className="">
          <button 
            type="submit"
            className={`bg-[#0088FF] rounded-[4px] w-[100%] h-[48px] px-[20px] font-[700] text-[16px] text-white 
                ${isResending ? " bg-gray-400 text-gray-600 " : ""} `}
            disabled={isResending}
          >
            {isResending ? "Đang đăng ký..." : "Đăng ký"} 
          </button>
        </div>
      </>
    );
  };


  return (
    <>
      <Toaster richColors position="top-right" />
      
      <h2 className="text-xl font-extrabold text-center text-gray-900 mb-6">Đăng ký tài khoản</h2>

      {/* Thanh chuyển đổi Form (Toggle) */}
      <div className="flex  bg-gray-200 rounded-lg p-1 shadow-inner">
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

      <form
        id="registerForm"
        action=""
        className="h-auto"
      >
        <FormContent currentRole={activeForm} />
            
        {/* 💡 GỌI COMPONENT TIMER ĐÃ TỐI ƯU */}
        <ResendTimer 
            data={data} 
            handleResendEmail={handleResendEmail}
            shouldReset={resetTimerSignal}
        />

        <p className="mt-4 text-sm text-center"> 
            Bạn đã có tài khoản ? <Link href="/user/login" className="underline font-medium text-blue-500 hover:text-blue-700"> Đăng nhập ngay</Link>
        </p>
      </form>
    </>
  );
};