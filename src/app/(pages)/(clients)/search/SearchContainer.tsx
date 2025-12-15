"use client"

import { CardJobItem } from "@/components/card/CardJobItem";
import JobCardSkeleton from "@/components/card/JobCartSkeleton";
import MultiCitySelect from "@/components/select/MultiCitySelect";
import { positionList, workingFromList } from "@/config/variables";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useMemo, useState, useCallback } from "react";

// Định nghĩa interface cho job item để tránh dùng 'any'
interface Job {
    jobId: number;
    // Thêm các thuộc tính khác của job nếu cần
}

export const SearchContainer = () => {
    const searchParams = useSearchParams();
    const router = useRouter();

    // Lấy params
    const language = searchParams.get("language") || "";
    const keyword = searchParams.get("keyword") || "";
    const position = searchParams.get("position") || "";
    const workingForm = searchParams.get("workingForm") || "";
    
    // city là mảng, dùng useMemo để tránh re-render không cần thiết
    const city = useMemo(() => {
        if(searchParams.get("city")!="")
        {
            return searchParams.get("city")?.split(",") || [];
        }
        return  [];
    }, [searchParams]);

    console.log(city)
    // Trạng thái
    const [jobList, setJobList] = useState<Job[] | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPage, setTotalPage] = useState(0);
    const [totalRecord, setTotalRecord] = useState<number | undefined>();


    // Hàm cập nhật URL search params
    const updateSearchParams = useCallback((key: string, value: string | null) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value) {
            params.set(key, value);
        } else {
            params.delete(key);
        }
        router.push(`?${params.toString()}`);
    }, [searchParams, router]);


    // Fetch Data
  useEffect(() => {
    setIsLoading(true);
    setJobList(null); // Reset job list khi params thay đổi

    // 1. Chuẩn bị Body dưới dạng Object
    const requestBody = {
        language: language,
        workingFrom: workingForm,
        position: position,
        keyword: keyword,
        salaryRange: '',
        location: city 
    };
    
    // 2. Định nghĩa hàm fetch
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/jobs/search`, {
        method: "POST", 
        headers: {
            'Content-Type': 'application/json' 
        },
        body: JSON.stringify(requestBody) 
    })
    .then(res => {
        if (!res.ok) {
            // Xử lý lỗi HTTP
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
    })
    .then(data => {
        if (data.code === "success") {
            setJobList(data.result?.content || []);
            setTotalPage(data.totalPages || 0);
            setTotalRecord(data.totalElements);
        } else {
             setJobList([]);
             setTotalPage(0);
             setTotalRecord(0);
        }
    })
    .catch(error => {
        console.error("Error fetching job list:", error);
        setJobList([]);
        setTotalPage(0);
        setTotalRecord(0);
    })
    .finally(() => {
        setIsLoading(false);
    });
    
}, [language, city, keyword, position, workingForm, page]); // Dependencies vẫn giữ nguyên
    // Handlers
    const handleFilterPosition = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setPage(1); // Reset page về 1 khi lọc
        updateSearchParams("position", event.target.value || null);
    }

    const handleFilterWorkingForm = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setPage(1); // Reset page về 1 khi lọc
        updateSearchParams("workingForm", event.target.value || null);
    }
    
    // Sử dụng kiểu dữ liệu phù hợp (string[]) cho cities
    const handleCities = (cities: string[]) => {
        setPage(1); // Reset page về 1 khi lọc
        const stringCity = cities.join(",");
        console.log(stringCity)
        updateSearchParams("city", stringCity || null);
    }

    const handlePagination = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setPage(parseInt(event.target.value));
    }

    const displayCities = city.length > 0 ? city.join(", ") : null;

    return (
        <>
            <div className="container mx-auto px-[16px]">
                
                <h2 className="font-[700] text-[28px] text-[#121212] mb-[30px]">
                    {totalRecord || 0} việc làm: 
                    <span className="text-[#0088FF] ml-[6px]">
                        {language} {displayCities} {keyword}
                    </span>
                </h2>
            
                <div 
                    className="bg-white rounded-[8px] py-[10px] px-[20px] mb-[30px] flex flex-wrap gap-[12px]"
                    style={{
                        boxShadow: "0px 4px 20px 0px #0000000F"
                    }}
                >
                    <select 
                        className="border border-[#DEDEDE] rounded-[20px] h-[36px] px-[18px] font-[400] text-[16px] text-[#414042]"
                        onChange={handleFilterPosition}
                        value={position} // Sử dụng 'value' thay vì 'defaultValue' để kiểm soát state
                    >
                        <option value="">Cấp bậc</option>
                        {positionList.map((item, index) => (
                            <option key={index} value={item.value}>{item.label}</option>
                        ))}
                    </select>
                    <select 
                        className="border border-[#DEDEDE] rounded-[20px] h-[36px] px-[18px] font-[400] text-[16px] text-[#414042]"
                        onChange={handleFilterWorkingForm}
                        value={workingForm} // Sử dụng 'value' thay vì 'defaultValue'
                    >
                        <option value="">Hình thức làm việc</option>
                        {workingFromList.map((item, index) => (
                            <option key={index} value={item.value}>{item.label}</option>
                        ))}
                    </select>
                    
                    <MultiCitySelect onHandleCities={handleCities} />
                </div>

                <div className="grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-[20px]">
                    {isLoading ? (
                        // Skeleton khi đang tải
                        Array(6).fill("").map((_, index: number) => <JobCardSkeleton key={index}/>)
                    ) : jobList && jobList.length > 0 ? (
                        // Danh sách việc làm
                        jobList.map(item => (
                            <CardJobItem key={item.jobId} item={item} />
                        ))
                    ) : (
                        // Không có kết quả
                        <div className="col-span-full text-center py-10 text-gray-500">
                            Không tìm thấy việc làm nào.
                        </div>
                    )}
                </div>

                {totalPage > 1 && ( // Chỉ hiển thị khi có nhiều hơn 1 trang
                    <div className="mt-[30px]">
                        <select 
                            className="border border-[#DEDEDE] rounded-[8px] py-[12px] px-[18px] font-[400] text-[16px] text-[#414042]"
                            onChange={handlePagination}
                            value={page} // Hiển thị trang hiện tại
                        >
                            {Array.from({ length: totalPage }, (_, index) => (
                                <option key={index} value={index + 1}>Trang {index + 1}</option>
                            ))}
                        </select>
                    </div>
                )}
            </div>
        </>
    )
}