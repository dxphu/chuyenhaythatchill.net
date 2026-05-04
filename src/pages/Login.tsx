import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Mail, Lock, LogIn, Github, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
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
          <p className="text-text-secondary">Vui lòng nhập thông tin tài khoản của bạn để truy cập.</p>
        </div>

        {error && (
          <div className="p-3 bg-danger/10 border border-danger/20 text-danger text-[13px] rounded-misa">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <label className="text-[13px] font-semibold text-text-secondary">Email</label>
            <div className="relative group">
               <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-text-hint group-focus-within:text-brand transition-colors" size={16} />
               <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="misa-input w-full pl-10 h-11"
                  required
               />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
               <label className="text-[13px] font-semibold text-text-secondary">Mật khẩu</label>
               <button type="button" className="text-[12px] text-link hover:underline">Quên mật khẩu?</button>
            </div>
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

          <div className="flex items-center gap-2">
             <input type="checkbox" id="remember" className="w-4 h-4 rounded border-border-neutral text-brand outline-none" />
             <label htmlFor="remember" className="text-[13px] text-text-secondary cursor-pointer">Tự động đăng nhập</label>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="misa-btn-primary w-full h-11 text-base relative overflow-hidden group"
          >
             {loading ? 'Đang xác thực...' : 'Đăng nhập'}
             {!loading && <ArrowRight className="absolute right-4 transform translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all" size={20} />}
          </button>
        </form>

        <div className="relative py-4">
           <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border-neutral-light"></div></div>
           <div className="relative flex justify-center text-[12px] uppercase"><span className="bg-white px-2 text-text-hint">Hoặc đăng nhập với</span></div>
        </div>

        <div className="grid grid-cols-2 gap-4">
           <button className="misa-btn-secondary h-11 font-semibold flex items-center justify-center gap-2">
              <Github size={18} /> Github
           </button>
           <button className="misa-btn-secondary h-11 font-semibold flex items-center justify-center gap-2">
              <svg size={18} viewBox="0 0 24 24" className="w-4.5 h-4.5"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg> Google
           </button>
        </div>

        <p className="text-center text-[13px] text-text-secondary">
          Chưa có tài khoản? <button className="text-brand font-bold hover:underline">Đăng ký ngay</button>
        </p>
      </div>
    </div>
  );
};
