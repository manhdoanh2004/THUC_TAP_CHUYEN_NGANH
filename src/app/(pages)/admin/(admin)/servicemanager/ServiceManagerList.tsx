/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Eye, 
  ChevronLeft, 
  ChevronRight, 
  Package, 
  Search,
  X,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';

// --- Types ---
interface ServicePackage {
  id?: any;
  name: string;
  durationDays: number; // Ngày sử dụng
  jobPostDurationDays: number; // Ngày tồn tại bài đăng
  price: number;
  description: string;
  isActive: boolean; 
  weeklyPostLimit?: number;
}

const apiKey = ""; 

export default function ServiceManagerList() {
  const [packages, setPackages] = useState<ServicePackage[]>([]);
  const [apiMethod, setapiMethod] = useState<string>('POST');
  const [idPackage, setidPackage] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const itemsPerPage = 5;


  // State cho Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<ServicePackage | null>(null);
  const [viewingPackage, setViewingPackage] = useState<ServicePackage | null>(null);

  // Form State
  const [formData, setFormData] = useState<ServicePackage>({
    name: '',
    durationDays: 30,
    jobPostDurationDays: 7,
    price: 0,
    description: '',
    isActive: true,
    weeklyPostLimit:0
  });

  // --- API Helpers ---
  const fetchAllPackages = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
     
        const res=await fetch(`http://localhost:8080/api/vip-packages`,{
            method:"GET",
            credentials:"include"
        });
        const data=await res.json();
        if(data.code=='success')
        {
            setPackages(data.result)
        }
        else{
           setPackages([]); 
        }
 
      console.log("Dữ liệu đã được tải mới");
    } catch (err) {
      setError("Không thể tải danh sách gói dịch vụ. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllPackages();
  }, [fetchAllPackages]);

  const deletePackage = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa gói dịch vụ này?')) return;
    setIsLoading(true);
    try {
     const response =  await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/vip-packages/${id}`, {
      method: 'DELETE',
    
      credentials:"include",
   
    });
    if (!response.ok) throw new Error('Lỗi khi xóa gói dịch vụ');
    const data= await response.json();
    fetchAllPackages()
    } catch (err) {
      setError("Lỗi khi xóa gói dịch vụ.");
    } finally {
      setIsLoading(false);
    }
  };

  // --- Logic UI ---
  const filteredPackages = useMemo(() => {
    return packages.filter(pkg => 
      pkg.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [packages, searchTerm]);

  const totalPages = Math.ceil(filteredPackages.length / itemsPerPage) || 1;
  const paginatedPackages = filteredPackages.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleOpenAddModal = () => {
    setEditingPackage(null);
      setapiMethod("POST");
    setFormData({
      name: '',
      durationDays: 30,
      jobPostDurationDays: 7,
      price: 0,
      description: '',
      isActive: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (pkg: ServicePackage,id:string) => {
    setEditingPackage(pkg);
    setidPackage(id)
    setapiMethod("PUT");
    setFormData({
      name: pkg.name,
      durationDays: pkg.durationDays,
      jobPostDurationDays: pkg.jobPostDurationDays,
      price: pkg.price,
      description: pkg.description,
      isActive: pkg.isActive,
    });
    setIsModalOpen(true);
  };

  const handleOpenDetail = (pkg: ServicePackage) => {
    setViewingPackage(pkg);
    setIsDetailOpen(true);
  };

  const createPackage = async (data: ServicePackage) => {
    const response =  await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/vip-packages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials:"include",
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Lỗi khi thêm mới gói dịch vụ');
    return await response.json();
  };

  // 3. Hàm Cập nhật (Update)
  const updatePackage = async (id: string, data: ServicePackage) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/vip-packages/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials:"include",
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Lỗi khi cập nhật gói dịch vụ');
    return await response.json();
  };

 

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

  try {
  
    let data=null;
            if(apiMethod=="POST")
            {
                    data=await createPackage(formData);
            }
            else data=await updatePackage(idPackage,formData);
      
        if(data.code=="success")
        {
            setIsLoading(false);
        setIsModalOpen(false);
        fetchAllPackages();
        }
   
  } catch (error) {
    setIsLoading(false);
        setIsModalOpen(false);
  }
 
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <Package className="text-blue-600" />
              Quản lý Gói Dịch Vụ Nhà Tuyển Dụng
            </h1>
          </div>
          <button 
            onClick={handleOpenAddModal}
            disabled={isLoading}
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all shadow-md active:scale-95 disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="animate-spin" size={18} /> : <Plus size={18} />}
            Thêm gói mới
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 flex items-center gap-2">
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        {/* Toolbar */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-6 flex flex-col md:flex-row gap-4 justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Tìm kiếm tên gói..."
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden relative">
          {isLoading && !isModalOpen && (
            <div className="absolute inset-0 bg-white/60 z-10 flex items-center justify-center">
              <Loader2 className="text-blue-600 animate-spin" size={32} />
            </div>
          )}
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Tên gói</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Hạn dùng</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Hạn bài đăng</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Giá niêm yết</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Trạng thái</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {paginatedPackages.length > 0 ? paginatedPackages.map((pkg) => (
                  <tr key={pkg.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-900">{pkg.name}</div>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{pkg.durationDays} ngày</td>
                    <td className="px-6 py-4 text-slate-600">{pkg.jobPostDurationDays} ngày</td>
                    <td className="px-6 py-4 font-semibold text-blue-600">
                      {pkg.price.toLocaleString('vi-VN')} đ
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        pkg.isActive 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-red-100 text-red-700'
                      }`}>
                        {pkg.isActive ? 'Đang hoạt động' : 'Đã ẩn'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => handleOpenDetail(pkg)}
                          className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Xem chi tiết"
                        >
                          <Eye size={18} />
                        </button>
                        <button 
                          onClick={() => handleOpenEditModal(pkg,pkg.id)}
                          className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors" title="Chỉnh sửa"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button 
                          onClick={() => deletePackage(pkg.id)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Xóa"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-slate-400 italic">
                      {isLoading ? "Đang tải dữ liệu..." : "Không tìm thấy dữ liệu gói dịch vụ nào."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <span className="text-sm text-slate-500">
                Hiển thị {paginatedPackages.length} trên {filteredPackages.length} gói
              </span>
              <div className="flex items-center gap-2">
                <button 
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => prev - 1)}
                  className="p-2 border border-slate-200 rounded-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft size={16} />
                </button>
                <div className="flex gap-1">
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`w-8 h-8 rounded-lg text-sm transition-all ${
                        currentPage === i + 1 
                        ? 'bg-blue-600 text-white font-medium shadow-sm' 
                        : 'text-slate-600 hover:bg-white border border-transparent hover:border-slate-200'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
                <button 
                   disabled={currentPage === totalPages}
                   onClick={() => setCurrentPage(prev => prev + 1)}
                  className="p-2 border border-slate-200 rounded-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* --- MODAL THÊM/SỬA --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 transition-opacity duration-300" onClick={() => !isLoading && setIsModalOpen(false)} />
          
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white">
              <h2 className="text-xl font-bold text-slate-800">
                {editingPackage ? 'Cập nhật gói dịch vụ' : 'Tạo mới gói dịch vụ'}
              </h2>
              <button disabled={isLoading} onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1 transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 bg-white">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Tên gói dịch vụ</label>
                  <input 
                    required
                    disabled={isLoading}
                    type="text" 
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none disabled:bg-slate-50"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Hạn sử dụng (Ngày)</label>
                    <input 
                      required
                      disabled={isLoading}
                      type="number" 
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none disabled:bg-slate-50"
                      value={formData.durationDays}
                      onChange={(e) => setFormData({...formData, durationDays: parseInt(e.target.value)})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Hạn bài đăng (Ngày)</label>
                    <input 
                      required
                      disabled={isLoading}
                      type="number" 
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none disabled:bg-slate-50"
                      value={formData.jobPostDurationDays}
                      onChange={(e) => setFormData({...formData, jobPostDurationDays: parseInt(e.target.value)})}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Số lượng bài đăng trong tuần </label>
                  <input 
                    required
                    disabled={isLoading}
                    type="number" 
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none disabled:bg-slate-50"
                    value={formData.weeklyPostLimit}
                    onChange={(e) => setFormData({...formData, weeklyPostLimit: parseInt(e.target.value)})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Giá dịch vụ (VNĐ)</label>
                  <input 
                    required
                    disabled={isLoading}
                    type="number" 
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none disabled:bg-slate-50"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: parseInt(e.target.value)})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Mô tả chi tiết</label>
                  <textarea 
                    rows={3}
                    disabled={isLoading}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none resize-none disabled:bg-slate-50"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Trạng thái gói</label>
                  <select 
                    disabled={isLoading}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none disabled:bg-slate-50"
                    value={formData.isActive ? "active" : "inactive"}
                    onChange={(e) => setFormData({...formData, isActive: e.target.value === "active"})}
                  >
                    <option value="active">Hoạt động</option>
                    <option value="inactive">Tạm ẩn</option>
                  </select>
                </div>
              </div>

              <div className="mt-8 flex gap-3">
                <button 
                  type="button"
                  disabled={isLoading}
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors font-medium disabled:opacity-50"
                >
                  Hủy bỏ
                </button>
                <button 
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-md font-medium active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isLoading && <Loader2 className="animate-spin" size={18} />}
                  {editingPackage ? 'Lưu thay đổi' : 'Tạo gói ngay'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL CHI TIẾT --- */}
      {isDetailOpen && viewingPackage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 transition-opacity" onClick={() => setIsDetailOpen(false)} />
          
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
             <div className="h-24 bg-blue-600 p-6 flex items-end relative">
                <button onClick={() => setIsDetailOpen(false)} className="absolute top-4 right-4 text-white/70 hover:text-white">
                  <X size={20} />
                </button>
                <h2 className="text-white text-xl font-bold uppercase tracking-tight">{viewingPackage.name}</h2>
             </div>
             <div className="p-6 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                   <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                      <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">Sử dụng trong</p>
                      <p className="text-lg font-bold text-slate-800">{viewingPackage.durationDays} ngày</p>
                   </div>
                   <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                      <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">Hạn bài đăng</p>
                      <p className="text-lg font-bold text-slate-800">{viewingPackage.jobPostDurationDays} ngày</p>
                   </div>
                </div>

                <div>
                   <h4 className="text-sm font-semibold text-slate-900 flex items-center gap-2 mb-2">
                      <Search size={16} className="text-blue-500" /> Số lượng bài đăng trong tuần 
                   </h4>
                   <p className="text-slate-600 text-sm leading-relaxed">
                      {viewingPackage.weeklyPostLimit || "0 "} bài đăng
                   </p>
                </div>
                <div>
                   <h4 className="text-sm font-semibold text-slate-900 flex items-center gap-2 mb-2">
                      <Search size={16} className="text-blue-500" /> Mô tả dịch vụ
                   </h4>
                   <p className="text-slate-600 text-sm leading-relaxed">
                      {viewingPackage.description || "Không có mô tả cho gói này."}
                   </p>
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                   <div>
                      <p className="text-xs text-slate-400 font-medium">Giá gói dịch vụ</p>
                      <p className="text-2xl font-black text-blue-600">{viewingPackage.price.toLocaleString('vi-VN')} <span className="text-sm font-normal">VNĐ</span></p>
                   </div>
                   <div className={`flex items-center gap-1.5 px-3 py-1 border rounded-lg text-xs font-bold ${
                     viewingPackage.isActive 
                     ? 'bg-green-50 text-green-700 border-green-100' 
                     : 'bg-red-50 text-red-700 border-red-100'
                   }`}>
                      {viewingPackage.isActive ? <CheckCircle size={14} /> : <AlertCircle size={14} />}
                      {viewingPackage.isActive ? 'ĐANG HOẠT ĐỘNG' : 'ĐÃ ẨN'}
                   </div>
                </div>

                <button 
                  onClick={() => setIsDetailOpen(false)}
                  className="w-full py-3 bg-blue-500 text-white rounded-xl font-bold hover:bg-blue-600 transition-colors shadow-lg active:scale-95"
                >
                  Đóng lại
                </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}