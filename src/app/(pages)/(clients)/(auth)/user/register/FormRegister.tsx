/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";
import JustValidate from "just-validate";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

export const FormRegiter = () => {
  const router = useRouter();


  const [data,setData]=useState<any>(null);
  // Đặt thời gian mặc định cho việc xác minh (ví dụ: 5 phút = 300 giây)
  const INITIAL_TIME_SECONDS = 30;
  // 1. State để lưu trữ thời gian còn lại
  const [timeLeft, setTimeLeft] = useState(INITIAL_TIME_SECONDS);
  // 2. State để quản lý việc đang gửi lại email
  const [isResending, setIsResending] = useState(false);

  // Hook useEffect để thiết lập và dọn dẹp Interval
  useEffect(() => {
    // Ngừng đếm ngược khi thời gian về 0
    if (timeLeft <= 0) {
      return;
    }

    // Thiết lập Interval để giảm thời gian mỗi giây
    const intervalId = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    // Cleanup: Xóa interval khi component bị hủy hoặc dependencies thay đổi
    return () => clearInterval(intervalId);
  }, [timeLeft]); // Dependency: Chỉ chạy lại khi timeLeft thay đổi

  // Hàm chuyển đổi giây sang định dạng MM:SS
  const formatTime = (totalSeconds: any) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    // Đảm bảo luôn có 2 chữ số (ví dụ: 05:09)
    const formattedMinutes = String(minutes).padStart(2, "0");
    const formattedSeconds = String(seconds).padStart(2, "0");

    return `${formattedMinutes}:${formattedSeconds}`;
  };

  // Hiển thị thời gian (tối ưu hóa với useMemo)
  const timerDisplay = useMemo(() => formatTime(timeLeft), [timeLeft]);

  // Xử lý khi người dùng nhấn nút "Gửi lại"
  const handleResendEmail = () => {
    if (timeLeft > 0 || isResending) return; // Chỉ cho phép gửi lại khi hết giờ

    setIsResending(true);

    // --- BƯỚC QUAN TRỌNG: GỌI API GỬI LẠI EMAIL TẠI ĐÂY ---
    // Giả lập việc gọi API thành công sau 2 giây
    setTimeout(() => {
      alert("Đã gửi lại liên kết xác minh mới!");

      // Đặt lại đồng hồ đếm ngược và trạng thái
      setTimeLeft(INITIAL_TIME_SECONDS);
      setIsResending(false);
    }, 2000);
  };

  useEffect(() => {
    const validator = new JustValidate("#registerForm");

    validator
      .addField("#fullName", [
        {
          rule: "required",
          errorMessage: "Vui lòng nhập họ tên!",
        },
        {
          rule: "minLength",
          value: 5,
          errorMessage: "Họ tên phải có ít nhất 5 ký tự!",
        },
        {
          rule: "maxLength",
          value: 50,
          errorMessage: "Họ tên không được vượt quá 50 ký tự!",
        },
      ])
      .addField("#email", [
        {
          rule: "required",
          errorMessage: "Vui lòng nhập email của bạn!",
        },
        {
          rule: "email",
          errorMessage: "Email không đúng định dạng!",
        },
      ])
      .addField("#password", [
        {
          rule: "required",
          errorMessage: "Vui lòng nhập mật khẩu!",
        },
        {
          validator: (value: string) => value.length >= 8,
          errorMessage: "Mật khẩu phải chứa ít nhất 8 ký tự!",
        },
        {
          validator: (value: string) => /[A-Z]/.test(value),
          errorMessage: "Mật khẩu phải chứa ít nhất một chữ cái in hoa!",
        },
        {
          validator: (value: string) => /[a-z]/.test(value),
          errorMessage: "Mật khẩu phải chứa ít nhất một chữ cái thường!",
        },
        {
          validator: (value: string) => /\d/.test(value),
          errorMessage: "Mật khẩu phải chứa ít nhất một chữ số!",
        },
        {
          validator: (value: string) => /[@$!%*?&]/.test(value),
          errorMessage: "Mật khẩu phải chứa ít nhất một ký tự đặc biệt!",
        },
      ])
      .onSuccess((event: any) => {

        setIsResending(true);
        const fullName = event.target.fullName.value;
        const email = event.target.email.value;
        const password = event.target.password.value;

        const dataFinal = {
          fullName: fullName,
          email: email,
          password: password,
        };

        fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/register`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dataFinal),
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.code == "error") {
              alert(data.message);
            }

            if (data.code == "success") {
              // router.push("/user/login");
              setData(data)
              setTimeLeft(INITIAL_TIME_SECONDS);
              setIsResending(false)
              event.target.value="";
            }
          });
      });
  }, []);

  return (
    <>
      <form
        id="registerForm"
        action=""
        className="grid grid-cols-1 gap-y-[15px]"
      >
        <div className="">
          <label
            htmlFor="fullName"
            className="block font-[500] text-[14px] text-black mb-[5px]"
          >
            Họ tên *
          </label>
          <input
            type="text"
            name="fullName"
            id="fullName"
            className="w-[100%] h-[46px] border border-[#DEDEDE] rounded-[4px] py-[14px] px-[20px] font-[500] text-[14px] text-black"
          />
        </div>
        <div className="">
          <label
            htmlFor="email"
            className="block font-[500] text-[14px] text-black mb-[5px]"
          >
            Email *
          </label>
          <input
            type="email"
            name="email"
            id="email"
            className="w-[100%] h-[46px] border border-[#DEDEDE] rounded-[4px] py-[14px] px-[20px] font-[500] text-[14px] text-black"
          />
        </div>
        <div className="">
          <label
            htmlFor="password"
            className="block font-[500] text-[14px] text-black mb-[5px]"
          >
            Mật khẩu *
          </label>
          <input
            type="password"
            name="password"
            id="password"
            className="w-[100%] h-[46px] border border-[#DEDEDE] rounded-[4px] py-[14px] px-[20px] font-[500] text-[14px] text-black"
          />
        </div>
        <div className="">
          <button className="bg-[#0088FF] rounded-[4px] w-[100%] h-[48px] px-[20px] font-[700] text-[16px] text-white" disabled={isResending}>
            Đăng ký
          </button>
        </div>

        {data&&<div>
          <p className=" mb-2">Vui lòng Xác minh email  <span className=" text-red-600"> {data?.email||"" }</span></p>
          {/* Khối Đếm Ngược */}
             <span>
                {timeLeft > 0 ? (
              <>
                <p className="">Liên kết sẽ hết hạn trong: <span className=" text-red-600">  {timerDisplay} </span></p>
              </>
            ) : (
              <></>
            )}
              </span> 

          {timeLeft <= 0 && (
            <p className="mt-4 " >
              Chưa nhận được email? <span className=" cursor-pointer text-red-600"  onClick={handleResendEmail} >Vui lòng nhấn vào đây để nhận lại</span>
            </p>
          )}
        </div>}

        <p> Bạn đã có tài khoản ? <Link  href="/user/login" className="underline cursor-pointer hover:text-blue-500"> Đăng nhập ngay</Link></p>
      </form>
    </>
  );
};
