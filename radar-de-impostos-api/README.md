# 📊 Radar de Impostos

O **Radar de Impostos** é uma plataforma completa para o gerenciamento e visualização de impostos pagos em compras do dia a dia. Através da leitura de QR Codes de Notas Fiscais de Consumidor Eletrônicas (NFC-e), o sistema extrai automaticamente os dados de tributação e oferece um dashboard detalhado sobre a carga tributária do usuário.

## 🚀 Funcionalidades

- **🔐 Autenticação Segura:** Cadastro e login de usuários com JWT.
- **📷 Escaneamento de NFC-e:** Leitor de QR Code integrado para captura rápida de cupons fiscais.
- **🤖 Extração Automática:** Busca dados diretamente do SEFAZ e categoriza o estabelecimento (Mercado, Restaurante, Farmácia, etc).
- **📈 Dashboard Inteligente:** Gráficos interativos (Recharts) mostrando a evolução de gastos vs. impostos.
- **📄 Histórico Completo:** Listagem paginada de todos os cupons, com visualização de detalhes e opção de exclusão.
- **💰 Estatísticas em Tempo Real:** Resumo de total gasto, total de impostos e carga tributária média.

## 🛠️ Tecnologias Utilizadas

### Frontend
- **React + TypeScript**
- **TanStack Router** (Roteamento tipo-safe)
- **React Hook Form + Zod** (Validação de formulários)
- **Tailwind CSS** (Estilização moderna e responsiva)
- **Lucide React** (Ícones)
- **Recharts** (Visualização de dados)

### Backend
- **Node.js + Express**
- **Prisma ORM** (Integração com banco de dados)
- **PostgreSQL** (Banco de dados relacional)
- **TypeScript**
- **JWT** (Autenticação)
- **Swagger/OpenAPI** (Documentação da API)

## 📦 Como executar o projeto

### Pré-requisitos
- Node.js (v18+)
- PostgreSQL ativo
- Gerenciador de pacotes (npm ou yarn)

### 1. Clonar o repositório
```bash
git clone https://github.com/seu-usuario/radar-de-impostos.git
cd radar-de-impostos
```

### 2. Configurar o Backend
```bash
cd radar-de-impostos-api
npm install
# Configure o arquivo .env com sua DATABASE_URL e JWT_SECRET
npx prisma migrate dev
npm run dev
```

### 3. Configurar o Frontend
```bash
cd ../radar-de-impostos-app
npm install
# Configure o arquivo .env com a VITE_API_URL
npm run dev
```

## 📸 Screenshots

*(Adicione aqui links para as imagens do projeto que estão na pasta /docs)*

## 📄 Licença

Este projeto está sob a licença MIT. Consulte o arquivo [LICENSE](LICENSE) para mais detalhes.

---
Feito com ❤️ para ajudar a entender o peso dos impostos no nosso bolso.
