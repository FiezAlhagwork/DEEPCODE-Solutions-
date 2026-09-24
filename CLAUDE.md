# Frontend — CLAUDE.md

> Companion to the backend `CLAUDE.md`. Read both together. This file governs the **frontend** codebase only.

## Purpose & Scope

The frontend is a Next.js application serving the public marketing site, extended with an admin panel for managing site content. The first admin feature in scope is **Projects** (add/delete projects displayed publicly), gated to `super_admin` and `admin` roles — enforced by the backend, and now by the frontend too (`app/[locale]/admin/layout.tsx`'s role gate, see Auth & Roles below).

## Tech Stack

- **Framework:** Next.js 16 (App Router), React 19
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **UI components:** two separate layers, deliberately not shared.
  - *Public site:* the four shadcn/ui primitives left in `components/ui/` — `button`, `skeleton`, `tabs`, `sonner`. Everything else there was deleted once the admin stopped importing it.
  - *Admin panel, auth pages and the customer-facing app surfaces:* **our own components in `components/kit/`** (moved from `components/admin/ui/` on 2026-09-24) — no shadcn. The marketing primitives are tuned for a landing page (`components/ui/button.tsx` is `px-8 py-6 text-base` and full-width on mobile), which makes a dense dashboard look oversized.
- **Forms:** react-hook-form + zod + @hookform/resolvers
- **Data fetching / server state:** axios + TanStack Query (React Query) v5
- **Internationalization:** next-intl v4 (`ar` / `en`, locale-prefixed routes)
- **Notifications:** sonner (toasts)
- **Theming:** next-themes
- **Animation:** motion (Framer Motion)
- **Accessibility:** focus-trap-react (mobile navigation drawer)
- **Fonts:** `next/font/google` — **one typeface per locale**, not one stack. Arabic pages run entirely on **Cairo** (Arabic + Latin subsets, so digits and brand names inside Arabic text match); English pages run on **Space Grotesk**. Both are loaded in `app/[locale]/layout.tsx` and selected in `app/globals.css` via `--app-font`, overridden on `html[lang="en"]`.
- **Linting:** ESLint flat config (`eslint.config.mjs`) with `eslint-config-next/core-web-vitals` + `/typescript`
- **Analytics:** @vercel/analytics
- **Image pipeline:** `scripts/convert-images-to-webp.mjs` (uses `sharp`)
- **Auth:** `@clerk/nextjs`, scoped strictly to admin flows (sign-in/sign-up/invitation-acceptance + protecting admin routes). The UI is entirely hand-built (`features/auth/components/`) on top of Clerk's classic headless hooks, not Clerk's prebuilt components. The public site needs no authentication. See "Auth & Roles (Clerk)" below.

## Folder Structure — Feature-Based

Migrated from a flat, type-based structure (`components/`, `hooks/`, `services/`, `types/`, `constant/` shared across everything) to **feature-based**, mirroring the backend's `src/features/`.

```
app/                         # Next.js routes ONLY — no business logic
  globals.css
  [locale]/                   # every route lives under the locale segment
    layout.tsx                # the root layout: <html lang dir> + providers + <Toaster />
    not-found.tsx             # covers the public site and the admin panel
    error.tsx                 # retry screen — at THIS level on purpose, see Auth & Roles
    loading.tsx               # neutral spinner; covers admin/layout.tsx's role check
    (site)/                   # route group — public marketing site
      layout.tsx              # Navbar + Footer chrome
      page.tsx
      hosting/{page.tsx, vps/page.tsx, dedicated/page.tsx}
      projects/{page.tsx, [slug]/page.tsx}   # archive + one project's detail page
      account/                # the customer's own area (signed in; see proxy.ts)
        layout.tsx            # title + sign-out + section strip, inside the public frame
        page.tsx              # redirects to the only section so far
        requests/page.tsx     # "my requests" — an admin is redirected to /admin/requests
    (auth)/                   # route group — hand-built sign-in/up/invitation UI
      layout.tsx              # minimal centered shell, no Navbar/Footer/AdminShell
      sign-in/{page.tsx, loading.tsx}    # page redirects a signed-in visitor by role
      sign-up/{page.tsx, loading.tsx}
      accept-invitation/page.tsx         # shows AlreadySignedInCard when a session exists
      sso-callback/page.tsx    # completes Google OAuth — the one Clerk-component exception
    admin/                    # the admin panel — its own chrome, no Navbar/Footer
      layout.tsx              # QueryProvider + AdminShell + the admin/super_admin role gate
      page.tsx                # dashboard
      projects/{page.tsx, new/page.tsx, [id]/page.tsx}
      categories/{page.tsx, new/page.tsx, [id]/page.tsx}
      users/page.tsx
      requests/page.tsx       # the team's queue of customer requests
      account/page.tsx        # the signed-in admin's own account + sessions

messages/                    # all UI copy, one file per locale
  ar.json
  en.json
i18n/
  routing.ts                  # locales + defaultLocale
  navigation.ts               # locale-aware Link / useRouter / usePathname
  request.ts                  # loads messages/<locale>.json per request
  metadata.ts                 # canonical + hreflang helper
  Locale.ts                   # requireLocale() — validates the [locale] segment
global.d.ts                   # types every message key against messages/ar.json
proxy.ts                      # next-intl middleware + clerkMiddleware (Next 16 "proxy" convention)
eslint.config.mjs

features/
  home/
    components/               # Hero, About, Features, Services, Pricing, Contact
                              # + their cards/lists/form primitives
    constants/Home.ts
    types/Home.ts
  hosting/
    components/               # Products, ProductList, ProductCard,
                              # VPSSection, DedicatedSection, VpsCategoryTabs
    hooks/UseProducts.ts
    services/Hosting.ts
    types/Hosting.ts
    constants/Hosting.ts
    QueryKeys.ts
  projects/
    components/               # ProjectsSection (home teaser), ProjectsBrowser
                              # (archive: tabs + load more), ProjectList,
                              # ProjectCard, ProjectCover, ProjectGallery,
                              # ProjectLinks, RelatedProjects
      admin/                  # ProjectsTable, ProjectForm, ProjectStats,
                              # RecentProjectsPanel — admin views of the same
                              # domain, kept apart from the public ones
    hooks/UseProjects.ts
    services/Projects.ts
    schemas/Projects.ts       # zod factory + derived ProjectFormValues
    types/Projects.ts
    utils/Projects.ts         # buildProjectFormData for the multipart body
    QueryKeys.ts
  categories/
    components/admin/         # CategoriesTable, CategoryForm, CategoryStats
    hooks/UseCategories.ts    # the only translated mutation toasts so far
    services/Categories.ts
    schemas/Categories.ts
    types/Categories.ts
    utils/Categories.ts       # buildCategoryPayload
    QueryKeys.ts
  users/
    components/admin/         # UsersTable, UsersPageActions, InviteUserModal,
                              # ChangeRoleModal, UserStats
    hooks/UseUsers.ts         # translated toasts, same as categories
    services/Users.ts
    schemas/Users.ts          # zod factory for the invite form
    types/Users.ts
    utils/Users.ts            # fullName
    QueryKeys.ts
  account/                    # the signed-in admin's own account — Clerk-backed,
                              # not `lib/Api.ts`-backed. See the Decisions Log.
    components/admin/         # AccountProfilePanel, AccountProfileForm,
                              # AccountAvatarField, AccountSessionsPanel,
                              # AccountSessionCard
    hooks/UseAccount.ts       # sessions query + revoke/profile/photo mutations
    schemas/Account.ts        # zod factory for the name form
    types/Account.ts          # Clerk resource types derived from `useUser`
    utils/Account.ts          # session device/location labels + active filter
    QueryKeys.ts
  requests/                   # a customer's request for a server plan (a lead,
                              # not an order) — five layers, types named PlanRequest
    components/               # RequestModal + RequestForm (opened from ProductCard),
                              # PhoneField, RequestTypeField, RequestStatusBadge,
                              # MyRequestsTable
      admin/                  # RequestsTable, RequestDetailsModal,
                              # MarkContactedDialog, PhoneActions,
                              # RequestStats (dashboard), PendingRequestsBadge (sidebar)
    hooks/UseRequests.ts      # useRequests, useCreateRequest (retries a 409 once),
                              # usePendingRequestsCount (polls), useMarkContacted
    services/Requests.ts
    schemas/Requests.ts
    types/Requests.ts
    constants/Countries.ts    # ISO + dial codes only; names come from Intl.DisplayNames
    utils/Requests.ts         # countryOptions, composePhone, buildRequestPayload
    QueryKeys.ts
  team/
    components/               # Team, TeamList, TeamCard
    constants/Team.ts
    types/Team.ts
  auth/
    components/               # SignInView, SignUpView, AcceptInvitationView — hand-built
                              # forms on Clerk's headless hooks (@clerk/nextjs/legacy),
                              # + CodeInput, GoogleButton, SsoCallbackView
                              # + AlreadySignedInCard (invitation opened with a live session)
    schemas/Auth.ts           # zod factories: sign-in email, sign-up details, name, code
    services/Auth.ts          # getMyProfile()/getMyProfileWithRetry() — GET /api/auth/me
    types/Auth.ts             # MyProfile, AuthViewProps, CodeInputProps, GoogleButtonProps
    utils/Auth.ts             # clerkFieldError()/clerkErrorMessage()/withTimeout(),
                              # landingPathForProfile() — the single role decision,
                              # safeReturnTo()/authPageHref() — `?returnTo=` handling

# Shared across ALL features — stays at root, never duplicated inside features/
components/
  ui/                         # shadcn/ui primitives ONLY (lowercase — see Naming)
                              # public site only; the admin panel does not use these
  admin/                      # admin chrome: AdminShell, AdminSidebar, AdminHeader
                              # (its avatar is the real signed-in admin's, and
                              # links to /admin/account),
                              # AdminMobileSidebar, AdminNavLinks, PageHeader, badges,
                              # SignOutButton
  kit/                        # our own component library (PascalCase), used by the
                              # admin panel, the auth pages, the order modal and the
                              # customer area: Button, IconButton, Panel, DataTable,
                              # TableToolbar, TableState, Pagination, TextInput,
                              # SelectInput, TextArea, Field, FormLayout, Modal,
                              # Badge, Tooltip, Avatar, EmptyState, FileDropzone
  account/                    # customer-area chrome: AccountNav (section strip)
  shared/                     # Navbar, Footer, FooterLinks, FooterSocial,
                              # AccountEntry (navbar: sign-in button / avatar),
                              # AccountMenu (the avatar's menu: my requests, sign out),
                              # NavigationOverlay, ScrollToTop, ClerkTokenSync,
                              # PageHero (hosting + projects page headers),
                              # PendingScreen + ErrorScreen (route-level status screens)
lib/
  Api.ts                       # single axios instance + ApiError + auth interceptor
  ClerkTokenBridge.ts           # lets lib/Api.ts's interceptor reach the Clerk token
  CloudinaryLoader.ts           # next/image loader — skips Next's optimizer for Cloudinary
  Images.ts                     # compressImage() — resize + WebP before upload
  Utils.ts
providers/
  QueryProvider.tsx
hooks/
  UseMobile.ts                 # generic, not feature-specific
  UseSidebarCollapsed.ts       # admin sidebar collapse, persisted in localStorage
  UseListControls.ts           # search/debounce/paging/filters behind every admin grid
  UseConfirmedAction.ts        # the record a confirm dialog is asking about
constants/
  Site.ts                      # siteNavLinks (navbar + drawer), footer links,
                               # contact info — shared by several components → root
  AdminNav.ts                  # admin nav items + route-matching helpers
  AccountNav.ts                # the customer area's sections
  Admin.ts                     # ADMIN_PAGE_SIZE
types/
  Shared.ts                    # cross-cutting: route props, ChildrenProps,
                               # LocalizedText, Paginated<T>, footer/contact types
  Admin.ts                     # admin chrome props + AdminNavItem
  Kit.ts                       # every props type in components/kit/
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

## Auth & Roles (Clerk)

- **Role is never determined at the edge.** `proxy.ts` composes `clerkMiddleware()` around the existing next-intl middleware and, for any `/:locale/admin(.*)` or `/:locale/account(.*)` path, calls `auth.protect()` (sending a signed-out visitor to `/sign-in?returnTo=<the path they asked for>`) — that's a "signed in at all?" check only, resolved locally from the session JWT, no network call. It cannot know `admin` vs `user`, because — same as the backend — role lives only in the backend's own MongoDB, never in a Clerk session claim.
- **The real role gate is `app/[locale]/admin/layout.tsx`**, an async Server Component: it calls `auth()`, gets a token via `getToken()`, and calls `getMyProfile(token)` (`features/auth/services/Auth.ts`, hitting `GET /api/auth/me`). Non-admins are `redirect()`-ed (from `@/i18n/navigation`) to `/`; a signed-out request is defense-in-depth (`proxy.ts` should already have caught it). This makes every route under `admin/` dynamic (`ƒ` in `next build`'s output, not `●`) — expected and correct, not a regression, since an authorization check can't be statically pre-rendered.
- `GET /api/auth/me` always returns `200` for any authenticated caller and never `403`/`404` — its `data.synced` flag distinguishes a fully-synced profile (with `role`) from "no local `User` doc yet" (`role: null`). That second case is real, not theoretical: an invited user's local record is created by an async Clerk webhook *after* they finish sign-up, so the very first check right after redirect can land in the gap. The layout retries once, after a 1.5s delay, before giving up and sending them home — see `features/auth/types/Auth.ts`'s `MyProfile` for the exact shape.
- **`lib/Api.ts` attaches the session token to every request**, which is what makes the projects/categories/users mutation hooks (built before Clerk existed) actually authenticate now that someone can sign in. An axios interceptor isn't a React component and can't call `useAuth()`, and `window.Clerk` isn't ambiently typed by the installed `@clerk/nextjs`/`@clerk/react` versions — so instead, `components/shared/ClerkTokenSync.tsx` (mounted once inside `<ClerkProvider>` in the root locale layout, renders nothing) registers `useAuth().getToken` into a tiny module-level holder in `lib/ClerkTokenBridge.ts`, which the interceptor reads. The one server-side call (`getMyProfile` from the admin layout) passes its own token explicitly instead, since there's no client tree to read it from there.
- **The sign-in/sign-up/accept-invitation UI is hand-built, not Clerk's prebuilt `<SignIn>`/`<SignUp>` components.** They were tried first (themed via an `appearance` prop) and rejected on sight — same standing preference as the shadcn rejection that shaped `components/admin/ui/` in the first place (see the Decisions Log entries below and the "build our own UI" note in project history — the library now lives at `components/kit/`). The four routes under `app/[locale]/(auth)/` (own minimal shell, no Navbar/Footer/AdminShell) are plain `page.tsx` files now, not catch-alls — Clerk's own components needed `[[...sign-in]]`-style sub-routing for their internal steps, but a hand-built form just tracks its step as component state instead.
- **This Clerk instance is fully passwordless**: email one-time-code (`email_code`) as the primary factor, Google OAuth as the only social option, no password/username/phone/MFA. Confirmed by querying the instance's own public `/v1/environment` endpoint (decoded from the publishable key) rather than assumed — the sign-in/sign-up forms only have the fields this instance actually asks for.
- **Classic Clerk hooks, not the newer signal-based ones.** `@clerk/nextjs@^7` ships two different APIs for `useSignIn`/`useSignUp`: the bare `import ... from "@clerk/nextjs"` gives an experimental signal-based "future" API (`signIn.emailCode.sendCode()`, `finalize()` instead of `setActive()`); `import ... from "@clerk/nextjs/legacy"` gives the classic, well-documented shape (`isLoaded`/`signIn`/`signUp`/`setActive`, `create()`/`prepareFirstFactor()`/`attemptFirstFactor()`). Every auth view imports from `@clerk/nextjs/legacy` deliberately, chosen for stability over novelty.
- **`features/auth/components/CodeInput.tsx`** — six separate boxes for the one-time code, not a single text field: auto-advance on digit entry, backspace navigates back, full-code paste distributes across all six. No OTP component existed anywhere in the codebase; this one is now the only place a verification code is entered.
- **`features/auth/components/GoogleButton.tsx`** — our own button (inline multi-color "G" SVG, `components/kit/Button` styling), not Clerk's `<SignInWithMetamaskButton>`-style prebuilt. The actual `authenticateWithRedirect()` call stays in each parent view since `signIn` and `signUp` call it on different resources.
- **`app/[locale]/(auth)/sso-callback/`** is the one deliberate exception that still renders a Clerk component (`<AuthenticateWithRedirectCallback>`, in `SsoCallbackView.tsx`). Completing an OAuth redirect is an unavoidable full-page round trip through Google and back; that component has no real visual design to reject, it just finishes the handshake — same category as `useSignIn`/`useSignUp` themselves (headless logic, not a themed widget).
- **Cloudflare Turnstile (`captcha_enabled: true` on this instance) runs on every `signUp.create()` call, not just the regular sign-up strategy** — `AcceptInvitationView.tsx`'s ticket flow calls `signUp.create()` too, and needs its own `<div id="clerk-captcha" />` for the same reason `SignUpView.tsx` does. Found the hard way: without it, Clerk logs "the `clerk-captcha` DOM element was not found; falling back to Invisible CAPTCHA widget" and falls back to a less reliable invisible check — which is why an early manual test succeeded once and then failed on a later attempt. Both views render the div unconditionally (not inside any step/phase), since it must already be in the DOM before their first `signUp.create()` call fires.
- **`accept-invitation` collects a name Clerk's ticket doesn't carry.** The ticket strategy (`signUp.create({ strategy: "ticket", ticket })`) pre-verifies the invited email, but this instance requires `firstName`/`lastName`, which an invite never supplies — `AcceptInvitationView.tsx` checks `signUp.status`, and if it's `"missing_requirements"` it shows a short name form before calling `signUp.update(...)`. **Where the invitation email links to is a backend code parameter, not a Clerk Dashboard setting**: `clerkClient.invitations.createInvitation({ ..., redirectUrl })` (called from the backend's `inviteUser`) needs `redirectUrl: "{frontendOrigin}/ar/accept-invitation"` — without it, Clerk defaults the link to `/sign-up`, which never collects the name-completion step this instance requires. This is a backend change, tracked as a pending item, not something Dashboard configuration alone can achieve.
- **This instance runs in single-session mode, so the auth pages redirect a visitor who is already signed in — by role.** `sign-in/page.tsx` and `sign-up/page.tsx` call `auth()`, and when a `userId` exists they fetch the profile and `redirect()` to `landingPathForProfile(profile)`: `/admin` for `admin`/`super_admin`, `/` for everyone else. Without the redirect, every call those forms make — `signIn.create()`, `signUp.create()` and both `authenticateWithRedirect()` paths — is rejected by Clerk with `session_exists` ("You're already signed in"), which is a form that cannot succeed no matter what is typed into it. Without the *role* part, a plain user would be sent to `/admin` and bounced straight back off the gate, visibly passing through a panel that was never theirs. `accept-invitation` handles the same session trap differently — see below. All three routes are dynamic (`ƒ`) in `next build` as a result, same as the admin routes and for the same reason.
- **`?returnTo=` on `/sign-in` and `/sign-up`** is where to go once signed in — the product a visitor was about to order, or the protected page they were bounced from. Both pages validate it with `safeReturnTo()` (internal, root-relative paths only; `//host`, a backslash and absolute URLs are dropped, so the page is not an open redirect) and pass it to the view, which uses it in place of `/admin` for `router.push` and Google's `redirectUrlComplete`, and carries it across the sign-in / sign-up link. An already-signed-in visitor with a `returnTo` is redirected straight to it. The path is locale-less; the locale-aware router adds the locale. Without a `returnTo`, behaviour is unchanged.
- **`landingPathForProfile()` (`features/auth/utils/Auth.ts`) is the only place that decides what counts as an admin**, and `getMyProfileWithRetry()` (`features/auth/services/Auth.ts`) is the only place that owns the retry-once-on-unsynced behavior. The admin gate and both auth pages call them; neither rule is written twice.
- **Route-level status screens live at the `[locale]` level, and that is structural, not stylistic.** A segment's `error.tsx` catches throws from the layouts *below* it, and its `loading.tsx` renders *inside* its own layout — so an `admin/error.tsx` or `admin/loading.tsx` could never cover `admin/layout.tsx`'s own role check, which is precisely the await that blocks and the throw that happens when the backend is unreachable. Hence `app/[locale]/error.tsx` (retry + back home, via `components/shared/ErrorScreen.tsx`) and `app/[locale]/loading.tsx` (bare spinner, via `PendingScreen.tsx`). The locale-level loader also shows on public-site navigations, so its copy stays neutral; `sign-in/loading.tsx` and `sign-up/loading.tsx` carry the specific "checking your account" wording.
- **The retry button needs `startTransition` + `router.refresh()` + `reset()` together** — `reset()` alone replays the same cached RSC payload, and without the transition it re-throws the stale error before the refreshed payload arrives. See the dated Decisions Log entry; this was established against a backend taken down and brought back, not from the docs.
- **`accept-invitation` shows an "already signed in" card rather than redirecting.** An invitation link is usually opened by someone signed in as a *different* account, and in single-session mode the ticket would just be rejected — so the page names the account they're signed in as and offers `SignOutButton`, whose optional `redirectUrl` points back at the invitation link itself, ticket included.
- **`withTimeout()` in `features/auth/utils/Auth.ts` races every awaited Clerk call against a 30s deadline**, rejecting with an `AuthTimeoutError` that carries an already-translated message (`auth.common.timeoutError`), which `clerkErrorMessage()` passes straight through. A Clerk call can stall rather than reject: `signUp.create()` waits on a Cloudflare Turnstile token, and when the widget never produces one, **no request is ever sent** and the promise stays pending forever — the submit button spins indefinitely with nothing to report. `authenticateWithRedirect()` is deliberately left unwrapped: its promise is *meant* never to resolve, because it navigates the page away.
- Clerk error mapping lives in `features/auth/utils/Auth.ts`: `clerkFieldError(error, paramName)` pulls a field-specific message out of `ClerkAPIResponseError.errors[]` (matched on `meta.paramName`, which is untyped — checked at runtime) for inline display via `Field`'s `error` prop; `clerkErrorMessage(error, fallback)` is the generic case, shown via `sonner`'s `toast.error`, same pattern as every mutation hook's `onError`.
- No `appearance`/`localization` props exist anywhere anymore — `lib/ClerkAppearance.ts` and the `@clerk/localizations` dependency were both deleted once nothing rendered a Clerk-styled component to theme. `<ClerkProvider>` is bare; it only exists to make `useAuth()`/`useSignIn()`/`useSignUp()` work.

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

**`<Toaster />` is mounted once, in `app/[locale]/layout.tsx`** (sonner's own component, directly — `components/ui/sonner.tsx` is an unused shadcn wrapper that depends on a `next-themes` provider this app never mounts). Every `toast.*` call in the codebase — the three mutation-hook families and all three auth views — renders through it. It is not optional plumbing: with no `<Toaster />` in the tree, `toast.error()` is a no-op that throws nothing and logs nothing, so a failed call looks exactly like a button that does nothing at all. The toast palette is themed in `app/globals.css` off `[data-sonner-toaster]`, using the same `--surface-*`/`--ink`/`--danger` tokens as the admin panel, and `dir` is set from the locale.

## Data Fetching & State (TanStack Query)

- Every feature owns its own `QueryKeys.ts` — **decentralized**, co-located with the feature, not a single shared file.
- Query keys are exported as functions, e.g. `projectKeys.list(filters)`, `projectKeys.detail(id)`, `projectKeys.all`.

## Naming Conventions

| What | Convention | Example |
|---|---|---|
| All files we write — components, hooks, services, types, utils, constants | PascalCase | `ProductCard.tsx`, `UseProducts.ts`, `Hosting.ts`, `QueryKeys.ts` |
| Folders | lowercase | `features/hosting/components/` |
| **Exception:** shadcn/ui primitives in `components/ui/` | lowercase, as generated | `button.tsx`, `dialog.tsx`, `tabs.tsx` |

## Where Code Lives — One Concern Per File

These are hard rules, not preferences. A component file contains a component.

**1. No type is ever declared inside a component file.** Every `type` — props included — lives in a types file: `features/<name>/types/<Name>.ts` for feature-scoped types, `types/*.ts` at the root for anything shared or non-feature (`Shared.ts`, `Admin.ts`, `Kit.ts`). Inline anonymous props in a signature (`function X({ a }: { a: string })`) count as a violation too — name the type and import it.

```tsx
// wrong                              // right
type ButtonProps = { … };             import type { ButtonProps } from "@/types/Kit";
export default function Button(…)     export default function Button(…)
```

Route files are no exception: they take `LocaleRouteProps` / `LocaleIdRouteProps` from `types/Shared.ts`, and layouts/providers take `ChildrenProps`.

**2. Zod schemas live in `features/<name>/schemas/<Name>.ts`.** Because error messages come from `useTranslations`, a schema that validates user-facing input is exported as a **factory** taking the translator (and any prop it depends on), never as a bare constant:

```ts
export const createProjectSchema = (t, tCommon, isEdit: boolean) => z.object({ … });
export type ProjectFormValues = z.input<ReturnType<typeof createProjectSchema>>;
```

The component calls it inside `useMemo` so `zodResolver` keeps a stable identity. Types **derived** from a schema (`…FormValues`) stay in the schema file — they are the schema's output, not independent declarations.

**3. `constants/` files hold data only** — no exported functions, no `.map()` that builds the exported value, no local helper types. If data needs shaping, either write it out literally or move the logic to a utils file.

**4. `features/<name>/utils/<Name>.ts` holds a feature's pure helpers** (`fullName`, `categoryById`, dashboard aggregations). Root `lib/` stays for genuinely cross-cutting utilities (`cn`, the axios instance).

**5. Hooks live in `hooks/` (generic) or `features/<name>/hooks/` (feature).** Never inside `components/`.

**Two deliberate exemptions**, both load-bearing — do not "fix" them:
- `global.d.ts` uses `interface`, not `type`: TypeScript's declaration merging into `next-intl`'s `AppConfig` requires an interface.
- `i18n/routing.ts` exports `type Locale` next to the `routing` const it is derived from; moving it would create a circular import.

**Why the shadcn exception:** `npx shadcn add <component>` always writes lowercase filenames. Renaming them means every future `add` silently recreates a duplicate file differing only in case — which resolves fine on Windows but breaks the deploy, since the CI in `.github/workflows/deploy.yml` builds on Ubuntu where imports are case-sensitive. Our own code stays PascalCase; generated primitives stay as generated. The `components.json` aliases point at our PascalCase paths (`"utils": "@/lib/Utils"`) so newly added primitives import them correctly.

## Internationalization (next-intl)

The site ships in Arabic and English at `/ar/...` and `/en/...`. `/` redirects to `/ar`. Both locales are prerendered statically.

**Hard rules:**

1. **No user-facing string literal ever appears in JSX.** Every label, heading, placeholder, `aria-label`, `alt`, and error message comes from `messages/<locale>.json` via `useTranslations`. The only literals left in components are brand names (DEEPCODE, Ryzen, GitHub) and data from the external hosting API.
2. **Import `Link` and the navigation hooks from `@/i18n/navigation`, never from `next/link` or `next/navigation`** — otherwise the locale prefix is dropped and the user is bounced back to the default locale. In-page anchors are written root-relative (`/#contact`, not `#contact`) so they work from every route.
3. **A button that navigates is `<Button asChild><Link …></Button>`**, never `<Link><Button></Link>` — the latter renders a `<button>` inside an `<a>`, which is invalid HTML.
4. **Route params are validated, not cast.** `params.locale` is typed `string` by Next; pass it through `requireLocale()` from `i18n/Locale.ts`, which narrows to the locale union and 404s on anything else. Typing the param as the union directly breaks the route validator that `next build` generates.
5. **Message keys are type-checked** through the `AppConfig` augmentation in `global.d.ts`, and key unions are derived from it (e.g. `keyof Messages["team"]["members"]`) rather than typed as `string`. A typo is a build error, not a runtime crash.
6. **Constants hold structure, messages hold text.** A constants file keeps ids, icons, hrefs, images, and prices, plus a `key` that resolves against a message namespace. See `features/home/constants/Home.ts` (`serviceItems`, `pricingPlans`) and `features/team/constants/Team.ts`.
7. Message namespaces mirror the features: `metadata`, `nav`, `hero`, `about`, `features`, `services`, `pricing`, `projects`, `team`, `contact`, `footer`, `hosting`, `common`, `notFound`.
8. `useTranslations` works in **both** server and client components — no prop threading. Async server functions (`generateMetadata`) use `getTranslations({locale, namespace})` instead.
9. Every page and layout calls `setRequestLocale(locale)` **before** any translation call, otherwise it opts out of static rendering. (`next/root-params` would replace this, but it needs Next 16.3+ and we are on 16.2.6.)
10. Interpolated numbers are passed as strings (`{ year: String(...) }`) — ICU would otherwise group them as `2,026`.
11. Highlighted fragments inside a heading use `t.rich("title", { hl: (c) => <span…>{c}</span> })` with `<hl>` in the message, never string concatenation.

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
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk's client-side publishable key, read by `<ClerkProvider>` in `app/[locale]/layout.tsx`. Same Clerk application as the backend's `CLERK_SECRET_KEY`/`CLERK_WEBHOOK_SIGNING_SECRET` — different key types, one instance. |
| `CLERK_SECRET_KEY` | Clerk's server-side secret key, used by `clerkMiddleware()` (`proxy.ts`) and `auth()` (`app/[locale]/admin/layout.tsx`). |

## Commands

```bash
npm run dev               # start dev server
npm run build              # production build
npm run start              # start production server
npm run lint               # eslint (flat config; `next lint` was removed in Next 16)
npm run optimize-images    # convert images to webp (scripts/convert-images-to-webp.mjs, uses sharp)
```

## Feature Status

| Feature | Status |
|---|---|
| Home | **Migrated.** `features/home/` holds every home-page section plus the card/list/form components that used to sit incorrectly in `components/ui/`. Purely presentational — no backend calls. |
| Hosting | **Migrated.** `features/hosting/` implements the full five-layer pattern: `lib/Api.ts` (shared error handler + axios) → `services/Hosting.ts` → `hooks/UseProducts.ts` → components, with query keys in `features/hosting/QueryKeys.ts` (`productKeys.all` / `productKeys.list(type, category)`). Public, read-only — no mutations yet. |
| Projects | **Wired to the API on both sides.** Admin: `ProjectsTable` (debounced server search, status/category filters, server paging, delete), `ProjectForm`, `ProjectStats`, `RecentProjectsPanel`. Public: the home section shows the first six and links to `/projects`, which browses every published project through category tabs plus a "load more" button, and `/projects/[slug]` is a full detail page (cover, description, links, gallery, related projects) with its own metadata. Both mock files are gone and there is now **one** `Project` type. |
| Categories | **Wired to the API.** `CategoriesTable` reads `useCategories({ page, limit, q })` with server-side search and paging; `CategoryForm` loads through `useCategory(id)` and writes through the create/update mutations; delete runs from the table with the backend's `CATEGORY_IN_USE` refusal explained in Arabic. The mock constants file is gone. Its toasts are the only translated ones in the panel so far — see the Decisions Log. |
| Users | **Wired to the API — the last feature to leave mock data.** `UsersTable` reads `useUsers({ page, limit, q, role })` with server-side search, role filter and paging; invite, change-role and deactivate all run their mutations, with translated toasts. The panel's write actions are `super_admin`-only and are disabled (with a reason) for anyone else, and on the viewer's own row. `constants/Users.ts` is deleted, and so is the dashboard's last placeholder tile (`UserStats`). |
| Account | **Done.** `/admin/account` — the signed-in admin's own photo and name (edited through Clerk), their email/role/status (read from `GET /api/auth/me` on the server), and the list of devices signed in to the account, each with a revoke button. The only feature whose data does not come from `lib/Api.ts`; see the Decisions Log for why it still runs on TanStack Query. No backend work was needed — the existing `user.updated` webhook syncs edits into our own `User` document. |
| Requests | **Done, both sides.** The product card's button opens `RequestModal` (one per product list): a visitor sees the product and a sign-in button that brings them back with the modal reopened (`?order=<id>`); a signed-in customer picks purchase/inquiry, a phone number (country picker, Syria first) and optional notes, and `POST /api/requests` records the lead. `/account/requests` lists their own requests with server paging. The team's side: `/admin/requests` lists every request (opens on "pending", server-side status filter and paging), a details dialog with the notes in full, call / WhatsApp / copy on the phone number, and a confirmed, one-way "mark contacted" (`PATCH /api/requests/:id/status`). The pending count shows as a sidebar badge and a dashboard tile. |
| Admin panel (chrome) | **Done, and now protected.** `app/[locale]/admin/` with its own shell: a sidebar that collapses to an icon rail (persisted in `localStorage`), a route-derived breadcrumb, and the component library in `components/kit/`. `admin/layout.tsx` gates every route on `admin`/`super_admin` — see "Auth & Roles (Clerk)". |
| Team | **Migrated.** `features/team/` — static data, presentational only. |
| i18n (ar / en) | **Done.** Every route is prerendered in both locales; all copy lives in `messages/`. The language button in the navbar and the mobile overlay is `components/shared/LocaleSwitcher.tsx`, which swaps the locale while staying on the current route. |
| Auth (Clerk on frontend) | **Done.** Sign-in, sign-up and a dedicated invitation-acceptance page (`app/[locale]/(auth)/`), role-based redirect (`admin`/`super_admin` → `/admin`, everyone else → `/`), and route protection on `/admin`. See "Auth & Roles (Clerk)". Public site needs no auth. |

## Known Issues / Cleanup Backlog

- **`NEXT_PUBLIC_SITE_URL` is not set on the server yet**, so `canonical` and `hreflang` are baked into the production HTML as `http://localhost:3000/...`. Highest-impact, lowest-cost SEO fix outstanding.
- The contact form still has an empty `onSubmit` — nothing is sent anywhere. `react-hook-form`, `@hookform/resolvers`, and `zod` are installed and reserved for it. Blocked on a backend endpoint; see the five-layer plan in the Decisions Log.
- No `app/robots.ts` or `app/sitemap.ts`, and no OpenGraph/Twitter metadata — link previews are blank and search engines are not told about the locale pairs.
- `i18n/metadata.ts` emits `hreflang` for `ar` and `en` but no `x-default`.
- The navbar has no link to the Team section (`#team`). Projects got one on 2026-09-24 ("Our work" → `/projects`).
- `app/[locale]/hosting/page.tsx` is still a placeholder rendering a single translated word.
- `messages/en.json` is a first-pass translation of the Arabic marketing copy and should be reviewed by a native speaker before launch.
- `.github/workflows/deploy.yml` uses `npm install` rather than `npm ci`, builds directly on the production box with no CI gate, and has no `concurrency` group, so two quick pushes race.
- ~~**The public site's English pages scroll horizontally by 27px on a 390px viewport.**~~ **Fixed 2026-09-15** — and the guess recorded here (`NavigationOverlay`'s drawer) was wrong; the cause was the `x: 50` entry animation in `About` and `Contact`. See the Decisions Log.
- **`GET /api/users` hardcodes `status: "active"`, so the panel can never show a deactivated account.** `listUsers` in the backend's `user.service.js` puts it straight into the filter with no query parameter to override it. The consequence on this side is that the users table has no status column at all (it would read "active" on every row forever) and that deactivating someone is confirmed by their row leaving the list. If the panel ever needs to show or reactivate deactivated accounts, the backend change is to accept an optional `status` on `listUsersQuerySchema` and pass it through — a backend-repo change, not something this repo can do.
- **An admin has no "my requests".** `GET /api/requests` returns *every* request to an `admin`/`super_admin` and takes no parameter to ask for "only mine", so the customer's `/account/requests` would show an admin the whole queue under that title. The page redirects them to `/admin/requests` instead. The clean fix is a backend one — an optional `?mine=true` that scopes the list to the caller regardless of role.
- **Every public component that lists projects must pass `status: "published"` itself.** `lib/Api.ts` attaches the Clerk token to every browser request, and the backend shows drafts to any request carrying an admin session — so a public list that forgets it shows a signed-in admin a different site than a visitor sees. Three call sites carry it today (the home section, the archive, the detail page's related row); a fourth would have to remember. Encoding it once in a `usePublishedProjects` wrapper was offered and the manual route chosen instead, so this is the reminder.
- **`components/kit/Field.tsx` only wires `aria-invalid`/`aria-describedby` when its children are passed as a render prop** — and every caller in the panel passes plain JSX instead, so that wiring is silently skipped on every admin form. The error text renders and is visible, but a screen reader is never told the control is invalid, which is the exact gap the component was introduced to close. Fixing it means either converting every call site or having `Field` clone a single child element to inject the props.
- ~~**Invitation emails still link to the default `/sign-up`, not `/accept-invitation`.**~~ **Done** (backend side, by the backend owner): `inviteUser` now passes `redirectUrl: "{frontendUrl}/ar/accept-invitation"` to `clerkClient.invitations.createInvitation(...)`. Verified by reading the backend's `user.service.js` and by an invitation that reached `status: "accepted"` end to end. Left here only to record that the per-invitation code parameter — not a Clerk Dashboard setting — was the right fix.

## Pending Decisions (TBD)

- ~~Whether the public `features/projects` mock is migrated onto the real API shape.~~ **Decided 2026-09-16** — see the Decisions Log.
- `features/hosting/types/Hosting.ts` exports `Category` and `Type`; `features/categories/types/Categories.ts` also exports `Category`. Two unrelated meanings, same name — worth renaming the hosting one.
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
- **2026-09-05** — Every navigating button is `<Button asChild><Link>`; nine CTAs across the site were inert `<button>`s with no handler, and two wrapped a `<Button>` inside a `<Link>` (a `<button>` inside an `<a>`).
- **2026-09-05** — In-page anchors are root-relative (`/#contact`). The footer, team cards, and join link used bare `#contact`, which silently did nothing on every route except the home page.
- **2026-09-05** — Translation keys are type-checked via an `AppConfig` augmentation in `global.d.ts`, and every `key` field in a constants file is typed as `keyof Messages[...]` instead of `string`.
- **2026-09-05** — `params.locale` stays typed `string` and is narrowed by `requireLocale()` in `i18n/Locale.ts`. Typing the route param as the locale union looks tidier but fails the route validator `next build` generates.
- **2026-09-05** — `typescript.ignoreBuildErrors` and `images.unoptimized` were both removed from `next.config.mjs`; `sharp` moved to `dependencies` since the production server now runs the image optimizer.
- **2026-09-05** — `components/ui/` was pruned to the four primitives actually used (`button`, `skeleton`, `tabs`, `sonner`), and the 32 packages that only those deleted files imported were uninstalled. Dependencies went from 47 to 21.
- **2026-09-05** — ESLint runs through a flat config with `eslint-config-next`; `components/ui/` is ignored since it is generated code. It immediately caught two `setState`-in-effect violations and a `role="switch"` with no `aria-checked`.
- **2026-09-05** — The mobile drawer uses `inert` when closed plus `focus-trap-react` when open. It previously carried `aria-hidden` over links that were still in the tab order, and the drawer's open state is now derived (`isOpen && isMobile`) rather than synced in an effect.
- **2026-09-06** — Typography is **per locale, not a mixed stack**. Space Grotesk replaced Cairo for English, which was rendering Latin text in Cairo's weak Latin glyphs. A Latin-first shared stack was tried first and rejected: it also reassigned the digits, prices, and brand names *inside* Arabic pages, so Arabic sections turned into two competing typefaces. The switch now happens in `app/globals.css` — `--app-font` defaults to Cairo on `:root` and is overridden on `html[lang="en"]`, so every `font-sans` usage follows the locale with no per-component logic. Cairo keeps both its `arabic` and `latin` subsets for that reason.
- **2026-09-06** — The Black Ops One font was removed: it was downloaded on every page while its CSS variable `--font-black_ops_one` was never referenced anywhere in the codebase.
- **2026-09-06** — Button labels are **two to three words** in both locales. Long CTAs ("Book a free consultation", "View all VPS offers", "احجز استشارتك المجانية", "عرض جميع عروض VPS") read as sentences rather than actions and wrap badly at small sizes.
- **2026-09-05** — `hooks/UseMobile.ts` was rewritten on `useSyncExternalStore`, removing the mount-time state sync it inherited from shadcn.
- **2026-09-05** — `app/[locale]/hosting/vps/page.tsx` was converted from a client page to a server page plus a `VpsCategoryTabs` client child, so the page can export `generateMetadata`. Its tabs are now driven by `VPS_CATEGORIES` in `features/hosting/constants/Hosting.ts`, which had been dead code.
- **2026-09-07** — The admin panel gets **its own component library at `components/admin/ui/`** (PascalCase, like the rest of our code) instead of shadcn primitives. Reusing the public site's primitives was the main reason the first dashboard looked unprofessional: every control inherited marketing-CTA sizing. `badge`, `dialog` and `separator` were deleted from `components/ui/` once nothing imported them; `card`/`table`/`input`/`label`/`select`/`textarea` follow when the remaining admin pages migrate. The public site's `button`/`tabs`/`skeleton` stay untouched — 12 shipped pages depend on them.
- **2026-09-07** — Admin surfaces run on **tokens, not hex literals**: `--surface-0..3`, `--hairline`/`--hairline-strong`, `--ink`/`--ink-muted`/`--ink-faint`, `--success`/`--warning`/`--danger` in `app/globals.css`, exposed to Tailwind through `@theme inline`. They replace `#0D0D0E`/`#1F1E20`/`#0B0A0E`, which had been repeated across nine files.
- **2026-09-07** — The sidebar width lives in one custom property, `--admin-sidebar-w`, set on the shell wrapper and read by both the fixed sidebar and the content column's margin. It previously existed as two unrelated literals (`w-64` in the sidebar, `ms-64` in the shell), which is why the sidebar could not collapse at all. Collapsed state is persisted in `localStorage` and read through `useSyncExternalStore` (`components/admin/UseSidebarCollapsed.ts`) — an effect that calls `setState` would both trip `react-hooks/set-state-in-effect` and render one frame at the wrong width.
- **2026-09-07** — Admin data grids are one component (`components/admin/ui/DataTable.tsx`). Row actions are **dimmed, not hidden**, until hover: fully invisible actions are undiscoverable, and touch screens have no hover state to reveal them with. *(Superseded in part on 2026-09-14: below `lg` the grid is not a table at all but a list of cards, where the actions are shown outright.)*
- **2026-09-08** — Record-editing forms use a **two-column layout** (`components/admin/ui/FormLayout.tsx`): content in the wide column, settings — status, category, order, cover image — in a narrow aside, with a sticky action bar. Bilingual fields sit **side by side** (Arabic next to English) rather than behind language tabs, because the backend requires both languages on every write and a hidden tab is an easy one to forget.
- **2026-09-08** — Every admin field goes through `components/admin/ui/Field.tsx`, which owns the label, hint, error and the `aria-describedby`/`aria-invalid` wiring. The hand-rolled label/input/error trio it replaced was duplicated eleven times and never wired the error to its control.
- **2026-09-08** — Project images are **real file uploads**, not URL text fields: `FileDropzone` plus previews, with gallery order controlled by move buttons since the API derives `order` from attachment order. Object URLs are created and revoked in event handlers only — never during render — and a `useRef` Set releases whatever is still outstanding on unmount. Writing a ref during render is rejected by the `react-hooks/refs` rule.
- **2026-09-08** — Props are seeded into modal state with a **`key`** on the component (see `ChangeRoleModal` in `UsersTable`) rather than an effect that copies props into state, which `react-hooks/set-state-in-effect` rejects.
- **2026-09-08** — Admin types now mirror the backend exactly: `_id` (not `id`), `Project.category` as the **populated** category object rather than a `categoryId` string, `Category` with **no** `description` field, `AdminUser` with `firstName`/`lastName`/`imageUrl`/timestamps, and a `Paginated<T>` envelope in `types/Shared.ts`. Dashboard counts must read `pagination.total`, never `data.length`, which only ever holds one page.
- **2026-09-09** — **One concern per file** is now a hard rule, written up under "Where Code Lives". It was introduced because the admin panel had accumulated 62 types declared inside component files (30 of them in `components/admin/ui/` alone), 12 anonymous inline props objects, and 13 copies of two route-props shapes; both zod schemas lived inside their component's function body. The public site was already compliant, which is what made the drift obvious. Enforcement is a review habit, not a lint rule — nothing in ESLint checks this today.
- **2026-09-09** — Zod schemas are **factories**, not constants: `createProjectSchema(t, tCommon, isEdit)`. Error messages come from `useTranslations`, and the project's cover-image rule depends on whether the form is creating or editing, so a module-level constant cannot express either. Callers wrap the factory in `useMemo`; before this, the schema and its `zodResolver` were rebuilt on every keystroke.
- **2026-09-09** — Added `features/<name>/utils/` for feature-scoped pure helpers. `fullName()` had been living in `features/users/types/Users.ts` (which meant that "types" module could never be imported with `import type` alone) and `categoryById()` inside a constants file. `categoryById` now returns `undefined` for an unknown id instead of silently falling back to the first category.
- **2026-09-09** — `hooks/UseSidebarCollapsed.ts` and `constants/AdminNav.ts` were moved out of `components/admin/`, where a hook and a constants-plus-logic module had no business sitting. `constants/Admin.ts` now holds `ADMIN_PAGE_SIZE`, previously duplicated as a local `PAGE_SIZE` in all three tables.
- **2026-09-09** — `features/projects/constants/AdminProjects.ts` was flattened from a `seeds.map()` generator into literal data, per the rule that constants files hold data and not the logic that builds it.
- **2026-09-09** — Backend gained `GET /api/projects/:id` (merged into the existing single-record project route — a 24-hex-char param is looked up as an `_id`, anything else as a `slug`, same public/draft-visibility behavior as before) and `GET /api/categories/:id`, specifically so the admin edit pages have a real single-record fetch instead of scanning the whole cached list client-side. See the backend's own decisions log for the implementation.
- **2026-09-09** — The five-layer pattern (service → hook → `QueryKeys.ts`) is built for `projects`, `categories`, `users`, but **not yet called from any component** — that wiring is the deliberate next step, kept separate so this batch stays reviewable and behavior-neutral (`tsc`/`lint`/`build` all pass with zero change to any rendered page, since nothing new is imported yet).
- **2026-09-09** — Added `ListQueryParams` (`page`/`limit`/`q`) to `types/Shared.ts`; each feature's `*QueryParams` type intersects it with its own filters (`category`/`status` for projects, `role` for users) instead of redeclaring the three shared fields three times.
- **2026-09-09** — `buildProjectFormData()` (`features/projects/utils/Projects.ts`) and `buildCategoryPayload()` (`features/categories/utils/Categories.ts`) reassemble the form's flat `nameAr`/`nameEn`-split values into the shape each endpoint expects — JSON-stringified bilingual fields plus repeated `gallery` file keys for projects (multipart), a plain `{ name: { ar, en } }` object for categories (JSON). Kept out of the service files so the transform is independently reusable and testable.
- **2026-09-09** — Category `update`/`delete` mutations invalidate **both** `categoryKeys.all` and `projectKeys.all` — a project row renders its category as a populated object, so a rename or delete would otherwise sit stale in an already-cached project list.
- **2026-09-09** — `POST /api/users` (invite) returns a Clerk invitation object, not an `AdminUser` — the invited person has no app-database record until they accept. Typed separately as `InviteUserResult`, not reused against `AdminUser`.
- **2026-09-09** — Mutation `onSuccess`/`onError` toasts use plain hardcoded English strings (`"Project deleted successfully"`, `error.message` via `ApiError`), matching the pattern already written into this file's own five-layer example — not routed through `next-intl`. This is a deliberate, pre-existing exception to the "no string literal in JSX" i18n rule (Internationalization, Hard rule 1): these calls aren't JSX, and translating them would mean threading a translator into non-component hook files. Revisit if the admin panel ever needs to ship in more than `ar`/`en` chrome-wise.
- **2026-09-10** — Clerk (`@clerk/nextjs` + `@clerk/localizations`) wired in: sign-in, sign-up, a dedicated `accept-invitation` page, and a role-based redirect. Full design in "Auth & Roles (Clerk)". The backend's `GET /api/auth/me` was extended (by the backend owner, not from this repo) to return the caller's full profile plus role, specifically so the frontend never has to guess or repurpose an unrelated admin-only endpoint as a permission probe.
- **2026-09-10** — Role enforcement is split across two layers on purpose: `proxy.ts` (`clerkMiddleware()`) only checks "signed in?", cheaply, at the edge; `app/[locale]/admin/layout.tsx` checks the real `admin`/`super_admin` role, since that requires a request to the backend's database. Merging them into one edge check isn't possible without either duplicating the backend's role logic in the frontend or accepting a stale/cached role — neither acceptable given role changes must take effect immediately (`PATCH /api/users/:id/role`).
- **2026-09-10** — `getMyProfile()`'s response is a discriminated union on `synced` (`features/auth/types/Auth.ts`), not an error status code, because "the local `User` doc doesn't exist yet" is an expected, routine state (right after an invited user finishes sign-up, before Clerk's `user.created` webhook lands) rather than a failure. `admin/layout.tsx` retries once after 1.5s before falling back to `/` — enough for the common case without turning every sign-in into a guaranteed multi-second wait.
- **2026-09-10** — `window.Clerk` (Clerk's classic non-React token access pattern) turned out not to be ambiently typed by the installed `@clerk/nextjs`/`@clerk/react` versions. Rather than hand-writing an ambient `Window` augmentation, `lib/Api.ts`'s request interceptor reads the token from `lib/ClerkTokenBridge.ts`, populated by `components/shared/ClerkTokenSync.tsx` — a render-nothing client component mounted once inside `<ClerkProvider>` that registers `useAuth().getToken` on mount. More portable across Clerk SDK versions than depending on an internal global.
- **2026-09-10** — `accept-invitation` is a separate route from `sign-up`, even though both render `<SignUp>` under the hood (Clerk's ticket-based invitation flow *is* sign-up) — the invited-user copy ("You've been invited…") doesn't exist in Clerk's own default strings, and a distinct URL is what Clerk Dashboard's invitation redirect setting needs to point at. That dashboard setting is a manual step outside this repo, not something any code change here can do.
- **2026-09-10** — All three auth routes (`sign-in`, `sign-up`, `accept-invitation`) redirect to `/{locale}/admin` on success, never straight to `/` for a plain user — `admin/layout.tsx`'s gate is the only place that decides `admin`/`super_admin` vs. everyone else, so that decision isn't duplicated three times across the auth pages themselves.
- **2026-09-10** — Every route under `admin/` went from statically-generated (`●`) to dynamic (`ƒ`) in `next build`'s output once the role gate landed. Expected, not a regression — an authorization check that reads live session/database state cannot be pre-rendered at build time.
- **2026-09-10** — Clerk's prebuilt `<SignIn>`/`<SignUp>` (themed via `appearance`) were replaced with fully hand-built forms before ever being tried live — rejected on sight, on the same standing preference that ruled out shadcn for the admin panel: "بدي اعمل انا شي خاص فيني custome... بدي بعد عن شكل clerk التقليدي." Full design in "Auth & Roles (Clerk)". `lib/ClerkAppearance.ts` and the `@clerk/localizations` dependency were removed — nothing renders a Clerk-styled component to theme anymore.
- **2026-09-10** — Queried this Clerk instance's own public `/v1/environment` endpoint (decoded from the publishable key) rather than assuming a configuration: confirmed fully passwordless (email one-time-code + Google OAuth only, no password/username/phone/MFA) and that sign-up requires a Cloudflare Turnstile challenge. The hand-built forms only ask for what this instance actually needs — no dormant password field.
- **2026-09-10** — Auth views import `useSignIn`/`useSignUp` from **`@clerk/nextjs/legacy`**, not the bare `@clerk/nextjs`. The installed SDK's default export is an experimental signal-based "future" API with a materially different method surface (`signIn.emailCode.sendCode()`, `finalize()` instead of `setActive()`) — chose the classic, documented shape for a production auth flow over the newer one.
- **2026-09-10** — `features/auth/components/CodeInput.tsx` (six boxes) and `GoogleButton.tsx` (our own SVG + `Button`) are new, reusable across sign-in and sign-up. The auth route group also lost its catch-all segments (`[[...sign-in]]` → plain `sign-in/page.tsx`) — those existed only for Clerk's own internal step-routing, which a hand-built form doesn't need since it tracks its step as component state.
- **2026-09-10** — `app/[locale]/(auth)/sso-callback/` is the one route that still renders a Clerk component (`<AuthenticateWithRedirectCallback>`). Completing a Google OAuth redirect is an unavoidable full-page round trip; that component has no visual design to reject, only a handshake to finish — the same "headless logic is fine, themed widgets aren't" line that also keeps `useSignIn`/`useSignUp` themselves in bounds.
- **2026-09-10** — Clerk error handling centralized in `features/auth/utils/Auth.ts`: `clerkFieldError()` matches `ClerkAPIResponseError.errors[].meta.paramName` (untyped, checked at runtime) for inline `Field` errors; `clerkErrorMessage()` falls back to a `sonner` toast, mirroring the exact `ApiError`/toast pattern every mutation hook already uses.
- **2026-09-10** — `AcceptInvitationView` takes no props, unlike `SignInView`/`SignUpView` — the ticket strategy never offers Google as an alternative (identity is already established by the ticket), so it has no use for `locale` to build an OAuth redirect URL.
- **2026-09-10** — `components/admin/SignOutButton.tsx` is its own component rather than inlined into `AdminHeader`, since the header isn't the only place a signed-in admin's session will need to end — a future account menu or settings page is a likely second caller. Takes a `variant?: "icon" | "button"` prop for exactly that reason: `"icon"` fits the header's compact actions row (used today), `"button"` renders icon + label for a roomier spot. Calls `useClerk().signOut({ redirectUrl })` directly rather than routing through `lib/Api.ts`/`ClerkTokenBridge` — signing out is a client-only Clerk SDK action, not a backend request.
- **2026-09-10** — Correction to the earlier note about where an invitation email links to: checked the backend's installed `@clerk/backend` types directly rather than assuming — `CreateParams.redirectUrl` on `clerkClient.invitations.createInvitation()` is a documented **per-invitation code parameter** ("The full URL or path where the user will land after accepting the invitation"). There is no Clerk Dashboard setting for this at all. Moved to Known Issues / Cleanup Backlog as a real backend change, not an "operational step outside this repo."
- **2026-09-10** — Fixed a real bug found during live testing: `AcceptInvitationView`'s ticket-consuming effect used the usual "cancelled" cleanup-flag pattern, but a `signUp.create({ strategy: "ticket" })` call is a one-time, non-idempotent side effect — Clerk tickets are single-use. React's dev-mode Strict Mode fires an effect twice on mount (mount → cleanup → mount again, same component instance), and a cleanup-flag only stops the *first* call's result from being applied to state — it does nothing to stop the *second* call from actually firing and hitting Clerk with an already-consumed ticket, which then fails. Symptom: solving the CAPTCHA visibly "worked" (the request went out) but the page landed on the generic error state anyway. Fixed with a `useRef` guard keyed by the ticket's own string value (not a plain boolean) — refs survive Strict Mode's synthetic remount, so only the true first invocation ever calls `signUp.create()`. General lesson: a cleanup-flag guard is only safe for effects whose side effect is safe to fire twice (most data fetches); a truly one-shot/non-idempotent call (consuming a ticket, redeeming a code, incrementing something server-side) needs a ref-based "have I already done this" guard instead.
- **2026-09-14** — **`<Toaster />` had never been mounted.** The 2026-09-05 note above said it would go in with "the first real mutation"; that never happened, so every `toast.error()`/`toast.success()` in the app — all three auth views and all three mutation-hook families — was called and silently discarded. This is what a user reported as "nothing works at all, the button just spins and stays on the same page." `toast()` with no `<Toaster />` in the tree throws nothing and logs nothing, which makes it the most expensive kind of no-op: a failed call is visually identical to a dead button. Mounted once in `app/[locale]/layout.tsx`, themed from `app/globals.css`.
- **2026-09-14** — Diagnosed the above by driving a headless Chromium over the Chrome DevTools Protocol from a zero-dependency Node script (Node 22 ships a global `WebSocket`), capturing every console message and every network request during a real sign-in attempt, rather than asking the user to read their own DevTools. Worth repeating for any "it just doesn't work" report: it separated three *different* faults that all presented as the same silent button — a rejected `session_exists` error with nowhere to render, a Turnstile stall on sign-up that sent no request at all, and (ruled out) network reachability, which measured fine at ~450ms to Clerk.
- **2026-09-14** — The auth pages redirect an already-signed-in visitor to `/admin` (`auth()` + `redirect()` in `sign-in/page.tsx` and `sign-up/page.tsx`). In single-session mode Clerk rejects every sign-in/sign-up call from a live session with `session_exists`, so the form on those pages could not succeed for the one person most likely to be looking at them — a developer testing the panel, already logged in from a minute earlier. Server-side, so there is no flash of an unusable form.
- **2026-09-14** — `withTimeout()` wraps every awaited Clerk call in the auth views (30s), rejecting with a translated `AuthTimeoutError`. A Clerk promise can stall instead of rejecting — confirmed live: `signUp.create()` blocks on a Turnstile token and, when the widget never returns one, never issues a network request at all. `authenticateWithRedirect()` is excluded on purpose; that promise is supposed to never settle, since it navigates away. The timeout is the backstop, not the fix — the fix is that whatever it throws is now visible.
- **2026-09-14** — `clerkErrorMessage()` logs unrecognized (non-`ClerkAPIResponseError`) errors to the console in development before returning the generic fallback. It used to discard them entirely, which is how a distinctive failure got flattened into the same "something went wrong" string as everything else.
- **2026-09-14** — **Supersedes the 2026-09-10 note that `admin/layout.tsx` is the only place role is decided.** The decision itself now lives in one pure function, `landingPathForProfile()` (`features/auth/utils/Auth.ts`), and the admin gate plus the sign-in and sign-up pages all call it — so the rule "who counts as an admin" is still written exactly once, but more than one route can act on it. The reason for the change: redirecting every signed-in visitor to `/admin` and letting the gate bounce the non-admins back meant a plain user visibly passed through a panel that was never theirs, on two redirects instead of one. The retry-once fetch that used to be inlined in the gate moved to `getMyProfileWithRetry()` in `features/auth/services/Auth.ts` for the same reason.
- **2026-09-14** — `app/[locale]/error.tsx` and `app/[locale]/loading.tsx` are at the locale level, not inside `admin/`, and that placement is load-bearing rather than incidental: a segment's `error.tsx` only catches throws from the layouts **below** it, and its `loading.tsx` renders **inside** its own layout — so neither can cover `admin/layout.tsx`'s role check, which is exactly the await that can hang and the throw that can happen. A boundary inside `admin/` would never once have fired for the failure it was meant to catch. The tradeoff is that the locale-level `loading.tsx` also shows on public-site navigations, so its copy is a bare spinner; the "checking your account" wording lives in `sign-in/loading.tsx` and `sign-up/loading.tsx` instead.
- **2026-09-14** — The retry button in `app/[locale]/error.tsx` needs all three of `startTransition`, `router.refresh()` and `reset()` together, established by testing against a backend that was taken down and brought back: `reset()` alone re-renders the boundary against the RSC payload the client already holds, which is the same failure again; `router.refresh()` re-runs the server render but `reset()` fires first and re-throws the stale error before the new payload lands; the transition is what makes them commit together. With only the first two, the button looked like it did nothing — the same class of silent dead end as the sign-in button earlier the same day.
- **2026-09-14** — `accept-invitation` shows an "already signed in as {email}" card with a sign-out button instead of the invitation form when a session exists. In single-session mode the ticket would be rejected with `session_exists`, and an invitation link is very often opened by someone signed in as a different account. `SignOutButton` gained an optional `redirectUrl` so signing out returns to the invitation link itself, ticket and all, rather than dumping the visitor on the sign-in page to go hunt for an email they already opened. The route is now dynamic (`ƒ`) since it calls `auth()`, same as sign-in and sign-up.
- **2026-09-14** — Verified the role redirects end to end without touching the backend repo, by running a throwaway stub on `:5000` (the port `NEXT_PUBLIC_API_URL` already points at) that reported `admin`, `super_admin`, `user` and a `503` in turn, and driving the headless browser through `/ar/sign-in` and `/ar/sign-up` for each. Worth reaching for again: it proved all six redirect cases plus the gate and the retry recovery without editing a config, a fixture, or the backend.
- **2026-09-14** — **Categories are wired to the API**, the second feature to leave mock data behind. `CategoriesTable` dropped its `categories` prop for `useCategories({ page, limit, q })`, and — the part that matters — its search and paging moved to the server. The client-side `filter` it replaced only ever searched the page already on screen, so with more than ten categories it would have reported "no matches" for a category that plainly exists. `CategoryForm` swapped `category?: Category` for `categoryId?: string` to match `ProjectFormProps`, loading through `useCategory(id)` and hydrating once behind a `useRef` keyed by id. `features/categories/constants/Categories.ts` and `features/projects/constants/AdminProjects.ts` were deleted, and `categoryById()` with them — nothing looks a category up in memory anymore.
- **2026-09-14** — **Category toasts are translated; the rest of the admin panel's are not, yet.** This reverses the 2026-09-09 decision for this feature only. That decision's stated reason — "translating them would mean threading a translator into non-component hook files" — was simply wrong: a custom hook is a hook, so `useTranslations()` works inside `UseCategories.ts` exactly as it does in a component. Projects and users keep their English strings until their own turn, so the panel is briefly inconsistent on purpose.
- **2026-09-14** — `categoryErrorMessage()` maps the two backend failures a user hits by accident to explanations rather than codes: `CATEGORY_IN_USE` (deleting a category a project still points at) and `DUPLICATE_KEY` (a slug already taken — slug being the only unique field on a category, the code alone identifies it). Everything else falls back to the backend's **own** message, which names the failed rule and beats a blanket "something went wrong"; only a non-`ApiError` gets the generic line. A taken slug is additionally marked on the slug field via `form.setError`, since that is the field the user has to change — the same inline-plus-toast split the auth forms use.
- **2026-09-14** — Fixed the `react-hooks/refs` error that had been failing `npm run lint`: `ProjectForm`'s `<form onSubmit={form.handleSubmit(onSubmit)}>` built the handler **during render**, and `onSubmit` reads `liveUrls.current` through `releasePreview`. Handing a ref-reading function to a call that happens while rendering is exactly what the rule rejects. Deferring it — `onSubmit={(event) => form.handleSubmit(onSubmit)(event)}` — moves the ref access into the event handler where it belongs. Same fix applies to any form whose submit handler touches a ref.
- **2026-09-14** — Both record forms now catch around `mutateAsync`. The mutation hooks already report failures through their own toast, but the rejection `mutateAsync` re-throws escaped react-hook-form as an unhandled rejection, and the catch is also what stops a failed save from clearing the gallery or navigating to the list as though it had worked.
- **2026-09-14** — Verified against the running backend rather than a fixture: created, renamed and deleted real categories through the UI, confirmed the rename invalidated the cached project list, and confirmed both refusals show their Arabic explanation — deleting the category the one existing project uses, and reusing its slug. Test records were deleted afterwards and the project's `order` restored, so the database ended where it started.
- **2026-09-14** — `ProjectGalleryImage._id` is typed **optional**, even though the API sends it on every record it creates. A "unique key" warning was reported against `ProjectForm`'s gallery map, and while no record in the database could reproduce it (one project, three gallery items, all with `_id`), the only thing that produces that warning is an item without one — and the same gap silently breaks that image's delete button, which builds its URL as `.../gallery/${item._id}` and would request `.../gallery/undefined`. Typing it as required let both failures through unnoticed; optional forces the handling. The key now falls back to the Cloudinary URL, which is unique per upload, and the delete button is withheld for an item the endpoint can't address rather than offered and quietly doing nothing. Worth knowing for the backend side: `project.multipart.js` builds appended gallery entries as plain objects with no `_id`, relying on Mongoose to assign one while casting — which it does on this path, but anything that writes a gallery array directly (a seed script, Compass) would not.
- **2026-09-14** — **Cloudinary images bypass Next's image optimizer via a per-image loader** (`lib/CloudinaryLoader.ts`, passed as `loader={cloudinaryLoader}` on the four admin `<Image>`s that render Cloudinary URLs). Next hardcodes a 7-second cap on fetching a remote image — `AbortSignal.timeout(7000)` in `image-optimizer.js`, with no config option — and on this network the full-size original measured 374 KB in 9.0s, so the optimizer timed out and the image never appeared at all (`upstream image response timed out`). The loader rewrites the URL with `f_auto,q_auto,c_limit,w_<width>` so Cloudinary returns the size actually being rendered and the browser fetches it directly, no Next round trip and no cap. Measured on the same photo: 374 KB → 1.3 KB at the 48px table thumbnail, 2.8 KB at the 112px gallery thumbnail, 12.7 KB at the 304px cover preview. Resizing is what an image CDN is for; doing it twice was the bug.
- **2026-09-14** — A **per-image `loader` prop, not `images.loader: "custom"` in `next.config.mjs`**. The config option is global and would also intercept the public marketing site's local images, which are served fine by the default optimizer and have nothing to do with Cloudinary. The loader returns any non-`res.cloudinary.com` src untouched anyway, so it stays safe next to the blob-URL previews in `ProjectForm`, which are `unoptimized` and skip loaders entirely.
- **2026-09-14** — **Images are shrunk to 1920px and re-encoded to WebP in the browser before upload** (`compressImage` in `lib/Images.ts`, called from both pickers in `ProjectForm`). Prompted by a real failure, not a hunch: a cover-image save spent ~35 seconds writing to Cloudinary before the backend logged `write ECONNRESET` and returned 500, twice in a row. The frontend had no size handling at all — the zod schema only checked "is this a File" — so the original multi-megabyte photo went up untouched, on a link measured at roughly 75 KB/s. Verified end to end in the browser: a 1.16 MB 4032x3024 JPEG became a 204 KB 1920x1440 WebP. `imageOrientation: "from-image"` is passed to `createImageBitmap` so a portrait phone photo isn't re-encoded on its side, and every failure path (SVG, animated GIF, a decode error, a browser that can't encode WebP, a result larger than the original) returns the original file rather than throwing — refusing to upload a valid image because it couldn't be shrunk would be the worse outcome.
- **2026-09-14** — Both dropzones and the save button are disabled while `compressImage` runs (`preparingImages`). Encoding a large photo takes a moment, and without it a second pick could land mid-encode or a save could run off with a file that isn't ready — plus it would be another stretch of the UI silently doing work with nothing on screen to say so.
- **2026-09-14** — **Admin grids render as stacked cards below `lg`, not as a horizontally scrolling table.** `DataTable` used to force the table to `min-w-2xl` (672px) inside a `max-md:overflow-x-auto` box, so every grid on a phone was something you dragged sideways to read. Measured on a 390px viewport: that accounted for 194px of document overflow on its own (clipping it dropped `document.documentElement.scrollWidth` from 643 to 449). Each record is now a card — the first column as its header, the rest as label/value rows, actions along the bottom — so nothing scrolls and nothing is hidden. The desktop table is untouched.
- **2026-09-14** — The card/table switch is at **`lg`, not `md`**, because the sidebar takes 16rem before the table even starts: a 768px tablet leaves roughly 470px of content for columns that need ~670px, and the table overflowed there too (measured +198px on `/en/admin/users`). `lg` is the first width where the table genuinely fits beside the sidebar. `stickyOffset` and the sticky header moved to `lg:` to match.
- **2026-09-14** — `Column.hideOnMobile` was deleted, along with its five usages. It only ever existed to stop the cramped mobile table from bursting; the cards have room for every column, so hiding data on small screens stopped being a trade worth making — the category, order, role and joined-date columns are now visible on a phone for the first time.
- **2026-09-14** — Two smaller sources of the same horizontal scroll, both found by measurement rather than inspection: the **off-canvas mobile drawer** is parked with `rtl:translate-x-full` and nothing clipped it, so in Arabic it sat 288px past the right edge and widened every admin page (`overflow-hidden` on its fixed container fixes it, and does nothing once the drawer is open); and the **Tooltip bubble**, which is `absolute` but still occupies layout at `opacity-0`, ran past the viewport from the header's sign-out button. The bubble is now `max-md:hidden` — a touch screen has no hover, so it could never be shown there anyway — and the header instance opens inward via a new `side="start"`.
- **2026-09-14** — Worth keeping as a method: horizontal-overflow bugs were located by walking the DOM for elements whose `getBoundingClientRect().right` exceeded `clientWidth` while no ancestor clipped them, then confirming each suspect by neutralising it in the live page and re-reading `scrollWidth`. That is what separated the three independent causes here — and it also showed that the `fixed inset-0` overlays which *looked* like the culprits (they report the inflated width) were only reflecting the problem.
- **2026-09-15** — **Users are wired to the API**, the last feature to leave mock data; `features/users/constants/Users.ts` is deleted and the dashboard now has no placeholder tile (`UserStats` reads `pagination.total` the same way `CategoryStats` does). Search, the role filter and paging all moved to the server, for the same reason they did in categories: the in-memory `filter()` + `slice()` this replaced only ever looked at the page already on screen, so a teammate sitting on page two would be reported as "no matches".
- **2026-09-15** — **The users table has no status column**, and that is a consequence of the backend rather than a design preference: `listUsers` hardcodes `status: "active"` into its filter with no query parameter to override it, so the value would read "active" on every row forever and a deactivated account never appears at all. Deactivating someone is confirmed instead by their row leaving the list on the next fetch. `StatusBadge` keeps its `active`/`deactivated` tones — projects still use the component for `published`/`draft`, and the states are real even though this one list can't show them. Recorded in Known Issues with the exact backend change it would take.
- **2026-09-15** — **Who may manage users is decided on the server and passed down as two props**, `canManage` and `viewerId` (`app/[locale]/admin/users/page.tsx` → `UsersTable`/`UsersPageActions`). Reading the list is open to `admin`, but `POST /api/users`, `PATCH /api/users/:id/role` and `DELETE /api/users/:id` are all `super_admin`-only, so a plain admin would otherwise be handed three buttons that can only ever answer `403`. The page reads it from the same `GET /api/auth/me` the admin gate uses rather than adding a client-side profile hook — one more request on that one route, and no second source of truth about role. The controls are **disabled with a reason, not hidden** (the user's call): hiding them would leave an admin wondering where the invite button went.
- **2026-09-15** — The frontend also withholds those two row actions on the **viewer's own row**. The backend has no guard against a super admin demoting or deactivating themselves, and either one locks them out of the panel with no route back through the UI — `landingPathForProfile()` would send them home on the next request. This is the frontend enforcing something the API does not, which is normally the wrong shape, and it is recorded as such: it is a usability guard, not a security boundary, and the backend should grow its own check.
- **2026-09-15** — The disabled controls explain themselves in **two places, because one of them is invisible on a phone**: a `Tooltip` (which is `max-md:hidden`, since a touch screen has no hover) and a short always-visible line in the table toolbar's `trailing` slot when `canManage` is false. Without the second one, an admin on a phone meets three dead buttons and no reason at all.
- **2026-09-15** — `userErrorMessage()` maps `403 FORBIDDEN` and `404 USER_NOT_FOUND` to explanations and falls back to the backend's own message otherwise — deliberately including `502 CLERK_INVITE_FAILED`, whose message *is* Clerk's own long message ("That email address is taken", an invitation already pending) and names the actual reason better than anything generic. Same policy as `categoryErrorMessage()`, and the toasts are translated for the same reason: a custom hook is a hook, so `useTranslations()` works inside `UseUsers.ts`.
- **2026-09-15** — `InviteUserModal` sets **`noValidate`** on its form. `Modal` renders `footer` outside `children`, so the submit button reaches the form through the `form={id}` attribute — which keeps Enter-to-submit working, but also means the browser's own constraint check on `type="email"` fires first and blocks the submit with an untranslated native bubble, so the translated zod message under the field never got a chance to render. Caught live: an invalid address produced no request and no visible error at all. Any future modal form built this way needs the same attribute.
- **2026-09-15** — Verified against the running backend: the list, the debounced server-side search (`?q=`), the role filter (`?role=user` → the empty state) and the paging all measured at the network level; the invite form's two validation failures and the real Clerk refusal on an email that already has an account (`502`, dialog stays open, Clerk's own message in the toast). **Not exercised live**: the `admin`-but-not-`super_admin` read-only view and the change-role/deactivate mutations themselves — this Clerk instance has exactly one user, who is the viewer, so every row action is correctly disabled and there is no second account to act on. Testing them would have meant changing the only admin's role in the database, which is the one action that can lock the panel's owner out of it.
- **2026-09-15** — **The public site's 27px horizontal scroll was the `x: 50` entry animation, not the navigation drawer** — and the guess previously written into Known Issues was wrong, which is worth recording as much as the fix. `About`'s text column and `Contact`'s two columns animate in from a horizontal offset (`hidden: { opacity: 0, x: 50 }`, and `x: -50` for the contact form). Until a section scrolls into view it sits at that offset, so on a 390px viewport the column's right edge lands at 416 instead of 366 — 26px past the edge, `scrollWidth` 417. The fix is `overflow-x-clip` on those two sections: the shifted part is off-screen either way, so the animation looks identical and only the document stops growing.
- **2026-09-15** — **Why only the English pages measured as broken, with identical geometry in both.** Both locales place the column at exactly `left=74 right=416` with the same `translateX(50px)` — measured, not inferred. In LTR the right edge is the inline **end**, and overflow past the end extends `scrollWidth`; in RTL the right edge is the inline **start**, and browsers do not count start-side overflow (the same reason a negative `left` never widens an LTR page). So a horizontal entry animation is a one-sided bug: `x: 50` can only ever be caught on an LTR page, and `x: -50` only on an RTL one. Worth remembering before trusting a single-locale measurement — `/ar` being clean said nothing about `/en`.
- **2026-09-15** — `NavigationOverlay` got the same `overflow-hidden` its admin twin already had, as insurance rather than a fix: it isn't biting today because in LTR the closed drawer parks at a negative offset, which no browser counts. Measured before and after — the page total was 390 either way. The gap is real though: flip the direction, or park the panel the other way, and it becomes `AdminMobileSidebar`'s 288px bug.
- **2026-09-15** — Measuring the public site had to go through the dev server's **LAN address** rather than `localhost`, because a Cursor helper process holds `127.0.0.1:3000`/`::1:3000` and resets every connection (diagnosed the same day — it is also what made the sign-in button spin forever, since Clerk's SDK could never load). One consequence to know for next time: on a non-`localhost` origin this Clerk dev instance never finishes loading, `<ClerkProvider>` never resolves, and **the entire client tree below it stays unhydrated** — no `whileInView`, no working navigation drawer, no scroll-reactive header. That looks alarming and is purely an artifact of the origin. It also makes the measurement *stricter*, not weaker: every entry animation stays frozen at its `hidden` offset, which is the worst case for horizontal overflow. The settled state was checked separately by forcing the visible values (content spans 24..366, `scrollWidth` 390).
- **2026-09-16** — **The public projects section is wired to the API, and the two-shapes problem is resolved: there is now one `Project` type.** The hand-written mock (`features/projects/constants/Projects.ts`, with `id: number`, `title`, `year`, `tags`, `color`, `link`) is deleted and `AdminProject` was renamed to plain `Project` — the name was only ever qualified because a different `Project` sat next to it, and the public components had no business importing a type called "Admin…". Of the three fields the backend has no equivalent for: `tags` is replaced by the single **category** badge (which is also what the archive filters on, so the two reinforce each other), `link` by the real `links[]` on the detail page, and `year`/`color` are dropped outright — `createdAt` was offered and turned down, since it records when a project was added to the site rather than when it was built.
- **2026-09-16** — The public projects feature is **three surfaces on one data layer**: the home teaser (`useProjects({ page: 1, limit: 6 })`, plus a "view more" button that only renders when `pagination.total > 6`), the archive at `/projects` (`ProjectsBrowser` — category tabs over `useInfiniteProjects`, 24 per batch), and `/projects/[slug]`. Only one thing had to be added to the data layer: `useInfiniteProjects` + a separate `projectKeys.infinite` key. The key is deliberately *not* shared with `list` — an infinite query stores `{ pages, pageParams }` under its key rather than a single page, so sharing would hand one shape to code expecting the other. Both still start with `"projects"`, so the existing `invalidateQueries({ queryKey: projectKeys.all })` in every mutation still refreshes them.
- **2026-09-16** — Tab switching on the archive changes **the request**, not a filter over data already held — `?category=<id>` goes to the API, exactly as the admin tables do. Verified at the network level: clicking the second tab fired `?limit=24&category=6aa9…4784&page=1` and narrowed nine cards to four. The alternative (fetch everything, filter in memory) is the same bug that was removed from `CategoriesTable` and `UsersTable`: it silently hides every record sitting on a later page.
- **2026-09-16** — `/projects/[slug]` is a **Server Component**, so `generateMetadata` can title the page with the project's own name and description — a shared link shows the project, not the site's generic title. It calls `getProjectById(slug)` directly (the endpoint is public and matches a slug as readily as an id, so no token and no client hook), wrapped in React's `cache()` because `generateMetadata` and the page body both need the record and axios is not deduplicated the way `fetch` is. A `404` from the backend becomes `notFound()`; anything else is re-thrown to the error boundary, so an unreachable backend never renders as "this project doesn't exist".
- **2026-09-16** — `features/hosting/components/HostingHero.tsx` became `components/shared/PageHero.tsx` (props to `types/Shared.ts`). It renders a badge, a title and a line of copy — nothing hosting-specific — and the projects archive needed the same header, which by this file's own rule (used by two or more features ⇒ it lives at the root) makes `features/hosting/` the wrong home for it.
- **2026-09-16** — The new card is **the whole card as one link**, with the cover image full-bleed and the category badge plus the project name over a bottom gradient. The previous card nested a `<Button asChild><a>` inside its body pointing at a hardcoded external URL — invalid-ish markup (two targets for one destination) and a field the API does not have. Two contrast details were fixed after looking at real screenshots rather than assuming: the gradient's `via` stop moved to 40% and the badge took a solid `bg-black/60` instead of the usual `bg-primary/15` tint, because a translucent tint takes the colour of whatever is behind it and a cover shot of a bright screenshot left the badge sitting on almost-white.
- **2026-09-16** — Verified end to end against the real backend after seeding test records through the API (the database was empty): six cards on the home page and the "view more" button, the archive's tabs filtering server-side, the detail page's cover/description/links/gallery/related sections, `<title>` taken from the record, an unknown slug landing on the not-found page, and 24/24 horizontal-overflow checks passing across `/`, `/projects` and a detail page in both locales at 360/390/768/1280. **Not exercised**: the "load more" button itself, which needs more than 24 published projects — with nine it correctly does not render, since `getNextPageParam` returns `undefined` on the last page.
- **2026-09-16** — Worth knowing before the next round of live testing: a **Cursor helper process grabs `127.0.0.1:3000`** whenever it is free and answers requests with a stale copy of the site. That is what made a freshly-added route 404 and an already-fixed overflow bug appear to come back — both "impossible" symptoms, both explained by the page never having come from the dev server at all. Check `Get-NetTCPConnection -LocalPort 3000` before believing a result on `localhost:3000`.
- **2026-09-16** — **The two public projects pages use the home page's frame, not the hosting pages'.** `/projects` and `/projects/[slug]` both render `relative w-full overflow-x-clip px-6 py-16 md:py-24` wrapping `relative z-10 mx-auto max-w-6xl` — measured identical to `#services` and the footer (96px vertical padding, 24px side padding, a 1152px inner column). Three things were wrong before: the archive inherited `max-w-7xl` from `/hosting/vps`, which it was first modelled on; the detail page was `max-w-4xl`, narrower than anything else on the site, so moving from the list to a project visibly jumped the content width; and both repeated `bg-[#0D0D0E]`, which `<body>` already paints. The hosting pages keep their wider `max-w-7xl` — that difference is now deliberate rather than accidental. A pleasant side effect: the detail page's "related projects" row uses the same `ProjectList` as the home page, so at 6xl its three cards finally match the cards everywhere else exactly.
- **2026-09-16** — The home page's "view more" button is a deliberate copy of the VPS section's (`variant="default"` plus an `ArrowLeft` carrying `ltr:rotate-180`), because the two do the same job — leaving a trimmed section on the home page for the full listing — and an `outline` button next to a filled one read as a weaker, different kind of action. The archive's "load more" stays `outline` on purpose: it is a secondary action *within* a page, not navigation out of one.
- **2026-09-17** — **The three admin grids share their plumbing through two hooks and one component**, after the duplication was noticed in the projects and categories tables (it was in all three). `hooks/UseListControls.ts` owns search + its 300ms debounce, `page`, `limit` and the filters, and returns the `params` object to hand straight to the feature's query hook; `components/admin/ui/TableState.tsx` owns the loading skeleton and the `ApiError` message; `hooks/UseConfirmedAction.ts` owns the record a confirmation dialog is asking about. The tables keep everything that is actually theirs — columns, filter options, copy, row actions.
- **2026-09-17** — **`useListControls` owns the filters rather than just search and paging, and that is the whole point.** The narrower version would have lifted the easy lines and left the part that actually goes wrong: every filter's `onChange` had to remember `setPage(1)` by hand (four hand-written sites), and forgetting it strands a user on page 3 reading "no results" for a filter whose matches are all on page 1. `setFilter` and `setLimit` reset the page themselves, so the mistake is no longer available to make. The second duplicated thing worth centralising was the `...(x !== "" ? { x } : {})` params idiom — `""` is the UI's "no filter", but the API needs the key *absent*, since `?status=` fails its validation rather than matching everything. `ActiveFilters<TFilters>` (`types/Admin.ts`) mirrors that in the type system with `Exclude<TFilters[K], "">`, which is what lets `list.params` drop straight into `useProjects` with `status?: ProjectStatus` rather than `string`.
- **2026-09-17** — The public `ProjectsBrowser` deliberately does **not** use `useListControls`. It has one category tab and runs on `useInfiniteQuery` with no search, page or limit — it shares the vocabulary and none of the behaviour, and forcing it in would have distorted both. Three real call sites justified the generic; a fourth that only half fits would not.
- **2026-09-17** — `useConfirmedAction` takes its mutation as a **structural** `{ mutate, isPending }` rather than TanStack's `UseMutationResult<…>`, so it states the two things it uses instead of inheriting four generic parameters it ignores. It exists for two rules that had been hand-written (and hand-written slightly differently) in each table: the dialog cannot be dismissed while the mutation is in flight, and it closes on success only — a refusal stays on screen next to the toast explaining it. It serves the users table's deactivate `Modal` too, which has different copy but the same wiring.
- **2026-09-17** — Verified as a **behaviour-preserving** refactor rather than by eye: a script drove a fixed sequence through all three tables (load, search, clear, each filter, paging) and recorded every resulting API URL in order, once before the change and once after. The two transcripts are byte-identical. The page-reset guarantee was then proved separately by seeding past one page: on page 2, changing a filter, the rows-per-page or the search each produced a request carrying `page=1`. The error state was proved by failing the list request at the protocol level (`Fetch.failRequest`) rather than by taking the backend down, and the dialog rules by failing just the `DELETE` — the dialog stayed open, then closed when the retry succeeded.
- **2026-09-17** — **A draft project was showing in the public list while its own detail page answered 404**, and the two halves of that contradiction had different causes that only look like one bug together. The backend's `canSeeDrafts(req)` (`project.controller.js`) keeps the project routes public but adds drafts back in whenever the request happens to carry an `admin`/`super_admin` session — deliberate on that side. Meanwhile `lib/Api.ts` attaches the Clerk token to *every* browser request, and the public site's list components are client components using the same axios instance, so their requests went out signed. The detail page fetches from a Server Component, where `getClerkToken()` returns `null`, so it went out anonymous and the draft was correctly hidden. Signed list, anonymous detail — hence a card that promised a page and delivered a 404. Fixed by passing `status: "published"` from the three public call sites; the backend honours it for an admin caller and forces it for everyone else, so both now get the same answer.
- **2026-09-17** — **Drafts are hidden from the public site even for the admin who wrote them**, which was asked about rather than assumed. They were never a preview feature — their visibility was a side effect of the token, and no code anywhere treated a draft specially on the public site. It was also broken as it stood, since the card's link 404'd. The deciding reason is that an admin browsing the public site has to be able to trust that they are seeing what a visitor sees; a draft card showing there reads as published. Preview belongs to the admin panel, which shows drafts with a status badge and the full record in the edit form — and the backend's `canSeeDrafts` rule is what makes that work, so it stays.
- **2026-09-17** — Measured rather than assumed, both before and after: signed in as the admin, `/ar/projects` listed **12** cards while an unauthenticated `GET /api/projects` reported **11** — the difference being exactly the one draft. After the fix the signed-in admin and a browser with no session both show 6 on the home page and 11 in the archive, with the request carrying `status=published`, and the category tabs still filter (`?category=…&status=published`). The admin table is untouched and still lists the draft.
- **2026-09-23** — **`features/account/` is the first feature whose data does not come from `lib/Api.ts`, and that is a deliberate exception to the five-layer pattern rather than an oversight.** A profile photo, a display name and the list of signed-in devices live in Clerk, so steps 1-3 of the pattern (shared error handler → axios instance → service) have no subject: there is nothing to write a `services/Account.ts` for. TanStack Query is kept anyway — `QueryProvider` is already mounted in the admin layout, and it supplies the loading/error states, the refetch and the invalidate-after-mutation that every other panel in the section gets for free. Only the *source* changes; the hook still lives at `features/account/hooks/UseAccount.ts` and components still call it rather than the SDK.
- **2026-09-23** — **The sessions query sets `structuralSharing: false`.** The cached items are Clerk resource instances carrying a live `revoke()` method, and `useRevokeSession` reads one straight back out of the cache to call it. Structural sharing exists to recycle plain data objects between refetches; handing it class instances with behaviour attached is asking for a subtle failure where the revoke button stops working after a background refetch. Turning it off costs a re-render on a list that is never more than a handful of rows.
- **2026-09-23** — `useRevokeSession` takes a session **id** rather than the resource, purely so it satisfies `ConfirmableMutation` (`types/Admin.ts`) and `useConfirmedAction` can drive its confirm dialog unchanged — the same hook, and the same two rules (no dismiss mid-flight, close on success only), that the users table's deactivate uses. The resource is looked up from the query cache inside `mutationFn`, which is the second reason structural sharing is off.
- **2026-09-23** — **`useReverification` is deliberately not wired around the revoke call**, even though the installed SDK exports it. Its default behaviour renders Clerk's own modal, which is precisely the kind of UI this project has now rejected twice (shadcn for the admin panel, then `<SignIn>`/`<SignUp>` for auth). It does offer `onNeedsReverification` to opt out of that UI, but taking it means building a whole verification step for a requirement this instance has not been shown to have. So `session.revoke()` is called directly and a reverification hint surfaces through `clerkErrorMessage()` like any other Clerk failure. If it ever does come up, `features/auth/components/CodeInput.tsx` already exists and the step is small.
- **2026-09-23** — **Clerk's resource types are derived from `useUser`, not imported from `@clerk/shared`.** `UserResource` and `SessionWithActivitiesResource` are only exported from `@clerk/shared`, which is a transitive dependency of `@clerk/nextjs` and is not in `package.json` — importing from it directly would repeat the `framer-motion` mistake recorded on 2026-09-05. `features/account/types/Account.ts` instead writes `NonNullable<ReturnType<typeof useUser>["user"]>` and `Awaited<ReturnType<ClerkUser["getSessions"]>>[number]`, which pins the types to the exact SDK surface this feature calls and keeps the dependency graph honest.
- **2026-09-23** — Avatar compression reuses `compressImage()` from `lib/Images.ts` but at **`maxEdge: 512`** rather than the 1920 default, since the largest an avatar ever renders here is 96px — and it runs **inside** the mutation rather than behind a separate `preparing` flag, so `isPending` covers the encode and the upload together. `ProjectForm` needs the separate flag because it has two independent pickers and a save button that must not run off with a file mid-encode; a single avatar button has no such window to leave open.
- **2026-09-23** — **`AdminHeader`'s avatar is finally the real signed-in admin's, and is now the link to `/admin/account`.** It had been `<Avatar name={t("profile")} icon={UserRound} />` with a comment saying the wiring was "a separate step". `imageUrl` is passed unconditionally: Clerk serves its own generated avatar when nothing has been uploaded, so `Avatar`'s initials fallback is never reached on this path — the user's call, and it matches what `UsersTable` already shows from the synced `imageUrl` in our own database. The "remove photo" button on the account page is therefore gated on `user.hasImage`, which is false exactly when Clerk is serving that generated image and there is nothing to remove.
- **2026-09-23** — The account page splits its data by **what can change from it**: the photo and name come from `useUser()` in a client panel so they update the instant a save lands, while email, role and status are read once on the server from the same `GET /api/auth/me` the admin gate uses and passed down as props. Reading the second group client-side would have meant a second request on that route and a second source of truth about role; rendering the first group server-side would have left it stale until a refresh.
- **2026-09-23** — Revoking a session is **not instant on the other device**, and the panel says so in a line under the list. Clerk invalidates the session immediately, but the other browser only finds out when it next refreshes its token — roughly a minute — and the same applies to our own backend, which verifies the JWT locally and keeps accepting the old one until it expires. Without that line the button looks like it did nothing, which is this codebase's most expensive failure mode (see the missing `<Toaster />` on 2026-09-14).
- **2026-09-23** — `clerkErrorMessage()` is imported into `features/account/` from `features/auth/utils/Auth.ts` — a cross-feature import, and a small deviation from the "shared by two or more ⇒ move it to the root" rule. Left in place because the file is cohesive around Clerk error shapes as a whole and the account page is auth-adjacent. **If a third caller appears, it moves to `lib/ClerkErrors.ts`.**
- **2026-09-23** — "Last active" uses `useNow({ updateInterval: 60_000 })` and passes the result to `format.relativeTime(date, now)`. Not decoration: next-intl logs `IntlError: ENVIRONMENT_FALLBACK` on **every render** when `now` is omitted, which is what the dev overlay's "1 Issue" badge was reporting on this page and nowhere else. The clock is owned by `AccountSessionsPanel` and passed down as a prop so the whole list ticks off one timer rather than one per card, and the side benefit is that "3 minutes ago" actually advances while the page sits open.
- **2026-09-24** — **`components/admin/ui/` became `components/kit/`, and `types/AdminUi.ts` became `types/Kit.ts`** — a move, not a redesign: same eighteen files, same names, imports rewritten (~100 lines across ~30 files), nothing rendered differently. The name had been wrong for a while: the sign-in, sign-up and invitation views, `GoogleButton` and `ErrorScreen` were already importing "admin" components, and the order modal and the customer's "my requests" page were about to. The historical entries above keep the old path, since that is where the files were at the time. `tsc`, `lint` and `build` were run as a gate before anything else in the round was touched.
- **2026-09-24** — **Requests, customer side.** "Order this server" on `ProductCard` no longer links to the contact form (which lost which server had been picked); it opens `RequestModal`, owned by `Products` — one modal per list, because `Modal` stays mounted while closed. The open product is *derived*: the one just clicked, otherwise the one named by `?order=`, looked up among every product rather than just those displayed after `limit`. A visitor sees the product and a sign-in button whose `returnTo` is this page plus `?order=`, so they come back to the same modal. Only `base_price` is sent (as `productPrice`) — the price the card shows; `your_price` never leaves the browser and `productBasePrice` is omitted. Verified live: the payload for `0944 123 456` with Syria selected was `+963944123456`, with no empty `notes`.
- **2026-09-24** — **`?returnTo=` threads through sign-in and sign-up**, validated once by `safeReturnTo()` on the server page. Without it the order flow was broken by construction: every auth view did `router.push("/admin")`, so a customer who signed in to finish an order was bounced by the admin gate to the home page, product forgotten. Tested with `//evil.com`, `https://evil.com` and a backslash variant — all dropped.
- **2026-09-24** — The types are named **`PlanRequest`**, not `Request`: `Request` is the global `fetch` type in browsers and Node, and a local type by that name silently shadows it in any file that imports both.
- **2026-09-24** — **`429` from `POST /api/requests` is matched on the status, not a code.** The per-account limiter is express-rate-limit with its default handler, which answers in plain text rather than the API's JSON envelope, so the `ApiError` arrives with no `code`. **`409 ACCOUNT_NOT_SYNCED` is retried once, silently, after 1.5s** inside `mutationFn` — the gap it describes (Clerk's `user.created` webhook not yet landed) is most likely exactly when someone signs up in order to place a request. A `400` whose message starts with `phone:` is marked on the phone field as well as toasted. All three were exercised by fulfilling the request at the protocol level (`Fetch.fulfillRequest`), not by breaking the backend: the 409 case sent exactly two requests.
- **2026-09-24** — **Country names come from `Intl.DisplayNames`**, so `constants/Countries.ts` is just ISO codes and dial codes (222 entries, Syria pinned first) and `messages/` carries no country names. The client-side phone check is deliberately loose (6-14 digits after stripping formatting and a leading `0`); the backend's libphonenumber check is the authority. A U+200E mark precedes the `+` in each option label — without it, `(+963)` rendered as `(963+)` inside Arabic text.
- **2026-09-24** — The order modal alone gets `max-h-full overflow-y-auto`: it is the tallest dialog on the site, and on a 375×600 screen `Modal` clipped it top and bottom with nothing to scroll (measured: 690px of content in a 566px panel). Scoped to this dialog rather than changed in the kit, where every other dialog fits.
- **2026-09-24** — **The customer area lives inside the public site's frame** (`(site)/account/`, so the navbar and footer stay) and uses the kit for its content. `proxy.ts` protects it; there is no role gate, because every account may have one. `/account/requests` redirects an admin to `/admin/requests` — see Known Issues for why. The navbar's `AccountEntry` shows a sign-in link to a visitor and the avatar to anyone signed in, always pointing at the customer area and never needing to know a role.
- **2026-09-24** — **A `proxy.ts` matcher that silently matched nothing.** Rewriting the file from a shell heredoc turned the matcher's `\\.` into `\.`, so the pattern excluded every path, the proxy never ran, and every `auth()` call threw "Clerk can't detect usage of clerkMiddleware()" — while `tsc`, `lint` and `build` all passed. Caught only because an anonymous request to `/ar/account/requests` answered `200` instead of redirecting. Worth remembering: a broken matcher is invisible to every static check this project has; an anonymous request to a protected route is the test.
- **2026-09-24** — Verified the customer's list as a plain `user` with the 2026-09-14 method — a throwaway stub on `:5000` reporting `role: "user"` and 13 requests — since the only real account is an admin: 10 rows then 3 on page 2 (`?page=2&limit=10` at the network level), the empty state with its link to `/hosting/vps`, cards on a 390px screen with no horizontal overflow, and the English locale. The real backend was restarted afterwards. One real request was also submitted end to end (`201`, toast, modal closed, `?order` removed); it is still in the database (notes "QA test, safe to delete") since the API has no delete.
- **2026-09-24** — **The public navbar was slimmed down**, at the user's request ("too crowded"). Links went from six to five — "home" (the logo already is one) and "pricing" were dropped, "our work" → `/projects` was added — and they now live once, as `siteNavLinks` in `constants/Site.ts`, instead of in two copies (`Navbar` and `NavigationOverlay`). The "contact us" button is gone ("contact" is a link); its place is taken by a filled "sign in" button for a visitor and an avatar menu once signed in. The language button became a two-letter code (`EN` / `AR`) with an icon through a new `LocaleSwitcher` `compact` prop — only the public navbar passes it, so the admin header, the auth shell and the mobile drawer keep "English"/"العربية" in full. `nav.home`, `nav.pricing` and `nav.cta` were removed from `messages/` since nothing reads them anymore.
- **2026-09-24** — **`AccountMenu` is our own menu button**, following the ARIA pattern rather than a library: `aria-haspopup`/`aria-expanded`/`aria-controls` on the avatar, focus to the first item on open, arrow keys (wrapping), Home/End, Escape and outside clicks to close with focus handed back, Tab closes without stealing focus. It opens with `inset-e-0`, i.e. back into the page from the bar's edge in both directions — measured with the menu open at 768/1024/1280 in both locales, no horizontal overflow. Sign-out reuses `SignOutButton` through a new `menuItem` variant, so the `signOut` call still exists once. The mobile drawer does not use the menu: it has the room for an avatar row plus a sign-out button.
- **2026-09-24** — **The stray ▲▬▼ beside the account area's tab was a vertical scrollbar**, not a horizontal one. `overflow-x-auto` makes the browser compute the other axis as `auto` too, and the active tab's `-mb-px` (so its underline sits on the strip's border) overflows that axis by exactly one pixel — measured `scrollHeight` 42 vs `clientHeight` 41. `overflow-y-hidden` is the fix; a new `no-scrollbar` utility (`@utility` in `app/globals.css`) also hides the horizontal bar on that strip. The projects archive's category strip got `overflow-y-hidden` only: its horizontal bar is the one hint that more categories exist. Worth knowing: the running dev server did not pick up the new `@utility` until it was restarted on a clean `.next` — the production build had it from the start.
- **2026-09-24** — **The team's requests queue** replaced the `/admin/requests` placeholder. It opens on `status=pending` — the work still to do — and the status filter goes to the API like every admin grid. **There is no search box**: `GET /api/requests` takes no `q`, and a client-side search over the page on screen is the exact bug removed from the categories and users tables. An empty "pending" view says everyone has been contacted rather than "no matches", since that is the good outcome.
- **2026-09-24** — **"Mark contacted" asks first and only goes one way** (the user's call). The panel never sends `pending`, so a mis-click would take a customer nobody has called out of the queue with no way back through the UI — hence the confirmation, driven by `useConfirmedAction` like delete and deactivate (no dismiss mid-flight, close on success only; verified by failing the `PATCH` with `Fetch.fulfillRequest` — the dialog stayed open with the toast, then closed on the real retry). From the details dialog it closes that dialog and opens the confirmation in its place rather than stacking two.
- **2026-09-24** — The details dialog opens from the eye button and from the customer's name, **not from a click anywhere on the row**: that would be a change to the shared `DataTable`, and a row carrying a `tel:` link and two buttons would fight it for every click.
- **2026-09-24** — **`usePendingRequestsCount` is the one query in the panel that polls** (`refetchInterval: 60_000`). A new request arrives from a customer, not from anything the admin does, so no mutation would ever invalidate it; everything else in the panel changes only through the panel. The sidebar badge and the dashboard tile share its key, so they cost one request between them, and `useMarkContacted` invalidating `requestKeys.all` updates the table, the badge and the tile together. The badge renders nothing at zero and becomes a dot on the collapsed rail.
- **2026-09-24** — The badge is a `key === "requests"` check inside `AdminNavLinks`, **not a field on `AdminNavItem`**: one entry has a count, and a generic "badge" slot on the nav type would be an abstraction with a single user. If a second section ever needs one, that is when it moves into the type.
- **2026-09-24** — The WhatsApp link is `https://wa.me/<digits>` built from the stored E.164 number — the backend already normalised it, so nothing is reshaped. It sits next to `tel:` and copy because in Syria most of these follow-ups happen on WhatsApp. Verified live: `+963944123456` → `tel:+963944123456` and `https://wa.me/963944123456`.
