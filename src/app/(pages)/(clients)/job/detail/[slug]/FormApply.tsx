/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import Swal from 'sweetalert2'

import JustValidate from "just-validate";
import React, { useEffect, useState } from "react";
import { FaEye, FaEyeSlash, FaFilePdf, FaSpinner } from "react-icons/fa6";
import { Toaster, toast } from 'sonner';
import { IoClose } from "react-icons/io5"; 
import Link from "next/link";
import { FaCity } from "react-icons/fa";
import {
  FaArrowRightLong,
  FaBriefcase,
  FaClock,
  FaLocationDot,
  FaUserTie,
} from "react-icons/fa6";
import FavoriteJobButton from "@/components/buttons/FavoriteJobButton";
import JobDetailSkeleton from "@/components/card/JobDetailSkeleton";
import { useAuth } from '@/context/AuthContext';

// const FormApply = ({ jobId, isLogin, setIsSubmitApplied,isSubmitApplied,oldCv,setIsApplied }: any) => {
//   const [fileName, setFileName] = useState<string>('');
//   const [useExistingCv, setUseExistingCv] = useState<boolean>(false);
//   const [existingCvUrl, setExistingCvUrl] = useState<string | null>(oldCv);
//   const [showPreview, setShowPreview] = useState<boolean>(false);


//   useEffect(()=>
//   {
// setExistingCvUrl(oldCv);
//   },[oldCv])

//   const handleClearFile = () => {
//     setFileName('');
//     const fileInput = document.getElementById("cv") as HTMLInputElement;
//     if (fileInput) fileInput.value = '';
//   };

//   const handleSuccess = (event: any) => {
//     const formData = new FormData(event.target);
//     formData.append("jobId", jobId);
//     formData.append("isOldCv", `${useExistingCv}`); // Gửi flag báo cho backend biết dùng CV cũ hay mới

//     const promise = fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/applications`, {
//       method: "POST",
//       body: formData,
//       credentials: "include"
//     }).then(async (res) => {
//       const data = await res.json();
//       if (data.code === "error") throw new Error(data.message);
//       setIsSubmitApplied(true);
//       setIsApplied(true);
//       return data;
//     }).catch((error)=>{
//       console.log(error);
//     })

//     toast.promise(promise, {
//       loading: "Đang gửi CV...",
//       success: (data) => {
        
//         event.target.reset();
//         handleClearFile();
//         return `${data.message}`;
//       },
//       error: (err) => err.message || "Đã xảy ra lỗi!",
//     });
//   };

//   useEffect(() => {
//     if (isLogin) {
//       const validator = new JustValidate("#formApplyBody");
//       validator
//         .addField('#name', [{ rule: 'required', errorMessage: 'Nhập họ tên!' }])
//         .addField('#email', [{ rule: 'required' }, { rule: 'email' }])
//         .addField('#phone', [{ rule: 'required' }, { rule: 'customRegexp', value: /(84|0[3|5|7|8|9])+([0-9]{8})\b/g }])
        
//       // Chỉ yêu cầu file nếu không tích chọn CV có sẵn
//       if (!useExistingCv) {
//         validator.addField('#cv', [{ rule: 'required', errorMessage: 'Chọn file CV!' }]);
//       }

//       validator.onSuccess((event:any) => {
//         handleSuccess(event);
//       });

//       return () => validator.destroy();
//     }
//   }, [isLogin, useExistingCv]);

//   return (
//     <div id="formApply" className="border border-gray-200 rounded-xl p-5 mt-6 bg-gray-50/50">
//       <h2 className="font-bold text-xl mb-5 text-gray-800">Ứng tuyển ngay</h2>
      
//       <form id="formApplyBody" className="space-y-4">
//         {/* Thông tin cá nhân */}
//         <div className="space-y-4">
//             <div>
//               <label className="block text-sm font-medium mb-1">Họ tên *</label>
//               <input type="text" name="name" id="name" className="w-full h-11 border border-gray-300 rounded-lg px-4 focus:ring-2 focus:ring-blue-500 outline-none bg-white" />
//             </div>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-medium mb-1">Email *</label>
//                 <input type="email" name="email" id="email" className="w-full h-11 border border-gray-300 rounded-lg px-4 focus:ring-2 focus:ring-blue-500 outline-none bg-white" />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium mb-1">Số điện thoại *</label>
//                 <input type="text" name="phone" id="phone" className="w-full h-11 border border-gray-300 rounded-lg px-4 focus:ring-2 focus:ring-blue-500 outline-none bg-white" />
//               </div>
//             </div>
//         </div>

//         <hr className="my-6 border-gray-200" />

//         {/* Lựa chọn CV */}
//         <div className="space-y-3">
//           <div className="flex items-center gap-2 mb-2">
//             <input 
//               type="checkbox" 
//               id="useExistingCv" 
//               className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" 
//               checked={useExistingCv}
//               onChange={(e) => setUseExistingCv(e.target.checked)}
//             />
//             <label htmlFor="useExistingCv" className="text-sm font-semibold text-gray-700 cursor-pointer">
//               Sử dụng CV đã tải lên hệ thống
//             </label>
//           </div>

//           {!useExistingCv ? (
//             <div>
//               <label className="block text-sm font-medium mb-1">Tải CV mới (Max 5MB) *</label>
//               <div className="relative w-full h-11 border border-gray-300 rounded-lg flex items-center overflow-hidden bg-white">
//                 <label htmlFor="cv" className="h-full bg-gray-100 px-4 flex items-center cursor-pointer border-r border-gray-300 hover:bg-gray-200 transition-colors shrink-0 text-sm font-medium">
//                   Chọn File
//                 </label>
//                 <div className="flex-1 px-3 flex items-center truncate text-sm">
//                   {fileName ? (
//                     <div className="flex items-center w-full justify-between">
//                       <span className="truncate flex items-center gap-2"><FaFilePdf className="text-red-500" /> {fileName}</span>
//                       <button type="button" onClick={handleClearFile} className="ml-2 text-gray-400 hover:text-red-500"><IoClose size={18}/></button>
//                     </div>
//                   ) : <span className="text-gray-400 italic">Chưa chọn file (.pdf)...</span>}
//                 </div>
//                 <input type="file" name="cv" id="cv" accept=".pdf" className="hidden" onChange={(e) => setFileName(e.target.files?.[0]?.name || '')} />
//               </div>
//             </div>
//           ) : (
//             <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
//                <div className="flex items-center justify-between">
//                   <div className="flex items-center gap-2 text-blue-700 text-sm">
//                     <FaFilePdf size={20} />
//                     <span className="font-medium italic">Sẽ sử dụng CV mặc định trong hồ sơ của bạn</span>
//                   </div>
//                   <button 
//                     type="button"
//                     onClick={() => setShowPreview(!showPreview)}
//                     className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:underline"
//                   >
//                     {showPreview ? <><FaEyeSlash /> Ẩn CV</> : <><FaEye /> Xem CV</>}
//                   </button>
//                </div>
               
//                {/* Iframe Preview */}
//                {showPreview && existingCvUrl && (
//                  <div className="mt-3 w-full h-[400px] border border-blue-200 rounded-md overflow-hidden shadow-inner bg-white">
//                     <iframe 
//                       src={`${existingCvUrl}#toolbar=0&navpanes=0`} 
//                       className="w-full h-full"
//                       title="CV Preview"
//                     />
//                  </div>
//                )}
//             </div>
//           )}
//         </div>

//         <button type="submit" disabled={isSubmitApplied} className="w-full h-12 rounded-lg bg-[#000073] hover:bg-blue-900 transition-all font-bold text-white shadow-md mt-4">
//           Gửi CV ứng tuyển
//         </button>
//       </form>
//     </div>
//   );
// };
const FormApply = ({ jobId, isLogin, setIsSubmitApplied, isSubmitApplied, oldCv, setIsApplied }: any) => {
  const [fileName, setFileName] = useState<string>('');
  const [useExistingCv, setUseExistingCv] = useState<boolean>(false);
  const [existingCvUrl, setExistingCvUrl] = useState<string | null>(oldCv);
  const [showPreview, setShowPreview] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false); // State loading mới

  useEffect(() => {
    setExistingCvUrl(oldCv);
  }, [oldCv]);

  const handleClearFile = () => {
    setFileName('');
    const fileInput = document.getElementById("cv") as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  const handleSuccess = (event: any) => {
    setIsSubmitting(true); // Bắt đầu loading
    const formData = new FormData(event.target);
    formData.append("jobId", jobId);
    formData.append("isOldCv", `${useExistingCv}`);

    const promise = fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/applications`, {
      method: "POST",
      body: formData,
      credentials: "include"
    }).then(async (res) => {
      const data = await res.json();
      if (data.code === "error") throw new Error(data.message);
      setIsSubmitApplied(true);
      setIsApplied(true);
      return data;
    }).finally(() => {
      setIsSubmitting(false); // Kết thúc loading dù thành công hay thất bại
    });

    toast.promise(promise, {
      loading: "Đang gửi CV...",
      success: (data) => {
        event.target.reset();
        handleClearFile();
        return `${data.message}`;
      },
      error: (err) => err.message || "Đã xảy ra lỗi!",
    });
  };

  useEffect(() => {
    if (isLogin) {
      const validator = new JustValidate("#formApplyBody");
      validator
        .addField('#name', [{ rule: 'required', errorMessage: 'Nhập họ tên!' }])
        .addField('#email', [{ rule: 'required' }, { rule: 'email' }])
        .addField('#phone', [{ rule: 'required' }, { rule: 'customRegexp', value: /(84|0[3|5|7|8|9])+([0-9]{8})\b/g }])
      
      if (!useExistingCv) {
        validator.addField('#cv', [{ rule: 'required', errorMessage: 'Chọn file CV!' }]);
      }

      validator.onSuccess((event: any) => {
        handleSuccess(event);
      });

      return () => validator.destroy();
    }
  }, [isLogin, useExistingCv]);

  return (
    <div id="formApply" className="border border-gray-200 rounded-xl p-5 mt-6 bg-gray-50/50">
      <h2 className="font-bold text-xl mb-5 text-gray-800">Ứng tuyển ngay</h2>
      
      <form id="formApplyBody" className="space-y-4">
        {/* ... (Giữ nguyên phần input Họ tên, Email, Phone) ... */}
        <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Họ tên *</label>
              <input type="text" name="name" id="name" className="w-full h-11 border border-gray-300 rounded-lg px-4 focus:ring-2 focus:ring-blue-500 outline-none bg-white" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Email *</label>
                <input type="email" name="email" id="email" className="w-full h-11 border border-gray-300 rounded-lg px-4 focus:ring-2 focus:ring-blue-500 outline-none bg-white" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Số điện thoại *</label>
                <input type="text" name="phone" id="phone" className="w-full h-11 border border-gray-300 rounded-lg px-4 focus:ring-2 focus:ring-blue-500 outline-none bg-white" />
              </div>
            </div>
        </div>

        <hr className="my-6 border-gray-200" />

        {/* Lựa chọn CV */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 mb-2">
            <input 
              type="checkbox" 
              id="useExistingCv" 
              className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 disabled:opacity-50" 
              checked={useExistingCv}
              disabled={isSubmitting} // Không cho đổi lựa chọn khi đang gửi
              onChange={(e) => setUseExistingCv(e.target.checked)}
            />
            <label htmlFor="useExistingCv" className="text-sm font-semibold text-gray-700 cursor-pointer">
              Sử dụng CV đã tải lên hệ thống
            </label>
          </div>

          {!useExistingCv ? (
            <div>
              <label className="block text-sm font-medium mb-1">Tải CV mới (Max 5MB) *</label>
              <div className={`relative w-full h-11 border border-gray-300 rounded-lg flex items-center overflow-hidden bg-white ${isSubmitting ? 'opacity-60' : ''}`}>
                <label htmlFor="cv" className={`h-full bg-gray-100 px-4 flex items-center border-r border-gray-300 transition-colors shrink-0 text-sm font-medium ${isSubmitting ? 'cursor-not-allowed' : 'cursor-pointer hover:bg-gray-200'}`}>
                  Chọn File
                </label>
                <div className="flex-1 px-3 flex items-center truncate text-sm">
                  {fileName ? (
                    <div className="flex items-center w-full justify-between">
                      <span className="truncate flex items-center gap-2"><FaFilePdf className="text-red-500" /> {fileName}</span>
                      {!isSubmitting && <button type="button" onClick={handleClearFile} className="ml-2 text-gray-400 hover:text-red-500"><IoClose size={18}/></button>}
                    </div>
                  ) : <span className="text-gray-400 italic">Chưa chọn file (.pdf)...</span>}
                </div>
                <input type="file" name="cv" id="cv" accept=".pdf" className="hidden" disabled={isSubmitting} onChange={(e) => setFileName(e.target.files?.[0]?.name || '')} />
              </div>
            </div>
          ) : (
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
               <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-blue-700 text-sm">
                    <FaFilePdf size={20} />
                    <span className="font-medium italic">Sử dụng CV trong hồ sơ</span>
                  </div>
                  <button 
                    type="button"
                    onClick={() => setShowPreview(!showPreview)}
                    className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:underline"
                  >
                    {showPreview ? <><FaEyeSlash /> Ẩn</> : <><FaEye /> Xem</>}
                  </button>
               </div>
               {showPreview && existingCvUrl && (
                 <div className="mt-3 w-full h-[300px] border border-blue-200 rounded-md overflow-hidden bg-white">
                    <iframe src={`${existingCvUrl}#toolbar=0`} className="w-full h-full" title="CV Preview" />
                 </div>
               )}
            </div>
          )}
        </div>

        {/* Nút Submit với hiệu ứng Loading */}
        <button 
          type="submit" 
          disabled={isSubmitting || isSubmitApplied} 
          className={`w-full h-12 rounded-lg transition-all font-bold text-white shadow-md mt-4 flex items-center justify-center gap-2
            ${isSubmitting || isSubmitApplied 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-[#000073] hover:bg-blue-900 active:scale-[0.98]'}`}
        >
          {isSubmitting ? (
            <>
              <FaSpinner className="animate-spin" />
              Đang xử lý...
            </>
          ) : (
            'Gửi CV ứng tuyển'
          )}
        </button>
      </form>
    </div>
  );
};
export const JobDetail = ({ jobDetail }: any) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitApplied, setIsSubmitApplied] = useState(false);
  const [isApplied, setIsApplied] = useState(false);
 // const [relatedJobs, setRelatedJobs] = useState<any[]>([]);
  const { isLogin, infoUser } = useAuth();

  useEffect(() => {
    if (infoUser) {
      setIsApplied(infoUser.appliedIds?.includes(jobDetail?.jobId));
    }
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, [infoUser, jobDetail]);

  // Fetch công việc liên quan
  // useEffect(() => {
  //   const getRelatedJobs = async () => {
  //     try {
  //       const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/jobs/related/${jobDetail.jobId}`);
  //       const data = await res.json();
  //       if (data.code === "success") {
  //         setRelatedJobs(data.data.slice(0, 3)); // Lấy 3 công việc
  //       }
  //     } catch (err) {
  //       console.log("Error fetching related jobs", err);
  //     }
  //   };
  //   if (jobDetail?.jobId) getRelatedJobs();
  // }, [jobDetail]);


  if (isLoading) return <JobDetailSkeleton />;
  if (!jobDetail) return null;

  return (
    <div className="py-8 bg-white min-h-screen">
      <Toaster richColors position="top-right" />
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* CỘT TRÁI - CHI TIẾT */}
          <div className="flex-1 space-y-6">
            <div className="border border-gray-200 rounded-2xl p-6 shadow-sm">
              <h1 className="font-bold text-2xl md:text-3xl text-gray-900 mb-2 leading-tight">{jobDetail.title}</h1>
              <p className="text-lg text-gray-600 mb-4">{jobDetail.companyName}</p>
              
              <div className="text-2xl font-bold mb-6">
                {jobDetail.salaryMax > 0 
                  ? `${jobDetail.salaryMin.toLocaleString()}$ - ${jobDetail.salaryMax.toLocaleString()}$`
                  : "Lương thỏa thuận"
                }
              </div>

              <div className="flex flex-wrap gap-3 mb-6">
                {isLogin ? (
                  <Link href={isApplied|| isSubmitApplied ? "#" : "#formApply"} className={`flex-1 flex items-center justify-center h-12 rounded-lg font-bold transition-all ${isApplied ? "bg-gray-200 text-gray-500 cursor-not-allowed" : "bg-blue-600 text-white hover:bg-blue-700 shadow-md"}`}>
                    {isApplied||  isSubmitApplied ? "Đã ứng tuyển" : "Ứng tuyển ngay"}
                  </Link>
                ) : (
                  <button onClick={() => Swal.fire({ icon: 'error', title: 'Chưa đăng nhập', text: 'Vui lòng đăng nhập để ứng tuyển!' })} className="flex-1 h-12 bg-blue-600 text-white rounded-lg font-bold">Ứng tuyển ngay</button>
                )}
                <FavoriteJobButton infoUser={infoUser} isLogin={isLogin||false} jobDetail={jobDetail}  />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700 border-t pt-6">
                <div className="flex items-center gap-3 font-medium"><FaUserTie className="''" /> {jobDetail.position}</div>
                <div className="flex items-center gap-3 font-medium"><FaBriefcase className="''" /> {jobDetail.workingFrom}</div>
                <div className="flex items-center gap-3 font-medium"><FaClock className="''" /> Hạn nộp: {jobDetail.deadline}</div>
                {jobDetail.location && (
                  <div className="flex items-start gap-3 col-span-full">
                    <FaCity  className="'' mt-1 shrink-0" />
                    <div className="flex flex-wrap gap-2">
                      {jobDetail.location.map((loc: string, i: number) => (
                        <span key={i} className="bg-gray-100 px-3 py-1 rounded-full text-xs text-gray-600">{loc}</span>
                      ))}
                    </div>
                  </div>
                )}
                {jobDetail.employer.address && (
                  <div className="flex items-start gap-3 col-span-full">
                    <FaLocationDot className="'' mt-1 shrink-0" />
                    <div className="flex flex-wrap gap-2">
                    { jobDetail.employer.address}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {jobDetail.description && (
              <div className="border border-gray-200 rounded-2xl p-6 shadow-sm prose max-w-none bg-white">
                <h3 className="text-xl font-bold mb-4 border-l-4 border-blue-500 pl-3">Mô tả công việc</h3>
                <div className="text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: jobDetail.description }} />
              </div>
            )}

            {isLogin && !isApplied && !isSubmitApplied && (
              <FormApply setIsApplied={setIsApplied} isSubmitApplied={isSubmitApplied} setIsSubmitApplied={setIsSubmitApplied} jobId={jobDetail.jobId} isLogin={isLogin} oldCv={infoUser.cv} />
            )}
          </div>

          {/* CỘT PHẢI - CÔNG TY */}
          <div className="lg:w-80 space-y-6">
            <div className="border border-gray-200 rounded-2xl p-6 shadow-sm sticky top-6 bg-white">
              <div className="flex flex-col items-center text-center mb-6">
                <img src={jobDetail.employer.logo} alt="logo" className="w-20 h-20 rounded-2xl object-cover border border-gray-100 mb-4 shadow-sm" />
                <h4 className="font-bold text-gray-900 leading-tight mb-2">{jobDetail.companyName}</h4>
                <Link href={`/company/detail/${jobDetail.employer.companyName}`} className="'' text-sm flex items-center gap-1 hover:underline font-medium">
                  Xem công ty <FaArrowRightLong size={12} />
                </Link>
              </div>
              
              <div className="space-y-4 pt-4 border-t">
                {[
                  { label: "Mô hình", value: jobDetail.employer.companyModel },
                  { label: "Quy mô", value: jobDetail.employer.companyEmployees },
                  { label: "Làm việc", value: jobDetail.employer.workingTime },
                  { label: "OT", value: jobDetail.employer.workingOvertime }
                ].map((item, idx) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <span className="text-gray-400">{item.label}</span>
                    <span className="font-semibold text-gray-800">{item.value || "N/A"}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* --- CÔNG VIỆC LIÊN QUAN --- */}
        {/* {relatedJobs.length > 0 && (
          <div className="mt-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <span className="w-2 h-8 bg-blue-600 rounded-full"></span>
              Công việc liên quan
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedJobs.map((item: any) => (
                <Link 
                  href={`/job/detail/${item.jobId}`} 
                  key={item.jobId}
                  className="group border border-gray-200 rounded-2xl p-5 hover:border-blue-500 hover:shadow-md transition-all bg-white"
                >
                  <div className="flex gap-4 mb-4">
                    <img src={item.employer?.logo} className="w-12 h-12 rounded-lg object-cover border" alt="logo" />
                    <div className="flex-1 overflow-hidden">
                      <h4 className="font-bold text-gray-900 truncate group-hover:text-[#000073]">{item.title}</h4>
                      <p className="text-sm text-gray-500 truncate">{item.companyName}</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-sm font-medium">
                    <span className="text-[#000073]">
                      {item.salaryMax > 0 ? `${item.salaryMax}$` : "Thỏa thuận"}
                    </span>
                    <span className="text-gray-400 flex items-center gap-1">
                      <FaLocationDot size={12} /> {item.location?.[0]}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )} */}
      </div>
    </div>
  );
}