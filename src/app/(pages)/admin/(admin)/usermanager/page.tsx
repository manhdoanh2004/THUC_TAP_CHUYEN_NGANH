'use client'
import React, { useState } from 'react';

// --- ĐỊNH NGHĨA DỮ LIỆU & MAP TRẠNG THÁI ---

// Bản đồ ánh xạ trạng thái và lớp Tailwind CSS
const STATUS_MAP:any = {
  'Hired': {
    label: 'Đã Tuyển',
    bg: 'bg-emerald-100 dark:bg-emerald-800/20',
    textColor: 'text-emerald-700 dark:text-emerald-400'
  },
  'In Progress': {
    label: 'Đang Xử Lý',
    bg: 'bg-amber-100 dark:bg-amber-800/20',
    textColor: 'text-amber-700 dark:text-amber-400'
  },
  'Pending': {
    label: 'Chờ Xử Lý',
    bg: 'bg-blue-100 dark:bg-blue-800/20',
    textColor: 'text-blue-700 dark:text-blue-400'
  },
  'Rejected': {
    label: 'Từ Chối',
    bg: 'bg-red-100 dark:bg-red-800/20',
    textColor: 'text-red-700 dark:text-red-400'
  },
};

// Dữ liệu ứng viên mẫu ban đầu
const INITIAL_CANDIDATE_DATA = [
  { id: 1, name: 'Nguyễn Văn A', role: 'Kỹ sư Phần mềm Cấp cao', appliedDate: '01/10/2024', status: 'Hired' },
  { id: 2, name: 'Trần Thị B', role: 'Nhà phân tích Dữ liệu', appliedDate: '15/09/2024', status: 'In Progress' },
  { id: 3, name: 'Lê Văn C', role: 'Thiết kế UX/UI', appliedDate: '20/10/2024', status: 'Pending' },
  { id: 4, name: 'Phạm Thị D', role: 'Giám đốc Dự án', appliedDate: '28/08/2024', status: 'Rejected' },
  { id: 5, name: 'Hoàng Văn E', role: 'Chuyên viên Marketing', appliedDate: '05/11/2024', status: 'In Progress' },
];

// Định nghĩa header cho bảng
const TABLE_HEADERS = [
  { key: 'name', label: 'Ứng Viên', sortable: true },
  { key: 'role', label: 'Vai Trò', sortable: true },
  { key: 'appliedDate', label: 'Ngày Ứng Tuyển', sortable: true },
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


// --- MAIN REACT COMPONENT ---
const App = () => {
  // Trạng thái dữ liệu ứng viên
  const [candidates, setCandidates] = useState(INITIAL_CANDIDATE_DATA);
  // Trạng thái để lưu trữ ID của các ứng viên đã chọn
  const [selectedIds, setSelectedIds] = useState<any>([]);
  // Trạng thái cho trạng thái mới được chọn trong Bulk Action dropdown
  const [bulkStatusChange, setBulkStatusChange] = useState('');
  const [message, setMessage] = useState<any>(null); // Trạng thái cho thông báo Toast
  
  // Kiểm tra xem tất cả các ứng viên có được chọn hay không
  const isAllSelected = selectedIds.length === candidates.length && candidates.length > 0;
  
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
      const allIds:any = candidates.map(candidate => candidate.id);
      setSelectedIds(allIds);
    } else {
      // Bỏ chọn tất cả
      setSelectedIds([]);
    }
  };

  // Xử lý sự kiện chọn một hàng
  const handleSelectRow = (id:any, e:any) => {
    if (e.target.checked) {
      // Thêm ID vào mảng nếu chưa có
      setSelectedIds((prev:any )=> [...prev, id]);
    } else {
      // Loại bỏ ID khỏi mảng
      setSelectedIds((prev:any) => prev.filter((selectedId:any) => selectedId !== id));
    }
  };
  
  // --- HÀNH ĐỘNG HÀNG LOẠT (BULK ACTIONS) ---

  const handleBulkStatusChange = () => {
    if (!bulkStatusChange) {
        showMessage('Vui lòng chọn một trạng thái mới để áp dụng.', 'error');
        return;
    }
    
    // Cập nhật trạng thái của các ứng viên đã chọn
    setCandidates(prevCandidates =>
      prevCandidates.map(candidate => {
        if (selectedIds.includes(candidate.id)) {
          return { ...candidate, status: bulkStatusChange };
        }
        return candidate;
      })
    );

    showMessage(`Đã cập nhật trạng thái cho ${selectedIds.length} ứng viên thành '${STATUS_MAP[bulkStatusChange]?.label || bulkStatusChange}'.`, 'success');
    setSelectedIds([]); // Xóa lựa chọn sau khi hành động
    setBulkStatusChange(''); // Xóa lựa chọn dropdown
  };

  const handleBulkEdit = () => {
    // Mô phỏng API call cho chỉnh sửa hàng loạt
    console.log("Bulk Editing candidates with IDs:", selectedIds);
    showMessage(`Đã gửi yêu cầu chỉnh sửa ${selectedIds.length} ứng viên.`, 'info');
    setSelectedIds([]); // Xóa lựa chọn sau khi hành động
  };

  const handleBulkDelete = () => {
    // Xóa các ứng viên khỏi state
    setCandidates(prevCandidates =>
        prevCandidates.filter(candidate => !selectedIds.includes(candidate.id))
    );
    
    showMessage(`Đã xóa ${selectedIds.length} ứng viên khỏi danh sách.`, 'error');
    setSelectedIds([]); // Xóa lựa chọn sau khi hành động
  };
  // ------------------------------------------

  return (
    <div className="p-4 sm:p-8 min-h-screen bg-gray-50 dark:bg-gray-900 font-sans">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-6">
          Bảng Theo Dõi Ứng Viên Tuyển Dụng
        </h1>
        
        <div className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl overflow-hidden">
          
          {/* BULK ACTION BAR - Hiển thị khi có hàng được chọn */}
          {selectedIds.length > 0 && (
              <div className="flex flex-col sm:flex-row items-center justify-between p-3 sm:p-4 bg-indigo-50 dark:bg-indigo-900/40 border-b border-indigo-200 dark:border-indigo-800 gap-3 sm:gap-0">
                  <span className="text-sm font-semibold text-indigo-800 dark:text-indigo-200 w-full sm:w-auto text-center sm:text-left">
                      Đã chọn {selectedIds.length} ứng viên
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
                          onClick={handleBulkStatusChange}
                          disabled={!bulkStatusChange}
                          className="inline-flex items-center justify-center font-medium gap-1 rounded-lg transition px-3 py-1.5 text-xs sm:text-sm bg-indigo-600 text-white hover:bg-indigo-700 disabled:bg-indigo-400 dark:disabled:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
                      >
                          Áp Dụng
                      </button>

                      {/* Nút Sửa và Xóa (Mô phỏng) */}
                      <button
                          onClick={handleBulkEdit}
                          className="inline-flex items-center justify-center font-medium gap-1 rounded-lg transition px-3 py-1.5 text-xs sm:text-sm text-indigo-600 bg-white hover:bg-gray-100 dark:bg-indigo-900 dark:text-indigo-200 dark:hover:bg-indigo-800 border border-indigo-300 dark:border-indigo-700"
                      >
                          <EditIcon /> Sửa hàng loạt
                      </button>
                      <button
                          onClick={handleBulkDelete}
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
                placeholder="Tìm kiếm ứng viên..."
                className="w-full h-10 px-4 pr-10 text-sm border border-gray-300 rounded-lg dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 placeholder:text-gray-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                type="text"
              />
              <svg className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 right-3 top-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </div>
            
            <button className="inline-flex items-center justify-center font-medium gap-2 rounded-lg transition px-4 py-2 text-sm bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900">
              + Thêm Ứng Viên
            </button>
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
                        // FIX LỖI: Sử dụng callback function tường minh, đảm bảo nó trả về void
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
                {candidates.map((row) => {
                  const statusInfo = getStatusInfo(row.status);
                  const isChecked = selectedIds.includes(row.id);
                  return (
                    <tr key={row.id} className={isChecked ? 'bg-indigo-50 dark:bg-gray-700' : 'hover:bg-gray-50 dark:hover:bg-gray-700/70'}>
                      {/* Cột Checkbox hàng */}
                      <td className="p-4 w-4">
                        <div className="flex items-center">
                          <input
                            id={`checkbox-${row.id}`}
                            type="checkbox"
                            className="w-4 h-4 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500 dark:focus:ring-indigo-600 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600"
                            checked={isChecked}
                            onChange={(e) => handleSelectRow(row.id, e)}
                          />
                          <label htmlFor={`checkbox-${row.id}`} className="sr-only">{`Chọn ${row.name}`}</label>
                        </div>
                      </td>
                      {/* Tên Ứng Viên */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {row.name}
                      </td>
                      {/* Vai Trò */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {row.role}
                      </td>
                      {/* Ngày Ứng Tuyển */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {row.appliedDate}
                      </td>
                      {/* Trạng Thái */}
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span
                          className={`inline-flex items-center px-3 py-1 justify-center rounded-full font-semibold text-xs ${statusInfo.bg} ${statusInfo.textColor}`}
                        >
                          {statusInfo.label}
                        </span>
                      </td>
                      {/* Hành Động */}
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-3">
                          <button
                            className="p-1 rounded-full text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 transition duration-150"
                            onClick={() => showMessage(`Mở chỉnh sửa cho ${row.name}`, 'info')}
                          >
                            <EditIcon />
                          </button>
                          <button
                            className="p-1 rounded-full text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition duration-150"
                            onClick={() => {
                                setCandidates(prev => prev.filter(c => c.id !== row.id));
                                showMessage(`Đã xóa ${row.name} thành công.`, 'error');
                            }}
                          >
                            <TrashIcon />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {/* Trường hợp không có dữ liệu */}
            {candidates.length === 0 && (
                <div className="p-10 text-center text-gray-500 dark:text-gray-400">
                    <p className="font-semibold text-lg">Không tìm thấy ứng viên nào.</p>
                    <p className="text-sm mt-1">Vui lòng thêm ứng viên mới hoặc kiểm tra lại bộ lọc.</p>
                </div>
            )}
          </div>

          {/* Danh sách Thẻ (Mobile) */}
          <div className="md:hidden divide-y divide-gray-200 dark:divide-gray-700">
              {candidates.map((row) => {
                const statusInfo = getStatusInfo(row.status);
                const isChecked = selectedIds.includes(row.id);
                return (
                  <div key={row.id} className="p-4 bg-white dark:bg-gray-800 flex flex-col gap-2">
                      <div className="flex justify-between items-start">
                          <div className="flex items-center gap-2">
                            {/* Checkbox trong Mobile View */}
                            <input
                                id={`mobile-checkbox-${row.id}`}
                                type="checkbox"
                                className="w-4 h-4 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500 dark:focus:ring-indigo-600 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600"
                                checked={isChecked}
                                onChange={(e) => handleSelectRow(row.id, e)}
                            />
                            <label htmlFor={`mobile-checkbox-${row.id}`} className="text-lg font-bold text-gray-900 dark:text-white">
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
                        <span className="font-medium">Vai trò:</span> {row.role}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-500">
                        <span className="font-medium">Ngày ứng tuyển:</span> {row.appliedDate}
                      </div>
                      <button 
                        className="self-start mt-2 inline-flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 transition duration-150 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() => showMessage(`Mở hồ sơ của ${row.name}`, 'info')}
                      >
                        <EditIcon /> Xem hồ sơ
                      </button>
                  </div>
                );
              })}
          </div>
          {candidates.length === 0 && (
                <div className="md:hidden p-10 text-center text-gray-500 dark:text-gray-400">
                    <p className="font-semibold text-lg">Không tìm thấy ứng viên nào.</p>
                    <p className="text-sm mt-1">Vui lòng thêm ứng viên mới.</p>
                </div>
            )}

          {/* Hiển thị danh sách ID đã chọn */}
          <div className="p-4 bg-gray-100 dark:bg-gray-800/80 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              ID ứng viên đã chọn ({selectedIds.length}):
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 break-all mt-1">
              [{selectedIds.join(', ')}]
            </p>
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
          
        </div>
      </div>

      {/* Toast Notification Component */}
      <ToastNotification message={message} />
    </div>
  );
};

export default App;