# Windows Explorer Clone

A Windows Explorer-like web application built with Vue 3 and Elysia, featuring a two-panel layout with folder tree navigation and content display.

## Features

- **Two-panel layout**: Left panel shows folder tree, right panel shows folder contents
- **Collapsible folder tree**: Expand/collapse folders like Windows Explorer
- **File display**: View files within folders with icons based on file type
- **Search functionality**: Search folders and files across the entire hierarchy
- **Responsive design**: Clean UI built with TailwindCSS

## Tech Stack

### Backend
- **Runtime**: Bun
- **Framework**: Elysia
- **ORM**: Drizzle
- **Database**: MySQL

### Frontend
- **Framework**: Vue 3 with Composition API
- **State Management**: Pinia
- **Styling**: TailwindCSS
- **Build Tool**: Vite

### Testing
- **Backend**: Bun test
- **Frontend Unit**: Vitest + Vue Test Utils
- **E2E**: Playwright

## Architecture

The project follows **Clean/Hexagonal Architecture** with clear separation of concerns:

```
packages/
├── backend/
│   └── src/
│       ├── domain/           # Entities & repository interfaces
│       ├── application/      # Business logic & services
│       ├── infrastructure/   # Database & repository implementations
│       └── presentation/     # API controllers & routes
└── frontend/
    └── src/
        ├── components/       # Vue components
        ├── composables/      # Reusable composition functions
        ├── services/         # API clients
        ├── stores/           # Pinia stores
        └── types/            # TypeScript types
```

## Prerequisites

- [Bun](https://bun.sh) (v1.0 or later)
- MySQL (v8.0 or later)

## Setup

### 1. Clone and Install Dependencies

```bash
# Install all dependencies
bun install
```

### 2. Database Setup

Create a MySQL database:

```sql
CREATE DATABASE windows_explorer;
```

### 3. Configure Environment

Backend:
```bash
cp packages/backend/.env.example packages/backend/.env
# Edit .env with your database credentials
```

Frontend:
```bash
cp packages/frontend/.env.example packages/frontend/.env
```

### 4. Run Database Migrations and Seed

```bash
# Generate migrations
bun run db:generate

# Run migrations
bun run db:migrate

# Seed sample data
bun run db:seed
```

### 5. Start Development Servers

```bash
# Start both backend and frontend
bun run dev

# Or start individually
bun run dev:backend  # Backend on http://localhost:3000
bun run dev:frontend # Frontend on http://localhost:5173
```

## API Endpoints

All endpoints are prefixed with `/api/v1`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/folders` | Get complete folder tree |
| GET | `/folders/:id` | Get folder by ID |
| GET | `/folders/:id/children` | Get folder's direct children (folders & files) |
| GET | `/search?q=query` | Search folders and files |

### Response Format

```json
{
  "success": true,
  "data": { ... }
}
```

## Testing

```bash
# Run all unit tests
bun run test

# Backend tests only
bun run test:backend

# Frontend tests only
bun run test:frontend
```

### E2E Tests

E2E tests require Playwright browsers and running servers.

```bash
# 1. Install Playwright browsers (first time only)
cd packages/frontend
bunx playwright install chromium

# 2. Start servers in separate terminals
# Terminal 1: Start backend
cd packages/backend
bun run dev

# Terminal 2: Start frontend
cd packages/frontend
bun run dev

# 3. Run E2E tests (in a third terminal)
cd packages/frontend
bunx playwright test
```

**Note**: If E2E tests hang on Windows, try:
- Running with `--headed` flag: `bunx playwright test --headed`
- Using a different browser: `bunx playwright test --project=firefox`
- Disabling headless mode in `playwright.config.ts`

## Project Structure

### Backend

- **Domain Layer**: Contains business entities and repository interfaces (ports)
- **Application Layer**: Contains services implementing use cases
- **Infrastructure Layer**: Contains database schema, connections, and repository implementations
- **Presentation Layer**: Contains API controllers and route definitions

### Frontend

- **Components**: Organized by feature (layout, tree, content, search, ui)
- **Stores**: Pinia stores for state management
- **Services**: API client functions
- **Types**: TypeScript type definitions

## Key Design Decisions

### Database Design
- **Materialized Path Pattern**: Folders have a `path` column for efficient hierarchy queries
- **UUID Primary Keys**: Better for distributed systems and scalability
- **Indexes**: On `parent_id`, `path`, and `folder_id` for query performance

### Frontend Design
- **Custom Tree Component**: Built from scratch without library dependencies
- **Recursive Rendering**: FolderTreeNode renders itself for children
- **Optimistic Updates**: UI updates before API confirmation for better UX

## Scripts

| Command | Description |
|---------|-------------|
| `bun run dev` | Start all development servers |
| `bun run dev:backend` | Start backend server |
| `bun run dev:frontend` | Start frontend server |
| `bun run build` | Build all packages |
| `bun run test` | Run all tests |
| `bun run test:e2e` | Run E2E tests |
| `bun run db:generate` | Generate database migrations |
| `bun run db:migrate` | Run database migrations |
| `bun run db:seed` | Seed database with sample data |
| `bun run lint` | Lint all packages |
| `bun run typecheck` | Type check all packages |
