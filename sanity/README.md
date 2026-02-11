# Sanity Studio

Sanity Studio (v3) for this repo. TypeScript schemas live in `schemaTypes/`; add `calculatorPage` and others there later.

## How to run the studio locally

1. **Env vars (required)**  
   Create `sanity/.env.local` (e.g. copy from `sanity/.env.example`) and set:
   - **`SANITY_PROJECT_ID`** – get it from [sanity.io/manage](https://sanity.io/manage) (create or open a project)
   - `SANITY_DATASET` – e.g. `production`
   - `SANITY_API_VERSION` – e.g. `2024-01-01`  

   You can also use `.env.local` in the repo root; both locations are read.

2. **Install**  
   From repo root:
   ```bash
   pnpm install
   ```
   Then install Sanity deps (from root):
   ```bash
   pnpm -C sanity install
   ```

3. **Dev server**  
   From repo root:
   ```bash
   pnpm run sanity:dev
   ```
   Studio runs at **http://localhost:3333** (or the port shown in the terminal).

4. **Production build**  
   From repo root:
   ```bash
   pnpm run sanity:build
   ```
   Output is in `sanity/dist/`.

No Next.js integration or deployment is configured yet; this is local setup only.
