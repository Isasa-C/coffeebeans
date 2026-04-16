# Coffee Beans App

A Next.js App Router catalog for logging coffee beans with images, pricing, ratings, comments, and edit/delete flows.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Prisma
- Vercel Blob for production image storage

## Local Development

1. Install dependencies:

```bash
npm install
```

2. Copy the environment template and fill in your values:

```bash
cp .env.example .env
```

3. Generate the Prisma client:

```bash
npx prisma generate
```

4. Start the app:

```bash
npm run dev
```

## Vercel Deployment Notes

This project is prepared for GitHub + Vercel, but production requires two services:

- A hosted Postgres database exposed as `DATABASE_URL`
- A Vercel Blob store exposed as `BLOB_READ_WRITE_TOKEN`

### Recommended setup

1. Connect a Postgres provider from the Vercel Marketplace or use any hosted Postgres instance.
2. Create a Vercel Blob store and attach it to the project.
3. Add the environment variables in Vercel:
   - `DATABASE_URL`
   - `BLOB_READ_WRITE_TOKEN`
4. Redeploy.

## Important Storage Behavior

- In production, uploaded images are stored in Vercel Blob.
- Without `BLOB_READ_WRITE_TOKEN`, uploads fall back to local `public/uploads` storage for development only.
- Local SQLite files are intentionally ignored and are not used for Vercel production.

## Verification

```bash
npm run lint
npm run build
```
