'use client'; // BẮT BUỘC: Thư viện thao tác DOM phải chạy trên client

import React, { useRef, useEffect, useState } from 'react';
import Selectr from 'selectr';
import 'selectr/dist/selectr.min.css'; // Import CSS của Selectr

// Định nghĩa kiểu dữ liệu cho Selectr
interface SelectrDataItem {
  value: string;
  text: string;
}

interface TaggableSelectrProps {
  initialData: SelectrDataItem[];
  placeholder?: string;
  multiple?: boolean;
}

const TaggableSelectr: React.FC<TaggableSelectrProps> = ({ 
  initialData, 
  placeholder = "Gõ và nhấn Enter để thêm tag", 
  multiple = true 
}) => {
  // 1. Ref để giữ tham chiếu đến phần tử <select> trong DOM
  const selectRef = useRef<HTMLSelectElement>(null);
  
  // 2. Ref để giữ tham chiếu đến đối tượng Selectr instance
  const selectrInstanceRef = useRef<Selectr | null>(null);
  
  // State để theo dõi giá trị đã chọn (Tùy chọn)
  const [selectedValues, setSelectedValues] = useState<string[]>([]);
  
  useEffect(() => {
    // 3. Khởi tạo Selectr khi DOM đã sẵn sàng
    if (selectRef.current && !selectrInstanceRef.current) {
      const options = {
        data: initialData,
        // Tùy chọn taggable được kích hoạt
        taggable: true, 
        multiple: multiple,
        searchable: true,
        placeholder: placeholder,
      };

      try {
        const selectrInstance = new Selectr(selectRef.current, options);
        selectrInstanceRef.current = selectrInstance;

        // Thêm listener để lấy giá trị khi người dùng thay đổi
        selectrInstance.on('selectr.change', () => {
          // Lấy giá trị hiện tại (Selectr trả về mảng nếu multiple=true)
          const values = selectrInstance.getValue();
          setSelectedValues(Array.isArray(values) ? values : [values]);
        });
        
      } catch (error) {
        console.error("Lỗi khi khởi tạo Selectr:", error);
      }
    }
    
    // 4. Cleanup Function: Hủy Selectr instance khi component bị unmount
    return () => {
      if (selectrInstanceRef.current) {
        selectrInstanceRef.current.destroy(); 
        selectrInstanceRef.current = null;
      }
    };
  }, [initialData, multiple, placeholder]);

  return (
    <div className="w-full">
      {/* Đây là phần tử <select> thô. 
        Selectr sẽ chuyển đổi nó thành giao diện tùy chỉnh.
      */}
      <select 
        ref={selectRef} 
        name="tags" 
        className="w-full" 
        multiple={multiple}
      ></select>
      
      <div className="mt-4 p-2 border rounded bg-gray-50">
        <h3 className="font-semibold text-sm">Tags đã chọn:</h3>
        {selectedValues.length > 0 ? (
          <div className="flex flex-wrap gap-2 mt-2">
            {selectedValues.map(tag => (
              <span key={tag} className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                {tag}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">Chưa có tags nào được chọn.</p>
        )}
      </div>
    </div>
  );
};

export default TaggableSelectr;