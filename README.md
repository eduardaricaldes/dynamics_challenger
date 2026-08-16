# Dynamics Desk

Central de atendimento ao cliente com IA — Desafio Técnico Dynamics Labs.

Simula uma ferramenta de suporte estilo WhatsApp: lista de clientes, chat com IA classificando intenções e dashboard com métricas reais.

---

## Stack

| Camada | Tecnologia |
|--------|-----------|
| Framework | Next.js 16.3 (App Router) |
| Frontend | React 19 + TypeScript + Tailwind CSS v4 |
| Backend | Next.js API Routes (mesma aplicação) |
| Banco de dados | Supabase (PostgreSQL) |
| IA | OpenAI Responses API |
| Gráficos | Recharts |
| Ícones | lucide-react |
| Validação | Zod |

---

## Opção A — Rodar com Docker (recomendado)

Sobe tudo localmente: Next.js + PostgreSQL + PostgREST + nginx gateway.

### Pré-requisitos

- Docker + Docker Compose instalados
- Chave da OpenAI

### 1. Variáveis de ambiente

Exporte antes de subir:

```bash
export OPENAI_API_KEY=sk-...
export OPENAI_MODEL=gpt-4o-mini
```

Ou crie um arquivo `.env` na raiz:

```env
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4o-mini
```

### 2. Subir os containers

```bash
docker compose up --build
```

Acesse: **http://localhost:3000**

O banco é criado automaticamente na primeira inicialização com o schema completo (`supabase/migrations/001_schema.sql`).

### 3. Parar / resetar banco

```bash
# Parar sem apagar dados
docker compose down

# Parar e apagar o banco (reset completo)
docker compose down -v
```

### Arquitetura dos containers

```
browser → localhost:3000 (Next.js dev)
               ↓ API routes (server-side)
          gateway:8000 (nginx)
               ↓ /rest/v1/ strip prefix
           rest:3000 (PostgREST)
               ↓
            db:5432 (PostgreSQL)
```

---

## Opção B — Rodar com Supabase Cloud

### 1. Criar projeto no Supabase

Acesse [supabase.com](https://supabase.com), crie um projeto e aguarde o provisionamento.

### 2. Criar o schema

No **SQL Editor** do painel do Supabase, execute:

```sql
-- Tabelas
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

-- Desabilitar RLS (desenvolvimento)
ALTER TABLE clients       DISABLE ROW LEVEL SECURITY;
ALTER TABLE conversations DISABLE ROW LEVEL SECURITY;
ALTER TABLE messages      DISABLE ROW LEVEL SECURITY;
```

> Se já existirem clientes com telefone duplicado, execute a migration de deduplicação antes de adicionar a constraint:
>
> ```sql
> DO $$
> DECLARE
>     dup_phone TEXT;
>     kept_id   UUID;
>     dup_id    UUID;
> BEGIN
>     FOR dup_phone IN
>         SELECT phone FROM clients GROUP BY phone HAVING COUNT(*) > 1
>     LOOP
>         SELECT id INTO kept_id FROM clients
>         WHERE phone = dup_phone ORDER BY created_at ASC LIMIT 1;
>
>         FOR dup_id IN
>             SELECT id FROM clients WHERE phone = dup_phone AND id <> kept_id
>         LOOP
>             UPDATE conversations SET client_id = kept_id WHERE client_id = dup_id;
>             DELETE FROM clients WHERE id = dup_id;
>         END LOOP;
>     END LOOP;
> END $$;
>
> ALTER TABLE clients ADD CONSTRAINT clients_phone_unique UNIQUE (phone);
> ```

### 3. Obter as credenciais

No painel do Supabase: **Project Settings → API**

| Campo | Onde encontrar |
|-------|---------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | `anon` `public` key |

### 4. Instalar dependências

```bash
npm install
```

### 5. Configurar variáveis de ambiente

Crie `.env.local` na raiz:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=eyJhbGci...

OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4o-mini
```

### 6. Rodar

```bash
npm run dev
```

Acesse: **http://localhost:3000**

---

## Funcionalidades

### Dashboard (`/dashboard`)
- Total de clientes cadastrados
- Total de mensagens atendidas
- Contagem de intenções ORDER (pedidos) e OTHER (outros)
- Gráfico de área: atendimentos por dia nos últimos 7 dias
- PieChart: distribuição de intenções

### Clientes (`/clients`)
- Listagem com busca por nome, e-mail ou telefone
- Avatar com iniciais e cor determinística por nome
- Criar, editar e remover clientes
- Telefone único por cliente (409 se duplicado)
- Skeleton loading e empty states

### Chat (`/chat`)
- Lista de clientes à esquerda com busca
- Ao selecionar um cliente, reutiliza conversa existente ou cria uma nova
- Histórico de mensagens carregado do banco ao abrir
- Respostas da IA com badge de intenção: **Pedido** (ORDER) ou **Outro** (OTHER)
- Enter para enviar, Shift+Enter para quebrar linha
- Layout responsivo: mobile mostra lista ou chat alternadamente

---

## Arquitetura

```
src/
├── app/
│   ├── api/
│   │   ├── clients/            # CRUD de clientes
│   │   ├── chat/
│   │   │   ├── start/          # POST — inicia ou reutiliza conversa
│   │   │   ├── messages/       # POST — envia mensagem, retorna resposta IA
│   │   │   └── conversations/  # GET  — histórico de conversa
│   │   └── dashboard/          # GET  — métricas e dados dos gráficos
│   ├── chat/
│   ├── clients/
│   └── dashboard/
├── domain/                     # Entidades e interfaces (sem deps externas)
├── application/                # Casos de uso + erros de domínio
├── infrastructure/             # Supabase repositories + OpenAI provider
├── main/factories/             # Composição de dependências
├── presentation/presenters/    # Serialização HTTP
├── services/                   # Serviços do lado cliente (chamam /api)
├── components/                 # Componentes React
└── types/                      # Tipos compartilhados
```

---

## API

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/clients` | Lista todos os clientes |
| POST | `/api/clients` | Cria cliente (409 se telefone duplicado) |
| GET | `/api/clients/:id` | Busca cliente por ID |
| PUT | `/api/clients/:id` | Atualiza cliente (409 se telefone duplicado) |
| DELETE | `/api/clients/:id` | Remove cliente |
| POST | `/api/chat/start` | Inicia ou reutiliza conversa pelo telefone |
| POST | `/api/chat/messages` | Envia mensagem e obtém resposta da IA |
| GET | `/api/chat/conversations/:id` | Histórico de uma conversa |
| GET | `/api/dashboard` | Métricas e dados dos gráficos |

---

## Segurança

- `OPENAI_API_KEY` existe apenas no servidor — nunca em variáveis `NEXT_PUBLIC_`
- Toda comunicação com a LLM ocorre nas API Routes (servidor)
- Nenhum segredo é exposto ao cliente

---

## Scripts

```bash
npm run dev      # Servidor de desenvolvimento
npm run build    # Build de produção
npm run start    # Servidor de produção
npm run lint     # Lint com ESLint
```
