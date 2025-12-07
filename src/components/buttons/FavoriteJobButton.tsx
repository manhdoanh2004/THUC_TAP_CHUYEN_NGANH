/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import React, { useState } from 'react';

// Sử dụng Lucide Icons (Heart) cho ví dụ này
const Heart = (props: React.SVGProps<SVGSVGElement> & { filled: boolean }) => {
  // Destructure 'filled' và 'className' ra khỏi props, giữ lại 'rest'
  const { filled, className, ...rest } = props;

  return (
    <svg 
      {...rest} // Chỉ spread các props an toàn còn lại
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill={filled ? "currentColor" : "none"} 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className} // Sử dụng className đã tách
    >
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  );
};
interface FavoriteJobProps {
  jobDetail: any; // Thay 'any' bằng kiểu chính xác của jobDetail
  // Nếu bạn không cần props, hãy bỏ nó đi
  props?: any; 
}

const FavoriteJobButton: React.FC<FavoriteJobProps> = ({ jobDetail })=>{
  // State để quản lý trạng thái Đã lưu (true) hay Chưa lưu (false)
  const [isFavorite, setIsFavorite] = useState(false);
console.log(jobDetail)
  /**
   * Xử lý khi click vào nút
   * Thường là nơi gọi API để lưu/hủy lưu công việc.
   */
  const handleToggleFavorite = async () => {
    setIsFavorite(prev => !prev);
    // Trong môi trường thực tế, bạn sẽ gọi API ở đây:
    if (!isFavorite) {
        const form=new FormData();
        form.append("jobId",jobDetail.jobId)
      const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/user/liked-job`,{
        method:"POST",
        body:form,
        credentials:"include"
    }
  );
  const data = await res.json();
  if(data.code=="success")
  {
    setIsFavorite(prev => !prev);
  }
    } else {
      console.log('Đang gọi API để HỦY LƯU công việc...');
    }
  };

  // Điều chỉnh class để button có cùng chiều cao (h-48px) và bo góc (rounded-[4px]) với nút "Ứng tuyển"
  const buttonClass = isFavorite 
    ? "bg-red-500 hover:bg-red-600 text-white border border-red-500" // Giữ border đỏ khi đã lưu để tránh layout shift
    : "bg-white hover:bg-gray-100 text-gray-700 border border-gray-300";

  return (
    // Đã loại bỏ div bọc ngoài (p-4, bg-gray-50, shadow-lg) để component chỉ là nút bấm.
    <button
      onClick={handleToggleFavorite}
      className={`
        flex items-center justify-center 
        px-6 h-[48px] rounded-[4px] font-semibold text-[16px] transition-all duration-200 ease-in-out
        shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500
        ${buttonClass}
      `}
    >
      <Heart 
        filled={isFavorite} 
        className={`w-4 h-4 mr-2 transition-colors duration-200 
          ${isFavorite ? 'text-white' : 'text-red-500'}
        `} 
      />
      {isFavorite ? 'Đã Lưu' : 'Lưu Công Việc'}
    </button>
  );
};

export default FavoriteJobButton;