/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'
import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, 
  MapPin, 
  Mail, 
  Phone, 
  X, 
  ExternalLink,
  Briefcase,
  ChevronRight
} from 'lucide-react';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

const CandidateSearchPage = () => {
  const BRAND_COLOR = "#000073";

  const [candidates] = useState([
    {
      candidateId: "CAN-9921-X1",
      fullName: "Nguyễn Văn A",
      email: "vana@gmail.com",
      address: "Quận 1, TP. Hồ Chí Minh",
      dateOfBirth: "1995-05-15",
      phone: "0901234567",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=A",
      cv: "https://example.com/cv/nguyenvana.pdf",
      role: "ROLE_USER",
      gender: "Nam",
      experience: "3 năm",
      technologies: "React, Node.js, TypeScript",
      softSkill: "Thuyết trình, Làm việc nhóm",
      desiredSalary: "25,000,000 VND",
      private: true
    },
    {
      candidateId: "CAN-4432-B2",
      fullName: "Trần Thị B",
      email: "thib@gmail.com",
      address: "Cầu Giấy, Hà Nội",
      dateOfBirth: "1998-10-20",
      phone: "0988777666",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=B",
      cv: "https://example.com/cv/tranthib.pdf",
      role: "ROLE_USER",
      gender: "Nữ",
      experience: "1 năm",
      technologies: "Java, Spring Boot, MySQL",
      softSkill: "Tiếng Anh Giao Tiếp",
      desiredSalary: "15,000,000 VND",
      private: true
    },
    {
      candidateId: "ADM-0001-HQ",
      fullName: "Lê Hoàng C",
      email: "hoangc@gmail.com",
      address: "Đà Nẵng",
      dateOfBirth: "1993-02-12",
      phone: "0912345678",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=C",
      cv: "https://example.com/cv/lehoangc.pdf",
      role: "ROLE_ADMIN",
      gender: "Nam",
      experience: "5 năm",
      technologies: "Python, AWS, Docker",
      softSkill: "Quản lý dự án",
      desiredSalary: "45,000,000 VND",
      private: true
    },
    {
      candidateId: "CAN-7712-D4",
      fullName: "Phạm Minh D",
      email: "minhd@gmail.com",
      address: "Thanh Xuân, Hà Nội",
      dateOfBirth: "1997-08-30",
      phone: "0977666555",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=D",
      cv: "https://example.com/cv/phamminhd.pdf",
      role: "ROLE_USER",
      gender: "Nam",
      experience: "2 năm",
      technologies: "PHP, Laravel, VueJS",
      softSkill: "Giải quyết vấn đề",
      desiredSalary: "20,000,000 VND",
      private: true
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCandidate, setSelectedCandidate] = useState<any>(null);

  const filteredCandidates = useMemo(() => {
    return candidates.filter(c => 
      c.private === true && 
      (c.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
       c.technologies.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [candidates, searchTerm]);

  const router=useRouter();
  const {infoCompany}=useAuth();

  useEffect(() => {
    if(!infoCompany)
        {
                router.push("/");
                return;
        };
    
  }, [infoCompany]); 
  
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        {/* Simple Header */}
        <header className="mb-10">
          <h1 style={{ color: BRAND_COLOR }} className="text-2xl font-bold tracking-tight mb-6">
            Danh sách ứng viên
          </h1>
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Tìm theo tên hoặc kỹ năng..."
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 focus:border-[#000073] focus:ring-1 focus:ring-[#000073] outline-none transition-all bg-white shadow-sm text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </header>

        {/* Grid List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCandidates.map((candidate) => (
            <div 
              key={candidate.candidateId} 
              onClick={() => setSelectedCandidate(candidate)}
              className="group bg-white p-5 rounded-xl border border-slate-200 hover:border-[#000073] cursor-pointer transition-all shadow-sm hover:shadow-md"
            >
              <div className="flex items-start gap-4 mb-4">
                <img src={candidate.avatar} className="w-12 h-12 rounded-lg bg-slate-100 object-cover" alt="" />
                <div className="overflow-hidden">
                  <h2 className="font-bold text-slate-900 truncate">{candidate.fullName}</h2>
                  <p className="text-xs text-slate-500 flex items-center gap-1">
                    <Briefcase className="w-3 h-3" /> {candidate.experience} kinh nghiệm
                  </p>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex flex-wrap gap-1.5">
                  {candidate.technologies.split(',').map((tech, i) => (
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
          ))}
        </div>

        {/* Minimalist Modal */}
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
                  <InfoItem label="Ngày sinh" value={new Date(selectedCandidate.dateOfBirth).toLocaleDateString('vi-VN')} />
                  <InfoItem label="Địa chỉ" value={selectedCandidate.address} />
                  <InfoItem label="Kinh nghiệm" value={selectedCandidate.experience} />
                  <InfoItem label="Mức lương mong muốn" value={selectedCandidate.desiredSalary} highlight />
                  <InfoItem label="Công nghệ" value={selectedCandidate.technologies} />
                  <InfoItem label="Kỹ năng mềm" value={selectedCandidate.softSkill} />
                  <div className="md:col-span-2 pt-4 border-t border-slate-50">
                    <p className="text-[10px] uppercase tracking-widest text-slate-400 mb-3 font-bold">Tài liệu hồ sơ</p>
                    <a 
                      href={selectedCandidate.cv} 
                      target="_blank" 
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-lg text-sm text-[#000073] font-semibold hover:bg-slate-200 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" /> Xem CV trực tuyến
                    </a>
                  </div>
                </div>
              </div>

              <div className="p-5 bg-slate-50 border-t border-slate-100">
                <button 
                  style={{ backgroundColor: BRAND_COLOR }}
                  className="w-full text-white py-3.5 rounded-xl text-sm font-bold hover:opacity-90 transition-opacity shadow-lg shadow-blue-900/20"
                >
                  Liên hệ ứng viên
                </button>
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