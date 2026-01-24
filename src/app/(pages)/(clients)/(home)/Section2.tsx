/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { CardCompanyItem } from "@/components/card/CardCompanyItem";
import CompanyCardSkeleton from "@/components/card/CompanyCardSkeleton";
import Link from "next/link";
import { useEffect, useState } from "react";
import { MdKeyboardArrowRight } from "react-icons/md";



export const Section2 = () => {
  const [companyList, setCompanyList] = useState<any[]|undefined>(undefined);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/company/all/job?page=0&size=6`)
      .then(res => res.json())
      .then(data => {
        if(data.code == "success") {
          
            setCompanyList(data.result.content);
        
        }
      })
  }, []);

  return (
    <>
      <div className="py-[60px]">
        <div className="container mx-auto px-[16px]">
          <h2 className="font-[700] sm:text-[28px] text-[24px] text-[#121212] text-center mb-[30px]">
            Nhà tuyển dụng hàng đầu
          </h2>
            <Link href={"/company/list"} className="flex items-center justify-end text-[18px] text-[#000071] hover:text-[#155DFC]">
             Xem tất cả công ty
             <MdKeyboardArrowRight size={25} className='text-[40px] ' />
             </Link>
          {/* Wrap */}
          <div className="grid md:grid-cols-2 grid-cols-1 sm:gap-[20px] gap-x-[10px] gap-y-[20px]">
            {/* Item */}
            {companyList?(<>
            
              {companyList.length>0?(<>
             {companyList.map(item => (
              <CardCompanyItem key={item.employerId} item={item} />
            ))}
            </>):(<>
         
            </>)}
            </>):(<>
              { Array(6).fill("").map((item:any,index:any)=>{
            return ( <CompanyCardSkeleton key={index}/>)
           
           })}
            </>)}
          
           
          </div>
        </div>
      </div>
    </>
  )
}
