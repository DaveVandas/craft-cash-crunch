
CREATE TABLE public.academy_lessons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_number integer NOT NULL,
  level text NOT NULL DEFAULT 'Beginner',
  title text NOT NULL,
  subtitle text NOT NULL,
  emoji text NOT NULL DEFAULT '📚',
  intro text NOT NULL,
  content text NOT NULL,
  key_points jsonb NOT NULL DEFAULT '[]'::jsonb,
  case_study_title text,
  case_study_text text,
  tags jsonb NOT NULL DEFAULT '[]'::jsonb,
  is_published boolean NOT NULL DEFAULT true,
  published_at timestamp with time zone NOT NULL DEFAULT now(),
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Public read access (lessons are educational content)
ALTER TABLE public.academy_lessons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published lessons"
  ON public.academy_lessons FOR SELECT
  USING (is_published = true);

CREATE POLICY "Service role can manage lessons"
  ON public.academy_lessons FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- Index for ordering
CREATE INDEX idx_academy_lessons_published_at ON public.academy_lessons(published_at DESC);
CREATE INDEX idx_academy_lessons_lesson_number ON public.academy_lessons(lesson_number);
