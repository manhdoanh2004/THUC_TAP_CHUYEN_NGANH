/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
import { positionList, workingFromList } from "@/config/variables";
import { Metadata } from "next";
import Link from "next/link";
import {
  FaArrowRightLong,
  FaBriefcase,
  FaClock,
  FaLocationDot,
  FaUserTie,
} from "react-icons/fa6";
import { FormApply } from "./FormApply";
import FavoriteJobButton from "@/components/buttons/FavoriteJobButton";

export const metadata: Metadata = {
  title: "Chi tiết công việc",
  description: "Mô tả trang chi tiết công việc...",
};

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params;
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/jobs/${slug}`
  );
  const data = await res.json();

  let jobDetail: any = null;

  if (data.code == "success") {
    jobDetail = data.result;
    
    jobDetail.position = positionList.find(
      (item:any) => item.value == jobDetail.position
    )?.label;
    jobDetail.workingFrom = workingFromList.find(
      (item:any) => item.value == jobDetail.workingFrom
    )?.label;
  }

  return (
    <>
      {/* Chi tiết công việc */}
      {jobDetail && (
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
                  <div className="font-[700] text-[20px] text-[#0088FF] sm:mb-[20px] mb-[10px]">
                    {jobDetail.salaryMin.toLocaleString("vi-VN")}$ -{" "}
                    {jobDetail.salaryMax.toLocaleString("vi-VN")}$
                  </div>
                <div className="flex justify-around items-center gap-[10px] mb-[20px]">
    <Link
        href="#formApply"
        className="bg-[#0088FF] rounded-[4px] font-[700] text-[16px] text-white flex items-center justify-center flex-1 h-[48px] "
    >
        Ứng tuyển
    </Link>
    <FavoriteJobButton jobDetail={jobDetail}/>
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
                </div>
                {/* Hết Thông tin công việc */}

                {/* Mô tả chi tiết */}
                <div className="border border-[#DEDEDE] rounded-[8px] p-[20px] mt-[20px]">
                  <div
                    dangerouslySetInnerHTML={{ __html: jobDetail.description }}
                  />
                </div>
                {/* Hết Mô tả chi tiết */}

                {/* Form ứng tuyển */}
               
                    <FormApply jobId={slug}/>
              
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
      )}
      {/* Hết Chi tiết công việc */}
    </>
  );
}
