/* eslint-disable react-hooks/exhaustive-deps */

/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import { useAuth } from "@/hooks/useAuth"
import { useEffect, useState } from "react";
import JustValidate from "just-validate";
import { FilePond, registerPlugin } from 'react-filepond';
import 'filepond/dist/filepond.min.css';
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import { Toaster, toast } from 'sonner'
import { useRouter } from "next/navigation";
import DatePicker from 'react-datepicker'; 
// 2. Import CSS (Quan trọng!)
import "react-datepicker/dist/react-datepicker.css"; 
// 3. Import locale Tiếng Việt (tùy chọn)
import { vi } from 'date-fns/locale';
import RadioButton from "@/components/input/RadioButtons";
// Đăng ký plugins
registerPlugin(
  FilePondPluginFileValidateType,
  FilePondPluginImagePreview
);

// Danh sách các tùy chọn giới tính
const GENDER_OPTIONS = [
  { label: 'Nam', value: 'Nam' },
  { label: 'Nữ', value: 'Nữ' },
  { label: 'Khác', value: 'Khác' },
];
export const FormProfile=()=>
{
    const { infoUser, isLogin } = useAuth();
    const [avatars, setAvatars] = useState<any[]>([]);
    const [isValid, setIsValid] = useState(false);
    const router = useRouter();
    const [dateOfBirth,setDateOfBirth]=useState<any|Date>(null);
const [genderdefault, setGender] = useState('');
    useEffect(() => {
      if(isLogin === false) {
        router.push("/");
      }
    }, [isLogin]);


    useEffect(() => {

        if(infoUser)
        {
   setDateOfBirth(infoUser.dateOfBirth)
   setGender(infoUser.gender)
          if(infoUser.avatar)
          {
            setAvatars([{
              source:infoUser.avatar
            }])
          }

        const validator = new JustValidate("#profileForm");
        validator
          .addField('#fullName', [
            {
              rule: 'required',
              errorMessage: 'Vui lòng nhập họ tên!'
            },
            {
              rule: 'minLength',
              value: 5,
              errorMessage: 'Họ tên phải có ít nhất 5 ký tự!',
            },
            {
              rule: 'maxLength',
              value: 50,
              errorMessage: 'Họ tên không được vượt quá 50 ký tự!',
            },
          ])
          .addField('#email', [
            {
              rule: 'required',
              errorMessage: 'Vui lòng nhập email của bạn!',
            },
            {
              rule: 'email',
              errorMessage: 'Email không đúng định dạng!',
            },
          ])
          .addField('#phone', [
            {
              rule: 'required',
              errorMessage: 'Vui lòng nhập số điện thoại!',
            },
          ])
           .onFail(() => {
          setIsValid(false);
        })
        .onSuccess(() => {
          setIsValid(true);
        });

        }
 
  }, [infoUser]);
const handleChange = (e:any) => {
  const localDate= new Date(e)
  console.log(localDate)
  setDateOfBirth(localDate.toLocaleDateString())
    
  };

  const handleSubmit=(event:any)=>
  {
   
     event.preventDefault();

    const fullName = event.target.fullName.value;
    const email = event.target.email.value;
    const phone = event.target.phone.value;
    const gender =genderdefault;
  
    const address = event.target.phone.value;
    let avatar=null;
    
    if(avatars.length>0)
    {
      
        avatar=avatars[0].file;

        if(infoUser.avatar&&infoUser.avatar.includes(avatar.name))
        {
          avatar=null;
        }
        
    }

    //Gửi dữ liệu 
     if(isValid)
     {
           // Tạo FormData
      const formData = new FormData();
      formData.append("fullname", fullName);
      formData.append("email", email);
      formData.append("phone", phone);
      formData.append("avatar", avatar);
      formData.append("address", address);
      formData.append("gender", gender);
      formData.append("dateOfBirth", dateOfBirth||"");
      console.log(formData)
    
       const promise = fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/update`, {
        method: "PATCH",
        body: formData,
        credentials: "include", // Gửi kèm cookie
      })
         .then(async (res) => {
          const data = await res.json();
          if (data.code === "error") {
            throw new Error(data.message);
          }
          return data;
        });

      toast.promise(promise, {
        loading: 'Đang cập nhật...',
        success: (data) => `${data.message}`, // data ở đây là kết quả trả về khi `resolve`
        error: (err) => err.message || 'Đã xảy ra lỗi!',
      });

     }

  }

    return(<>
        <Toaster position="top-right"
          richColors  
        />
        {infoUser &&   
                (<>
                <form onSubmit={(event)=>handleSubmit(event)} id="profileForm" className="grid sm:grid-cols-2 grid-cols-1 gap-x-[20px] gap-y-[15px]">
              <div className="sm:col-span-2">
                <label htmlFor="fullName" className="block font-[500] text-[14px] text-black mb-[5px]">
                  Họ tên *
                </label>
                <input 
                  type="text" 
                  name="fullName" 
                  id="fullName" 
                  defaultValue={infoUser.fullName}
                  className="w-[100%] h-[46px] border border-[#DEDEDE] rounded-[4px] py-[14px] px-[20px] font-[500] text-[14px] text-black"
                />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="avatar" className="block font-[500] text-[14px] text-black mb-[5px]">
                  Avatar
                </label>
                 <FilePond
              name="avatar"
              allowMultiple={false} // Chỉ chọn 1 ảnh 
              allowRemove={true} // Cho phép xóa ảnh
              labelIdle='+'
              acceptedFileTypes={["image/*"]} // Chỉ cho phép ảnh
              files={avatars}
              onupdatefiles={setAvatars}
            />

              </div>
              <div className="">
                <label htmlFor="email" className="block font-[500] text-[14px] text-black mb-[5px]">
                  Email *
                </label>
                <input readOnly
                  type="email" 
                  name="email" 
                  id="email" 
                  defaultValue={infoUser.email}
                  className="w-[100%] h-[46px] border border-[#DEDEDE] rounded-[4px] py-[14px] px-[20px] font-[500] text-[14px] text-black"
                />
              </div>
              <div className="">
                <label htmlFor="phone" className="block font-[500] text-[14px] text-black mb-[5px]">
                  Số điện thoại
                </label>
                <input 
                  type="text" 
                  name="phone" 
                  id="phone" 
                  defaultValue={infoUser.phone}
                  className="w-[100%] h-[46px] border border-[#DEDEDE] rounded-[4px] py-[14px] px-[20px] font-[500] text-[14px] text-black"
                />
              </div>
              <div className="">
                <label htmlFor="address" className="block font-[500] text-[14px] text-black mb-[5px]">
                  Địa chỉ 
                </label>
                <input 
                  type="text" 
                  name="address" 
                  id="address" 
                  defaultValue={infoUser.address}
                  className="w-[100%] h-[46px] border border-[#DEDEDE] rounded-[4px] py-[14px] px-[20px] font-[500] text-[14px] text-black"
                />
              </div>
              <div className="">
               <label >Ngày tháng năm sinh:</label>
          <DatePicker
            selected={dateOfBirth} // Giá trị ngày được chọn
            onChange={(date) => handleChange(date)} // Hàm xử lý khi ngày thay đổi
            
            // --- Cấu hình quan trọng cho việc chọn ngày sinh ---
            showYearDropdown // Cho phép chọn năm từ dropdown
            showMonthDropdown // Cho phép chọn tháng từ dropdown
            dropdownMode="select" // Đảm bảo dropdown hoạt động trên mọi trình duyệt
            placeholderText="Chọn ngày tháng năm sinh"
            dateFormat="dd/MM/yyyy" // Định dạng hiển thị
            maxDate={new Date()} // Không cho phép chọn ngày trong tương lai (Ngày sinh)
            locale={vi} // (Tùy chọn) Sử dụng ngôn ngữ Tiếng Việt cho lịch
            // --- End Cấu hình ---
            
            required
            customInput={
                // Style cho input hiển thị
                <input 
                    style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer' }}
                />
            }
          />
              </div>
              <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Giới tính:
          </label>
          <RadioButton  arrayButtonRadio={GENDER_OPTIONS||[]} buttonRadioDefault={genderdefault} setButtonRadio={setGender} />
        </div>
              <div className="sm:col-span-2">
                <button className="bg-[#0088FF] rounded-[4px] h-[48px] px-[20px] font-[700] text-[16px] text-white">
                  Cập nhật
                </button>
              </div>
            </form>
                </>)}
   
    </>)
}