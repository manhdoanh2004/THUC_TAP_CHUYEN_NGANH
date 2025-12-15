/* eslint-disable @typescript-eslint/no-unused-vars */
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

// Giả định bạn đã import các icon cần thiết (FaUserTie, FaBriefcase, FaLocationDot, FaClock, FaArrowRightLong)
// Mặc dù trong skeleton loading không cần icon, nhưng giữ lại cấu trúc cho các div bao quanh icon để đảm bảo layout không bị nhảy.

const JobDetailSkeleton = () => {
  return (
    // <SkeletonTheme baseColor="#D3D3D3" highlightColor="#EAEAEA"> // Có thể thêm SkeletonTheme nếu muốn tùy chỉnh màu
      <div className="pt-[30px] pb-[60px]">
        <div className="container mx-auto px-[16px]">
          {/* Wrap */}
          <div className="flex flex-wrap gap-[20px]">
            {/* Left */}
            <div className="lg:w-[65%] w-[100%]">
              {/* Thông tin công việc */}
              <div className="border border-[#DEDEDE] rounded-[8px] p-[20px]">
                {/* Tiêu đề công việc */}
                <h1 className="font-[700] sm:text-[28px] text-[24px] text-[#121212] mb-[10px]">
                  <Skeleton width="80%" />
                </h1>
                {/* Tên công ty */}
                <div className="font-[400] text-[16px] text-[#414042] mb-[10px]">
                  <Skeleton width="40%" />
                </div>
                {/* Mức lương */}
                <div className="font-[700] text-[20px] text-[#0088FF] sm:mb-[20px] mb-[10px]">
                  <Skeleton width="30%" />
                </div>
                {/* Nút Ứng tuyển & Lưu công việc */}
                <div className="flex justify-around items-center gap-[10px] mb-[20px]">
                  {/* Nút Ứng tuyển */}
                  <div className="rounded-[4px] flex-1 h-[48px]">
                    <Skeleton height="100%" />
                  </div>
                  {/* Nút Lưu */}
                  <div className="h-[48px] w-[48px]">
                     <Skeleton circle width="100%" height="100%" />
                  </div>
                </div>
                {/* Các dòng thông tin chi tiết */}
                <div className="flex items-center gap-[8px] font-[400] text-[14px] text-[#121212] mb-[10px]">
                  {/* Icon Vị trí */}
                  <div className="text-[16px] w-[16px] h-[16px]">
                    <Skeleton circle width="100%" height="100%" />
                  </div>{" "}
                  <Skeleton width="20%" />
                </div>
                <div className="flex items-center gap-[8px] font-[400] text-[14px] text-[#121212] mb-[10px]">
                  {/* Icon Hình thức làm việc */}
                  <div className="text-[16px] w-[16px] h-[16px]">
                    <Skeleton circle width="100%" height="100%" />
                  </div>{" "}
                  <Skeleton width="25%" />
                </div>
                <div className="flex items-center gap-[8px] font-[400] text-[14px] text-[#121212] mb-[10px]">
                  {/* Icon Địa điểm */}
                  <div className="text-[16px] w-[16px] h-[16px]">
                    <Skeleton circle width="100%" height="100%" />
                  </div>{" "}
                  {/* Các tag địa điểm */}
                  <div className="flex gap-[8px]">
                    <div className="border border-[#DEDEDE] rounded-[20px] py-[6px] px-[16px]">
                      <Skeleton width="40px" />
                    </div>
                    <div className="border border-[#DEDEDE] rounded-[20px] py-[6px] px-[16px]">
                      <Skeleton width="60px" />
                    </div>
                  </div>
                </div>
                {/* Các công nghệ */}
                <div className="flex flex-wrap gap-[8px]">
                  <Skeleton width="100px" />
                  {/* Các tag công nghệ */}
                  {[...Array(4)].map((_, index) => (
                    <div
                      key={index}
                      className="border border-[#DEDEDE] rounded-[20px] py-[6px] px-[16px]"
                    >
                      <Skeleton width="40px" />
                    </div>
                  ))}
                </div>
                {/* Hạn nộp */}
                <div className="ml-[-33px] mt-[5px] flex justify-start items-center gap-[8px] text-[16px] text-gray-500">
                  <span className="text-black flex justify-start items-center gap-[8px] ">
                    {/* Icon Đồng hồ */}
                    <div className="text-[16px] w-[16px] h-[16px]">
                        <Skeleton circle width="100%" height="100%" />
                    </div>{" "}
                    <Skeleton width="50px" />
                  </span>{" "}
                  <Skeleton width="100px" />
                </div>
              </div>
              {/* Hết Thông tin công việc */}

              {/* Mô tả chi tiết */}
              <div className="border border-[#DEDEDE] rounded-[8px] p-[20px] mt-[20px]">
                <div className="mb-[15px]">
                  <Skeleton count={1} height="20px" width="100%" />
                </div>
                <div className="mb-[15px]">
                  <Skeleton count={2} height="16px" width="95%" />
                </div>
                <div>
                  <Skeleton count={3} height="16px" width="80%" />
                </div>
              </div>
              {/* Hết Mô tả chi tiết */}

              {/* Form ứng tuyển (có thể thay bằng skeleton cho form nếu cần) */}
              <div className="border border-[#DEDEDE] rounded-[8px] p-[20px] mt-[20px]">
                <Skeleton count={1} height="30px" width="40%" className="mb-4" />
                <Skeleton count={1} height="40px" width="100%" className="mb-4" />
                <Skeleton count={1} height="150px" width="100%" className="mb-4" />
                <Skeleton count={1} height="48px" width="150px" />
              </div>

            </div>
            {/* Right */}
            <div className="flex-1">
              {/* Thông tin công ty */}
              <div className="border border-[#DEDEDE] rounded-[8px] p-[20px]">
                <div className="flex gap-[12px]">
                  {/* Logo công ty */}
                  <div className="w-[100px] h-[100px]">
                    <Skeleton circle width="100%" height="100%" />
                  </div>
                  <div className="flex-1">
                    {/* Tên công ty */}
                    <div className="font-[700] text-[18px] text-[#121212] mb-[10px]">
                      <Skeleton width="70%" />
                    </div>
                    {/* Link xem công ty */}
                    <div className="flex items-center gap-[8px] font-[400] text-[16px] text-[#0088FF]">
                      <Skeleton width="60%" />
                    </div>
                  </div>
                </div>
                <div className="mt-[20px] flex flex-col gap-[10px]">
                  {/* Thông tin chi tiết công ty */}
                  {[...Array(4)].map((_, index) => (
                    <div
                      key={index}
                      className="flex flex-wrap justify-between font-[400] text-[16px]"
                    >
                      <div className="text-[#A6A6A6]">
                        <Skeleton width="100px" />
                      </div>
                      <div className="text-[#121212]">
                        <Skeleton width="120px" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {/* Hết Thông tin công ty */}
            </div>
          </div>
        </div>
      </div>
    // </SkeletonTheme>
  );
};

export default JobDetailSkeleton;