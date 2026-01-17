/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
/* eslint-disable @typescript-eslint/no-unused-vars */

import Link from "next/link"
import { useEffect, useState } from "react"
import { FaBriefcase, FaCircleCheck, FaEnvelope, FaEye, FaPhone, FaUserTie } from "react-icons/fa6"
import {workingFromList,positionList,cvStatusList} from "../../../../../../config/variables"
import { CvItem } from "./CvItem"
import { useAuth } from "@/hooks/useAuth"
import { useRouter } from "next/navigation"
import CardCVSkeleton from "@/components/card/CardCVSkeleton"
import { ModalCVDetail } from "@/components/modal/ModalCVDetail"
import { toast, Toaster } from "sonner";
export const CvList=()=>
{
    const [listCv,setListCv]=useState<any>(null);
     const [totalPage, setTotalPage] = useState(0);
     const [page, setPage] = useState(1);
     const [count, setCount] = useState(1);
 const [isAction, setIsAction] = useState(false);
 const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCV, setSelectedCV] = useState(null);
      const { infoUser,infoCompany, isLogin } = useAuth();
       const router = useRouter();
    
        useEffect(() => {
          if(isLogin === false) {
            router.push("/");
          }
        }, [isLogin]);
    useEffect(()=>
    {
      if(!infoCompany) return;
      const form=new FormData();
      form.append("id",infoCompany.employerId as string);
      form.append("page",`${page-1}`);
      form.append("size","6"); 
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/jobs/applications`,{
            method:"POST",
            credentials:"include",
            body:form
        })
            .then(res=>res.json())
            .then(data=>{
                if(data.code=="success")
                {                  
                     setListCv(data.result.content.map((item:any)=>{
                      return {
                        ...item, isAction:false}}));
                     setTotalPage(data.result.totalPages);

                }
                else
                {
                    setListCv([]);
                    setTotalPage(0);
                }
                  
            })
          
    },[page,infoCompany,count]);

     const handleDeleteSuccess=(id:string)=>{
       toast.success("Xóa CV thành công");
          setListCv((prev:any) => prev.filter((cv:any) => cv.applicationId !== id));
      };

      const handlePagination=(event:any)=>
      {
          const value=event.target.value;
          setPage(parseInt(value))
      };
     
        const handleChangeStatus = (action: string,id:string) => {

          try {
               setListCv((pre:any)=>pre.map((cv:any)=>{ 
          if(cv.applicationId!==id) return cv;
        else  return { ...cv, status: action, isAction: true } }));
        
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/applications/status`, {
      method: "PUT",
      credentials: "include", // Gửi kèm cookie
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        status: action,
        id:id
      })
    })
      .then(res => res.json())
      .then(data => {
        if(data.code == "success") {
         setListCv((pre:any)=>pre.map((cv:any)=>{ 
          if(cv.applicationId!==id) return cv;
        else  return { ...cv, status: action, isAction: false } }));
        }
      })
          } catch (error) {
            console.log(error)
          }finally {

            setListCv((pre:any)=>pre.map((cv:any)=>{ 
          if(cv.applicationId!==id) return cv;
        else  return { ...cv, isAction: false } }));
        
  }};

  const handleOpenDetail = (item:any) => {
    setSelectedCV(item); // Gán dữ liệu CV và Job vào đây
    setIsModalOpen(true);
   if(item.status!="REVIEWING") handleChangeStatus("REVIEWING", item.applicationId);
  };
    return(
       
          <>
           <Toaster position="top-right" richColors />
          {listCv?(<>
                 <div className="grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-[20px]">
        {listCv.map((item:any) => {
          item.jobPosition = positionList.find(itemPos => itemPos.value == item.position)?.label;
          item.jobWorkingFrom = workingFromList.find(itemWork => itemWork.value == item.workingFrom)?.label;

          return (
            <CvItem key={item.applicationId} item={item}  isAction={isAction}
                onDeleteSuccess={handleDeleteSuccess}
                onChangeStatus={handleChangeStatus}
                onViewDetailCV={handleOpenDetail}
            />
          )
        })}
      </div>
          </>):(<>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {Array(6).fill(0).map((_, index) => (
      <CardCVSkeleton key={index} />
    ))}
  </div>
          </>)}
        

                <div className="mt-[30px]">
        <select name="" className="border border-[#DEDEDE] rounded-[8px] py-[12px] px-[18px] font-[400] text-[16px] text-[#414042]"
          onChange={(event)=>handlePagination(event)}
        >
           {Array(totalPage).fill("").map((item:any,index:any)=>{
            return (
                  <option key={index} value={index+1}> Trang {index+1}</option>
            )
        })}
        </select>
      </div>
       <ModalCVDetail
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        cv={selectedCV} 
      />
    </>

      
    )
}