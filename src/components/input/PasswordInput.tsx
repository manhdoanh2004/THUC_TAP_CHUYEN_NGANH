import React, { useState } from 'react';
import { LuEye, LuEyeClosed } from 'react-icons/lu'; // Giả định bạn đã cài đặt react-icons

type PasswordInput={
    isResending?:boolean
}
const PasswordInput = ({isResending}:PasswordInput) => {
    // 1. Khai báo state để quản lý trạng thái ẩn/hiện
    const [showPassword, setShowPassword] = useState(false);

    // Hàm xử lý sự kiện click
    const togglePasswordVisibility = () => {
        setShowPassword(prevShowPassword => !prevShowPassword);
    };

    return (
       <div className="relative"> 
            <label
                htmlFor="password"
                className="block font-[500] text-[14px] text-black mb-[5px]"
            >
                Mật khẩu *
            </label>
            <input
                readOnly={isResending}
                // 2. Cập nhật type dựa trên state showPassword
                type={showPassword ? 'text' : 'password'} 
                name="password"
                id="password"
                // Tùy chỉnh padding-right để không che icon
                className=" text-black shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 w-[100%]  h-[46px] border border-[#DEDEDE] rounded-[4px] py-[14px] px-[20px] font-[500] text-[14px] pr-10" 
            />
            
            {/* 3. Icon chuyển đổi */}
            <span
                className="absolute right-3 top-[51px] -translate-y-1/2 cursor-pointer text-gray-500"
                onClick={togglePasswordVisibility} // Xử lý click
            >
                {/* 4. Hiển thị icon phù hợp với trạng thái */}
                {showPassword ? <LuEye size={20} /> : <LuEyeClosed size={20} />}
            </span>
        </div>
    );
};

export default PasswordInput;