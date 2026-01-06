/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { useEffect, useState } from "react";
import { FaBriefcase, FaLocationDot, FaUserTie } from "react-icons/fa6";
import { positionList, workingFromList } from "@/config/variables";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { ButtonDelete } from "@/components/buttons/ButtonDelete";

export const JobList = () => {
  const STATUS_MAP: any = {
    APPROVED: {
      label: "Đã duyệt",
      bg: "bg-emerald-100 dark:bg-emerald-800/20",
      textColor: "text-emerald-700 dark:text-emerald-400",
    },
    CANCELLED: {
      label: "Hủy",
      bg: "bg-amber-100 dark:bg-amber-800/20",
      textColor: "text-amber-700 dark:text-amber-400",
    },
    PENDING: {
      label: "Chờ Xử Lý",
      bg: "bg-blue-100 dark:bg-blue-800/20",
      textColor: "text-blue-700 dark:text-blue-400",
    },
    REJECTED: {
      label: "Từ Chối",
      bg: "bg-red-100 dark:bg-red-800/20",
      textColor: "text-red-700 dark:text-red-400",
    },
  };

  const [totalPage, settotalPage] = useState<any>(1);
  const [jobList, setJobList] = useState<any[]>([]);
  const [page, Setpage] = useState<number>(1);
  const [count, Setcount] = useState<number>(1);
  const { infoCompany, isLogin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLogin === false) {
      router.push("/");
    }
  }, [isLogin]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/company/get-jobs`, {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.code == "success") {
          setJobList(data.result);
        }
      });
  }, [page, count]);

  const getStatusInfo = (status: any) =>
    STATUS_MAP[status] || {
      label: status,
      bg: "bg-gray-100 dark:bg-gray-700/50",
      textColor: "text-gray-600 dark:text-gray-400",
    };

  const handlePanigation = (event: any) => {
    const value = event.target.value;
    Setpage(parseInt(value));
  };

  const handleDeleteSuccess = () => {
    Setcount(count + 1);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Grid hệ thống: 1 cột cho mobile, 2 cho tablet, 3 cho desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobList && jobList.map((item: any) => {
          const statusInfo = getStatusInfo(item.status);
          const ipos = positionList.find((p) => p.value == item.position)?.label;
          const iwork = workingFromList.find((w) => w.value == item.workingFrom)?.label;

          return (
            <div
              key={item.jobId}
              className="group border border-gray-200 rounded-xl flex flex-col relative overflow-hidden transition-all duration-300 hover:shadow-xl"
              style={{
                background: "linear-gradient(180deg, #F6F6F6 2.38%, #FFFFFF 70.43%)",
              }}
            >
              {/* Ảnh nền card */}
              <img
                src="/assets/images/card-bg.svg"
                alt=""
                className="absolute top-0 left-0 w-full h-auto opacity-50"
              />

              {/* Logo công ty */}
              <div
                className="relative mt-6 w-24 h-24 bg-white mx-auto rounded-xl p-3 flex items-center justify-center transition-transform duration-300 group-hover:scale-105"
                style={{ boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)" }}
              >
                <img
                  src={item.companyLogo}
                  alt={item.title}
                  className="max-w-full max-h-full object-contain"
                />
              </div>

              {/* Nội dung chính */}
              <div className="flex-1 px-5 pt-5 pb-2 text-center">
                <h3 className="font-bold text-lg  line-clamp-2 min-h-[3.5rem] leading-tight mb-1">
                  {item.title}
                </h3>
                <p className="text-sm  truncate mb-3">
                  {infoCompany?.companyName}
                </p>

                {/* Salary */}
                <div className="mb-4">
                  {item.salaryMax < 0 || item.salaryMin < 0 ? (
                    <span className="inline-block border rounded-full px-4 py-1 text-xs font-medium ">
                      Lương thỏa thuận
                    </span>
                  ) : (
                    <p className="text-[#0088FF] font-bold text-lg">
                      {item.salaryMin.toLocaleString("vi-VN")}$ - {item.salaryMax.toLocaleString("vi-VN")}$
                    </p>
                  )}
                </div>

                {/* Info List */}
                <div className="space-y-2 text-sm ">
                  <div className="flex items-center justify-center gap-2">
                    <FaUserTie className=" shrink-0" /> 
                    <span className="truncate">{ipos}</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <FaBriefcase className=" shrink-0" /> 
                    <span className="truncate">{iwork}</span>
                  </div>
                  <div className="flex items-start justify-center gap-2">
                    <FaLocationDot className="shrink-0 mt-1" />
                    <div className="flex flex-wrap justify-center gap-1">
                      {item.location?.map((loc: any, idx: number) => (
                        <span key={idx} className="bg-white border border-gray-200 px-2 py-0.5 rounded text-[11px]">
                          {loc}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Tags Technologies */}
                <div className="mt-4 flex flex-wrap justify-center gap-1.5">
                  {item.technologies?.slice(0, 4).map((tech: any, idx: number) => (
                    <span key={idx} className="  border  rounded-full py-0.5 px-3 text-[11px] font-medium">
                      {tech}
                    </span>
                  ))}
                  {item.technologies?.length > 4 && (
                    <span className="text-[11px]  self-center">+{item.technologies.length - 4}</span>
                  )}
                </div>
              </div>

              {/* Status Badge */}
              <div className="mt-2 text-center">
                <span className={`inline-flex items-center px-4 py-1 rounded-full font-bold text-[11px] uppercase tracking-wider ${statusInfo.bg} ${statusInfo.textColor}`}>
                  {statusInfo.label}
                </span>
              </div>

              {/* Footer Actions */}
              <div className="flex items-center justify-center gap-3 p-5 mt-auto">
                <Link
                  href={`/company-manage/job/edit/${item.jobId}`}
                  className="flex-1 max-w-[100px] text-center bg-[#FFB200] hover:bg-[#e6a100] transition-colors rounded-lg font-bold text-sm text-black py-2.5 shadow-sm"
                >
                  Sửa
                </Link>
                <div className="flex-1 max-w-[100px]">
                  <ButtonDelete
                    api={`${process.env.NEXT_PUBLIC_API_URL}/api/jobs`}
                    item={item}
                    onDeleteSuccess={handleDeleteSuccess}
                    content="Bạn có muốn xóa công việc này không?"
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      {totalPage > 0 && (
        <div className="mt-10 flex justify-center sm:justify-start">
          <div className="relative group">
            <select
              onChange={handlePanigation}
              className="appearance-none cursor-pointer bg-white border border-gray-300 rounded-lg py-2.5 pl-4 pr-10 font-medium text-sm text-gray-700 hover:border-[#0088FF] focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
            >
              {Array(totalPage)
                .fill("")
                .map((_, index) => (
                  <option key={index + 1} value={index + 1}>
                    Trang {index + 1}
                  </option>
                ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};