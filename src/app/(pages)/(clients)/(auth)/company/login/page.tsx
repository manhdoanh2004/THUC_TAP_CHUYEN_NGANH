import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Đăng nhập (Nhà tuyển dụng)",
  description: "Mô tả trang đăng nhập (Nhà tuyển dụng)...",
}
import {LoginFrom} from "./LoginForm"
export default function CompanyLoginPage() {
  return (
    <>
      <div className="py-[60px]">
        <div className="container mx-auto px-[16px]">
          <div className="border border-[#DEDEDE] rounded-[8px] py-[50px] px-[20px] max-w-[602px] mx-auto">
            <h1 className="font-[700] text-[20px] text-black text-center mb-[20px]">
              Đăng nhập (Nhà tuyển dụng)
            </h1>
            <LoginFrom/>
          </div>
        </div>
      </div>
    </>
  )
}