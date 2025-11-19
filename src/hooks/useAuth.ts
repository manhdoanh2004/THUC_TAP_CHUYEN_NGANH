
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export const useAuth = () => {
  const [isLogin, setIsLogin] = useState<any>();
 const [infoUser, setInfoUser] = useState<any>(null);
 const [infoCompany, setInfoCompany] = useState<any>(null);
 const[infoAdmin,setInfoAdmin]=useState<any>(null);
  const pathname = usePathname(); // Lấy URL hiện tại

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/check`, {
      method:"GET",
      // headers:{
      //     "Content-Type":"application/json"
      // },
      credentials: "include", // Gửi kèm cookie,,
      // body:JSON.stringify({})
    
    })
      .then(res => res.json())
      .then(data => {
        if(data.code == "error") {
          setIsLogin(false);
        }
        else{
          setIsLogin(true);
          if(data.result.role=="ROLE_CANDIDATE")
            {
              setInfoUser(data.result);
              setInfoCompany(null);
                setInfoAdmin(null);
            } 
          else if(data.result.role=="ROLE_COMPANY")
          {
              setInfoCompany(data.result);
                setInfoUser(null);
                setInfoAdmin(null);
          }
          else{
              setInfoAdmin(data.result);
              setInfoUser(null);
              setInfoCompany(null);
          }
         
        }
      });
  }, [pathname]);

  return { isLogin ,infoUser,infoCompany,infoAdmin};
}
