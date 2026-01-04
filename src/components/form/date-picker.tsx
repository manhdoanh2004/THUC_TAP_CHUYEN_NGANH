/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useRef } from 'react';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.css';
import Label from './Label';
import { CalenderIcon } from '../../icons';

type DateChangeHook = (selectedDates: Date[], dateStr: string, instance: flatpickr.Instance) => void;
type DateOption = flatpickr.Options.DateOption;

type PropsType = {
  id: string;
  mode?: "single" | "multiple" | "range" | "time";
  onChange?: DateChangeHook | DateChangeHook[];
  defaultDate?: DateOption;
  label?: string;
  placeholder?: string;
  required?: boolean;
  minDate?: DateOption; // Tùy chọn
  maxDate?: DateOption; // Tùy chọn
};

export default function DatePicker({
  id,
  mode = "single",
  onChange,
  label,
  defaultDate,
  placeholder,
  required = false,
  minDate,
  maxDate,
}: PropsType) {
  const fpInstanceRef = useRef<flatpickr.Instance | null>(null);

  // 1. Khởi tạo Flatpickr (Chỉ chạy khi mount hoặc ID thay đổi)
  useEffect(() => {
    const config: any = {
      mode: mode,
      static: true,
      monthSelectorType: "static" as const,
      dateFormat: "Y-m-d",
      defaultDate: defaultDate,
      onChange: onChange,
    };

    // Chỉ thêm vào config nếu có giá trị truyền xuống
    if (minDate) config.minDate = minDate;
    if (maxDate) config.maxDate = maxDate;

    const instance = flatpickr(`#${id}`, config);
    fpInstanceRef.current = Array.isArray(instance) ? instance[0] : instance;

    return () => {
      if (fpInstanceRef.current) {
        fpInstanceRef.current.destroy();
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]); 

  // 2. Cập nhật giá trị ngày khi defaultDate từ cha thay đổi
  useEffect(() => {
    if (fpInstanceRef.current && defaultDate !== undefined) {
      fpInstanceRef.current.setDate(defaultDate, false);
    }
  }, [defaultDate]);

  // 3. Cập nhật động các ràng buộc mà không cần khởi tạo lại toàn bộ
  useEffect(() => {
    const instance = fpInstanceRef.current;
    if (instance) {
      instance.set('mode', mode);
      
      // Cập nhật minDate/maxDate. Nếu undefined, flatpickr sẽ xóa bỏ giới hạn cũ.
      instance.set('minDate', minDate || undefined);
      instance.set('maxDate', maxDate || undefined);
    }
  }, [mode, minDate, maxDate]);

  return (
    <div>
      {label && <Label htmlFor={id}>{label}</Label>}

      <div className="relative">
        <input
          required={required}
          name={id}
          id={id}
          placeholder={placeholder}
          readOnly={true}
          className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:focus:border-brand-800"
        />

        <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
          <CalenderIcon className="size-6" />
        </span>
      </div>
    </div>
  );
}