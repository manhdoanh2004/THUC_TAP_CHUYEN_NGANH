
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export const useAuth = () => {
  const [isLogin, setIsLogin] = useState<any>();
 const [infoUser, setInfoUser] = useState<any>();
 const [infoCompany, setInfoCompany] = useState<any>();
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

        if(data.code == "success") {
          setIsLogin(true);
          console.log(data.result);
          if(data.result.role=="ROLE_CANDIDATE")
            {
              setInfoUser(data.result);
              setInfoCompany(null);
            } 
          else
          {
              setInfoCompany(data.result);
                setInfoUser(null);
          }
         
        }
        else
        {
             console.log(data);
        }
      });
  }, [pathname]);

  return { isLogin ,infoUser,infoCompany};
}
