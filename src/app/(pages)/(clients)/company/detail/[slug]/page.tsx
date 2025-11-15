
/* eslint-disable @typescript-eslint/no-explicit-any */

/* eslint-disable @next/next/no-img-element */
import { CardJobItem } from "@/components/card/CardJobItem";
import { Metadata } from "next"
import { FaLocationDot } from "react-icons/fa6"


export const metadata: Metadata = {
  title: "Chi tiết công ty",
  description: "Mô tả trang chi tiết công ty...",
}

export default async function CompanyDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {

  const  {slug }= await params;
  let companyDetail=null;
  let jobList=[];


  const res =await fetch(`${process.env.NEXT_PUBLIC_API_URL}/company/detail/${slug}`);
  const data = await res.json();
 

  if(data.code==="success")
  {
      companyDetail=data.companyDetail;
      jobList=data.jobList;
  }

  return (
    <>
      <div className="pt-[30px] pb-[60px]">
        <div className="container mx-auto px-[16px]">
          {companyDetail?(<>
                {/* Thông tin công ty */}
          <div className="border border-[#DEDEDE] rounded-[8px] p-[20px]">
            <div className="flex flex-wrap items-center gap-[16px] mb-[20px]">
              <div className="w-[100px]">
                <img 
                  src={companyDetail.logo} 
                  alt={companyDetail.fullName}
                  className="w-[100%] aspect-square object-cover rounded-[4px]"
                />
              </div>
              <div className="sm:flex-1">
                <h1 className="font-[700] text-[28px] text-[#121212] mb-[10px]">
                 {companyDetail.companyName}
                </h1>
                <div className="flex items-center gap-[8px] font-[400] text-[14px] text-[#121212]">
                  <FaLocationDot className="text-[16px]" />{companyDetail.address}
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-[10px]">
              <div className="font-[400] text-[16px] text-[#A6A6A6]">
                Mô hình công ty:
                <span className="text-[#121212]">
                {companyDetail.companyModel}
                </span>
              </div>
              <div className="font-[400] text-[16px] text-[#A6A6A6]">
                Quy mô công ty:
                <span className="text-[#121212]">
                 {companyDetail.companyEmployees}
                </span>
              </div>
              <div className="font-[400] text-[16px] text-[#A6A6A6]">
                Thời gian làm việc:
                <span className="text-[#121212]">
                    {companyDetail.workingTime}
                </span>
              </div>
              <div className="font-[400] text-[16px] text-[#A6A6A6]">
                Làm việc ngoài giờ:
                <span className="text-[#121212]">
                {companyDetail.workOvertime}
                </span>
              </div>
            </div>
          </div>
          {/* Hết Thông tin công ty */}

          {/* Mô tả chi tiết */}
          <div className="border border-[#DEDEDE] rounded-[8px] p-[20px] mt-[20px]">
            Mô tả chi tiết
              <div dangerouslySetInnerHTML={{__html:companyDetail.description||''}}/>
          </div>
          {/* Hết Mô tả chi tiết */}

          {/* Việc làm */}
          <div className="mt-[30px]">
            <h2 className="font-[700] text-[28px] text-[#121212] mb-[20px]">
              Công ty có {jobList.length} việc làm
            </h2>
      
            <div className="grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-[20px]">
                {jobList.map((item:any,index:any)=><CardJobItem key={index} item={item} />)} 
            </div>
          </div>
          {/* Hết Việc làm */}
          </>):(<></>)}
        
            
        </div>
      </div>
    </>
  )
}