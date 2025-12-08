/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";
import { CardJobItem } from "@/components/card/CardJobItem";
import JobCardSkeleton from "@/components/card/JobCartSkeleton";
import { cvStatusList, positionList, workingFromList } from "@/config/variables";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link"
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaBriefcase, FaCircleCheck, FaUserTie } from "react-icons/fa6"

export const FavoriteJobList = () => {
  const [listCV, setListCV] = useState<any[]>([]);
  const [page,setPage]=useState(1);
  const [totalPage,setTotalPage]=useState(1);
  const { infoUser, isLogin } = useAuth();
   const router = useRouter();

    useEffect(() => {
      if(isLogin === false) {
        router.push("/");
      }
    }, [isLogin]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/get-liked`, {
      method: "POST",
      credentials: "include", // Gửi kèm cookie
    })
      .then(res => res.json())
      .then(data => {
        if(data.code == "success") {
          setListCV(data.result);
          // setTotalPage(data.totalPage);
          console.log(data.result)
        }
      })
  }, [page]);


  const handlePagination=(event:any)=>
  {
    const value=event.target.value;
    setPage(parseInt(value));
  }

  return (
    <>
      <div className="grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-[20px]">
        
            {/* Item */}
            {listCV.length>0?(<>
             {listCV.map(item => (
              <CardJobItem key={item.jobId} item={item} />
            ))}
            </>):(<>
           { Array(6).fill("").map((item:any,index:any)=>{
            return ( <JobCardSkeleton key={index}/>)
           
           })}
            </>)}
           
         
      </div>

      <div className="mt-[30px]">
        <select name="" className="border border-[#DEDEDE] rounded-[8px] py-[12px] px-[18px] font-[400] text-[16px] text-[#414042]"
            onChange={(event)=>handlePagination(event)}
        >
         {Array(totalPage).fill("").map((item,index)=>
            {
                return(
                  <option key={index} value={index+1}>Trang {index+1}</option>
                )      
            })}
        </select>
      </div>
    </>
  )
}
