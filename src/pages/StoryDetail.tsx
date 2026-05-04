import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Story, Chapter, Comment } from '../types';
import { 
  Star, 
  Eye, 
  MessageSquare, 
  BookOpen, 
  List, 
  Clock, 
  ChevronRight,
  User,
  Share2,
  BookmarkPlus
} from 'lucide-react';
import { motion } from 'motion/react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { cn } from '../lib/utils';

export const StoryDetail: React.FC = () => {
  const { id } = useParams();
  const [story, setStory] = useState<Story | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'info' | 'chapters' | 'comments'>('info');

  useEffect(() => {
    fetchStoryData();
  }, [id]);

  const fetchStoryData = async () => {
    setLoading(true);
    // Fetch story, chapters, comments
    const { data: storyData } = await supabase.from('stories').select('*').eq('id', id).single();
    
    setStory(storyData || {
       id: id!, title: 'Một Khuôn Mặt, Một Kiếp Tai Ương',
       author_id: 'auth-1', author_name: 'Minh Tuấn',
       description: 'Ta trời sinh một gương mặt phù dung. Là cung nữ nổi bật nhất trong Khôn Ninh cung. Một lần tình cờ, ta nghe thấy đế vương cẩn thận dặn hoàng hậu: "Nàng ta ỷ vào nhan sắc, e là có lòng bám víu." Kiếp trước, ta sợ hoàng hậu để bụng, nên từng bước nhẫn nhịn. Chỉ mong bình an xuất cung, gả cho một người bình thường...',
       cover_url: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=800&auto=format&fit=crop',
       views: 24500, rating: 4.8, status: 'ongoing', category: 'Cổ trang',
       created_at: new Date().toISOString(), updated_at: new Date().toISOString()
    });

    const mockChapters: Chapter[] = Array.from({ length: 5 }).map((_, i) => ({
      id: `chapter-${i}`,
      story_id: id!,
      title: `Chương ${i + 1}: ${['Bắt đầu', 'Thay đổi', 'Gặp gỡ', 'Bất ngờ', 'Khám phá'][i]}`,
      content: 'Nội dung chương truyện...',
      chapter_number: i + 1,
      views: 1200 - i * 100,
      created_at: new Date(Date.now() - i * 86400000).toISOString()
    }));
    setChapters(mockChapters);

    const mockComments: Comment[] = [
      { id: 'c1', user_id: 'u1', user_name: 'Lan Anh', content: 'Truyện hay quá tác giả ơi, hóng chương mới!', rating: 5, created_at: new Date().toISOString() },
      { id: 'c2', user_id: 'u2', user_name: 'Thế Vinh', content: 'Cốt truyện này lạ nè, ủng hộ.', rating: 4, created_at: new Date().toISOString() }
    ];
    setComments(mockComments);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand"></div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left Column: Info & Tabs */}
      <div className="lg:col-span-2 space-y-8">
        <section className="misa-card p-6 flex flex-col md:flex-row gap-8">
          <div className="w-48 h-64 shrink-0 rounded-misa overflow-hidden shadow-lg mx-auto md:mx-0">
             <img src={story?.cover_url} alt={story?.title} className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 flex flex-col justify-between space-y-4">
             <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                   <span className="px-3 py-1 bg-brand-light text-brand text-[12px] font-semibold rounded-misa">{story?.category}</span>
                   <span className={cn(
                     "px-3 py-1 text-[12px] font-semibold rounded-misa",
                     story?.status === 'ongoing' ? "bg-info/10 text-info" : "bg-success/10 text-success"
                   )}>
                     {story?.status === 'ongoing' ? 'Đang ra' : 'Hoàn thành'}
                   </span>
                </div>
                <h1 className="text-3xl font-bold leading-tight">{story?.title}</h1>
                <div className="flex items-center gap-4 text-text-secondary">
                   <div className="flex items-center gap-1.5"><User size={16} /> <span className="font-medium text-text-primary">{story?.author_name}</span></div>
                   <div className="flex items-center gap-1.5"><Clock size={16} /> <span>{format(new Date(story!.updated_at), 'dd/MM/yyyy', { locale: vi })}</span></div>
                </div>
             </div>

             <div className="grid grid-cols-3 gap-4 py-4 border-y border-border-neutral-light">
                <div className="text-center">
                   <p className="text-[12px] text-text-secondary">Lượt xem</p>
                   <p className="font-bold text-lg">{story?.views.toLocaleString()}</p>
                </div>
                <div className="text-center">
                   <p className="text-[12px] text-text-secondary">Đánh giá</p>
                   <div className="flex items-center justify-center gap-1">
                      <Star size={16} className="fill-yellow-400 text-yellow-400" />
                      <p className="font-bold text-lg">{story?.rating}</p>
                   </div>
                </div>
                <div className="text-center">
                   <p className="text-[12px] text-text-secondary">Cảm xúc</p>
                   <p className="font-bold text-lg">452</p>
                </div>
             </div>

             <div className="flex flex-wrap gap-3">
                {chapters.length > 0 && (
                  <Link to={`/story/${id}/chapter/${chapters[0].id}`} className="misa-btn-primary flex-1 min-w-[140px] h-11 text-base">
                    <BookOpen size={18} /> Đọc ngay
                  </Link>
                )}
                <button className="misa-btn-secondary flex-1 min-w-[140px] h-11 text-base">
                  <BookmarkPlus size={18} /> Theo dõi
                </button>
             </div>
          </div>
        </section>

        {/* Desktop Tabs */}
        <div className="bg-white rounded-misa-lg shadow-[0_4px_16px_0_rgba(0,0,0,0.04)] overflow-hidden">
           <div className="flex border-b border-border-neutral-light">
              <button 
                onClick={() => setActiveTab('info')}
                className={cn(
                  "flex-1 py-4 font-semibold text-[15px] border-b-2 transition-all",
                  activeTab === 'info' ? "border-brand text-brand bg-brand-light/20" : "border-transparent text-text-secondary hover:text-brand"
                )}
              >
                Giới thiệu
              </button>
              <button 
                onClick={() => setActiveTab('chapters')}
                className={cn(
                  "flex-1 py-4 font-semibold text-[15px] border-b-2 transition-all",
                  activeTab === 'chapters' ? "border-brand text-brand bg-brand-light/20" : "border-transparent text-text-secondary hover:text-brand"
                )}
              >
                Danh sách chương ({chapters.length})
              </button>
              <button 
                onClick={() => setActiveTab('comments')}
                className={cn(
                  "flex-1 py-4 font-semibold text-[15px] border-b-2 transition-all",
                  activeTab === 'comments' ? "border-brand text-brand bg-brand-light/20" : "border-transparent text-text-secondary hover:text-brand"
                )}
              >
                Bình luận
              </button>
           </div>
           
           <div className="p-6">
              {activeTab === 'info' && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                   <p className="text-[15px] leading-relaxed text-text-primary whitespace-pre-wrap">
                     {story?.description}
                   </p>
                </motion.div>
              )}

              {activeTab === 'chapters' && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  className="divide-y divide-border-neutral-light"
                >
                   {chapters.map((chapter) => (
                      <Link 
                        key={chapter.id} 
                        to={`/story/${id}/chapter/${chapter.id}`}
                        className="flex items-center justify-between py-3 hover:bg-brand-light px-2 rounded-misa transition-colors group"
                      >
                         <div className="flex items-center gap-3">
                            <span className="text-text-hint font-medium w-8">0{chapter.chapter_number}</span>
                            <span className="text-text-primary font-medium group-hover:text-brand">{chapter.title}</span>
                         </div>
                         <div className="flex items-center gap-4 text-[12px] text-text-hint">
                            <span className="flex items-center gap-1"><Eye size={12} /> {chapter.views}</span>
                            <span>{format(new Date(chapter.created_at), 'dd/MM/yyyy')}</span>
                         </div>
                      </Link>
                   ))}
                </motion.div>
              )}

              {activeTab === 'comments' && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                   <div className="flex gap-4 mb-8">
                      <div className="w-10 h-10 rounded-full bg-border-neutral shrink-0" />
                      <div className="flex-1 space-y-3">
                         <div className="misa-input w-full h-20 flex p-3">
                            <textarea placeholder="Nhập bình luận của bạn..." className="w-full bg-transparent outline-none resize-none" />
                         </div>
                         <button className="misa-btn-primary ml-auto">Gửi bình luận</button>
                      </div>
                   </div>

                   <div className="space-y-6">
                      {comments.map((comment) => (
                         <div key={comment.id} className="flex gap-4">
                            <div className="w-10 h-10 rounded-full bg-border-neutral shrink-0 flex items-center justify-center font-bold text-white bg-brand">
                               {comment.user_name[0]}
                            </div>
                            <div className="flex-1 space-y-1">
                               <div className="flex items-center justify-between">
                                  <span className="font-bold text-text-primary">{comment.user_name}</span>
                                  <span className="text-[11px] text-text-hint">{format(new Date(comment.created_at), 'HH:mm dd/MM', { locale: vi })}</span>
                               </div>
                               <div className="flex gap-0.5 mb-1">
                                  {Array.from({ length: 5 }).map((_, i) => (
                                     <Star key={i} size={12} className={cn(i < (comment.rating || 0) ? "fill-yellow-400 text-yellow-400" : "text-border-neutral")} />
                                  ))}
                               </div>
                               <p className="text-text-primary">{comment.content}</p>
                            </div>
                         </div>
                      ))}
                   </div>
                </motion.div>
              )}
           </div>
        </div>
      </div>

      {/* Right Column: Sidebar info */}
      <div className="space-y-8">
         <section className="misa-card p-6 space-y-6">
            <h3 className="flex items-center gap-2">
               <Share2 size={18} className="text-brand" />
               Chi tiết khác
            </h3>
            <div className="space-y-4">
               <div className="flex justify-between items-center text-[13px]">
                  <span className="text-text-secondary">Trạng thái</span>
                  <span className="font-medium text-text-primary">Đang tiến hành</span>
               </div>
               <div className="flex justify-between items-center text-[13px]">
                  <span className="text-text-secondary">Thể loại</span>
                  <span className="font-medium text-link hover:underline cursor-pointer">Cổ trang</span>
               </div>
               <div className="flex justify-between items-center text-[13px]">
                  <span className="text-text-secondary">Lượt xem tổng</span>
                  <span className="font-medium text-text-primary font-mono">24.500</span>
               </div>
               <div className="flex justify-between items-center text-[13px]">
                  <span className="text-text-secondary">Bình luận</span>
                  <span className="font-medium text-text-primary font-mono">1.280</span>
               </div>
            </div>
         </section>

         <section className="misa-card p-6 space-y-6">
            <h3 className="flex items-center gap-2">
               <TrendingUp size={18} className="text-brand" />
               Truyện cùng tác giả
            </h3>
            <div className="space-y-4">
               {Array.from({ length: 3 }).map((_, i) => (
                 <div key={i} className="flex gap-3 group cursor-pointer">
                    <div className="w-12 h-16 rounded bg-border-neutral shrink-0 overflow-hidden">
                       <img src={`https://images.unsplash.com/photo-${1500000000000 + i}?auto=format&fit=crop&q=80&w=100`} alt="Story" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                       <p className="font-medium text-[13px] line-clamp-2 leading-snug group-hover:text-brand transition-colors">Tên truyện cùng tác giả cực hay tập {i + 1}</p>
                       <span className="text-[11px] text-text-hint truncate">5,2k lượt xem</span>
                    </div>
                 </div>
               ))}
            </div>
         </section>
      </div>
    </div>
  );
};

// Internal icon component for Trending
const TrendingUp = ({ size, className }: { size: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
);
