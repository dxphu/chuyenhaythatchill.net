import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Story } from '../types';
import { BookOpen, Star, Eye, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';

export const Home: React.FC = () => {
  const [featuredStories, setFeaturedStories] = useState<Story[]>([]);
  const [newStories, setNewStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories = async () => {
    setLoading(true);
    // Mock data for demo if database is empty/not setup
    const { data: storiesData, error } = await supabase
      .from('stories')
      .select('*')
      .limit(10);

    if (error || !storiesData || storiesData.length === 0) {
      // Mock data for display
      const mockStories: Story[] = Array.from({ length: 6 }).map((_, i) => ({
        id: `story-${i}`,
        title: [
          'Một Khuôn Mặt, Một Kiếp Tai Ương',
          'Anh Muốn Tự Do, Tôi Trả Cho Anh Cái Giá Đắt Nhất',
          'Bắc Cực Tình Không Bao Giờ Tắt',
          'Chữa Lành Sau Những Ngày Bị Bỏ Quên',
          'Cô Nhi Mà Anh Xem Thường, Là Người Anh Không Xứng Với Tới',
          'Ba Mươi Triệu Và Một Người Đáng Giá'
        ][i],
        author_id: 'auth-1',
        author_name: 'Minh Tuấn',
        description: 'Mô tả nội dung truyện cực kỳ hấp dẫn và lôi cuốn người đọc ngay từ những chương đầu tiên...',
        cover_url: [
          'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=800&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=800&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1474932430478-3a7fb9065ba0?q=80&w=800&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=800&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1589998059171-988d887df646?q=80&w=800&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1516979187457-637abb4f9353?q=80&w=800&auto=format&fit=crop'
        ][i],
        views: 1200 + i * 500,
        rating: 4.5 + (i % 5) * 0.1,
        status: i % 2 === 0 ? 'ongoing' : 'completed',
        category: i % 2 === 0 ? 'Cổ trang' : 'Hiện đại',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }));
      setFeaturedStories(mockStories.slice(0, 3));
      setNewStories(mockStories);
    } else {
      setFeaturedStories(storiesData.slice(0, 3));
      setNewStories(storiesData);
    }
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
    <div className="space-y-10">
      {/* Hero Section / Banner */}
      <section className="relative h-[300px] md:h-[400px] rounded-misa-lg overflow-hidden bg-gradient-to-r from-brand to-[#0a6b44]">
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative h-full flex items-center px-10">
          <div className="max-w-lg space-y-4">
            <span className="inline-block px-3 py-1 bg-brand-light text-brand text-[12px] font-bold rounded-misa">NỔI BẬT NHẤT</span>
            <h1 className="text-4xl font-bold text-white leading-tight">
              {featuredStories[0]?.title}
            </h1>
            <p className="text-white/80 line-clamp-2">
              {featuredStories[0]?.description}
            </p>
            <Link to={`/story/${featuredStories[0]?.id}`} className="misa-btn-primary w-fit h-10 px-6 mt-4">
              Đọc tiếp <ChevronRight size={18} />
            </Link>
          </div>
          
          <div className="hidden lg:block absolute right-20 top-1/2 -translate-y-1/2 w-64 h-96 shadow-2xl rounded-misa overflow-hidden rotate-6 hover:rotate-0 transition-all duration-500">
             <img src={featuredStories[0]?.cover_url} alt="Cover" className="w-full h-full object-cover" />
          </div>
        </div>
      </section>

      {/* Featured Genres Bar */}
      <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
        {['Hiện đại', 'Cổ trang', 'Tiên hiệp', 'Ngôn tình', 'Trinh thám', 'Kinh dị'].map((genre) => (
          <button key={genre} className="whitespace-nowrap px-6 py-2 bg-white rounded-full border border-border-neutral text-text-primary hover:border-brand hover:text-brand transition-all font-medium">
            {genre}
          </button>
        ))}
      </div>

      {/* Recommended Section */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Star className="text-brand fill-brand" size={24} />
            Truyện mới cập nhật
          </h2>
          <Link to="/all" className="text-link hover:underline font-medium flex items-center gap-1">
            Xem tất cả <ChevronRight size={16} />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {newStories.map((story, i) => (
            <motion.div 
              key={story.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Link to={`/story/${story.id}`} className="misa-card flex gap-4 p-3 hover:shadow-lg transition-all group">
                <div className="w-24 h-32 rounded-misa overflow-hidden shrink-0 shadow-sm transition-transform group-hover:scale-105">
                  <img src={story.cover_url} alt={story.title} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 flex flex-col justify-between py-1">
                  <div className="space-y-1">
                    <h3 className="line-clamp-1 group-hover:text-brand transition-colors">{story.title}</h3>
                    <p className="text-[12px] text-text-secondary">Số chương: 5</p>
                    <span className="inline-block px-2 py-0.5 bg-brand-light text-brand text-[11px] rounded-misa">
                      {story.category}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-border-neutral-light">
                    <div className="flex items-center gap-3 text-text-hint text-[12px]">
                      <span className="flex items-center gap-1">
                        <Eye size={14} /> {story.views}
                      </span>
                      <span className="flex items-center gap-1">
                        <Star size={14} className="fill-yellow-400 text-yellow-400" /> {story.rating}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};
