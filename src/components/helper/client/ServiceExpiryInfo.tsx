/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useMemo } from 'react';

const ServiceExpiryInfo = ({ purchaseDateStr, durationDays }: { purchaseDateStr: string; durationDays: number }) => {
  // Logic tính toán ngày
  const { expiryDateStr, remainingText, isExpired, daysLeft } = useMemo(() => {
    if (!purchaseDateStr || !durationDays) return {};

    const purchaseDate :any= new Date(purchaseDateStr);
    const expiryDate:any = new Date(purchaseDate);
    
    // 1. Cộng thêm n ngày để ra ngày hết hạn
    expiryDate.setDate(purchaseDate.getDate() + durationDays);

    const now:any = new Date();
    const diffMs = expiryDate - now; // Độ chênh lệch tính bằng milliseconds

    // Format ngày hiển thị (VD: 20/01/2026 20:43)
    const formattedExpiry = new Intl.DateTimeFormat('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }).format(expiryDate);

    // Xử lý logic hết hạn
    if (diffMs <= 0) {
      return { 
        expiryDateStr: formattedExpiry, 
        remainingText: "Đã hết hạn sử dụng", 
        isExpired: true,
        daysLeft: 0 
      };
    }

    // Tính thời gian còn lại (Ngày, Giờ)
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    let text = "";
    if (days > 0) text += `${days} ngày `;
    if (hours > 0) text += `${hours} giờ`;
    if (days === 0 && hours === 0) text = "Sắp hết hạn (dưới 1 giờ)";

    return { 
      expiryDateStr: formattedExpiry, 
      remainingText: text, 
      isExpired: false,
      daysLeft: days 
    };

  }, [purchaseDateStr, durationDays]);

  if (!expiryDateStr) return null;

  return (
    <div className="bg-white p-3 rounded border border-gray-200 mt-3">
      {/* Hàng hiển thị Ngày hết hạn */}
      <div className="flex justify-between items-center mb-2 border-b border-dashed border-gray-200 pb-2">
        <span className="text-[12px] text-gray-500 font-semibold uppercase">Ngày mua :</span>
        <span className="text-[14px] font-medium text-black">{new Intl.DateTimeFormat('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(purchaseDateStr))}</span>
      </div>
      <div className="flex justify-between items-center mb-2 border-b border-dashed border-gray-200 pb-2">
        <span className="text-[12px] text-gray-500 font-semibold uppercase">Ngày hết hạn</span>
        <span className="text-[14px] font-medium text-black">{expiryDateStr}</span>
      </div>

      {/* Hàng hiển thị Thời gian còn lại */}
      <div className="flex justify-between items-center">
        <span className="text-[12px] text-gray-500 font-semibold uppercase">Còn lại</span>
        <span className={`text-[14px] font-bold ${isExpired ? 'text-red-600' : (daysLeft < 3 ? 'text-orange-500' : 'text-green-600')}`}>
          {remainingText}
        </span>
      </div>
    </div>
  );
};

export default ServiceExpiryInfo;