/* eslint-disable @typescript-eslint/no-explicit-any */
import { IoClose } from "react-icons/io5"; // Cài react-icons nếu chưa có

export const ModalCVDetail = ({ isOpen, onClose, cv}:{isOpen: boolean, onClose: () => void, cv?: any}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-[16px]">
      {/* Container của Modal */}
      <div 
        className="bg-white w-full max-w-[900px] max-h-[90vh] overflow-y-auto rounded-[12px] shadow-2xl relative animate-in fade-in zoom-in duration-300"
      >
        {/* Nút đóng nhanh */}
        <button 
          onClick={onClose}
          className="absolute top-[20px] right-[20px] text-[24px] text-[#666] hover:text-red-500 transition-all z-20"
        >
          <IoClose />
        </button>

        <div className="p-[20px] md:p-[40px]">
          {/* Thông tin CV */}
          {cv ? (
            <div className="border border-[#DEDEDE] rounded-[8px] p-[20px]">
              <div className="flex flex-wrap gap-[20px] items-center justify-between mb-[20px]">
                <h2 className="font-[700] text-[22px] text-black">
                  Thông tin CV
                </h2>
              </div>

              <div className="space-y-[10px]">
                <div className="font-[400] text-[16px] text-black">
                  Họ tên: <span className="font-[700]">{cv.name}</span>
                </div>
                <div className="font-[400] text-[16px] text-black">
                  Email: <span className="font-[700]">{cv.email}</span>
                </div>
                <div className="font-[400] text-[16px] text-black">
                  Số điện thoại: <span className="font-[700]">{cv.phone}</span>
                </div>
                <div className="font-[400] text-[16px] text-black">
                  File CV:
                </div>
                <div className="bg-[#D9D9D9] h-[500px] md:h-[600px] rounded-[4px] overflow-hidden mt-[10px]">
                      <iframe 
                        src={`${cv.cv}#toolbar=0&navpanes=0&scrollbar=0`} 
                        className="w-full h-full" 
                        title="CV Preview"
                      ></iframe>
                    </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-10">Đang tải dữ liệu CV...</div>
          )}

          {/* Thông tin công việc */}
          {cv && (
            <div className="border border-[#DEDEDE] rounded-[8px] p-[20px] mt-[20px]">
              <h2 className="font-[700] text-[20px] text-black mb-[20px]">
                Thông tin công việc
              </h2>

              <div className="space-y-[10px]">
                <div className="font-[400] text-[16px] text-black">
                  Tên công việc: <span className="font-[700] ml-[4px]">{cv.title}</span>
                </div>
                <div className="font-[400] text-[16px] text-black">
                  Mức lương: 
                  <span className="font-[700] ml-[4px]">
                    {cv.salaryMin?.toLocaleString('vi-VN')}$ - {cv.salaryMax?.toLocaleString('vi-VN')}$
                  </span>
                </div>
                <div className="font-[400] text-[16px] text-black">
                  Cấp bậc: <span className="font-[700] ml-[4px]">{cv.jobPosition}</span>
                </div>
                <div className="font-[400] text-[16px] text-black">
                  Hình thức: <span className="font-[700] ml-[4px]">{cv.jobWorkingFrom}</span>
                </div>
                <div className="font-[400] text-[16px] text-black">
                  Công nghệ: <span className="font-[700] ml-[4px]">{cv.technologies?.join(", ")}</span>
                </div>
                <div className="font-[400] text-[16px] text-black">
                  Địa điểm : <span className="font-[700] ml-[4px]">{cv.location?.join(", ")}</span>
                </div>
                <div className="font-[400] text-[16px] text-black">
                 Hạn ứng tuyển : <span className="font-[700] ml-[4px]">{cv.deadline}</span>
                </div>
                <div className="font-[400] text-[16px] text-black">
                 Mô tả  : <span className="font-[700] ml-[4px]" dangerouslySetInnerHTML={{ __html: cv.description||"" }} ></span>
                </div>
              </div>
            </div>
          )}

          {/* Nút đóng ở dưới cùng */}
          <div className="mt-[30px] flex justify-end">
            <button 
              onClick={onClose}
              className="bg-[#6c757d] text-white px-[24px] py-[8px] rounded-[4px] hover:bg-black transition-all"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};