'use client'
import PasswordInput from '@/components/input/PasswordInput';
import { useSearchParams } from 'next/navigation';
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import { toast, Toaster } from 'sonner';


// Kiểu form đang được hiển thị
const FormType = {
    CANDIDATE: 'candidate',
    COMPANY: 'company'
};

const FormLogin = () => {
    // State quản lý form đang hiển thị
    const [activeForm, setActiveForm] = useState(FormType.CANDIDATE);
    const [isResending, setIsResending] = useState(false);
    const [message, setMessage] = useState<any|null>(null);
  const searchParams=useSearchParams();

  const userId=searchParams.get('userId');
  useEffect(()=>{
      if(userId)
      {
        toast.success('Thông báo', {
        description: `Verify thành công!`,
        duration: 3000, // Thông báo sẽ tự đóng sau 3 giây
      });
      }
  },[])
    
    const router = {
        push: (path:any) => console.log(`NAVIGATING TO: ${path}`),
    };

    // --- LOGIC VALIDATION TRÍCH XUẤT TỪ JustValidate ---
    // Hàm này mô phỏng lại toàn bộ các quy tắc validation của bạn
    const validateForm = (email:any, password:any) => {
        // 1. Kiểm tra Email
        if (!email || !/\S+@\S+\.\S+/.test(email)) {
            return 'Email không đúng định dạng!';
        }

        // 2. Kiểm tra Mật khẩu (Min 8 ký tự)
        if (!password) {
            return 'Vui lòng nhập mật khẩu!';
        }
        if (password.length < 8) {
            return 'Mật khẩu phải chứa ít nhất 8 ký tự!';
        }

        // 3. Kiểm tra chữ hoa
        if (!/[A-Z]/.test(password)) {
            return 'Mật khẩu phải chứa ít nhất một chữ cái in hoa!';
        }

        // 4. Kiểm tra chữ thường
        if (!/[a-z]/.test(password)) {
            return 'Mật khẩu phải chứa ít nhất một chữ cái thường!';
        }

        // 5. Kiểm tra chữ số
        if (!/\d/.test(password)) {
            return 'Mật khẩu phải chứa ít nhất một chữ số!';
        }

        // 6. Kiểm tra ký tự đặc biệt
        if (!/[@$!%*?&]/.test(password)) {
            return 'Mật khẩu phải chứa ít nhất một ký tự đặc biệt (@$!%*?&)!';
        }

        return null; // Không có lỗi
    };
    // --- KẾT THÚC LOGIC VALIDATION ---

    // Hàm xử lý validation và submit
    const handleLoginSubmit = async (e:any) => {
        e.preventDefault();
        setMessage(null);
        setIsResending(true);

        const formId = activeForm === FormType.CANDIDATE ? 'candidateLoginForm' : 'companyLoginForm';
       const form = document.getElementById(formId) as HTMLFormElement | null;
        let email=''
        let password=''
        if (form) {

            const formWithInputs = form as HTMLFormElement; 

             email= formWithInputs.email.value;
             password = formWithInputs.password.value;
        } else {
            console.error("Không tìm thấy form với ID:", formId);
        }
        // Bắt đầu Validation
        const validationError = validateForm(email, password);
        
        if (validationError) {
             setMessage({ type: 'error', text: validationError });
             setIsResending(false);
             return;
        }

        const dataFinal = { email, password };
        const endpoint = activeForm === FormType.CANDIDATE 
            ?` ${process.env.NEXT_PUBLIC_API_URL}/user/login` // Giả lập endpoint ứng viên
            : `${process.env.NEXT_PUBLIC_API_URL}/company/login` // Giả lập endpoint nhà tuyển dụng


        try {
        fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dataFinal),
          credentials: "include" // Giữ cookie
        })
          .then(res => res.json())
          .then(data => {
            setIsResending(false)
           setIsResending(false);

            if(data.code === "error") {
                toast.error('Lỗi', {
                description: `${data.message}`,
                duration: 3000, // Thông báo sẽ tự đóng sau 3 giây
              });
            }
            
            if(data.code === "success") {
                toast.success('Thông báo', { description: data.message || 'Đăng nhập thành công!' , duration: 3000, // Thông báo sẽ tự đóng sau 3 giây
                });
                router.push("/"); // Giả lập chuyển hướng
            }
           
          })
          .catch((error) => {
            setIsResending(false)
       
            console.error("Lỗi Fetch API:", error);
             toast.error('Lỗi', {
                description: "Đã xảy ra lỗi khi kết nối đến máy chủ. Vui lòng thử lại sau ít phút",
                duration: 3000, // Thông báo sẽ tự đóng sau 3 giây
              });
        });
        } catch (error) {
            setIsResending(false);
            console.error("Lỗi Fetch API:", error);
            toast.error('Lỗi', { description: "Đã xảy ra lỗi khi kết nối đến máy chủ. Vui lòng thử lại sau ít phút" });
        }
    };

    // Hàm chuyển đổi form
    const toggleForm = (type:string) => {
        setActiveForm(type);
        // Reset trạng thái khi chuyển form
        setIsResending(false);
        setMessage(null);
    };

    // Component dùng chung cho cả hai form (để tránh lặp lại cấu trúc HTML)
    const CommonForm = ({ id, onSubmit, isResending, type }:{id:string,onSubmit:(e:any)=>void,isResending:boolean,type:string}) => (
        <form id={id} onSubmit={onSubmit} className="grid grid-cols-1 gap-y-[15px]">
            <div className="">
                <label htmlFor="email" className="block font-[500] text-[14px] text-black mb-[5px]">
                    Email *
                </label>
                <input 
                    readOnly={isResending}
                    type="email" 
                    name="email" 
                    id="email" 
                    // THÊM HIỆU ỨNG INPUT MỚI
                    className="w-[100%] h-[46px] border border-[#DEDEDE] rounded-[4px] py-[14px] px-[20px] font-[500] text-[14px] text-black shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                    required
                />
            </div>
            
            <PasswordInput  isResending={isResending} />

            <div className="">
                <button 
                    type="submit"
                    className={`bg-[#0088FF] rounded-[4px] w-[100%] h-[48px] px-[20px] font-[700] text-[16px] text-white 
                    ${isResending ? " bg-gray-400 text-gray-600 " : ""} `}
                    disabled={isResending}
                >
                    {isResending ? "Đang đăng nhập..." : "Đăng nhập"} 
                </button>
            </div>
            
            {/* Các liên kết điều hướng */}
            {type === FormType.CANDIDATE && (
                <p> 
                    Bạn chưa có tài khoản ? 
                    {/* Thay Link bằng thẻ a tiêu chuẩn */}
                    <a href="/register" className="underline ml-1 cursor-pointer hover:text-blue-500"> 
                        Đăng ký tài khoản ngay
                    </a>
                </p>
            )}

            <p> 
                Bạn là {type === FormType.CANDIDATE ? 'nhà tuyển dụng' : 'ứng viên'} ? 
                {/* Thay Link bằng Button để thực hiện chuyển đổi trạng thái */}
                <button 
                    type="button" 
                    onClick={() => toggleForm(type === FormType.CANDIDATE ? FormType.COMPANY : FormType.CANDIDATE)}
                    className="underline ml-1 cursor-pointer font-medium text-red-500 hover:text-red-700 transition"
                >
                    Đăng nhập với vai trò {type === FormType.CANDIDATE ? 'là nhà tuyển dụng' : 'ứng viên'}
                </button>
            </p>
        </form>
    );

    return (
        <>
           <Toaster richColors position="top-right" />
              <div className="flex items-center justify-center my-[2%] p-4 font-sans">

            <div className="w-full max-w-xl bg-white p-8 rounded-2xl shadow-2xl border border-gray-200">
                <h2 className="text-xl font-extrabold text-center text-gray-900 mb-6">
                    Đăng nhập 
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
                
                {/* Thông báo (Mô phỏng Toast/Thông báo lỗi validation) */}
                {message && (
                    <div className={`mb-4 p-3 rounded-lg shadow-sm text-sm font-medium ${message.type === 'error' ? 'bg-red-100 text-red-700 border border-red-400' : 'bg-green-100 text-green-700 border border-green-400'}`}>
                        {message.text}
                    </div>
                )}
                
                {/* Vùng Form với Hiệu ứng Chuyển đổi (Fade Transition) */}
                <div className="relative overflow-hidden min-h-[300px]"> {/* Thêm min-h để tránh bị co lại khi chuyển đổi */}
                    {/* Form Ứng viên */}
                    <div className={`transition-opacity duration-500 ${activeForm === FormType.CANDIDATE ? 'opacity-100 relative' : 'opacity-0 absolute top-0 left-0 w-full pointer-events-none'}`}>
                        <CommonForm 
                            id="candidateLoginForm" 
                            onSubmit={handleLoginSubmit} 
                            isResending={isResending && activeForm === FormType.CANDIDATE} 
                            type={FormType.CANDIDATE}
                        />
                    </div>
                    
                    {/* Form Nhà tuyển dụng */}
                    <div className={`transition-opacity duration-500 ${activeForm === FormType.COMPANY ? 'opacity-100 relative' : 'opacity-0 absolute top-0 left-0 w-full pointer-events-none'}`}>
                        <CommonForm 
                            id="companyLoginForm" 
                            onSubmit={handleLoginSubmit} 
                            isResending={isResending && activeForm === FormType.COMPANY} 
                            type={FormType.COMPANY}
                        />
                    </div>
                </div>
            </div>
        </div>
           </>
     
    );
};

export default FormLogin;