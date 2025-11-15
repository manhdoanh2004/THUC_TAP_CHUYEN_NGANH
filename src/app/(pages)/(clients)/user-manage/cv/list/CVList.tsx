/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";
import { cvStatusList, positionList, workingFromList } from "@/config/variables";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link"
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaBriefcase, FaCircleCheck, FaUserTie } from "react-icons/fa6"

export const CVList = () => {
  const [listCV, setListCV] = useState<any[]>([]);
  const [page,setPage]=useState(1);
  const [totalPage,setTotalPage]=useState(1);
  const { infoUser, isLogin } = useAuth();
   const router = useRouter();

    useEffect(() => {
      if(isLogin === false) {
        router.push("/");
      }
    }, [isLogin]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/cv/list?page=${page}`, {
      method: "GET",
      credentials: "include", // Gửi kèm cookie
    })
      .then(res => res.json())
      .then(data => {
        if(data.code == "success") {
          setListCV(data.listCV);
          setTotalPage(data.totalPage);
        }
      })
  }, [page]);


  const handlePagination=(event:any)=>
  {
    const value=event.target.value;
    setPage(parseInt(value));
  }

  return (
    <>
      <div className="grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-[20px]">
        {listCV.map(item => {
          item.jobPosition = positionList.find(itemPos => itemPos.value == item.jobPosition)?.label;
          item.jobWorkingForm = workingFromList.find(itemWork => itemWork.value == item.jobWorkingForm)?.label;
          const status = cvStatusList.find(itemStatus => itemStatus.value == item.status);

          return (
            <div 
              key={item.id}
              className="border overflow-hidden border-[#DEDEDE] rounded-[8px] flex flex-col relative truncate"
              style={{
                background: "linear-gradient(180deg, #F6F6F6 2.38%, #FFFFFF 70.43%)"
              }}
            >
              <img 
                src="/assets/images/card-bg.svg" 
                alt="" 
                className="absolute z-10 top-[43%] left-[0px] w-[100%] h-auto"
              />
                <img 
                src={item.companyLogo}
                alt={item.companyName}
                className="overflow-hidden w-full h-[214px]  object-cover"
                />
              <h3 className="mt-[20px] mx-[16px] font-[700] text-[18px] text-[#121212] text-center flex-1 whitespace-normal line-clamp-2 relative z-10"
                title={item.jobTitle}
              >
                <Link href={`/job/detail/${item.jobId}`}>
                      {item.jobTitle}
                </Link>
              
              </h3>
              <div className="mt-[12px] text-center font-[400] text-[14px] text-black">
                Công ty: <Link href={`/company/detail/${item.companyId}`} className="font-[700] relative z-10 ">{item.companyName}</Link>
              </div>
              <div className="mt-[12px] text-center font-[400] text-[14px] text-black">
                Thời gian ứng tuyển : {item.createdAtFormat}
              </div>
              <div className="mt-[6px] text-center font-[600] text-[16px] text-[#0088FF]">
                {item.jobSalaryMin.toLocaleString("vi-VN")}$ - {item.jobSalaryMax.toLocaleString("vi-VN")}$
              </div>
              <div className="mt-[6px] flex justify-center items-center gap-[8px] font-[400] text-[14px] text-[#121212]">
                <FaUserTie className="text-[16px]" /> {item.jobPosition}
              </div>
              <div className="mt-[6px] flex justify-center items-center gap-[8px] font-[400] text-[14px] text-[#121212]">
                <FaBriefcase className="text-[16px]" /> {item.jobWorkingForm}
              </div>
              <div 
                className="mt-[6px] flex justify-center items-center gap-[8px] font-[400] text-[14px]"
                style={{
                  color: status?.color
                }}
              >
                <FaCircleCheck className="text-[16px]" /> {status?.label}
              </div>
              <div className="flex flex-wrap items-center justify-center gap-[8px] mt-[12px] mb-[20px] mx-[10px]">
                <Link href={`${item.fileCV}`}
                    target="_blank" // Mở trong tab/cửa sổ mới
              rel="noopener noreferrer" // Quan trọng cho bảo mật và hiệu suất
                className="bg-[#0088FF] rounded-[4px] font-[400] text-[14px] text-white inline-block py-[8px] px-[20px]">
                  Xem CV
                </Link>
                {/* <Link href="#" className="bg-[#FF0000] rounded-[4px] font-[400] text-[14px] text-white inline-block py-[8px] px-[20px]">
                  Xóa
                </Link> */}
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-[30px]">
        <select name="" className="border border-[#DEDEDE] rounded-[8px] py-[12px] px-[18px] font-[400] text-[16px] text-[#414042]"
            onChange={(event)=>handlePagination(event)}
        >
         {Array(totalPage).fill("").map((item,index)=>
            {
                return(
                  <option key={index} value={index+1}>Trang {index+1}</option>
                )      
            })}
        </select>
      </div>
    </>
  )
}
