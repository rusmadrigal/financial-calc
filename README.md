# Financial Calculators Website Design

This is a code bundle for Financial Calculators Website Design. The original project is available at https://www.figma.com/design/fPnK6BdMveNJ9Mzxk7TogT/Financial-Calculators-Website-Design.

## Running the code

Run `npm i` to install the dependencies.

Run `npm run dev` to start the development server.

### Sanity Studio

The CMS lives in the `/sanity` folder (Sanity v3, TypeScript). From the repo root:

- **Run the studio dev server:** `pnpm run sanity:dev` → http://localhost:3333
- **Build the studio:** `pnpm run sanity:build`

Set `SANITY_PROJECT_ID`, `SANITY_DATASET`, and `SANITY_API_VERSION` in root `.env.local` (see `.env.example`). See `sanity/README.md` for full steps.
