/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import PasswordInput from '@/components/input/PasswordInput';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { toast, Toaster } from 'sonner';
import Link from 'next/link';

const FormType = {
    CANDIDATE: 'candidate',
    COMPANY: 'company'
};

const FormLogin = () => {
    const [activeForm, setActiveForm] = useState(FormType.CANDIDATE);
    const [isResending, setIsResending] = useState(false);
    const searchParams = useSearchParams();
    const router = useRouter();
    const userId = searchParams.get('userId');

    useEffect(() => {
        if (userId) {
            toast.success('Thông báo', { description: `Verify thành công!`, duration: 3000 });
        }
    }, [userId]);

    const handleLoginSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (isResending) return;
        setIsResending(true);

        try {
            const formData = new FormData(e.currentTarget);
            const email = formData.get('email') as string;
            const password = formData.get('password') as string;

            if (password.length < 8) {
                toast.error('Lỗi', { description: "Mật khẩu tối thiểu phải có 8 ký tự!" });
                setIsResending(false);
                return;
            }

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
            } else if (data.code === "success") {
                toast.success('Thông báo', { description: data.message || 'Đăng nhập thành công!' });
                setTimeout(() => { router.push("/"); }, 1000);
            }
        } catch (error: unknown) {
            console.error(error);
            toast.error('Lỗi', { description: "Đã xảy ra lỗi kết nối. Vui lòng thử lại sau." });
        } finally {
            setIsResending(false);
        }
    };

    const toggleForm = (type: string) => {
        if (isResending) return;
        setActiveForm(type);
    };

    const CommonForm = ({ id, idPassword, idEmail }: any) => (
        <form 
            id={id} 
            className="grid grid-cols-1 gap-y-[15px] mx-[5px]"
            onSubmit={handleLoginSubmit}
        >
            <div>
                <label htmlFor={idEmail} className="block font-[500] text-[14px] text-black mb-[5px]">
    Email <span className="text-red-500">*</span>
  </label>
                <input
                    required
                    readOnly={isResending}
                    type="email"
                    name="email"
                    id={idEmail}
                    className="w-[100%] h-[46px] border border-[#DEDEDE] rounded-[4px] py-[14px] px-[20px] font-[500] text-[14px] text-black shadow-sm focus:outline-none focus:ring-2 focus:ring-[#000073] transition duration-200"
                    placeholder="example@gmail.com"
                />
            </div>

            <PasswordInput idPassword={idPassword} isResending={isResending} />

            <div className="pt-2">
                <button
                    type="submit"
                    className={`bg-[#000073] rounded-[4px] w-[100%] h-[48px] px-[20px] font-[700] text-[16px] text-white transition-all
                    ${isResending ? " bg-gray-400 cursor-not-allowed " : " shadow-md "} `}
                    disabled={isResending}
                >
                    {isResending ? "Đang đăng nhập..." : "Đăng nhập"}
                </button>
            </div>

            {/* --- LINK QUÊN MẬT KHẨU --- */}
            <div className="text-right">
                <Link 
                    href="/resetpassword" 
                    className="text-[13px] text-blue-600 hover:text-blue-800 hover:underline transition-all"
                >
                    Quên mật khẩu?
                </Link>
            </div>
        </form>
    );

    return (
        <>
            <Toaster richColors position="top-right" />
            <div className="flex items-center justify-center my-[2%] p-4 font-sans">
                <div className="w-full max-w-xl bg-white p-8 rounded-2xl shadow-2xl border border-gray-200">
                    <h2 className="text-xl font-extrabold text-center text-gray-900 mb-6 uppercase">Đăng nhập</h2>
                    
                    <div className="flex mb-8 bg-gray-200 rounded-lg p-1 shadow-inner">
                        <button 
                            onClick={() => toggleForm(FormType.CANDIDATE)} 
                            className={`w-1/2 py-2 text-sm font-semibold rounded-lg transition-all duration-300 ${activeForm === FormType.CANDIDATE ? 'bg-white shadow-md text-[#000073]' : 'text-gray-600 hover:text-[#000073]'}`}
                        >
                            Ứng viên
                        </button>
                        <button 
                            onClick={() => toggleForm(FormType.COMPANY)} 
                            className={`w-1/2 py-2 text-sm font-semibold rounded-lg transition-all duration-300 ${activeForm === FormType.COMPANY ? 'bg-white shadow-md text-[#000073]' : 'text-gray-600 hover:text-[#000073]'}`}
                        >
                            Nhà tuyển dụng
                        </button>
                    </div>

                    <div className="relative min-h-[300px]">
                        <div className={`transition-opacity duration-500 ${activeForm === FormType.CANDIDATE ? 'opacity-100' : 'opacity-0 absolute inset-0 pointer-events-none'}`}>
                            {activeForm === FormType.CANDIDATE && (
                                <CommonForm id="candidateLoginForm" idPassword="passwordCandidate" idEmail="emailCandidate" />
                            )}
                        </div>
                        <div className={`transition-opacity duration-500 ${activeForm === FormType.COMPANY ? 'opacity-100' : 'opacity-0 absolute inset-0 pointer-events-none'}`}>
                            {activeForm === FormType.COMPANY && (
                                <CommonForm id="companyLoginForm" idPassword="passwordCompany" idEmail="emailCompany" />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default FormLogin;