/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";
import PasswordInput from "@/components/input/PasswordInput";
import RadioButton from "@/components/input/RadioButtons";
import JustValidate from "just-validate";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { LuEye, LuEyeClosed } from "react-icons/lu";
import { toast, Toaster } from "sonner";
export const FormRegiter = () => {
  const router = useRouter();
// Danh sách các tùy chọn 
const OPTIONS = [
  { label: 'Nhà tuyển dụng ', value: 'company' },
  { label: 'Ứng viên', value: 'candidate' },
];


const [radiodefault, setRadio] = useState('candidate');


  const [data,setData]=useState<any>(null);
  // Đặt thời gian mặc định cho việc xác minh (ví dụ: 5 phút = 300 giây)
  const INITIAL_TIME_SECONDS = 60;
  // 1. State để lưu trữ thời gian còn lại
  const [timeLeft, setTimeLeft] = useState(INITIAL_TIME_SECONDS);
  // 2. State để quản lý việc đang gửi lại email
  const [isResending, setIsResending] = useState(false);
const validatorRef = useRef<typeof JustValidate | null>(null);
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

    //  GỌI API GỬI LẠI EMAIL 
    // Giả lập việc gọi API thành công sau 2 giây
    setTimeout(() => {
      alert("Đã gửi lại liên kết xác minh mới!");

      // Đặt lại đồng hồ đếm ngược và trạng thái
      setTimeLeft(INITIAL_TIME_SECONDS);
      setIsResending(false);
    }, 2000);
  };

  useEffect(() => {

    if (validatorRef.current === null) {

        const validator = new JustValidate("#registerForm");

    validator
      .addField("#fullName", [
        {
          rule: "required",
          errorMessage: "Vui lòng nhập họ tên hoặc tên công ty!",
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
  event.preventDefault()
    setIsResending(true);
    const target = event.target as HTMLFormElement; // Ép kiểu để truy cập value
    const currentRoleElement = target.elements.namedItem("gender") as HTMLInputElement; 
    const currentRole = currentRoleElement ? currentRoleElement.value : 'candidate';
    const fullName = (target.elements.namedItem("fullName") as HTMLInputElement).value;
    const email = (target.elements.namedItem("email") as HTMLInputElement).value;
    const password = (target.elements.namedItem("password") as HTMLInputElement).value;


    // 1. Khởi tạo đối tượng cơ bản
    let dataFinal: any = {
        email: email,
        password: password,
    };

    let apiUrl = "";

    // 2. Phân luồng logic (Chỉ khởi tạo dữ liệu và URL)
    if (currentRole === 'candidate') {
        dataFinal = { ...dataFinal, fullName: fullName }; 
        apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/user/register`;
    } else {
        dataFinal = { ...dataFinal, companyName: fullName }; 
        apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/company/register`;
    }

    // 3. Thực hiện FETCH CHỈ MỘT LẦN SAU KHI CHUẨN BỊ XONG
    fetch(apiUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(dataFinal),
    })
        .then((res) => res.json())
        .then((data) => {
            setIsResending(false);
            target.reset(); // Dùng target.reset()

            if (data.code === "error") {
                 toast.error('Lỗi', {
                description: `${data.message}`,
                duration: 3000, // Thông báo sẽ tự đóng sau 3 giây
              });
            }

            if (data.code === "success") {
              toast.success('Thông báo', {
                description: `${data.message}`,
                duration: 3000, // Thông báo sẽ tự đóng sau 3 giây
              });
                setData(data);
                setTimeLeft(INITIAL_TIME_SECONDS);
            }
        })
        .catch((error) => {
            setIsResending(false);
            event.target.reset();
              toast.error('Lỗi', {
                description: `Lỗi kết nối đến máy chủ. Xin vui lòng thử lại sau ít phút`,
                duration: 3000, // Thông báo sẽ tự đóng sau 3 giây
              });
            console.error("Lỗi Fetch API:", error);
        
        });

});
validatorRef.current = validator;
}
  
return () => {
             if (validatorRef.current) {
                // Nếu JustValidate có hàm hủy (destroy), nên gọi ở đây
                // Dựa trên tài liệu, JustValidate không có hàm destroy rõ ràng, 
                // nhưng việc xóa tham chiếu là đủ để tránh leak memory.
                validatorRef.current = null; 
             }
        }
  }, []);

  return (
    <>
      <Toaster richColors position="top-right" />
      <form
        id="registerForm"
        action=""
        className="grid grid-cols-1 gap-y-[15px]"
      >
        {radiodefault=="candidate"?(<>
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
        </>):(<>
         <div className="">
                <label htmlFor="fullName" className="block font-[500] text-[14px] text-black mb-[5px]">
                  Tên công ty *
                </label>
                <input 
                    readOnly={isResending}
                  type="text" 
                  name="fullName" 
                  id="fullName" 
                  className="w-[100%] h-[46px] border border-[#DEDEDE] rounded-[4px] py-[14px] px-[20px] font-[500] text-[14px] text-black"
                />
              </div>
        
        </>)}
     
        <div className="">
          <label
            htmlFor="email"
            className="block font-[500] text-[14px] text-black mb-[5px]"
          >
            Email *
          </label>
          <input
          readOnly={isResending}
            type="email"
            name="email"
            id="email"
            className="w-[100%] h-[46px] border border-[#DEDEDE] rounded-[4px] py-[14px] px-[20px] font-[500] text-[14px] text-black"
          />
        </div>
           <PasswordInput isResending={isResending}/>
           <label className="block text-sm font-medium text-gray-700 mb-2">
          Đăng ký với vai trò
          </label>
          <RadioButton  arrayButtonRadio={OPTIONS||[]} buttonRadioDefault={radiodefault} setButtonRadio={setRadio} />
        <div className="">
          <button className={`bg-[#0088FF] rounded-[4px] w-[100%] h-[48px] px-[20px] font-[700] text-[16px] text-white ${isResending?" bg-gray-400 text-gray-600 ":""}  ` }disabled={isResending}>
       {isResending?"Đang đăng ký ":"Đăng ký"} 
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
