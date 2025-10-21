# Neural Notes - Frontend Application

Next.js frontend application for the Neural Notes platform. Provides a modern, responsive interface for note management, AI chat interactions, and content analysis visualization.

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router 
- **Language**: TypeScript
- **Styling**: Tailwind CSS with Shadcn UI and Aceternity UI components
- **Editor**: TipTap text editor
- **Authentication**: Clerk
- **Database**: Prisma ORM
- **State Management**: Zustand
- **Animations**: Framer Motion
- **Icons**: Lucide React, React Icons

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- Neural Notes AI Service running on port 8000
- Database (PostgreSQL, MySQL, or SQLite)

### Detailed Setup

1. **Navigate to app directory**:
   ```bash
   cd app
   ```

2. **Install dependencies**:
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Environment Configuration**:
   ```bash
   cp .env.example .env.local
   ```
   
   Configure the following variables in `.env.local`:
   ```env
   # Clerk Authentication
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
   CLERK_SECRET_KEY=sk_test_...
   
   # Database
   DATABASE_URL="postgresql://user:password@localhost:5432/neural_notes"
   # or for SQLite: "file:./dev.db"
   
   # AI Service Integration (URL of the AI service backend)
   NEXT_PUBLIC_AI_SERVICE_URL=http://localhost:8000
   ```

4. **Database Setup**:
   ```bash
   # Generate Prisma client
   npx prisma generate
   
   # Push schema to database (development)
   npx prisma migrate dev
   
   # OR run migrations (production)
   npx prisma migrate deploy
   ```

5. **Start development server**:
   ```bash
   npm run dev
   ```

6. **Access the application**:
   - Frontend: http://localhost:3000
   - Make sure AI Service is running at http://localhost:8000

### Production Build

```bash
# Build the application
npm run build

# Start production server
npm run start
```

## 📁 Project Structure

```
src/
├── app/                 # Next.js app router pages
├── components/          # React components
│   ├── ui/             # Reusable UI components
│   ├── Editor.tsx      # Note editor component
│   ├── ChatBot.tsx     # AI chat interface
│   └── ...
├── actions/            # Server actions
├── lib/                # Utility libraries
├── hooks/              # Custom React hooks
└── store/              # State management
```

## 🔧 Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🎯 Key Components

### Editor
Rich markdown editor with real-time preview and collaborative features.

### AI Sidebar
Context-aware AI assistant that helps with note-taking and provides explanations.

### Folders Sidebar
Hierarchical folder structure for organizing notes efficiently.

### Chat Interface
Interactive chat with AI tutors trained on your uploaded materials.

## � API Integration

Connects to Neural Notes AI Service (`localhost:8000`) for:
- Document upload and processing
- AI chat and tutoring functionality  
- Content analysis and insights


## 🛠️ Troubleshooting

### Common Issues

**Database Connection Issues**:
```bash
# Check if database is running
# Verify DATABASE_URL in .env
# Run: npx prisma db push
```

**Clerk Authentication Issues**:
- Verify API keys in Clerk dashboard
- Check redirect URLs are configured
- Ensure environment variables are set

**AI Service Connection**:
- Verify AI service is running on port 8000
- Check NEXT_PUBLIC_AI_SERVICE_URL environment variable
- Test API endpoint: `curl http://localhost:8000/api/v1/health`

**Build Issues**:
```bash
# Clear Next.js cache
rm -rf .next
npm run build
```
