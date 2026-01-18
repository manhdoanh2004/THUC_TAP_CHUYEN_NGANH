/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'
import React, { useState, useEffect, useCallback } from 'react';
import { 
  Search, 
  MapPin, 
  Mail, 
  Phone, 
  X, 
  ExternalLink,
  Briefcase,
  ChevronRight,
  Filter,
  RotateCcw,
  ChevronLeft
} from 'lucide-react';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

const CandidateSearchPage = () => {
  const BRAND_COLOR = "#000073";
  const [candidates, setCandidates] = useState<any[]>([]);
  const [selectedCandidate, setSelectedCandidate] = useState<any>(null);
  const [loading, setLoading] = useState(false);
// Khởi tạo giá trị mặc định cho filters
  const initialFilters = {
    fullname: "",
    email: "",
    softSkill: "",
    experience: "",
    technologies: "",
    desiredSalary: "",
    
  };
  // 1. Quản lý các tiêu chí tìm kiếm trong một Object
  const [filters, setFilters] = useState(initialFilters);
const [totalPage, setTotalPage] = useState(2);
     const [page, setPage] = useState(1);
  const router = useRouter();
  const { infoCompany, isLoading: authLoading } = useAuth();

  // 2. Hàm gọi API tìm kiếm
  const fetchCandidate = useCallback(async (filterData = filters ) => {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/search?page=${page-1}&size=9`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(filterData),
        credentials: "include"
      });

      const data = await res.json();
      if (data?.result?.content) {
        setCandidates(data.result.content);
        setTotalPage(data.result.totalPages);
      }
    } catch (error) {
      console.error("Lỗi khi tìm kiếm:", error);
    } finally {
      setLoading(false);
    }
  }, [filters,page]);

  // Gọi lần đầu khi component mount
  useEffect(() => {
    fetchCandidate(initialFilters);
  }, [page]);

  // Bảo vệ route
  useEffect(() => {
    if (!infoCompany && !authLoading) {
      router.push("/");
    }
  }, [infoCompany, authLoading, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };
const handleClearFilter =async () => {
     setFilters(initialFilters); // Reset state về ban đầu
    fetchCandidate(initialFilters); // Gọi API với bộ lọc trống ngay lập tức
  };
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        <header className="mb-10">
          <h1 style={{ color: BRAND_COLOR }} className="text-2xl font-bold tracking-tight mb-6">
            Danh sách ứng viên
          </h1>

          {/* Form tìm kiếm đa tiêu chí */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Tìm theo tên */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  name="fullname"
                  type="text"
                  placeholder="Họ và tên..."
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:border-[#000073] focus:ring-1 focus:ring-[#000073] outline-none text-sm"
                  value={filters.fullname}
                  onChange={handleInputChange}
                />
              </div>
              {/* Tìm theo công nghệ */}
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  name="technologies"
                  type="text"
                  placeholder="Công nghệ (React, Java...)"
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:border-[#000073] focus:ring-1 focus:ring-[#000073] outline-none text-sm"
                  value={filters.technologies}
                  onChange={handleInputChange}
                />
              </div>
              {/* Tìm theo kỹ năng mềm */}
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  name="softSkill"
                  type="text"
                  placeholder="Kỹ năng mềm..."
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:border-[#000073] focus:ring-1 focus:ring-[#000073] outline-none text-sm"
                  value={filters.softSkill}
                  onChange={handleInputChange}
                />
              </div>
              {/* Email */}
              <input
                name="email"
                type="text"
                placeholder="Email..."
                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-[#000073] focus:ring-1 focus:ring-[#000073] outline-none text-sm"
                value={filters.email}
                onChange={handleInputChange}
              />
              {/* Kinh nghiệm */}
              <input
                name="experience"
                type="text"
                placeholder="Kinh nghiệm (vd: 3 năm)..."
                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-[#000073] focus:ring-1 focus:ring-[#000073] outline-none text-sm"
                value={filters.experience}
                onChange={handleInputChange}
              />
              {/* Lương */}
              <input
                name="desiredSalary"
                type="text"
                placeholder="Mức lương mong muốn..."
                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-[#000073] focus:ring-1 focus:ring-[#000073] outline-none text-sm"
                value={filters.desiredSalary}
                onChange={handleInputChange}
              />
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={handleClearFilter}
                className="flex items-center gap-2 px-4 py-2 text-slate-500 hover:text-slate-800 text-sm font-medium transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                Xóa bộ lọc
              </button>
              <button
                onClick={() => fetchCandidate()}
                disabled={loading}
                style={{ backgroundColor: BRAND_COLOR }}
                className="px-6 py-2 text-white rounded-lg text-sm font-semibold hover:opacity-90 transition-all flex items-center gap-2"
              >
                {loading ? "Đang tìm..." : "Tìm kiếm ứng viên"}
              </button>
            </div>
          </div>
        </header>

        {/* Grid List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {candidates.length > 0 ? (
            candidates.map((candidate) => (
              <div 
                key={candidate.candidateId} 
                onClick={() => setSelectedCandidate(candidate)}
                className="group bg-white p-5 rounded-xl border border-slate-200 hover:border-[#000073] cursor-pointer transition-all shadow-sm hover:shadow-md"
              >
                <div className="flex items-start gap-4 mb-4">
                  <img src={candidate.avatar || "https://api.dicebear.com/7.x/initials/svg?seed=User"} className="w-12 h-12 rounded-lg bg-slate-100 object-cover" alt="" />
                  <div className="overflow-hidden">
                    <h2 className="font-bold text-slate-900 truncate">{candidate.fullName}</h2>
                    <p className="text-xs text-slate-500 flex items-center gap-1">
                      <Briefcase className="w-3 h-3" /> {candidate.experience || '0 năm'} kinh nghiệm
                    </p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-1.5 min-h-[40px]">
                    {candidate.technologies?.split(',').map((tech: string, i: number) => (
                      <span key={i} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium">
                        {tech.trim()}
                      </span>
                    ))}
                  </div>
                  <div className="pt-3 border-t border-slate-50 flex items-center justify-between text-[#000073] font-semibold text-xs">
                    <span>Chi tiết hồ sơ</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center text-slate-400 bg-white rounded-2xl border border-dashed border-slate-300">
              Không tìm thấy ứng viên phù hợp
            </div>
          )}
          {totalPage > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8 pb-10">
            <button
              disabled={page === 1}
              onClick={() => setPage(prev => prev - 1)}
              className="p-2 rounded-lg border border-slate-200 bg-white disabled:opacity-30 hover:bg-slate-50 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            {[...Array(totalPage)].map((_, i) => {
              const pageNumber = i + 1;
              // Logic hiển thị tối đa 5 nút trang để tránh tràn mobile
              if (
                pageNumber === 1 || 
                pageNumber === totalPage || 
                (pageNumber >= page - 1 && pageNumber <= page + 1)
              ) {
                return (
                  <button
                    key={pageNumber}
                    onClick={() => setPage(pageNumber)}
                    style={{ 
                      backgroundColor: page === pageNumber ? BRAND_COLOR : 'white',
                      color: page === pageNumber ? 'white' : '#64748b'
                    }}
                    className={`w-10 h-10 rounded-lg border ${page === pageNumber ? 'border-transparent shadow-md' : 'border-slate-200'} text-sm font-bold transition-all hover:border-[#000073]`}
                  >
                    {pageNumber}
                  </button>
                );
              }
              if (pageNumber === page - 2 || pageNumber === page + 2) {
                return <span key={pageNumber} className="text-slate-400">...</span>;
              }
              return null;
            })}

            <button
              disabled={page === totalPage}
              onClick={() => setPage(prev => prev + 1)}
              className="p-2 rounded-lg border border-slate-200 bg-white disabled:opacity-30 hover:bg-slate-50 transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
        </div>

        {/* Modal chi tiết ứng viên (giữ nguyên logic của bạn) */}
        {selectedCandidate && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setSelectedCandidate(null)} />
            <div className="relative bg-white w-full max-w-2xl shadow-2xl rounded-2xl overflow-hidden flex flex-col max-h-[90vh]">
              <div className="p-5 border-b border-slate-100 flex justify-between items-center">
                <span className="text-xs font-bold tracking-widest text-slate-400 uppercase">Thông tin ứng viên</span>
                <button onClick={() => setSelectedCandidate(null)} className="p-1 hover:bg-slate-100 rounded-full transition-colors">
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              <div className="p-8 overflow-y-auto">
                <div className="flex flex-col md:flex-row gap-6 mb-10 items-center md:items-start text-center md:text-left">
                  <img src={selectedCandidate.avatar} className="w-24 h-24 rounded-2xl bg-slate-50 border border-slate-100 shadow-sm" alt="" />
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-slate-900 mb-1">{selectedCandidate.fullName}</h2>
                    <p className="text-sm text-slate-500 mb-4 font-mono">ID: {selectedCandidate.candidateId}</p>
                    <div className="flex justify-center md:justify-start gap-3">
                      <a href={`mailto:${selectedCandidate.email}`} className="px-4 py-1.5 rounded-full border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-medium flex items-center gap-1.5 transition-colors">
                        <Mail className="w-3.5 h-3.5" /> Email
                      </a>
                      <a href={`tel:${selectedCandidate.phone}`} className="px-4 py-1.5 rounded-full border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-medium flex items-center gap-1.5 transition-colors">
                        <Phone className="w-3.5 h-3.5" /> Gọi điện
                      </a>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-10">
                  <InfoItem label="Giới tính" value={selectedCandidate.gender} />
                  <InfoItem label="Ngày sinh" value={selectedCandidate.dateOfBirth ? new Date(selectedCandidate.dateOfBirth).toLocaleDateString('vi-VN') : undefined} />
                  <InfoItem label="Địa chỉ" value={selectedCandidate.address} />
                  <InfoItem label="Kinh nghiệm" value={selectedCandidate.experience} />
                  <InfoItem 
                    label="Mức lương mong muốn" 
                    value={selectedCandidate.desiredSalary ? parseInt(selectedCandidate.desiredSalary).toLocaleString('vi-VN') + ' VND' : undefined} 
                    highlight 
                  />
                  <InfoItem label="Công nghệ" value={selectedCandidate.technologies} />
                  <InfoItem label="Kỹ năng mềm" value={selectedCandidate.softSkill} />
                  
                  <div className="md:col-span-2 pt-4 border-t border-slate-50">
                    <p className="text-[10px] uppercase tracking-widest text-slate-400 mb-3 font-bold">CV :</p>
                    <div className="bg-[#D9D9D9] h-[500px] md:h-[600px] rounded-[4px] overflow-hidden mt-[10px]">
                      <iframe 
                        src={`${selectedCandidate.cv}#toolbar=0&navpanes=0&scrollbar=0`} 
                        className="w-full h-full" 
                        title="CV Preview"
                      ></iframe>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const InfoItem = ({ label, value, highlight }:{label:string, value?:string, highlight?:boolean}) => (
  <div>
    <p className="text-[10px] uppercase tracking-widest text-slate-400 mb-1 font-bold">{label}</p>
    <p className={`text-sm ${highlight ? 'text-[#000073] font-bold text-base' : 'text-slate-700'}`}>{value || "Chưa cập nhật"}</p>
  </div>
);

export default CandidateSearchPage;