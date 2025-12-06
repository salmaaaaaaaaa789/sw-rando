# Randopedia Travel - Voyage Website

## Project info

Randopedia Travel is a professional travel booking platform for adventure and cultural travel experiences.

## How to run this project

**Prerequisites**

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Local Development**

- Edit files directly in your preferred IDE
- Make changes and commit the changes
- All changes will be reflected when running the development server

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- Supabase
- React Hook Form
- Zod

## How can I deploy this project?

You can deploy this project to any hosting platform that supports static sites, such as:
- Vercel
- Netlify
- GitHub Pages
- AWS S3
- Cloudflare Pages

## Backend setup (Supabase)

1. Create a project on Supabase and get your API URL and anon key.
2. Create a `.env` file in the project root (same folder as `package.json`) with:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

3. Create the `contact_requests` and `bookings` tables using this SQL in the Supabase SQL editor (see database-schema.sql file):

```sql
-- Run the schema from database-schema.sql
```

4. Restart the dev server (`npm run dev`) after adding the `.env` file.

The contact form writes to `public.contact_requests` via the Supabase client in `src/lib/supabaseClient.ts`. Ensure the RLS policy grants insert permission for unauthenticated users or use authenticated flows as needed.