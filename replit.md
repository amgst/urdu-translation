# Overview

This project is an Urdu Speech-to-Text application with AI-powered grammar correction. It provides real-time speech recognition for Urdu language and uses Google's Gemini AI to correct grammar and improve text clarity. The application features a modern React frontend with shadcn/ui components and an Express.js backend.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture

**Framework**: React with TypeScript using Vite as the build tool
- **UI Library**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **State Management**: React hooks with TanStack Query for server state
- **Routing**: Wouter for lightweight client-side routing

**Key Design Patterns**:
- Component-based architecture with reusable UI components
- Custom hooks for speech recognition and AI text correction
- Toast notifications for user feedback
- Mobile-responsive design with dedicated mobile controls

## Backend Architecture

**Framework**: Express.js with TypeScript
- **Database ORM**: Drizzle ORM configured for PostgreSQL (via Neon Database)
- **Session Storage**: In-memory storage with interface for future database integration
- **Development Setup**: Vite middleware integration for hot reloading

**API Structure**:
- RESTful endpoints under `/api` prefix
- Gemini AI integration for text correction
- Error handling middleware with structured responses
- Request logging for API endpoints

## Database Schema

**Users Table**:
- Simple user schema with username/password authentication
- UUID primary keys with PostgreSQL `gen_random_uuid()`
- Zod schema validation for type safety

## Speech Recognition System

**Browser APIs**: Web Speech API with Urdu language support (`ur-PK`)
- Continuous recognition with interim results
- Error handling for unsupported browsers
- Real-time transcript display with grammar corrections

**Features**:
- Live transcription with interim results
- Session statistics (word count, duration, accuracy)
- Export functionality for completed transcripts
- Mobile-optimized controls with touch-friendly interface

## External Dependencies

**Third-party Services**:
- **Google Gemini AI**: Text correction and grammar improvement for Urdu language
- **Neon Database**: Serverless PostgreSQL database hosting
- **Web Speech API**: Browser-native speech recognition

**Key Libraries**:
- **UI Components**: Radix UI primitives with shadcn/ui styling
- **Database**: Drizzle ORM with PostgreSQL adapter
- **HTTP Client**: TanStack Query for API state management
- **Styling**: Tailwind CSS with class-variance-authority for component variants
- **Forms**: React Hook Form with Zod validation
- **Icons**: Font Awesome and Lucide React icons

**Development Tools**:
- **Replit Integration**: Vite plugin for Replit-specific development features
- **TypeScript**: Full type safety across frontend and backend
- **ESBuild**: Production bundling for server-side code