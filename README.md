# TechClass

แพลตฟอร์มบทเรียน TechClass บน Next.js App Router, PostgreSQL (Neon) และ Vercel Blob

## Local development

ต้องใช้ Node.js 22.13 ขึ้นไป

```bash
npm install
npx vercel link
npx vercel env pull .env.local --yes
npm run db:migrate
npm run dev
```

ค่าที่จำเป็นอยู่ใน `.env.example`:

- `DATABASE_URL` — PostgreSQL connection string
- `BLOB_READ_WRITE_TOKEN` — private Vercel Blob store token

ห้าม commit `.env.local` หรือไฟล์ใต้ `.vercel/`

## Database

Schema อยู่ที่ `db/schema.ts` และ migration PostgreSQL อยู่ใต้ `drizzle/`

```bash
npm run db:generate
npm run db:migrate
```

migration ของ Cloudflare D1 เดิมถูกเก็บอ้างอิงไว้ที่ `drizzle-sqlite-archive/` และไม่ถูกใช้กับระบบใหม่

## Deployment

Vercel project `komsorn/tech-class` เชื่อมกับ GitHub repository `komsorn1982/TechClass` แล้ว:

- push/PR branch สร้าง Preview Deployment
- push เข้า `main` สร้าง Production Deployment
- Vercel ใช้ Next.js preset และ auto-detect build output
- Neon และ private Blob store ถูกเชื่อมกับ Development, Preview และ Production

ก่อน deploy schema change ให้รัน migration กับฐานข้อมูลเป้าหมายก่อน แล้วตรวจ preview ก่อน merge เข้า `main`

## Commands

- `npm run dev` — Next.js development server
- `npm run build` — production build
- `npm run lint` — ESLint
- `npm test` — build และตรวจ migration configuration
- `npm run db:generate` — สร้าง PostgreSQL migration
- `npm run db:migrate` — apply migration โดยอ่าน `.env.local`
