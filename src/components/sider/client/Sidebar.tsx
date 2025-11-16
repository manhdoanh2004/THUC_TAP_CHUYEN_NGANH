'use client'
import React, { useState, useMemo } from 'react';
import { ChevronDown, ChevronRight, X, Home, Users, CreditCard, FileText, Settings, LogOut } from 'lucide-react';

// --- Khai báo Typescript cho dữ liệu Navigation ---
interface NavItemBase {
    name: string;
    icon?: React.ReactNode; // Dùng ReactNode cho icons từ Lucide hoặc emoji
    href: string;
    active?: boolean;
}

interface SubNavItem extends NavItemBase {
    isLogout?: boolean; // Đặc điểm riêng cho mục đăng xuất
}

interface NavItemWithSub extends NavItemBase {
    subItems: SubNavItem[];
    // Thêm các thuộc tính state/setState để quản lý trạng thái dropdown
    state: boolean;
    setState: React.Dispatch<React.SetStateAction<boolean>>;
}

// Loại bỏ 'any' bằng cách định nghĩa rõ ràng các loại mục
type SidebarNavItem = NavItemBase | NavItemWithSub;

// --- Component Arrow Icon (Dùng cho dropdown) ---
const ArrowIcon: React.FC<{ isOpen: boolean }> = ({ isOpen }) => (
    <span className={`shrink-0 transition duration-300 ${isOpen ? 'rotate-180' : ''}`}>
        <ChevronDown size={20} className="text-gray-400" />
    </span>
);

// --- Component Sidebar Content (Nội dung Sidebar) ---
const SidebarContent: React.FC<{
    isOpen: boolean;
    toggleSidebar: () => void;
    className?: string;
}> = ({ isOpen, toggleSidebar, className = "" }) => {
    // State to manage dropdown menus
    const [isTeamsOpen, setIsTeamsOpen] = useState(false);
    const [isAccountOpen, setIsAccountOpen] = useState(false);

    // Navigation Data (Sử dụng useMemo để tránh tạo lại mảng NavItems trên mỗi render)
    const navItems: SidebarNavItem[] = useMemo(() => [
        { name: 'General', icon: <Home size={20} />, href: '#', active: true },
        {
            name: 'Teams',
            icon: <Users size={20} />,
            href: '#',
            state: isTeamsOpen,
            setState: setIsTeamsOpen,
            subItems: [
                { name: 'Banned Users', href: '#' },
                { name: 'Calendar', href: '#' },
            ],
        } as NavItemWithSub,
        { name: 'Billing', icon: <CreditCard size={20} />, href: '#' },
        { name: 'Invoices', icon: <FileText size={20} />, href: '#' },
        {
            name: 'Account',
            icon: <Settings size={20} />,
            href: '#',
            state: isAccountOpen,
            setState: setIsAccountOpen,
            subItems: [
                { name: 'Details', href: '#' },
                { name: 'Security', href: '#' },
                { name: 'Logout', icon: <LogOut size={20} className="mr-2" />, href: '#', isLogout: true },
            ],
        } as NavItemWithSub,
    ], [isTeamsOpen, isAccountOpen]);

    // Classes for smooth slide transition
    const sidebarTransition = 'transition-transform duration-300 ease-in-out';
    // Thêm transition cho opacity của nội dung
    const contentOpacity = isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none';

    // Main classes for the sidebar: fixed position and conditional translation
    const sidebarClasses = `fixed inset-y-0 left-0 z-50 w-64 h-full max-h-screen flex flex-col justify-between border-e border-gray-200 bg-white shadow-xl ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
    } ${sidebarTransition} ${className}`;

    // Helper function để kiểm tra và render Dropdown Item
    const renderDropdownItem = (item: SidebarNavItem) => {
        // Type Guard: kiểm tra xem item có phải là NavItemWithSub không
        const isDropdown = (item as NavItemWithSub).subItems !== undefined;

        if (!isDropdown) {
            // Static Link
            const staticItem = item as NavItemBase;
            return (
                <a
                    href={staticItem.href}
                    className={`flex items-center rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                        staticItem.active
                            ? 'bg-indigo-50 text-indigo-700 shadow-sm'
                            : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
                    }`}
                >
                    <span className="shrink-0 mr-3">{staticItem.icon}</span>
                    <span>{staticItem.name}</span>
                </a>
            );
        }

        // Dropdown Item
        const dropdownItem = item as NavItemWithSub;
        return (
            <div className={`group ${dropdownItem.state ? 'open' : ''}`}>
                <button
                    onClick={() => dropdownItem.setState(!dropdownItem.state)}
                    className="flex w-full cursor-pointer items-center justify-between rounded-lg px-4 py-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 focus:outline-none transition-colors"
                >
                    <div className="flex items-center">
                        <span className="shrink-0 mr-3">{dropdownItem.icon}</span>
                        <span className="text-sm font-medium">{dropdownItem.name}</span>
                    </div>
                    <ArrowIcon isOpen={dropdownItem.state} />
                </button>

                {/* Sub Items (Hiển thị có điều kiện) */}
                <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                        dropdownItem.state ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                    }`}
                >
                    <ul className="mt-2 space-y-1 pl-8 border-l border-gray-100 ml-4">
                        {dropdownItem.subItems.map((subItem) => (
                            <li key={subItem.name}>
                                <a
                                    href={subItem.href}
                                    className={`flex items-center rounded-lg px-4 py-2 text-xs font-medium transition-colors ${
                                        subItem.isLogout
                                            ? 'text-red-500 hover:bg-red-50 hover:text-red-700'
                                            : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
                                    }`}
                                >
                                    {subItem.name}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        );
    };

    return (
        <aside className={sidebarClasses}>
            {/* Overlay cho mobile khi sidebar mở */}
            <div className="md:hidden fixed inset-0 bg-black/50 z-40" onClick={toggleSidebar}></div>

            <div className="px-4 py-6 overflow-y-auto flex-1">

                {/* Logo and Close Button */}
                <div className="flex justify-between items-center mb-6">
                    <span className={`grid h-10 w-32 place-content-center rounded-lg bg-indigo-600 text-xs font-bold text-white overflow-hidden transition duration-300 ${contentOpacity}`}>
                        APP LOGO
                    </span>

                    {/* Close Sidebar Button - Chỉ hiện trên Mobile/Tablet nếu cần */}
                    <button
                        onClick={toggleSidebar}
                        className="p-2 rounded-full text-gray-500 hover:bg-red-100 hover:text-red-700 focus:outline-none transition-colors ml-4"
                        aria-label="Đóng Sidebar"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Navigation Menu (Menu Điều hướng) */}
                <ul className={`mt-6 space-y-1 transition duration-300 ${contentOpacity}`}>
                    {navItems.map((item) => (
                        <li key={item.name}>
                            {renderDropdownItem(item)}
                        </li>
                    ))}
                </ul>
            </div>

            {/* User Profile Footer (Thông tin người dùng) */}
            <div className={`sticky inset-x-0 bottom-0 border-t border-gray-100 transition duration-300 ${contentOpacity}`}>
                <a href="#" className="flex items-center gap-2 bg-white p-4 hover:bg-gray-50">
                    <span className="size-10 rounded-full bg-indigo-600 grid place-content-center text-white font-bold text-sm shrink-0">EF</span>
                    <div className="overflow-hidden">
                        <p className="text-xs">
                            <strong className="block font-medium text-gray-800">Eric Frusciante</strong>
                            <span className="text-gray-500"> eric@frusciante.com </span>
                        </p>
                    </div>
                </a>
            </div>
        </aside>
    );
};

// --- Component Layout Wrapper chính ---
export const SidebarLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // State to toggle sidebar open/close
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    // --- Overlay (Lớp phủ) ---
    // Chỉ hiển thị trên thiết bị nhỏ (dưới md)
    const Overlay: React.FC = () => (
        <div
            onClick={toggleSidebar}
            // Lớp phủ: Cố định, toàn màn hình, màu đen mờ, z-index thấp hơn sidebar (z-40)
            className={`md:hidden fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${
                isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
        ></div>
    );


    // --- Open Sidebar Button (Nút mở Sidebar khi đóng) ---
    // Chỉ hiển thị trên thiết bị nhỏ (dưới md)
    const OpenButton: React.FC = () => (
        <button
            onClick={toggleSidebar}
            // Vị trí cố định (fixed) ở mép trái, chỉ hiện khi sidebar đóng
            className={`fixed top-1/2 left-0 -translate-y-1/2 z-30 ml-2 p-2 rounded-full text-white bg-indigo-600 hover:bg-indigo-700 shadow-xl focus:outline-none transition-opacity duration-300 ${isSidebarOpen ? 'opacity-0 pointer-events-none' : 'opacity-100 lg:hidden'}`}
            aria-label="Mở Sidebar"
        >
            {/* Biểu tượng Mũi tên phải (Chevron Right) */}
            <ChevronRight size={24} />
        </button>
    );

    // Xử lý khoảng trống cho nội dung chính
    // Trên Desktop (lg+), có thể muốn sidebar luôn mở, nhưng trong code này, chúng ta giả định nó luôn đóng/mở thủ công,
    // và đảm bảo nội dung chính không bị che khi sidebar đóng.
    const mainContentClasses = `flex-1 transition-all duration-300 ease-in-out  ${
        isSidebarOpen ? 'ml-64' : 'ml-0'
    }`;


    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* 1. Sidebar (Component chính) */}
            <SidebarContent isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

            {/* 2. Overlay (Chỉ hiển thị khi Sidebar mở trên mobile) */}
            <Overlay />

            {/* 3. Nút mở Sidebar (Chỉ hiển thị khi Sidebar đóng) */}
            <OpenButton />

            {/* 4. Nội dung chính (Được truyền vào từ component cha) */}
            <main className={mainContentClasses}>
                
                    {children}
               
            </main>
        </div>
    );
};

// Component Demo (Đã sửa lỗi, nhận `children` và truyền vào Layout)
const App: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
    // Nội dung demo để kiểm tra xem children có được render không
    const defaultChildren = (
        <div className="rounded-xl p-8 bg-white shadow-lg h-[80vh] flex flex-col items-center justify-center text-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Nội dung Chính (Main Content)</h1>
            <p className="text-gray-600">Component con đã được bọc thành công bởi SidebarLayout.</p>
            <p className="text-sm text-gray-400 mt-4">Hãy thử bấm nút mũi tên hoặc kéo/thả từ mép trái để mở Sidebar!</p>
        </div>
    );

    return (
        <SidebarLayout>
            {children || defaultChildren}
        </SidebarLayout>
    );
}

export default App;