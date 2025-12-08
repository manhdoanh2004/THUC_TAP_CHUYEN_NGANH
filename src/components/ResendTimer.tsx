'use client'
/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/ResendTimer.tsx

import React, { useEffect, useState, useMemo } from 'react';

const INITIAL_TIME_SECONDS = 60;

interface ResendTimerProps {
    data: any; 
    handleResendEmail: () => void;
    shouldReset: number; // State báo hiệu reset (thay thế boolean bằng number để trigger useEffect)
}

// Hàm format thời gian (nên đặt ngoài component để tránh re-creation)
const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
};

const ResendTimer: React.FC<ResendTimerProps> = ({ data, handleResendEmail, shouldReset }) => {
    const [timeLeft, setTimeLeft] = useState(INITIAL_TIME_SECONDS);

    // 💡 LOGIC START/RESET: Chạy khi data được set lần đầu (sau đăng ký) HOẶC khi shouldReset thay đổi (gửi lại)
    useEffect(() => {
        if (data && data.code === "success" || shouldReset > 0) {
            setTimeLeft(INITIAL_TIME_SECONDS);
        }
    }, [data, shouldReset]); 

    // LOGIC ĐẾM NGƯỢC THỰC TẾ
    useEffect(() => {
        // ❌ Ngăn không cho đếm ngược nếu chưa có data (chưa đăng ký thành công)
        if (!data) return; 
        
        // Ngừng đếm ngược khi thời gian về 0
        if (timeLeft <= 0) {
            return;
        }

        const intervalId = setInterval(() => {
            setTimeLeft((prevTime) => prevTime - 1);
        }, 1000);

        return () => clearInterval(intervalId); // Cleanup
    }, [timeLeft, data]);

    const timerDisplay = useMemo(() => formatTime(timeLeft), [timeLeft]);

    // 💡 CONDITIONAL RENDERING: Không render gì nếu chưa có data (chưa đăng ký thành công)
    if (!data) return null;

    return (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg shadow-sm">
            <p className="mb-2 text-sm font-medium text-blue-800">
                Vui lòng Xác minh email: <span className="text-red-600 font-semibold">{data?.email || ""}</span>
            </p>
            {timeLeft > 0 ? (
                <p className="text-xs text-gray-600">
                    Liên kết sẽ hết hạn trong: <span className="text-red-600 font-bold">{timerDisplay}</span>
                </p>
            ) : (
                <p className="mt-2 text-sm">
                    Chưa nhận được email? <span className="cursor-pointer text-red-600 font-medium hover:text-red-700" onClick={handleResendEmail}>
                        Vui lòng nhấn vào đây để nhận lại
                    </span>
                </p>
            )}
        </div>
    );
};

export default ResendTimer;