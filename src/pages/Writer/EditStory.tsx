import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, ArrowLeft, Image as ImageIcon } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { Story } from '../../types';

export const EditStory: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(!!id);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    cover_url: '',
    category: 'Ngôn tình',
    status: 'ongoing' as 'ongoing' | 'completed'
  });

  useEffect(() => {
    if (id) {
      fetchStory();
    }
  }, [id]);

  const fetchStory = async () => {
    try {
      const { data, error } = await supabase
        .from('stories')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      if (data) {
        setFormData({
          title: data.title,
          description: data.description || '',
          cover_url: data.cover_url || '',
          category: data.category || 'Ngôn tình',
          status: data.status || 'ongoing'
        });
      }
    } catch (err) {
      console.error('Error fetching story:', err);
    } finally {
      setFetching(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    
    setLoading(true);
    try {
      const storyData = {
        ...formData,
        author_id: profile.id,
        updated_at: new Date().toISOString()
      };

      if (id) {
        const { error } = await supabase
          .from('stories')
          .update(storyData)
          .eq('id', id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('stories')
          .insert([{ ...storyData, views: 0, rating: 0 }]);
        if (error) throw error;
      }

      navigate('/writer');
    } catch (err: any) {
      alert('Lỗi: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="p-8 text-center">Đang tải...</div>;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate('/writer')}
          className="p-2 hover:bg-brand-light rounded-full text-text-secondary"
        >
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-2xl font-bold">{id ? 'Chỉnh sửa truyện' : 'Đăng truyện mới'}</h2>
      </div>

      <form onSubmit={handleSubmit} className="misa-card p-6 space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-[13px] font-semibold text-text-secondary">Tiêu đề truyện</label>
            <input 
              type="text" 
              required
              value={formData.title}
              onChange={e => setFormData({...formData, title: e.target.value})}
              placeholder="Nhập tiêu đề truyện..."
              className="misa-input w-full h-11"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[13px] font-semibold text-text-secondary">Thể loại</label>
              <select 
                className="misa-input w-full h-11"
                value={formData.category}
                onChange={e => setFormData({...formData, category: e.target.value})}
              >
                <option>Ngôn tình</option>
                <option>Tiên hiệp</option>
                <option>Kiếm hiệp</option>
                <option>Huyền huyễn</option>
                <option>Trinh thám</option>
                <option>Kinh dị</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[13px] font-semibold text-text-secondary">Trạng thái</label>
              <select 
                className="misa-input w-full h-11"
                value={formData.status}
                onChange={e => setFormData({...formData, status: e.target.value as any})}
              >
                <option value="ongoing">Đang ra</option>
                <option value="completed">Hoàn thành</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[13px] font-semibold text-text-secondary">Link ảnh bìa</label>
            <div className="relative">
              <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-text-hint" size={18} />
              <input 
                type="url" 
                value={formData.cover_url}
                onChange={e => setFormData({...formData, cover_url: e.target.value})}
                placeholder="https://example.com/cover.jpg"
                className="misa-input w-full pl-10 h-11"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[13px] font-semibold text-text-secondary">Mô tả truyện</label>
            <textarea 
              rows={6}
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
              placeholder="Viết tóm tắt nội dung truyện..."
              className="misa-input w-full p-3 min-h-[150px]"
            />
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button 
            type="submit" 
            disabled={loading}
            className="misa-btn-primary h-11 px-8 flex items-center gap-2"
          >
            <Save size={18} />
            {loading ? 'Đang lưu...' : 'Lưu thông tin'}
          </button>
        </div>
      </form>
    </div>
  );
};
