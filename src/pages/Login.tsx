import React, { useState } from 'react';
import { Mail, Lock, LogIn, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { signIn } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const result = await signIn(username, password);

    if (result.error) {
      setError(result.error);
    } else {
      navigate('/');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-[calc(100vh-100px)] flex items-center justify-center px-4">
      <div className="misa-card w-full max-w-md p-8 space-y-8">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-brand-light text-brand rounded-full flex items-center justify-center mx-auto mb-4">
             <LogIn size={32} />
          </div>
          <h1 className="text-2xl font-bold">Chào mừng trở lại</h1>
          <p className="text-text-secondary">Hệ thống dành cho quản trị viên.</p>
        </div>

        {error && (
          <div className="p-3 bg-danger/10 border border-danger/20 text-danger text-[13px] rounded-misa">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <label className="text-[13px] font-semibold text-text-secondary">Tên đăng nhập</label>
            <div className="relative group">
               <User className="absolute left-3 top-1/2 -translate-y-1/2 text-text-hint group-focus-within:text-brand transition-colors" size={16} />
               <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  className="misa-input w-full pl-10 h-11"
                  required
               />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[13px] font-semibold text-text-secondary">Mật khẩu</label>
            <div className="relative group">
               <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-text-hint group-focus-within:text-brand transition-colors" size={16} />
               <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="misa-input w-full pl-10 h-11"
                  required
               />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="misa-btn-primary w-full h-11 text-base group"
          >
             {loading ? 'Đang đăng nhập...' : 'Đăng nhập hệ thống'}
          </button>
        </form>

        <p className="text-center text-[12px] text-text-hint pt-4">
          Nếu bạn chưa có tài khoản, vui lòng liên hệ kỹ thuật viên.
        </p>
      </div>
    </div>
  );
};
