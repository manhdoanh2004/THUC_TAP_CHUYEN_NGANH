import { Metadata } from "next"
import { FormRegiter } from "./FormRegister"

export const metadata: Metadata = {
  title: "Đăng ký ",
  description: "Mô tả trang đăng ký ",
}

export default function UserRegisterPage() {
  return (
    <>
      <div className="flex  justify-center my-[2%] p-4 font-sans ">
          
                <FormRegiter />
           
        </div>
    </>
  )
}