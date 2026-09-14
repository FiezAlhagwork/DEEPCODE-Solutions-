/**
 * Lets `lib/Api.ts`'s axios request interceptor reach the signed-in user's
 * Clerk session token, even though an interceptor isn't a React component and
 * can't call `useAuth()` itself.
 *
 * `window.Clerk` (Clerk's older non-React access pattern) isn't ambiently
 * typed by the installed `@clerk/nextjs`/`@clerk/react` versions, so instead
 * a client component (`components/shared/ClerkTokenSync.tsx`) mounted once
 * near the app root registers its own `useAuth().getToken` here on mount.
 * `tokenGetter` stays `null` on the server (that component never runs there)
 * and briefly on a cold client render before it mounts — both cases just
 * mean the request goes out unauthenticated, same as being signed out.
 */
type TokenGetter = () => Promise<string | null>;

let tokenGetter: TokenGetter | null = null;

export const setClerkTokenGetter = (getter: TokenGetter | null) => {
  tokenGetter = getter;
};

export const getClerkToken = (): Promise<string | null> =>
  tokenGetter ? tokenGetter() : Promise.resolve(null);
