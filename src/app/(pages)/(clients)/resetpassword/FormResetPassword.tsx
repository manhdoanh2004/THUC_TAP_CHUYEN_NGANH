'use client'
import React, { useState, useEffect } from 'react';

// Enum để quản lý các bước của quy trình
enum Step {
  EMAIL_ENTRY,
  OTP_ENTRY,
  PASSWORD_RESET,
}

// Định nghĩa kiểu dữ liệu cho state của form
interface FormState {
  email: string; // Thêm trường email
  otp: string;
  password: string;
  confirmPassword: string;
}

const ResetPasswordForm: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<Step>(Step.EMAIL_ENTRY); // Bắt đầu từ bước nhập Email
  const [formData, setFormData] = useState<FormState>({
    email: '',
    otp: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // Trạng thái đếm ngược OTP (300 giây = 5 phút)
  const [otpTimer, setOtpTimer] = useState<number>(0); // Bắt đầu bằng 0, chỉ chạy khi nhận OTP
  const [isOtpExpired, setIsOtpExpired] = useState<boolean>(false);

  // Logic đếm ngược thời gian
  useEffect(() => {
    // Chỉ chạy timer ở Bước 2 (OTP_ENTRY) và khi chưa thành công và timer > 0
    if (currentStep !== Step.OTP_ENTRY || success || otpTimer <= 0) {
        if (otpTimer <= 0 && currentStep === Step.OTP_ENTRY) {
             setIsOtpExpired(true);
        }
        return;
    }

    // Thiết lập interval để giảm thời gian mỗi giây
    const timerId = setInterval(() => {
      setOtpTimer(prev => prev - 1);
    }, 1000);

    // Dọn dẹp interval khi component unmount hoặc dependency thay đổi
    return () => clearInterval(timerId);
  }, [currentStep, otpTimer, success]);

  // Hàm chuyển đổi giây thành định dạng MM:SS
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Đảm bảo OTP chỉ nhập số
    if (name === 'otp') {
        const numericValue = value.replace(/[^0-9]/g, '').slice(0, 6);
        setFormData((prev) => ({ ...prev, [name]: numericValue }));
        return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  // Hàm kiểm tra định dạng email cơ bản
  const isValidEmail = (email: string) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  // 1. Xử lý bước nhập Email (Bước mới)
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!isValidEmail(formData.email)) {
      setError('⚠️ Vui lòng nhập địa chỉ email hợp lệ.');
      return;
    }

    setIsLoading(true);
 
    try {
    
        const res=await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/forgot-password`,{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                email:formData.email
            })
        });

        const data=await res.json();

        if(data.code=='success')
        {
               // Thiết lập lại bộ đếm thời gian và chuyển bước
        setOtpTimer(300);
        setIsOtpExpired(false);
        setCurrentStep(Step.OTP_ENTRY);
        setError(`✅ Mã OTP đã được gửi đến email ${formData.email}. Mã có giá trị 5 phút.`); 
        }
        else{
              setError('⚠️ Không thể tìm thấy email này hoặc có lỗi xảy ra. Vui lòng kiểm tra lại.');
        }

   
      
    } catch (err) {
      setError('⚠️ Không thể tìm thấy email này hoặc có lỗi xảy ra. Vui lòng kiểm tra lại.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  // 2. Xử lý gửi lại mã OTP
  const handleResendOtp = async () => {
    if (isLoading) return;

    setIsLoading(true);
    setError(null);
    setIsOtpExpired(false); // Reset cờ hết hạn

    try {
      // *** Mô phỏng cuộc gọi API gửi lại OTP ***
      console.log(`Đang gửi lại OTP cho ${formData.email}...`);
      await new Promise(resolve => setTimeout(resolve, 1500)); 

      // Thiết lập lại bộ đếm thời gian
      setOtpTimer(300);
      setError(`✅ Mã OTP mới đã được gửi đến email ${formData.email}. Mã có giá trị 5 phút.`); 
      
    } catch (err) {
      setError('⚠️ Không thể gửi lại mã. Vui lòng thử lại sau.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };


  // 3. Xử lý bước nhập Mã OTP
  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (formData.otp.length !== 6) {
      setError('⚠️ Mã OTP phải có 6 chữ số.');
      return;
    }
    
    if (isOtpExpired) {
        setError('⚠️ Mã OTP đã hết hạn. Vui lòng nhấn "Gửi lại mã" để nhận mã mới.');
        return;
    }

    setIsLoading(true);

    // *** Mô phỏng cuộc gọi API xác thực OTP ***
    try {
       const res=await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/verify-otp`,{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                otp:formData.otp
            }),
            credentials:"include"
        });

        const data=await res.json();
        if(data.code=="success")
        {
              setOtpTimer(0); // Dừng timer ngay lập tức
            setCurrentStep(Step.PASSWORD_RESET); // Chuyển sang bước 3
            setFormData((prev) => ({ ...prev, otp: '' })); // Xóa OTP đã nhập
        }else{
             setError('⚠️ Mã OTP không hợp lệ. Vui lòng kiểm tra lại.');
        }
      
    } catch (err) {
      setError('⚠️ Mã OTP không hợp lệ. Vui lòng kiểm tra lại.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // 4. Xử lý bước Đặt lại Mật khẩu
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    // Kiểm tra mật khẩu có khớp không
    if (formData.password !== formData.confirmPassword) {
      setError('⚠️ Mật khẩu nhập lại không khớp.');
      return;
    }

    // Kiểm tra độ dài mật khẩu (tối thiểu 8 ký tự)
    if (formData.password.length < 8) {
      setError('⚠️ Mật khẩu phải có ít nhất 8 ký tự.');
      return;
    }

    setIsLoading(true);

 
    try {
       const res=await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/reset-password`,{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                newPassword:formData.password
            }),
            credentials:"include"
        });

        const data=await res.json();
        if(data.code=="success")
        {
              setSuccess(true);
      setFormData({ email: formData.email, otp: '', password: '', confirmPassword: '' }); // Giữ lại email
      setCurrentStep(Step.PASSWORD_RESET); // Đảm bảo bước vẫn ở 3 để hiển thị success
        }else{
               setError('⚠️ Đã xảy ra lỗi khi đặt lại mật khẩu. Vui lòng thử lại.');
        }
      
    
    } catch (err) {
      setError('⚠️ Đã xảy ra lỗi khi đặt lại mật khẩu. Vui lòng thử lại.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Hàm render nút bấm chung với hiệu ứng loading
  const renderButton = (text: string, isSubmit = true) => (
    <button
      type={isSubmit ? 'submit' : 'button'}
      className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white 
        ${isLoading
          ? 'bg-blue-400 cursor-not-allowed'
          : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150'
        }`}
      disabled={isLoading}
    >
      {isLoading && isSubmit ? (
        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : (
        text
      )}
    </button>
  );

  // Tính toán độ rộng thanh tiến trình
  const progressWidth = () => {
    switch (currentStep) {
        case Step.EMAIL_ENTRY: return 'w-1/3';
        case Step.OTP_ENTRY: return 'w-2/3';
        case Step.PASSWORD_RESET: return 'w-full';
        default: return 'w-0';
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4 font-sans">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-2xl border border-gray-100">
        <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-6">
          Đặt lại Mật khẩu
        </h2>
        
        {/* Thanh tiến trình */}
        <div className="mb-6">
            <div className="h-2 w-full bg-gray-300 rounded-full">
                <div 
                    className={`h-2 rounded-full bg-blue-600 transition-all duration-500 ${progressWidth()}`}
                ></div>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
                {currentStep === Step.EMAIL_ENTRY && 'Bước 1: Nhập Email'}
                {currentStep === Step.OTP_ENTRY && 'Bước 2: Xác minh Mã OTP'}
                {currentStep === Step.PASSWORD_RESET && 'Bước 3: Đặt Mật khẩu mới'}
            </p>
        </div>

        {/* Thông báo Lỗi / Thành công */}
        {error && (
          <div className={`mb-4 p-3 border rounded-lg shadow-sm ${error.startsWith('✅') ? 'bg-green-100 text-green-700 border-green-400' : 'bg-red-100 text-red-700 border-red-400'}`}>
            {error.replace(/^[✅⚠️]/, '').trim()}
          </div>
        )}
        {success && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 border border-green-400 rounded-lg shadow-sm">
            ✅ Mật khẩu đã được đặt lại thành công! Bạn có thể <a href="/login" className="font-bold text-green-800 hover:underline">Đăng nhập</a> ngay bây giờ.
          </div>
        )}
        
        {/* --- Form Nhập Email (Bước 1) --- */}
        {currentStep === Step.EMAIL_ENTRY && !success && (
            <form onSubmit={handleEmailSubmit} className="space-y-6">
                <p className="text-sm text-gray-600 text-center">
                    Vui lòng nhập email đã đăng ký của bạn để nhận mã xác thực (OTP).
                </p>
                <div>
                    <label 
                        htmlFor="email" 
                        className="block text-sm font-medium text-gray-700 mb-1"
                    >
                        Địa chỉ Email
                    </label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                        placeholder="ten@email.com"
                        disabled={isLoading}
                    />
                </div>
                {renderButton('Tiếp tục')}
            </form>
        )}


        {/* --- Form Nhập OTP (Bước 2) --- */}
        {currentStep === Step.OTP_ENTRY && !success && (
          <form onSubmit={handleOtpSubmit} className="space-y-6">
            <p className="text-sm text-gray-600 text-center">
              Mã xác thực 6 chữ số đã được gửi đến email <span className="font-semibold text-gray-800">{formData.email}</span>. Vui lòng kiểm tra hộp thư đến.
            </p>
            
            {/* Hiển thị đếm ngược */}
            <div className="text-center mb-4">
                <span className={`text-4xl font-bold font-mono ${isOtpExpired ? 'text-red-500 animate-pulse' : 'text-blue-600'}`}>
                    {formatTime(otpTimer)}
                </span>
            </div>


            <div>
              <label 
                htmlFor="otp" 
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Mã OTP (6 chữ số)
              </label>
              <input
                id="otp"
                name="otp"
                type="tel" // Sử dụng type="tel" để kích hoạt bàn phím số trên di động
                required
                maxLength={6}
                value={formData.otp}
                onChange={handleChange}
                className="w-full px-4 py-3 text-center text-xl tracking-[0.5em] border-2 border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150 font-mono"
                placeholder="------"
                disabled={isLoading || isOtpExpired} // Tắt nhập khi đang tải hoặc hết hạn
              />
            </div>

            {renderButton('Xác thực Mã')}
            
            {/* Nút Gửi lại mã hoặc thông báo thời gian còn lại */}
            <div className="text-center text-sm mt-4">
                {isOtpExpired ? (
                    <button 
                        type="button" 
                        onClick={handleResendOtp}
                        className="text-blue-600 font-medium hover:text-blue-800 disabled:text-gray-400 transition duration-150"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Đang gửi...' : 'Gửi lại mã'}
                    </button>
                ) : (
                    <span className="text-gray-500">
                        Mã sẽ hết hạn sau {formatTime(otpTimer)}.
                    </span>
                )}
            </div>
          </form>
        )}

        {/* --- Form Đặt lại Mật khẩu (Bước 3) --- */}
        {currentStep === Step.PASSWORD_RESET && !success && (
          <form onSubmit={handlePasswordSubmit} className="space-y-6">
            <p className="text-sm text-gray-600">
              Mã xác thực đã được chấp nhận. Vui lòng nhập mật khẩu mới của bạn. Mật khẩu phải có ít nhất 8 ký tự.
            </p>

            {/* Trường Mật khẩu Mới */}
            <div>
              <label 
                htmlFor="password" 
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Mật khẩu mới
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                minLength={8}
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                disabled={isLoading}
              />
            </div>

            {/* Trường Xác nhận Mật khẩu */}
            <div>
              <label 
                htmlFor="confirmPassword" 
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Xác nhận Mật khẩu mới
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                minLength={8}
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                disabled={isLoading}
              />
            </div>

            {renderButton('Hoàn tất Đặt lại Mật khẩu')}
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPasswordForm;