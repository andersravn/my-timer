# Nuxt Minimal Starter

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

# Types

[Supabase docs](https://supabase.com/docs/guides/api/rest/generating-types)

`npx supabase gen types typescript --project-id "$PROJECT_REF" --schema public > types/database.types.ts`

Find the project ref in the settings of the project in the Supabase dashboard.

# TODO

[X] Time inputs are too small on smaller screens
[X] Start new entry from existing entry
[X] Delete entries
[ ] Template for new entry with fixed start and end times
[ ] Create goals for days
[ ] Use goals to show when work ends on a given day
[ ] A new entry should start when the previous ended, if the same day (perhaps as a setting)
[ ] Drag and drop entries
