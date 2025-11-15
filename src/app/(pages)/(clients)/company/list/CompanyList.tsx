/* eslint-disable @typescript-eslint/no-explicit-any */

'use client'

import { CardCompanyItem } from "@/components/card/CardCompanyItem";
import { useEffect, useState } from "react";

export const CompanyList=()=>
{
    const [totalPage, settotalPage] = useState<any>(1);
    const [page,Setpage]=useState<number>(1);
    const [companyList, setCompanyList] = useState<any[]>([]);

      useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/company/list?limitItems=2&page=${page}`)
          .then(res => res.json())
          .then(data => {
             
            if(data.code == "success") {
              
              setCompanyList(data.companyList);
              settotalPage(data.totalPage)
            }
          })
      }, [page]);

       const handlePanigation=(event:any)=> {
            const value=event.target.value;
            Setpage(parseInt(value));
        }
    
    return(
        <>
         <div className="grid lg:grid-cols-3 grid-cols-2 sm:gap-[20px] gap-x-[10px] gap-y-[20px]">
                    {/* Item */}
                   {companyList.map(item => (
                        <CardCompanyItem key={item.id} item={item} />
                    ))}
                  </div>
        
         {totalPage>0?(<>
        <div className="mt-[30px]">
          <select onChange={(event)=>handlePanigation(event)} name="" className=" cursor-pointer  border border-[#DEDEDE] rounded-[8px] py-[12px] px-[18px] font-[400] text-[16px] text-[#414042]">
            {Array(totalPage).fill("").map((_,index)=><option className=" cursor-pointer" key={index+1} value={index+1}>Trang {index+1} </option>)}
          </select>
        </div>
        </>):(<></>)}
        </>
    )
}