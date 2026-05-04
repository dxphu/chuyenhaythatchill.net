-- 1. Bảng Admin đơn giản (Dành cho người quản trị)
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL, -- Mật khẩu lưu dạng text đơn giản
  full_name TEXT,
  role TEXT DEFAULT 'writer',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Thêm tài khoản admin mẫu: admin / admin123
INSERT INTO admin_users (username, password, full_name) 
VALUES ('admin', 'admin123', 'Quản trị viên')
ON CONFLICT (username) DO NOTHING;

-- 2. Bảng Truyện (Stories)
CREATE TABLE IF NOT EXISTS stories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  author_id UUID REFERENCES admin_users(id) ON DELETE SET NULL,
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

-- 4. Bảng Bình luận (Đơn giản cho người đọc)
CREATE TABLE IF NOT EXISTS comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  author_name TEXT DEFAULT 'Ẩn danh',
  story_id UUID REFERENCES stories(id) ON DELETE CASCADE,
  chapter_id UUID REFERENCES chapters(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 5. RPC Function để tăng lượt xem
CREATE OR REPLACE FUNCTION increment_views(story_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE stories
  SET views = views + 1
  WHERE id = story_id;
END;
$$ LANGUAGE plpgsql;

-- 6. Tắt RLS để đơn giản hóa việc quản lý (Vì bạn yêu cầu không phức tạp)
-- Lưu ý: Trong môi trường thực tế nên bật RLS và cấu hình bảo mật hơn.
ALTER TABLE admin_users DISABLE ROW LEVEL SECURITY;
ALTER TABLE stories DISABLE ROW LEVEL SECURITY;
ALTER TABLE chapters DISABLE ROW LEVEL SECURITY;
ALTER TABLE comments DISABLE ROW LEVEL SECURITY;
