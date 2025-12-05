/* eslint-disable @typescript-eslint/no-explicit-any */

import { useAuth } from "@/hooks/useAuth"
import Image from "next/image";
import Link from "next/link"
import { useRouter } from "next/navigation";
import { usePathname } from 'next/navigation';
import avatarDefault from "../../../../public/avatarDefault.png"
export const HeaderAccount = () => {
  const pathname = usePathname();


  const { isLogin, infoUser,infoCompany} = useAuth();
  const router = useRouter();

  const handleLogout = (url:any) => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/logout`, {
      credentials: "include", // Gửi kèm cookie,
      method:"POST"
    })
      .then(res => res.json())
      .then(data => {
        if(data.code == "success") {
          router.push(url);
        }
      });}
  return (
    <>
      <div className="inline-flex items-center gap-x-[5px] text-white font-[600] sm:text-[16px] text-[12px] relative group/sub-1">
        {isLogin ? (
          <>
            {/* Đã đăng nhập user */}
            {infoUser && (
              <>
                <div className="inline-flex items-center gap-[2px] cursor-pointer" >

                  <div className="w-10 h-10 overflow-hidden rounded-full inline-block">
                        <Image
                          width={40}
                          height={40}
                          src={infoUser?.avatar||avatarDefault}
                          alt="avatar user"
                        />
                      </div>
                      <span  className="">{infoUser.fullName}</span>
                </div>
                
                <ul className="absolute top-[100%] right-[0px] w-[200px] bg-[#000065] hidden group-hover/sub-1:block z-[999]">
                  <li className="py-[10px] px-[16px] rounded-[4px] flex items-center justify-between hover:bg-[#000096] relative group/sub-2">
                    <Link href="/user-manage/profile" className="text-white font-[600] text-[16px]">
                      Thông tin cá nhân
                    </Link>
                  </li>
                  <li className="py-[10px] px-[16px] rounded-[4px] flex items-center justify-between hover:bg-[#000096] relative group/sub-2">
                    <Link href="/user-manage/cv/list" className="text-white font-[600] text-[16px]">
                      Quản lý CV đã gửi
                    </Link>
                  </li>
                  <li className="py-[10px] px-[16px] rounded-[4px] flex
                   items-center justify-between hover:bg-[#000096] relative group/sub-2 cursor-pointer"
                    onClick={()=>handleLogout("/user/login")}>
                    Đăng xuất
                  </li>
                </ul>
              </>
            )}

            {/* Đã đăng nhập compnay */}
            {infoCompany&&(<> 
            
             <div className="w-10 h-10  overflow-hidden rounded-full inline-block">
                        <Image
                          width={40}
                          height={40}
                          src={infoCompany?.logo||avatarDefault}
                          alt="avatar user"
                          className=" object-cover w-[100%] h-[100%]  "
                        />
                      </div>
             <div  className="">{infoCompany.companyName}</div>
            <ul className="absolute top-[100%] right-[0px] w-[200px] bg-[#000065] hidden group-hover/sub-1:block z-[999]">
              <li className="py-[10px] px-[16px] rounded-[4px] flex items-center justify-between hover:bg-[#000096] relative group/sub-2">
                <Link href="/company-manage/profile" className="text-white font-[600] text-[16px]">
                  Thông tin công ty
                </Link>
              </li>
              <li className="py-[10px] px-[16px] rounded-[4px] flex items-center justify-between hover:bg-[#000096] relative group/sub-2">
                <Link href="/company-manage/job/list" className="text-white font-[600] text-[16px]">
                  Quản lý công việc
                </Link>
              </li>
              <li className="py-[10px] px-[16px] rounded-[4px] flex items-center justify-between hover:bg-[#000096] relative group/sub-2">
                <Link href="/company-manage/cv/list" className="text-white font-[600] text-[16px]">
                  Quản lý CV
                </Link>
              </li>
              <li className="py-[10px] px-[16px] rounded-[4px] flex items-center
               justify-between hover:bg-[#000096] relative group/sub-2 cursor-pointer "
               onClick={()=>handleLogout("/company/login")}
               >
                 Đăng xuất
              </li>
            </ul></>)}
          
          </>
        ) : (
          <>
            {/* Chưa đăng nhập */}
            {pathname!="/user/login"&& pathname != "/company/login"? <Link href="/user/login" className="">
              Đăng Nhập
            </Link>:""}
           {pathname!="/user/login"&&pathname!="/user/register"&&pathname!="/company/login"&&pathname!="/company/register"?(<><span>/</span></>):(<></>)}
            {pathname!="/user/register"&& pathname != "/company/register"?  <Link href="/user/register" className="">
              Đăng Ký
            </Link>:""}
          </>
        )}
     
      </div>
    </>
  )
}
