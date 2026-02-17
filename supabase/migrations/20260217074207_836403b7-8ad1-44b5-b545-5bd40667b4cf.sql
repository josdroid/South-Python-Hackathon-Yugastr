
-- Profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL DEFAULT '',
  avatar_url TEXT,
  points INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', ''));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Resources table
CREATE TABLE public.resources (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  subject TEXT NOT NULL,
  semester INTEGER NOT NULL,
  resource_type TEXT NOT NULL CHECK (resource_type IN ('notes', 'question_paper', 'study_material', 'reference_book', 'project_report', 'assignment')),
  file_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  downloads INTEGER NOT NULL DEFAULT 0,
  avg_rating NUMERIC(2,1) NOT NULL DEFAULT 0,
  rating_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Resources are viewable by everyone" ON public.resources FOR SELECT USING (true);
CREATE POLICY "Authenticated users can upload" ON public.resources FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own resources" ON public.resources FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own resources" ON public.resources FOR DELETE USING (auth.uid() = user_id);

-- Ratings table
CREATE TABLE public.ratings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  resource_id UUID NOT NULL REFERENCES public.resources(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, resource_id)
);

ALTER TABLE public.ratings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Ratings viewable by all" ON public.ratings FOR SELECT USING (true);
CREATE POLICY "Auth users can rate" ON public.ratings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own rating" ON public.ratings FOR UPDATE USING (auth.uid() = user_id);

-- Function to update resource avg_rating when a rating is added/updated
CREATE OR REPLACE FUNCTION public.update_resource_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.resources SET 
    avg_rating = (SELECT COALESCE(AVG(rating), 0) FROM public.ratings WHERE resource_id = NEW.resource_id),
    rating_count = (SELECT COUNT(*) FROM public.ratings WHERE resource_id = NEW.resource_id)
  WHERE id = NEW.resource_id;
  
  -- Award points to resource owner
  UPDATE public.profiles SET points = points + 2
  WHERE user_id = (SELECT user_id FROM public.resources WHERE id = NEW.resource_id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_rating_change
  AFTER INSERT OR UPDATE ON public.ratings
  FOR EACH ROW EXECUTE FUNCTION public.update_resource_rating();

-- Award points on resource upload
CREATE OR REPLACE FUNCTION public.award_upload_points()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.profiles SET points = points + 10 WHERE user_id = NEW.user_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_resource_upload
  AFTER INSERT ON public.resources
  FOR EACH ROW EXECUTE FUNCTION public.award_upload_points();

-- Storage bucket for resources
INSERT INTO storage.buckets (id, name, public) VALUES ('resources', 'resources', true);

CREATE POLICY "Anyone can read resources" ON storage.objects FOR SELECT USING (bucket_id = 'resources');
CREATE POLICY "Auth users can upload resources" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'resources' AND auth.role() = 'authenticated');
CREATE POLICY "Users can delete own resources" ON storage.objects FOR DELETE USING (bucket_id = 'resources' AND auth.uid()::text = (storage.foldername(name))[1]);
