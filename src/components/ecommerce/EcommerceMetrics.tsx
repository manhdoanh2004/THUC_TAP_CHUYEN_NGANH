
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";
 import { BoxIconLine, GroupIcon } from "@/icons";

export const EcommerceMetrics = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true); // Mặc định là true để hiện loading ngay từ đầu

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch(`http://localhost:8080/api/dashboard/stats`, {
        credentials: "include",
        method: "GET",
      });

      const resultData = await res.json();
      if (resultData.code === 'success') {
        setData(resultData.result);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 1. Hiển thị Loading Spinner khi đang tải dữ liệu
  if (loading || !data) {
    return (
      <div className="flex items-center justify-center min-h-[200px] w-full">
        <div className="w-10 h-10 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  // 2. Hiển thị nội dung khi đã có dữ liệu
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
      {/* Metric Item Start: Customers */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
           <GroupIcon className="text-gray-800 size-6 dark:text-white/90" />
        </div>

        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Customers
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {(data.totalEmployers || 0) + (data.totalCandidates || 0)}
            </h4>
          </div>
        </div>
      </div>

      {/* Metric Item Start: Jobs */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <BoxIconLine className="text-gray-800 dark:text-white/90" />
         </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Jobs
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {data.totalJobs || 0}
            </h4>
          </div>
        </div>
      </div>
    </div>
  );
};
