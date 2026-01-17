import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const CardCVSkeleton = () => {
  return (
    <div 
      className="border border-[#DEDEDE] rounded-[8px] flex flex-col relative truncate"
      style={{
        background: "linear-gradient(180deg, #F6F6F6 2.38%, #FFFFFF 70.43%)"
      }}
    >
      {/* Giữ lại ảnh background trang trí hoặc thay bằng Skeleton nếu muốn */}
      <Skeleton 
        // src="/assets/images/card-bg.svg" 
        // alt="" 
        className="absolute top-[0px] left-[0px] w-[100%] h-auto opacity-50" 
      />

      {/* Title Skeleton */}
      <div className="mt-[20px] mx-[16px] flex justify-center">
        <Skeleton width="80%" height={24} />
      </div>

      {/* Candidate Name */}
      <div className="mt-[12px] text-center">
        <Skeleton width="60%" height={18} />
      </div>

      {/* Email & Phone */}
      <div className="mt-[6px] flex justify-center items-center gap-[8px]">
         <Skeleton circle width={14} height={14} /> <Skeleton width={120} height={14} />
      </div>
      <div className="mt-[6px] flex justify-center items-center gap-[8px]">
         <Skeleton circle width={14} height={14} /> <Skeleton width={100} height={14} />
      </div>

      {/* Salary */}
      <div className="mt-[12px] text-center">
        <Skeleton width="50%" height={20} />
      </div>

      {/* Job Info Rows */}
      <div className="mt-[6px] flex justify-center items-center gap-[8px]">
        <Skeleton width="40%" height={14} />
      </div>
      <div className="mt-[6px] flex justify-center items-center gap-[8px]">
        <Skeleton width="45%" height={14} />
      </div>

      {/* Status Row */}
      <div className="mt-[6px] flex justify-center items-center gap-[8px]">
        <Skeleton width="30%" height={14} />
      </div>

      {/* Buttons Skeleton */}
      <div className="flex flex-wrap items-center justify-center gap-[8px] mt-[12px] mb-[20px] mx-[10px]">
        <Skeleton width={60} height={36} borderRadius={4} />
        <Skeleton width={70} height={36} borderRadius={4} />
        <Skeleton width={80} height={36} borderRadius={4} />
        <Skeleton width={40} height={36} borderRadius={4} />
      </div>
    </div>
  );
};

export default CardCVSkeleton;