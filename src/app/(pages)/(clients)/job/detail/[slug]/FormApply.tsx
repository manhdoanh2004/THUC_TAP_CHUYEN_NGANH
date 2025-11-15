/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */

/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import { useAuth } from "@/hooks/useAuth";
import JustValidate from "just-validate";
import { useEffect } from "react";
import { Toaster, toast } from 'sonner';


export const FormApply = (props:{
    jobId:string
}) => {
   const {jobId}=props;
   const { isLogin} = useAuth();
   useEffect(() => {

    if(isLogin)
    {
         const validator = new JustValidate("#formApply");

    validator
      .addField('#fullName', [
        {
          rule: 'required',
          errorMessage: 'Vui lòng nhập họ tên!'
        },
        {
          rule: 'minLength',
          value: 5,
          errorMessage: 'Họ tên phải có ít nhất 5 ký tự!',
        },
        {
          rule: 'maxLength',
          value: 50,
          errorMessage: 'Họ tên không được vượt quá 50 ký tự!',
        },
      ])
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
      .addField('#phone', [
        {
          rule: 'required',
          errorMessage: 'Vui lòng nhập số điện thoại!'
        },
        {
          rule: 'customRegexp',
          value: /(84|0[3|5|7|8|9])+([0-9]{8})\b/g,
          errorMessage: 'Số điện thoại không đúng định dạng!'
        },
      ])
      .addField('#fileCV', [
        {
          rule: 'required',
          errorMessage: 'Vui lòng chọn file CV!',
        },
        {
          validator: (value: any, fields: any) => {
            const file = fields['#fileCV']?.elem?.files?.[0];
            if (!file) return false;
            return file.type === 'application/pdf';
          },
          errorMessage: 'File phải là định dạng PDF!',
        },
        {
          validator: (value: any, fields: any) => {
            const file = fields['#fileCV']?.elem?.files?.[0];
            if (!file) return false;
            return file.size <= 5 * 1024 * 1024; // 5MB = 5 * 1024 KB * 1024 bytes
          },
          errorMessage: 'Dung lượng file không được vượt quá 5MB!',
        },
      ])
      .onSuccess((event: any) => {
        const fullName = event.target.fullName.value;
        const email = event.target.email.value;
        const phone = event.target.phone.value;
        const fileCV = event.target.fileCV.files[0];

        // Tạo FormData
        const formData = new FormData();
        formData.append("jobId", jobId);
        formData.append("fullName", fullName);
        formData.append("email", email);
        formData.append("phone", phone);
        formData.append("fileCV", fileCV);
        
        // fetch(`${process.env.NEXT_PUBLIC_API_URL}/job/apply`, {
        //   method: "POST",
        //   body: formData
        // })
        //   .then(res => res.json())
        //   .then(data => {
        //     if(data.code === "error") {
        //       toast.error(data.message);
        //     }
    
        //     if(data.code == "success") {
              
        //         console.log(data);
        //         toast.success(data.message);
        //       event.target.reset();
              
        //     }
        //   })
    const promise = fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/job/apply`,
        {
          method: "POST",
          body: formData,
          credentials:"include"
        
        }
      ).then(async (res) => {
        const data = await res.json();
        if (data.code === "error") {
          throw new Error(data.message);
        }
        else
        {
             event.target.reset();
        }
        return data;
      });

      toast.promise(promise, {
        loading: "Đang gửi cv...",
        success: (data) => `${data.message}`, // data ở đây là kết quả trả về khi `resolve`
        error: (err) => err.message || "Đã xảy ra lỗi!",
      });
    
      })
    }
   
  }, []);


   
    return (
        <>
        {isLogin?(<>
            <Toaster richColors position="top-right" />
             <div className="border border-[#DEDEDE] rounded-[8px] p-[20px] mt-[20px]">
            <h2 className="font-[700] text-[20px] text-black mb-[20px]">
                    Ứng tuyển ngay
                  </h2>
            <form action="" id="formApply" className="">
                <div className="mb-[15px]">
                    <label
                        htmlFor="fullName"
                        className="block font-[500] text-[14px] text-black mb-[5px]"
                    >
                        Họ tên *
                    </label>
                    <input
                        type="text"
                        name="fullName"
                        id="fullName"
                        className="w-[100%] h-[46px] border border-[#DEDEDE] rounded-[4px] py-[14px] px-[20px] font-[500] text-[14px] text-black"
                    />
                </div>
                <div className="mb-[15px]">
                    <label
                        htmlFor="email"
                        className="block font-[500] text-[14px] text-black mb-[5px]"
                    >
                        Email *
                    </label>
                    <input
                        type="email"
                        name="email"
                        id="email"
                        className="w-[100%] h-[46px] border border-[#DEDEDE] rounded-[4px] py-[14px] px-[20px] font-[500] text-[14px] text-black"
                    />
                </div>
                <div className="mb-[15px]">
                    <label
                        htmlFor="phone"
                        className="block font-[500] text-[14px] text-black mb-[5px]"
                    >
                        Số điện thoại *
                    </label>
                    <input
                        type="text"
                        name="phone"
                        id="phone"
                        className="w-[100%] h-[46px] border border-[#DEDEDE] rounded-[4px] py-[14px] px-[20px] font-[500] text-[14px] text-black"
                    />
                </div>
                <div className="mb-[15px]">
                    <label
                        htmlFor="fileCV"
                        className="block font-[500] text-[14px] text-black mb-[5px]"
                    >
                        File CV dạng PDF *
                    </label>
                    <input
                        type="file"
                        name="fileCV"
                        id="fileCV"
                        accept="application/pdf"
                        className=""
                    />
                </div>
                <button className="w-[100%] h-[48px] rounded-[4px] bg-[#0088FF] font-[700] text-[16px] text-white">
                    Gửi CV ứng tuyển
                </button>
            </form>
            </div>
        </>):(<></>)}
        
        </>
    )
}