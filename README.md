# GlobeTales

GlobeTales is a modern full-stack travel website built as a portfolio-ready product experience.

It helps travelers:

- explore destination-rich country guides
- generate structured itineraries with an AI planner
- save countries to a wishlist
- create digital travel scrapbooks with photos, captions, journal entries, and favorite spots
- manage saved trips from a lightweight dashboard

## Product Highlights

- Immersive landing page with a draggable animated globe
- Searchable and filterable country exploration flow
- Dynamic country detail pages with practical travel guidance
- Multi-step AI itinerary planner with itinerary refinement actions
- JWT-based authentication with persistent cookie sessions
- Saveable itineraries backed by Prisma and PostgreSQL
- Scrapbook creation and editing with `GRID`, `COLLAGE`, and `TIMELINE` layouts
- Responsive navigation, dark mode, reduced-motion support, and accessible form structure

## Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Framer Motion
- Prisma
- PostgreSQL
- Zod
- React Hook Form
- JWT via `jose`
- Password hashing via `bcryptjs`
- Vitest

## Project Structure

```text
app/
  api/
  auth/
  countries/
  dashboard/
  explore/
  planner/
  profile/
  scrapbooks/
components/
  auth/
  countries/
  home/
  layout/
  planner/
  scrapbooks/
  ui/
lib/
  ai/
  auth/
  content/
  server/
  validation/
prisma/
  schema.prisma
  seed.ts
tests/
types/
```

## Core Routes

- `/` landing page
- `/explore` searchable country discovery
- `/countries/[countryCode]` destination detail pages
- `/planner` AI itinerary planner
- `/auth/sign-in`
- `/auth/register`
- `/dashboard`
- `/scrapbooks`
- `/scrapbooks/new`
- `/scrapbooks/[scrapbookId]`
- `/profile`

## Neon Setup

This project is now configured for Neon-style Prisma usage:

- `DATABASE_URL` is for the pooled connection your app uses at runtime
- `DIRECT_URL` is for Prisma schema operations like `prisma db push` and `prisma migrate`

### Step 1: Create a free Neon project

1. Sign in to Neon.
2. Create a project named `globetales`.
3. Open the connection details page.

### Step 2: Copy both Neon connection strings

You want:

- one pooled connection string for `DATABASE_URL`
- one direct connection string for `DIRECT_URL`

The exact host names vary by Neon project, but the pattern usually looks like:

```env
DATABASE_URL="postgresql://USER:PASSWORD@ep-...-pooler.us-east-2.aws.neon.tech/globetales?sslmode=require&pgbouncer=true&connect_timeout=15"
DIRECT_URL="postgresql://USER:PASSWORD@ep-....us-east-2.aws.neon.tech/globetales?sslmode=require&connect_timeout=15"
```

### Step 3: Create your real local env file

Copy the example file:

```bash
cp .env.example .env
```

Then replace the placeholder values in `.env`.

Use:

```env
DATABASE_URL="your-pooled-neon-url"
DIRECT_URL="your-direct-neon-url"
JWT_SECRET="your-long-random-secret"
OPENAI_API_KEY=""
NEXT_PUBLIC_APP_URL="http://localhost:3000"
DEFAULT_DEMO_EMAIL="demo@globetales.app"
DEFAULT_DEMO_PASSWORD="TravelMore123!"
```

Notes:

- If `OPENAI_API_KEY` is empty, the planner uses the built-in mock itinerary generator.
- If you later add a real OpenAI API key, itinerary generation will use your API credits.

### Step 4: Push the Prisma schema to Neon

Run:

```bash
npx prisma generate
npm run prisma:push
```

This creates all GlobeTales tables in Neon for:

- users
- countries
- saved countries
- itineraries
- scrapbooks
- scrapbook entries
- recently viewed countries

### Step 5: Seed demo data

Run:

```bash
npm run prisma:seed
```

The seed creates:

- a demo user
- 12 travel countries
- saved countries
- one saved itinerary
- one scrapbook with entries

### Step 6: Start the app

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Step 7: Test that data is really saving

1. Register a new account in the app.
2. Save a country to your wishlist.
3. Generate and save an itinerary.
4. Create a scrapbook.
5. Refresh the page and sign back in.

If those items are still there, Neon is connected correctly.

## Environment Variables

Current template:

```env
DATABASE_URL="postgresql://YOUR_NEON_USER:YOUR_NEON_PASSWORD@YOUR-POOLED-HOST/globetales?sslmode=require&pgbouncer=true&connect_timeout=15"
DIRECT_URL="postgresql://YOUR_NEON_USER:YOUR_NEON_PASSWORD@YOUR-DIRECT-HOST/globetales?sslmode=require&connect_timeout=15"
JWT_SECRET="replace-with-a-long-random-string-use-at-least-32-characters"
OPENAI_API_KEY=""
NEXT_PUBLIC_APP_URL="http://localhost:3000"
DEFAULT_DEMO_EMAIL="demo@globetales.app"
DEFAULT_DEMO_PASSWORD="TravelMore123!"
```

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Create your environment file:

```bash
cp .env.example .env
```

3. Paste your Neon values into `.env`.

4. Generate Prisma Client:

```bash
npx prisma generate
```

5. Push the schema to Neon:

```bash
npm run prisma:push
```

6. Seed the database:

```bash
npm run prisma:seed
```

7. Start the app:

```bash
npm run dev
```

## Demo Account

After seeding, use:

- Email: `demo@globetales.app`
- Password: `TravelMore123!`

Unless you override those values in `.env`.

## AI Planner Behavior

`POST /api/ai/itinerary`

The planner endpoint includes:

- Zod validation
- safe error responses
- simple in-memory rate limiting
- structured JSON itinerary output
- mock fallback support

The planner UI supports:

- regeneration of the full itinerary
- regeneration of a single day
- replacement of one activity block
- cheaper or more relaxed rewrites
- hidden-gem and restaurant-focused refinements
- save, copy, share, and printable output actions

## Scrapbook Feature

Scrapbooks support:

- country selection
- optional linked itinerary
- cover image
- trip dates
- trip rating
- favorite memory highlight
- image upload with basic file-size and type validation
- photo, journal, and highlight entry types
- entry reordering
- editable layouts

## Security Notes

Current MVP protections include:

- bcrypt password hashing
- JWT session cookies
- protected API routes for save flows
- Zod request validation
- safe fallback handling in AI routes
- basic rate limiting for itinerary generation

## Testing

Run the test suite with:

```bash
npm test
```

Current tests cover:

- country filtering logic
- mock itinerary generation
- authentication validation
- scrapbook validation

## Verification

Validated in this workspace with:

- `npx prisma generate`
- `npx tsc --noEmit`
- `npm run lint`
- `npm test`
- `npm run build`

## Screenshots

Screenshot placeholders to capture later:

- landing page hero with globe
- explore page filters
- planner output state
- scrapbook detail view
- dashboard overview

## Future Improvements

- live weather integration
- richer AI chat history and conversational planner memory
- cloud image storage for scrapbook uploads
- itinerary drag-and-drop editing
- map-based route visualization
- finer-grained analytics on saved travel behavior
