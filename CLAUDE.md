# Frontend — CLAUDE.md

> Companion to the backend `CLAUDE.md`. Read both together. This file governs the **frontend** codebase only.

## Purpose & Scope

The frontend is a Next.js application serving the public marketing site, soon extended with an admin panel for managing site content. The first admin feature in scope is **Projects** (add/delete projects displayed publicly), gated to `super_admin` and `admin` roles (enforced by the backend; frontend gating follows once Clerk is added here).

## Tech Stack

- **Framework:** Next.js 16 (App Router), React 19
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **UI components:** shadcn/ui (Radix UI primitives + class-variance-authority + tailwind-merge + lucide-react)
- **Forms:** react-hook-form + zod + @hookform/resolvers
- **Data fetching / server state:** axios + TanStack Query (React Query) v5
- **Internationalization:** next-intl v4 (`ar` / `en`, locale-prefixed routes)
- **Notifications:** sonner (toasts)
- **Theming:** next-themes
- **Animation:** motion (Framer Motion)
- **Misc:** recharts (charts), embla-carousel (carousels), cmdk (command palette), vaul (drawers), date-fns
- **Fonts:** @fontsource/cairo
- **Analytics:** @vercel/analytics
- **Image pipeline:** `scripts/convert-images-to-webp.mjs` (uses `sharp`)
- **Auth:** none on the frontend yet. `@clerk/nextjs` will be added later, scoped strictly to admin flows (sign-in/sign-up + protecting admin routes). The public site needs no authentication.

## Folder Structure — Feature-Based

Migrated from a flat, type-based structure (`components/`, `hooks/`, `services/`, `types/`, `constant/` shared across everything) to **feature-based**, mirroring the backend's `src/features/`.

```
app/                         # Next.js routes ONLY — no business logic
  globals.css
  [locale]/                   # every route lives under the locale segment
    layout.tsx                # the root layout: <html lang dir> + providers
    page.tsx
    not-found.tsx
    hosting/{page.tsx, vps/page.tsx, dedicated/page.tsx}

messages/                    # all UI copy, one file per locale
  ar.json
  en.json
i18n/
  routing.ts                  # locales + defaultLocale
  navigation.ts               # locale-aware Link / useRouter / usePathname
  request.ts                  # loads messages/<locale>.json per request
  metadata.ts                 # canonical + hreflang helper
proxy.ts                      # next-intl middleware (Next 16 "proxy" convention)

features/
  home/
    components/               # Hero, About, Features, Services, Pricing, Contact
                              # + their cards/lists/form primitives
    constants/Home.ts
    types/Home.ts
  hosting/
    components/               # HostingHero, Products, ProductList, ProductCard,
                              # VPSSection, DedicatedSection
    hooks/UseProducts.ts
    services/Hosting.ts
    types/Hosting.ts
    constants/Hosting.ts
    QueryKeys.ts
  projects/
    components/               # ProjectsSection, ProjectList, ProjectCard
    constants/Projects.ts     # static data until the backend endpoint exists
    types/Projects.ts
  team/
    components/               # Team, TeamList, TeamCard
    constants/Team.ts
    types/Team.ts

# Shared across ALL features — stays at root, never duplicated inside features/
components/
  ui/                         # shadcn/ui primitives ONLY (lowercase — see Naming)
  shared/                     # Navbar, Footer, FooterLinks, FooterSocial,
                              # NavigationOverlay, ScrollToTop
lib/
  Api.ts                       # single axios instance + ApiError + interceptor
  Utils.ts
providers/
  QueryProvider.tsx
hooks/
  UseMobile.ts                 # generic, not feature-specific
constants/
  Site.ts                      # used by shared Footer AND home Contact → root
types/
  Shared.ts                    # NavigationOverlayProps, FooterLink, FooterSocialLink,
                               # ContactInfoData
public/
scripts/
```

**Rule:** if something is used by only one feature, it lives inside `features/<name>/`. If it's shared by two or more features, it stays at the root. A page section belongs to the feature whose data it renders, not to the route that mounts it — that is why `VPSSection`/`DedicatedSection` live in `features/hosting/` and `ProjectsSection` in `features/projects/`, even though the home page renders all three.

## The Five-Layer Pattern (per feature)

Every feature that talks to the backend follows the same five layers, in order:

1. **Error Handler** — shared, lives in `lib/Api.ts` (the `ApiError` class below). Not duplicated per feature.
2. **API Config** — shared, the single axios instance in `lib/Api.ts`.
3. **Service** — `features/<name>/services/<Name>.ts`. Pure functions calling `api`, returning typed data. No React or React Query here.
4. **Hook** — `features/<name>/hooks/Use<Name>.ts`. Wraps the service in `useQuery`/`useMutation`.
5. **Usage** — the component. Always calls the hook, never the service or `api` directly.

## API Client & Error Handling (`lib/Api.ts`)

```typescript
import axios, { AxiosError } from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

export class ApiError extends Error {
  code?: string;
  status?: number;

  constructor(message: string, code?: string, status?: number) {
    super(message);
    this.name = "ApiError";
    this.code = code;
    this.status = status;
  }
}

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ success: false; error?: { message: string; code?: string } }>) => {
    if (error.response) {
      const backendError = error.response.data?.error;
      throw new ApiError(
        backendError?.message ?? "Something went wrong",
        backendError?.code,
        error.response.status
      );
    }
    if (error.request) {
      throw new ApiError("Could not reach the server. Check your connection.");
    }
    throw new ApiError(error.message);
  }
);
```

Any error thrown from `api.*` calls is always an `ApiError` with a ready-to-display `.message`. Services and hooks never parse the backend's raw `{ success, error: { message, code } }` shape themselves.

## Mutation Error Handling (add/delete/update)

**Decision: manual, per-mutation.** No global `QueryClient.onError` default — each mutation hook explicitly handles `onSuccess`/`onError` so behavior can be tailored:

```typescript
export const useDeleteProject = () =>
  useMutation({
    mutationFn: deleteProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectKeys.all });
      toast.success("Project deleted successfully");
    },
    onError: (error) => {
      toast.error(error instanceof ApiError ? error.message : "Something went wrong");
    },
  });
```

## Data Fetching & State (TanStack Query)

- Every feature owns its own `QueryKeys.ts` — **decentralized**, co-located with the feature, not a single shared file.
- Query keys are exported as functions, e.g. `projectKeys.list(filters)`, `projectKeys.detail(id)`, `projectKeys.all`.

## Naming Conventions

| What | Convention | Example |
|---|---|---|
| All files we write — components, hooks, services, types, utils, constants | PascalCase | `ProductCard.tsx`, `UseProducts.ts`, `Hosting.ts`, `QueryKeys.ts` |
| Folders | lowercase | `features/hosting/components/` |
| **Exception:** shadcn/ui primitives in `components/ui/` | lowercase, as generated | `button.tsx`, `dialog.tsx`, `tabs.tsx` |

**Why the shadcn exception:** `npx shadcn add <component>` always writes lowercase filenames. Renaming them means every future `add` silently recreates a duplicate file differing only in case — which resolves fine on Windows but breaks the deploy, since the CI in `.github/workflows/deploy.yml` builds on Ubuntu where imports are case-sensitive. Our own code stays PascalCase; generated primitives stay as generated. The `components.json` aliases point at our PascalCase paths (`"utils": "@/lib/Utils"`) so newly added primitives import them correctly.

## Internationalization (next-intl)

The site ships in Arabic and English at `/ar/...` and `/en/...`. `/` redirects to `/ar`. Both locales are prerendered statically.

**Hard rules:**

1. **No user-facing string literal ever appears in JSX.** Every label, heading, placeholder, `aria-label`, `alt`, and error message comes from `messages/<locale>.json` via `useTranslations`. The only literals left in components are brand names (DEEPCODE, Ryzen, GitHub) and data from the external hosting API.
2. **Import `Link` and the navigation hooks from `@/i18n/navigation`, never from `next/link` or `next/navigation`** — otherwise the locale prefix is dropped and the user is bounced back to the default locale.
3. **Constants hold structure, messages hold text.** A constants file keeps ids, icons, hrefs, images, and prices, plus a `key` that resolves against a message namespace. See `features/home/constants/Home.ts` (`serviceItems`, `pricingPlans`) and `features/team/constants/Team.ts`.
4. Message namespaces mirror the features: `metadata`, `nav`, `hero`, `about`, `features`, `services`, `pricing`, `projects`, `team`, `contact`, `footer`, `hosting`, `common`, `notFound`.
5. `useTranslations` works in **both** server and client components — no prop threading. Async server functions (`generateMetadata`) use `getTranslations({locale, namespace})` instead.
6. Every page and layout calls `setRequestLocale(locale)` **before** any translation call, otherwise it opts out of static rendering. (`next/root-params` would replace this, but it needs Next 16.3+ and we are on 16.2.6.)
7. Interpolated numbers are passed as strings (`{ year: String(...) }`) — ICU would otherwise group them as `2,026`.
8. Highlighted fragments inside a heading use `t.rich("title", { hl: (c) => <span…>{c}</span> })` with `<hl>` in the message, never string concatenation.

### Direction (RTL ⇄ LTR)

`<html dir>` is set from the locale in `app/[locale]/layout.tsx`. **No component sets `dir="rtl"` itself.**

Use logical utilities so the layout mirrors automatically. The design was authored in RTL, so the mapping is **`right` → start, `left` → end**:

| Physical | Logical |
|---|---|
| `text-right` / `text-left` | `text-start` / `text-end` |
| `ml-*` / `mr-*` | `me-*` / `ms-*` |
| `pl-*` / `pr-*` | `pe-*` / `ps-*` |
| `left-0` / `right-0` | `inset-e-0` / `inset-s-0` |
| `border-l` | `border-e` |

For properties with no logical equivalent — `bg-left`/`bg-right`, `translate-x-*`, `divide-x-reverse` — use Tailwind's `rtl:` / `ltr:` variants. Directional icons (`ArrowLeft` used as a "go" arrow) get `ltr:rotate-180` rather than a swapped component.

`dir="ltr"` is applied deliberately, and stays, on latin-only islands: the name/email inputs, the price, and the animated stat counters.

## Data Casing Policy

- **Third-party/external API data** (e.g. the reseller/hosting provider): kept exactly as received (snake_case) — we don't control that schema.
- **Our own backend schemas** (e.g. the future `Project` model): designed **camelCase from the backend itself**, so it arrives camelCase with zero transformation needed on the frontend.

## Environment Variables

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_API_URL` | Base URL for the backend API, used by the axios instance in `lib/Api.ts` |
| `NEXT_PUBLIC_SITE_URL` | Public origin, used as `metadataBase` for canonical and `hreflang` links. **Must be set on the server** — without it those links are emitted as `http://localhost:3000/...`. |

A Clerk publishable key will be added once Clerk is integrated on the frontend.

## Commands

```bash
npm run dev               # start dev server
npm run build              # production build
npm run start              # start production server
npm run lint                # eslint
npm run optimize-images    # convert images to webp (scripts/convert-images-to-webp.mjs, uses sharp)
```

## Feature Status

| Feature | Status |
|---|---|
| Home | **Migrated.** `features/home/` holds every home-page section plus the card/list/form components that used to sit incorrectly in `components/ui/`. Purely presentational — no backend calls. |
| Hosting | **Migrated.** `features/hosting/` implements the full five-layer pattern: `lib/Api.ts` (shared error handler + axios) → `services/Hosting.ts` → `hooks/UseProducts.ts` → components, with query keys in `features/hosting/QueryKeys.ts` (`productKeys.all` / `productKeys.list(type, category)`). Public, read-only — no mutations yet. |
| Projects | **Structure ready, backend not wired.** `features/projects/` exists with components, types, and a static `constants/Projects.ts`. Still to build once the backend endpoint lands: `services/Projects.ts`, `hooks/UseProjects.ts`, `QueryKeys.ts`, and the admin add/delete mutations. |
| Team | **Migrated.** `features/team/` — static data, presentational only. |
| i18n (ar / en) | **Done.** Every route is prerendered in both locales; all copy lives in `messages/`. The language button in the navbar and the mobile overlay is `components/shared/LocaleSwitcher.tsx`, which swaps the locale while staying on the current route. |
| Auth (Clerk on frontend) | Not implemented yet. Public site needs no auth currently. Will be scoped to admin routes only. |

## Known Issues / Cleanup Backlog

- `next.config.mjs` sets `typescript.ignoreBuildErrors: true`, so **`npm run build` does not catch type errors or broken imports**. Always verify with `npx tsc --noEmit` (currently clean). Turning the flag off is the eventual goal.
- `npm run lint` runs `eslint .` but there is no ESLint config file in the repo, so it fails. Either add a config or drop the script.
- `app/[locale]/hosting/page.tsx` is still a placeholder rendering a single translated word.
- `components/ui/` still contains many unused shadcn primitives. They are harmless (tree-shaken) but can be pruned; anything removed is one `npx shadcn add` away.
- `messages/en.json` is a first-pass translation of the Arabic marketing copy and should be reviewed by a native speaker before launch.
- The contact form still has an empty `onSubmit` — nothing is sent anywhere.

## Pending Decisions (TBD)

- Where zod schemas for forms (e.g. "add project") should live — likely `features/projects/schemas/`, not finalized.
- Admin route structure (`app/admin/projects` vs `app/dashboard/projects` vs other) — deferred until Clerk is integrated on the frontend.
- Whether this file lives in a shared monorepo alongside the backend `CLAUDE.md`, or in a separate frontend repo — deferred.

## Decisions Log

- **2026-09-05** — Frontend migrates from type-based to feature-based folder structure (`features/<name>/`), mirroring the backend. Migration order: Hosting first, then Projects.
- **2026-09-05** — `QueryKeys.ts` decentralized: one per feature, not a single shared file.
- **2026-09-05** — Use `type` exclusively across the frontend; never `interface`, even for component props.
- **2026-09-05** — External third-party API data keeps its original casing (snake_case); our own backend schemas are designed camelCase so no frontend transform layer is needed.
- **2026-09-05** — Naming convention: **all files use PascalCase** (components, hooks, services, types, utils, constants) — only folders stay lowercase. Supersedes the earlier kebab-case-for-non-components rule.
- **2026-09-05** — Mutation error handling is manual per-mutation (no global `QueryClient` default `onError`), using the shared `ApiError` class + sonner toasts.
- **2026-09-05** — `styles/globals.css` deleted (duplicate/empty); `app/globals.css` is the single source of truth for global styles.
- **2026-09-05** — Feature-based migration executed in one pass rather than feature-by-feature: `features/{home,hosting,projects,team}/` all created together, so the tree is never left half-migrated.
- **2026-09-05** — shadcn/ui primitives in `components/ui/` are exempt from PascalCase and stay lowercase as generated; the case-sensitivity mismatch between local Windows and the Ubuntu CI makes renaming them a deploy hazard. `components.json` aliases were repointed (`"utils": "@/lib/Utils"`) so generated components import our PascalCase modules.
- **2026-09-05** — `components/ui/` is reserved for shadcn primitives only. Application components that lived there (ContactForm, PricingCard, FeaturesCard, Field, Input, Textarea, …) moved to `features/home/components/`; `FooterLinks`/`FooterSocial` moved to `components/shared/` beside the Footer that uses them.
- **2026-09-05** — Shared constants and types folders are plural and named by scope: `constants/Site.ts` and `types/Shared.ts` at the root, `features/<name>/constants/` and `features/<name>/types/` per feature. The old singular `constant/` and the `types/index.ts` / `constant/index.ts` barrels are gone.
- **2026-09-05** — The Radix toast stack (`components/ui/toast.tsx`, `toaster.tsx`, `hooks/use-toast.ts` and their duplicates under `components/ui/`) was deleted; **sonner** is the only notification library. `<Toaster />` gets mounted in `app/layout.tsx` with the first real mutation.
- **2026-09-05** — `components/ui/sidebar.tsx` and `input-group.tsx` were deleted: unused, and already broken (they imported a non-existent `@/components/ui/textarea` and a named `Input` export that never existed). Re-add with `npx shadcn add` if ever needed.
- **2026-09-05** — Animation imports are standardized on `motion/react`. `framer-motion` was being imported in two components even though it is only a transitive dependency of `motion` and is not in `package.json`.
- **2026-09-05** — Internationalization uses **next-intl with a locale prefix on every route** (`/ar`, `/en`), not a cookie-only client toggle. Both locales are then indexable with `hreflang`, links carry their language, and 24 of our 42 components can stay client components while still translating through the same `useTranslations` hook.
- **2026-09-05** — Arabic is the default locale; `/` redirects to `/ar`.
- **2026-09-05** — The middleware lives in **`proxy.ts`**, the Next.js 16 name for the old `middleware.ts` convention. It runs on the `nodejs` runtime, which is fine for the self-hosted pm2 deploy.
- **2026-09-05** — Static rendering is kept via `generateStaticParams` + `setRequestLocale`. next-intl now prefers `next/root-params`, but that needs Next 16.3+ and the project is on 16.2.6 — revisit after the next Next.js upgrade.
- **2026-09-05** — Direction is handled with Tailwind logical properties plus `rtl:`/`ltr:` variants; no component hardcodes `dir`, except deliberate `dir="ltr"` islands for latin input, prices, and counters.
- **2026-09-05** — `app/[locale]/hosting/vps/page.tsx` was converted from a client page to a server page plus a `VpsCategoryTabs` client child, so the page can export `generateMetadata`. Its tabs are now driven by `VPS_CATEGORIES` in `features/hosting/constants/Hosting.ts`, which had been dead code.
