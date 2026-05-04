import React from 'react';
import { BookMarked, History, Star } from 'lucide-react';

export const Library: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-around bg-white p-4 rounded-misa shadow-sm">
        <button className="flex flex-col items-center gap-1 p-2 text-brand">
          <BookMarked size={22} />
          <span className="text-[11px] font-bold">Theo dõi</span>
        </button>
        <button className="flex flex-col items-center gap-1 p-2 text-text-secondary">
          <History size={22} />
          <span className="text-[11px] font-bold">Lịch sử</span>
        </button>
        <button className="flex flex-col items-center gap-1 p-2 text-text-secondary">
          <Star size={22} />
          <span className="text-[11px] font-bold">Yêu thích</span>
        </button>
      </div>

      <div className="flex flex-col items-center justify-center p-20 text-center space-y-4">
        <BookMarked size={64} className="text-text-hint opacity-10" />
        <h3 className="text-text-secondary font-medium">Thư viện trống</h3>
        <p className="text-[13px] text-text-hint max-w-[200px]">Hãy thêm những bộ truyện yêu thích vào đây để xem lại sau.</p>
      </div>
    </div>
  );
};
