import React from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { FaUserTie, FaBriefcase, FaLocationDot } from "react-icons/fa6";

const JobCardSkeleton = () => {
  return (
    // Dùng SkeletonTheme để áp dụng màu và hiệu ứng chung (tùy chọn)
    <SkeletonTheme baseColor="#DEDEDE" highlightColor="#EFEFEF">
      <div
        className="border border-[#DEDEDE] rounded-[8px] flex flex-col relative truncate animate-pulse"
        style={{
          background: "linear-gradient(180deg, #F6F6F6 2.38%, #FFFFFF 70.43%)",
        }}
      >
        {/* Placeholder cho background image (có thể bỏ qua hoặc dùng một div màu) */}
        <div className="absolute top-[0px] left-[0px] w-[100%] h-auto opacity-50">
           {/* Giả lập màu nền hoặc bỏ qua nếu không cần thiết */}
        </div>

        {/* Logo Placeholder */}
        <div
          className="relative mt-[20px] w-[116px] h-[116px] bg-white mx-auto rounded-[8px] p-[10px]"
          style={{
            boxShadow: "0px 4px 24px 0px #0000001F",
          }}
        >
          {/* Skeleton hình tròn/vuông cho Logo */}
          <div className="w-[100%] h-[100%]">
            <Skeleton width="100%" height="100%" borderRadius="8px" />
          </div>
        </div>

        {/* Title Placeholder (2 dòng) */}
        <h3 className="mt-[20px] mx-[16px] font-[700] text-[18px] text-[#121212] text-center flex-1 whitespace-normal line-clamp-2">
          <Skeleton count={2} height={20} style={{ marginBottom: 6 }} />
        </h3>

        {/* Company Name Placeholder */}
        <div className="mt-[6px] text-center font-[400] text-[14px] text-[#121212]">
          <Skeleton width={120} height={18} style={{ margin: '0 auto' }} />
        </div>
        {/* Position Placeholder */}
        <div className="mt-[6px] flex justify-center items-center gap-[8px] font-[400] text-[14px] text-[#121212]">
          <FaUserTie className="text-[16px] text-[#DEDEDE]" /> {/* Icon có thể giữ nguyên nhưng đổi màu xám */}
          <Skeleton width={60} height={16} />
        </div>

        {/* Working Form Placeholder */}
        <div className="mt-[6px] flex justify-center items-center gap-[8px] font-[400] text-[14px] text-[#121212]">
          <FaBriefcase className="text-[16px] text-[#DEDEDE]" /> {/* Icon có thể giữ nguyên nhưng đổi màu xám */}
          <Skeleton width={80} height={16} />
        </div>

        {/* Location Tags Placeholder */}
        <div className="mt-[12px] mb-[20px] mx-[16px] items-center flex flex-wrap justify-center gap-[4px]">
          <FaLocationDot className="text-[16px] text-[#DEDEDE]" />
          
          {/* Giả lập 3 thẻ tag */}
          <Skeleton 
            count={3} 
            width={70} 
            height={28} 
            borderRadius={20} 
            inline 
            style={{ margin: '0 2px' }}
          />
        </div>
      </div>
    </SkeletonTheme>
  );
};

export default JobCardSkeleton;