'use client'
import PasswordInput from '@/components/input/PasswordInput';
import JustValidate from 'just-validate';
import { useRouter, useSearchParams } from 'next/navigation';
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect, useRef } from 'react';
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
const validatorRef = useRef<typeof JustValidate | null>(null);
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
    
     const router = useRouter()

useEffect(() => {
        // 1. Dọn dẹp validator cũ trước khi khởi tạo cái mới (nếu có)
        // JustValidate không có phương thức destroy chính thức, 
        // nhưng chúng ta có thể đảm bảo nó chỉ hoạt động trên form hiện tại.
        // Hủy các sự kiện cũ trên form trước khi khởi tạo lại (ít nhất là về mặt logic)
        
        // 2. Xác định form và id tương ứng
        const formId = activeForm === FormType.CANDIDATE ? "#candidateLoginForm" : "#companyLoginForm";
        const emailId = activeForm === FormType.CANDIDATE ? "#emailCandidate" : "#emailCompany";
        const passwordId = activeForm === FormType.CANDIDATE ? "#passwordCandidate" : "#passwordCompany";

        // 3. Khởi tạo Validator MỚI cho form hiện tại
        const validator = new JustValidate(formId);

        validator
            .addField(emailId, [
                {
                    rule: "required",
                    errorMessage: "Vui lòng nhập email của bạn!",
                },
                {
                    rule: "email",
                    errorMessage: "Email không đúng định dạng!",
                },
            ])
            .addField(passwordId, [
                {
                    rule: "required",
                    errorMessage: "Vui lòng nhập mật khẩu!",
                },
                {
                    validator: (value: string) => value.length >= 8,
                    errorMessage: "Mật khẩu phải chứa ít nhất 8 ký tự!",
                },
                // ... các quy tắc validation mật khẩu khác ...
            ])
            // JustValidate sẽ chặn submit nếu validation thất bại
            // Nếu thành công, nó gọi hàm onSuccess
            .onSuccess((e: any) => handleLoginSubmit(e)); 
        
        // 4. Lưu đối tượng validator vào ref
        validatorRef.current = validator;

        // 5. Cleanup function: quan trọng nhất! 
        // Mặc dù JustValidate không có hàm hủy, nhưng việc để useEffect này 
        // chạy lại khi activeForm thay đổi sẽ khởi tạo validator mới cho đúng form.
        // Đây là phương pháp phổ biến khi sử dụng JustValidate trong React.
        return () => {
            // Do JustValidate 4.x không có phương thức destroy() công khai, 
            // chúng ta có thể reset trạng thái hoặc để nó được garbage collected.
            // Điều quan trọng là chúng ta không sử dụng lại đối tượng cũ.
            validatorRef.current = null;
        };

    // 💡 Dependency array: Khởi tạo lại validator MỖI KHI form thay đổi
    }, [activeForm]);
    // Hàm này mô phỏng lại toàn bộ các quy tắc validation của bạn

    // Hàm xử lý submit
    const handleLoginSubmit = async (e:any) => {
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

            if(data.code === "error") {
                toast.error('Lỗi', {
                description: `${data.message}`,
                duration: 3000, // Thông báo sẽ tự đóng sau 3 giây
              });
            }
            
            if(data.code === "success") {

                toast.success('Thông báo', { description: data.message || 'Đăng nhập thành công!' , duration: 3000, // Thông báo sẽ tự đóng sau 3 giây
                });
                setTimeout(()=>{ router.push("/");},1000);
           
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
    const CommonForm = ({ id, isResending, type ,idPassword,idEmail}:{idEmail:string,idPassword:string,id:string,isResending:boolean,type:string}) => (
        <form id={id}  className="grid grid-cols-1 gap-y-[15px]">
            <div className="">
                <label htmlFor="email" className="block font-[500] text-[14px] text-black mb-[5px]">
                    Email *
                </label>
                <input 
                    readOnly={isResending}
                    type="email" 
                    name="email" 
                    id={`${idEmail?idEmail:"email"}`} 
                    // THÊM HIỆU ỨNG INPUT MỚI
                    className="w-[100%] h-[46px] border border-[#DEDEDE] rounded-[4px] py-[14px] px-[20px] font-[500] text-[14px] text-black shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                    required
                />
            </div>
            
            <PasswordInput idPassword={idPassword} isResending={isResending} />

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
                        key={FormType.CANDIDATE}
                            id="candidateLoginForm" 
                      
                            isResending={isResending && activeForm === FormType.CANDIDATE} 
                            type={FormType.CANDIDATE}
                               idPassword={"passwordCandidate"}
                               idEmail="emailCandidate"
                        />
                    </div>
                    
                    {/* Form Nhà tuyển dụng */}
                    <div className={`transition-opacity duration-500 ${activeForm === FormType.COMPANY ? 'opacity-100 relative' : 'opacity-0 absolute top-0 left-0 w-full pointer-events-none'}`}>
                        <CommonForm 
                        key={FormType.COMPANY}
                        id="companyLoginForm" 
                        
                            isResending={isResending && activeForm === FormType.COMPANY} 
                            type={FormType.COMPANY}
                            idPassword={"passwordCompany"}
                             idEmail="emailCompany"
                        />
                    </div>
                </div>
            </div>
        </div>
           </>
     
    );
};

export default FormLogin;