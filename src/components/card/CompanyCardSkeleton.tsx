import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
// Lưu ý: Nếu bạn dùng icon (FaUserTie), bạn có thể thay thế icon bằng div/Skeleton tròn.

const CompanyCardSkeleton = () => {
  // Lấy lại các class và style từ component gốc của bạn
  const cardClassName = "border border-[#DEDEDE] rounded-[8px] flex flex-col relative truncate";
 

  return (
    // Sử dụng SkeletonTheme để thiết lập màu sắc nhất quán (tùy chọn)
    <SkeletonTheme>
      <div className={cardClassName} >
        
        {/* 1. MÔ PHỎNG CARD BACKGROUND (Phần này có thể giữ nguyên như div) */}
        {/* Thường thì phần background cố định này không cần dùng Skeleton */}
        <div 
          className="absolute top-[0px] left-[0px] w-full h-full" 
          style={{ background: 'rgba(255,255,255, 0.1)' }} 
        />
        
        {/* 2. MÔ PHỎNG VỊ TRÍ LOGO */}
        <div 
          className="relative sm:mt-[32px] mt-[20px] sm:w-[160px] w-[125px] sm:h-[160px] h-[125px] bg-white mx-auto rounded-[8px] p-[10px] flex items-center justify-center"
          style={{ boxShadow: "0px 4px 24px 0px #0000001F" }}
        >
          {/* Sử dụng Skeleton với shape là rectangular, width/height để căn chỉnh kích thước logo */}
          <Skeleton width="100%" height="100%" borderRadius="4px" />
        </div>
        
        {/* 3. MÔ PHỎNG TÊN CÔNG TY (companyName) */}
        <div className="sm:my-[24px] my-[16px] sm:mx-[16px] mx-[8px] font-[700] sm:text-[18px] text-[14px] text-center flex-1">
          {/* count={2} để mô phỏng line-clamp-2 */}
          {/* Điều chỉnh height theo font size (ví dụ: 1.2em) hoặc theo px */}
          <Skeleton count={2} height="1.2em" /> 
        </div>
        
        {/* 4. MÔ PHỎNG FOOTER CARD (Vị trí và Số việc làm) */}
        <div className="bg-[#F7F7F7] flex items-center sm:justify-between justify-center gap-[12px] py-[12px] px-[16px]">
          
          {/* Placeholder cho Tên Thành phố (cityName) */}
          <div className="font-[400] sm:text-[14px] text-[12px] flex-1">
            {/* Chiều rộng cố định cho tên thành phố */}
            <Skeleton width={80} height="1em" /> 
          </div>
          
          {/* Placeholder cho Tổng số việc làm (totalJob) */}
          <div className="inline-flex items-center gap-x-[6px] font-[400] sm:text-[14px] text-[12px]">
            {/* Mô phỏng icon và text */}
            <Skeleton circle width={16} height={16} /> {/* Icon */}
            <Skeleton width={100} height="1em" />      {/* Text "X Việc làm" */}
          </div>
        </div>
      </div>
    </SkeletonTheme>
  );
};

export default CompanyCardSkeleton;