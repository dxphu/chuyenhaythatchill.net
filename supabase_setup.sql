-- 1. Bảng Thông tin người dùng (Profiles)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'reader' CHECK (role IN ('reader', 'writer', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. Bảng Truyện (Stories)
CREATE TABLE stories (
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
CREATE TABLE chapters (
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
CREATE TABLE comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  story_id UUID REFERENCES stories(id) ON DELETE CASCADE,
  chapter_id UUID REFERENCES chapters(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 5. RPC Function để tăng lượt xem (Increment Views)
CREATE OR REPLACE FUNCTION increment_views(story_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE stories
  SET views = views + 1
  WHERE id = story_id;
END;
$$ LANGUAGE plpgsql;

-- 6. Thiết lập Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Policies cho Profiles
CREATE POLICY "Public profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Policies cho Stories
CREATE POLICY "Stories are viewable by everyone" ON stories FOR SELECT USING (true);
CREATE POLICY "Writers can insert own stories" ON stories FOR INSERT WITH CHECK (
  auth.uid() = author_id AND (SELECT role FROM profiles WHERE id = auth.uid()) = 'writer'
);
CREATE POLICY "Authors can update own stories" ON stories FOR UPDATE USING (auth.uid() = author_id);

-- Policies cho Chapters
CREATE POLICY "Chapters are viewable by everyone" ON chapters FOR SELECT USING (true);
CREATE POLICY "Authors can manage chapters" ON chapters FOR ALL USING (
  EXISTS (SELECT 1 FROM stories WHERE id = story_id AND author_id = auth.uid())
);

-- Policies cho Comments
CREATE POLICY "Comments are viewable by everyone" ON comments FOR SELECT USING (true);
CREATE POLICY "Signed in users can comment" ON comments FOR INSERT WITH CHECK (auth.uid() = user_id);
