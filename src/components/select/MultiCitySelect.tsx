/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import React, { useState, useRef, useEffect } from 'react';
// Sử dụng lucide-react cho các icon (Lưu ý: Bạn cần cài đặt thư viện này: npm install lucide-react)
import { ChevronDown, X } from 'lucide-react'; 
import { cityList } from '@/config/variables';

// Kiểu dữ liệu cho mỗi thành phố
interface City {
  id: string;
  name: string;
}

// Danh sách thành phố mặc định
const DEFAULT_CITIES: City[] = [
  { id: 'hcm', name: 'Hồ Chí Minh' },
  { id: 'hn', name: 'Hà Nội' },
  { id: 'dn', name: 'Đà Nẵng' },
  { id: 'hp', name: 'Hải Phòng' },
  { id: 'ct', name: 'Cần Thơ' },
  { id: 'hue', name: 'Huế' },
  { id: 'nt', name: 'Nha Trang' },
  { id: 'dl', name: 'Đà Lạt' },
  { id: 'qn', name: 'Quy Nhơn' },
  { id: 'vt', name: 'Vũng Tàu' },
];

interface MultiCitySelectProps {
  // Hàm callback để trả về danh sách ID thành phố đã chọn cho component cha
  // Đã thêm dấu "?" và giá trị mặc định là () => {} để tránh lỗi 'is not a function'
  onSelectionChange?: (selectedIds: string[]) => void; 
  cities?: City[]; // Danh sách thành phố tùy chỉnh (nếu có)
  placeholder?: string; // Placeholder tùy chỉnh
  onHandleCities:(cities:any)=>void
}

const MultiCitySelect: React.FC<MultiCitySelectProps> = ({ 
  onSelectionChange = () => {}, // Giá trị mặc định cho onSelectionChange
  cities = cityList,
  placeholder = "Chọn các thành phố...",
  onHandleCities
}) => {
  // State quản lý các ID thành phố đã chọn
  const [selectedCityIds, setSelectedCityIds] = useState<string[]>([]);
  // State quản lý trạng thái đóng/mở của dropdown
  const [isOpen, setIsOpen] = useState(false);
  // Ref để phát hiện click bên ngoài component
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Cập nhật component cha khi selection thay đổi
  useEffect(() => {
    // Gọi hàm callback đã được đảm bảo là một function
    onSelectionChange(selectedCityIds); 
  }, [selectedCityIds, onSelectionChange]);

  // Xử lý khi người dùng click chọn/bỏ chọn một thành phố
  const handleToggleCity = (cityId: string) => {
    setSelectedCityIds(prev => {
      if (prev.includes(cityId)) {
        // Bỏ chọn
        return prev.filter(id => id !== cityId);
      } else {
        // Chọn
        return [...prev, cityId];
      }
    });
  };

  // Hàm xóa một thành phố cụ thể khi click icon X trên tag
  const handleRemoveCity = (cityId: string) => {
    setSelectedCityIds(prev => prev.filter(id => id !== cityId));
  };
  
  // Hàm tìm tên thành phố từ ID
  const getCityName = (id: string) => cities.find(c => c.name === id)?.name || '';

  // Lắng nghe sự kiện click bên ngoài để đóng dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

   const handleCitiesAndClosedropDown=()=>
   {
      setIsOpen(false)
      onHandleCities(selectedCityIds)
   }
  return (
    <div className="relative w-full flex  max-w-lg font-sans" ref={wrapperRef}>
      
      {/* 1. Thanh Select Hiển Thị (Button) */}
      <button
        type="button"
        className={`w-full min-h-12 flex items-center justify-between p-3 border rounded-lg bg-white shadow-sm cursor-pointer transition duration-150 focus:outline-none 
          ${isOpen ? 'border-blue-500 ring-2 ring-blue-500/50' : 'border-gray-300 hover:border-blue-400'}`}
        onClick={() => setIsOpen(prev => !prev)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        {/* Hiển thị tags đã chọn hoặc placeholder */}
        <div className="flex flex-wrap gap-1.5 text-sm mr-2 max-h-20 overflow-y-auto">
          {selectedCityIds.length > 0 ? (
            selectedCityIds.map((cityId) => (
              <span 
                key={cityId}
                className="inline-flex items-center bg-blue-100 text-blue-800 rounded-full px-2 py-0.5 text-xs font-medium whitespace-nowrap"
                // Ngăn chặn mở/đóng dropdown khi click vào tag
                onClick={(e) => e.stopPropagation()} 
              >
                {getCityName(cityId)}
                <X 
                  className="w-3 h-3 ml-1 text-blue-600 hover:text-blue-900 cursor-pointer" 
                  onClick={() => handleRemoveCity(cityId)}
                />
              </span>
            ))
          ) : (
            <span className="text-gray-500 text-sm">{placeholder}</span>
          )}
        </div>
        {/* Icon mũi tên */}
        <ChevronDown 
          className={`flex-shrink-0 w-5 h-5 text-gray-400 transform transition-transform duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'}`}
        />
      </button>

      {/* 2. Dropdown List */}
      {isOpen && (
        <div className="absolute top-[70px] z-20 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-2xl max-h-72 overflow-y-auto origin-top transition duration-200">
          <ul role="listbox" className="py-1">
            {cities.map(city => {
              const isSelected = selectedCityIds.includes(city.name);
              return (
                <li
                  key={city.name}
                  role="option"
                  aria-selected={isSelected}
                  className={`p-3 cursor-pointer transition duration-100 flex justify-between items-center text-sm
                    ${isSelected 
                      ? 'bg-blue-50 text-blue-700 font-semibold' 
                      : 'hover:bg-gray-100 text-gray-800'
                    }`}
                  onClick={() => handleToggleCity(city.name)}
                >
                  {city.name}
                  {isSelected && (
                    <span className="text-blue-500 font-bold">✓ Đã chọn</span>
                  )}
                </li>
              );
            })}
          </ul>
          
          {cities.length === 0 && (
             <div className="p-3 text-center text-sm text-gray-500">
                Không tìm thấy thành phố nào.
             </div>
          )}
        </div>
      )}
      
    <button
                 onClick={()=>handleCitiesAndClosedropDown()}       
                          className=" max-h-[55px] ml-[10px] flex items-center justify-center font-medium gap-1 rounded-lg transition px-3 py-1.5 text-xs sm:text-sm bg-indigo-600 text-white hover:bg-indigo-700 disabled:bg-indigo-400 dark:disabled:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
                      >
                          Áp Dụng
                      </button>
    </div>
  );
};

export default MultiCitySelect;