/* eslint-disable @typescript-eslint/no-unused-vars */
// import { useEffect } from 'react';
// import flatpickr from 'flatpickr';
// import 'flatpickr/dist/flatpickr.css';
// import Label from './Label';
// import { CalenderIcon } from '../../icons';
// import Hook = flatpickr.Options.Hook;
// import DateOption = flatpickr.Options.DateOption;

// type PropsType = {
//   id: string;
//   mode?: "single" | "multiple" | "range" | "time";
//   onChange?: Hook | Hook[];
//   defaultDate?: DateOption;
//   label?: string; 
//   placeholder?: string;
//   required?: boolean;
// };

// export default function DatePicker({
//   id,
//   mode,
//   onChange,
//   label,
//   defaultDate,
//   placeholder,
//   required=false,
// }: PropsType) {
//   useEffect(() => {
//     const flatPickr = flatpickr(`#${id}`, {
//       mode: mode || "single",
//       static: true,
//       monthSelectorType: "static",
//       dateFormat: "Y-m-d",
//       defaultDate,
//       onChange,
//       minDate: "today",
//     });

//     return () => {
//       if (!Array.isArray(flatPickr)) {
//         flatPickr.destroy();
//       }
//     };
//   }, [mode, onChange, id, defaultDate]);

//   return (
//     <div>
//       {label && <Label htmlFor={id}>{label}</Label>}

//       <div className="relative">
//         <input
//         required={required}
//         name='datePicker'
//           id={id}
//           placeholder={placeholder}
//           className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3  dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30  bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700  dark:focus:border-brand-800"
//         />

//         <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
//           <CalenderIcon className="size-6" />
//         </span>
//       </div>
//     </div>
//   );
// }



import { useEffect, useRef, useCallback } from 'react';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.css';
import Label from './Label';
import { CalenderIcon } from '../../icons';
import Hook = flatpickr.Options.Hook;

type DateChangeHook = (selectedDates: Date[], dateStr: string, instance: flatpickr.Instance) => void;
type DateOption = flatpickr.Options.DateOption;
// Đổi tên prop 'onChange' thành 'onDateChange' để rõ ràng hơn (flatpickr hook)
type PropsType = {
  id: string;
  mode?: "single" | "multiple" | "range" | "time";
  // Đổi tên để tránh nhầm lẫn với React event, nhưng vẫn tương thích với Hook type
onChange?: DateChangeHook | DateChangeHook[];
  defaultDate?: DateOption;
  label?: string;
  placeholder?: string;
  required?: boolean;
};

export default function DatePicker({
  id,
  mode,
  onChange, // ⚠️ Giữ nguyên tên prop là onChange để tương thích với code cha của bạn
  label,
  defaultDate,
  placeholder,
  required = false,
}: PropsType) {
  // 1. Sử dụng useRef để lưu trữ instance của flatpickr
  const fpInstanceRef = useRef<flatpickr.Instance | null>(null);

  // 2. Hook khởi tạo (Chỉ chạy một lần khi component mount)
  useEffect(() => {
    const config = {
      mode: mode || "single",
      static: true,
      monthSelectorType: "static" as const ,
      dateFormat: "Y-m-d",
      // Đặt giá trị ban đầu (chỉ khi khởi tạo)
      defaultDate: defaultDate, 
      // Truyền hook onChange vào cấu hình
      onChange: onChange,
      minDate: "today",
    };

    // Khởi tạo flatpickr
    const instance =  flatpickr(`#${id}`, config);
    fpInstanceRef.current = Array.isArray(instance) ? instance[0] : instance;

    // Cleanup function: Hủy instance khi component unmount
    return () => {
      if (fpInstanceRef.current) {
        fpInstanceRef.current.destroy();
      }
    };
  // ⚠️ CHỈ CHẠY KHI ID THAY ĐỔI
  // Dù các props khác thay đổi, flatpickr sẽ không bị khởi tạo lại, giải quyết lỗi chính.
  }, [id]); 

  // 3. Hook cập nhật (Chạy khi defaultDate thay đổi)
  useEffect(() => {
    const instance = fpInstanceRef.current;
    
    // Nếu flatpickr đã được khởi tạo và defaultDate thay đổi từ props
    if (instance && defaultDate !== undefined) {
        // Sử dụng setDate() để cập nhật giá trị mà không hủy instance
        // Tham số thứ hai (true) là triggerChange. Nếu bạn muốn update mà không kích hoạt onChange, dùng false.
        // Tôi dùng false để tránh loop khi parent dùng onChange để set state.
         instance.setDate(defaultDate, false); 
    }
  }, [defaultDate]); // ⚠️ Chỉ theo dõi defaultDate

  // 4. Hook cập nhật (Chạy khi mode hoặc minDate thay đổi)
  useEffect(() => {
    const instance = fpInstanceRef.current;
    if (instance) {
        // Cập nhật các option khác mà không destroy instance
        instance.set('mode', mode || 'single');
        // instance.set('minDate', minDate); // Nếu bạn muốn minDate thay đổi
    }
  }, [mode]);


  return (
    <div>
      {label && <Label htmlFor={id}>{label}</Label>}

      <div className="relative">
        <input
          required={required}
          name='datePicker'
          id={id}
          placeholder={placeholder}
          // 💡 Thêm readOnly để flatpickr kiểm soát input
          readOnly={true} 
          className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3  dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30  bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700  dark:focus:border-brand-800"
        />

        <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
          <CalenderIcon className="size-6" />
        </span>
      </div>
    </div>
  );
}  