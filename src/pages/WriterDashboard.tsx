import React, { useState } from 'react';
import { 
  BarChart3, 
  BookText, 
  PenTool, 
  Users, 
  Eye, 
  Star, 
  MessageSquare,
  Plus,
  MoreVertical,
  Search,
  Filter,
  RefreshCw,
  Download,
  Settings
} from 'lucide-react';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';

export const WriterDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'stories' | 'analytics'>('overview');

  const stats = [
    { label: 'Tổng lượt xem', value: '1,2M', trend: '+12%', icon: Eye, color: 'text-brand' },
    { label: 'Số người đọc', value: '45,2k', trend: '+8%', icon: Users, color: 'text-blue-500' },
    { label: 'Đánh giá tb', value: '4.8', trend: '+0.2', icon: Star, color: 'text-yellow-500' },
    { label: 'Bình luận', value: '12,8k', trend: '+15%', icon: MessageSquare, color: 'text-pink-500' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
           <h2 className="text-2xl font-bold">Writer Dashboard</h2>
           <p className="text-text-secondary">Chào mừng trở lại, Minh Tuấn. Hãy kiểm tra hiệu suất truyện của bạn.</p>
        </div>
        <button className="misa-btn-primary h-11 px-6">
           <Plus size={18} /> Đăng truyện mới
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div 
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="misa-card p-5"
          >
            <div className="flex justify-between items-start">
               <div className="space-y-1">
                  <p className="text-[12px] text-text-secondary font-medium uppercase tracking-wider">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <span className={cn(
                    "text-[11px] font-bold px-1.5 py-0.5 rounded",
                    stat.trend.startsWith('+') ? "text-success bg-success/10" : "text-danger bg-danger/10"
                  )}>
                    {stat.trend} so với tháng trước
                  </span>
               </div>
               <div className={cn("p-2 rounded-misa bg-background-app", stat.color)}>
                  <stat.icon size={24} />
               </div>
            </div>
            {/* Minimal line chart placeholder */}
            <div className="h-6 w-full mt-4 flex items-end gap-1 overflow-hidden">
               {Array.from({ length: 12 }).map((_, j) => (
                 <div key={j} className="flex-1 bg-brand/20 hover:bg-brand transition-colors rounded-t" style={{ height: `${20 + Math.random() * 80}%` }} />
               ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Content Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         {/* Manage Table */}
         <div className="lg:col-span-2 space-y-4">
            <div className="misa-card overflow-hidden">
               <div className="p-4 border-b border-border-neutral-light flex items-center justify-between">
                  <h3 className="flex items-center gap-2">
                    <BookText size={18} className="text-brand" />
                    Quản lý tác phẩm
                  </h3>
                  <div className="flex items-center gap-2">
                     <div className="relative">
                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-hint" size={14} />
                        <input type="text" placeholder="Tìm tác phẩm..." className="misa-input pl-8 w-48 text-[12px]" />
                     </div>
                     <button className="p-2 hover:bg-brand-light rounded-misa text-text-secondary border border-border-neutral"><Filter size={16} /></button>
                     <button className="p-2 hover:bg-brand-light rounded-misa text-text-secondary border border-border-neutral"><RefreshCw size={16} /></button>
                  </div>
               </div>
               <div className="overflow-x-auto">
                  <table className="w-full text-left">
                     <thead className="bg-[#FAFAFA] border-b border-border-neutral-light">
                        <tr>
                           <th className="px-4 py-3 font-semibold text-[12px] text-text-secondary uppercase">Tên tác phẩm</th>
                           <th className="px-4 py-3 font-semibold text-[12px] text-text-secondary uppercase">Trạng thái</th>
                           <th className="px-4 py-3 font-semibold text-[12px] text-text-secondary uppercase">Lượt xem</th>
                           <th className="px-4 py-3 font-semibold text-[12px] text-text-secondary uppercase">Thao tác</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-border-neutral-light">
                        {[
                          { title: 'Một Khuôn Mặt, Một Kiếp Tai Ương', status: 'Đang ra', views: '24.5k' },
                          { title: 'Bắc Cực Tình Không Bao Giờ Tắt', status: 'Hoàn thành', views: '1.2M' },
                          { title: 'Chữa Lành Sau Những Ngày Bị Bỏ Quên', status: 'Bản nháp', views: '0' }
                        ].map((story, i) => (
                           <tr key={i} className="hover:bg-brand-light transition-colors group">
                              <td className="px-4 py-4">
                                 <p className="font-medium text-text-primary group-hover:text-brand transition-colors cursor-pointer">{story.title}</p>
                                 <p className="text-[11px] text-text-hint">Cập nhật: 2 giờ trước</p>
                              </td>
                              <td className="px-4 py-4">
                                 <span className={cn(
                                   "px-2 py-0.5 rounded text-[11px] font-bold",
                                   story.status === 'Đang ra' ? "bg-info/10 text-info" : 
                                   story.status === 'Hoàn thành' ? "bg-success/10 text-success" : "bg-text-hint/10 text-text-hint"
                                 )}>
                                   {story.status}
                                 </span>
                              </td>
                              <td className="px-4 py-4 font-mono text-[13px]">{story.views}</td>
                              <td className="px-4 py-4">
                                 <div className="flex items-center gap-2">
                                    <button className="p-1.5 hover:bg-white rounded-misa text-text-secondary border border-transparent border-t-border-neutral/0 hover:border-border-neutral shadow-sm"><PenTool size={14} /></button>
                                    <button className="p-1.5 hover:bg-white rounded-misa text-text-secondary border border-transparent border-t-border-neutral/0 hover:border-border-neutral shadow-sm"><MoreVertical size={14} /></button>
                                 </div>
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
               <div className="p-4 border-t border-border-neutral-light flex items-center justify-between text-[12px] text-text-secondary">
                  <span>Hiển thị 3 / 8 tác phẩm</span>
                  <div className="flex gap-2">
                     <button className="p-1 border border-border-neutral bg-white rounded flex items-center justify-center w-6 h-6 disabled:opacity-50" disabled>1</button>
                     <button className="p-1 border border-border-neutral bg-white rounded flex items-center justify-center w-6 h-6 hover:bg-brand-light">2</button>
                  </div>
               </div>
            </div>
         </div>

         {/* Side Widgets */}
         <div className="space-y-6">
            <div className="misa-card p-5 space-y-4">
               <h3 className="flex items-center gap-2">
                  <BarChart3 size={18} className="text-brand" />
                  Top Chương Hot
               </h3>
               <div className="space-y-4">
                  {[1, 2, 3].map((j) => (
                    <div key={j} className="flex items-center gap-3">
                       <span className="w-6 h-6 rounded bg-brand-light text-brand font-bold flex items-center justify-center text-[11px]">{j}</span>
                       <div className="flex-1 min-w-0">
                          <p className="font-medium text-[13px] truncate">Chương {j * 5}: Trận chiến mới</p>
                          <p className="text-[11px] text-text-hint">12.5k lượt xem</p>
                       </div>
                    </div>
                  ))}
               </div>
               <button className="w-full text-link hover:underline text-[12px] font-medium pt-2 border-t border-border-neutral-light">Xem phân tích chi tiết</button>
            </div>

            <div className="misa-card p-5 space-y-4">
               <div className="flex items-center justify-between">
                  <h3 className="flex items-center gap-2">
                     <MessageSquare size={18} className="text-brand" />
                     Bình luận mới
                  </h3>
               </div>
               <div className="space-y-4">
                  {[1, 2].map((j) => (
                    <div key={j} className="p-3 bg-background-app rounded-misa space-y-2">
                       <div className="flex items-center justify-between">
                          <span className="font-bold text-[12px]">Nguyễn Văn A</span>
                          <span className="text-[10px] text-text-hint">Vừa xong</span>
                       </div>
                       <p className="text-[12px] text-text-secondary line-clamp-2 italic">"Truyện này đỉnh quá tác giả ơi, bao giờ ra chương mới vậy ạ?"</p>
                    </div>
                  ))}
               </div>
               <button className="w-full text-link hover:underline text-[12px] font-medium pt-2 border-t border-border-neutral-light">Tất cả bình luận</button>
            </div>
         </div>
      </div>
    </div>
  );
};
