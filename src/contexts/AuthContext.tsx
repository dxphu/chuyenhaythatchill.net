import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { UserProfile } from '../types';

interface AuthContextType {
  profile: UserProfile | null;
  loading: boolean;
  signIn: (username: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Tự động khôi phục session admin từ localStorage
    const savedAdmin = localStorage.getItem('site_admin_session');
    if (savedAdmin) {
      try {
        setProfile(JSON.parse(savedAdmin));
      } catch (e) {
        localStorage.removeItem('site_admin_session');
      }
    }
    setLoading(false);
  }, []);

  const signIn = async (usernameInput: string, passwordInput: string) => {
    const username = usernameInput.trim();
    const password = passwordInput.trim();

    try {
      console.log('Đang thử đăng nhập với:', username);
      const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .eq('username', username)
        .eq('password', password)
        .single();

      if (error) {
        console.error('Lỗi khi truy vấn Supabase:', error);
        if (error.code === 'PGRST116') {
          return { error: 'Tên đăng nhập hoặc mật khẩu không chính xác (Không tìm thấy record)' };
        }
        return { error: `Lỗi kết nối database: ${error.message}` };
      }

      if (!data) {
        return { error: 'Dữ liệu trả về trống' };
      }

      const adminProfile: UserProfile = {
        id: data.id,
        username: data.username,
        full_name: data.full_name || 'Admin',
        role: data.role as 'writer' | 'admin',
      };

      setProfile(adminProfile);
      localStorage.setItem('site_admin_session', JSON.stringify(adminProfile));
      return { error: null };
    } catch (err: any) {
      console.error('Lỗi hệ thống khi login:', err);
      return { error: 'Lỗi hệ thống: ' + (err.message || 'Không xác định') };
    }
  };

  const signOut = () => {
    setProfile(null);
    localStorage.removeItem('site_admin_session');
  };

  return (
    <AuthContext.Provider value={{ profile, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
