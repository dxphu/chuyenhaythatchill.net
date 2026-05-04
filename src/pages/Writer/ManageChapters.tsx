import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, 
  Plus, 
  Trash2, 
  GripVertical, 
  Layers, 
  Wand2, 
  Link as LinkIcon,
  ChevronDown,
  ChevronUp,
  Save
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Chapter, Story } from '../../types';
import { cn } from '../../lib/utils';

export const ManageChapters: React.FC = () => {
  const { storyId } = useParams<{ storyId: string }>();
  const navigate = useNavigate();
  const [story, setStory] = useState<Story | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAutoSplitting, setIsAutoSplitting] = useState(false);
  const [bulkText, setBulkText] = useState('');
  
  // Chapter Editor State
  const [editingChapterId, setEditingChapterId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    title: '',
    content: '',
    link_url: '',
    chapter_number: 1
  });

  useEffect(() => {
    if (storyId) {
      fetchStoryAndChapters();
    }
  }, [storyId]);

  const fetchStoryAndChapters = async () => {
    try {
      const [storyRes, chaptersRes] = await Promise.all([
        supabase.from('stories').select('*').eq('id', storyId).single(),
        supabase.from('chapters').select('*').eq('story_id', storyId).order('chapter_number', { ascending: true })
      ]);

      if (storyRes.data) setStory(storyRes.data);
      if (chaptersRes.data) setChapters(chaptersRes.data);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAutoSplit = () => {
    if (!bulkText.trim()) return;

    // Pattern to look for: "Chương X: Tên Chương" or just "Chương X"
    // Supports: Chương, Hồi, Tiết, Quyển, Tập
    const splitPattern = /(?:^|\n)(?:Chương|Hồi|Tiết|Quyển|Tập)\s+(\d+)(?::\s*([^\n]+))?/gi;
    
    const parts = bulkText.split(splitPattern);
    const newChapters: any[] = [];
    
    // The regex split with groups returns [textBefore, number, title, textAfter, number, title, ...]
    // Index 0 is the prologue (if any)
    let prologue = parts[0].trim();
    if (prologue) {
      newChapters.push({
        chapter_number: 0,
        title: 'Lời ngỏ / Văn án',
        content: prologue
      });
    }

    for (let i = 1; i < parts.length; i += 3) {
      const number = parseInt(parts[i]);
      const title = parts[i + 1]?.trim() || `Chương ${number}`;
      const content = parts[i + 2]?.trim() || '';
      
      newChapters.push({
        chapter_number: number,
        title: title,
        content: content
      });
    }

    if (newChapters.length === 0) {
      alert('Không tìm thấy dấu hiệu chia chương (ví dụ: "Chương 1").');
      return;
    }

    // Confirm before saving
    if (confirm(`Tìm thấy ${newChapters.length} chương. Bạn có muốn lưu tất cả vào database không?`)) {
      saveBulkChapters(newChapters);
    }
  };

  const saveBulkChapters = async (newChunks: any[]) => {
    setLoading(true);
    try {
      const chaptersToInsert = newChunks.map(c => ({
        story_id: storyId,
        chapter_number: c.chapter_number,
        title: c.title,
        content: c.content
      }));

      const { error } = await supabase
        .from('chapters')
        .insert(chaptersToInsert);

      if (error) throw error;
      
      setBulkText('');
      setIsAutoSplitting(false);
      fetchStoryAndChapters();
    } catch (err: any) {
      alert('Lỗi khi lưu chương: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteChapter = async (id: string) => {
    if (!confirm('Bạn có chắc muốn xóa chương này?')) return;
    try {
      const { error } = await supabase.from('chapters').delete().eq('id', id);
      if (error) throw error;
      setChapters(chapters.filter(c => c.id !== id));
    } catch (err: any) {
      alert(err.message);
    }
  };

  const openEdit = (chapter: Chapter) => {
    setEditingChapterId(chapter.id);
    setEditForm({
      title: chapter.title,
      content: chapter.content,
      link_url: chapter.link_url || '',
      chapter_number: chapter.chapter_number
    });
  };

  const handleUpdate = async () => {
    try {
      const { error } = await supabase
        .from('chapters')
        .update({
          title: editForm.title,
          content: editForm.content,
          link_url: editForm.link_url || null,
          chapter_number: editForm.chapter_number
        })
        .eq('id', editingChapterId);

      if (error) throw error;
      setEditingChapterId(null);
      fetchStoryAndChapters();
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (loading) return <div className="p-8 text-center">Đang tải dữ liệu...</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/writer')}
            className="p-2 hover:bg-brand-light rounded-full text-text-secondary"
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <h2 className="text-2xl font-bold">Quản lý chương</h2>
            <p className="text-text-secondary">Truyện: <span className="font-bold text-brand">{story?.title}</span></p>
          </div>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setIsAutoSplitting(!isAutoSplitting)}
            className="misa-btn-secondary h-10 px-4 flex items-center gap-2"
          >
            <Wand2 size={18} />
            {isAutoSplitting ? 'Hủy bỏ' : 'Tự động chia chương'}
          </button>
          <button 
            onClick={() => setEditingChapterId('new')}
            className="misa-btn-primary h-10 px-4 flex items-center gap-2"
          >
            <Plus size={18} />
            Thêm chương mới
          </button>
        </div>
      </div>

      {isAutoSplitting && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="misa-card p-6 border-brand/30 bg-brand-light/20 space-y-4"
        >
          <div className="space-y-1">
            <h3 className="font-bold flex items-center gap-2">
              <Layers className="text-brand" size={18} />
              Trình tự động chia chương
            </h3>
            <p className="text-[12px] text-text-secondary">Dán nội dung ròng của bạn vào đây. Hệ thống sẽ tự tìm các tiêu đề như "Chương 1", "Hồi 2"... để tạo chương.</p>
          </div>
          <textarea 
            className="misa-input w-full p-4 min-h-[300px] text-[13px] font-serif"
            placeholder="Dán toàn bộ nội dung truyện tại đây..."
            value={bulkText}
            onChange={(e) => setBulkText(e.target.value)}
          />
          <div className="flex justify-end gap-3">
            <button 
              onClick={handleAutoSplit}
              className="misa-btn-primary h-10 px-6"
              disabled={!bulkText.trim()}
            >
              Phân tích và Lưu tất cả
            </button>
          </div>
        </motion.div>
      )}

      {editingChapterId && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-misa shadow-2xl flex flex-col"
          >
            <div className="p-4 border-b flex items-center justify-between bg-background-app">
              <h3 className="font-bold underline">
                {editingChapterId === 'new' ? 'Thêm chương mới' : `Sửa chương ${editForm.chapter_number}`}
              </h3>
              <button onClick={() => setEditingChapterId(null)} className="p-2 hover:bg-gray-100 rounded-full">×</button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <div className="grid grid-cols-4 gap-4">
                <div className="space-y-1">
                  <label className="text-[12px] font-bold text-text-secondary">Thứ tự</label>
                  <input 
                    type="number"
                    className="misa-input w-full"
                    value={editForm.chapter_number}
                    onChange={e => setEditForm({...editForm, chapter_number: parseInt(e.target.value)})}
                  />
                </div>
                <div className="col-span-3 space-y-1">
                  <label className="text-[12px] font-bold text-text-secondary">Tiêu đề chương</label>
                  <input 
                    type="text"
                    className="misa-input w-full"
                    value={editForm.title}
                    onChange={e => setEditForm({...editForm, title: e.target.value})}
                    placeholder="VD: Khởi đầu mới"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[12px] font-bold text-text-secondary flex items-center gap-1">
                  <LinkIcon size={14} /> Gắn link quảng cáo / tài trợ (Không bắt buộc)
                </label>
                <input 
                  type="url"
                  className="misa-input w-full"
                  value={editForm.link_url}
                  onChange={e => setEditForm({...editForm, link_url: e.target.value})}
                  placeholder="https://example.com/ads-link"
                />
              </div>

              <div className="space-y-1 flex-1">
                <label className="text-[12px] font-bold text-text-secondary">Nội dung chương</label>
                <textarea 
                  className="misa-input w-full p-4 min-h-[400px] font-serif leading-relaxed"
                  value={editForm.content}
                  onChange={e => setEditForm({...editForm, content: e.target.value})}
                  placeholder="Nhập nội dung chương..."
                />
              </div>
            </div>

            <div className="p-4 border-t bg-background-app flex justify-end gap-3">
              <button 
                onClick={() => setEditingChapterId(null)}
                className="misa-btn-secondary px-6"
              >Hủy</button>
              <button 
                onClick={editingChapterId === 'new' ? saveBulkChapters([editForm]) : handleUpdate}
                className="misa-btn-primary px-8 flex items-center gap-2"
              >
                <Save size={18} /> Lưu chương
              </button>
            </div>
          </motion.div>
        </div>
      )}

      <div className="misa-card overflow-hidden">
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#FAFAFA] border-b">
              <tr>
                <th className="px-6 py-3 font-semibold text-[13px] text-text-secondary">STT</th>
                <th className="px-6 py-3 font-semibold text-[13px] text-text-secondary">Tiêu đề chương</th>
                <th className="px-6 py-3 font-semibold text-[13px] text-text-secondary">Gắn Link</th>
                <th className="px-6 py-3 font-semibold text-[13px] text-text-secondary text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {chapters.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-20 text-center text-text-hint">
                    <Layers size={48} className="mx-auto mb-4 opacity-20" />
                    Chưa có chương nào. Hãy sử dụng bộ chia chương tự động.
                  </td>
                </tr>
              ) : (
                chapters.map((chapter) => (
                  <tr key={chapter.id} className="hover:bg-brand-light/30 group">
                    <td className="px-6 py-4 font-mono text-brand font-bold">{chapter.chapter_number}</td>
                    <td className="px-6 py-4">
                      <p className="font-medium">{chapter.title}</p>
                      <p className="text-[11px] text-text-hint">{chapter.content.length.toLocaleString()} ký tự</p>
                    </td>
                    <td className="px-6 py-4">
                      {chapter.link_url ? (
                        <span className="text-[11px] bg-success/10 text-success px-2 py-1 rounded-full flex items-center w-fit gap-1">
                          <LinkIcon size={10} /> Đã gắn
                        </span>
                      ) : (
                        <span className="text-[11px] bg-gray-100 text-gray-400 px-2 py-1 rounded-full flex items-center w-fit gap-1">
                          Trống
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => openEdit(chapter)}
                          className="p-2 hover:bg-white border border-transparent hover:border-border-neutral rounded-misa text-text-secondary"
                        >
                          Sửa
                        </button>
                        <button 
                          onClick={() => handleDeleteChapter(chapter.id)}
                          className="p-2 hover:bg-danger/10 text-danger rounded-misa"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile View */}
        <div className="md:hidden divide-y">
           {chapters.length === 0 ? (
             <div className="px-6 py-20 text-center text-text-hint">
               <Layers size={48} className="mx-auto mb-4 opacity-20" />
               Chưa có chương nào.
             </div>
           ) : (
             chapters.map((chapter) => (
               <div key={chapter.id} className="p-4 flex items-center justify-between gap-4">
                 <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-brand-light text-brand font-bold flex items-center justify-center text-[13px]">
                       {chapter.chapter_number}
                    </div>
                    <div>
                       <p className="font-medium text-[14px] line-clamp-1">{chapter.title}</p>
                       <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] text-text-hint">{chapter.content.length.toLocaleString()} ký tự</span>
                          {chapter.link_url && (
                             <span className="text-[10px] text-success flex items-center gap-0.5">
                                <LinkIcon size={10} /> Link
                             </span>
                          )}
                       </div>
                    </div>
                 </div>
                 <div className="flex items-center gap-1">
                    <button 
                      onClick={() => openEdit(chapter)}
                      className="p-2 text-text-secondary"
                    >
                      Sửa
                    </button>
                    <button 
                      onClick={() => handleDeleteChapter(chapter.id)}
                      className="p-2 text-danger"
                    >
                      <Trash2 size={18} />
                    </button>
                 </div>
               </div>
             ))
           )}
        </div>
      </div>
    </div>
  );
};
