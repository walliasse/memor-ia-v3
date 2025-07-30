-- Enable the pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Add embedding column to memories table
ALTER TABLE memories ADD COLUMN IF NOT EXISTS embedding vector(1536);

-- Create index for vector similarity search
CREATE INDEX IF NOT EXISTS memories_embedding_idx ON memories USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- Create function for vector similarity search
CREATE OR REPLACE FUNCTION match_memories(
  query_embedding vector(1536),
  match_threshold float DEFAULT 0.7,
  match_count int DEFAULT 10,
  filter_user_id uuid DEFAULT NULL
)
RETURNS TABLE (
  id uuid,
  user_id uuid,
  content text,
  date date,
  location text,
  image_url text,
  created_at timestamp with time zone,
  updated_at timestamp with time zone,
  similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    m.id,
    m.user_id,
    m.content,
    m.date,
    m.location,
    m.image_url,
    m.created_at,
    m.updated_at,
    1 - (m.embedding <=> query_embedding) as similarity
  FROM memories m
  WHERE 
    m.embedding IS NOT NULL
    AND (filter_user_id IS NULL OR m.user_id = filter_user_id)
    AND 1 - (m.embedding <=> query_embedding) > match_threshold
  ORDER BY m.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- Create function to update embedding when memory is created/updated
CREATE OR REPLACE FUNCTION update_memory_embedding()
RETURNS TRIGGER AS $$
BEGIN
  -- This will be called from the application layer
  -- The embedding will be generated using OpenAI and updated via API
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to call embedding update function
CREATE TRIGGER trigger_update_memory_embedding
  AFTER INSERT OR UPDATE ON memories
  FOR EACH ROW
  EXECUTE FUNCTION update_memory_embedding();

-- Add RLS policy for embedding column
ALTER TABLE memories ENABLE ROW LEVEL SECURITY;

-- Policy to allow users to see their own memories with embeddings
CREATE POLICY "Users can view own memories with embeddings" ON memories
  FOR SELECT USING (auth.uid() = user_id);

-- Policy to allow users to update their own memories with embeddings
CREATE POLICY "Users can update own memories with embeddings" ON memories
  FOR UPDATE USING (auth.uid() = user_id);

-- Create search_logs table for analytics (optional)
CREATE TABLE IF NOT EXISTS search_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  query text NOT NULL,
  parsed_query jsonb,
  results_count integer DEFAULT 0,
  processing_time integer,
  timestamp timestamp with time zone DEFAULT now(),
  success boolean DEFAULT true,
  error text,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on search_logs
ALTER TABLE search_logs ENABLE ROW LEVEL SECURITY;

-- Policy for search_logs
CREATE POLICY "Users can view own search logs" ON search_logs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own search logs" ON search_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create index on search_logs for performance
CREATE INDEX IF NOT EXISTS search_logs_user_id_idx ON search_logs(user_id);
CREATE INDEX IF NOT EXISTS search_logs_timestamp_idx ON search_logs(timestamp); 