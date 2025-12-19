'use client';

import React, { useState } from 'react';
import * as Slider from '@radix-ui/react-slider';

const SalaryRangePicker = () => {
  // Khởi tạo giá trị mặc định [Min, Max] bằng USD
  const [range, setRange] = useState([200, 1000]);
  
  const minLimit = 0;
  const maxLimit = 5000; // 20k USD
  const step = 100; // Mỗi lần kéo nhảy 100$

  // Hàm format sang định dạng $ (English - US)
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0, // Không hiển thị phần thập phân lẻ
    }).format(value);
  };

  return (
    <div className="w-full max-w-md  bg-white rounded-xl ">
      <p className="text-lg font-bold text-gray-800 ">Salary Range ($)</p>
      
      {/* Hiển thị con số */}
      <div className="flex gap-[10px] items-center ">
        <div className="flex flex-col">
          <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Minimum</span>
          <span className="text-xl font-bold text-emerald-600">{formatCurrency(range[0])}</span>
        </div>
        <div className="h-8 w-[1px] bg-gray-200"></div>
        <div className="flex flex-col text-right">
          <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Maximum</span>
          <span className="text-xl font-bold text-emerald-600">{formatCurrency(range[1])}</span>
        </div>
      </div>

      {/* Slider */}
      <Slider.Root
        className="relative flex items-center select-none touch-none w-full h-5"
        value={range}
        max={maxLimit}
        min={minLimit}
        step={step}
        onValueChange={setRange}
      >
        {/* Thanh ray nền */}
        <Slider.Track className="bg-gray-100 relative grow rounded-full h-2 shadow-inner">
          {/* Thanh highlight khoảng giữa */}
          <Slider.Range className="absolute bg-emerald-500 rounded-full h-full" />
        </Slider.Track>
        
        {/* Nút kéo 1 */}
        <Slider.Thumb
          className="block w-6 h-6 bg-white border-2 border-emerald-500 shadow-md rounded-full hover:bg-emerald-50 focus:outline-none focus:ring-4 focus:ring-emerald-100 transition-all cursor-grab active:cursor-grabbing"
          aria-label="Minimum Salary"
        />
        
        {/* Nút kéo 2 */}
        <Slider.Thumb
          className="block w-6 h-6 bg-white border-2 border-emerald-500 shadow-md rounded-full hover:bg-emerald-50 focus:outline-none focus:ring-4 focus:ring-emerald-100 transition-all cursor-grab active:cursor-grabbing"
          aria-label="Maximum Salary"
        />
      </Slider.Root>

    </div>
  );
};

export default SalaryRangePicker;