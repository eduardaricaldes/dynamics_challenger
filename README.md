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

## Pré-requisitos

- Node.js 18+
- Conta no [Supabase](https://supabase.com)
- Conta na [OpenAI](https://platform.openai.com)

---

## Configuração

### 1. Instalar dependências

```bash
npm install
```

### 2. Variáveis de ambiente

Crie ou edite o arquivo `.env.local` na raiz:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=eyJhbGci...

OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4o-mini
```

> A chave da OpenAI **nunca é exposta ao frontend** — todas as chamadas à IA acontecem exclusivamente nas API Routes do servidor.

### 3. Banco de dados (Supabase)

Execute no **SQL Editor** do Supabase:

```sql
-- Clientes
CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Conversas
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES clients(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Mensagens
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(id),
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  intent TEXT CHECK (intent IS NULL OR intent IN ('ORDER', 'OTHER')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Desabilitar RLS para desenvolvimento
ALTER TABLE clients DISABLE ROW LEVEL SECURITY;
ALTER TABLE conversations DISABLE ROW LEVEL SECURITY;
ALTER TABLE messages DISABLE ROW LEVEL SECURITY;
```

---

## Rodar o projeto

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
- Skeleton loading e empty states

### Chat (`/chat`)
- Lista de clientes à esquerda com busca
- Ao selecionar um cliente, inicia uma conversa automaticamente
- Mensagens em tempo real com indicador de digitação (...)
- Respostas da IA com badge de intenção: **Pedido** (ORDER) ou **Outro** (OTHER)
- Enter para enviar, Shift+Enter para quebrar linha
- Layout responsivo: mobile mostra lista ou chat alternadamente

---

## Arquitetura

O projeto segue **Clean Architecture** com separação em camadas:

```
src/
├── app/                        # Next.js App Router
│   ├── api/                    # Route Handlers (backend)
│   │   ├── clients/            # CRUD de clientes
│   │   ├── chat/
│   │   │   ├── start/          # POST /api/chat/start
│   │   │   ├── messages/       # POST /api/chat/messages
│   │   │   └── conversations/  # GET /api/chat/conversations/:id
│   │   └── dashboard/          # GET /api/dashboard
│   ├── chat/                   # Página de chat
│   ├── clients/                # Página de clientes
│   └── dashboard/              # Página de dashboard
│
├── domain/                     # Entidades e interfaces (sem dependências externas)
│   ├── chat/
│   └── clients/
│
├── application/                # Casos de uso
│   ├── chat/
│   └── clients/
│
├── infrastructure/             # Implementações concretas
│   ├── database/               # Supabase client
│   ├── ia/                     # OpenAI provider
│   └── repositories/           # Supabase repositories
│
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
| POST | `/api/clients` | Cria um cliente |
| GET | `/api/clients/:id` | Busca cliente por ID |
| PUT | `/api/clients/:id` | Atualiza cliente |
| DELETE | `/api/clients/:id` | Remove cliente |
| POST | `/api/chat/start` | Inicia conversa (por telefone) |
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
