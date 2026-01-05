# Task Management App

A modern, responsive Task Management Application built with **Next.js 15** and **Supabase**. This application allows users to manage their tasks with extended features like Kanban board view, Timeline view, and real-time updates.

## 🚀 Features

### Core
- **Authentication**: Secure Sign up and Sign in using Supabase Auth.
- **Task Management**: Create, Read, Update, and Delete tasks.
- **Views**:
  - **List View**: detailed list of tasks.
  - **Kanban Board**: Drag-and-drop style status management (visual only).
  - **Timeline**: Calendar-based view for scheduling.
- **Status Tracking**: Mark tasks as Todo, In Progress, or Done.

### Enhancements
- ⚡ **Optimistic UI**: Instant feedback on user actions (creating, updating, deleting tasks) before server confirmation.
- 🎨 **Modern Design**: Built with Tailwind CSS v4 and a custom premium UI kit.
- 🔍 **Search & Filter**: Real-time filtering by status and text search.
- 🌗 **Dark Mode**: Fully supported system-aware dark/light mode.
- 📱 **Responsive**: Mobile-first design that works seamlessly on all devices.

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Language**: TypeScript
- **Database & Auth**: [Supabase](https://supabase.com/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **State Management**: React Hooks + Optimistic Updates
- **Utilities**: `date-fns`, `sonner` (for toasts), `clsx`, `tailwind-merge`

## 🏁 Getting Started

### Prerequisites
- Node.js 18+ installed
- A Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd tasks-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Rename `.env.example` to `.env.local` and fill in your Supabase credentials:
   ```bash
   cp .env.example .env.local
   ```
   
   Open `.env.local` and add your keys:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) with your browser.

## 🗄️ Database Schema

Run the following SQL in your Supabase SQL Editor to set up the database:

```sql
create type task_status as enum ('todo', 'in_progress', 'done');

create table tasks (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) not null,
  title text not null,
  description text,
  status task_status default 'todo',
  due_date timestamp with time zone,
  is_completed boolean default false,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable RLS
alter table tasks enable row level security;

-- Policies
create policy "Users can view their own tasks" on tasks
  for select using (auth.uid() = user_id);

create policy "Users can create their own tasks" on tasks
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own tasks" on tasks
  for update using (auth.uid() = user_id);

create policy "Users can delete their own tasks" on tasks
  for delete using (auth.uid() = user_id);
```

## 💡 Design Decisions & Trade-offs

- **Supabase for Backend**: Chose Supabase for its "Backend-as-a-Service" capabilities, allowing for rapid development of Auth and Database features without maintaining a separate API server.
- **Client-Side Fetching with RLS**: Used direct client-side calls to Supabase secured by Row Level Security (RLS). This reduces server load and simplifies the architecture for a single-page-like experience.
- **Optimistic Updates**: Implemented optimistic updates in `useTasks` hook to ensure the app feels snappy and native-like, masking network latency.
- **Tailwind CSS v4**: Utilized the latest version of Tailwind for zero-config build performance and modern CSS features.

## 🔮 Future Improvements

With more time, I would consider adding:
- **Drag and Drop**: Full `dnd-kit` integration for the Kanban board to allow updating status by dragging.
- **Server Components**: Refactor some data fetching to React Server Components for better initial load performance (SEO).
- **Testing**: Add Jest and React Testing Library for unit tests, and Playwright for E2E testing.
- **Recurrence**: Add support for recurring tasks (daily, weekly).
