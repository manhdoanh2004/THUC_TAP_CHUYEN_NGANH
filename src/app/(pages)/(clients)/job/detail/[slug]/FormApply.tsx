/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */

/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import Swal from 'sweetalert2'
import { useAuth } from "@/hooks/useAuth";
import JustValidate from "just-validate";
import React, { useEffect, useState } from "react";
import { FaFilePdf } from "react-icons/fa6";
import { Toaster, toast } from 'sonner';
import { IoClose } from "react-icons/io5"; 
import Link from "next/link";
import {
  FaArrowRightLong,
  FaBriefcase,
  FaClock,
  FaLocationDot,
  FaUserTie,
} from "react-icons/fa6";
import FavoriteJobButton from "@/components/buttons/FavoriteJobButton";
import JobDetailSkeleton from "@/components/card/JobDetailSkeleton";
 const FormApply = (props:{
    jobId:string;
    isLogin:boolean
    setIsSubmitApplied:React.Dispatch<React.SetStateAction<boolean>>
}) => {
   const {jobId,isLogin,setIsSubmitApplied}=props;
  


   // Thêm state để lưu tên file
    const [fileName, setFileName] = useState<string>('');

    // Thêm state để lưu đối tượng file (cần thiết cho reset form)
    const [fileObject, setFileObject] = useState<File | null>(null);
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

    // HÀM XỬ LÝ THÀNH CÔNG (ĐÃ THÊM event.preventDefault())
    const handleSuccess = (event: any) => {
        // QUAN TRỌNG: Ngăn chặn hành vi submit mặc định của form
        event.preventDefault(); 
        
        const fullName = event.target.fullName.value;
        const email = event.target.email.value;
        const phone = event.target.phone.value;
        const fileCV = event.target.fileCV.files[0];

        // Tạo FormData
        const formData = new FormData();
        formData.append("jobId", jobId);
        formData.append("name", fullName);
        formData.append("email", email);
        formData.append("phone", phone);
        formData.append("cv", fileCV);
     
        const promise = fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/applications`,
            {
                method: "POST",
                body: formData,
                credentials: "include"
            }
        ).then(async (res) => {
            const data = await res.json();
            if (data.code === "error") {
                throw new Error(data.message);
            }
            else
            {
                    setIsSubmitApplied(true);
            }
           
            return data;
        });

        toast.promise(promise, {
            loading: "Đang gửi CV...",
            success: (data) => {
                // Reset form và file input sau khi thành công
                event.target.reset();
                handleClearFile(); // Gọi hàm reset state file
                return `${data.message}`;
            },
            error: (err) => err.message || "Đã xảy ra lỗi!",
        });
    };

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
      .onSuccess(handleSuccess)
    }
   
  }, [isLogin]); // Thêm dependencies để hàm handleSuccess mới được cập nhật


// Hàm xử lý chọn file để cập nhật tên file hiển thị (Giữ nguyên)
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setFileName(file.name);
        } else {
            setFileName('');
        }
    };
    return (
        <>
       
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
      
        </>
    )
}

export const JobDetail=(props:{
    jobDetail:any
})=>
{
  const [isLoading,setIsLoading]=useState(true);
  const [isSubmitApplied,setIsSubmitApplied]=useState(false);

  
     const {jobDetail}=props;
  

     const [isApplied, setIsApplied] = useState(false);
      const { isLogin,infoUser} = useAuth();


      useEffect(()=>{
    if(infoUser)
    {
        setTimeout(()=>{ setIsLoading(false)},1000)
 if(infoUser.appliedIds?.includes(jobDetail.jobId))
      {
        setIsApplied(true)
      }
      else setIsApplied(false)
    }
    
     setTimeout(()=>{ setIsLoading(false)},1000)
  },[infoUser])
  
    return(
        <>
        {
          isLoading==false?(<>
            {jobDetail? (
        <div className="pt-[30px] pb-[60px]">
          <div className="container mx-auto px-[16px]">
            {/* Wrap */}
            <div className="flex flex-wrap gap-[20px]">
              {/* Left */}
              <div className="lg:w-[65%] w-[100%]">
                {/* Thông tin công việc */}
                <div className="border border-[#DEDEDE] rounded-[8px] p-[20px]">
                  <h1 className="font-[700] sm:text-[28px] text-[24px] text-[#121212] mb-[10px]">
                    {jobDetail.title}
                  </h1>
                  <div className="font-[400] text-[16px] text-[#414042] mb-[10px]">
                    {jobDetail.companyName}
                  </div>
                    {jobDetail.salaryMax<0||jobDetail.salaryMin<0?(<>
                     
                      </>):(<>
                      <div className="font-[700] text-[20px] text-[#0088FF] sm:mb-[20px] mb-[10px]">
                    {jobDetail.salaryMin.toLocaleString("vi-VN")}$ -{" "}
                    {jobDetail.salaryMax.toLocaleString("vi-VN")}$
                  </div>
                      </>)}
      
                  
                <div className="flex justify-around items-center gap-[10px] mb-[20px]">
                  {isLogin?(<>
                    <Link
        href={`${isApplied?"#":"#formApply"}`}
        
        className={`${isApplied?" bg-gray-500 cursor-default ": "bg-[#0088FF] cursor-pointer" } rounded-[4px] font-[700] text-[16px] text-white flex items-center justify-center flex-1 h-[48px] `}
    >
      {isApplied? "Đã ứng tuyển":"Ứng tuyển"}  
    </Link>
                  </>):(<>
                    <button
  onClick={()=>{
    Swal.fire({
  icon: "error",
  title: "Bạn chưa đăng nhập!",
  text: "Vui lòng đăng nhập để ứng tuyển công việc!",
  footer: `<a href="/login">Đăng nhập ngay?</a>`
});
  }}
        
        className={` bg-[#0088FF] cursor-pointer  rounded-[4px] font-[700] text-[16px] text-white flex items-center justify-center flex-1 h-[48px] `}
    >
      Ứng tuyển
    </button>
                  </>)}
  
    <FavoriteJobButton infoUser={infoUser} isLogin={isLogin} jobDetail={jobDetail}/>
</div>
                  <div className="flex items-center gap-[8px] font-[400] text-[14px] text-[#121212] mb-[10px]">
                    <FaUserTie className="text-[16px]" /> {jobDetail.position}
                  </div>
                  <div className="flex items-center gap-[8px] font-[400] text-[14px] text-[#121212] mb-[10px]">
                    <FaBriefcase className="text-[16px]" />{" "}
                    {jobDetail.workingFrom}
                  </div>
                  <div className="flex items-center gap-[8px] font-[400] text-[14px] text-[#121212] mb-[10px]">
                    <FaLocationDot className="text-[16px]" />{" "}
                       {jobDetail.location?.map(
                      (itemTech: string, indexTech: number) => (
                        <div
                          key={indexTech}
                          className="border border-[#DEDEDE] rounded-[20px] font-[400] text-[12px] text-[#414042] py-[6px] px-[16px]"
                        >
                          {itemTech}
                        </div>
                      )
                    )}
                  </div>
                  <div className="flex flex-wrap gap-[8px]">
                    Các công nghệ :
                    {jobDetail.technologies.map(
                      (itemTech: string, indexTech: number) => (
                        <div
                          key={indexTech}
                          className="border border-[#DEDEDE] rounded-[20px] font-[400] text-[12px] text-[#414042] py-[6px] px-[16px]"
                        >
                          {itemTech}
                        </div>
                      )
                    )}
                  </div>
                   <div className="ml-[-33px] mt-[5px] flex justify-start items-center gap-[8px]  text-[16px] text-gray-500"> 
                    <span className="text-black  flex justify-start items-center gap-[8px] "><FaClock className="text-[16px]" /> Hạn nộp:</span> {jobDetail.deadline}
                  </div>
           {jobDetail.salaryMax<0||jobDetail.salaryMin<0?(<>
                       <div
      
        className=" my-[5px] max-w-[150px] border border-[#DEDEDE] rounded-[20px] py-[6px] px-[16px] font-[400] text-[12px] text-[#414042]">
            {"Lương thỏa thuận"}
          </div>
                      </>):(<>
                    
                      </>)}
                </div>
                {/* Hết Thông tin công việc */}

                {/* Mô tả chi tiết */}
                {jobDetail.description?(<>
                  <div className="border border-[#DEDEDE] rounded-[8px] p-[20px] mt-[20px]">
                  <div
                    dangerouslySetInnerHTML={{ __html: jobDetail.description }}
                  />
                </div>
                </>):(<></>)}
              
                {/* Hết Mô tả chi tiết */}

                {/* Form ứng tuyển */}
               
               {isLogin?(<>
                   {isApplied|| isSubmitApplied?(<></>):(<FormApply  setIsSubmitApplied={setIsSubmitApplied} jobId={jobDetail.jobId} isLogin={isLogin}/>)}
               </>):(<></>)}
           
                    
              
                {/* Hết Form ứng tuyển */}
              </div>
              {/* Right */}
              <div className="flex-1">
                {/* Thông tin công ty */}
                <div className="border border-[#DEDEDE] rounded-[8px] p-[20px]">
                  <div className="flex gap-[12px]">
                    <div className="w-[100px]">
                      <img
                        src={jobDetail.employer.logo}
                        alt={jobDetail.companyName}
                        className="aspect-square object-cover rounded-[4px]"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="font-[700] text-[18px] text-[#121212] mb-[10px]">
                        {jobDetail.companyName}
                      </div>
                      <Link
                        href={`/company/detail/${jobDetail.employer.employerId}`}
                        className="flex items-center gap-[8px] font-[400] text-[16px] text-[#0088FF]"
                      >
                        Xem công ty <FaArrowRightLong className="" />
                      </Link>
                    </div>
                  </div>
                  <div className="mt-[20px] flex flex-col gap-[10px]">
                    <div className="flex flex-wrap justify-between font-[400] text-[16px]">
                      <div className="text-[#A6A6A6]">Mô hình công ty</div>
                      <div className="text-[#121212]">
                        {jobDetail.employer.companyModel}
                      </div>
                    </div>
                    <div className="flex flex-wrap justify-between font-[400] text-[16px]">
                      <div className="text-[#A6A6A6]">Quy mô công ty</div>
                      <div className="text-[#121212]">
                        {jobDetail.employer.companyEmployees}
                      </div>
                    </div>
                    <div className="flex flex-wrap justify-between font-[400] text-[16px]">
                      <div className="text-[#A6A6A6]">Thời gian làm việc</div>
                      <div className="text-[#121212]">
                        {jobDetail.employer.workingTime}
                      </div>
                    </div>
                    <div className="flex flex-wrap justify-between font-[400] text-[16px]">
                      <div className="text-[#A6A6A6]">Làm việc ngoài giờ</div>
                      <div className="text-[#121212]">
                        {jobDetail.employer.workingOvertime}
                      </div>
                    </div>
                  </div>
                </div>
                {/* Hết Thông tin công ty */}
              </div>
            </div>
          </div>
        </div>
            ):(<></>)}
          </>):(<>
          <JobDetailSkeleton />
          </>)
        }
        
        </>
    )
}