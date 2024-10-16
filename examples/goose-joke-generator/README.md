## 🪿 Goose Joke Generator

This is a project created with the `create-honc-app` template.

It is a simple Goose Joke Generator that uses Cloudflare AI to generate jokes, and store them in a Neon Postgres database.

The jokes are very bad.

### Getting started

Make sure you have Neon set up and configured with your database. Create a .dev.vars file with your Neon connection string as the `DATABASE_URL` key and value (see: `.dev.vars.example`).

### Project structure

```#
├── src
│   ├── index.tsx # Hono app entry point
│   └── db
│       └── schema.ts # Database schema
├── seed.ts # Optional seeding script
├── .dev.vars.example # Example .dev.vars file
├── wrangler.toml # Cloudflare Workers configuration
├── drizzle.config.ts # Drizzle configuration
├── tsconfig.json # TypeScript configuration
└── package.json
```

### Commands

Run the migrations and (optionally) seed the database:

```sh
pnpm run db:generate
pnpm run db:migrate
pnpm run db:seed # Optional
```

Run the development server:

```sh
pnpm dev
```

Debug with Fiberplane:

```sh
pnpm fiberplane
```

Deploy with Cloudflare:

```sh
pnpm run deploy
```
