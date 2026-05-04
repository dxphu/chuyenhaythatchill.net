-- 1. Xóa các bảng cũ nếu có để làm sạch (Cẩn thận: Lệnh này xóa dữ liệu cũ)
-- DROP TABLE IF EXISTS comments;
-- DROP TABLE IF EXISTS chapters;
-- DROP TABLE IF EXISTS stories;
-- DROP TABLE IF EXISTS admin_users;

-- 2. Tạo bảng Admin đơn giản
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL, -- Mật khẩu lưu dạng text đơn giản
  full_name TEXT,
  role TEXT DEFAULT 'writer',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. Tạo tài khoản admin mặc định (Nếu chưa có)
-- Username: admin
-- Password: admin123
INSERT INTO admin_users (username, password, full_name) 
VALUES ('admin', 'admin123', 'Quản trị viên')
ON CONFLICT (username) DO UPDATE SET password = 'admin123';

-- 4. Bảng Truyện (Stories)
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

-- 5. Bảng Chương truyện (Chapters)
CREATE TABLE IF NOT EXISTS chapters (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  story_id UUID REFERENCES stories(id) ON DELETE CASCADE NOT NULL,
  chapter_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  link_url TEXT, -- Thêm trường để gắn link vào bất kỳ chương nào
  views INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(story_id, chapter_number)
);

-- 6. Bảng Bình luận (Comments)
CREATE TABLE IF NOT EXISTS comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  author_name TEXT DEFAULT 'Ẩn danh',
  story_id UUID REFERENCES stories(id) ON DELETE CASCADE,
  chapter_id UUID REFERENCES chapters(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 7. RPC Function để tăng lượt xem
CREATE OR REPLACE FUNCTION increment_views(story_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE stories
  SET views = views + 1
  WHERE id = story_id;
END;
$$ LANGUAGE plpgsql;

-- 8. Tắt RLS để người đọc xem được truyện mà k cần login
ALTER TABLE admin_users DISABLE ROW LEVEL SECURITY;
ALTER TABLE stories DISABLE ROW LEVEL SECURITY;
ALTER TABLE chapters DISABLE ROW LEVEL SECURITY;
ALTER TABLE comments DISABLE ROW LEVEL SECURITY;
