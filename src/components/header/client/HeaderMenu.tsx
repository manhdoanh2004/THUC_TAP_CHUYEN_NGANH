/* eslint-disable @typescript-eslint/no-unused-vars */


import { useNotifications } from "@/context/NotificationContext";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import { FaAngleDown, FaAngleRight } from "react-icons/fa6"

export const HeaderMenu = (
  props: {
    showMenu: boolean,
    onMenu:()=>void,
  }
) => {
  const { showMenu,onMenu } = props;

 const menuList = [
    {
      name: "Việc Làm IT",
      link: "#",
      children: [
        {
          name: "Việc làm IT theo kỹ năng",
          link: "#",
          children: [
            {
              name: "HTML5",
              link: "/search?language=HTML5",
              children: null
            },
            {
              name: "CSS3",
              link: "/search?language=CSS3",
              children: null
            },
            {
              name: "Javascript",
              link: "/search?language=Javascript",
              children: null
            },
            {
              name: "ReactJS",
              link: "/search?language=ReactJS",
              children: null
            },
            {
              name: "NodeJS",
              link: "/search?language=NodeJS",
              children: null
            }
          ]
        },
        {
          name: "Việc làm IT theo thành phố",
          link: "#",
          children: [
            {
              name: "Hà Nội",
              link: "/search?city=Hà Nội",
              children: null
            },
            {
              name: "Đà Nẵng",
              link: "/search?city=Đà Nẵng",
              children: null
            },
            {
              name: "Hồ Chí Minh",
              link: "/search?city=Hồ Chí Minh",
              children: null
            },
          ]
        }
      ]
    },
    {
      name: "Top Công Ty IT",
      link: "/company/list",
      children: [
        {
          name: "FPT Software",
          link: "/search?company=FPT Software",
          children: null
        },
        {
          name: "Techcombank",
          link: "/search?company=Techcombank",
          children: null
        },
        {
          name: "MB Bank",
          link: "/search?company=MB Bank",
          children: null
        },
        {
          name: "ABC.LTD",
          link: "/search?company=ABC.LTD",
          children: null
        }
      ]
    },
    
  ];

  return (
    <>
      <nav className={"lg:block hidden lg:block " }>
        <ul className="flex gap-x-[30px] flex-wrap">
         {showMenu&& <li className="inline-flex lg:w-auto w-full lg:justify-start
               justify-between p-[10px] items-center gap-x-[8px] relative group/sub-1 flex-wrap">
            <Link href={"/"} className="text-white text-[20px] font-[600]">
              ITJobs
            </Link>
            <span className="text-white text-[20px] font-[600] cursor-pointer" onClick={onMenu}>X</span>
          </li>}
          {menuList.map((menu, index) => (
            <li
              key={index}
              className={`inline-flex lg:w-auto w-full lg:justify-start
               justify-between p-[10px] items-center gap-x-[8px] relative group/sub-1 flex-wrap ` }
            >
              <Link
                href={menu.link}
                className="text-white font-[600] text-[16px]"
              >
                {menu.name}
              </Link>
              {menu.children && (
                <FaAngleDown className="text-white text-[16px]" />
              )}
              {menu.children && (
                <ul className="lg:absolute relative lg:top-[100%] top-0 left-[0px] lg:w-[280px] w-full bg-[#000065] hidden group-hover/sub-1:block z-[999]">
                  {menu.children.map((menuSub1, indexSub1) => (
                    <li 
                      key={indexSub1}
                      className="py-[10px] px-[16px] rounded-[4px] flex items-center justify-between hover:bg-[#000096] relative group/sub-2 flex-wrap"
                    >
                    <Link 
                      href={menuSub1.link} 
                      className="text-white font-[600] text-[16px]"
                    >
                      {menuSub1.name}
                    </Link>
                    {menuSub1.children && (
                      <FaAngleRight className="text-white text-[16px]" />
                    )}
                    {menuSub1.children && (
                      <ul className="lg:absolute relative top-[0px] lg:left-[100%] left-0 lg:w-[280px] w-full bg-[#000065] hidden group-hover/sub-2:block z-[999]">
                        {menuSub1.children.map((menuSub2, indexSub2) => (
                          <li 
                            key={indexSub2}
                            className="py-[10px] px-[16px] rounded-[4px] flex items-center justify-between hover:bg-[#000096]"
                          >
                            <Link
                              href={menuSub2.link}
                              className="text-white font-[600] text-[16px]"
                            >
                              {menuSub2.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </nav>
      
    
    </>
  )
}