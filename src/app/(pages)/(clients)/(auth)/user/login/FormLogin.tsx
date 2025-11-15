/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import JustValidate from "just-validate";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { Toaster,toast } from "sonner";

export const FormLogin = () => {
  const router = useRouter();

  const searchParams=useSearchParams();

  const userId=searchParams.get('userId');

  useEffect(()=>{
      if(userId)
      {
        toast.success('Verify thanh cong!', {
        description: `Verify thanh cong!`,
        duration: 3000, // Thông báo sẽ tự đóng sau 3 giây
      });
      }
  },[])
  useEffect(() => {
    const validator = new JustValidate("#loginForm");

    validator
      .addField('#email', [
        {
          rule: 'required',
          errorMessage: 'Vui lòng nhập email của bạn!',
        },
        {
          rule: 'email',
          errorMessage: 'Email không đúng định dạng!',
        },
      ])
      .addField('#password', [
        {
          rule: 'required',
          errorMessage: 'Vui lòng nhập mật khẩu!',
        },
        {
          validator: (value: string) => value.length >= 8,
          errorMessage: 'Mật khẩu phải chứa ít nhất 8 ký tự!',
        },
        {
          validator: (value: string) => /[A-Z]/.test(value),
          errorMessage: 'Mật khẩu phải chứa ít nhất một chữ cái in hoa!',
        },
        {
          validator: (value: string) => /[a-z]/.test(value),
          errorMessage: 'Mật khẩu phải chứa ít nhất một chữ cái thường!',
        },
        {
          validator: (value: string) => /\d/.test(value),
          errorMessage: 'Mật khẩu phải chứa ít nhất một chữ số!',
        },
        {
          validator: (value: string) => /[@$!%*?&]/.test(value),
          errorMessage: 'Mật khẩu phải chứa ít nhất một ký tự đặc biệt!',
        },
      ])
      .onSuccess((event: any) => {
        const email = event.target.email.value;
        const password = event.target.password.value;

        const dataFinal = {
          email: email,
          password: password
        };
  
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dataFinal),
          credentials: "include" // Giữ cookie
        })
          .then(res => res.json())
          .then(data => {
            if(data.code == "error") {
              alert(data.message);
            }
  
            if(data.code == "success") {
              console.log(data)
              router.push("/");
            }
          })
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
    <Toaster richColors position="top-right" />
      <form id="loginForm" action="" className="grid grid-cols-1 gap-y-[15px]">
        <div className="">
          <label htmlFor="email" className="block font-[500] text-[14px] text-black mb-[5px]">
            Email *
          </label>
          <input 
            type="email" 
            name="email" 
            id="email" 
            className="w-[100%] h-[46px] border border-[#DEDEDE] rounded-[4px] py-[14px] px-[20px] font-[500] text-[14px] text-black"
          />
        </div>
        <div className="">
          <label htmlFor="password" className="block font-[500] text-[14px] text-black mb-[5px]">
            Mật khẩu *
          </label>
          <input 
            type="password" 
            name="password" 
            id="password" 
            className="w-[100%] h-[46px] border border-[#DEDEDE] rounded-[4px] py-[14px] px-[20px] font-[500] text-[14px] text-black"
          />
        </div>
        <div className="">
          <button className="bg-[#0088FF] rounded-[4px] w-[100%] h-[48px] px-[20px] font-[700] text-[16px] text-white">
            Đăng nhập
          </button>
        </div>
        <p> Bạn chưa có tài khoản ? <Link  href="/user/register" className="underline cursor-pointer hover:text-blue-500"> Đăng ký tài khoản ngay</Link></p>
        <p> Bạn là nhà tuyển dụng ? <Link  href="/company/login" className="underline cursor-pointer hover:text-blue-500"> Đăng nhập với vai trò là tuyển dụng </Link></p>
      </form>
    </>
  )
}
