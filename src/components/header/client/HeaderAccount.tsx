/* eslint-disable @typescript-eslint/no-explicit-any */
import { useAuth } from "@/hooks/useAuth"
import Image from "next/image";
import Link from "next/link"
import { useRouter } from "next/navigation";
import { usePathname } from 'next/navigation';
import avatarDefault from "../../../../public/avatarDefault.png"
import NotificationBell from "@/components/modal/NotificationBell";

export const HeaderAccount = () => {
  const pathname = usePathname();
  const { isLogin, infoUser, infoCompany } = useAuth();
  const router = useRouter();


  const handleLogout = (url: any) => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/logout`, {
      credentials: "include",
      method: "POST"
    })
      .then(res => res.json())
      .then(data => {
        if (data.code == "success") {
          router.push(url);
        }
      });
  }

  return (
    <div className="inline-flex items-center gap-x-5 text-white font-[600] sm:text-[16px] text-[12px] relative">
      {isLogin ? (
        <>
          {/* Chuông nằm riêng, không nằm trong group hover của menu */}
          <NotificationBell userId={infoUser?.email||infoCompany?.email} />

          {/* Cụm USER: Chỉ group này mới kích hoạt dropdown */}
          {infoUser && (
            <div className="relative group/user flex items-center gap-x-3 cursor-pointer">
              <div className="w-10 h-10 overflow-hidden rounded-full border border-gray-300 flex-shrink-0">
                <Image
                  width={40}
                  height={40}
                  src={infoUser?.avatar || avatarDefault}
                  alt="avatar user"
                  className="object-cover w-full h-full"
                />
              </div>
              <span className="whitespace-nowrap">{infoUser.fullName}</span>

              {/* Dropdown Menu - Chỉ hiện khi hover vào cụm /user */}
              <ul className="absolute top-full right-0 w-[200px] bg-[#000065] hidden group-hover/user:block z-[999] shadow-xl pt-2">
                <li className="py-[10px] px-[16px] hover:bg-[#000096]">
                  <Link href="/user-manage/profile" className="block text-white">Thông tin cá nhân</Link>
                </li>
                <li className="py-[10px] px-[16px] hover:bg-[#000096]">
                  <Link href="/user-manage/cv/list" className="block text-white">Việc làm đã gửi</Link>
                </li>
                <li className="py-[10px] px-[16px] hover:bg-[#000096]">
                  <Link href="/user-manage/favoriteJob" className="block text-white">Việc làm yêu thích</Link>
                </li>
                <li className="py-[10px] px-[16px] hover:bg-[#000096] border-t border-white/10" onClick={() => handleLogout("/login")}>
                  Đăng xuất
                </li>
              </ul>
            </div>
          )}

          {/* Cụm COMPANY: Chỉ group này mới kích hoạt dropdown */}
          {infoCompany && (
            <div className="relative group/company flex items-center gap-x-3 cursor-pointer">
              <div className="w-10 h-10 overflow-hidden rounded-full border border-gray-300 flex-shrink-0">
                <Image
                  width={40}
                  height={40}
                  src={infoCompany?.logo || avatarDefault}
                  alt="logo company"
                  className="object-cover w-full h-full"
                />
              </div>
              <span className="whitespace-nowrap">{infoCompany.companyName}</span>

              {/* Dropdown Menu - Chỉ hiện khi hover vào cụm /company */}
              <ul className="absolute top-full right-0 w-[200px] bg-[#000065] hidden group-hover/company:block z-[999] shadow-xl pt-2">
                <li className="py-[10px] px-[16px] hover:bg-[#000096]">
                  <Link href="/company-manage/profile" className="block text-white">Thông tin công ty</Link>
                </li>
                <li className="py-[10px] px-[16px] hover:bg-[#000096]">
                  <Link href="/company-manage/job/list" className="block text-white">Quản lý công việc</Link>
                </li>
                <li className="py-[10px] px-[16px] hover:bg-[#000096]">
                  <Link href="/company-manage/cv/list" className="block text-white">Quản lý CV</Link>
                </li>
                <li className="py-[10px] px-[16px] hover:bg-[#000096] border-t border-white/10" onClick={() => handleLogout("/login")}>
                  Đăng xuất
                </li>
              </ul>
            </div>
          )}
        </>
      ) : (
        <div className="flex items-center gap-x-2">
          {pathname !== "/login" && <Link href="/login" className="hover:underline">Đăng Nhập</Link>}
          {pathname !== "/login" && pathname !== "/register" && <span className="opacity-50">/</span>}
          {pathname !== "/register" && <Link href="/register" className="hover:underline">Đăng Ký</Link>}
        </div>
      )}
    </div>
  )
}