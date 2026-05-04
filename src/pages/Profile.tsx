import React from 'react';
import { User, Settings, LogOut, ShieldCheck, Mail, UserCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export const Profile: React.FC = () => {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();

  if (!profile) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center space-y-4">
        <UserCircle size={64} className="text-text-hint opacity-20" />
        <h2 className="text-xl font-bold">Bạn chưa đăng nhập</h2>
        <p className="text-text-secondary">Vui lòng đăng nhập để quản lý tài khoản.</p>
        <button onClick={() => navigate('/login')} className="misa-btn-primary px-8 h-11">Đăng nhập</button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="misa-card p-6 flex flex-col items-center text-center space-y-4">
        <div className="w-20 h-20 bg-brand-light text-brand rounded-full flex items-center justify-center">
          <User size={40} />
        </div>
        <div>
          <h2 className="text-xl font-bold">{profile.full_name}</h2>
          <p className="text-text-secondary">@{profile.username}</p>
          <div className="mt-2 flex items-center justify-center gap-2">
             <span className="px-2 py-0.5 bg-brand/10 text-brand text-[10px] font-bold rounded uppercase">
                {profile.role}
             </span>
          </div>
        </div>
      </div>

      <div className="misa-card overflow-hidden">
        <div className="divide-y divide-border-neutral-light">
          <button className="w-full p-4 flex items-center justify-between hover:bg-brand-light transition-colors">
            <div className="flex items-center gap-3">
              <Settings size={20} className="text-text-secondary" />
              <span className="font-medium">Cài đặt tài khoản</span>
            </div>
          </button>
          <button className="w-full p-4 flex items-center justify-between hover:bg-brand-light transition-colors">
            <div className="flex items-center gap-3">
              <ShieldCheck size={20} className="text-text-secondary" />
              <span className="font-medium">Bảo mật & Quyền riêng tư</span>
            </div>
          </button>
          <button 
            onClick={() => signOut()}
            className="w-full p-4 flex items-center justify-between hover:bg-danger/5 transition-colors text-danger"
          >
            <div className="flex items-center gap-3">
              <LogOut size={20} />
              <span className="font-medium">Đăng xuất</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
