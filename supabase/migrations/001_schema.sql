-- ================================================================
-- Roles para PostgREST
-- ================================================================
CREATE ROLE anon NOLOGIN NOINHERIT;
CREATE ROLE authenticator NOINHERIT LOGIN PASSWORD 'postgres';
GRANT anon TO authenticator;
GRANT USAGE ON SCHEMA public TO anon;

-- ================================================================
-- Tabelas
-- ================================================================
CREATE TABLE IF NOT EXISTS clients (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name       TEXT        NOT NULL,
  email      TEXT        NOT NULL,
  phone      TEXT        NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT clients_phone_unique UNIQUE (phone)
);

CREATE TABLE IF NOT EXISTS conversations (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id  UUID        NOT NULL REFERENCES clients(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS messages (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID        NOT NULL REFERENCES conversations(id),
  role            TEXT        NOT NULL CHECK (role IN ('user', 'assistant')),
  content         TEXT        NOT NULL,
  intent          TEXT        CHECK (intent IS NULL OR intent IN ('ORDER', 'OTHER')),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ================================================================
-- Sem RLS (desenvolvimento)
-- ================================================================
ALTER TABLE clients       DISABLE ROW LEVEL SECURITY;
ALTER TABLE conversations DISABLE ROW LEVEL SECURITY;
ALTER TABLE messages      DISABLE ROW LEVEL SECURITY;

-- ================================================================
-- Permissões para o role anon
-- ================================================================
GRANT ALL ON ALL TABLES    IN SCHEMA public TO anon;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon;
