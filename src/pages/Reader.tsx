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
  ExternalLink,
  Link as LinkIcon 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

export const Reader: React.FC = () => {
  const { storyId, chapterId } = useParams();
  const navigate = useNavigate();
  const [story, setStory] = useState<Story | null>(null);
  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [nextChapter, setNextChapter] = useState<Chapter | null>(null);
  const [prevChapter, setPrevChapter] = useState<Chapter | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAdPopup, setShowAdPopup] = useState(false);
  const [hasClickedAd, setHasClickedAd] = useState(false);

  useEffect(() => {
    fetchContent();
  }, [storyId, chapterId]);

  const fetchContent = async () => {
    setLoading(true);
    try {
      // Fetch story
      const { data: storyData } = await supabase.from('stories').select('*').eq('id', storyId).single();
      setStory(storyData);
      
      // Fetch current chapter
      const { data: chapterData, error } = await supabase.from('chapters').select('*').eq('id', chapterId).single();
      
      if (error) throw error;
      setChapter(chapterData);

      // Check if this chapter has a link_url and we haven't clicked yet
      if (chapterData.link_url && !hasClickedAd) {
        setShowAdPopup(true);
      } else {
        setShowAdPopup(false);
      }

      // Fetch navigation chapters (prev/next)
      if (chapterData) {
        const [prev, next] = await Promise.all([
          supabase.from('chapters')
            .select('id, chapter_number')
            .eq('story_id', storyId)
            .lt('chapter_number', chapterData.chapter_number)
            .order('chapter_number', { ascending: false })
            .limit(1)
            .maybeSingle(),
          supabase.from('chapters')
            .select('id, chapter_number')
            .eq('story_id', storyId)
            .gt('chapter_number', chapterData.chapter_number)
            .order('chapter_number', { ascending: true })
            .limit(1)
            .maybeSingle()
        ]);
        
        setPrevChapter(prev?.data || null);
        setNextChapter(next?.data || null);
      }

      // Increment view counter
      if (storyId) {
        supabase.rpc('increment_views', { story_id: storyId });
      }
    } catch (err) {
      console.error('Error fetching reader content:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdClick = () => {
    if (chapter?.link_url) {
      setHasClickedAd(true);
      setShowAdPopup(false);
      window.open(chapter.link_url, '_blank');
    }
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
          <Link to="/" className="p-2 text-text-secondary hover:text-brand"><Home size={18} /></Link>
        </div>
      </header>

      {/* Reader Content */}
      <main className="pt-20 pb-24 max-w-2xl mx-auto px-5 md:px-0">
        <motion.div
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           className="prose prose-lg prose-slate max-w-none"
        >
          <h1 className="text-2xl md:text-3xl font-bold mb-8 text-center leading-tight">{chapter?.title}</h1>
          <div className="text-[17px] md:text-[19px] leading-[1.8] text-text-primary space-y-7 font-serif text-justify md:text-left">
            {chapter?.content.split('\n').map((p, i) => (
              <p key={i} className="mb-4">{p}</p>
            ))}
          </div>
        </motion.div>

        {/* Interaction Bar */}
        <div className="mt-16 flex flex-col sm:flex-row items-center justify-between border-t border-border-neutral-light pt-8 gap-8">
           <div className="flex items-center gap-8">
              <button className="flex items-center gap-2 text-text-secondary hover:text-brand transition-colors p-2">
                <ThumbsUp size={22} />
                <span className="font-medium">Thích (124)</span>
              </button>
              <button className="flex items-center gap-2 text-text-secondary hover:text-brand transition-colors p-2">
                <MessageSquare size={22} />
                <span className="font-medium">45</span>
              </button>
           </div>
           
           <div className="flex items-center gap-3 w-full sm:w-auto">
             <button 
                onClick={() => navigate(`/story/${storyId}/chapter/${prevChapter?.id}`)}
                disabled={!prevChapter}
                className="flex-1 sm:flex-none misa-btn-secondary h-12 md:h-10 px-4 disabled:opacity-50 flex items-center justify-center gap-2 font-bold"
             >
               <ChevronLeft size={18} /> Trước
             </button>
             <button 
                onClick={() => navigate(`/story/${storyId}/chapter/${nextChapter?.id}`)}
                disabled={!nextChapter}
                className="flex-1 sm:flex-none misa-btn-primary h-12 md:h-10 px-4 disabled:opacity-50 flex items-center justify-center gap-2 font-bold"
             >
               Sau <ChevronRight size={18} />
             </button>
           </div>
        </div>
      </main>

      {/* Ad/Link Popup */}
      <AnimatePresence>
        {showAdPopup && (
          <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="misa-card p-8 max-w-sm text-center space-y-6"
            >
              <div className="w-20 h-20 bg-brand-light text-brand rounded-full flex items-center justify-center mx-auto mb-4">
                <LinkIcon size={40} />
              </div>
              <h3 className="text-xl font-bold">Ủng hộ website</h3>
              <p className="text-text-secondary">
                Vui lòng nhấn vào liên kết bên dưới để ủng hộ chúng tôi và tiếp tục đọc chương này. Cảm ơn bạn!
              </p>
              <button 
                onClick={handleAdClick}
                className="w-full h-12 misa-btn-primary font-bold flex items-center justify-center gap-2"
              >
                Truy cập liên kết <ExternalLink size={18} />
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
