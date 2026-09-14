-- ============ NEWS AUTOMATION ENUMS ============
CREATE TYPE public.news_source_type AS ENUM ('rss', 'api', 'institutional', 'html');
CREATE TYPE public.news_coverage_scope AS ENUM ('piemonte', 'italia', 'provincia', 'comune');
CREATE TYPE public.news_candidate_status AS ENUM ('pending', 'scored', 'selected', 'rejected', 'duplicate');
CREATE TYPE public.news_article_status AS ENUM ('draft', 'review', 'scheduled', 'published', 'rejected');
CREATE TYPE public.news_verification_status AS ENUM ('pending', 'verified', 'unverifiable', 'disputed');

-- ============ CATEGORIES ============
CREATE TABLE public.news_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  label text NOT NULL,
  description text,
  sort_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.news_categories TO anon, authenticated;
GRANT ALL ON public.news_categories TO service_role;
ALTER TABLE public.news_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "news_categories_public_read" ON public.news_categories FOR SELECT TO anon, authenticated USING (is_active = true);
CREATE POLICY "news_categories_admin_write" ON public.news_categories FOR ALL TO authenticated USING (private.is_admin()) WITH CHECK (private.is_admin());

-- ============ SOURCES ============
CREATE TABLE public.news_sources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  domain text NOT NULL,
  feed_url text,
  endpoint_url text,
  source_type public.news_source_type NOT NULL DEFAULT 'rss',
  coverage_scope public.news_coverage_scope NOT NULL DEFAULT 'piemonte',
  province text,
  city text,
  reliability_score integer NOT NULL DEFAULT 3 CHECK (reliability_score BETWEEN 1 AND 5),
  allows_scraping boolean NOT NULL DEFAULT false,
  allows_image_reuse boolean NOT NULL DEFAULT false,
  is_active boolean NOT NULL DEFAULT true,
  last_checked_at timestamptz,
  last_error text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.news_sources TO anon, authenticated;
GRANT ALL ON public.news_sources TO service_role;
ALTER TABLE public.news_sources ENABLE ROW LEVEL SECURITY;
CREATE POLICY "news_sources_public_read" ON public.news_sources FOR SELECT TO anon, authenticated USING (is_active = true);
CREATE POLICY "news_sources_admin_write" ON public.news_sources FOR ALL TO authenticated USING (private.is_admin()) WITH CHECK (private.is_admin());
CREATE TRIGGER news_sources_updated_at BEFORE UPDATE ON public.news_sources FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============ CANDIDATES ============
CREATE TABLE public.news_candidates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title_original text NOT NULL,
  excerpt_original text,
  canonical_url text NOT NULL,
  source_id uuid REFERENCES public.news_sources(id) ON DELETE SET NULL,
  source_name text,
  source_author text,
  source_published_at timestamptz,
  collected_at timestamptz NOT NULL DEFAULT now(),
  content_hash text NOT NULL UNIQUE,
  url_hash text NOT NULL,
  geographic_scope public.news_coverage_scope,
  province text,
  category_slug text REFERENCES public.news_categories(slug) ON DELETE SET NULL,
  relevance_score integer CHECK (relevance_score BETWEEN 0 AND 100),
  credibility_score integer CHECK (credibility_score BETWEEN 0 AND 100),
  duplicate_group_id uuid,
  processing_status public.news_candidate_status NOT NULL DEFAULT 'pending',
  rejection_reason text,
  raw_metadata jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.news_candidates TO authenticated;
GRANT ALL ON public.news_candidates TO service_role;
ALTER TABLE public.news_candidates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "news_candidates_admin_read" ON public.news_candidates FOR SELECT TO authenticated USING (private.is_admin());
CREATE POLICY "news_candidates_admin_write" ON public.news_candidates FOR ALL TO authenticated USING (private.is_admin()) WITH CHECK (private.is_admin());
CREATE TRIGGER news_candidates_updated_at BEFORE UPDATE ON public.news_candidates FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE INDEX idx_news_candidates_status ON public.news_candidates(processing_status);
CREATE INDEX idx_news_candidates_collected_at ON public.news_candidates(collected_at DESC);
CREATE INDEX idx_news_candidates_duplicate_group ON public.news_candidates(duplicate_group_id);
CREATE INDEX idx_news_candidates_url_hash ON public.news_candidates(url_hash);

-- ============ ARTICLES ============
CREATE TABLE public.news_articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  subtitle text,
  summary text,
  body text NOT NULL DEFAULT '',
  category_slug text REFERENCES public.news_categories(slug) ON DELETE SET NULL,
  geographic_scope public.news_coverage_scope,
  province text,
  relevance_score integer CHECK (relevance_score BETWEEN 0 AND 100),
  credibility_score integer CHECK (credibility_score BETWEEN 0 AND 100),
  cover_image_url text,
  cover_image_alt text,
  status public.news_article_status NOT NULL DEFAULT 'draft',
  published_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  generated_by_ai boolean NOT NULL DEFAULT true,
  verification_status public.news_verification_status NOT NULL DEFAULT 'pending',
  seo_title text,
  seo_description text,
  focus_keywords text[] NOT NULL DEFAULT '{}',
  structured_data jsonb NOT NULL DEFAULT '{}',
  reviewed_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  review_notes text
);
GRANT SELECT ON public.news_articles TO anon, authenticated;
GRANT ALL ON public.news_articles TO service_role;
ALTER TABLE public.news_articles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "news_articles_public_read" ON public.news_articles FOR SELECT TO anon, authenticated USING (status = 'published');
CREATE POLICY "news_articles_admin_all" ON public.news_articles FOR ALL TO authenticated USING (private.is_admin()) WITH CHECK (private.is_admin());
CREATE TRIGGER news_articles_updated_at BEFORE UPDATE ON public.news_articles FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE INDEX idx_news_articles_status ON public.news_articles(status);
CREATE INDEX idx_news_articles_published_at ON public.news_articles(published_at DESC);
CREATE INDEX idx_news_articles_category ON public.news_articles(category_slug);
CREATE INDEX idx_news_articles_scope ON public.news_articles(geographic_scope);

-- ============ ARTICLE SOURCES ============
CREATE TABLE public.news_article_sources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id uuid NOT NULL REFERENCES public.news_articles(id) ON DELETE CASCADE,
  candidate_id uuid REFERENCES public.news_candidates(id) ON DELETE SET NULL,
  source_id uuid REFERENCES public.news_sources(id) ON DELETE SET NULL,
  source_name text NOT NULL,
  original_title text,
  original_url text NOT NULL,
  published_at timestamptz,
  author text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.news_article_sources TO anon, authenticated;
GRANT ALL ON public.news_article_sources TO service_role;
ALTER TABLE public.news_article_sources ENABLE ROW LEVEL SECURITY;
CREATE POLICY "news_article_sources_public_read" ON public.news_article_sources FOR SELECT TO anon, authenticated USING (
  EXISTS (SELECT 1 FROM public.news_articles WHERE id = news_article_sources.article_id AND status = 'published')
);
CREATE POLICY "news_article_sources_admin_all" ON public.news_article_sources FOR ALL TO authenticated USING (private.is_admin()) WITH CHECK (private.is_admin());
CREATE INDEX idx_news_article_sources_article ON public.news_article_sources(article_id);

-- ============ AUTOMATION RUNS ============
CREATE TABLE public.news_automation_runs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  started_at timestamptz NOT NULL DEFAULT now(),
  finished_at timestamptz,
  status text NOT NULL DEFAULT 'running',
  sources_checked integer NOT NULL DEFAULT 0,
  candidates_collected integer NOT NULL DEFAULT 0,
  duplicates_found integer NOT NULL DEFAULT 0,
  articles_generated integer NOT NULL DEFAULT 0,
  articles_published integer NOT NULL DEFAULT 0,
  articles_review integer NOT NULL DEFAULT 0,
  articles_rejected integer NOT NULL DEFAULT 0,
  errors jsonb NOT NULL DEFAULT '[]',
  logs jsonb NOT NULL DEFAULT '[]',
  triggered_by text NOT NULL DEFAULT 'cron',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.news_automation_runs TO authenticated;
GRANT ALL ON public.news_automation_runs TO service_role;
ALTER TABLE public.news_automation_runs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "news_automation_runs_admin_read" ON public.news_automation_runs FOR SELECT TO authenticated USING (private.is_admin());
CREATE POLICY "news_automation_runs_admin_write" ON public.news_automation_runs FOR ALL TO authenticated USING (private.is_admin()) WITH CHECK (private.is_admin());
CREATE INDEX idx_news_automation_runs_started ON public.news_automation_runs(started_at DESC);

-- ============ SETTINGS ============
CREATE TABLE public.news_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  automation_enabled boolean NOT NULL DEFAULT false,
  manual_review_mode boolean NOT NULL DEFAULT true,
  emergency_stop boolean NOT NULL DEFAULT false,
  cron_schedule text NOT NULL DEFAULT '0 7 * * *',
  cron_timezone text NOT NULL DEFAULT 'Europe/Rome',
  max_piemonte_articles integer NOT NULL DEFAULT 6,
  max_italia_articles integer NOT NULL DEFAULT 4,
  min_relevance_score integer NOT NULL DEFAULT 65,
  min_credibility_score integer NOT NULL DEFAULT 75,
  review_period_days integer NOT NULL DEFAULT 7,
  review_period_started_at timestamptz,
  last_run_at timestamptz,
  next_run_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.news_settings TO authenticated;
GRANT ALL ON public.news_settings TO service_role;
ALTER TABLE public.news_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "news_settings_public_read" ON public.news_settings FOR SELECT TO authenticated USING (true);
CREATE POLICY "news_settings_admin_write" ON public.news_settings FOR ALL TO authenticated USING (private.is_admin()) WITH CHECK (private.is_admin());
CREATE TRIGGER news_settings_updated_at BEFORE UPDATE ON public.news_settings FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============ INITIAL DATA ============
INSERT INTO public.news_categories (slug, label, description, sort_order) VALUES
  ('territorio', 'Territorio', 'Notizie sul territorio piemontese e locale', 10),
  ('cronaca', 'Cronaca', 'Fatti di cronaca', 20),
  ('politica', 'Politica e amministrazione', 'Politica, istituzioni e amministrazione', 30),
  ('economia', 'Economia e imprese', 'Economia, imprese e lavoro', 40),
  ('cultura', 'Cultura', 'Cultura, musica, teatro e arte', 50),
  ('eventi', 'Eventi', 'Eventi, sagre e manifestazioni', 60),
  ('turismo', 'Turismo e territorio', 'Turismo, borghi e attrazioni', 70),
  ('ambiente', 'Ambiente', 'Ambiente, clima e sostenibilità', 80),
  ('viabilita', 'Viabilità e trasporti', 'Viabilità e trasporti', 90),
  ('sport', 'Sport', 'Sport locale e nazionale', 100),
  ('innovazione', 'Innovazione', 'Innovazione, tecnologia e ricerca', 110),
  ('sanita', 'Sanità', 'Sanità e servizi sanitari', 120),
  ('nazionale', 'Principali notizie nazionali', 'Notizie nazionali italiane', 130)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.news_sources (name, domain, feed_url, source_type, coverage_scope, reliability_score, allows_image_reuse) VALUES
  ('ANSA Piemonte', 'ansa.it', 'https://www.ansa.it/piemonte/notizie/piemonte_rss.xml', 'rss', 'piemonte', 5, false),
  ('ANSA Top News', 'ansa.it', 'https://www.ansa.it/sito/notizie/topnews/index.shtml', 'rss', 'italia', 5, false),
  ('La Repubblica Torino', 'repubblica.it', 'https://torino.repubblica.it/rss/homepage/rss2.0.xml', 'rss', 'piemonte', 4, false),
  ('Il Sole 24 Ore Piemonte', 'ilsole24ore.com', 'https://www.ilsole24ore.com/rss/piemonte.xml', 'rss', 'piemonte', 4, false),
  ('La Stampa Torino', 'lastampa.it', 'https://www.lastampa.it/torino/rss', 'rss', 'piemonte', 4, false)
ON CONFLICT DO NOTHING;

INSERT INTO public.news_settings (automation_enabled, manual_review_mode, review_period_started_at, next_run_at)
VALUES (false, true, now(), now() + interval '1 day')
ON CONFLICT DO NOTHING;
