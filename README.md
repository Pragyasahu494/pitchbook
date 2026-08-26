# CedarBridge AI — Strategic Intelligence Workspace

CedarBridge AI is an AI-powered strategic advisory and investment-banking intelligence platform. It helps advisors create strategic pitchbooks, analyze clients and industries, review M&A activity, identify acquisition targets, generate strategic recommendations, and interact with an AI Copilot.

## Features

- **AI PitchBook Builder** — Generate 10-section strategic pitchbooks with AI
- **AI Copilot** — Context-aware chat assistant that uses pitchbook data from MongoDB
- **Client Analysis** — Track clients, industries, and engagement objectives
- **Market Data** — Competitors, M&A transactions, and potential acquisition targets
- **Strategic Recommendations** — Create, update, and persist recommendations
- **Search** — Global search across pitchbooks, clients, industries, competitors, M&A, and targets
- **Authentication** — JWT-based auth with bcrypt password hashing
- **Demo Mode** — Full functionality without an external AI API key

## Tech Stack

### Frontend
- React 18 + Vite
- JavaScript (JSX)
- Tailwind CSS
- Axios
- Lucide React icons

### Backend
- Node.js + Express.js
- MongoDB + Mongoose
- JWT authentication (jsonwebtoken + bcryptjs)
- Helmet, CORS, Morgan (security + logging)
- AI service abstraction (OpenAI-compatible API or Demo Mode)

### Architecture

```
React
  ↓
Axios
  ↓
Express REST API
  ↓
Controllers
  ↓
Services
  ↓
Mongoose
  ↓
MongoDB

AI Copilot
  ↓
Express AI Service
  ↓
LLM Provider / Demo AI
```

## Project Structure

```
cedarbridge-ai/
├── src/                      # Frontend (Vite + React)
│   ├── App.jsx
│   ├── main.jsx
│   ├── index.css
│   └── services/
│       ├── api.js
│       └── index.js
├── server/                   # Backend (Express + MongoDB)
│   ├── config/
│   │   └── db.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Pitchbook.js
│   │   ├── PitchbookSection.js
│   │   ├── Client.js
│   │   ├── Industry.js
│   │   ├── Competitor.js
│   │   ├── MATransaction.js
│   │   ├── PotentialTarget.js
│   │   ├── Recommendation.js
│   │   └── ChatMessage.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── pitchbookController.js
│   │   ├── marketController.js
│   │   └── aiController.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── pitchbookRoutes.js
│   │   ├── clientRoutes.js
│   │   ├── marketRoutes.js
│   │   ├── aiRoutes.js
│   │   └── searchRoutes.js
│   ├── services/
│   │   ├── pitchbookService.js
│   │   └── aiService.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── errorMiddleware.js
│   ├── seed/
│   │   └── seedData.js
│   ├── server.js
│   ├── package.json
│   └── .env.example
├── .env.example
├── package.json
├── vite.config.js
└── README.md
```

## Setup

### Prerequisites

- Node.js 18+
- MongoDB 6+ (local or MongoDB Atlas)

### 1. Install Dependencies

```bash
# From project root
npm install          # frontend dependencies
cd server && npm install   # backend dependencies
```

Or install everything at once:

```bash
npm run install:all
```

### 2. Environment Variables

Copy the backend env example and configure:

```bash
cp server/.env.example server/.env
```

Edit `server/.env`:

```
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/cedarbridge
JWT_SECRET=change-this-secret
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
DEMO_MODE=true
AI_API_KEY=
AI_API_BASE_URL=
AI_MODEL=gpt-4o
```

Copy the frontend env example:

```bash
cp .env.example .env
```

Edit `.env`:

```
VITE_API_URL=http://localhost:5000/api
```

### 3. Seed the Database

Make sure MongoDB is running, then:

```bash
cd server
npm run seed
```

This creates:
- 5 users
- 5 clients
- 5 industries
- 10 competitors
- 15 M&A transactions
- 15 potential targets
- 3 pitchbooks with all 10 sections each
- 8 recommendations
- Chat history

**Demo login:** `rahul@cedarbridge.ai` / `password123`

### 4. Run the Application

**Option A — Both servers together:**

```bash
npm run dev:full
```

**Option B — Separate terminals:**

```bash
# Terminal 1: Backend
cd server
npm run dev

# Terminal 2: Frontend
npm run dev
```

Frontend: http://localhost:5173
Backend API: http://localhost:5000/api

## API Documentation

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login and receive JWT |
| GET | `/api/auth/me` | Get current user (protected) |

### Pitchbooks
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/pitchbooks` | List all pitchbooks |
| GET | `/api/pitchbooks/:id` | Get pitchbook with sections + recommendations |
| POST | `/api/pitchbooks` | Create a pitchbook (protected) |
| PUT | `/api/pitchbooks/:id` | Update a pitchbook (protected) |
| DELETE | `/api/pitchbooks/:id` | Delete a pitchbook (protected) |
| POST | `/api/pitchbooks/:id/generate` | Generate all 10 sections (protected) |
| POST | `/api/pitchbooks/:id/sections/:sectionKey/generate` | Regenerate one section (protected) |

### Clients
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/clients` | List all clients |
| GET | `/api/clients/:id` | Get a client |
| POST | `/api/clients` | Create a client (protected) |
| PUT | `/api/clients/:id` | Update a client (protected) |

### Market Data
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/market/competitors` | List competitors |
| GET | `/api/market/ma` | List M&A transactions |
| GET | `/api/market/targets` | List potential targets |

### Recommendations
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/recommendations` | List recommendations |
| PUT | `/api/recommendations/:id` | Update recommendation status (protected) |

### AI Copilot
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/ai/chat` | Ask a question (protected) |
| GET | `/api/ai/history/:pitchbookId` | Get chat history (protected) |
| DELETE | `/api/ai/history/:pitchbookId` | Clear chat history (protected) |

### Search
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/search?q=` | Global search |

### Health Check
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Service + database status |

## AI Integration

### Demo Mode (default)

When `DEMO_MODE=true` or no `AI_API_KEY` is set, the AI service generates intelligent contextual responses from MongoDB data. The demo mode:

- Analyzes the user's question to select relevant pitchbook sections
- Formats the context and generates a structured response
- Covers common question patterns (opportunities, acquisitions, competition, summaries, recommendations)

### Real AI Mode

Set `AI_API_KEY` and optionally `AI_API_BASE_URL` and `AI_MODEL` in `server/.env`:

```
DEMO_MODE=false
AI_API_KEY=sk-your-key-here
AI_API_BASE_URL=https://api.openai.com/v1
AI_MODEL=gpt-4o
```

The AI service is isolated in `server/services/aiService.js` and API keys are never exposed to the frontend.

### AI Context Management

The AI service selects relevant context based on the question:

| Question Type | Sections Used |
|---------------|---------------|
| "biggest opportunities" | growthOpportunities, keyTrends, potentialTargets, strategicRecommendations |
| "who should we acquire" | potentialTargets, competitiveLandscape, clientSnapshot |
| "competitive landscape" | competitiveLandscape, industryOverview, clientSnapshot |
| "summarize the pitchbook" | All 10 sections |
| "what should management do" | strategicRecommendations, nextSteps, growthOpportunities |

## Pitchbook Sections

Every generated pitchbook contains 10 sections:

1. **executiveSummary** — Client overview, strategic situation, key findings
2. **clientSnapshot** — Client metadata, revenue, employees, growth
3. **industryOverview** — Market size, CAGR, major players, growth chart
4. **keyTrends** — Industry trends with impact and confidence scores
5. **competitiveLandscape** — Peer comparison, market position, market share
6. **growthOpportunities** — Opportunities with potential, priority, rationale
7. **recentMA** — Recent M&A transactions table
8. **potentialTargets** — Acquisition targets with fit scores
9. **strategicRecommendations** — Actionable recommendations with owners
10. **nextSteps** — Strategic roadmap with stages

## Interview Talking Points

- **Full-stack architecture**: React frontend communicating with Express REST API backed by MongoDB
- **Authentication**: JWT-based with bcrypt password hashing, protected routes
- **AI integration**: Context-aware AI service with demo mode fallback
- **Data persistence**: All pitchbook sections, recommendations, and chat history stored in MongoDB
- **Error handling**: Centralized error middleware, graceful frontend fallbacks
- **Security**: Helmet, CORS, environment variable isolation, JWT auth middleware
- **Seed data**: Realistic financial services data for immediate demo

## Production Considerations

- Set a strong `JWT_SECRET`
- Set `DEMO_MODE=false` and configure a real AI API key
- Use MongoDB Atlas for managed database hosting
- Enable rate limiting with `express-rate-limit`
- Add request validation with `express-validator`
- Use environment-specific `.env` files
- Enable HTTPS and secure cookies in production
