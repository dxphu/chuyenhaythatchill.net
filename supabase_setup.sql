-- 1. Bảng Thông tin người dùng (Profiles)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'reader' CHECK (role IN ('reader', 'writer', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. Bảng Truyện (Stories)
CREATE TABLE IF NOT EXISTS stories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  author_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  cover_url TEXT,
  category TEXT,
  status TEXT DEFAULT 'ongoing' CHECK (status IN ('ongoing', 'completed')),
  views INTEGER DEFAULT 0,
  rating DECIMAL(3,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. Bảng Chương truyện (Chapters)
CREATE TABLE IF NOT EXISTS chapters (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  story_id UUID REFERENCES stories(id) ON DELETE CASCADE NOT NULL,
  chapter_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  views INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(story_id, chapter_number)
);

-- 4. Bảng Bình luận và Đánh giá (Comments)
CREATE TABLE IF NOT EXISTS comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  story_id UUID REFERENCES stories(id) ON DELETE CASCADE,
  chapter_id UUID REFERENCES chapters(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 5. RPC Function để tăng lượt xem (Sử dụng CREATE OR REPLACE)
CREATE OR REPLACE FUNCTION increment_views(story_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE stories
  SET views = views + 1
  WHERE id = story_id;
END;
$$ LANGUAGE plpgsql;

-- 6. Trigger tự động tạo profile khi có user mới đăng ký (Hỗ trợ login)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name', 'reader');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Xóa trigger cũ nếu có để tránh lỗi
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 8. HƯỚNG DẪN TẠO TÀI KHOẢN ADMIN (Chạy lệnh này để tạo user đăng nhập)
-- Lưu ý: Supabase quản lý mật khẩu trong bảng auth.users, không lưu ở bảng profiles.
-- Bạn có thể chạy lệnh dưới đây để tạo 1 user Admin mẫu:

/*
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, role, confirmation_token, email_change, email_change_token_new, recovery_token)
VALUES (
  gen_random_uuid(),
  'admin@example.com',
  crypt('matkhau123', gen_salt('bf')), -- Mật khẩu là 'matkhau123'
  now(),
  '{"provider":"email","providers":["email"]}',
  '{"full_name":"Admin Hệ Thống"}',
  now(),
  now(),
  'authenticated',
  '',
  '',
  '',
  ''
);

-- Sau khi chạy lệnh trên, Trigger public.handle_new_user sẽ tự tạo profile.
-- Bạn cần vào bảng public.profiles để đổi role từ 'reader' thành 'writer' (hoặc 'admin') cho user này.
UPDATE public.profiles SET role = 'writer' WHERE email = 'admin@example.com';
*/

-- 9. Thiết lập Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Xóa các policy cũ để tránh lỗi "already exists" khi chạy lại
DO $$
BEGIN
  -- Profiles
  DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
  DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
  
  -- Stories
  DROP POLICY IF EXISTS "Stories are viewable by everyone" ON stories;
  DROP POLICY IF EXISTS "Writers can insert own stories" ON stories;
  DROP POLICY IF EXISTS "Authors can update own stories" ON stories;
  
  -- Chapters
  DROP POLICY IF EXISTS "Chapters are viewable by everyone" ON chapters;
  DROP POLICY IF EXISTS "Authors can manage chapters" ON chapters;
  
  -- Comments
  DROP POLICY IF EXISTS "Comments are viewable by everyone" ON comments;
  DROP POLICY IF EXISTS "Signed in users can comment" ON comments;
END $$;

-- Tạo lại các Policies
CREATE POLICY "Public profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Stories are viewable by everyone" ON stories FOR SELECT USING (true);
CREATE POLICY "Writers can insert own stories" ON stories FOR INSERT WITH CHECK (
  auth.uid() = author_id AND (SELECT role FROM profiles WHERE id = auth.uid()) = 'writer'
);
CREATE POLICY "Authors can update own stories" ON stories FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "Chapters are viewable by everyone" ON chapters FOR SELECT USING (true);
CREATE POLICY "Authors can manage chapters" ON chapters FOR ALL USING (
  EXISTS (SELECT 1 FROM stories WHERE id = story_id AND author_id = auth.uid())
);

CREATE POLICY "Comments are viewable by everyone" ON comments FOR SELECT USING (true);
-- Cho phép mọi người đều có thể comment (vì bạn yêu cầu người đọc không cần login)
-- Hoặc nếu chỉ muốn người đã login: auth.uid() = user_id
CREATE POLICY "Anonymous can comment" ON comments FOR INSERT WITH CHECK (true);