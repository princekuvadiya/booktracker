# Book Tracker

A modern book tracking application that helps you manage your reading list and take notes on books. Built with a modern tech stack including Bun, ElysiaJS, PostgreSQL, and React.

## Tech Stack

### Backend
- **Runtime**: [Bun](https://bun.sh)
- **Framework**: [ElysiaJS](https://elysiajs.com)
- **Validation**: [Zod](https://zod.dev)
- **ORM**: [Drizzle](https://orm.drizzle.team)
- **Database**: [PostgreSQL](https://www.postgresql.org)

### Frontend
- **Framework**: React with TypeScript
- **Routing**: React Router v6
- **Forms**: React Hook Form with Zod validation
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios

## Features

- Track books with title, author, and reading status
- Organize books by reading status (Not Started, In Progress, Finished)
- Add and manage notes for each book
- Filter and sort your book collection
- Responsive UI for desktop and mobile devices

## Prerequisites

- [Bun](https://bun.sh/) (v1.0.25 or higher)
- [PostgreSQL](https://www.postgresql.org/) (v14 or higher)
- [Node.js](https://nodejs.org/) (v18 or higher, for npm/pnpm if not using bun)
- [pnpm](https://pnpm.io/) (optional but recommended)

## Setup and Installation

### 1. Database Setup

1. Install and start PostgreSQL if not already running
2. Create a new database:

```sql
CREATE DATABASE booktracker;
```

### 2. Environment Configuration

Create a `.env` file in the root directory with:

```
# PostgreSQL Database Configuration
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=[password]
POSTGRES_DB=booktracker

# Full connection string
DATABASE_URL=postgres://postgres:postgres@localhost:5432/booktracker

# Environment
PORT=3000
NODE_ENV=development
```

Adjust the values to match your PostgreSQL configuration.

### 3. Install Dependencies

For the backend:

```bash
# From the project root directory
pnpm install
# Or if using npm
npm install
# Or if using bun
bun install
```

For the frontend:

```bash
cd frontend
pnpm install
# Or if using npm
npm install
# Or if using bun
bun install
```

### 4. Run Database Migrations

Generate and run the database migrations:

```bash
# From the project root directory
pnpm run db:generate
pnpm run db:migrate
# Or if using npm
npm run db:generate
npm run db:migrate
# Or if using bun
bun run db:generate
bun run db:migrate
```

## Running the Application

### Development Mode

1. Start the backend server:

```bash
# From the project root directory
pnpm run dev
# Or if using npm
npm run dev
# Or if using bun
bun dev
```

The backend API will be available at http://localhost:3000
API documentation will be available at http://localhost:3000/swagger

2. In a separate terminal, start the frontend development server:

```bash
cd frontend
pnpm run dev
# Or if using npm
npm run dev
# Or if using bun
bun dev
```

The frontend will be available at http://localhost:5173

### Production Mode

1. Build the frontend:

```bash
cd frontend
pnpm run build
# Or if using npm
npm run build
# Or if using bun
bun run build
```

2. Build and start the backend:

```bash
# From the project root directory
pnpm run build
pnpm run start
# Or if using npm
npm run build
npm run start
# Or if using bun
bun run build
bun run start
```

## Project Structure

```
booktracker/
├── src/                  # Backend source code
│   ├── db/               # Database configuration
│   ├── models/           # Drizzle models
│   ├── routes/           # ElysiaJS route handlers
│   ├── schemas/          # Zod schemas
│   └── index.ts          # Entry point
├── frontend/             # Frontend React application
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── pages/        # Page components
│   │   ├── services/     # API services
│   │   ├── types/        # TypeScript type definitions
│   │   └── App.tsx       # Main component
│   └── package.json      # Frontend dependencies
├── drizzle/              # Drizzle migrations
├── .env                  # Environment variables
├── package.json          # Backend dependencies
└── README.md             # This file
```

## Troubleshooting

- **Database connection issues**: Verify your PostgreSQL credentials in the `.env` file and make sure the PostgreSQL service is running
- **Migration errors**: Check that you have created the database and have proper permissions
- **Frontend/Backend communication issues**: Ensure both servers are running and check that the API_URL in `frontend/src/config.ts` points to your backend
