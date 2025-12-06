/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */

/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import { useAuth } from "@/hooks/useAuth";
import JustValidate from "just-validate";
import { useEffect, useState } from "react";
import { FaFilePdf } from "react-icons/fa6";
import { Toaster, toast } from 'sonner';
import { IoClose } from "react-icons/io5"; 

export const FormApply = (props:{
    jobId:string
}) => {
   const {jobId}=props;
   const { isLogin,infoUser} = useAuth();

 
   // Thêm state để lưu tên file
    const [fileName, setFileName] = useState<string>('');

    // Thêm state để lưu đối tượng file (cần thiết cho reset form)
    const [fileObject, setFileObject] = useState<File | null>(null);
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
        formData.append("candidateId", jobId);
        formData.append("fullName", fullName);
        formData.append("email", email);
        formData.append("phone", phone);
        formData.append("fileCV", fileCV);
        
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/job/apply`, {
          method: "POST",
          body: formData
        })
          .then(res => res.json())
          .then(data => {
            if(data.code === "error") {
              toast.error(data.message);
            }
    
            if(data.code == "success") {
              
            
                toast.success(data.message);
              event.target.reset();
              
            }
          })
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

// Hàm xử lý chọn file để cập nhật tên file hiển thị
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setFileName(file.name);
        } else {
            setFileName('');
        }
    };

    // Hàm xử lý xóa file
    const handleClearFile = () => {
        // Reset state
        setFileName('');
        setFileObject(null);
        
        // Reset giá trị của input file gốc (quan trọng để JustValidate nhận diện)
        const fileInput = document.getElementById("fileCV") as HTMLInputElement;
        if (fileInput) {
            fileInput.value = ''; // Đây là cách reset input file trong JS
        }
    };
   
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
                {/* <div className="mb-[15px]">
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
                </div> */}
               <div className="mb-[15px]">
                    <label
                        htmlFor="fileCV"
                        className="block font-[500] text-[14px] text-black mb-[5px]"
                    >
                        File CV dạng PDF *
                    </label>

                    <div className="relative w-[100%] h-[46px] border border-[#DEDEDE] rounded-[4px] font-[500] text-[14px] text-black flex items-center overflow-hidden">
                        
                        {/* NÚT BẤM (sử dụng label để kích hoạt input ẩn) */}
                        <label
                            htmlFor="fileCV"
                            className="h-full bg-[#EFEFEF] text-[#414042] px-[20px] flex items-center cursor-pointer border-r border-[#DEDEDE] hover:bg-[#E0E0E0] transition-colors whitespace-nowrap"
                        >
                            Chọn CV
                        </label>

                        {/* KHU VỰC HIỂN THỊ PREVIEW */}
                        <div className={`flex-1 px-[10px] flex items-center truncate ${fileName ? 'text-black' : 'text-[#A0A0A0]'}`}>
                            {/* Icon PDF và Tên file */}
                            {fileName ? (
                                <>
                                    <FaFilePdf className="text-red-600 mr-2 flex-shrink-0" />
                                    <span className="truncate">{fileName}</span>
                                    {/* Nút Xóa File */}
                                    <button 
                                        type="button" // Quan trọng: Tránh submit form
                                        onClick={handleClearFile} 
                                        className="ml-auto p-1 text-[#414042] hover:text-red-500 transition-colors flex-shrink-0"
                                    >
                                        <IoClose className="text-[16px]" />
                                    </button>
                                </>
                            ) : (
                                "Chưa có file nào được chọn (Max 5MB, .pdf)"
                            )}
                        </div>
                                {/* INPUT GỐC BỊ ẨN */}
                                <input
                                    type="file"
                                    name="fileCV"
                                    id="fileCV"
                                    accept="application/pdf"
                                    // Ẩn input gốc nhưng vẫn giữ thuộc tính
                                    className="absolute w-0 h-0 opacity-0 overflow-hidden" 
                                    onChange={handleFileChange}
                                />
                            </div>
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