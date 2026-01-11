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

export const CvList=()=>
{
    const [listCv,setListCv]=useState<any>([]);
     const [totalPage, setTotalPage] = useState(0);
     const [page, setPage] = useState(1);

      const { infoUser,infoCompany, isLogin } = useAuth();
      console.log("infoCompany",infoCompany?.employerId);
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
      form.append("limit","6"); 
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/applications/job`,{
            method:"POST",
            credentials:"include",
            body:form
        })
            .then(res=>res.json())
            .then(data=>{
                if(data.code=="success")
                {
                  
                    // setListCv(data.cvList);
                    // setTotalPage(data.totalPage);
                }
                  console.log(data)
            })
          
    },[page,infoCompany]);

     const handleDeleteSuccess=(id:string)=>{
          setListCv((prev:any) => prev.filter((cv:any) => cv.id !== id));
      };

      const handlePagination=(event:any)=>
      {
          const value=event.target.value;
          setPage(parseInt(value))
      };
     
    return(
        <>
          <>
      <div className="grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-[20px]">
        {listCv.map((item:any) => {
          item.jobPosition = positionList.find(itemPos => itemPos.value == item.jobPosition)?.label;
          item.jobWorkingForm = workingFromList.find(itemWork => itemWork.value == item.jobWorkingFrom)?.label;

          return (
            <CvItem key={item.id} item={item} 
                onDeleteSuccess={handleDeleteSuccess}
            />
          )
        })}
      </div>

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
       
    </>

        </>
    )
}