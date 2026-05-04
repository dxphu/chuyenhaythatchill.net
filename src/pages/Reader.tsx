import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Chapter, Story } from '../types';
import { 
  ChevronLeft, 
  ChevronRight, 
  Settings, 
  MessageSquare, 
  ThumbsUp, 
  Home, 
  ExternalLink 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

export const Reader: React.FC = () => {
  const { storyId, chapterId } = useParams();
  const navigate = useNavigate();
  const [story, setStory] = useState<Story | null>(null);
  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [loading, setLoading] = useState(true);
  const [showShopeePopup, setShowShopeePopup] = useState(false);
  const [hasClickedShopee, setHasClickedShopee] = useState(false);

  useEffect(() => {
    fetchChapter();
  }, [storyId, chapterId]);

  const fetchChapter = async () => {
    setLoading(true);
    // Fetch story
    const { data: storyData } = await supabase.from('stories').select('*').eq('id', storyId).single();
    
    // For demo purposes, we'll mock the chapter content
    const chapterNumber = parseInt(chapterId || '1');
    
    // SHOPEE REQUIREMENT: Always check if it's chapter 2
    if (chapterNumber === 2 && !hasClickedShopee) {
       setShowShopeePopup(true);
    } else {
       setShowShopeePopup(false);
    }

    setStory(storyData || {
      id: storyId!,
      title: 'Một Khuôn Mặt, Một Kiếp Tai Ương',
      category: 'Cổ trang',
      cover_url: '',
      views: 0, rating: 5, author_id: '', author_name: 'Minh Tuấn',
      description: '', status: 'ongoing', created_at: '', updated_at: ''
    });

    setChapter({
      id: chapterId!,
      story_id: storyId!,
      title: `Chương ${chapterNumber}: Khởi đầu mới`,
      chapter_number: chapterNumber,
      content: `Đây là nội dung của chương ${chapterNumber}. Nội dung truyện được trình bày một cách rõ ràng, dễ đọc, khoảng cách dòng hợp lý theo đúng tiêu chuẩn MISA thiết kế...`.repeat(20),
      views: 100,
      created_at: new Date().toISOString()
    });
    
    setLoading(false);
    
    // Increment view counter
    if (storyId) {
      supabase.rpc('increment_views', { story_id: storyId });
    }
  };

  const handleShopeeClick = () => {
    setHasClickedShopee(true);
    setShowShopeePopup(false);
    // Open Shopee link
    window.open('https://shopee.vn', '_blank');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Reader Header */}
      <header className="fixed top-0 left-0 right-0 h-[48px] bg-white border-b border-border-neutral-light flex items-center justify-between px-4 z-40">
        <div className="flex items-center gap-3">
          <Link to={`/story/${storyId}`} className="p-2 hover:bg-brand-light rounded-full text-text-secondary hover:text-brand">
            <ChevronLeft size={20} />
          </Link>
          <div className="flex flex-col">
            <span className="text-[12px] text-text-secondary font-medium line-clamp-1">{story?.title}</span>
            <span className="text-[11px] text-text-hint">{chapter?.title}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="p-2 text-text-secondary hover:text-brand"><Settings size={18} /></button>
          <button className="p-2 text-text-secondary hover:text-brand"><Home size={18} /></button>
        </div>
      </header>

      {/* Reader Content */}
      <main className="pt-20 pb-20 max-w-2xl mx-auto px-4">
        <motion.div
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           className="prose prose-lg prose-slate max-w-none"
        >
          <h1 className="text-3xl font-bold mb-10 text-center">{chapter?.title}</h1>
          <div className="text-[16px] leading-[1.8] text-text-primary space-y-6">
            {chapter?.content.split('\n').map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </motion.div>

        {/* Interaction Bar */}
        <div className="mt-16 flex items-center justify-between border-t border-border-neutral-light pt-6">
           <div className="flex items-center gap-6">
              <button className="flex items-center gap-2 text-text-secondary hover:text-brand group">
                <ThumbsUp size={18} className="group-hover:scale-110 transition-transform" />
                <span>124</span>
              </button>
              <button className="flex items-center gap-2 text-text-secondary hover:text-brand group">
                <MessageSquare size={18} className="group-hover:scale-110 transition-transform" />
                <span>45</span>
              </button>
           </div>
           
           <div className="flex items-center gap-4">
             <button 
                onClick={() => navigate(`/story/${storyId}/chapter/${chapter!.chapter_number - 1}`)}
                disabled={chapter?.chapter_number === 1}
                className="misa-btn-secondary disabled:opacity-50"
             >
               <ChevronLeft size={16} /> Chương trước
             </button>
             <button 
                onClick={() => navigate(`/story/${storyId}/chapter/${chapter!.chapter_number + 1}`)}
                className="misa-btn-primary"
             >
               Chương sau <ChevronRight size={16} />
             </button>
           </div>
        </div>
      </main>

      {/* Shopee Popup */}
      <AnimatePresence>
        {showShopeePopup && (
          <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="misa-card p-8 max-w-sm text-center space-y-6"
            >
              <div className="w-20 h-20 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingBag size={40} />
              </div>
              <h3 className="text-xl font-bold">Tiếp tục đọc chương 2</h3>
              <p className="text-text-secondary">
                Để hỗ trợ tác giả và website, vui lòng nhấn vào liên kết bên dưới để ủng hộ chúng tôi nhé!
              </p>
              <button 
                onClick={handleShopeeClick}
                className="w-full h-12 bg-[#EE4D2D] text-white rounded-misa font-bold flex items-center justify-center gap-2 hover:bg-orange-600 transition-colors"
              >
                Ủng hộ tại Shopee <ExternalLink size={18} />
              </button>
              <p className="text-[11px] text-text-hint">
                Trang web sẽ tự động mở truyện sau khi bạn nhấn liên kết.
              </p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Simple component for interaction
const ShoppingBag = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
);
