
import { Metadata } from "next"
import { FavoriteJobList } from "./FavoriteJobList"


export const metadata: Metadata = {
  title: "Việc làm yêu thích",
  description: "Mô tả trang quản lý CV đã gửi...",
}

export default function UserManageFavoriteJobListPage() {
  return (
    <>
      <div className="py-[60px]">
        <div className="container mx-auto px-[16px]">
          <h2 className="font-[700] sm:text-[28px] text-[24px] sm:w-auto w-[100%] text-[#121212] mb-[20px]">
            Việc làm yêu thích :
          </h2>

           <FavoriteJobList/>
        </div>
      </div>
    </>
  )
}