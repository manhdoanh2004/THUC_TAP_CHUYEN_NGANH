
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Metadata } from "next"
import { headers } from "next/headers"
import Link from "next/link"
import {workingFromList,positionList} from "../../../../../../../config/variables"

export const metadata: Metadata = {
  title: "Chi tiết CV",
  description: "Mô tả trang chi tiết CV...",
}

export default async function CompanyManageCVDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {

  const { slug}=  await params;
 
  let cv=null;
  let job:any=null;
  let workingFrom=null;
  let positon=null;


  const headerList= await headers();
  const cookie= headerList.get("cookie");
  const res= await fetch(`${process.env.NEXT_PUBLIC_API_URL}/company/cv/detail/${slug}`,{
    headers:{
      cookie:cookie ||""
    },
    cache:"no-store"
  });
  const data= await res.json();

  if(data.code==="success")
  {
    cv=data.cvDetail;
    job=data.jobDetail;

    workingFrom=workingFromList.find(item=>item.value==job.workingForm)?.label;
    positon=positionList.find(item=>item.value==job.position)?.label;
  
  };




  return (
    <>
      <div className="py-[60px]">
        <div className="container mx-auto px-[16px]">
          {/* Thông tin CV */}
          {cv?(<>
                   <div className="border border-[#DEDEDE] rounded-[8px] p-[20px]">
            <div className="flex flex-wrap gap-[20px] items-center justify-between mb-[20px]">
              <h2 className="sm:w-auto w-[100%] font-[700] text-[20px] text-black">
                Thông tin CV
              </h2>
              <Link href={`/company-manage/cv/list`} className="font-[400] text-[14px] text-[#0088FF] underline">
                Quay lại danh sách
              </Link>
            </div>
            
            <div className="font-[400] text-[16px] text-black mb-[10px]">
              Họ tên:
              <span className="font-[700]">
              {cv.fullName}
              </span>
            </div>
            <div className="font-[400] text-[16px] text-black mb-[10px]">
              Email:
              <span className="font-[700]">
               {cv.email}
              </span>
            </div>
            <div className="font-[400] text-[16px] text-black mb-[10px]">
              Số điện thoại:
              <span className="font-[700]">
                {cv.phone}
              </span>
            </div>
            <div className="font-[400] text-[16px] text-black mb-[10px]">
              File CV:
            </div>
            <div className="bg-[#D9D9D9] h-[736px]">
              {/* Preview File CV dạng PDF tại đây */}
                <iframe src={cv.fileCV} className="w-full h-full"></iframe>
            </div>
          </div>
          </>):(<></>)}
          {/* Hết Thông tin CV */}
          
          {/* Thông tin công việc */}
            {job?(<>
                  <div className="border border-[#DEDEDE] rounded-[8px] p-[20px] mt-[20px]">
            <h2 className="sm:w-auto w-[100%] font-[700] text-[20px] text-black mb-[20px]">
              Thông tin công việc
            </h2>

            <div className="font-[400] text-[16px] text-black mb-[10px]">
              Tên công việc:
              <span className="font-[700] ml-[4px] ">
                {job.title}
              </span>
            </div>
            <div className="font-[400] text-[16px] text-black mb-[10px]">
              Mức lương:
              <span className="font-[700] ml-[4px] ">
               {job.salaryMin.toLocaleString('vi-VN')}$ - {job.salaryMax.toLocaleString('vi-VN')}$
              </span>
            </div>
            <div className="font-[400] text-[16px] text-black mb-[10px]">
              Cấp bậc:
              <span className="font-[700] ml-[4px] ">
               {positon}
              </span>
            </div>
            <div className="font-[400] text-[16px] text-black mb-[10px]">
              Hình thức làm việc:
              <span className="font-[700] ml-[4px] ">
               {workingFrom}
              </span>
            </div>
            <div className="font-[400] text-[16px] text-black mb-[10px] ">
              Công nghệ:
              <span className="font-[700] ml-[4px]">
                {job.technologies.join(",")}
              </span>
            </div>
            <Link href={`/company-manage/job/edit/${job.id}`} className="font-[400] text-[14px] text-[#0088FF] underline">
              Xem chi tiết công việc
            </Link>
          </div>
            </>):(<></>)}
          {/* Hết Thông tin công việc */}
        </div>
      </div>
    </>
  )
}