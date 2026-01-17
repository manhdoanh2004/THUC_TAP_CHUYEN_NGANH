/* eslint-disable @typescript-eslint/no-unused-vars */

/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { ButtonDelete } from "@/components/buttons/ButtonDelete";
import { cvStatusList } from "@/config/variables";
import Link from "next/link"
import { useMemo, useState } from "react";
import { FaBriefcase, FaCircleCheck, FaEnvelope, FaEye, FaPhone, FaUserTie } from "react-icons/fa6"

export const CvItem = (props: {
  item: any,
  isAction:boolean,
  onDeleteSuccess:(id:string)=>void;
  onChangeStatus:(id:string,status:string)=>void;
  onViewDetailCV:(item:any)=>void;
}) => {
  const { item,onDeleteSuccess,onChangeStatus,onViewDetailCV} = props;
  const statusDefault = useMemo(()=>
  {
    return cvStatusList.find(itemStatus => itemStatus.value == item.status);
  },[item])


   
  return (
    <>
      <div 
        className="border border-[#DEDEDE] rounded-[8px] flex flex-col relative truncate"
        style={{
          background: "linear-gradient(180deg, #F6F6F6 2.38%, #FFFFFF 70.43%)"
        }}
      >
        <img 
          src="/assets/images/card-bg.svg" 
          alt="" 
          className="absolute top-[0px] left-[0px] w-[100%] h-auto" 
        />
        <h3 className="mt-[20px] mx-[16px] font-[700] text-[18px] text-[#121212] text-center flex-1 whitespace-normal line-clamp-2">
          {item.title}
        </h3>
        <div className="mt-[12px] text-center font-[400] text-[14px] text-black">
          Ứng viên: <span className="font-[700]">{item.name}</span>
        </div>
        <div className="mt-[6px] flex justify-center items-center gap-[8px] font-[400] text-[14px] text-[#121212]">
          <FaEnvelope className="" /> {item.email}
        </div>
        <div className="mt-[6px] flex justify-center items-center gap-[8px] font-[400] text-[14px] text-[#121212]">
          <FaPhone className="" /> {item.phone}
        </div>
           <div className="mb-4 text-center">
                  {item.salaryMax < 0 || item.salaryMin < 0 ? (
                    <span className="inline-block  px-4 py-1 text-[16px] font-medium  ">
                      Lương thỏa thuận
                    </span>
                  ) : (
                    <p className="text-[#0088FF] font-bold text-lg">
                      {item.salaryMin.toLocaleString("vi-VN")}$ - {item.salaryMax.toLocaleString("vi-VN")}$
                    </p>
                  )}
                </div>
        <div className="mt-[6px] flex justify-center items-center gap-[8px] font-[400] text-[14px] text-[#121212]">
          <FaUserTie className="text-[16px]" /> {item.jobPosition}
        </div>
        <div className="mt-[6px] flex justify-center items-center gap-[8px] font-[400] text-[14px] text-[#121212]">
          <FaBriefcase className="text-[16px]" /> {item.jobWorkingFrom}
        </div>
        <div 
          className={
            "mt-[6px] flex justify-center items-center gap-[8px] font-[400] text-[14px] "
            + (statusDefault?.value!="PENDING" ? "text-[#121212]" : "text-[#FF0000]")
          }
        >
          <FaEye className="text-[16px]" /> {item.status=="REVIEWING" ? "Đã xem" : "Chưa xem"}
        </div>
        {statusDefault?.value=="APPROVED"||statusDefault?.value=="REJECTED" ?(<>
            <div 
          className="mt-[6px] flex justify-center items-center gap-[8px] font-[400] text-[14px]"
          style={{
            color: statusDefault?.color
          }}
        >
          <FaCircleCheck className="text-[16px]" /> {statusDefault?.label}
        </div>
        </>):(<></>)}
    
   <div className="relative mt-[12px] mb-[20px] mx-[10px]">
  {/* Lớp phủ Loading - Chỉ hiện khi isLoading = true */}
  {item.isAction && (
    <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/60 rounded-[4px] cursor-not-allowed">
      <div className="w-5 h-5 border-2 border-[#0088FF] border-t-transparent rounded-full animate-spin"></div>
    </div>
  )}

  {/* Nhóm các nút Action */}
  <div className={`flex flex-wrap items-center justify-center gap-[8px] ${item.isAction ? 'opacity-50 pointer-events-none' : ''}`}>
    <button 
      onClick={() => onViewDetailCV(item)}
      className="bg-[#0088FF] rounded-[4px] font-[400] text-[14px] text-white inline-block py-[8px] px-[20px]"
    >
      Xem
    </button>

    {(statusDefault?.value == "PENDING" || statusDefault?.value == "REVIEWING" || statusDefault?.value == "REJECTED") && (
      <button 
        onClick={() => onChangeStatus("APPROVED", item.applicationId)} 
        className="bg-[#9FDB7C] rounded-[4px] font-[400] text-[14px] text-black inline-block py-[8px] px-[20px]"
      >
        Duyệt
      </button>
    )}

    {(statusDefault?.value == "PENDING" || statusDefault?.value == "REVIEWING" || statusDefault?.value == "APPROVED") && (
      <button 
        onClick={() => onChangeStatus("REJECTED", item.applicationId)} 
        className="bg-[#FF5100] rounded-[4px] font-[400] text-[14px] text-white inline-block py-[8px] px-[20px]"
      >
        Từ chối
      </button>
    )}

    <ButtonDelete 
      api={`${process.env.NEXT_PUBLIC_API_URL}/api/applications/${item.applicationId}`}
      item={item}
      onDeleteSuccess={onDeleteSuccess}
      content="Bạn có muốn xóa CV này không?"
    />
  </div>
</div>
       
      </div>
    </>
  )
}
