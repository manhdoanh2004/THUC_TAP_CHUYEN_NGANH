'use client'
/* eslint-disable @typescript-eslint/no-explicit-any */
import { CardJobItem } from "@/components/card/CardJobItem";
import { useEffect, useState } from "react";
import { FaLocationDot } from "react-icons/fa6"; // Đảm bảo bạn đã cài react-icons


export const CompanyDetail = ({slug}:{slug:string}) => {
  // 1. Khai báo state để lưu dữ liệu
  const [companyDetail, setCompanyDetail] = useState<any>(null);
  const [jobList, setJobList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 2. Sử dụng useEffect để gọi API
  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        const form=new FormData();
        form.append("companyName",slug);
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/company/info/public`, {
          method: "POST",
          body: form
        });
        const data = await res.json();
    

        if (data.code === "success") {
          setCompanyDetail(data.result);
          setJobList(data.result.jobList || []);
        }
    
      } catch (error) {
        console.error("Lỗi khi gọi API:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyData();
  }, []); // Mảng rỗng [] đảm bảo API chỉ gọi 1 lần khi load trang

  // 3. Hiển thị trạng thái loading (tùy chọn)
  if (loading) {
    return <div className="text-center py-10">Đang tải dữ liệu...</div>;
  }

  return (
    <>
      <div className="pt-[30px] pb-[60px]">
        <div className="container mx-auto px-[16px]">
          {companyDetail ? (
            <>
              {/* Thông tin công ty */}
              <div className="border border-[#DEDEDE] rounded-[8px] p-[20px]">
                <div className="flex flex-wrap items-center gap-[16px] mb-[20px]">
                  <div className="w-[100px]">
                    <img
                      src={companyDetail.logo}
                      alt={companyDetail.companyName}
                      className="w-[100%] aspect-square object-cover rounded-[4px]"
                    />
                  </div>
                  <div className="sm:flex-1">
                    <h1 className="font-[700] text-[28px] text-[#121212] mb-[10px]">
                      {companyDetail.companyName}
                    </h1>
                    <div className="flex items-center gap-[8px] font-[400] text-[14px] text-[#121212]">
                      <FaLocationDot className="text-[16px]" />
                      {companyDetail.address}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-[10px]">
                  <div className="font-[400] text-[16px] text-[#A6A6A6]">
                    Mô hình công ty:{" "}
                    <span className="text-[#121212]">
                      {companyDetail.companyModel}
                    </span>
                  </div>
                  <div className="font-[400] text-[16px] text-[#A6A6A6]">
                    Quy mô công ty:{" "}
                    <span className="text-[#121212]">
                      {companyDetail.companyEmployees}
                    </span>
                  </div>
                  <div className="font-[400] text-[16px] text-[#A6A6A6]">
                    Thời gian làm việc:{" "}
                    <span className="text-[#121212]">
                      {companyDetail.workingTime}
                    </span>
                  </div>
                  <div className="font-[400] text-[16px] text-[#A6A6A6]">
                    Làm việc ngoài giờ:{" "}
                    <span className="text-[#121212]">
                      {companyDetail.workingOvertime}
                    </span>
                  </div>
                </div>
              </div>

              {/* Mô tả chi tiết */}
              <div className="border border-[#DEDEDE] rounded-[8px] p-[20px] mt-[20px]">
                <h3 className="font-bold mb-2">Mô tả chi tiết</h3>
                <div
                  dangerouslySetInnerHTML={{
                    __html: companyDetail.description || "",
                  }}
                />
              </div>

              {/* Việc làm */}
              <div className="mt-[30px]">
                <h2 className="font-[700] text-[28px] text-[#121212] mb-[20px]">
                  Công ty có {jobList.length} việc làm
                </h2>

                <div className="grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-[20px]">
                  {jobList.map((item: any, index: any) => (
                    <CardJobItem key={item.id || index} item={item} />
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="text-center">Không tìm thấy thông tin công ty.</div>
          )}
        </div>
      </div>
    </>
  );
};