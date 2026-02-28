import { withAuth } from 'next-auth/middleware';

export const middleware = withAuth(
  function middleware(req) {
    return undefined;
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: '/auth/login',
    },
  }
);

// Protect routes that require authentication
// Dashboard and profile routes require users to exist, but onboarding must be completed separately
export const config = {
  matcher: ['/dashboard/:path*', '/profile/:path*', '/onboarding/:path*', '/recommendations/:path*'],
};
