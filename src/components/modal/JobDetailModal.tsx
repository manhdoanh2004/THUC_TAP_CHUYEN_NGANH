/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// components/JobDetailModal.tsx (Phiên bản ĐẦY ĐỦ đã thêm Status và Badge)

import React from 'react';
import Link from 'next/link'; 
import { FaUserTie, FaCalendarDay } from 'react-icons/fa6'; 
// Không cần FaBriefcase, FaLocationDot nếu các trường đó đã bị loại bỏ

// =======================================================
// 1. INTERFACE VÀ MAP CHO STATUS
// =======================================================

// Định nghĩa kiểu dữ liệu cho một mục trong STATUS_MAP
interface StatusConfig {
  label: string;
  bg: string;
  textColor: string;
}

// Định nghĩa kiểu cho toàn bộ map (chỉ chấp nhận các keys đã biết)
type StatusMap = {
    [key: string]: StatusConfig;
};

// Định nghĩa Map trạng thái và màu sắc
const STATUS_MAP: StatusMap = {
  'APPROVED': {
    label: 'Đã duyệt',
    bg: 'bg-emerald-100 dark:bg-emerald-800/20',
    textColor: 'text-emerald-700 dark:text-emerald-400'
  },
  'CANCELLED': {
    label: 'Hủy',
    bg: 'bg-amber-100 dark:bg-amber-800/20',
    textColor: 'text-amber-700 dark:text-amber-400'
  },
  'PENDING': {
    label: 'Chờ Xử Lý',
    bg: 'bg-blue-100 dark:bg-blue-800/20',
    textColor: 'text-blue-700 dark:text-blue-400'
  },
  'REJECTED': {
    label: 'Từ Chối',
    bg: 'bg-red-100 dark:bg-red-800/20',
    textColor: 'text-red-700 dark:text-red-400'
  },
};

// =======================================================
// 2. COMPONENT STATUS BADGE
// =======================================================

interface StatusBadgeProps {
    status: string; // Trạng thái hiện tại của Job
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
    // Lấy config tương ứng, nếu không tìm thấy, dùng trạng thái mặc định (ví dụ: PENDING)
    const config = STATUS_MAP[status] || STATUS_MAP['PENDING']; 

    return (
        <span 
            className={`
                ${config.bg} 
                ${config.textColor} 
                font-bold text-[14px] 
                py-1 px-3 
                rounded-full 
                inline-flex items-center 
                whitespace-nowrap
            `}
        >
            {config.label}
        </span>
    );
}

// =======================================================
// INTERFACE CỦA JOB (GIỮ NGUYÊN)
// =======================================================
interface Job {
  jobId: string;
  title: string;
  employerId: string;
  employerName: string; 
  description: string;
  salaryMin: number;
  salaryMax: number;
  position: string;
  technologies: string[];
  deadline: string;
  status: string; // Đã có trường status
}

interface JobDetailModalProps {
  job: Job | null;
  isOpen: boolean;
  onClose: () => void;
}

// Hàm format ngày tháng (Giữ nguyên)
const formatDate = (dateString: string): string => {
  try {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('vi-VN', options);
  } catch (e:any) {
    return dateString;
  }
};

// Hàm tạo Input Readonly (Giữ nguyên)
const ReadonlyInput: React.FC<{ label: string; value: string | number }> = ({ label, value }) => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type="text"
        value={value}
        readOnly 
        className="block w-full rounded-md border border-[#DEDEDE] bg-gray-50 text-[#121212] py-2 px-3 focus:outline-none cursor-default"
      />
    </div>
);


const JobDetailModal: React.FC<JobDetailModalProps> = ({ job, isOpen, onClose }) => {
  if (!isOpen || !job) return null;

  const jobDetail = job;

  return (
    <div 
      className="fixed w-[100%] mx-auto inset-0 bg-black/30 flex justify-center items-center z-10 transition-opacity duration-300"
      onClick={onClose}
    >
      <div 
        className="bg-white p-0 rounded-lg max-w-[750px] w-full max-h-[600px] overflow-y-auto shadow-2xl transform transition-transform duration-300 scale-100 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-3xl z-10 bg-white rounded-full p-2 leading-none shadow-md"
          >
            &times;
        </button>

        <div className="pt-[30px] pb-[60px]">
          <div className="container mx-auto px-[16px]">
            <div className="flex flex-wrap gap-[20px]">
              
              {/* Left (65%) */}
              <div className="lg:w-[65%] w-[100%]">
                {/* Thông tin công việc */}
                <div className="border border-[#DEDEDE] rounded-[8px] p-[20px]">
                  
                  <div className="flex justify-between items-start flex-wrap gap-2 mb-[10px]">
                     {/* 3. Hiển thị Title */}
                    <h1 className="font-[700] sm:text-[28px] text-[24px] text-[#121212] flex-1 min-w-0">
                        {jobDetail.title}
                    </h1>
                     {/* 3. Hiển thị Status Badge */}
                    <StatusBadge status={jobDetail.status} />
                  </div>

                  <div className="font-[400] text-[16px] text-[#414042] mb-[10px]">
                    {jobDetail.employerName}
                  </div>
                  <div className="font-[700] text-[20px] text-[#0088FF] sm:mb-[20px] mb-[10px]">
                    {jobDetail.salaryMin.toLocaleString("vi-VN")}$ -{" "}
                    {jobDetail.salaryMax.toLocaleString("vi-VN")}$
                  </div>
                  
                  {/* Dòng Vị trí */}
                  <div className="flex flex-wrap items-center gap-[8px] font-[400] text-[14px] text-[#121212] mb-[10px]">
                    <FaUserTie className="text-[16px] flex-shrink-0" /> {jobDetail.position}
                  </div>
                  
                  {/* Dòng Hạn chót (Deadline) */}
                  <div className="flex flex-wrap items-center gap-[8px] font-[400] text-[14px] text-[#121212] mb-[10px]">
                    <FaCalendarDay className="text-[16px] flex-shrink-0" /> Hạn chót: {formatDate(jobDetail.deadline)}
                  </div>
                  
                  <div className="flex flex-wrap gap-[8px]">
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
                </div>

                {/* Mô tả chi tiết */}
                
                <div className="border border-[#DEDEDE] rounded-[8px] p-[20px] mt-[20px]">
                    <div className='text-[18px] font-[600] '>Mô tả công việc :</div>
                  <div className='ml-[10px]'
                    dangerouslySetInnerHTML={{ __html: jobDetail.description }}
                  />
                </div>
              </div>
              
              {/* Right (35%) - Input Readonly */}
              <div className="lg:w-[calc(35%-20px)] w-[100%]">
                  <div className="border border-[#DEDEDE] rounded-[8px] p-[20px] sticky top-0">
                    <h3 className='font-bold text-lg mb-4'>Thông tin công việc </h3>
                    
                    <ReadonlyInput 
                      label="Trạng thái" 
                      value={STATUS_MAP[jobDetail.status]?.label || 'Không rõ'} 
                    />
                    
                    <ReadonlyInput 
                      label="Tên Công việc" 
                      value={jobDetail.title} 
                    />

                    <ReadonlyInput 
                      label="Vị trí" 
                      value={jobDetail.position} 
                    />
                    
                    <ReadonlyInput 
                      label="Công ty" 
                      value={jobDetail.employerName} 
                    />
                    
                    <ReadonlyInput 
                      label="Hạn chót ứng tuyển" 
                      value={formatDate(jobDetail.deadline)} 
                    />

                  </div>
              </div>
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetailModal;