import React, { useState, useEffect } from 'react';
import { Search as SearchIcon, BookOpen, Clock } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Story } from '../types';
import { Link } from 'react-router-dom';

export const Search: React.FC = () => {
  const [term, setTerm] = useState('');
  const [results, setResults] = useState<Story[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (term.trim()) handleSearch();
      else setResults([]);
    }, 500);
    return () => clearTimeout(delayDebounce);
  }, [term]);

  const handleSearch = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('stories')
      .select('*')
      .ilike('title', `%${term}%`)
      .limit(10);
    setResults(data || []);
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="relative">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-text-hint" size={20} />
        <input 
          type="text" 
          autoFocus
          placeholder="Tìm truyện, tác giả..." 
          className="misa-input w-full h-12 pl-10 text-[16px]"
          value={term}
          onChange={e => setTerm(e.target.value)}
        />
      </div>

      <div className="space-y-4">
        <h2 className="text-[15px] font-bold text-text-secondary flex items-center gap-2">
          {term ? 'Kết quả tìm kiếm' : 'Tìm kiếm phổ biến'}
        </h2>
        
        {loading ? (
          <div className="p-10 text-center text-text-hint">Đang tìm kiếm...</div>
        ) : results.length > 0 ? (
          <div className="grid grid-cols-1 gap-3">
            {results.map(story => (
              <Link key={story.id} to={`/story/${story.id}`} className="misa-card p-3 flex gap-4">
                <div className="w-16 h-20 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                  {story.cover_url && <img src={story.cover_url} className="w-full h-full object-cover" alt={story.title} referrerPolicy="no-referrer" />}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold truncate">{story.title}</h3>
                  <p className="text-[12px] text-text-hint mt-1">{story.category}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-[11px] flex items-center gap-1"><BookOpen size={12} /> {story.views}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="p-10 text-center text-text-hint">
            {term ? 'Không tìm thấy kết quả phù hợp.' : 'Hãy nhập từ khóa để bắt đầu tìm kiếm.'}
          </div>
        )}
      </div>
    </div>
  );
};
