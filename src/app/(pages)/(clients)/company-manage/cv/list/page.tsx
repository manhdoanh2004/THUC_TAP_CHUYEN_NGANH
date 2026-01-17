
import { Metadata } from "next"
import { CvList } from "./CvList"

export const metadata: Metadata = {
  title: "Quản lý CV",
  description: "Mô tả trang quản lý CV...",
}

export default function CompanyManageCVListPage() {
  return (
    <>
      <div className="py-[60px] ">
        <div className="container mx-auto px-[16px] relative ">
          <h2 className="font-[700] sm:text-[28px] text-[24px] sm:w-auto w-[100%] text-[#121212] mb-[20px]">
            Quản lý CV
          </h2>

            <CvList/>

        </div>
      </div>
    </>
  )
}