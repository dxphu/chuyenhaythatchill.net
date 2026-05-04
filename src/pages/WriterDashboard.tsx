import React, { useEffect, useState } from 'react';
import { 
  BarChart3, 
  BookText, 
  PenTool, 
  Eye, 
  Star, 
  MessageSquare,
  Plus,
  Search,
  RefreshCw,
  Trash2,
  Layers
} from 'lucide-react';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Story } from '../types';

export const WriterDashboard: React.FC = () => {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const [stats, setStats] = useState([
    { label: 'Tổng lượt xem', value: '0', trend: '0%', icon: Eye, color: 'text-brand' },
    { label: 'Số truyện', value: '0', trend: '0%', icon: BookText, color: 'text-blue-500' },
    { label: 'Đánh giá tb', value: '0', trend: '0', icon: Star, color: 'text-yellow-500' },
    { label: 'Đã hoàn thành', value: '0', icon: MessageSquare, color: 'text-pink-500' },
  ]);

  useEffect(() => {
    if (profile) {
      fetchStories();
    }
  }, [profile]);

  const fetchStories = async () => {
    try {
      const { data, error } = await supabase
        .from('stories')
        .select('*')
        .eq('author_id', profile?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setStories(data || []);

      // Calculate stats
      const totalViews = data?.reduce((acc, s) => acc + (s.views || 0), 0) || 0;
      const avgRating = data?.length ? (data.reduce((acc, s) => acc + Number(s.rating || 0), 0) / data.length).toFixed(1) : '0';
      
      setStats([
        { label: 'Tổng lượt xem', value: totalViews.toLocaleString(), trend: '+0%', icon: Eye, color: 'text-brand' },
        { label: 'Số truyện', value: data?.length.toString() || '0', trend: '+0%', icon: BookText, color: 'text-blue-500' },
        { label: 'Đánh giá tb', value: avgRating, trend: '+0', icon: Star, color: 'text-yellow-500' },
        { label: 'Đã hoàn thành', value: data?.filter(s => s.status === 'completed').length.toString() || '0', icon: MessageSquare, color: 'text-pink-500' },
      ]);
    } catch (err) {
      console.error('Error fetching stories:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa tác phẩm này? Tất cả chương tương ứng cũng sẽ bị xóa.')) return;
    try {
      const { error } = await supabase.from('stories').delete().eq('id', id);
      if (error) throw error;
      setStories(stories.filter(s => s.id !== id));
    } catch (err: any) {
      alert(err.message);
    }
  };

  const filteredStories = stories.filter(s => 
    s.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h2 className="text-2xl font-bold">Writer Dashboard</h2>
           <p className="text-text-secondary">Chào mừng trở lại, <span className="font-bold text-brand">{profile?.full_name}</span>.</p>
        </div>
        <Link to="/writer/new-story" className="misa-btn-primary h-11 px-6 flex items-center justify-center gap-2">
           <Plus size={18} /> Đăng truyện mới
        </Link>
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
               </div>
               <div className={cn("p-2 rounded-misa bg-background-app", stat.color)}>
                  <stat.icon size={24} />
               </div>
            </div>
            <div className="h-4 w-full mt-4 flex items-end gap-1 overflow-hidden">
               {Array.from({ length: 12 }).map((_, j) => (
                 <div key={j} className="flex-1 bg-brand/20 rounded-t" style={{ height: `${20 + Math.random() * 80}%` }} />
               ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Content Sections */}
      <div className="space-y-4">
          <div className="misa-card overflow-hidden">
             <div className="p-4 border-b border-border-neutral-light flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h3 className="flex items-center gap-2">
                  <BookText size={18} className="text-brand" />
                  Quản lý tác phẩm
                </h3>
                <div className="flex items-center gap-2">
                   <div className="relative">
                      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-hint" size={14} />
                      <input 
                        type="text" 
                        placeholder="Tìm tác phẩm..." 
                        className="misa-input pl-8 w-full sm:w-48 text-[12px]"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                      />
                   </div>
                   <button onClick={fetchStories} className="p-2 hover:bg-brand-light rounded-misa text-text-secondary border border-border-neutral"><RefreshCw size={16} /></button>
                </div>
             </div>
             <div className="overflow-x-auto">
                <table className="w-full text-left">
                   <thead className="bg-[#FAFAFA] border-b border-border-neutral-light">
                      <tr>
                         <th className="px-4 py-3 font-semibold text-[12px] text-text-secondary uppercase">Tên tác phẩm</th>
                         <th className="px-4 py-3 font-semibold text-[12px] text-text-secondary uppercase text-center">Trạng thái</th>
                         <th className="px-4 py-3 font-semibold text-[12px] text-text-secondary uppercase text-center">Lượt xem</th>
                         <th className="px-4 py-3 font-semibold text-[12px] text-text-secondary uppercase text-right">Thao tác</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-border-neutral-light">
                      {loading ? (
                        <tr><td colSpan={4} className="px-4 py-8 text-center text-text-hint">Đang tải dữ liệu...</td></tr>
                      ) : filteredStories.length === 0 ? (
                        <tr><td colSpan={4} className="px-4 py-8 text-center text-text-hint">Chưa có tác phẩm nào.</td></tr>
                      ) : filteredStories.map((story) => (
                         <tr key={story.id} className="hover:bg-brand-light transition-colors group">
                            <td className="px-4 py-4">
                               <p onClick={() => navigate(`/story/${story.id}`)} className="font-medium text-text-primary group-hover:text-brand transition-colors cursor-pointer">{story.title}</p>
                               <p className="text-[11px] text-text-hint">{story.category} • {new Date(story.created_at).toLocaleDateString('vi-VN')}</p>
                            </td>
                            <td className="px-4 py-4 text-center">
                               <span className={cn(
                                 "px-2 py-0.5 rounded text-[11px] font-bold",
                                 story.status === 'ongoing' ? "bg-info/10 text-info" : "bg-success/10 text-success"
                               )}>
                                 {story.status === 'ongoing' ? 'Đang ra' : 'Hoàn thành'}
                               </span>
                            </td>
                            <td className="px-4 py-4 text-center font-mono text-[13px]">{story.views?.toLocaleString()}</td>
                            <td className="px-4 py-4 text-right">
                               <div className="flex items-center justify-end gap-2">
                                  <Link 
                                    to={`/writer/manage-chapters/${story.id}`}
                                    className="p-1.5 hover:bg-white rounded-misa text-brand border border-transparent hover:border-brand/30 shadow-sm flex items-center gap-1 text-[11px] font-bold"
                                    title="Quản lý chương"
                                  >
                                    <Layers size={14} /> Chương
                                  </Link>
                                  <Link 
                                    to={`/writer/edit-story/${story.id}`}
                                    className="p-1.5 hover:bg-white rounded-misa text-text-secondary border border-transparent hover:border-border-neutral shadow-sm"
                                    title="Sửa thông tin"
                                  >
                                    <PenTool size={14} />
                                  </Link>
                                  <button 
                                    onClick={() => handleDelete(story.id)}
                                    className="p-1.5 hover:bg-danger/10 rounded-misa text-danger"
                                    title="Xóa truyện"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                            </td>
                         </tr>
                      ))}
                   </tbody>
                </table>
             </div>
          </div>
      </div>
    </div>
  );
};
