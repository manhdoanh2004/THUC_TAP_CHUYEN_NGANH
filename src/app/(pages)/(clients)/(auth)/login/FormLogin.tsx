/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import PasswordInput from '@/components/input/PasswordInput';
import JustValidate from 'just-validate';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useState, useEffect, useRef } from 'react';
import { toast, Toaster } from 'sonner';

const FormType = {
    CANDIDATE: 'candidate',
    COMPANY: 'company'
};

const FormLogin = () => {
    const [activeForm, setActiveForm] = useState(FormType.CANDIDATE);
    const [isResending, setIsResending] = useState(false);
    const searchParams = useSearchParams();
    const validatorRef = useRef<any>(null);
    const router = useRouter();
    const userId = searchParams.get('userId');

    useEffect(() => {
        if (userId) {
            toast.success('Thông báo', { description: `Verify thành công!`, duration: 3000 });
        }
    }, [userId]);

    // Hàm xử lý submit tách biệt hoàn toàn
    const handleLoginSubmit = async (e: any) => {
        // CHẶN NGAY LẬP TỨC sự kiện của trình duyệt
        if (e && e.preventDefault) {
            e.preventDefault();
        }

        if (isResending) return;
        setIsResending(true);

        try {
            // Lấy form element từ event target (chính xác nhất)
            const formElement = (e.target || e.container) as HTMLFormElement;
            const formData = new FormData(formElement);
            const email = formData.get('email') as string;
            const password = formData.get('password') as string;

            const dataFinal = { email, password };
            const endpoint = activeForm === FormType.CANDIDATE
                ? `${process.env.NEXT_PUBLIC_API_URL}/user/login`
                : `${process.env.NEXT_PUBLIC_API_URL}/company/login`;

            const res = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(dataFinal),
                credentials: "include"
            });
            
            const data = await res.json();

            if (data.code === "error") {
                toast.error('Lỗi', { description: data.message });
                setIsResending(false);
            } else if (data.code === "success") {
                toast.success('Thông báo', { description: data.message || 'Đăng nhập thành công!' });
                setTimeout(() => { router.push("/"); }, 1000);
            }
        } catch (error:unknown) {
            console.log(error)
            setIsResending(false);
            toast.error('Lỗi', { description: "Đã xảy ra lỗi kết nối. Vui lòng thử lại sau." });
        }finally{
            setIsResending(false)
        }
    };

    useEffect(() => {
        const formId = activeForm === FormType.CANDIDATE ? "#candidateLoginForm" : "#companyLoginForm";
        const emailId = activeForm === FormType.CANDIDATE ? "#emailCandidate" : "#emailCompany";
        const passwordId = activeForm === FormType.CANDIDATE ? "#passwordCandidate" : "#passwordCompany";

        const formElement = document.querySelector(formId) as HTMLFormElement;
        if (!formElement) return;

        // Khởi tạo validator mới
        const validator = new JustValidate(formId, {
            validateBeforeSubmitting: true,
            lockForm: false, // Thêm dòng này: Không cho JustValidate tự ý khóa form
    allowFormChangeValidation: true, // Cho phép validate lại khi người dùng gõ
        });

        validator
            .addField(emailId, [
                { rule: "required", errorMessage: "Vui lòng nhập email!" },
                { rule: "email", errorMessage: "Email không đúng định dạng!" },
            ])
            .addField(passwordId, [
                { rule: "required", errorMessage: "Vui lòng nhập mật khẩu!" },
                { validator: (value: string) => value.length >= 8, errorMessage: "Mật khẩu tối thiểu 8 ký tự!" },
            ])
            .onSuccess((event:any) => {
                // JustValidate gọi onSuccess và truyền event submit vào đây
                handleLoginSubmit(event);
            });

        validatorRef.current = validator;

        return () => {
            // Cleanup: Gỡ bỏ toàn bộ sự kiện của JustValidate trước khi render form mới
            if (validatorRef.current) {
                validatorRef.current.destroy();
            }
        };
    }, [activeForm]);

    const toggleForm = (type: string) => {
        if (isResending) return;
        setActiveForm(type);
    };

    const CommonForm = ({ id, type, idPassword, idEmail }: any) => (
        <form 
            id={id} 
            className="grid grid-cols-1 gap-ý-[15px] mx-[5px]"
            // Thêm onSubmit để chặn "lớp phòng thủ cuối cùng" nếu JustValidate lỗi
            onSubmit={(e) => e.preventDefault()} 
        >
            <div>
                <label htmlFor={idEmail} className="block font-[500] text-[14px] text-black mb-[5px]">
                    Email *
                </label>
                <input
                    readOnly={isResending}
                    type="email"
                    name="email" // Giữ name để FormData lấy dữ liệu
                    id={idEmail}
                    className="w-[100%] h-[46px] border border-[#DEDEDE] rounded-[4px] py-[14px] px-[20px] font-[500] text-[14px] text-black shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                />
            </div>

            <PasswordInput idPassword={idPassword} isResending={isResending} />

            <div className="pt-2">
                <button
                    type="submit"
                    className={`bg-[#0088FF] rounded-[4px] w-[100%] h-[48px] px-[20px] font-[700] text-[16px] text-white transition-all
                    ${isResending ? " bg-gray-400 cursor-not-allowed " : " hover:bg-blue-600 shadow-md "} `}
                    disabled={isResending}
                >
                    {isResending ? "Đang đăng nhập..." : "Đăng nhập"}
                </button>
            </div>
            {/* Các phần khác giữ nguyên... */}
        </form>
    );

    // Phần render (return) giữ nguyên cấu trúc của bạn...
    return (
        <>
            <Toaster richColors position="top-right" />
            <div className="flex items-center justify-center my-[2%] p-4 font-sans">
                <div className="w-full max-w-xl bg-white p-8 rounded-2xl shadow-2xl border border-gray-200">
                    <h2 className="text-xl font-extrabold text-center text-gray-900 mb-6 uppercase">Đăng nhập</h2>
                    <div className="flex mb-8 bg-gray-200 rounded-lg p-1 shadow-inner">
                        <button onClick={() => toggleForm(FormType.CANDIDATE)} className={`w-1/2 py-2 text-sm font-semibold rounded-lg transition-all duration-300 ${activeForm === FormType.CANDIDATE ? 'bg-white shadow-md text-blue-600' : 'text-gray-600 hover:text-blue-500'}`}>Ứng viên</button>
                        <button onClick={() => toggleForm(FormType.COMPANY)} className={`w-1/2 py-2 text-sm font-semibold rounded-lg transition-all duration-300 ${activeForm === FormType.COMPANY ? 'bg-white shadow-md text-blue-600' : 'text-gray-600 hover:text-blue-500'}`}>Nhà tuyển dụng</button>
                    </div>
                    <div className="relative min-h-[350px]">
                        <div className={`transition-opacity duration-500 ${activeForm === FormType.CANDIDATE ? 'opacity-100' : 'opacity-0 absolute inset-0 pointer-events-none'}`}>
                            <CommonForm id="candidateLoginForm" type={FormType.CANDIDATE} idPassword="passwordCandidate" idEmail="emailCandidate" />
                        </div>
                        <div className={`transition-opacity duration-500 ${activeForm === FormType.COMPANY ? 'opacity-100' : 'opacity-0 absolute inset-0 pointer-events-none'}`}>
                            <CommonForm id="companyLoginForm" type={FormType.COMPANY} idPassword="passwordCompany" idEmail="emailCompany" />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default FormLogin;