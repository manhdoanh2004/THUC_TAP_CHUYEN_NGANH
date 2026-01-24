/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */

/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from "react";
import JustValidate from "just-validate";
import { FilePond, registerPlugin } from "react-filepond";
import "filepond/dist/filepond.min.css";
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import { Toaster, toast } from "sonner";
import { useRef } from "react";

import { useRouter } from "next/navigation";
import { EditorMCE } from "@/components/editor/EditorMCE";
import MultiSelect from "@/components/form/MultiSelect";
import {cityList} from "../../../../../config/variables"
import { useAuth } from "@/context/AuthContext";
import ServiceExpiryInfo from "@/components/helper/client/ServiceExpiryInfo";
// Đăng ký plugins
registerPlugin(FilePondPluginFileValidateType, FilePondPluginImagePreview);

export const FormProfile = () => {

  
  const [selectedValues, setSelectedValues] = useState<any[]>([]);
  const editorRef = useRef(null);
  const { infoCompany,isLogin } = useAuth();
  const [logos, setLogos] = useState<any[]>([]);
  const [isValid, setIsValid] = useState(false);
  const [newcityList, setnewcityList] = useState<any[]>([]);
  const [companycityList, setcompanycityList] = useState<any[]|undefined>(undefined);
   const router = useRouter();

    useEffect(() => {
      if(isLogin === false) {
        router.push("/");
      }
      const newCityList=cityList.map((item:any,index:number)=>{
        return ({
          value:item.name?item.name:"",
          selected:false,
          text:item.name?item.name:"",

        })
      });
      setnewcityList(newCityList)
      
    }, [isLogin]);


  useEffect(() => {
    if (infoCompany) {
      setcompanycityList(infoCompany?.city)
      if (infoCompany.logo) {
        setLogos([
          {
            source: infoCompany.logo,
          },
        ]);
      }

      const validator = new JustValidate("#profileForm");

      validator
        .addField("#companyName", [
          {
            rule: "required",
            errorMessage: "Vui lòng nhập tên công ty!",
          },
          {
            rule: "maxLength",
            value: 200,
            errorMessage: "Tên công ty không được vượt quá 200 ký tự!",
          },
        ])
       
        .onFail(() => {
          setIsValid(false);
        })
        .onSuccess(() => {
          setIsValid(true);
        });
    }
  }, [infoCompany]);

  const handleSubmit = async (event: any) => {
    event.preventDefault();

    const companyName = event.target.companyName.value;
    const city =selectedValues;
    const address = event.target.address.value;
    const companyModel = event.target.companyModel.value;
    const companyEmployees = event.target.companyEmployees.value;
    const workingTime = event.target.workingTime.value;
    const workOvertime = event.target.workOvertime.value;
   
   
    let description = "";
    if (editorRef.current) {
      description = (editorRef.current as any).getContent();
    }

    const phone = event.target.phone.value;
    let logo = null;
    if (logos.length > 0) {
      logo = logos[0].file;

      if (infoCompany.logo && infoCompany.logo.includes(logo?.name)) {
        logo = null;
      }
    }

    if (isValid) {
      // Tạo FormData
      const formData = new FormData();
      formData.append("companyName", companyName);
      formData.append("city", JSON.stringify(city));
      formData.append("address", address);
      formData.append("companyModel", companyModel);
      formData.append("companyEmployees", companyEmployees);
      formData.append("workingTime", workingTime);
      formData.append("workingOvertime", workOvertime);
      formData.append("description", description);
      if(logo)formData.append("logo", logo);
      formData.append("phone", phone);

      const promise = fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/company/update`,
        {
          method: "PATCH",
          body: formData,
          credentials: "include", // Gửi kèm cookie
        }
      ).then(async (res) => {
        const data = await res.json();
        if (data.code === "error") {
          throw new Error(data.message);
        }
        return data;
      });

      toast.promise(promise, {
        loading: "Đang cập nhật...",
        success: (data) => `${data.message}`, // data ở đây là kết quả trả về khi `resolve`
        error: (err) => err.message || "Đã xảy ra lỗi!",
      });
    }
  };

  const servicePackage= {
        "createdAt": "17/01/2026 20:30:51",
        "updateAt": "17/01/2026 20:30:51",
        "id": 3,
        "code": "VIP2",
        "name": "Gói vip 2",
        "price": 200000.0,
        "durationDays": 30,
        "postLimit": 50,
        "weeklyPostLimit": 10,
        "jobPostDurationDays": 30,
        "description": "",
        "isActive": true
    }
  return (
    <>
      <Toaster position="top-right" richColors />
      {/* {infoCompany && (
        <form
          onSubmit={handleSubmit}
          id="profileForm"
          action=""
          className="grid sm:grid-cols-2 grid-cols-1 gap-x-[20px] gap-y-[15px]"
        >
          <div className="sm:col-span-2">
            <label
              htmlFor="companyName"
              className="block font-[500] text-[14px] text-black mb-[5px]"
            >
              Tên công ty *
            </label>
            <input
              type="text"
              defaultValue={infoCompany.companyName}
              name="companyName"
              id="companyName"
              className="w-[100%] h-[46px] border border-[#DEDEDE] rounded-[4px] py-[14px] px-[20px] font-[500] text-[14px] text-black"
            />
          </div>
          <div className="sm:col-span-2">
            <label
              htmlFor="logo"
              className="block font-[500] text-[14px] text-black mb-[5px]"
            >
              Logo
            </label>
            <FilePond
              name="logo"
              allowMultiple={false} // Chỉ chọn 1 ảnh
              allowRemove={true} // Cho phép xóa ảnh
              labelIdle="+"
              acceptedFileTypes={["image/*"]} // Chỉ cho phép ảnh
              files={logos}
              onupdatefiles={setLogos}
            />
          </div>
          <div className="relative">

               <MultiSelect
             
            label="Thành phố"
            options={newcityList}
            defaultSelected={companycityList}
            onChange={(values) => setSelectedValues(values)}
          />
          </div>
          <div className="">
            <label
              htmlFor="address"
              className="block font-[500] text-[14px] text-black mb-[5px]"
            >
              Địa chỉ
            </label>
            <input
              type="text"
              name="address"
              defaultValue={infoCompany.address}
              id="address"
              className="w-[100%] h-[46px] border border-[#DEDEDE] rounded-[4px] py-[14px] px-[20px] font-[500] text-[14px] text-black"
            />
          </div>
          <div className="">
            <label
              htmlFor="companyModel"
              className="block font-[500] text-[14px] text-black mb-[5px]"
            >
              Mô hình công ty
            </label>
            <input
              type="text"
              name="companyModel"
              defaultValue={infoCompany.companyModel}
              id="companyModel"
              className="w-[100%] h-[46px] border border-[#DEDEDE] rounded-[4px] py-[14px] px-[20px] font-[500] text-[14px] text-black"
            />
          </div>
          <div className="">
            <label
              htmlFor="companyEmployees"
              className="block font-[500] text-[14px] text-black mb-[5px]"
            >
              Quy mô công ty
            </label>
            <input
              type="text"
              name="companyEmployees"
              defaultValue={infoCompany.companyEmployees}
              id="companyEmployees"
              className="w-[100%] h-[46px] border border-[#DEDEDE] rounded-[4px] py-[14px] px-[20px] font-[500] text-[14px] text-black"
            />
          </div>
          <div className="">
            <label
              htmlFor="workingTime"
              className="block font-[500] text-[14px] text-black mb-[5px]"
            >
              Thời gian làm việc
            </label>
            <input
              type="text"
              name="workingTime"
              defaultValue={infoCompany.workingTime}
              id="workingTime"
              className="w-[100%] h-[46px] border border-[#DEDEDE] rounded-[4px] py-[14px] px-[20px] font-[500] text-[14px] text-black"
            />
          </div>
          <div className="">
            <label
              htmlFor="workOvertime"
              className="block font-[500] text-[14px] text-black mb-[5px]"
            >
              Làm việc ngoài giờ
            </label>
            <input
              type="text"
              name="workOvertime"
              defaultValue={infoCompany.workOvertime}
              id="workOvertime"
              className="w-[100%] h-[46px] border border-[#DEDEDE] rounded-[4px] py-[14px] px-[20px] font-[500] text-[14px] text-black"
            />
          </div>
      
          <div className="">
            <label
              htmlFor="phone"
              className="block font-[500] text-[14px] text-black mb-[5px]"
            >
              Số điện thoại
            </label>
            <input
              type="text"
              name="phone"
              defaultValue={infoCompany.phone}
              id="phone"
              className="w-[100%] h-[46px] border border-[#DEDEDE] rounded-[4px] py-[14px] px-[20px] font-[500] text-[14px] text-black"
            />
          </div>
          <div className="sm:col-span-2">
            <label
              htmlFor="description"
              className="block font-[500] text-[14px] text-black mb-[5px]"
            >
              Mô tả chi tiết
            </label>
              <EditorMCE editorRef={editorRef} value ={infoCompany.description}/>
          </div>
          <div className="sm:col-span-2">
            <button className="bg-[#0088FF] rounded-[4px] h-[48px] px-[20px] font-[700] text-[16px] text-white">
              Cập nhật
            </button>
          </div>
        </form>
      )} */}
      {infoCompany && (
  <div className="grid lg:grid-cols-2 grid-cols-1 gap-[30px] items-start">
    <div>
      <form
        onSubmit={handleSubmit}
        id="profileForm"
        action=""
        className="grid sm:grid-cols-2 grid-cols-1 gap-x-[20px] gap-y-[15px]"
      >
        <div className="sm:col-span-2">
          <label
            htmlFor="companyName"
            className="block font-[500] text-[14px] text-black mb-[5px]"
          >
            Tên công ty *
          </label>
          <input
            type="text"
            defaultValue={infoCompany.companyName}
            name="companyName"
            id="companyName"
            className="w-[100%] h-[46px] border border-[#DEDEDE] rounded-[4px] py-[14px] px-[20px] font-[500] text-[14px] text-black"
          />
        </div>
        <div className="sm:col-span-2">
          <label
            htmlFor="logo"
            className="block font-[500] text-[14px] text-black mb-[5px]"
          >
            Logo
          </label>
          <FilePond
            name="logo"
            allowMultiple={false}
            allowRemove={true}
            labelIdle="+"
            acceptedFileTypes={["image/*"]}
            files={logos}
            onupdatefiles={setLogos}
          />
        </div>
        <div className="relative">
          <MultiSelect
            label="Thành phố"
            options={newcityList}
            defaultSelected={companycityList}
            onChange={(values) => setSelectedValues(values)}
          />
        </div>
        <div className="">
          <label
            htmlFor="address"
            className="block font-[500] text-[14px] text-black mb-[5px]"
          >
            Địa chỉ
          </label>
          <input
            type="text"
            name="address"
            defaultValue={infoCompany.address}
            id="address"
            className="w-[100%] h-[46px] border border-[#DEDEDE] rounded-[4px] py-[14px] px-[20px] font-[500] text-[14px] text-black"
          />
        </div>
        <div className="">
          <label
            htmlFor="companyModel"
            className="block font-[500] text-[14px] text-black mb-[5px]"
          >
            Mô hình công ty
          </label>
          <input
            type="text"
            name="companyModel"
            defaultValue={infoCompany.companyModel}
            id="companyModel"
            className="w-[100%] h-[46px] border border-[#DEDEDE] rounded-[4px] py-[14px] px-[20px] font-[500] text-[14px] text-black"
          />
        </div>
        <div className="">
          <label
            htmlFor="companyEmployees"
            className="block font-[500] text-[14px] text-black mb-[5px]"
          >
            Quy mô công ty
          </label>
          <input
            type="text"
            name="companyEmployees"
            defaultValue={infoCompany.companyEmployees}
            id="companyEmployees"
            className="w-[100%] h-[46px] border border-[#DEDEDE] rounded-[4px] py-[14px] px-[20px] font-[500] text-[14px] text-black"
          />
        </div>
        <div className="">
          <label
            htmlFor="workingTime"
            className="block font-[500] text-[14px] text-black mb-[5px]"
          >
            Thời gian làm việc
          </label>
          <input
            type="text"
            name="workingTime"
            defaultValue={infoCompany.workingTime}
            id="workingTime"
            className="w-[100%] h-[46px] border border-[#DEDEDE] rounded-[4px] py-[14px] px-[20px] font-[500] text-[14px] text-black"
          />
        </div>
        <div className="">
          <label
            htmlFor="workOvertime"
            className="block font-[500] text-[14px] text-black mb-[5px]"
          >
            Làm việc ngoài giờ
          </label>
          <input
            type="text"
            name="workOvertime"
            defaultValue={infoCompany.workOvertime}
            id="workOvertime"
            className="w-[100%] h-[46px] border border-[#DEDEDE] rounded-[4px] py-[14px] px-[20px] font-[500] text-[14px] text-black"
          />
        </div>

        <div className="">
          <label
            htmlFor="phone"
            className="block font-[500] text-[14px] text-black mb-[5px]"
          >
            Số điện thoại
          </label>
          <input
            type="text"
            name="phone"
            defaultValue={infoCompany.phone}
            id="phone"
            className="w-[100%] h-[46px] border border-[#DEDEDE] rounded-[4px] py-[14px] px-[20px] font-[500] text-[14px] text-black"
          />
        </div>
        <div className="sm:col-span-2">
          <label
            htmlFor="description"
            className="block font-[500] text-[14px] text-black mb-[5px]"
          >
            Mô tả chi tiết
          </label>
          <EditorMCE editorRef={editorRef} value={infoCompany.description} />
        </div>
        <div className="sm:col-span-2">
          <button className="bg-[#0088FF] rounded-[4px] h-[48px] px-[20px] font-[700] text-[16px] text-white w-full sm:w-auto">
            Cập nhật
          </button>
        </div>
      </form>
    </div>

    {/* THÔNG TIN GÓI DỊCH VỤ*/}
    {infoCompany.currentVipPackage?(<>
     <div className="bg-[#F8F9FA] border border-[#E9ECEF] rounded-[8px] p-[20px] sticky top-[20px]">
      <div className="flex justify-between items-center mb-[20px] border-b border-[#DEDEDE] pb-[10px]">
        <h3 className="text-[18px] font-bold text-[#0088FF]">Gói dịch vụ hiện tại</h3>
        <span className={`px-3 py-1 rounded-full text-xs font-bold ${servicePackage.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {servicePackage.isActive ? "Đang hoạt động" : "Ngừng hoạt động"}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-y-[15px]">
        {/* Row: Mã & Tên */}
        <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="block text-[12px] text-gray-500 uppercase font-semibold">Mã gói</label>
                <div className="font-medium text-black">{servicePackage.code}</div>
            </div>
            <div>
                <label className="block text-[12px] text-gray-500 uppercase font-semibold">Tên gói</label>
                <div className="font-medium text-black">{servicePackage.name}</div>
            </div>
        </div>

        {/* Ngày mua & Ngày hết hạn */}
        
       <ServiceExpiryInfo 
    purchaseDateStr={infoCompany.vipPurchaseDate}// Thay bằng biến thực tế: servicePackage.createdAt
    durationDays={infoCompany.currentVipPackage.durationDays}    // Thay bằng biến thực tế: servicePackage.durationDays (số nguyên, ví dụ 30)
/>

        {/*Hết  Ngày mua & Ngày hết hạn */}
        <div className="border-t border-dashed border-gray-300 my-2"></div>

        {/* Row: Thời hạn */}
        <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="block text-[12px] text-gray-500 uppercase font-semibold">Thời hạn gói</label>
                <div className="font-medium text-black">{servicePackage.durationDays} ngày</div>
            </div>
            <div>
                <label className="block text-[12px] text-gray-500 uppercase font-semibold">Thời hạn tin đăng</label>
                <div className="font-medium text-black">{servicePackage.jobPostDurationDays} ngày/tin</div>
            </div>
        </div>

        {/* Row: Giới hạn */}
        <div className="bg-white p-3 rounded border border-gray-200">
            <div className="flex justify-between items-center mb-2">
                <span className="text-[14px] text-gray-600">Tổng giới hạn tin:</span>
                <span className="font-bold text-black">{servicePackage.postLimit}</span>
            </div>
            <div className="flex justify-between items-center">
                <span className="text-[14px] text-gray-600">Giới hạn theo tuần:</span>
                <span className="font-bold text-black">{servicePackage.weeklyPostLimit}</span>
            </div>
        </div>

        {/* Description nếu có */}
        {servicePackage.description && (
            <div>
                <label className="block text-[12px] text-gray-500 uppercase font-semibold">Mô tả</label>
                <div className="text-[14px] text-gray-700 italic">{servicePackage.description}</div>
            </div>
        )}
      </div>
    </div>
    </>):(<></>)}
   
  </div>
)}
    </>
  );
};
