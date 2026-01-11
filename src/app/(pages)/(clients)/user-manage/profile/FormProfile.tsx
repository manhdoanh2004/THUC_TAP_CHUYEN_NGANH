/* eslint-disable @typescript-eslint/no-unused-vars */
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
import DatePicker from "@/components/form/date-picker";
import RadioButton from "@/components/input/RadioButtons";
import Switch from "@/components/form/switch/Switch";
// Đăng ký plugins
registerPlugin(
  FilePondPluginFileValidateType,
  FilePondPluginImagePreview
);

// Danh sách các tùy chọn giới tính
const GENDER_OPTIONS = [
  { label: 'Nam', value: 'Nam' },
  { label: 'Nữ', value: 'Nữ' },
];
export const FormProfile=()=>
{
    const { infoUser, isLogin } = useAuth();
   
    const [avatars, setAvatars] = useState<any[]>([]);
    const [cvs, setCvs] = useState<any[]>([]);
    const [isValid, setIsValid] = useState(false);
    const router = useRouter();
      const [dateOfBirth, setDateOfBirth] = useState<any | null>(null);
const [genderdefault, setGender] = useState('');
 const [isPrivate,setIsPrivate]=useState(true);
const handleChangeSwitchInput=(checked:boolean)=>{
    
  
    setIsPrivate(!checked);

  }
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
   setIsPrivate(infoUser.private)
          if(infoUser.avatar)
          {
            setAvatars([{
              source:infoUser.avatar
            }])
          }
          if(infoUser.cv!=null)
          {
            setCvs([{
              source:infoUser.cv
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

  const handleSubmit=(event:any)=>
  {
   
     event.preventDefault();

    const fullName = event.target.fullName.value;
    const phone = event.target.phone.value;
    const softSkill = event.target.softSkill.value;
    const experience = event.target.experience.value;
    const desiredSalary = event.target.desiredSalary.value;
    const technologies = event.target.technologies.value;
    const gender =genderdefault;
  
    const address = event.target.address.value;
    let avatar=null;
   
    if(avatars.length>0)
    {
      
         avatar=avatars[0].file;

        if(infoUser.avatar&&infoUser.avatar.includes(avatar?.name))
        {
          avatar=null;
        }
        
    }
    let cv=null;
   
    if(cvs.length>0)
    {
      
         cv=cvs[0].file;

        if(infoUser.cv&&infoUser.cv.includes(cv?.name))
        {
          cv=null;
        }
        
    }

    //Gửi dữ liệu 
     if(isValid)
     {
           // Tạo FormData
      const formData = new FormData();
      formData.append("fullname", fullName);
      formData.append("phone", phone);
      if (avatar) {
          // Kiểm tra xem file có thực sự tồn tại không trước khi append
          formData.append("avatar", avatars[0].file);
      }
      if (cv) {
          // Kiểm tra xem file có thực sự tồn tại không trước khi append
          formData.append("cv", cvs[0].file);
      }
      formData.append("address", address);
      formData.append("gender", gender);
      formData.append("dateOfBirth", dateOfBirth||"");
      formData.append("softSkill", softSkill||"");
      formData.append("experience", experience||"");
      formData.append("isPrivate", `${isPrivate}`||"");
      formData.append("desiredSalary", desiredSalary+""||"");
      formData.append("technologies", technologies+""||""); 
       const promise = fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/update`, {
        method: "PATCH",
        body: formData,
        
        credentials: "include", // Gửi kèm cookie
      })
        .then(async res => {
const text = await res.text();
let data;
try { data = JSON.parse(text); } catch { data = { message: text }; }
if (!res.ok) throw new Error(data.message ||  `${res.status}`);
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
                 <Switch defaultChecked={!isPrivate} label={"Trạng thái tìm việc"} onChange={handleChangeSwitchInput} />
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
                         <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Giới tính:
          </label>
          <RadioButton  arrayButtonRadio={GENDER_OPTIONS||[]} buttonRadioDefault={genderdefault} setButtonRadio={setGender} />
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
              <div className="sm:col-span-2">
                <label htmlFor="cv" className="block font-[500] text-[14px] text-black mb-[5px]">
                 CV
                </label>
                 <FilePond
              name="cv"
              allowMultiple={false} // Chỉ chọn 1 ảnh 
              allowRemove={true} // Cho phép xóa ảnh
              labelIdle='+'
              acceptedFileTypes={['application/pdf']} // Chỉ cho phép file pdf
              files={cvs}
              onupdatefiles={setCvs}
            />

              </div>
              <div className="">
                <label htmlFor="email" className="block font-[500] text-[14px] text-black mb-[5px]">
                  Email <span className="text-red-600">*</span>
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
                  Số điện thoại :
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
                  Địa chỉ :
                </label>
                <input 
                  type="text" 
                  name="address" 
                  id="address" 
                  defaultValue={infoUser?.address}
                  className="w-[100%] h-[46px] border border-[#DEDEDE] rounded-[4px] py-[14px] px-[20px] font-[500] text-[14px] text-black"
                />
              </div>
              <div className="">
                <label htmlFor="technologies" className="block font-[500] text-[14px] text-black mb-[5px]">
                Các công nghệ sử dụng :
                </label>
                <input 
                  type="text" 
                  name="technologies" 
                  id="technologies" 
                  defaultValue={infoUser?.technologies}
                  className="w-[100%] h-[46px] border border-[#DEDEDE] rounded-[4px] py-[14px] px-[20px] font-[500] text-[14px] text-black"
                />
              </div>
              <div className="">
                <label htmlFor="experience" className="block font-[500] text-[14px] text-black mb-[5px]">
                 Kinh nghiệm làm việc :
                </label>
                <input 
                  type="text" 
                  name="experience" 
                  id="experience" 
                  defaultValue={infoUser?.experience}
                  className="w-[100%] h-[46px] border border-[#DEDEDE] rounded-[4px] py-[14px] px-[20px] font-[500] text-[14px] text-black"
                />
              </div>
              <div className="">
                <label htmlFor="softSkill" className="block font-[500] text-[14px] text-black mb-[5px]">
                  Kĩ năng mềm :
                </label>
                <input 
                  type="text" 
                  name="softSkill" 
                  id="softSkill" 
                  defaultValue={infoUser?.softSkill}
                  className="w-[100%] h-[46px] border border-[#DEDEDE] rounded-[4px] py-[14px] px-[20px] font-[500] text-[14px] text-black"
                />
              </div>
              <div className="">
                <label htmlFor="desiredSalary" className="block font-[500] text-[14px] text-black mb-[5px]">
                  Mức lương mong muốn :
                </label>
                <input 
                  type="number" 
                  name="desiredSalary" 
                  id="desiredSalary" 
                  defaultValue={infoUser.desiredSalary}
                  className="w-[100%] h-[46px] border border-[#DEDEDE] rounded-[4px] py-[14px] px-[20px] font-[500] text-[14px] text-black"
                />
              </div>
               <div className="sm:col-span-2">
                      <DatePicker
                    
                          id="datePicker"
                          label="Ngày sinh"
                          placeholder="Chọn thời gian"
                         defaultDate={dateOfBirth}
                          required={true}
                          onChange={(dates, currentDateString) => {
                            setDateOfBirth(currentDateString);
                            //  console.log({ dates, currentDateString });
                          }}
                        />
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