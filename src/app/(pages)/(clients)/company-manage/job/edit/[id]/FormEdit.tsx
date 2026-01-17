/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */

/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import JustValidate from "just-validate";
import { useCallback, useEffect, useRef, useState } from "react"
import { FilePond, registerPlugin } from 'react-filepond';
import 'filepond/dist/filepond.min.css';
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import { Toaster, toast } from 'sonner';
import { positionList ,workingFromList} from "@/config/variables";

import { useRouter } from "next/navigation";
import { EditorMCE } from "@/components/editor/EditorMCE";
import DatePicker from "@/components/form/date-picker";
import { useAuth } from "@/context/AuthContext";

// Đăng ký plugins
registerPlugin(
  FilePondPluginFileValidateType,
  FilePondPluginImagePreview
);

export const FormEdit = ({ jobDetail }: { jobDetail: any }) => {

 
  const editorRef = useRef(null);
  const [isValid, setIsValid] = useState(false);
  const [datePickerValue, setDatePickerValue] = useState<any | null>(jobDetail?.deadline || null);
const handleDateChange = useCallback((dates:any, currentDateString:any, instance:any) => {
        // Cập nhật state khi ngày thay đổi
        setDatePickerValue(currentDateString); 
    }, []);


    const { isLogin } = useAuth();
     const router = useRouter();
  
      useEffect(() => {
        if(isLogin === false) {
          router.push("/");
        }
      }, [isLogin]);




 useEffect(() => {
    if(jobDetail) {
     
      const validator = new JustValidate("#editForm");

      validator
        .addField('#title', [
          {
            rule: 'required',
            errorMessage: 'Vui lòng nhập tên công việc!'
          },
        ])
        .addField('#salaryMin', [
          {
            rule: 'minNumber',
            value: 0,
            errorMessage: 'Vui lòng nhập mức lương >= 0'
          },
        ])
        .addField('#salaryMax', [
          {
            rule: 'minNumber',
            value: 0,
            errorMessage: 'Vui lòng nhập mức lương >= 0'
          },
        ])
        .onFail(() => {
          setIsValid(false);
        })
        .onSuccess(() => {
          setIsValid(true);
        });
    }
  }, [jobDetail]);
  const handleSubmit = async (event: any) => {
    event.preventDefault();

    const title = event.target.title.value;
    const salaryMin = event.target.salaryMin.value;
    const salaryMax = event.target.salaryMax.value;
    const position = event.target.position.value;
    const workingForm = event.target.workingFrom.value;
    const technologies = event.target.technologies.value;
  
    let description = "";
    if (editorRef.current) {
      description = (editorRef.current as any).getContent();
    }
  
    if(isValid) {
  
    
      const dataFinal={
        title:title
        ,salaryMin:salaryMin,
        salaryMax:salaryMax,
        position:position,
        workingFrom:workingForm,
        description:description,
        technologies:technologies.split(",").map((tech:any)=> tech.trim()),
        deadline:datePickerValue
      }

   
      const promise = fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/jobs/${jobDetail.jobId}`, {
        method: "PUT",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(dataFinal),
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
        loading: 'Đang tạo mới...',
        success: (data) => `${data.message}`, // data ở đây là kết quả trả về khi `resolve`
        error: (err) => err.message || 'Đã xảy ra lỗi!',
      });
    }
  }

  return (
    <>
      <Toaster position="top-right" richColors />
      <form onSubmit={handleSubmit} id="editForm" className="grid sm:grid-cols-2 grid-cols-1 gap-x-[20px] gap-y-[15px]">
        <div className="sm:col-span-2">
          <label htmlFor="title" className="block font-[500] text-[14px] text-black mb-[5px]">
            Tên công việc 
            <span className="text-red-400">*</span>
          </label>
          <input 
            type="text" 
            name="title" 
            id="title" 
            defaultValue={jobDetail?.title}
            className="w-[100%] h-[46px] border border-[#DEDEDE] rounded-[4px] py-[14px] px-[20px] font-[500] text-[14px] text-black"
          />
        </div>
        <div className="">
          <label htmlFor="salaryMin" className="block font-[500] text-[14px] text-black mb-[5px]">
            Mức lương tối thiểu ($)
          </label>
          <input 
            type="number" 
            name="salaryMin" 
            id="salaryMin" 
            className="w-[100%] h-[46px] border border-[#DEDEDE] rounded-[4px] py-[14px] px-[20px] font-[500] text-[14px] text-black"
              defaultValue={jobDetail?.salaryMin.toString()}
          />
        </div>
        <div className="">
          <label htmlFor="salaryMax" className="block font-[500] text-[14px] text-black mb-[5px]">
            Mức lương tối đa ($)
          </label>
          <input 
            type="number" 
            name="salaryMax" 
            id="salaryMax" 
            className="w-[100%] h-[46px] border border-[#DEDEDE] rounded-[4px] py-[14px] px-[20px] font-[500] text-[14px] text-black"
             defaultValue={jobDetail?.salaryMax.toString()}
          />
        </div>
        <div className="">
          <label htmlFor="position" className="block font-[500] text-[14px] text-black mb-[5px]">
            Cấp bậc 
              <span className="text-red-400">*</span>
          </label>
          <select 
            name="position" 
            id="position" 
            defaultValue={jobDetail?.position}
            className="w-[100%] h-[46px] border border-[#DEDEDE] rounded-[4px] py-[14px] px-[20px] font-[500] text-[14px] text-black"
          >
             {positionList.map((item:any,index:any)=> <option key={index} value={item.value}>{item.label}</option>)}
          </select>
        </div>
        <div className="">
          <label htmlFor="workingFrom" className="block font-[500] text-[14px] text-black mb-[5px]">
            Hình thức làm việc 
            <span className="text-red-400">*</span>
          </label>
          <select 
            name="workingFrom" 
            id="workingFrom" 
            className="w-[100%] h-[46px] border border-[#DEDEDE] rounded-[4px] py-[14px] px-[20px] font-[500] text-[14px] text-black"
              defaultValue={jobDetail?.workingFrom}
          >
            {workingFromList.map((item:any,index:any)=> <option key={index} value={item.value}>{item.label}</option>)}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="technologies" className="block font-[500] text-[14px] text-black mb-[5px]">
            Các công nghệ
          </label>
          <input 
            type="text" 
            name="technologies" 
            id="technologies" 
             defaultValue={jobDetail?.technologies.join(", ")}
            className="w-[100%] h-[46px] border border-[#DEDEDE] rounded-[4px] py-[14px] px-[20px] font-[500] text-[14px] text-black"
          />
        </div>
        <div className="sm:col-span-2">
        <DatePicker
            id="datePicker"
            label="Hạn nộp hồ sơ"
            placeholder="Chọn thời gian"
       defaultDate={jobDetail?.deadline} 
            required={true}
            // 💡 Truyền hàm ổn định đã bọc bằng useCallback
            onChange={handleDateChange}
          />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="description" className="block font-[500] text-[14px] text-black mb-[5px]">
            Mô tả chi tiết
          </label>
          <EditorMCE 
            editorRef={editorRef} 
            id={"description" }
            value={jobDetail?.description}
          />
        </div>
        <div className="sm:col-span-2">
          <button className="bg-[#0088FF] rounded-[4px] h-[48px] px-[20px] font-[700] text-[16px] text-white">
            Cập nhật công việc 
          </button>
        </div>
      </form>
    </>
  )
}
