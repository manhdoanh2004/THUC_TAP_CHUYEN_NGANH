/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import JobDetailModal from '@/components/modal/JobDetailModal';
import React, { useEffect, useState } from 'react';
import { toast, Toaster } from 'sonner';

// --- ĐỊNH NGHĨA DỮ LIỆU & MAP TRẠNG THÁI ---

// --- MAIN REACT COMPONENT ---
const App = () => {

    
// Bản đồ ánh xạ trạng thái và lớp Tailwind CSS
const STATUS_MAP:any = {
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


// Định nghĩa kiểu dữ liệu cho Công việc
interface Job {
  jobId: string;
  title: string;
  employerId: string;
  employerName: string; // Tên công ty mới
  description: string;
  salaryMin: number;
  salaryMax: number;
  position: string;
  technologies: string[];
  deadline: string; // Thêm trường deadline
  status: string;
}

// Định nghĩa header cho bảng
const TABLE_HEADERS = [
  { key: 'name', label: 'Công việc', sortable: true },
  { key: 'company', label: 'Công ty', sortable: true },
  { key: 'appliedDate', label: 'Ngày đăng', sortable: true },
  { key: 'deadline', label: 'Ngày hết hạn', sortable: true },
  { key: 'status', label: 'Trạng Thái', sortable: true },
  { key: 'action', label: 'Hành Động', sortable: false },
];

// --- SVG Icons ---

const SortArrows = () => (
  <button className="flex flex-col gap-0.5 ml-2">
    <svg xmlns="http://www.w3.org/2000/svg" width="8" height="5" fill="none" className="text-gray-300 dark:text-gray-700"><path fill="currentColor" d="M4.41.585a.5.5 0 0 0-.82 0L1.05 4.213A.5.5 0 0 0 1.46 5h5.08a.5.5 0 0 0 .41-.787z"></path></svg>
    <svg xmlns="http://www.w3.org/2000/svg" width="8" height="5" fill="none" className="text-gray-300 dark:text-gray-700"><path fill="currentColor" d="M4.41 4.415a.5.5 0 0 1-.82 0L1.05.787A.5.5 0 0 1 1.46 0h5.08a.5.5 0 0 1 .41.787z"></path></svg>
  </button>
);

const EditIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 21 21" className="w-5 h-5">
    <path fill="currentColor" fillRule="evenodd" d="M17.091 3.532a2.25 2.25 0 0 0-3.182 0l-8.302 8.302c-.308.308-.52.7-.61 1.126l-.735 3.485a.75.75 0 0 0 .888.889l3.485-.735a2.25 2.25 0 0 0 1.127-.611l8.301-8.302a2.25 2.25 0 0 0 0-3.182zm-2.121 1.06a.75.75 0 0 1 1.06 0l.973.973a.75.75 0 0 1 0 1.06l-.899.899-2.033-2.033zm-1.96 1.96-6.342 6.342a.75.75 0 0 0-.203.376l-.498 2.358 2.358-.497a.75.75 0 0 0 .376-.204l6.343-6.342z" clipRule="evenodd"></path>
  </svg>
);

const TrashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
);


// --- TOAST NOTIFICATION COMPONENT ---
const ToastNotification = ({ message }:{message:any}) => {
    if (!message) return null;

    const baseClasses = "fixed bottom-5 right-5 p-4 rounded-lg shadow-xl text-white font-medium z-50 transition-all duration-300 transform";
    const typeClasses:any = {
        success: 'bg-emerald-600',
        error: 'bg-red-600',
        info: 'bg-indigo-600',
    };

    return (
        <div className={`${baseClasses} ${typeClasses[message.type] || typeClasses.info}`}>
            {message.text}
        </div>
    );
};

 // 1. State để quản lý trạng thái hiển thị của Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // 2. State để lưu thông tin công việc đang được chọn
  const [selectedJob, setSelectedJob] = useState<Job | null>( null);

  // Trạng thái dữ liệu ứng viên
  const [candidates, setCandidates] = useState<undefined|any>(undefined);
  
  // Trạng thái để lưu trữ ID của các ứng viên đã chọn
  const [selectedIds, setSelectedIds] = useState<any>([]);
  // Trạng thái cho trạng thái mới được chọn trong Bulk Action dropdown
  const [bulkStatusChange, setBulkStatusChange] = useState('');
  const [message, setMessage] = useState<any>(null); // Trạng thái cho thông báo Toast
  const [count, setCount] = useState(0);
  // Kiểm tra xem tất cả các ứng viên có được chọn hay không
  const isAllSelected = selectedIds.length === candidates?.length && candidates.length > 0;
  
  // Kiểm tra xem có bất kỳ ứng viên nào được chọn không (dùng cho indeterminate state)
  const isIndeterminate = selectedIds.length > 0 && !isAllSelected;

  // Lấy cấu hình trạng thái hoặc fallback mặc định
  const getStatusInfo = (status:any) => STATUS_MAP[status] || {
    label: status,
    bg: 'bg-gray-100 dark:bg-gray-700/50',
    textColor: 'text-gray-600 dark:text-gray-400'
  };
  
  const showMessage = (text:any, type = 'info') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 3000); // Ẩn sau 3 giây
  };

  // Xử lý sự kiện Chọn tất cả
  const handleSelectAll = (e:any) => {
    if (e.target.checked) {
      // Chọn tất cả ID từ dữ liệu hiện tại
      const allIds:any = candidates.map((candidate:any) => candidate.jobId);
      setSelectedIds(allIds);
    } else {
      // Bỏ chọn tất cả
      setSelectedIds([]);
    }
  };

  // Xử lý sự kiện chọn một hàng
  const handleSelectRow = (jobid:any, e:any) => {
    if (e.target.checked) {
      // Thêm ID vào mảng nếu chưa có
      setSelectedIds((prev:any )=> [...prev, jobid]);
    } else {
      // Loại bỏ ID khỏi mảng
      setSelectedIds((prev:any) => prev.filter((selectedId:any) => selectedId !== jobid));
    }
  };


   useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/jobs?page=1&size=10&direction=asc`,{
        credentials:"include"
    })
      .then(res => res.json())
      .then(data => {
          if(data.code==="success")
          {
             setCandidates(data.result.content);
          }
     
      })
  }, [count]);

  // Hàm thay đổi trạng thái công việc
  const handleSubmit = async () => {
 
  if (!bulkStatusChange) {
        showMessage('Vui lòng chọn một trạng thái mới để áp dụng.', 'error');
        return;
    }
      const promise = fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/jobs/review`, {
        method: "PUT",
        headers:{
            "Content-Type":"application/json"
        },
        body: JSON.stringify({
           jobId: selectedIds||[],
             jobStatus: bulkStatusChange
        }),
        credentials: "include", // Gửi kèm cookie
      })
        .then(async (res) => {
          const data = await res.json();
          if (data.code === "error") {
            throw new Error(data.message);
          }
          else {
            setCount(prev=>prev+1);
                 setSelectedIds([]); // Xóa lựa chọn sau khi hành động
               setBulkStatusChange(''); // Xóa lựa chọn dropdown
          }
          return data;
        });

      toast.promise(promise, {
        loading: 'Đang cập nhật...',
        success: (data) => `${data.message}`, // data ở đây là kết quả trả về khi `resolve`
        error: (err) => err.message || 'Đã xảy ra lỗi!',
      });
    }


    //Hàm xóa một hoặc nhiều công việc
  const handleBulkDelete =async () => {
      const promise = fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/jobs`, {
        method: "DELETE",
        headers:{
            "Content-Type":"application/json"
          },
        body: JSON.stringify({
           ids: selectedIds||[]
        }),
        credentials: "include", // Gửi kèm cookie
      })
        .then(async (res) => {
          const data = await res.json();
           setCount(prev=>prev+1);
          if (data.code === "error") {
            throw new Error(data.message);
          }
          else {
            setCount(prev=>prev+1);
                 setSelectedIds([]); // Xóa lựa chọn sau khi hành động
               setBulkStatusChange(''); // Xóa lựa chọn dropdown
          }
          return data;
        });

      toast.promise(promise, {
        loading: 'Đang xóa công việc ...',
        success: (data) => `${data.message}`, // data ở đây là kết quả trả về khi `resolve`
        error: (err) => err.message || 'Đã xảy ra lỗi!',
      });
    
  
    setSelectedIds([]); // Xóa lựa chọn sau khi hành động
  };
 


  const handleViewDetail = (jobInfo: Job) => {
    setSelectedJob(jobInfo); // Lưu công việc được chọn
    setIsModalOpen(true); // Mở Modal
 
  };

  /**
   * Hàm đóng Modal
   */
  
  const handleCloseModal = () => {
   
    setIsModalOpen(false);
    setSelectedJob(null); // (Tùy chọn) Xóa công việc đã chọn để reset trạng thái
  };
 
  return (
    <>
      <Toaster position="top-right" richColors />
    <div className="p-4 sm:p-8 min-h-screen bg-gray-50 dark:bg-gray-900 font-sans realtive">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-6">
         Danh sách công việc
        </h1>
        
        <div className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl overflow-hidden">
          
          {/* BULK ACTION BAR - Hiển thị khi có hàng được chọn */}
          {selectedIds.length > 0 && (
              <div className="flex flex-col sm:flex-row items-center justify-between p-3 sm:p-4 bg-indigo-50 dark:bg-indigo-900/40 border-b border-indigo-200 dark:border-indigo-800 gap-3 sm:gap-0">
                  <span className="text-sm font-semibold text-indigo-800 dark:text-indigo-200 w-full sm:w-auto text-center sm:text-left">
                      Đã chọn {selectedIds.length} công việc
                  </span>
                  <div className="flex flex-wrap items-center justify-center sm:justify-end gap-2 w-full sm:w-auto">
                      
                      {/* Dropdown thay đổi trạng thái */}
                      <select
                          value={bulkStatusChange}
                          onChange={(e) => setBulkStatusChange(e.target.value)}
                          className="h-9 px-3 text-sm border border-indigo-300 rounded-lg dark:border-indigo-700 dark:bg-indigo-900/50 dark:text-white/90 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition duration-150"
                      >
                          <option value="" disabled>Chọn Trạng Thái Mới...</option>
                          {Object.keys(STATUS_MAP).map(statusKey => (
                              <option key={statusKey} value={statusKey}>
                                  {STATUS_MAP[statusKey].label}
                              </option>
                          ))}
                      </select>
                      
                      {/* Nút Áp Dụng Trạng Thái */}
                      <button
                          onClick={handleSubmit}
                          disabled={!bulkStatusChange}
                          className="inline-flex items-center justify-center font-medium gap-1 rounded-lg transition px-3 py-1.5 text-xs sm:text-sm bg-indigo-600 text-white hover:bg-indigo-700 disabled:bg-indigo-400 dark:disabled:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
                      >
                          Áp Dụng
                      </button>

                      {/* Nút Sửa và Xóa (Mô phỏng) */}
                   
                      <button
                          onClick={()=>handleBulkDelete()}
                          className="inline-flex items-center justify-center font-medium gap-1 rounded-lg transition px-3 py-1.5 text-xs sm:text-sm bg-red-600 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
                      >
                          <TrashIcon /> Xóa hàng loạt
                      </button>
                  </div>
              </div>
          )}

          {/* Table Controls (Header) */}
          <div className={`flex flex-col gap-3 p-4 border-b border-gray-100 dark:border-gray-700 sm:flex-row sm:items-center sm:justify-between ${selectedIds.length > 0 ? 'rounded-none' : 'rounded-t-2xl'}`}>
            <div className="relative">
              <input
                placeholder="Tìm kiếm công việc..."
                className="w-full h-10 px-4 pr-10 text-sm border border-gray-300 rounded-lg dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 placeholder:text-gray-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                type="text"
              />
              <svg className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 right-3 top-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </div>
            
          
          </div>

          {/* TABLE (Desktop) */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 hidden md:table">
              <thead className="bg-gray-50 dark:bg-gray-700/50">
                <tr>
                  {/* Cột Checkbox "Chọn tất cả" */}
                  <th scope="col" className="p-4 w-4">
                    <div className="flex items-center">
                      <input
                        id="checkbox-all"
                        type="checkbox"
                        className="w-4 h-4 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500 dark:focus:ring-indigo-600 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600"
                        onChange={handleSelectAll}
                        checked={isAllSelected}
                     
                        ref={(el: HTMLInputElement | null) => {
                            if (el) {
                                el.indeterminate = isIndeterminate;
                            }
                        }}
                      />
                      <label htmlFor="checkbox-all" className="sr-only">Chọn tất cả</label>
                    </div>
                  </th>
                  {TABLE_HEADERS.map((header) => (
                    <th
                      key={header.key}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                    >
                      <div className="flex items-center">
                        {header.label}
                        {header.sortable && <SortArrows />}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {candidates?(<>
                  {candidates.map((row:any) => {
                  const statusInfo = getStatusInfo(row.status);
              
                  const isChecked = selectedIds.includes(row.jobId);
                  return (
                    <tr key={row.jobId} className={isChecked ? 'bg-indigo-50 dark:bg-gray-700' : 'hover:bg-gray-50 dark:hover:bg-gray-700/70'}>
                      {/* Cột Checkbox hàng */}
                      <td className="p-4 w-4">
                        <div className="flex items-center">
                          <input
                            id={`checkbox-${row.jobId}`}
                            type="checkbox"
                            className="w-4 h-4 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500 dark:focus:ring-indigo-600 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600"
                            checked={isChecked}
                            onChange={(e) => handleSelectRow(row.jobId, e)}
                          />
                          <label htmlFor={`checkbox-${row.jobId}`} className="sr-only">{`Chọn ${row.name}`}</label>
                        </div>
                      </td>
                      {/* Tên công việc */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {row.title}
                      </td>
                      {/* Tên công ty */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {row.employerName}
                      </td>
                      {/* Ngày Ngày đăng */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {row.createdAt}
                      </td>
                      {/* Ngày hết hạn */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {row.deadline}
                      </td>
                      {/* Trạng Thái */}
                      <td className="px-6 py-4 whitespace-nowrap flex text-center">
                        <span
                          className={`inline-flex items-center px-3 py-1 justify-center rounded-full font-semibold text-xs ${statusInfo.bg} ${statusInfo.textColor}`}
                        >
                          {statusInfo.label}
                        </span>
                      </td>
                      {/* Hành Động */}
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-center gap-3">
                          <button
                            className="p-1 rounded-full text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 transition duration-150"
                           onClick={() => handleViewDetail(row)}
                          >
                            <EditIcon />
                          </button>
                         
                        </div>
                      </td>
                    </tr>
                  );
                })}
                </>):(<></>)}
                
  
              </tbody>
            </table>
            {/* Trường hợp không có dữ liệu */}
            {candidates?.length === 0 && (
                <div className="p-10 text-center text-gray-500 dark:text-gray-400">
                    <p className="font-semibold text-lg">Không tìm thấy công việc nào.</p>
                   
                </div>
            )}
          </div>

          {/* Danh sách Thẻ (Mobile) */}
          <div className="md:hidden divide-y divide-gray-200 dark:divide-gray-700">
           {candidates?(<>
              {candidates.map((row:any) => {
                const statusInfo = getStatusInfo(row.status);
                const isChecked = selectedIds.includes(row.jobId);
                return (
                  <div key={row.jobId} className="p-4 bg-white dark:bg-gray-800 flex flex-col gap-2">
                      <div className="flex justify-between items-start">
                          <div className="flex items-center gap-2">
                            {/* Checkbox trong Mobile View */}
                            <input
                                id={`mobile-checkbox-${row.jobId}`}
                                type="checkbox"
                                className="w-4 h-4 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500 dark:focus:ring-indigo-600 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600"
                                checked={isChecked}
                                onChange={(e) => handleSelectRow(row.jobId, e)}
                            />
                            <label htmlFor={`mobile-checkbox-${row.jobId}`} className="text-lg font-bold text-gray-900 dark:text-white">
                                {row.name}
                            </label>
                          </div>
                          <span
                            className={`inline-flex items-center px-3 py-1 justify-center rounded-full font-semibold text-xs ${statusInfo.bg} ${statusInfo.textColor}`}
                          >
                            {statusInfo.label}
                          </span>
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Công ty:</span> {row.company}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-500">
                        <span className="font-medium">Ngày đăng :</span> {row.appliedDate}
                      </div>
                     
                  </div>
                );
              })}</>):(<></>)}
          </div>
          {candidates?.length === 0 && (
                <div className="md:hidden p-10 text-center text-gray-500 dark:text-gray-400">
                    <p className="font-semibold text-lg">Không tìm thấy công việc nào.</p>
                 
                </div>
            )}

          {/* Hiển thị danh sách ID đã chọn */}
          <div className="p-4 bg-gray-100 dark:bg-gray-800/80 border-t border-gray-200 dark:border-gray-700">
           
          </div>

          {/* Pagination Footer */}
          <div className="border-t border-gray-100 dark:border-gray-700 py-4 px-4">
            <div className="flex items-center justify-center">
                <button
                    className="mr-2.5 flex items-center h-10 justify-center rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-gray-700 shadow-theme-xs hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] text-sm"
                    disabled={true}
                >
                    Previous
                </button>
                <div className="flex items-center gap-2">
                    {/* Trang 1 - Đang hoạt động */}
                    <button className="px-4 py-2 rounded bg-indigo-600 text-white flex w-10 items-center justify-center h-10 rounded-lg text-sm font-medium hover:bg-indigo-500/[0.08] hover:text-indigo-600 dark:hover:text-indigo-600">
                        1
                    </button>
                    {/* Trang 2 - Không hoạt động */}
                    <button className="px-4 py-2 rounded text-gray-700 dark:text-gray-400 flex w-10 items-center justify-center h-10 rounded-lg text-sm font-medium hover:bg-indigo-500/[0.08] hover:text-indigo-600 dark:hover:text-indigo-600">
                        2
                    </button>
                </div>
                <button
                    className="ml-2.5 flex items-center justify-center rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-gray-700 shadow-theme-xs text-sm hover:bg-gray-50 h-10 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03]"
                >
                    Next
                </button>
            </div>
          </div>
          {/* 3. Render Modal Component */}
      <JobDetailModal
        job={selectedJob}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
        </div>
      </div>
 
      {/* Toast Notification Component */}
      <ToastNotification message={message} />
    </div>

   
    
    </>
     
  );
};

export default App;