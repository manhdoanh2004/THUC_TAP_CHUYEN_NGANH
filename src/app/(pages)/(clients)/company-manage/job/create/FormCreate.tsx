/* eslint-disable prefer-const */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */

/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import JustValidate from "just-validate";
import { useEffect, useRef, useState } from "react"
import { FilePond, registerPlugin } from 'react-filepond';
import 'filepond/dist/filepond.min.css';
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import { Toaster, toast } from 'sonner';
import { positionList ,workingFromList} from "@/config/variables";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { EditorMCE } from "@/components/editor/EditorMCE";
import DatePicker from "@/components/form/date-picker";
import Switch from "@/components/form/switch/Switch";

// Đăng ký plugins
registerPlugin(
  FilePondPluginFileValidateType,
  FilePondPluginImagePreview
);

export const FormCreate = () => {
  const editorRef = useRef(null);
  const [isValid, setIsValid] = useState(false);
  const [datePickerValue, setDatePickerValue] = useState<any | null>(null);
  
  const [checkSalary,setCheckSalary]=useState(false);

    const { infoUser, isLogin } = useAuth();
     const router = useRouter();
  
      useEffect(() => {
        if(isLogin === false) {
          router.push("/");
        }
      }, [isLogin]);

  useEffect(() => {
    const validator = new JustValidate("#createForm");

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
       .addField('#datePicker', [
        {
         rule:'required',
          errorMessage: 'Vui lòng chọn ngày hết hạn nộp hồ sơ!'
        },
      ])
      .onFail(() => {
        setIsValid(false);
      })
      .onSuccess(() => {
        setIsValid(true);
      });
  }, []);

  const handleChangeSwitchInput=(checked:boolean)=>{
    
    setCheckSalary(checked);

  }


  const handleSubmit = async (event: any) => {
    event.preventDefault();

    const title = event.target.title.value;
    let salaryMin = event.target.salaryMin.value;
    let salaryMax = event.target.salaryMax.value;
    const position = event.target.position.value;
    const workingFrom = event.target.workingForm.value;
    const technologies = event.target.technologies.value;
  
    let description = "";
    if (editorRef.current) {
      description = (editorRef.current as any).getContent();
    }

  
    if(isValid) {
  
    
      let dataFinal={
        title:title
        ,salaryMin:salaryMin,
        salaryMax:salaryMax,
        position:position,
        workingFrom:workingFrom,
        description:description,
        technologies:technologies.split(",").map((tech:any)=> tech.trim()),
        deadline:datePickerValue,
        checkSalary:false
      }

      
    if(checkSalary)
    {
      dataFinal.salaryMin=0;
      dataFinal.salaryMax=0;  
      dataFinal.checkSalary=true;  
    }

     
      const promise = fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/jobs`, {
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(dataFinal),
        credentials: "include", // Gửi kèm cookie
      })
        .then(async (res) => {
          
          const data = await res.json();
          if (data.code === "error") {
            throw new Error(data.message);
          }
          event.target.reset();
      
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
      <form onSubmit={handleSubmit} id="createForm" className="grid sm:grid-cols-2 grid-cols-1 gap-x-[20px] gap-y-[15px]">
        <div className="sm:col-span-2">
          <label htmlFor="title" className="block font-[500] text-[14px] text-black mb-[5px]">
            Tên công việc 
            <span className="text-red-400">*</span>
          </label>
          <input 
            type="text" 
            name="title" 
            id="title" 
            className="w-[100%] h-[46px] border border-[#DEDEDE] rounded-[4px] py-[14px] px-[20px] font-[500] text-[14px] text-black"
          />
        </div>
        <div className="col-span-full col-span-2">
              <Switch defaultChecked={false} label={"Lương thỏa thuận"} onChange={handleChangeSwitchInput} />
        </div>
        <div className="">
          <label htmlFor="salaryMin" className="block font-[500] text-[14px] text-black mb-[5px]">
            Mức lương tối thiểu ($)
          </label>
          <input 
          disabled={checkSalary}
            type="number" 
            name="salaryMin" 
            id="salaryMin" 
            className="w-[100%] h-[46px] border border-[#DEDEDE] rounded-[4px] py-[14px] px-[20px] font-[500] text-[14px] text-black"
          />
        </div>
        <div className="">
          <label htmlFor="salaryMax" className="block font-[500] text-[14px] text-black mb-[5px]">
            Mức lương tối đa ($)
          </label>
          <input 
            disabled={checkSalary}
            type="number" 
            name="salaryMax" 
            id="salaryMax" 
            className="w-[100%] h-[46px] border border-[#DEDEDE] rounded-[4px] py-[14px] px-[20px] font-[500] text-[14px] text-black"
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
            className="w-[100%] h-[46px] border border-[#DEDEDE] rounded-[4px] py-[14px] px-[20px] font-[500] text-[14px] text-black"
          >
             {positionList.map((item:any,index:any)=> <option key={index} value={item.value}>{item.label}</option>)}
          </select>
        </div>
        <div className="">
          <label htmlFor="workingForm" className="block font-[500] text-[14px] text-black mb-[5px]">
            Hình thức làm việc 
            <span className="text-red-400">*</span>
          </label>
          <select 
            name="workingForm" 
            id="workingForm" 
            className="w-[100%] h-[46px] border border-[#DEDEDE] rounded-[4px] py-[14px] px-[20px] font-[500] text-[14px] text-black"
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
            className="w-[100%] h-[46px] border border-[#DEDEDE] rounded-[4px] py-[14px] px-[20px] font-[500] text-[14px] text-black"
          />
        </div>
        <div className="sm:col-span-2">
        <DatePicker
            id="datePicker"
            label="Hạn nộp hồ sơ"
            placeholder="Chọn thời gian"
           minDate={"today"}
            required={true}
            onChange={(dates, currentDateString) => {
              setDatePickerValue(currentDateString);
              // console.log({ dates, currentDateString });
            }}
          />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="description" className="block font-[500] text-[14px] text-black mb-[5px]">
            Mô tả chi tiết
          </label>
          <EditorMCE 
            editorRef={editorRef} 
            id={"description" }
        
          />
        </div>
        <div className="sm:col-span-2">
          <button className="bg-[#0088FF] rounded-[4px] h-[48px] px-[20px] font-[700] text-[16px] text-white">
            Tạo mới
          </button>
        </div>
      </form>
    </>
  )
}
